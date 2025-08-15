// main.js
// import { Auth } from "./auth.js";
// import { Header } from "./header.js";
// import { Screen } from "./screen.js";
// import { Storage } from "./storage.js";
// import { Upgrade } from "./upgrade.js";
// import { Help } from "./help.js";
// import { Links } from "./links.js";
// import { Modal } from "./modal.js";
// import { Tooltip } from "./tooltip.js";
// import { Settings } from "./settings.js";
// import { Pages } from "./pages.js";
// import { Archives } from "./archives.js";
// import { Dashboard } from "./dashboard.js";
import { Notification } from "./notification.js";

// Main application
const CLKD = {
	init: async function () {
		// await Storage.init();
		// await Auth.checkLogin();

		/**
		 * @todo Check the stored user object here and verify that we have the required basics for working
		 * with the application. Attributes such as name, email, user_id, token, picture, is_premium etc.
		 */
		// Links.slugDetailsAndAnalytics('5C', 29, 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_PHP.container.html', 'Sat, 17 May 2025 15:57:59 GMT');
		// Screen.links();

		// Settings.events();
		// Screen.events();
		// Header.events();
		// Storage.events();
		// Dashboard.events();
		// Upgrade.events();
		// Links.events();
		// Pages.events();
		// Archives.events();
		// Modal.events();
		// Tooltip.events();
		// Help.events();

		document.addEventListener('click', e => {
			// Processing.show(document.getElementById('links'));
			// Notification.show(e.timeStamp, 'error');
		});
	}
};

// Load extension on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    CLKD.init();
});
