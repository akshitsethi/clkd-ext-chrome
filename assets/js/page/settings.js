// page/settings.js
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";
import { debounce } from "../helper.js";

export const Settings = {
    constants: {
        FIELDS: [
            'metaTitle',
            'metaDescription'
        ]
    },
    render: function() {
        for (const [key, value] of Object.entries(Page.get('settings'))) {
            if (!value) continue;

            const selector = key.includes('radio') ? document.querySelectorAll(`#settings input[name=${key}]`) : document.querySelector(`#settings input[name=${key}]`);
            if (!selector) continue;

            if (key.includes('status')) {
                if (value === 'on') selector.setAttribute('checked', 'checked');
            } else if (key.includes('radio')) {
                selector.forEach(radio => radio.value === value && radio.setAttribute('checked', 'checked'));
            } else {
                selector.value = value;
            }
        }
    },
    save: async function(e) {
        try {
            if (!this.constants.FIELDS.includes(e.target.name)) {
                throw new Error(i18n.MALFORMED_REQUEST);
            }

            // Set value and save data
            if (e.target.name.includes('status')) {
                Page.set('settings', e.target.checked ? 'on' : 'off', e.target.name);
            } else {
                Page.set('settings', e.target.value.trim(), e.target.name);
            }

            Page.save();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        }
    },
    saveEvent: function() {
        if (!Selectors.SETTINGS_FORM_INPUTS.length) return;

        // Create a Debounced Version of the Handler
        const debouncedHandleKeyUp = debounce(async (e) => {
            await this.save(e);
        });

        for (const input of Selectors.SETTINGS_FORM_INPUTS) {
            if (input.type === 'checkbox') {
                input.addEventListener('change', async e => await this.save(e));
            } else if (input.type === 'text') {
                input.addEventListener('keyup', debouncedHandleKeyUp);
            }
        }
    },
    events: function() {
        this.saveEvent();
    }
};
