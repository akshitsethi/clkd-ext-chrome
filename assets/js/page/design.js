// page/design.js
import { i18n } from "../i18n.js";
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";

export const Design = {
    constants: {
        FIELDS: [
            'radioThumbnailDesign',
            'radioProfileFont',
            'colorProfileTitle',
            'colorProfileText',
            'radioBackground',
            'radioSocialPosition',
            'colorSocialIcon',
            'radioButtonFill',
            'radioButtonCorner',
            'radioButtonBorder',
            'radioButtonFont',
            'colorButtonBackground',
            'colorButtonText',
            'radioButtonShadow',
            'colorButtonShadow',
            'radioButtonShadowPosition',
            'rangeButtonShadowThickness',
            'rangeButtonShadowOpacity'
        ],
    },
    render: function() {
        for (const [key, value] of Object.entries(Page.get('design'))) {
            if (!value) continue;

            const selector = key.includes('radio') ? document.querySelectorAll(`#design input[name=${key}]`) : document.querySelector(`#design input[name=${key}]`);
            if (!selector) continue;

            // Check if key.includes('image') and show the image on screen
            // instead of updating value to the file input
            if (key.includes('thumbnail')) {
                // this.linkedImageOptions(id, selector);
                // continue;
            }

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
            Page.set('design', e.target.value.trim(), e.target.name);
            Page.save();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        }
    },
    saveEvent: function() {
        if (!Selectors.DESIGN_FORM_INPUTS.length) return;

        for (const input of Selectors.DESIGN_FORM_INPUTS) {
            input.addEventListener('change', async e => await this.save(e));
        }
    },
    events: function() {
        this.saveEvent();
    }
};
