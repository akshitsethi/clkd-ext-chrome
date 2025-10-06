// page/page.js
import { Events } from "./events.js";
import { Selectors } from "./selectors.js";
import { Store } from "../store.js"
import { Notification } from "../notification.js";
import { Processing } from "../processing.js";
import { i18n } from "../i18n.js";

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
    SWAPY: null,
    get: function(attribute, id = null) {
        if (id !== null) {
            return this.DATA[attribute][id];
        }

        return this.DATA[attribute];
    },
    set: function(attribute, value, id = null, subId = null) {
        if (id !== null) {
            if (subId !== null) {
                this.DATA[attribute][id][subId] = value;
            } else {
                this.DATA[attribute][id] = value;
            }
        } else {
            this.DATA[attribute] = value;
        }
    },
    remove: function(attribute, id) {
        if (this.DATA[attribute] instanceof Map) {
            this.DATA[attribute].delete(id);
        } else {
            delete this.DATA[attribute][id];
        }
    },
    save: async function() {
        // Get existing content data
        const existing = await Store.get('content');

        // Start with an empty object
        const data = {
            'content': existing.content ?? {}
        };

        // Set content data as combination of slug and domain
        data.content[`${this.SLUG}|${this.DOMAIN}`] = {
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

        // Store updated data object
        await Store.set(data);
    },
    updateDOM: function() {
        // Set essential constants (slug and domain)
        this.setSlugAndDomain();

        // Verify credentials and fetch data from server (if required)
        this.verifyCredentials();
        this.fetchData();

        // Switch to last active tab
        this.switchToSavedTab();

        // Make design screen visible
        document.querySelector(this.constants.HEADER_CLASSNAME).style.display = 'block';
        document.querySelector(this.constants.WRAPPER_CLASSNAME).style.display = 'block';
    },
    verifyCredentials: function() {
        // TODO
        // Verify existing user credentials
        // and also ensure that the user has the right to edit this particular page

        // So, basically if there is existing data present
    },
    fetchData: function() {

    },
    showScreen(type) {
        document.querySelector(this.constants.SCREEN[type]).style.display = 'flex';
    },
    setSlugAndDomain: function() {
        const url = new URL(window.location.href);
        this.SLUG = url.searchParams.get('slug');
        this.DOMAIN = url.searchParams.get('domain');

        if (!this.SLUG || !this.DOMAIN) {
            this.showScreen('error');
            throw new Error(i18n.PAGE_URL_ERROR);
        }
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
    events: function() {
        this.mobileMenuEvent();
        this.tabSwitchEvent();
    },
    init: async function() {
        try {
            Processing.show();

            // Update DOM
            this.updateDOM();

            // Initialise events (for different sections)
            this.events();
            Events.init();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    }
};

// Load extension on DOM ready
window.addEventListener('DOMContentLoaded', () => {
	Page.init();
});
