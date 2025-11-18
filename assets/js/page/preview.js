// page/preview.js
import CssFilterConverter from "css-filter-converter";
import { Processing } from "../processing.js";
import { Store } from "../store.js";
import { i18n } from "../i18n.js";
import { embedProviders, googleApiKey, googleFonts, socialIcons, storageBase } from "../constants.js";
import { isURL } from "validator";
import { getShadowCSSValue, hexToRgb } from "../helper.js";

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
        LINKS_CONTAINER: document.querySelector('.links'),
        SOCIAL_TEMPLATE: document.querySelector('#social-item-entry'),
        HEADER_LOGO: document.querySelector('.header .logo'),
        FOOTER: document.querySelector('.footer')
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

        // Update domain
        this.updateDomain();

        // Building page content
        this.addProfileData();

        // Add social & links data
        this.addLinksData();
        this.addSocialData();

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
    updateDomain: function() {
        this.selectors.HEADER_LOGO.setAttribute('src', `https://${this.DOMAIN}/`);

        // Update logo img
        const img = this.selectors.HEADER_LOGO.querySelector('img');
        img.setAttribute('src', `./assets/images/domains/${this.DOMAIN}.svg`);
        img.setAttribute('alt', this.DOMAIN);
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
        if (!Object.keys(this.DATA.social.order).length || !Object.keys(this.DATA.social.content).length) return;

        const socialEl = document.createElement('div');
        socialEl.classList.add('social', this.DATA.design.radioSocialPosition);

        // Counter for icons displayed
        let counter = 0;

        for (const [slotId, contentId] of this.DATA.social.order) {
            if (!this.DATA.social.content.hasOwnProperty(contentId)) continue;

            const data = this.DATA.social.content[contentId];

            if (!data.status || data.status === 'off') continue;
            if (!data.url || !isURL(data.url)) continue;

            // Add unique identifier to parent `div`
            const template = this.selectors.SOCIAL_TEMPLATE.content;

            let content = template.cloneNode(true);
            const linkEl = content.querySelector('.social-data');
            linkEl.setAttribute('id', contentId);

            // Set `href` attribute based on network
            if (data.icon === 'email') {
                linkEl.setAttribute('href', `mailto:${data.url}`);
            } else if (data.icon === 'phone') {
                linkEl.setAttribute('href', `tel:+${data.url}`);
            } else if (data.icon === 'whatsapp') {
                linkEl.setAttribute('href', `https://wa.me/${data.url}`);
            } else if (data.icon === 'threads' || data.icon === 'tiktok') {
                linkEl.setAttribute('href', data.icon === 'threads' ? `https://www.threads.com/${data.url}`: `https://www.tiktok.com/${data.url}`);
            } else {
                linkEl.setAttribute('href', data.url);
            }

            const icon = linkEl.querySelector('img');
            icon.setAttribute('src', `./assets/images/social/${data.icon}.svg`);
            icon.setAttribute('alt', socialIcons[data.icon].name);

            // Append to content container
            socialEl.appendChild(content);

            ++counter;
        }

        // Append the social container if there are icons to display
        if (counter) {
            // Parent node
            const parentEl = this.selectors.PROFILE.parentNode;
    
            // Append based on selected position
            if (this.DATA.design.radioSocialPosition === 'top') {
                parentEl.insertBefore(socialEl, this.selectors.PROFILE.nextSibling);
            } else {
                parentEl.insertBefore(socialEl, this.selectors.LINKS_CONTAINER.nextSibling);
            }
        }
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
    },
    processLink: function(parentEl, content, data) {
        // Default button class
        const anchorEl = parentEl.querySelector('a');
        anchorEl.classList.add('button', this.DATA.design.radioButtonEffect);
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
    getProfileCss: function() {
        const css = ['.profile-content h1{'];

        // h1 (font and color)
        const font = googleFonts[this.DATA.design.radioProfileFont];
        css.push(`font-family:${this.DATA.design.radioProfileFont.replaceAll('+', ' ')},${font.fallback};`);
        css.push(`font-weight:${font.weight.title};`);
        css.push(`color:${this.DATA.design.colorProfileTitle};`);
        css.push('}');

        // Bio
        css.push('.profile-content .bio{');
        css.push(`color:${this.DATA.design.colorProfileText};`);
        css.push('}');

        return css;
    },
    getButtonCss: function() {
        // Container (for button spacing)
        const css = ['.links{'];
        css.push(`gap:${this.DATA.design.rangeButtonSpacing}px;`);
        css.push('}');

        // Button
        css.push('.button{');

        // Font attributes
        const font = googleFonts[this.DATA.design.radioButtonFont];
        css.push(`font-family:${this.DATA.design.radioButtonFont.replaceAll('+', ' ')},${font.fallback};`);
        css.push(`font-weight:${font.weight.text};`);

        // Colors (background and text)
        css.push(`background-color:${this.DATA.design.radioButtonFill === 'solid' ? this.DATA.design.colorButtonBackground : 'transparent'};`);
        css.push(`color:${this.DATA.design.colorButtonText};`);

        // Border
        if (this.DATA.design.radioButtonBorder !== 'none') {
            css.push(`border:${this.DATA.design.rangeButtonBorderThickness}px ${this.DATA.design.radioButtonBorder} ${this.DATA.design.colorButtonBorder};`);
        }

        // Border radius
        css.push(`border-radius:${this.DATA.design.rangeButtonCorner}px;`);

        // Box shadow
        if (this.DATA.design.radioButtonShadow !== 'none') {
            const shadow = getShadowCSSValue(
                this.DATA.design.radioButtonShadow,
                this.DATA.design.colorButtonShadow,
                this.DATA.design.radioButtonShadowPosition,
                this.DATA.design.rangeButtonShadowOffset,
                this.DATA.design.rangeButtonShadowThickness,
                this.DATA.design.rangeButtonShadowOpacity
            );
            css.push(`box-shadow:${shadow};`);
        }
        css.push('}');

        return css;
    },
    getSocialCss: function() {
        const css = [`.social img{filter:${CssFilterConverter.hexToFilter(this.DATA.design.colorSocialIcon).color};}`];

        return css;
    },
    getBackdropCss: function() {
        const css = ['.filter{']
        css.push(`background-color:rgba(${hexToRgb(this.DATA.design.colorBackdrop)},${this.DATA.design.rangeBackdropOpacity});`);
        css.push(`backdrop-filter:blur(${this.DATA.design.rangeBackdropBlur}px);`);
        css.push('}');

        // Noise
        if (['image','video'].includes(this.DATA.design.radioBackground) && this.DATA.design.statusBackdropNoise === 'on') {
            css.push(`.noise{display:block;}`);
        }

        return css;
    },
    getHeroCss: function() {
        return [];
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
            this.selectors.HTML.style.backgroundColor = this.DATA.design.colorBackground;
        } else if (background === 'gradient') {
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
        // Insert profile font
        document.head.appendChild(this.getFontEl(this.DATA.design.radioProfileFont));

        // Check whether to add a single font or multiple
        if (this.DATA.design.radioProfileFont !== this.DATA.design.radioButtonFont) {
            document.head.appendChild(this.getFontEl(this.DATA.design.radioButtonFont));
        }
    },
    generateCssEvent: function() {
        const css = ['<style>'];

        // Generate CSS for different options
        css.push(...this.getProfileCss());
        css.push(...this.getButtonCss());
        css.push(...this.getSocialCss());
        css.push(...this.getBackdropCss());
        css.push(...this.getHeroCss());

        // Add closing tag
        css.push('</style>');

        // Once generated, add it to `head` tag
        document.head.insertAdjacentHTML('beforeend', css.join(''));
    },
    whiteLabelEvent: function() {
        if (!this.DATA.design.statusWhiteLabel || this.DATA.design.statusWhiteLabel === 'off') {
            this.selectors.HEADER_LOGO.style.display = 'inline-block';
            this.selectors.FOOTER.style.display = 'block';
        }
    },
    events: function() {
        this.updateBackgroundEvent();
        this.generateFontStylesheetEvent();
        this.generateCssEvent();
        this.whiteLabelEvent();
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
