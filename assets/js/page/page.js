// page/page.js
import { Events } from "./events.js";
import { Notification } from "../notification.js";
import { Selectors } from "./selectors.js";
import { i18n } from "../i18n.js";

export const Page = {
    constants: {
        SLUG: null,
        DOMAIN: null
    },
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

                Selectors.TABS.forEach(tab => tab.classList.remove('selected'));

                // Add selected class to target element
                target.classList.add('selected');
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
            // Initialise events (for different sections)
            Events.init();

            // Event listeners
            this.events();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        }
    }
};

// Load extension on DOM ready
window.addEventListener('DOMContentLoaded', () => {
	Page.init();
});
