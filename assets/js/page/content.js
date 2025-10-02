// page/content.js
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";
import { Notification } from "../notification.js";
import { Store } from "../store.js"
import { i18n } from "../i18n.js";
import { randomString } from "../helper.js";

export const Content = {
    constants: {
        COMMON_FIELDS: [
            'type',
            'title',
            'url',
            'status'
        ]
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
                order: null, // Array.from(Social.get('order').entries()),
                content: null // Social.get('content')
            },
            providers: Page.DATA.providers
        }

        // Store updated data object
        await Store.set(Object.assign(data, existing.content));
    },
    generateId: function(existingId = null) {
        if (existingId) {
            return existingId;
        }

        return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    },
    addNewItem: async function() {
        
    },
    addLinkEvent: function() {
        if (!Selectors.ADD_LINK) return;

        Selectors.ADD_LINK.addEventListener('click', async e => {
            e.preventDefault();

            try {
                // Adds a new item to the top of `content-items` div
                await this.addNewItem();

                // Since a new item has been added, remove no content message
                Selectors.NO_CONTENT_MESSAGE.style.display = 'none';
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
