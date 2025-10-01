// page/page.js
import { Notification } from "../notification.js";
import { Events } from "./events.js";

const Page = {
    init: function() {
        try {
            // Initialise events for all modules
            Events.init();
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
