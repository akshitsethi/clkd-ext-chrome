// page/page.js
import confetti from "canvas-confetti";
import stickybits from "stickybits";
import { Events } from "./events.js";
import { Selectors } from "./selectors.js";
import { Store } from "../store.js"
import { Notification } from "../notification.js";
import { Processing } from "../processing.js";
import { i18n } from "../i18n.js";
import { Content } from "./content.js";
import { Design } from "./design.js";
import { Settings } from "./settings.js";
import { Frame } from "./frame.js";
import { apiBase, blankPageData, defaultPageOptions } from "../constants.js";
import { getCurrentTab } from "../helper.js";

export const Page = {
    constants: {
        HEADER_CLASSNAME: 'header',
        MENU_CLASSNAME: '.header-tabs',
        WRAPPER_CLASSNAME: '.wrapper',
        SCREEN: {
            error: '.error-screen',
            unauthenticated: '.unauthenticated-screen'
        }
    },
    SLUG: null,
    DOMAIN: null,
    UNSAVED_CHANGES: false,
    DATA: {
        order: new Map(),
        content: {},
        design: {},
        settings: {},
        social: {
            order: new Map(),
            content: {}
        },
        providers: {}
    },
    get: function(attribute, id = null, subId = null) {
        if (id !== null || subId !== null) {
            return subId !== null ? this.DATA[attribute][id][subId] : this.DATA[attribute][id];
        }

        return this.DATA[attribute];
    },
    set: function(attribute, value, id = null, subId = null, field = null) {
        if (id !== null) {
            if (subId !== null) {
                if (field !== null) {
                    this.DATA[attribute][id][subId][field] = value;
                } else {
                    this.DATA[attribute][id][subId] = value;
                }
            } else {
                this.DATA[attribute][id] = value;
            }
        } else {
            this.DATA[attribute] = value;
        }
    },
    remove: function(attribute, id, subId = null) {
        if (subId !== null) {
            if (this.DATA[attribute][id] instanceof Map) {
                this.DATA[attribute][id].delete(subId);
            } else {
                delete this.DATA[attribute][id][subId];
            }
        } else {
            if (this.DATA[attribute] instanceof Map) {
                this.DATA[attribute].delete(id);
            } else {
                delete this.DATA[attribute][id];
            }
        }
    },
    save: async function() {
        // Start with an empty object
        const data = {};

        // Add data with unique identifier
        data[`${this.SLUG}|${this.DOMAIN}`] = JSON.stringify(
            {
                order: Array.from(this.get('order').entries()),
                content: this.get('content'),
                design: this.get('design'),
                settings: this.get('settings'),
                social: {
                    order: Array.from(this.get('social', 'order').entries()),
                    content: this.get('social', 'content')
                },
                providers: this.get('providers')
            }
        );

        // Store updated data object
        await Store.set(data, 'session');

        // Whenever data is saved, we set the `UNSAVED_CHANGES` attribute to true
        this.UNSAVED_CHANGES = true;

        // After data is saved, update preview to reflect changes
        this.preview();
    },
    preview: function() {
        if (!Selectors.PREVIEW_FRAME) return;

        Selectors.PREVIEW_FRAME.src = Selectors.PREVIEW_FRAME.src;
    },
    updateDOM: async function() {
        // Set essential constants (slug and domain)
        this.setSlugAndDomain();

        // Initialise store
        await Store.init();

        // Verify credentials and fetch data from server (if required)
        await this.authAndPermissions();

        // Get data stored previously or fetched recently from the remote server
        await this.getStoredData();

        // Validate locally stored data
        this.validateData();

        // Inject slug, domain and url details
        await this.injectSlugDomainDetails();

        // Render existing data on screen
        this.render();

        // Switch to last active tab
        this.switchToSavedTab();

        // Make design screen visible
        document.querySelector(this.constants.HEADER_CLASSNAME).style.display = 'block';
        document.querySelector(this.constants.WRAPPER_CLASSNAME).style.display = 'block';

        // Once set, update iframe to `preview.html` for rendering live changes
        this.updateIframeSource();
    },
    authAndPermissions: async function() {
        await this.verifyCredentials();
        await this.fetchData();
    },
    verifyCredentials: async function() {
        // Verify existing user credentials
        // and also ensure that the user has the right to edit this particular page
        if (!Store.USER.ID || !Store.USER.token) {
            this.showErrorScreen('unauthenticated', i18n.NO_CREDENTIALS_ERROR);
        }
    },
    fetchData: async function() {
        // Fetch data from the `json` endpoint and verify it so that it can be used
        // to populate existing data, design and settings
        try {
            // Show processing to prevent accidental clicks
            Processing.show(document.body);

            const request = await fetch(`${apiBase}/json?slug=${this.SLUG}&domain=${this.DOMAIN}`, {
                method: 'GET',
                async: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                contentType: 'json',
                headers: {
                    user_id: Store.USER.ID,
                    token: Store.USER.token
                }
            });

            // Get JSON data
            const response = await request.json();

            // If the status is not 200, throw error
            // Added exception for 404 error as we will be using default data in case JSON file is not found in R2
            if (request.status !== 200 && request.status !== 404) {
                throw new Error(response.message);
            }

            // Start with an empty object
            const data = {};

            // Add data with unique identifier
            // In case of a 404 error (which means JSON file does not exist on R2), we start with empty object
            data[`${this.SLUG}|${this.DOMAIN}`] = JSON.stringify(request.status === 404 ? blankPageData : response);

            // Store fetched data
            await Store.set(data, 'session');
        } catch (error) {
            console.error(error);

            // Show unauthenticated error
            this.showErrorScreen('unauthenticated', error.message ?? i18n.DEFAULT_ERROR);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    },
    updateIframeSource: function() {
        Selectors.PREVIEW_FRAME.src = `preview.html?slug=${this.SLUG}&domain=${this.DOMAIN}`;
    },
    getStoredData: async function() {
        const data = await Store.get(`${this.SLUG}|${this.DOMAIN}`, 'session');

        // If the data does not exist, the default value will be used
        if (data && data.hasOwnProperty(`${this.SLUG}|${this.DOMAIN}`)) {
            this.DATA = JSON.parse(data[`${this.SLUG}|${this.DOMAIN}`]);
        }

        // Convert arrays back to `Map` object
        if (!(this.get('order') instanceof Map)) {
            this.set('order', new Map(this.get('order')));
        }
        if (!(this.get('social', 'order') instanceof Map)) {
            this.set('social', new Map(this.get('social', 'order')), 'order');
        }
    },
    validateData: function() {
        // For validating data, we simply need to merge the design object with default page options
        // This ensures that we have all the required settings
        this.DATA.design = {...defaultPageOptions.design, ...this.DATA.design};
    },
    injectSlugDomainDetails: async function() {
        // Inject domain & slug to the header info section
        if (Selectors.HEADER_PAGE_INFO) {
            const slugEl = Selectors.HEADER_PAGE_INFO.querySelector('.slug');
            const domainEl = Selectors.HEADER_PAGE_INFO.querySelector('.domain');

            slugEl.innerText = this.SLUG;
            domainEl.innerText = this.DOMAIN;
        }

        // Inject details to share popover
        await Frame.updateShareButton();
    },
    render: function() {
        Content.render();
        Design.render();
        Settings.render();
    },
    showErrorScreen(type, error) {
        document.querySelector(this.constants.SCREEN[type]).style.display = 'block';

        // Replace title
        document.title = document.title.replace('{slug}', 'Error');

        // Throw error to stop further execution
        throw new Error(error);
    },
    setSlugAndDomain: function() {
        const url = new URL(window.location.href);
        this.SLUG = url.searchParams.get('slug');
        this.DOMAIN = url.searchParams.get('domain');

        if (!this.SLUG || !this.DOMAIN) {
            this.showErrorScreen('error', i18n.PAGE_URL_ERROR);
        }

        // Everything looks good, update page title
        document.title = document.title.replace('{slug}', `${this.SLUG} at ${this.DOMAIN}`);
    },
    switchToSavedTab: function() {
        let tabId = localStorage.getItem(`${this.SLUG}|${this.DOMAIN}-section`);

        // Since we don't have a section name, show the content section
        tabId = tabId || 'content';

        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;

        // Remove selected class from all tab elements
        // Add selected class to target element
        Selectors.TABS.forEach(tab => tab.classList.remove('selected'));
        document.querySelector(`[data-tab=${tabId}]`).classList.add('selected');

        // Do the same for sections
        Selectors.SECTIONS.forEach(section => section.style.display = 'none');
        tabEl.style.display = 'block';
    },
    mobileMenuEvent: function() {
        if (!Selectors.MOBILE_MENU_BUTTON) return;

        Selectors.MOBILE_MENU_BUTTON.addEventListener('click', e => {
            e.preventDefault();

            try {
                const menu = document.querySelector(this.constants.MENU_CLASSNAME);
                if (!menu) return;

                // Switch buttons
                Selectors.MOBILE_MENU_BUTTON.querySelectorAll('img').forEach(img => img.classList.toggle('show'));

                menu.classList.toggle('show');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    tabSwitchEvent: function() {
        if (Selectors.TABS.length === 0) return;

        Selectors.TABS.forEach(tab => tab.addEventListener('click', e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName !== 'A') {
                    target = e.target.closest('a');
                }

                const tabId = target.getAttribute('data-tab');
                if (!tabId) return;

                const tabEl = document.getElementById(tabId);
                if (!tabEl) return;

                // Remove selected class from all tab elements
                // Add selected class to target element
                Selectors.TABS.forEach(tab => tab.classList.remove('selected'));
                target.classList.add('selected');

                // Do the same for sections
                Selectors.SECTIONS.forEach(section => section.style.display = 'none');
                tabEl.style.display = 'block';

                // Fetch the selected section and show it's content
                localStorage.setItem(`${this.SLUG}|${this.DOMAIN}-section`, tabId);

                // Switcher for mobile menu
                const menu = document.querySelector(this.constants.MENU_CLASSNAME);
                if (!menu) return;

                // Switch buttons
                Selectors.MOBILE_MENU_BUTTON.querySelectorAll('img').forEach(img => img.classList.contains('open') ? img.classList.add('show') : img.classList.remove('show'));
                menu.classList.remove('show');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    stickyHeadingEvent: function() {
        stickybits('.sticky', {
            stickyBitStickyOffset: 92
        });
    },
    openSidePanelEvent: function() {
        if (!Selectors.SIDEPANEL_LINKS.length) return;

        Selectors.SIDEPANEL_LINKS.forEach(link => link.addEventListener('click', async e => {
            e.preventDefault();

            const tab = await getCurrentTab();
            chrome.sidePanel.open({ tabId: tab.id });
        }));
    },
    publishEvent: function() {
        if (!Selectors.SAVE_BUTTON) return;

        Selectors.SAVE_BUTTON.addEventListener('click', async e => {
            e.preventDefault();

            try {
                Processing.show();

                // Data to be pushed to server
                const json = {
                    order: Array.from(this.get('order').entries()),
                    content: this.get('content'),
                    design: this.get('design'),
                    settings: this.get('settings'),
                    social: {
                        order: Array.from(this.get('social', 'order').entries()),
                        content: this.get('social', 'content')
                    },
                    providers: this.get('providers')
                };

                const request = await fetch(`${apiBase}/json`, {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    contentType: 'json',
                    body: JSON.stringify({
                        user_id: Store.USER.ID,
                        token: Store.USER.token,
                        json,
                        slug: this.SLUG,
                        domain: this.DOMAIN
                    })
                });

                // Get JSON data
                const response = await request.json();

                // If the status is not 200, throw error
                if (request.status !== 200) {
                    throw new Error(response.message);
                }

                // Since changes have been published, reset `UNSAVED_CHANGES` attribute
                this.UNSAVED_CHANGES = false;

                // Also, add a little confetti effect with success notification
                Notification.success(i18n.PAGE_PUBLISHED);

                // Confetti
                var end = Date.now() + (1 * 1000);
                (function celebrate() {
                    confetti({
                        particleCount: 4,
                        angle: 60,
                        spread: 45,
                        origin: { x: 0 }
                    });
                    confetti({
                        particleCount: 4,
                        angle: 120,
                        spread: 45,
                        origin: { x: 1 }
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(celebrate);
                    }
                }());
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                setTimeout(() => {
                    Processing.hide();
                }, 800);
            }
        });
    },
    previewEvent: function() {
        if (!Selectors.PREVIEW_BUTTON || !Selectors.PREVIEW_CONTAINER) return;

        Selectors.PREVIEW_BUTTON.addEventListener('click', e => {
            e.preventDefault();

            try {
                Selectors.PREVIEW_CONTAINER.classList.toggle('js-trigger');

                e.target.innerText === 'Preview' ? e.target.innerText = 'Close' : e.target.innerText = 'Preview';
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    unsavedChangesAlertEvent: function() {
        window.addEventListener('beforeunload', e => {
            if (!this.UNSAVED_CHANGES) return;

            // Recommended
            e.preventDefault();

            // Included for legacy support, e.g. Chrome/Edge < 119
            e.returnValue = i18n.UNSAVED_CHANGES_MESSAGE;
            return i18n.UNSAVED_CHANGES_MESSAGE;
        });
    },
    events: function() {
        this.mobileMenuEvent();
        this.tabSwitchEvent();
        this.stickyHeadingEvent();
        this.openSidePanelEvent();
        this.publishEvent();
        this.previewEvent();
        this.unsavedChangesAlertEvent();
    },
    init: async function() {
        try {
            Processing.show();

            // Basic events
            this.events();

            // Update DOM
            await this.updateDOM();

            // Initialise events (for different sections)
            Events.init();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    }
};
