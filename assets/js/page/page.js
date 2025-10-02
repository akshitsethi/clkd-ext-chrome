// page/page.js
import { Events } from "./events.js";
import { Notification } from "../notification.js";
import { Store } from "../store.js";

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
    init: async function() {
        try {
            // Initialise events for all modules
            Events.init();

            console.log(await Store.get());
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
