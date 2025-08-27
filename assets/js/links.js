// links.js
import DataTable from "datatables.net";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Store } from "./store.js";
import { QR } from "./qrcode.js";
import { apiBase } from "./constants.js";
import { Selectors } from "./selectors.js";

export const Links = {
    getCurrentUrl: async function() {
        if (!Selectors.REVEAL_URL_LINK) {
			return;
		}

		// Fetch current tab details
		const tab = await getCurrentTab();

		let url = tab.url;
		if (url.length > 40) {
			url = url.substring(0, 34) + '...';
		}

        
    },
    chromeListenerEvent: function() {
        // When a tab is updated
		chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
			if (change.status === 'complete') {
				this.getCurrentUrl();
			}
		});

		// On tab switch
		chrome.tabs.onActivated.addListener(info => {
			this.getCurrentUrl();
		});
    },
    events: function() {
        this.chromeListenerEvent();
    },
    init: function() {

    }
};
