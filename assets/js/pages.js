// pages.js
import DataTable from "datatables.net";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Store } from "./store.js";
import { apiBase } from "./constants.js";
import { Selectors } from "./selectors.js";
import { i18n } from "./i18n.js";
import { User } from "./user.js";
import { Common } from "./common.js";
import { Modal } from "./modal.js";
import { Single } from "./single.js";
import { isAlphanumeric } from "validator";
import { Links } from "./links.js";

export const Pages = {
	constants: {
		DATA_TYPE: 'page',
		OUTPUT_DETAILS_CLASSNAME: '.page-output-details',
		OUTPUT_TEMPLATE_CLASSNAME: '#page-output-template',
		OUTPUT_NEW_PAGE_CLASSNAME: '.new-page',
		OUTPUT_COPY_PAGE_CLASSNAME: '.copy',
		QRCODE_CLASSNAME: '.qrcode',
		ACTION_ANALYTICS_CLASSNAME: '.analytics',
		ACTION_EDIT_CLASSNAME: '.edit',
		ACTION_ARCHIVE_CLASSNAME: '.archive',
		ACTION_RESTORE_CLASSNAME: '.restore',
		SINGLE_PAGE_CLASSNAME: '.page',
		SINGLE_SLUG_CLASSNAME: '.slug',
		SINGLE_DOMAIN_CLASSNAME: '.domain',
		SINGLE_CREATED_CLASSNAME: '.created',
	},
	DATA: [],
	TABLE: {
		active: null,
		archive: null
	},
	archiveRestoreLogic: Links.archiveRestoreLogic,
	singleEvents: Links.singleEvents,
	archiveEvents: Links.archiveEvents,
	analyticsEvent: Links.analyticsEvent,
	editEvent: function (selector) {

	},
	qrcodeEvent: Links.qrcodeEvent,
	archiveEvent: Links.archiveEvent,
	restoreEvent: Links.restoreEvent,
	showNewEntryOutput: Links.showNewEntryOutput,
	addNewEntry: Links.addNewEntry,
	updateDOM: Links.updateDOM,
	populateData: function (type = 'active') {
		// Constants based on table type
		const table = Selectors.PAGES_SECTION[type].querySelector('table');
		const body = table.querySelector('tbody');
		const data = (type === 'active') ? this.DATA.filter(page => !page.is_archive) : this.DATA.filter(page => page.is_archive);

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
				const template = Selectors.PAGE_TEMPLATE[type];
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
				const anchor = content.querySelector(this.constants.SINGLE_PAGE_CLASSNAME);
				anchor.addEventListener('click', e => {
					e.preventDefault();
					chrome.tabs.create({ url: `https://${single.domain}/${single.slug}` });
				});
				anchor.querySelector(this.constants.SINGLE_SLUG_CLASSNAME).appendChild(document.createTextNode(single.slug));
				anchor.querySelector(this.constants.SINGLE_DOMAIN_CLASSNAME).appendChild(document.createTextNode(single.domain));

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
						search: 'Filter Pages',
						entries: {
							_: 'pages',
							1: 'page'
						},
						zeroRecords: 'No matching pages found'
					},
					pageLength: Number(Store.SETTINGS.pages_per_page),
					lengthChange: false,
					autowidth: false,
					order: []
				}
			);

			Selectors.PAGES_SECTION[type].style.display = 'block';
			Selectors.PAGES_NO_DATA_MESSAGE[type].style.display = 'none';
		} else {
			Selectors.PAGES_SECTION[type].style.display = 'none';
			Selectors.PAGES_NO_DATA_MESSAGE[type].style.display = 'block';
		}
	},
	populateArchive: Links.populateArchive,
	fetchFromAPI: Links.fetchFromAPI,
	syncWithAPI: async function (slug, domain) {
		if (!slug || !domain) {
			throw new Error(i18n.SLUG_DOMAIN_ERROR);
		}

		// Slug validation
		if (slug.startsWith('-') || slug.endsWith('-')) {
			throw new Error(i18n.SLUG_HYPHEN_ERROR);
		}
		if (!isAlphanumeric(slug, 'en-US', { ignore: '-_' })) {
			throw new Error(i18n.SLUG_VALIDATION_ERROR);
		}

		// Request details
		const body = {
			slug,
			domain,
			user_id: Store.USER.ID,
			token: Store.USER.token
		};

		const request = await fetch(`${apiBase}/page`, {
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
    createPageFormEvent: function () {
		if (!Selectors.PAGE_FORM) return;

		Selectors.PAGE_FORM.addEventListener('submit', async e => {
			e.preventDefault();

			try {
				Processing.show(document.body);

				// Get domain & slug
				const data = new FormData(e.target);

				// Initialise API request
				const response = await this.syncWithAPI(data.get('slug'), data.get('domain'));

				// Add newly generated page
				this.addNewPage(response);
			} catch (error) {
				console.error(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
    events: function () {
		this.createPageFormEvent();
	},
    init: async function () {
		await this.updateDOM();
	}
};
