// page/content.js
import { createSwapy } from "swapy";
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";
import { Notification } from "../notification.js";
import { i18n } from "../i18n.js";
import { debounce, randomString } from "../helper.js";

export const Content = {
    constants: {
        COMMON_FIELDS: [
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
            image: null,
            radioLayout: 'classic',
            radioSensitive: 'disable'
        },
        youtube: {
            radioLayout: 'none',
            statusAuthorProfile: 'off',
            statusEmbedTitle: 'off'
        },
        vimeo: {
            layout: 'none',
            statusAuthorProfile: 'off',
            statusEmbedTitle: 'off'
        },
        googlemaps: {
            radioMapType: 'roadmap',
            rangeMapZoom: '12'
        },
        soundcloud: {
            radioLayout: 'none'
        },
        twitter: {},
        instagram: {},
        facebook: {},
        threads: {},
        spotify: {},
        tiktok: {}
    },
    SWAPY: null,
    generateId: function() {
        return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    },
    generateItemStructure: function(id, slotId, type) {
        const template = Selectors.ENTRY_TEMPLATE.content;
        const content = template.cloneNode(true);

        // Elements (for adding identifiers and attaching event listeners)
        const item = content.querySelector('.item');
        const entry = content.querySelector('.entry');
        const form = content.querySelector('form');

        // Set attributes and distinct name for inputs
        item.setAttribute('data-swapy-slot', slotId);
        entry.setAttribute('data-swapy-item', id);

        // Set id and content type to form
        form.setAttribute('id', id);

        // Prevent form submission
        form.addEventListener('submit', e => e.preventDefault());

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
                input.setAttribute('name', `${name}-${id}`);

                // Adding event listeners based on input type
                const type = input.getAttribute('type');

                // Event listeners
                if (['checkbox', 'radio', 'range'].includes(type)) {
                    input.addEventListener('change', async e => await this.save());
                } else {
                    input.addEventListener('keyup', debounce(async () => {
                        await this.save(true);
                    }));
                }
            });
        }

        return content;
    },
    populateItemContent: function(id, content, data) {
        for (const [key, value] of Object.entries(data)) {
            if (!value) continue;

            // TODO
            // Check if key.includes('image') and show the image on screen
            // instead of updating value to the file input

            const selector = key.includes('radio') ? content.querySelectorAll(`input[name=${key}-${id}]`) : content.querySelector(`input[name=${key}-${id}]`);
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
    addNewItem: async function(type = 'link') {
        let ID = this.generateId();

        // Although one in a 10 million chance of collision, still ensure that we don't have a duplicate ID
        while (Page.get('content').hasOwnProperty(ID)) {
            ID = this.generateId();
        }

        // Generate item's content (HTML structure with event listeners)
        const content = this.generateItemStructure(ID, ID, type);

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

        // Update for drag and drop to work
        this.SWAPY.update();

        // Add item on screen
        Selectors.ITEMS_CONTAINER.prepend(content);

        // TODO
        // Remove once testing is over
        console.log(Page.DATA);
    },
    render: function() {
        const order = Array.from(Page.get('order'));
        if (!order.length) return;

        // Update content section
        this.updateContentSectionVisibility(true);

        for (const [slotId, id] of order.reverse()) {
            const data = Page.get('content', id);

            // Generate item structure
            const content = this.generateItemStructure(id, slotId, data.type);

            // Populate existing content
            this.populateItemContent(id, content, data);

            // Add item on screen
            Selectors.ITEMS_CONTAINER.prepend(content);
        }
    },
    save: async function(embeds = false) {
        const forms = Selectors.ITEMS_CONTAINER.querySelectorAll('form');
        if (!forms.length) return;

        // Loop over forms to store data
        for (const form of forms) {
            const id = form.getAttribute('id');
            const type = form.getAttribute('data-type');
            const data = new FormData(form);

            // Fields based on form type
            const fields = [...this.constants.COMMON_FIELDS, ...Object.keys(this.CONTENT_DATA[type])];

            // Loop over form data
            for (const field of fields) {
                // Skip saving image fields as it's logic is handled separately
                if (field.includes('image')) continue;

                const value = data.get(`${field}-${id}`);

                // Process `status` fields early as they will return `null` when not checked
                if (field.includes('status') && value !== 'on') {
                    Page.set('content', 'off', id, field);
                }

                // Bail early if there is no value
                if (value === null || value === undefined) continue;

                // For all other content type
                Page.set('content', value.trim(), id, field);
            }

            // Process embeds
            if (embeds) {
                // TODO
                // Add logic for processing embeds and storing HTML in providers
                // also, ensure that we don't fetch data from remote servers multiple times
            }
        }

        // Update local storage
        Page.save();
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

                // Update toggle arrow and toggle option dropdown
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
    dragDropEvent: function() {
        this.SWAPY = createSwapy(Selectors.ITEMS_CONTAINER, {
            animation: 'dynamic',
            swapMode: 'hover'
        });

        this.SWAPY.onSwap(async e => {
            Page.set('order', e.newSlotItemMap.asMap);

            // Update storage
            await Page.save();
        });
    },
    events: function() {
        this.addLinkEvent();
        this.embedButtonEvent();
        this.addEmbedEvent();
        this.dragDropEvent();
    }
};
