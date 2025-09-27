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
import { Limits } from "./limits.js";

export const Pages = {
    createPageFormEvent: function () {
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
				this.addNewLink(response);
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
