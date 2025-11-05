// page/design.js
import { storageBase } from "../constants.js";
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
import { Processing } from "../processing.js";
import { Upload } from "../upload.js";
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";

export const Design = {
    constants: {
        FIELDS: [
            'radioThumbnailDesign',
            'statusWhiteLabel',
            'radioProfileFont',
            'colorProfileTitle',
            'colorProfileText',
            'radioBackground',
            'colorBackground',
            'colorBackgroundGradientOne',
            'colorBackgroundGradientTwo',
            'rangeBackgroundGradientAngle',
            'imageBackground',
            'videoBackground',
            'rangeBackdropBlur',
            'rangeBackdropOpacity',
            'rangeBackdropNoise',
            'colorBackdrop',
            'radioSocialPosition',
            'colorSocialIcon',
            'radioButtonFill',
            'radioButtonCorner',
            'radioButtonBorder',
            'rangeButtonBorderThickness',
            'colorButtonBorder',
            'radioButtonFont',
            'colorButtonBackground',
            'colorButtonText',
            'rangeButtonSpacing',
            'radioButtonShadow',
            'colorButtonShadow',
            'radioButtonShadowPosition',
            'rangeButtonShadowThickness',
            'rangeButtonShadowOpacity',
            'radioButtonEffect'
        ],
        INLINE_OPTIONS: [
            'color',
            'gradient',
            'image',
            'video'
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
            if (key.includes('image') || key.includes('video')) {
                this.showUploadedMedia(value, key.substring(0,5));
                continue;
            }

            // Show `inline-section` as per the selected option
            if (key === 'radioBackground') {
                this.showInlineSection(value);
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
    showInlineSection: function(value) {
        if (!this.constants.INLINE_OPTIONS.includes(value)) return;

        const sectionEl = document.querySelector(`#design #${value}`);
        if (!sectionEl) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        Selectors.DESIGN_INLINE_SECTIONS.forEach(section => section.style.display = 'none');
        sectionEl.style.display = 'block';

        // Show `backdrop` settings only for image and video options
        const backdropEl = document.querySelector('#design .backdrop');
        if (['image', 'video'].includes(value)) {
            backdropEl.style.display = 'block';
        } else {
            backdropEl.style.display = 'none';
        }
    },
    save: async function(e) {
        try {
            if (!this.constants.FIELDS.includes(e.target.name)) {
                throw new Error(i18n.MALFORMED_REQUEST);
            }

            // Set value and save data
            if (e.target.name.includes('status')) {
                Page.set('design', e.target.checked ? 'on' : 'off', e.target.name);
            } else {
                Page.set('design', e.target.value.trim(), e.target.name);
            }

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
                const parentEl = e.target.closest('.file-selector');
                const inputEl = parentEl.querySelector('input[type="file"]');
                if (!inputEl) {
                    throw new Error(i18n.SELECTOR_NOT_FOUND);
                }

                inputEl.click();
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));

        // Listen to file change event
        Selectors.DESIGN_FILE_SELECTORS.forEach(selector => {
            const parentEl = selector.closest('.file-selector');
            const responseEl = parentEl.querySelector('.error');
            const inputEl = parentEl.querySelector('input[type="file"]');
            if (!inputEl) {
                throw new Error(i18n.SELECTOR_NOT_FOUND);
            }

            inputEl.addEventListener('change', async e => {
                e.preventDefault();

                try {
                    Processing.show(parentEl, 'absolute');

                    if (!e.target.files.length) {
                        throw new Error(i18n.NO_FILE_SELECTED);
                    }

                    const type = parentEl.getAttribute('data-type');
                    if (!type || !Upload.FILE_TYPES.includes(type)) {
                        throw new Error(i18n.MALFORMED_REQUEST);
                    }

                    // Get file
                    const file = e.target.files.item(0);

                    if (!Upload.FILE_MIME_TYPES[type].includes(file.type)) {
                        throw new Error(i18n.FILETYPE_NOT_SUPPORTED);
                    }
                    if (file.size > Upload.MAX_FILE_SIZE[type]) {
                        throw new Error(i18n.FILE_SIZE_EXCEEDED);
                    }

                    // Send upload request to API
                    const response = await Upload.postRequest(file, 'file');

                    // Set data and save it locally
                    Page.set('design', response.message, `${type}Background`);
                    Page.save();

                    // Show media in it's respective area
                    this.showUploadedMedia(response.message, type);

                    // Hide response `div` on successful completion
                    Notification.success(i18n.MEDIA_UPLOADED);
                    responseEl.style.display = 'none';
                } catch(error) {
                    console.error(error);
                    Notification.error(error.message ?? i18n.DEFAULT_ERROR);

                    // Show response within file selector
                    responseEl.innerText = error.message ?? i18n.DEFAULT_ERROR;
                    responseEl.style.display = 'block';
                } finally {
                    Processing.hide();
                }
            });
        });
    },
    showUploadedMedia: function(data, type) {
        const previewEl = document.querySelector(`#design .grid-content.custom-${type}`);
        if (!previewEl) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        if (type === 'video') {
            // Check for existing `video` element
            const video = previewEl.querySelector('video');
            if (video) video.remove();

            const videoEl = document.createElement('video');
            videoEl.setAttribute('src', `${storageBase}${data.slug}`);
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.muted = true;

            previewEl.append(videoEl);
        } else {
            previewEl.style.backgroundImage = `url("${storageBase}${data.slug}")`;
        }
    },
    changeBackgroundOptionEvent: function() {
        if (!Selectors.DESIGN_BACKGROUND_OPTIONS.length) return;

        Selectors.DESIGN_BACKGROUND_OPTIONS.forEach(selector => selector.addEventListener('click', e => {
            try {
                this.showInlineSection(e.target.value);
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
        this.changeBackgroundOptionEvent();
        this.saveEvent();
    }
};
