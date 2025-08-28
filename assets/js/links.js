// links.js
import DataTable from "datatables.net";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Store } from "./store.js";
import { QR } from "./qr.js";
import { apiBase } from "./constants.js";
import { Selectors } from "./selectors.js";
import { getCurrentTab } from "./helper.js";
import { Tooltip } from "./tooltip.js";
import { i18n } from "./i18n.js";
import { User } from "./user.js";

export const Links = {
	DATA: [],
	singleEvents: function (content) {
		const analytics = content.querySelector('.analytics');
		if (analytics) this.analyticsEvent(analytics);

		const edit = content.querySelector('.edit');
		if (edit) this.editEvent(edit);

		const qrcode = content.querySelector('.qrcode');
		if (qrcode) this.qrcodeEvent(qrcode);

		const archive = content.querySelector('.archive');
		if (archive) this.archiveEvent(archive);
	},
	analyticsEvent: function (selector) {
		if (!selector) return;

		selector.addEventListener('click', e => {
			e.preventDefault();

			try {
				Processing.show(document.body);


			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	editEvent: function (selector) {
		if (!selector) return;

		selector.addEventListener('click', e => {
			e.preventDefault();

			try {
				Processing.show(document.body);


			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	qrcodeEvent: function (selector) {
		if (!selector) return;

		selector.addEventListener('click', e => {
			e.preventDefault();

			try {
				Processing.show(document.body);


			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	archiveEvent: function (selector) {
		if (!selector) return;

		selector.addEventListener('click', e => {
			e.preventDefault();

			try {
				Processing.show(document.body);


			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	updateDOM: async function () {
		try {
			Processing.show(document.body);

			// Get data from storage
			const data = await Store.get('links');

			// Fetch fresh data from API if any of the conditions are not met
			if (
				!data.hasOwnProperty('links')
				|| !data.links.hasOwnProperty('data')
				|| !data.links.hasOwnProperty('refresh')
				|| data.links.refresh <= Date.now()
			) {
				// Set data to empty array
				this.DATA = [];

				// Request data from API
				await this.fetchFromAPI();
			} else {
				this.DATA = data.links.data;
			}

			// Process and populate data once we have it
			this.populateData();
		} catch (error) {
			console.error(error);
			Notification.error(error.message ?? i18n.DEFAULT_ERROR);
		} finally {
			Processing.hide();
		}
	},
	populateData: function () {
		const table = Selectors.LINKS_SECTION.querySelector('table tbody');
		const active = this.DATA.filter(link => !link.is_archive);

		// Add table data
		for (const single of active) {
			let url = single.url;
			if (url.length > 75) {
				url = url.substring(0, 75) + '...';
			}

			const template = Selectors.LINK_ENTRY_TEMPLATE.content;
			const content = template.cloneNode(true);

			// Add core details to row
			const row = content.querySelector('tr');
			row.setAttribute('data-slug', single.slug);
			row.setAttribute('data-domain', single.domain);
			row.setAttribute('data-url', single.url);
			row.setAttribute('data-created', single.created);

			// Anchor
			const anchor = content.querySelector('.link');
			anchor.addEventListener('click', e => {
				chrome.tabs.create({ url: `https://${single.domain}/${single.slug}` });
			});
			anchor.querySelector('.slug').appendChild(document.createTextNode(single.slug));
			anchor.querySelector('.domain').appendChild(document.createTextNode(single.domain));

			// Paragraph
			const target = content.querySelector('.target > a');
			target.setAttribute('anchor', single.url);
			target.addEventListener('click', e => {
				chrome.tabs.create({ url: e.target.anchor });
			});
			target.appendChild(document.createTextNode(url));

			// Datetime
			const created = content.querySelector('.created');
			created.appendChild(document.createTextNode(single.created));

			// Add event listeners
			this.singleEvents(content);

			// Add row to table body
			table.append(content);
		}
	},
	fetchFromAPI: async function (next = null) {
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
		await User.setLinks(response.message);

		// Recursion (we keep calling the endpoint until next is not null)
		if (response.hasOwnProperty('next') && response.next !== null) {
			await this.fetchFromAPI(response.next);
		}
	},
	getCurrentUrl: async function () {
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
	getCurrentUrlEvent: function () {
		this.getCurrentUrl();
	},
	chromeListenerEvent: function () {
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
	events: function () {
		this.getCurrentUrlEvent();
		this.chromeListenerEvent();
	},
	init: async function () {
		await this.updateDOM();
	}
};
