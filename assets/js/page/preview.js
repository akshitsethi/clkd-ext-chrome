// page/preview.js
import { Processing } from "../processing.js";
import { Store } from "../store.js";
import { i18n } from "../i18n.js";
import { defaultPageOptions, embedProviders, googleApiKey, googleFonts, storageBase } from "../constants.js";
import { isURL } from "validator";
import { getShadowCSSValue } from "../helper.js";

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
    BUTTON_FIELDS: {
        'fill': 'radioButtonFill',
        'background-color': 'colorButtonBackground',
        'text-color': 'colorButtonText',
        'corner': 'rangeButtonCorner',
        'spacing': 'rangeButtonSpacing',
        'font': 'radioButtonFont',
        'border': 'radioButtonBorder',
        'border-width': 'rangeButtonBorderThickness',
        'border-color': 'colorButtonBorder',
        'shadow': 'radioButtonShadow',
        'shadow-color': 'colorButtonShadow',
        'shadow-direction': 'radioButtonShadowPosition',
        'shadow-width': 'rangeButtonShadowThickness',
        'shadow-opacity': 'rangeButtonShadowOpacity',
        'effect': 'radioButtonEffect',
        'font-weight': 'weight', // Exception for button font weight
        'font-fallback': 'fallback' // Exception for fetching Google font fallback
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
    API_URL: {
        youtube: 'https://www.youtube.com/embed',
        vimeo: 'https://player.vimeo.com/video'
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
    addProfileData: function() {
        this.addThumbnail();
        this.addTitleAndBio();
    },
    addThumbnail: function() {
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
    addTitleAndBio: function() {
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

        for (const [slotId, contentId] of this.DATA.order) {
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
                if (data.type === 'link') {
                    content = this.processLink(parentEl, content, data);
                } else {
                    content = this.processContentType(data.type, contentId, parentEl, content, data);
                }

                // Append to content container
                this.selectors.LINKS_CONTAINER.appendChild(content);
            }
        }

        // Set data attributes on the parent container
        for (const [key, value] of Object.entries(this.BUTTON_FIELDS)) {
            // Handle font-weight and fallback exceptions
            if (['font', 'font-weight', 'font-fallback'].includes(key)) {
                const font = this.DATA.design.radioButtonFont ?? defaultPageOptions.design.radioButtonFont;
                const fontObj = googleFonts[font];

                if (key === 'font-fallback') {
                    this.selectors.LINKS_CONTAINER.setAttribute(`data-${key}`, fontObj.fallback);
                } else if (key === 'font-weight') {
                    this.selectors.LINKS_CONTAINER.setAttribute(`data-${key}`, fontObj.weight.title);
                } else {
                    this.selectors.LINKS_CONTAINER.setAttribute(`data-${key}`, font.replace('+', ' '));
                }
            } else {
                this.selectors.LINKS_CONTAINER.setAttribute(`data-${key}`, this.DATA.design[value] ?? defaultPageOptions.design[value]);
            }
        }
    },
    processLink: function(parentEl, content, data) {
        // Default button class
        const anchorEl = parentEl.querySelector('a');
        anchorEl.classList.add('button', this.DATA.design.radioButtonEffect ?? defaultPageOptions.design.radioButtonEffect);
        anchorEl.appendChild(document.createTextNode(data.title));
        anchorEl.setAttribute('href', data.url);

        return content;
    },
    processContentType: function(provider, id, parentEl, content, data) {
        if (!provider || !(Object.keys(embedProviders).includes(provider))) return;

        // Remove defaut anchor link
        content.querySelector('a').remove();
        content.querySelector('.share').remove();

        // Execute embed specific function
        return this[provider](id, parentEl, content, data);
    },
    youtube: function(id, parentEl, content, data) {
        return this.video('youtube', id, parentEl, content, data);
    },
    vimeo: function(id, parentEl, content, data) {
        return this.video('vimeo', id, parentEl, content, data);
    },
    googlemaps: function(id, parentEl, content, data) {
        const containerEl = document.createElement('div');

        if (data.hasOwnProperty('url') && data.url) {
            if (data.title) {
                const titleEl = document.createElement('p');
                titleEl.classList.add('title');
                titleEl.appendChild(document.createTextNode(data.title));

                parentEl.appendChild(titleEl);
            }

            containerEl.classList.add('googlemaps-container', 'oembed');

            // Get data URL
            const query = data.url.replace(' ', '+');
            const iframeEl = document.createElement('iframe');
            iframeEl.setAttribute('src', `https://www.google.com/maps/embed/v1/place?q=${query}&maptype=${data.radioMapType}&zoom=${data.rangeMapZoom}&key=${googleApiKey}`);
            iframeEl.setAttribute('width', '100%');
            iframeEl.setAttribute('height', '240');
            iframeEl.setAttribute('loading', 'lazy');
            iframeEl.setAttribute('style', 'border:0');
            iframeEl.allowFullscreen = true;

            containerEl.appendChild(iframeEl);
        }

        parentEl.appendChild(containerEl);
        return content;
    },
    twitter: function(id, parentEl, content, data) {
        return this.embed('twitter', id, parentEl, content, data);
    },
    soundcloud: function(id, parentEl, content, data) {
        return this.embed('soundcloud', id, parentEl, content, data);
    },
    tiktok: function(id, parentEl, content, data) {
        return this.embed('tiktok', id, parentEl, content, data);
    },
    spotify: function(id, parentEl, content, data) {
        return this.embed('spotify', id, parentEl, content, data);
    },
    video: function(provider, id, parentEl, content, data) {
        // Start with an empty title and see if user has provided one
        let title = null;
        if (data.title) {
            title = data.title;
        }

        // Check if video title is enabled, else show the user defined one
        if (
            data.hasOwnProperty('statusEmbedTitle')
            && data.statusEmbedTitle === 'on'
            && this.DATA.providers.hasOwnProperty(id)
            && this.DATA.providers[id].hasOwnProperty('title')
        ) {
            title = this.DATA.providers[id].title;
        }

        // Insert title if it exists
        if (title) {
            const titleEl = document.createElement('p');
            titleEl.classList.add('title');
            titleEl.appendChild(document.createTextNode(title));

            parentEl.appendChild(titleEl);
        }

        // iframe
        const containerEl = document.createElement('div');
        containerEl.classList.add(`${provider}-container`, 'oembed');

        // Add player specific data
        // i.e. set content if iframe html exists
        // else fallback to creating iframe element and adding required values
        if (this.DATA.providers.hasOwnProperty(id) && this.DATA.providers[id].hasOwnProperty('html')) {
            containerEl.insertAdjacentHTML('beforeend', this.DATA.providers[id].html);
        } else if (data.hasOwnProperty('url') && isURL(data.url)) {
            const url = new URL(data.url);
            const videoId = provider === 'youtube' ? url.searchParams.get('v') : url.pathname.replace(/^\/|\/$/g, '');
            if (videoId) {
                const iframeEl = document.createElement('iframe');
                iframeEl.setAttribute('src', `${this.API_URL[provider]}/${videoId}?feature=oembed`);
                iframeEl.setAttribute('frameborder', '0');
                iframeEl.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframeEl.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                iframeEl.allowFullscreen = true;

                containerEl.appendChild(iframeEl);
            }
        }

        parentEl.appendChild(containerEl);
        return content;
    },
    embed: function(provider, id, parentEl, content, data) {
        if (this.DATA.providers.hasOwnProperty(id) && this.DATA.providers[id].hasOwnProperty('html')) {
            if (data.title) {
                const titleEl = document.createElement('p');
                titleEl.classList.add('title');
                titleEl.appendChild(document.createTextNode(data.title));

                parentEl.appendChild(titleEl);
            }

            const containerEl = document.createElement('div');
            containerEl.classList.add(`${provider}-container`, 'oembed');
            containerEl.innerHTML = this.DATA.providers[id].html;

            parentEl.appendChild(containerEl);
        }

        return content;
    },
    getFontCSS: function() {
        return [];
    },
    getButtonShadowCSS: function() {
        if (
            !this.DATA.design.hasOwnProperty('radioButtonShadow')
            || !this.DATA.design.radioButtonShadow
            || this.DATA.design.radioButtonShadow === 'none'
        ) return [];

        const css = ['.button{'];

        // Default styles
        const shadow = getShadowCSSValue(
            this.DATA.design.radioButtonShadow,
            this.DATA.design.colorButtonShadow,
            this.DATA.design.radioButtonShadowPosition,
            this.DATA.design.rangeButtonShadowOffset,
            this.DATA.design.rangeButtonShadowThickness,
            this.DATA.design.rangeButtonShadowOpacity
        );

        css.push(`box-shadow:${shadow};`);
        css.push('}');

        return css;
    },
    getFontEl: function(font) {
        // Validate if font exists
        if (!googleFonts.hasOwnProperty(font)) return;

        // Check for font weights
        const fontObj = googleFonts[font];

        // Replace spaces with plus signs for the URL
        const fontUrl = `https://fonts.googleapis.com/css2?family=${font}:wght@${fontObj.weight.text === fontObj.weight.title ? fontObj.weight.text : `${fontObj.weight.text};${fontObj.weight.title}`}&display=swap`;

        // Create a new link element
        const linkEl = document.createElement('link');

        // Set attributes for the link element
        linkEl.rel = 'stylesheet';
        linkEl.href = fontUrl;

        return linkEl;
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
    generateFontStylesheetEvent: function() {
        const profileFont = this.DATA.design.radioProfileFont ?? defaultPageOptions.design.radioProfileFont;
        const buttonFont = this.DATA.design.radioButtonFont ?? defaultPageOptions.design.radioButtonFont;

        // Insert profile font
        document.head.appendChild(this.getFontEl(profileFont));

        // Check whether to add a single font or multiple
        if (profileFont !== buttonFont) {
            document.head.appendChild(this.getFontEl(buttonFont));
        }
    },
    generateCssEvent: function() {
        const css = ['<style>'];

        // Generate CSS for different options
        css.push(...this.getFontCSS());
        css.push(...this.getButtonShadowCSS());

        // Add closing tag
        css.push('</style>');

        // Once generated, add it to `head` tag
        document.head.insertAdjacentHTML('beforeend', css.join(''));
    },
    events: function() {
        this.updateBackgroundEvent();
        this.generateFontStylesheetEvent();
        this.generateCssEvent();
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
