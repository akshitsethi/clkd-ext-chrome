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
import { Modal } from "./modal.js";

export const Links = {
	DATA: [],
	ACTIVE_TABLE: null,
	ARCHIVE_TABLE: null,
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

		selector.addEventListener('click', async e => {
			e.preventDefault();

			try {
				Processing.show(document.body);

				let target = e.target;
				if (target.nodeName === 'IMG') {
					target = e.target.parentElement;
				}

				const parent = target.closest('tr');
				if (!parent) {
					throw new Error(i18n.QRCODE_ERROR);
				}

				const domain = parent.getAttribute('data-domain');
				const slug = parent.getAttribute('data-slug');
				if (!domain || !slug) {
					throw new Error(i18n.QRCODE_ERROR);
				}

				// Generate QR using scan link
				const scanLink = `https://${domain}/${slug}?scan=1`;
				const qrcode = await QR.generate(scanLink);

				// Open QR Code in modal
				const el = document.createElement('div');
				el.classList.add('modal-qrcode');

				// QRcode image
				const imgEl = document.createElement('img');
				imgEl.setAttribute('src', qrcode);
				el.appendChild(imgEl);

				// Download button
				const divEl = document.createElement('div');
				divEl.classList.add('download');

				// Remove its event listener
				const anchorEl = document.createElement('a');
				anchorEl.setAttribute('href', qrcode);
				anchorEl.setAttribute('data-filename', `${slug}.png`);
				anchorEl.appendChild(document.createTextNode('Download'));
				anchorEl.addEventListener('click', e => {
					e.preventDefault();

					try {
						chrome.downloads.download({
							url: e.target.href,
							filename: e.target.getAttribute('data-filename')
						});
					} catch (error) {
						console.error(error);
						Notification.error(i18n.DOWNLOAD_ERROR);
					}
				});

				divEl.appendChild(anchorEl);
				el.appendChild(divEl);

				// Show modal
				Modal.show(el, 'node');
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

			// Populate active & archived data once we have it
			this.populateData();
			this.populateArchive();
		} catch (error) {
			console.error(error);
			Notification.error(error.message ?? i18n.DEFAULT_ERROR);
		} finally {
			Processing.hide();
		}
	},
	populateData: function () {
		const table = Selectors.LINKS_SECTION.querySelector('tbody');
		const active = this.DATA.filter(link => !link.is_archive);

		if (active.length !== 0) {
			// Empty out the table body
			table.innerHTML = null;

			if (DataTable.isDataTable(this.ACTIVE_TABLE)) {
				this.ACTIVE_TABLE.clear().destroy();
				this.ACTIVE_TABLE = null;
			}

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
					e.preventDefault();
					chrome.tabs.create({ url: `https://${single.domain}/${single.slug}` });
				});
				anchor.querySelector('.slug').appendChild(document.createTextNode(single.slug));
				anchor.querySelector('.domain').appendChild(document.createTextNode(single.domain));

				// Paragraph
				const target = content.querySelector('.target > a');
				target.setAttribute('href', single.url);
				target.addEventListener('click', e => {
					e.preventDefault();
					chrome.tabs.create({ url: e.target.href });
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

			// Initialise DataTable
			this.ACTIVE_TABLE = new DataTable(
				Selectors.LINKS_SECTION,
				{
					language: {
						search: 'Filter Links',
						entries: {
							_: 'links',
							1: 'link'
						},
						zeroRecords: 'No matching links found'
					},
					pageLength: Number(Store.SETTINGS.links_per_page),
					lengthChange: false,
					autowidth: false,
					order: []
				}
			);

			Selectors.LINKS_SECTION.style.display = 'tablek';
			Selectors.LINKS_NO_DATA_MESSAGE.style.display = 'none';
		} else {
			Selectors.LINKS_SECTION.style.display = 'none';
			Selectors.LINKS_NO_DATA_MESSAGE.style.display = 'block';
		}
	},
	populateArchive: function() {

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
