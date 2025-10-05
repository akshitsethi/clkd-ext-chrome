// page/page.js
import { Events } from "./events.js";
import { Notification } from "../notification.js";
import { Selectors } from "./selectors.js";
import { i18n } from "../i18n.js";
import { Processing } from "../processing.js";

export const Page = {
    constants: {
        HEADER_CLASSNAME: 'header',
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
    updateDOM: function() {
        // Set essential constants (slug and domain)
        this.setSlugAndDomain();

        // Switch to last active tab
        this.switchToSavedTab();

        // Make design screen visible
        document.querySelector(this.constants.HEADER_CLASSNAME).style.display = 'block';
        document.querySelector(this.constants.WRAPPER_CLASSNAME).style.display = 'flex';
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
        let tabId = localStorage.getItem(`${Page.SLUG}|${Page.DOMAIN}-section`);

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
    tabSwitchEvent: function() {
        if (Selectors.TABS.length === 0) return;

        Selectors.TABS.forEach(tab => tab.addEventListener('click', e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName === 'IMG') {
                    target = e.target.parentElement;
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
                localStorage.setItem(`${Page.SLUG}|${Page.DOMAIN}-section`, tabId);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    events: function() {
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
