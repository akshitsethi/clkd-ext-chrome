// main.js
import { Notification } from "./notification.js";
import { Auth } from "./auth.js";
import { Store } from "./store.js";
import { i18n } from "./i18n.js";
import { Events } from "./events.js";
import { Screen } from "./screen.js";

// Main application
const CLKD = {
	init: async function () {
		try {
			// Initialise store
			await Store.init();

			// Initialise events for all modules
			Events.init();

			// Trigger user authentication
			await Auth.init();

			// TEMPORARY
			// To be removed once the work is complete
			Screen.show('links', 'block', 'true', true);
		} catch (error) {
			console.error(error);
			Notification.error(error.message ?? i18n.DEFAULT_ERROR);
		}
	}
};

// Load extension on DOM ready
window.addEventListener('DOMContentLoaded', () => {
	CLKD.init();
});
