// page/design.js
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
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
            'colorBackground',
            'colorBackgroundGradientOne',
            'colorBackgroundGradientTwo',
            'rangeBackgroundGradientAngle',
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
        ]
    },
    render: function() {
        for (const [key, value] of Object.entries(Page.get('design'))) {
            if (!value) continue;

            // Check if key.includes('thumbnail') and show the image on screen
            // instead of updating value to the file input
            if (key.includes('thumbnail')) {
                this.renderThumbnail(value);
                continue;
            }

            const selector = key.includes('radio') ? document.querySelectorAll(`#design input[name=${key}]`) : document.querySelector(`#design input[name=${key}]`);
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
    renderThumbnail: function(thumbnail) {
        if (!thumbnail || !(thumbnail.hasOwnProperty('url'))) return;

        Selectors.PROFILE_THUMBNAIL_CONTAINER.setAttribute('src', thumbnail.url);
    },
    applyGradient: function(input) {
        const gradientSettings = JSON.parse(input.getAttribute('data-preset'));
        for (const [key, value] of Object.entries(gradientSettings)) {
            const selector = document.querySelector(`#design input[name="${key}"]`);
            if (!selector) continue;

            selector.value = value;
            Page.set('design', value, key);
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
    inlineActionEvent: function() {
        if (!Selectors.DESIGN_INLINE_ACTIONS.length) return;

        Selectors.DESIGN_INLINE_ACTIONS.forEach(action => action.addEventListener('click', e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName === 'IMG') {
                    target = e.target.parentElement;
                }

                const action = target.getAttribute('data-action');
                if (!action) {
                    throw new Error(i18n.MALFORMED_REQUEST);
                }

                const parentEl = target.closest('.actions');
                const actionEl = parentEl.querySelector(`#${action}`);
                if (!actionEl) {
                    throw new Error(i18n.SELECTOR_NOT_FOUND);
                }

                // Toggle arrows
                target.querySelectorAll('.arrow').forEach(img => img.classList.toggle('show'));

                actionEl.classList.toggle('show');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    presetApplyEvent: function() {
        if (!Selectors.DESIGN_PRESET_ITEMS.length) return;

        Selectors.DESIGN_PRESET_ITEMS.forEach(preset => preset.addEventListener('click', e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName === 'IMG') {
                    target = e.target.parentElement;
                }

                const parentEl = target.closest('.actions');

                // Apply preset
                const presetType = parentEl.querySelector('.presets').getAttribute('data-preset');
                if (presetType === 'gradient') {
                    this.applyGradient(target);
                }

                // After apply preset, hide popup
                parentEl.querySelector('.action-popup').classList.toggle('show');

                // Toggle arrows
                parentEl.querySelectorAll('.arrow').forEach(img => img.classList.toggle('show'));

                // Save data and show notificiation
                Page.save();
                Notification.success(i18n.GRADIENT_PRESET_APPLIED);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    openFileDialogEvent: function() {
        if (!Selectors.DESIGN_FILE_SELECTORS.length) return;

        Selectors.DESIGN_FILE_SELECTORS.forEach(input => input.addEventListener('click', e => {
            e.preventDefault();

            try {
                
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    saveEvent: function() {
        if (!Selectors.DESIGN_FORM_INPUTS.length) return;

        for (const input of Selectors.DESIGN_FORM_INPUTS) {
            input.addEventListener('change', async e => await this.save(e));
        }
    },
    events: function() {
        this.inlineActionEvent();
        this.presetApplyEvent();
        this.openFileDialogEvent();
        this.saveEvent();
    }
};
