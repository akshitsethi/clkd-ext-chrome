// links.js
import DataTable from "datatables.net";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Store } from "./store.js";
import { apiBase } from "./constants.js";
import { Selectors } from "./selectors.js";
import { getCurrentTab } from "./helper.js";
import { Tooltip } from "./tooltip.js";
import { i18n } from "./i18n.js";
import { User } from "./user.js";
import { Common } from "./common.js";

export const Links = {
	constants: {
		OUTPUT_DETAILS_CLASSNAME: '.link-output-details',
		OUTPUT_TEMPLATE_CLASSNAME: '#link-output-template',
		OUTPUT_NEW_LINK_CLASSNAME: '.new-link',
		OUTPUT_COPY_LINK_CLASSNAME: '.copy',
		QRCODE_CLASSNAME: '.qrcode',
		ACTION_ANALYTICS_CLASSNAME: '.analytics',
		ACTION_EDIT_CLASSNAME: '.edit',
		ACTION_ARCHIVE_CLASSNAME: '.archive',
		SINGLE_LINK_CLASSNAME: '.link',
		SINGLE_SLUG_CLASSNAME: '.slug',
		SINGLE_DOMAIN_CLASSNAME: '.domain',
		SINGLE_TARGET_CLASSNAME: '.target',
		SINGLE_CREATED_CLASSNAME: '.created',
		CREATE_SECTION_CLASSNAME: '.quick-create',
		INLINE_MODAL_CLASSNAME: '.inline-modal',
		SLUG_FIELD_CLASSNAME: '.custom-slug'
	},
	DATA: [],
	ACTIVE_TABLE: null,
	ARCHIVE_TABLE: null,
	singleEvents: function (content) {
		const analytics = content.querySelector(this.constants.ACTION_ANALYTICS_CLASSNAME);
		if (analytics) this.analyticsEvent(analytics);

		const edit = content.querySelector(this.constants.ACTION_EDIT_CLASSNAME);
		if (edit) this.editEvent(edit);

		const qrcode = content.querySelector(this.constants.QRCODE_CLASSNAME);
		if (qrcode) this.qrcodeEvent(qrcode);

		const archive = content.querySelector(this.constants.ACTION_ARCHIVE_CLASSNAME);
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

				// Show QRCode modal
				await Common.QRCodeModal(domain, slug);
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
	showNewLinkOutput: function (domain, slug) {
		if (!Selectors.LINK_OUTPUT_SECTION) return;

		// Check for required selectors
		const template = Selectors.LINK_OUTPUT_SECTION.querySelector(this.constants.OUTPUT_TEMPLATE_CLASSNAME);
		const details = Selectors.LINK_OUTPUT_SECTION.querySelector(this.constants.OUTPUT_DETAILS_CLASSNAME);
		if (!template || !details) return;

		// Remove existing HTML
		details.innerHTML = null;

		// Inject data so that we can clear out event listeners
		const content = template.content.cloneNode(true);

		// Newly added link
		const link = content.querySelector(this.constants.OUTPUT_NEW_LINK_CLASSNAME);
		link.setAttribute('data-domain', domain);
		link.setAttribute('data-slug', slug);
		link.innerText = `https://${domain}/${slug}`;

		// Copy text
		const copy = content.querySelector(this.constants.OUTPUT_COPY_LINK_CLASSNAME);
		copy.setAttribute('data-text', `https://${domain}/${slug}`);

		// QRcode
		const qrcode = content.querySelector(this.constants.QRCODE_CLASSNAME);
		qrcode.setAttribute('data-domain', domain);
		qrcode.setAttribute('data-slug', slug);

		// Add output to details
		details.appendChild(content);

		// Enable event listeners
		this.newLinkOutputEvents();

		// Reset form values
		Selectors.LINK_FORM.reset();

		// Make selector visible
		Selectors.LINK_OUTPUT_SECTION.style.display = 'block';
	},
	addNewLink: function (data) {
		// Add new link to local storage
		const link = {
			slug: data.slug,
			domain: data.domain,
			url: data.url,
			is_archive: data.is_archive,
			created: data.created
		};

		// Add to storage
		User.setLinks([ link ]);

		// Show newly added link on screen
		this.showNewLinkOutput(data.domain, data.slug);

		// Refresh links table
		this.populateData();
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
	populateData: function (type = 'active') {
		const table = Selectors.LINKS_SECTION.querySelector('tbody');
		const data = type === 'active' ? this.DATA.filter(link => !link.is_archive) : this.DATA.filter(link => link.is_archive);

		if (data.length !== 0) {
			// Sort data in descending order
			data.length >= 2 && data.sort((a, b) => Date.parse(b.created) - Date.parse(a.created));

			// Empty out the table body
			table.innerHTML = null;

			if (DataTable.isDataTable(this.ACTIVE_TABLE)) {
				this.ACTIVE_TABLE.clear().destroy();
				this.ACTIVE_TABLE = null;
			}

			// Add table data
			for (const single of data) {
				let url = single.url;
				if (url.length > 75) {
					url = url.substring(0, 75) + '...';
				}

				const template = Selectors.LINK_ENTRY_TEMPLATE;
				const content = template.content.cloneNode(true);

				// Add core details to row
				const row = content.querySelector('tr');
				row.setAttribute('data-slug', single.slug);
				row.setAttribute('data-domain', single.domain);
				row.setAttribute('data-url', single.url);
				row.setAttribute('data-created', single.created);

				// Anchor
				const anchor = content.querySelector(this.constants.SINGLE_LINK_CLASSNAME);
				anchor.addEventListener('click', e => {
					e.preventDefault();
					chrome.tabs.create({ url: `https://${single.domain}/${single.slug}` });
				});
				anchor.querySelector(this.constants.SINGLE_SLUG_CLASSNAME).appendChild(document.createTextNode(single.slug));
				anchor.querySelector(this.constants.SINGLE_DOMAIN_CLASSNAME).appendChild(document.createTextNode(single.domain));

				// Paragraph
				const target = content.querySelector(this.constants.SINGLE_TARGET_CLASSNAME);
				target.setAttribute('href', single.url);
				target.addEventListener('click', e => {
					e.preventDefault();
					chrome.tabs.create({ url: e.target.href });
				});
				target.appendChild(document.createTextNode(url));

				// Datetime
				const created = content.querySelector(this.constants.SINGLE_CREATED_CLASSNAME);
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

			Selectors.LINKS_SECTION.style.display = 'table';
			Selectors.LINKS_NO_DATA_MESSAGE.style.display = 'none';
		} else {
			Selectors.LINKS_SECTION.style.display = 'none';
			Selectors.LINKS_NO_DATA_MESSAGE.style.display = 'block';
		}
	},
	populateArchive: function () {

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
	syncWithAPI: async function (url, domain, slug = null) {
		if (!url || !domain) {
			throw new Error(i18n.URL_DOMAIN_ERROR);
		}

		// Request details
		const body = {
			url: url,
			domain: domain,
			user_id: Store.USER.ID,
			token: Store.USER.token
		};
		if (slug) body.slug = slug;

		const request = await fetch(`${apiBase}/link`, {
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

		return response.message;
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
	createLinkFormEvent: function () {
		if (!Selectors.LINK_FORM) return;

		Selectors.LINK_FORM.addEventListener('submit', async e => {
			e.preventDefault();

			try {
				Processing.show(document.body);

				// Get URL & domain
				const url = e.target.querySelector('input[name=url]').value;
				const domain = Selectors.LINK_DOMAIN_SELECTOR.value;

				// OPTIONAL: custom slug
				let slug = null;
				if (Selectors.LINK_MODE_SWITCHER.getAttribute('data-mode') === 'manual') {
					const parent = Selectors.LINK_MODE_SWITCHER.closest(this.constants.CREATE_SECTION_CLASSNAME);

					slug = parent.querySelector(this.constants.SLUG_FIELD_CLASSNAME).value;
					if (!slug || slug.length === 0) {
						throw new Error(i18n.EMPTY_SLUG_ERROR);
					}
				}

				// Initialise API request
				const response = await this.syncWithAPI(url, domain, slug);

				// Add newly generated link
				this.addNewLink(response);
			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	createLinkFromTabEvent: function () {
		if (!Selectors.LINK_FROM_TAB_BUTTON) {
			return;
		}

		Selectors.LINK_FROM_TAB_BUTTON.addEventListener('click', async e => {
			e.preventDefault();

			try {
				Processing.show(document.body);

				// Fetch URL & domain
				const tab = await getCurrentTab();
				const domain = Selectors.LINK_DOMAIN_SELECTOR.value;
				if (!tab.url || tab.url.length === 0 || !domain) {
					throw new Error(i18n.MISSING_DETAILS_ERROR);
				}

				// OPTIONAL: custom slug
				let slug = null;
				if (Selectors.LINK_MODE_SWITCHER.getAttribute('data-mode') === 'manual') {
					const parent = Selectors.LINK_MODE_SWITCHER.closest(this.constants.CREATE_SECTION_CLASSNAME);

					slug = parent.querySelector(this.constants.SLUG_FIELD_CLASSNAME).value;
					if (!slug || slug.length === 0) {
						throw new Error(i18n.EMPTY_SLUG_ERROR);
					}
				}

				// Initialise API request
				const response = await this.syncWithAPI(tab.url, domain, slug);

				// Add newly generated link
				this.addNewLink(response);
			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	newLinkOutputEvents: function () {
		if (!Selectors.LINK_OUTPUT_SECTION) return;

		const link = Selectors.LINK_OUTPUT_SECTION.querySelector(this.constants.OUTPUT_NEW_LINK_CLASSNAME);
		if (link) {
			link.addEventListener('click', e => {
				e.preventDefault();

				try {
					const domain = e.target.getAttribute('data-domain');
					const slug = e.target.getAttribute('data-slug');
					if (!domain || !slug) {
						throw new Error(i18n.MISSING_DETAILS_ERROR);
					}

					chrome.tabs.create({ url: `https://${domain}/${slug}` });
				} catch (error) {
					console.error(error);
					Notification.error(error.message ?? i18n.DEFAULT_ERROR);
				}
			});
		}

		const copy = Selectors.LINK_OUTPUT_SECTION.querySelector(this.constants.OUTPUT_COPY_LINK_CLASSNAME);
		if (copy) {
			copy.addEventListener('click', async e => {
				e.preventDefault();
				await Common.copyText(copy);
			});
		}

		const qrcode = Selectors.LINK_OUTPUT_SECTION.querySelector(this.constants.QRCODE_CLASSNAME);
		if (qrcode) {
			qrcode.addEventListener('click', async e => {
				e.preventDefault();

				try {
					const domain = e.target.getAttribute('data-domain');
					const slug = e.target.getAttribute('data-slug');

					// Show QRCode modal
					await Common.QRCodeModal(domain, slug);
				} catch (error) {
					console.error(error);
					Notification.error(error.message ?? i18n.DEFAULT_ERROR);
				}
			});
		}
	},
	modeSwitcherEvent: function() {
		if (!Selectors.LINK_MODE_SWITCHER) return;

		Selectors.LINK_MODE_SWITCHER.addEventListener('click', e => {
			e.preventDefault();

			try {
				const mode = e.target.getAttribute('data-mode');
				const toggle = (mode === 'auto') ? 'manual': 'auto';
				if (!mode || !['auto', 'manual'].includes(mode)) {
					throw new Error(i18n.MISSING_DETAILS_ERROR);
				}

				const parent = e.target.closest(this.constants.CREATE_SECTION_CLASSNAME);
				const inline = parent.querySelector(this.constants.INLINE_MODAL_CLASSNAME);

				e.target.classList.toggle('selected');
				e.target.setAttribute('data-mode', toggle);
				e.target.innerText = toggle;

				inline.classList.toggle('show');
			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			}
		});
	},
	events: function () {
		this.getCurrentUrlEvent();
		this.chromeListenerEvent();
		this.createLinkFormEvent();
		this.createLinkFromTabEvent();
		this.modeSwitcherEvent();
	},
	init: async function () {
		await this.updateDOM();
	}
};
