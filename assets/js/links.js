// links.js
import DataTable from "datatables.net";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Store } from "./store.js";
import { QR } from "./qrcode.js";
import { apiBase } from "./constants.js";
import { Selectors } from "./selectors.js";
import { getCurrentTab } from "./helper.js";
import { Tooltip } from "./tooltip.js";
import { i18n } from "./i18n.js";

export const Links = {
    getCurrentUrl: async function() {
		try {
			// Fetch current tab details
			const tab = await getCurrentTab();

			let url = tab.url;
			if (url.length > 40) {
				url = url.substring(0, 34) + '...';
			}

			// Set tooltip to be the current URL
			Tooltip.show(Selectors.REVEAL_URL_LINK, url);
		} catch (error) {
			console.error(error);
			Notification.error(error.message ?? i18n.DEFAULT_ERROR);
		}
    },
	getCurrentUrlEvent: function() {
		this.getCurrentUrl();
	},
    chromeListenerEvent: function() {
        // When a tab is updated
		chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
			if (change.status === 'complete') {
				await this.getCurrentUrl();
			}
		});

		// On tab switch
		chrome.tabs.onActivated.addListener(async info => {
			await this.getCurrentUrl();
		});
    },
    events: function() {
        this.chromeListenerEvent();
		this.getCurrentUrlEvent();
    },
    init: function() {

    }
};
