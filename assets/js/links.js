// links.js
import DataTable from "datatables.net";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Store } from "./store.js";
import { apiBase, urlValidationOptions } from "./constants.js";
import { Selectors } from "./selectors.js";
import { getCurrentTab } from "./helper.js";
import { Tooltip } from "./tooltip.js";
import { i18n } from "./i18n.js";
import { User } from "./user.js";
import { Common } from "./common.js";
import { Modal } from "./modal.js";
import { Single } from "./single.js";
import { isURL, isAlphanumeric } from "validator";
import { Limits } from "./limits.js";
import { TWO_THIRDS_PI } from "chart.js/helpers";

export const Links = {
	constants: {
		DATA_TYPE: 'link',
		OUTPUT_DETAILS_CLASSNAME: '.link-output-details',
		OUTPUT_TEMPLATE_CLASSNAME: '#link-output-template',
		OUTPUT_NEW_LINK_CLASSNAME: '.new-link',
		OUTPUT_COPY_LINK_CLASSNAME: '.copy',
		QRCODE_CLASSNAME: '.qrcode',
		ACTION_ANALYTICS_CLASSNAME: '.analytics',
		ACTION_EDIT_CLASSNAME: '.edit',
		ACTION_ARCHIVE_CLASSNAME: '.archive',
		ACTION_RESTORE_CLASSNAME: '.restore',
		SINGLE_LINK_CLASSNAME: '.link',
		SINGLE_SLUG_CLASSNAME: '.slug',
		SINGLE_DOMAIN_CLASSNAME: '.domain',
		SINGLE_TARGET_CLASSNAME: '.target',
		SINGLE_CREATED_CLASSNAME: '.created',
		CREATE_SECTION_CLASSNAME: '.quick-create',
		INLINE_MODAL_CLASSNAME: '.inline-modal',
		SLUG_FIELD_CLASSNAME: '.custom-slug',
		EDIT_FORM_CLASSNAME: '.link-edit-form',
		EDIT_FORM_HEADING_CLASSNAME: 'header > h2',
		EDIT_FORM_DOMAIN_CLASSNAME: 'header > span',
		EDIT_FORM_URL_CLASSNAME: '.link-details .url',
		EDIT_FORM_DOMAIN_INPUT: '.input [name=domain]',
		EDIT_FORM_SLUG_INPUT: '.input [name=slug]'
	},
	DATA: [],
	TABLE: {
		active: null,
		archive: null
	},
	archiveRestoreLogic: async function (e, is_archive) {
		let target = e.target;
		if (target.nodeName === 'IMG') {
			target = e.target.parentElement;
		}

		const parent = target.closest('tr');
		if (!parent) {
			throw new Error(i18n.SELECTOR_NOT_FOUND);
		}
		const domain = parent.getAttribute('data-domain');
		const slug = parent.getAttribute('data-slug');

		// Set `is_archive` property for the item
		const index = this.DATA.findIndex(entry => entry.slug === slug && entry.domain === domain);
		if (index === -1) {
			throw new Error(i18n.ENTRY_NOT_FOUND);
		}

		// API call for setting the `is_archive` attribute
		const request = await fetch(`${apiBase}/archive`, {
			method: 'PATCH',
			async: true,
			headers: {
				'Content-Type': 'application/json'
			},
			contentType: 'json',
			body: JSON.stringify({
				user_id: Store.USER.ID,
				token: Store.USER.token,
				domain: domain,
				slug: slug,
				data_type: this.constants.DATA_TYPE,
				is_archive: is_archive
			})
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

		// Updated data
		const data = {
			slug: this.DATA[index].slug,
			domain: this.DATA[index].domain,
			is_archive: is_archive,
			created: this.DATA[index].created
		};
		if (this.constants.DATA_TYPE === 'link') {
			data.url = this.DATA[index].url;
		}

		// Replace link content
		this.DATA.splice(index, 1, data);

		// Store entries by passing empty array to function
		await User.setEntries([], this.constants.DATA_TYPE);

		// On successfull update, refresh tables
		this.populateData();
		this.populateArchive();

		// Show success message
		Notification.success(response.message);
	},
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
	archiveEvents: function (content) {
		const restore = content.querySelector(this.constants.ACTION_RESTORE_CLASSNAME);
		if (restore) this.restoreEvent(restore);
	},
	analyticsEvent: function (selector) {
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
					throw new Error(i18n.SELECTOR_NOT_FOUND);
				}

				const domain = parent.getAttribute('data-domain');
				const slug = parent.getAttribute('data-slug');
				if (!domain || !slug) {
					throw new Error(i18n.MISSING_DETAILS_ERROR);
				}

				// Open single analytics screen
				await Single.init(domain, slug, parent.getAttribute('data-url'), parent.getAttribute('data-created'));
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

				let target = e.target;
				if (target.nodeName === 'IMG') {
					target = e.target.parentElement;
				}

				const parent = target.closest('tr');
				if (!parent) {
					throw new Error(i18n.SELECTOR_NOT_FOUND);
				}

				const domain = parent.getAttribute('data-domain');
				const slug = parent.getAttribute('data-slug');
				if (!domain || !slug) {
					throw new Error(i18n.MISSING_DETAILS_ERROR);
				}
				let url = parent.getAttribute('data-url');
				if (url.length > 125) {
					url = url.substring(0, 125) + '...';
				}

				const template = Selectors.LINK_TEMPLATE.edit.content;
				const content = template.cloneNode(true);

				// Attach event listener to form
				const form = content.querySelector(this.constants.EDIT_FORM_CLASSNAME);
				if (!form) {
					throw new Error(i18n.SELECTOR_NOT_FOUND);
				}

				// Add form's event listener
				form.addEventListener('submit', async e => {
					e.preventDefault();

					try {
						Processing.show(e.target, 'absolute');

						// Show upgrade trigger for editing links
						if (!Store.USER.is_premium) {
							Modal.hide();
							return Limits.upgradeModal('Edit Link');
						}

						// Create formdata object
						const data = new FormData(e.target);
						const request = await fetch(`${apiBase}/link`, {
							method: 'PATCH',
							async: true,
							headers: {
								'Content-Type': 'application/json'
							},
							contentType: 'json',
							body: JSON.stringify({
								user_id: Store.USER.ID,
								token: Store.USER.token,
								url: data.get('redirect'),
								domain: data.get('domain'),
								slug: data.get('slug'),
							})
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

						// Look for link in local storage using domain & slug
						const index = this.DATA.findIndex(link => link.slug === slug && link.domain === domain);
						if (index === -1) {
							throw new Error(i18n.LINK_NOT_FOUND);
						}

						// Update value
						this.DATA[index].url = data.get('redirect');

						// Store links by passing empty array to function
						await User.setEntries([], this.constants.DATA_TYPE);

						// On successfull update, refresh just active links table
						this.populateData();

						// Show success message
						Notification.success(response.message);

						// On successful update, close modal
						Modal.hide();
					} catch (error) {
						console.error(error);
						Notification.error(error.message ?? i18n.DEFAULT_ERROR);
					} finally {
						Processing.hide();
					}
				});

				// Add header and existing redirect link
				content.querySelector(this.constants.EDIT_FORM_HEADING_CLASSNAME).innerText = slug;
				content.querySelector(this.constants.EDIT_FORM_DOMAIN_CLASSNAME).innerText = domain;
				content.querySelector(this.constants.EDIT_FORM_URL_CLASSNAME).innerText = url;

				// Update domain and slug info
				content.querySelector(this.constants.EDIT_FORM_DOMAIN_INPUT).value = domain;
				content.querySelector(this.constants.EDIT_FORM_SLUG_INPUT).value = slug;

				Modal.show(content, 'node');
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
					throw new Error(i18n.SELECTOR_NOT_FOUND);
				}
				const domain = parent.getAttribute('data-domain');
				const slug = parent.getAttribute('data-slug');

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

		selector.addEventListener('click', async e => {
			e.preventDefault();

			try {
				Processing.show(document.body);
				await this.archiveRestoreLogic(e, true);
			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	restoreEvent: function (selector) {
		if (!selector) return;

		selector.addEventListener('click', async e => {
			e.preventDefault();

			try {
				Processing.show(document.body);
				await this.archiveRestoreLogic(e, false);
			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	showNewEntryOutput: function (domain, slug) {
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

		// Reset form values & empty the `custom-slug` field as well
		Selectors.LINK_FORM.reset();
		document.querySelector(`#links ${this.constants.SLUG_FIELD_CLASSNAME}`).value = null;

		// Make selector visible
		Selectors.LINK_OUTPUT_SECTION.style.display = 'block';
	},
	addNewEntry: async function (data) {
		// Add new entry to local storage
		const entry = {
			slug: data.slug,
			domain: data.domain,
			is_archive: data.is_archive,
			created: data.created
		};
		if (this.constants.DATA_TYPE === 'link') {
			entry.url = data.url;
		}

		// Add to storage
		await User.setEntries([entry], this.constants.DATA_TYPE);

		// Show newly added link on screen
		this.showNewEntryOutput(data.domain, data.slug);

		// Refresh links table
		this.populateData();

		// Success notification
		Notification.success(i18n.CREATED[this.constants.DATA_TYPE]);
	},
	updateDOM: async function () {
		try {
			Processing.show(document.body);

			// Get data from storage
			const data = await Store.get(`${this.constants.DATA_TYPE}s`);

			// Fetch fresh data from API if any of the conditions are not met
			if (
				!data.hasOwnProperty(`${this.constants.DATA_TYPE}s`)
				|| !data[`${this.constants.DATA_TYPE}s`].hasOwnProperty('data')
				|| !data[`${this.constants.DATA_TYPE}s`].hasOwnProperty('refresh')
				|| data[`${this.constants.DATA_TYPE}s`].refresh <= Date.now()
			) {
				// Set data to empty array
				this.DATA = [];

				// Request data from API
				await this.fetchFromAPI();
			} else {
				this.DATA = data[`${this.constants.DATA_TYPE}s`].data;
			}
		} catch (error) {
			console.error(error);
			Notification.error(error.message ?? i18n.DEFAULT_ERROR);
		} finally {
			// Populate active & archived data once we have it
			this.populateData();
			this.populateArchive();

			Processing.hide();
		}
	},
	populateData: function (type = 'active') {
		// Constants based on table type
		const table = Selectors.LINKS_SECTION[type].querySelector('table');
		const body = table.querySelector('tbody');
		const data = (type === 'active') ? this.DATA.filter(link => !link.is_archive) : this.DATA.filter(link => link.is_archive);

		// Empty out the table body
		body.innerHTML = null;

		if (data.length !== 0) {
			// Sort data in descending order
			data.length >= 2 && data.sort((a, b) => Date.parse(b.created) - Date.parse(a.created));

			if (DataTable.isDataTable(this.TABLE[type])) {
				this.TABLE[type].clear().destroy();
				this.TABLE[type] = null;
			}

			// Add table data
			for (const single of data) {
				let url = single.url;
				if (url.length > 75) {
					url = url.substring(0, 75) + '...';
				}

				const template = Selectors.LINK_TEMPLATE[type];
				const content = template.content.cloneNode(true);

				// Add core details to row
				const row = content.querySelector('tr');
				row.setAttribute('data-slug', single.slug);
				row.setAttribute('data-domain', single.domain);

				if (type === 'active') {
					row.setAttribute('data-url', single.url);
					row.setAttribute('data-created', single.created);
				}

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
				(type === 'active') ? this.singleEvents(content) : this.archiveEvents(content);

				// Add row to table body
				body.append(content);
			}

			// Initialise DataTable
			this.TABLE[type] = new DataTable(table,
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

			Selectors.LINKS_SECTION[type].style.display = 'block';
			Selectors.LINKS_NO_DATA_MESSAGE[type].style.display = 'none';
		} else {
			Selectors.LINKS_SECTION[type].style.display = 'none';
			Selectors.LINKS_NO_DATA_MESSAGE[type].style.display = 'block';
		}
	},
	populateArchive: function () {
		this.populateData('archive');
	},
	fetchFromAPI: async function (next = null) {
		const body = {
			user_id: Store.USER.ID,
			token: Store.USER.token,
			data_type: this.constants.DATA_TYPE
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
		await User.setEntries(response.message, this.constants.DATA_TYPE);

		// Recursion (we keep calling the endpoint until next is not null)
		if (response.hasOwnProperty('next') && response.next !== null) {
			await this.fetchFromAPI(response.next);
		}
	},
	syncWithAPI: async function (url, domain, slug = null) {
		if (!url || !domain) {
			throw new Error(i18n.URL_DOMAIN_ERROR);
		}

		// URL validation
		if (!isURL(url, urlValidationOptions)) {
			throw new Error(i18n.URL_VALIDATION_ERROR);
		}

		// Request details
		const body = {
			url: url,
			domain: domain,
			user_id: Store.USER.ID,
			token: Store.USER.token
		};
		if (slug) {
			// Slug validation
			if (slug.startsWith('-') || slug.endsWith('-')) {
				throw new Error(i18n.SLUG_HYPHEN_ERROR);
			}
			if (!isAlphanumeric(slug, 'en-US', { ignore: '-_' })) {
				throw new Error(i18n.SLUG_VALIDATION_ERROR);
			}
			body.slug = slug;
		}

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
					if (!Store.USER.is_premium) {
						return Limits.upgradeModal('Custom Slug');
					} else {
						const parent = Selectors.LINK_MODE_SWITCHER.closest(this.constants.CREATE_SECTION_CLASSNAME);

						slug = parent.querySelector(this.constants.SLUG_FIELD_CLASSNAME).value.trim();
						if (!slug || slug.length === 0) {
							throw new Error(i18n.EMPTY_SLUG_ERROR);
						}
					}
				}

				// Initialise API request
				const response = await this.syncWithAPI(url, domain, slug);

				// Add newly generated link
				this.addNewEntry(response);
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
					if (!Store.USER.is_premium) {
						return Limits.upgradeModal('Custom Slug');
					} else {
						const parent = Selectors.LINK_MODE_SWITCHER.closest(this.constants.CREATE_SECTION_CLASSNAME);

						slug = parent.querySelector(this.constants.SLUG_FIELD_CLASSNAME).value;
						if (!slug || slug.length === 0) {
							throw new Error(i18n.EMPTY_SLUG_ERROR);
						}
					}
				}

				// Initialise API request
				const response = await this.syncWithAPI(tab.url, domain, slug);

				// Add newly generated link
				this.addNewEntry(response);
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
					Processing.show(document.body);

					let target = e.target;
					if (target.nodeName === 'IMG') {
						target = e.target.parentElement;
					}

					const domain = target.getAttribute('data-domain');
					const slug = target.getAttribute('data-slug');

					await Common.QRCodeModal(domain, slug);
				} catch (error) {
					console.error(error);
					Notification.error(error.message ?? i18n.DEFAULT_ERROR);
				} finally {
					Processing.hide();
				}
			});
		}
	},
	modeSwitcherEvent: function () {
		if (!Selectors.LINK_MODE_SWITCHER) return;

		Selectors.LINK_MODE_SWITCHER.addEventListener('click', e => {
			e.preventDefault();

			try {
				const mode = e.target.getAttribute('data-mode');
				const toggle = (mode === 'auto') ? 'manual' : 'auto';
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
