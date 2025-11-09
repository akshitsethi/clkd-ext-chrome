// page/preview.js
import { Processing } from "../processing.js";
import { Store } from "../store.js";
import { i18n } from "../i18n.js";
import { defaultPageOptions, storageBase } from "../constants.js";
import { isURL } from "validator";

export const Preview = {
    constants: {
        WRAPPER_CLASSNAME: '.wrapper',
        ERROR_SCREEN_CLASSNAME: '.error-screen'
    },
    selectors: {
        HTML: document.querySelector('html'),
        VIDEO_CONTAINER: document.querySelector('.video-container'),
        PROFILE: document.querySelector('.profile'),
        LINK_TEMPLATE: document.querySelector('#link-item-entry'),
        LINKS_CONTAINER: document.querySelector('.links')
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

        // Building page content
        this.addProfileData();

        // Add social & links data
        this.addSocialData();
        this.addLinksData();

        // Make preview visible
        document.querySelector(this.constants.WRAPPER_CLASSNAME).style.display = 'flex';
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
    addGoogleFontStylesheet: function(fontName) {
        // Replace spaces with plus signs for the URL
        const formattedFontName = fontName.replace(/\s/g, '+');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@400;700&display=swap`;

        // Create a new link element
        const linkEl = document.createElement('link');

        // Set attributes for the link element
        linkEl.rel = 'stylesheet';
        linkEl.href = fontUrl;

        // Append the link element to the document's head
        document.head.appendChild(linkEl);
    },
    updateBackgroundEvent: function() {
        if (!this.DATA.design.hasOwnProperty('radioBackground') || !this.DATA.design.radioBackground) return;

        const background = this.DATA.design.radioBackground;
        if (background === 'color') {
            if (!this.DATA.design.hasOwnProperty('colorBackground') || !this.DATA.design.colorBackground) {
                this.DATA.design.colorBackground = defaultPageOptions.design.colorBackground;
            }
            this.selectors.HTML.style.backgroundColor = this.DATA.design.colorBackground;
        } else if (background === 'gradient') {
            const gradientData = {
                colorBackgroundGradientOne: null,
                colorBackgroundGradientTwo: null,
                rangeBackgroundGradientAngle: 0
            };
            for (const field of Object.keys(gradientData)) {
                gradientData[field] = this.DATA.design[field] ?? defaultPageOptions.design[field];
            }

            this.selectors.HTML.style.backgroundImage = `linear-gradient(${this.DATA.design.rangeBackgroundGradientAngle}deg, ${this.DATA.design.colorBackgroundGradientOne} 0%, ${this.DATA.design.colorBackgroundGradientTwo} 100%)`;
            this.selectors.HTML.classList.add('gradient-background');
        } else if (background === 'pattern') {
            this.selectors.HTML.style.backgroundImage = `url(./assets/images/page/patterns/${this.DATA.design.radioBackgroundPattern}.svg)`;
            this.selectors.HTML.classList.add('pattern-background');
        } else if (background === 'image') {
            if (!this.DATA.design.hasOwnProperty('imageBackground') || !this.DATA.design.imageBackground.hasOwnProperty('slug') || !this.DATA.design.imageBackground.slug) return;
            this.selectors.HTML.style.backgroundImage = `url(${storageBase}${this.DATA.design.imageBackground.slug})`;
            this.selectors.HTML.classList.add('image-background');
        } else if (background === 'video') {
            if (!this.DATA.design.hasOwnProperty('videoBackground') || !this.DATA.design.videoBackground.hasOwnProperty('slug') || !this.DATA.design.videoBackground.slug) return;

            // Empty the existing video (if any)
            this.selectors.VIDEO_CONTAINER.innerHTML = null;

            // Add `video` element to container
            const videoEl = document.createElement('video');
            videoEl.setAttribute('src', `${storageBase}${this.DATA.design.videoBackground.slug}`);

            // Add class to html tag to differentiate the background
            this.selectors.HTML.classList.add('video-background');

            videoEl.muted = true;
            videoEl.autoplay = true;
            videoEl.loop = true;

            this.selectors.VIDEO_CONTAINER.appendChild(videoEl);
        }
    },
    addProfileData: function() {
        this.addProfileThumbnail();
        this.addProfileContent();
    },
    addProfileThumbnail: function() {
        if (!this.DATA.design.hasOwnProperty('radioThumbnailDesign') || !this.DATA.design.radioThumbnailDesign) {
            this.DATA.design.radioThumbnailDesign = defaultPageOptions.design.radioThumbnailDesign;
        }

        const template = document.getElementById(`thumbnail-design-${this.DATA.design.radioThumbnailDesign}`).content;
        const content = template.cloneNode(true);

        // Before starting, let's empty out the container
        const thumbnailEl = this.selectors.PROFILE.querySelector('.profile-thumbnail');
        thumbnailEl.innerHTML = null;

        // Check if image exists
        if (this.DATA.design.hasOwnProperty('thumbnail') && this.DATA.design.thumbnail.hasOwnProperty('slug') && this.DATA.design.thumbnail.slug) {
            content.querySelector('image').setAttribute('xlink:href', `${storageBase}${this.DATA.design.thumbnail.slug}`);
        }

        // Add thumbnail
        thumbnailEl.appendChild(content);
    },
    addProfileContent: function() {
        // Parent container
        // Before proceeding, clear out existing content
        const contentEl = this.selectors.PROFILE.querySelector('.profile-content');
        contentEl.innerHTML = null;

        // Start with heading (it'll always exist no matter what)
        let heading = `@${this.SLUG}`;

        if (this.DATA.design.hasOwnProperty('name') && this.DATA.design.name.length) {
            heading = this.DATA.design.name;
        }

        const headingEl = document.createElement('h1');
        headingEl.appendChild(document.createTextNode(heading));
        contentEl.appendChild(headingEl);

        // Bio, only added if present
        if (this.DATA.design.hasOwnProperty('bio') && this.DATA.design.bio && this.DATA.design.bio.length) {
            const bioEl = document.createElement('p');
            bioEl.classList.add('bio');
            bioEl.appendChild(document.createTextNode(this.DATA.design.bio));

            // Append to content container
            contentEl.appendChild(bioEl);
        }

        this.selectors.PROFILE.appendChild(contentEl);
    },
    addSocialData: function() {

    },
    addLinksData: function() {
        if (!Object.keys(this.DATA.order).length || !Object.keys(this.DATA.content).length) return;

        for (const [slotId, contentId] of this.DATA['order']) {
            if (this.DATA.content.hasOwnProperty(contentId)) {
                const data = this.DATA.content[contentId];

                if (!data.status || data.status === 'off') continue;
                if (data.type !== 'googlemaps' && (!data.url || !isURL(data.url))) continue;
                if (data.type === 'link' && (!data.title || !data.title.length)) continue;

                // Add unique identifier to parent `div`
                const template = this.selectors.LINK_TEMPLATE.content;

                let content = template.cloneNode(true);
                const parentEl = content.querySelector('.link-data');
                parentEl.setAttribute('id', `${data.type}-${contentId}`);

                // Process different content types
                content = this.processLink(parentEl, content, data);
                // if (data.type === 'link') {
                // } else {
                //     content = this.processContentType(data.type, contentId, parentEl, content, data);
                // }

                // Append to content container
                this.selectors.LINKS_CONTAINER.appendChild(content);
            }
        }
    },
    processLink: function(parentEl, content, data) {
        // Default button class
        const classes = ['button'];

        // Create HTML classes
        // for (const [key, value] of Object.entries(this.BUTTON_SETTINGS)) {
        //     classes.push(`button-${key}-${this.DATA.design[value]}`);
        // }

        const anchorEl = parentEl.querySelector('a');
        anchorEl.classList.add(...classes);
        anchorEl.appendChild(document.createTextNode(data.title));
        anchorEl.setAttribute('href', data.url);

        return content;
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
            }, 300);
        }
    }
};

// Execute JS once DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
    Preview.init();
});
