// page/content.js
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";
import { Notification } from "../notification.js";
import { i18n } from "../i18n.js";
import { randomString } from "../helper.js";

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
    CONTENT_DATA: {
        link: {
            thumbnail: null,
            layout: 'classic',
            sensitive: 'disable'
        },
        youtube: {
            layout: 'none',
            authorProfileStatus: 'off',
            embedTitleStatus: 'off'
        },
        vimeo: {
            layout: 'none',
            authorProfileStatus: 'off',
            embedTitleStatus: 'off'
        },
        googlemaps: {
            mapType: 'roadmap',
            mapZoom: '12'
        },
        soundcloud: {
            layout: 'none'
        },
        twitter: {},
        instagram: {},
        facebook: {},
        threads: {},
        spotify: {},
        tiktok: {}
    },
    generateId: function() {
        return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    },
    render: function() {
        
    },
    addNewItem: async function(type = 'link') {
        let ID = this.generateId();

        // Although one in a 10 million chance of collision, still ensure that we don't have a duplicate ID
        while (Page.get('content').hasOwnProperty(ID)) {
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

        // Prepend item to map
        Page.set('order', new Map([...new Map().set(ID, ID), ...Page.get('order')]));

        // Add empty object to `content` attribute for holding content box data
        Page.set(
            'content',
            {
                type,
                title: null,
                url: null,
                status: 'off',
                ...this.CONTENT_DATA[type]
            },
            ID
        );

        // Update local storage
        Page.save();

        // Add item on screen
        Selectors.ITEMS_CONTAINER.prepend(content);

        // TODO
        // Remove once testing is over
        console.log(Page.DATA);
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
    embedButtonEvent: function() {
        if (!Selectors.EMBED_BUTTON) return;

        Selectors.EMBED_BUTTON.addEventListener('click', e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName === 'IMG') {
                    target = e.target.parentElement;
                }

                // Update toggle arrow
                target.querySelectorAll('img').forEach(img => img.classList.toggle('show'));

                Selectors.EMBED_OPTIONS.classList.toggle('show');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    addEmbedEvent: function() {
        
    },
    events: function() {
        this.addLinkEvent();
        this.addEmbedEvent();
        this.embedButtonEvent();
    }
};
