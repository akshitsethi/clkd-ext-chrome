// page/preview.js
import { Processing } from "../processing.js";
import { Store } from "../store.js";
import { i18n } from "../i18n.js";
import { defaultPageOptions, storageBase } from "../constants.js";

export const Preview = {
    constants: {
        WRAPPER_CLASSNAME: '.wrapper',
        ERROR_SCREEN_CLASSNAME: '.error-screen'
    },
    SELECTORS: {
        html: document.querySelector('html')
    },
    SLUG: null,
    DOMAIN: null,
    DATA: {
        order: new Map(),
        content: {},
        design: {},
        settings: {},
        social: {
            order: new Map(),
            content: {}
        },
        providers: {}
    },
    get: function(attribute, id = null, subId = null) {
        if (id !== null || subId !== null) {
            return subId !== null ? this.DATA[attribute][id][subId] : this.DATA[attribute][id];
        }

        return this.DATA[attribute];
    },
    render: async function() {
        // Set essential constants (slug and domain)
        this.setSlugAndDomain();

        // Get data stored previously or fetched recently from the remote server
        await this.getStoredData();

        // Make preview visible
        document.querySelector(this.constants.WRAPPER_CLASSNAME).style.display = 'block';
    },
    setSlugAndDomain: function() {
        const url = new URL(window.location.href);
        this.SLUG = url.searchParams.get('slug');
        this.DOMAIN = url.searchParams.get('domain');

        if (!this.SLUG || !this.DOMAIN) {
            this.showErrorScreen('error', i18n.PAGE_URL_ERROR);
        }

        // Everything looks good, update page title
        document.title = document.title.replace('Preview for {slug}', `${this.SLUG} at ${this.DOMAIN}`);
    },
    getStoredData: async function() {
        const data = await Store.get(`${this.SLUG}|${this.DOMAIN}`);

        // If the data does not exist, the default value will be used
        if (data && data.hasOwnProperty(`${this.SLUG}|${this.DOMAIN}`)) {
            this.DATA = data[`${this.SLUG}|${this.DOMAIN}`];
        }
    },
    showErrorScreen(error) {
        document.querySelector(this.constants.ERROR_SCREEN_CLASSNAME).style.display = 'flex';

        // Replace title
        document.title = document.title.replace('{slug}', 'Error');

        // Throw error to stop further execution
        throw new Error(error);
    },
    updateBackgroundEvent: function() {
        if (!this.DATA.design.hasOwnProperty('radioBackground') || !this.DATA.design.radioBackground) return;

        const background = this.DATA.design.radioBackground;
        if (background === 'color') {
            if (!this.DATA.design.hasOwnProperty('colorBackground') || !this.DATA.design.colorBackground) {
                this.DATA.design.colorBackground = defaultPageOptions.design.colorBackground;
            }
            this.SELECTORS.html.style.backgroundColor = this.DATA.design.colorBackground;
        } else if (background === 'gradient') {
            const gradientData = {
                colorBackgroundGradientOne: null,
                colorBackgroundGradientTwo: null,
                rangeBackgroundGradientAngle: 0
            };
            for (const field of Object.keys(gradientData)) {
                gradientData[field] = this.DATA.design[field] ?? defaultPageOptions.design[field];
            }

            this.SELECTORS.html.style.backgroundImage = `linear-gradient(${this.DATA.design.rangeBackgroundGradientAngle}deg, ${this.DATA.design.colorBackgroundGradientOne} 0%, ${this.DATA.design.colorBackgroundGradientTwo} 100%)`;
        } else if (background === 'pattern') {
            
        } else if (background === 'image') {
            if (!this.DATA.design.hasOwnProperty('imageBackground') || !this.DATA.design.imageBackground.hasOwnProperty('slug') || !this.DATA.design.imageBackground.slug) return;
            this.SELECTORS.html.style.backgroundImage = `url(${storageBase}${this.DATA.design.imageBackground.slug})`;
            this.SELECTORS.html.classList.add('image-background');
        } else if (background === 'video') {
            if (!this.DATA.design.hasOwnProperty('videoBackground') || !this.DATA.design.videoBackground.hasOwnProperty('slug') || !this.DATA.design.videoBackground.slug) return;
            
        }
    },
    events: function() {
        this.updateBackgroundEvent();
    },
    init: async function() {
        try {
            Processing.show();

            // Render preview
            await this.render();

            // Event listeners
            this.events();
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                Processing.hide();
            }, 500);
        }
    }
};

// Execute JS once DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
    Preview.init();
});
