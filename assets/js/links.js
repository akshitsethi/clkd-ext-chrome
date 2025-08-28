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
	DATA: [],
	fetchFromAPI: async function(next = null) {
		const body = {
			user_id: Store.USER.ID,
			token: Store.USER.token
		};

		// Check if `next` parameter is specified to fetch additional data
		if (next) {
			if (!next.hasOwnProperty('slug') || !next.hasOwnProperty('user_id')) {
				throw new Error(i18n.API_INVALID_RESPONSE);
			}

			body.next = next;
		}

		const request = await fetch(`${apiBase}/data`, {
			method: 'POST',
			async: true,
			headers: {
				'Content-Type': 'application/json'
			},
			contentType: 'json',
			body: JSON.stringify(body)
		});

		// Get JSON data
        const response = await request.json();

        // Check for `message` property in the response returned from API
        if (!response.hasOwnProperty('message')) {
            throw new Error(i18n.API_INVALID_RESPONSE);
        }
        if (request.status !== 200) {
            throw new Error(response.message);
        }

		// Set user's link data


		// Recursion (we keep calling the endpoint until next is not null)
		if (response.hasOwnProperty('next')) {
			await this.fetchFromAPI(response.next);
		}

		
	},
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
		this.getCurrentUrlEvent();
        this.chromeListenerEvent();
    },
    init: function() {

    }
};
