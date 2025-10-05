// page/content.js
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";
import { Notification } from "../notification.js";
import { Store } from "../store.js"
import { i18n } from "../i18n.js";
import { randomString } from "../helper.js";
import { Social } from "./social.js";

export const Content = {
    constants: {
        COMMON_FIELDS: [
            'type',
            'title',
            'url',
            'status'
        ],
        ACTIONS: {
            link: ['lock', 'thumbnail', 'layout'],
            youtube: ['settings'],
            vimeo: ['settings'],
            tiktok: ['settings'],
            twitter: ['settings', 'layout'],
            soundcloud: ['settings'],
            spotify: ['settings'],
            googlemaps: ['settings', 'zoom']
        }
    },
    save: async function() {
        // Get existing content data
        const existing = await Store.get('content');

        // Start with an empty object
        const data = {};

        // Set content data as combination of slug and domain
        data[`${Page.constants.SLUG}|${Page.constants.DOMAIN}`] = {
            order: Array.from(Page.DATA.order.entries()),
            content: Page.DATA.content,
            design: Page.DATA.design,
            settings: Page.DATA.settings,
            social: {
                order: Social.DATA.order.entries(),
                content: Social.DATA.content
            },
            providers: Page.DATA.providers
        }

        // Store updated data object
        await Store.set(Object.assign(data, existing.content));
    },
    generateId: function() {
        return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    },
    addNewItem: async function(type = 'link') {
        let ID = this.generateId();

        // Although one in a 10 million chance of collision, still ensure that we don't have a duplicate ID
        while (Page.DATA.content.hasOwnProperty(ID)) {
            ID = this.generateId();
        }

        const template = Selectors.ENTRY_TEMPLATE.content;
        const content = template.cloneNode(true);

        // Elements (for adding identifiers and attaching event listeners)
        const item = content.querySelector('.item');
        const entry = content.querySelector('.entry');
        const form = content.querySelector('form');

        // Set attributes and distinct name for inputs
        item.setAttribute('data-swapy-slot', ID);
        entry.setAttribute('data-swapy-item', ID);

        // Set id and content type to form
        form.setAttribute('id', ID);

        // Update icon and add attribute to form
        entry.querySelector('.type img').setAttribute('src', `./assets/images/page/embed/${type}.png`);
        form.setAttribute('data-type', type);

        // Here, we are adding content specific actions and respective inline HTML
        // which means we have different settings for link, video, map etc
        const actionsTemplate = Selectors.ACTIONS_TEMPLATE.content;
        const actionsContent = actionsTemplate.cloneNode(true);

        // Find the content specific selectors
        const actionDiv = form.querySelector('.actions');
        for (const actionType of this.constants.ACTIONS[type]) {
            const action = actionsContent.querySelector(`[data-inline=${actionType}]`);
            actionDiv.prepend(action);
        }

        // Event listeners
        const inputs = form.querySelectorAll('input');
        if (inputs.length !== 0) {
            inputs.forEach(input => {
                const name = input.getAttribute('name');

                input.setAttribute('name', `${name}-${ID}`);
                input.setAttribute('id', `${name}-${ID}`);

                // Adding event listeners based on input type
                const type = input.getAttribute('type');

                // TODO
                // Add event listeners
            });
        }

        Selectors.ITEMS_CONTAINER.prepend(content);
    },
    updateContentSectionVisibility: function(show = true) {
        if (show) {
            Selectors.NO_CONTENT_MESSAGE.style.display = 'none';
            Selectors.ITEMS_CONTAINER.style.display = 'block';
        } else {
            Selectors.NO_CONTENT_MESSAGE.style.display = 'flex';
            Selectors.ITEMS_CONTAINER.style.display = 'none';
        }
    },
    addLinkEvent: function() {
        if (!Selectors.ADD_LINK) return;

        Selectors.ADD_LINK.addEventListener('click', async e => {
            e.preventDefault();

            try {
                // Adds a new item to the top of `content-items` div
                await this.addNewItem();
                this.updateContentSectionVisibility(true);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    addEmbedEvent: function() {

    },
    embedButtonEvent: function() {

    },
    events: function() {
        this.addLinkEvent();
        this.addEmbedEvent();
        this.embedButtonEvent();
    }
};
