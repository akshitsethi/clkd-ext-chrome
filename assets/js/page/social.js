// page/social.js
import { createSwapy } from "swapy";
import { isURL } from "validator";
import { Processing } from "../processing.js";
import { Modal } from "../modal.js";
import { Selectors } from "./selectors.js";
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
import { socialIcons } from "../constants.js";
import { debounce, generateId } from "../helper.js";
import { Page } from "./page.js";

export const Social = {
    SWAPY: null,
    addEventListeners: function(content) {
        // Open dropdown on clicking the `+` icon
        const open = content.querySelector('.social-selector a');
        this.openDropdownEvent(open);

        // Add new item on clicking a social icon from the dropdown
        const icons = content.querySelectorAll('.social-dropdown a');
        this.addIconEvent(icons);
    },
    openDropdownEvent: function (selector) {
        if (!selector) return;

        selector.addEventListener('click', e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName === 'IMG') {
                    target = e.target.parentElement;
                }

                const parent = target.closest('.social-modal');
                const dropdown = parent.querySelector('.social-dropdown');

                target.classList.toggle('open');
                dropdown.classList.toggle('open');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    addIconEvent: function(icons) {
        if (!icons.length || !Selectors.SOCIAL_ENTRY_TEMPLATE) return;

        icons.forEach(icon => icon.addEventListener('click', async e => {
            e.preventDefault();

            try {
                let target = e.target;
                if (target.nodeName === 'IMG') {
                    target = e.target.parentElement;
                }

                // Get parent for updating content visibility
                const parent = target.closest('.social-modal');
                const container = parent.querySelector('.social-items');

                const isActive = target.getAttribute('data-active');
                if (isActive) {
                    throw new Error(i18n.SOCIAL_ICON_EXISTS);
                }

                const network = e.target.getAttribute('data-social');
                if (!network || !Object.keys(socialIcons).includes(network)) {
                    throw new Error(i18n.DEFAULT_ERROR);
                }

                // Adds a new item to the top of `social-items` div
                await this.addNewItem(network, container);

                // Add the `data-active` attribute to link
                target.setAttribute('data-active', true);

                this.updateContentSectionVisibility(parent, true);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    addNewItem: async function(network, parent) {
        let ID = generateId();
        
        // Although one in a 10 million chance of collision, still ensure that we don't have a duplicate ID
        while (Page.get('social', 'content').hasOwnProperty(ID)) {
            ID = generateId();
        }

        // Generate item's content (HTML structure with event listeners)
        const content = this.generateItemStructure(ID, ID, network);

        // Add event listeners
        // this.deleteItemEvent(content);

        // Update object containing page data
        this.setItemDataToObject(ID, ID, network);

        // Update local storage
        // Page.save();

        // Update for drag and drop to work
        // this.SWAPY.update();

        // Add item on screen
        parent.append(content);

        // TODO
        // Remove once testing is over
        console.log(Page.DATA);
    },
    generateItemStructure: function(id, slotId, network) {
        const template = Selectors.SOCIAL_ENTRY_TEMPLATE.content;
        const content = template.cloneNode(true);

        // Elements (for adding identifiers and attaching event listeners)
        const item = content.querySelector('.item');
        item.setAttribute('data-swapy-slot', slotId);

        // Set attributes and distinct name for inputs
        const entry = content.querySelector('.entry');
        entry.setAttribute('data-swapy-item', id);

        // Set `data-channel` for box and add placeholder for text field
        entry.setAttribute('data-channel', network);
        entry.querySelector(`input[type="text"]`).setAttribute('placeholder', `Enter ${socialIcons[network]['name']} ${socialIcons[network]['placeholder']} (${socialIcons[network]['help']})`);

        // Update content as per selected network
        const icon = entry.querySelector('img');
        icon.setAttribute('src', `./assets/images/social/${network}.svg`);
        icon.setAttribute('alt', socialIcons[network]['name']);

        // Event listeners
        const inputs = entry.querySelectorAll('input');
        if (inputs.length !== 0) {
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                input.setAttribute('name', `${name}-${id}`);

                // Adding event listeners based on input type
                const type = input.getAttribute('type');

                // Event listeners
                if (['checkbox'].includes(type)) {
                    input.addEventListener('change', async e => await this.save());
                } else {
                    input.addEventListener('keyup', debounce(async () => {
                        await this.save();
                    }));
                }
            });
        }

        return content;
    },
    setItemDataToObject: function(id, slotId, network) {
        // Prepend item to map
        Page.set('social', new Map([...new Map().set(slotId, id), ...Page.get('social', 'order')]), 'order');

        // Add empty object to `content` attribute for holding content box data
        Page.set(
            'social',
            {
                icon: network,
                url: null,
                status: 'off'
            },
            'content',
            id
        );
    },
    save: async function() {
        // const forms = Selectors.ITEMS_CONTAINER.querySelectorAll('form');
        // if (!forms.length) return;

        // // Loop over forms to store data
        // for (const form of forms) {
        //     const id = form.getAttribute('id');
        //     const type = form.getAttribute('data-type');
        //     const data = new FormData(form);

        //     // Fields based on form type
        //     const fields = [...this.constants.COMMON_FIELDS, ...Object.keys(this.CONTENT_DATA[type])];

        //     // Loop over form data
        //     for (const field of fields) {
        //         // Skip saving image fields as it's logic is handled separately
        //         if (field.includes('image')) continue;

        //         const value = data.get(`${field}-${id}`);

        //         // Process `status` fields early as they will return `null` when not checked
        //         if (field.includes('status') && value !== 'on') {
        //             Page.set('content', 'off', id, field);
        //         }

        //         // Bail early if there is no value
        //         if (value === null || value === undefined) continue;

        //         // For all other content type
        //         Page.set('content', value.trim(), id, field);

        //         // Process embeds
        //         if (embeds) {
        //             await this.processEmbed(id, type, field, value);
        //         }
        //     }
        // }

        // Update local storage
        Page.save();
    },
    updateContentSectionVisibility: function(content, show = true) {
        const container = content.querySelector('.social-items');
        const noIconsMessage = content.querySelector('.no-social-data');

        if (show) {
            noIconsMessage.style.display = 'none';
            container.style.display = 'block';
        } else {
            noIconsMessage.style.display = 'block';
            container.style.display = 'none';
        }
    },
    manageIconsEvent: function() {
        if (!Selectors.MANAGE_ICONS || !Selectors.MANAGE_ICONS_TEMPLATE) return;

        // TEMPORARY
        // For working on social modal (to avoid clicking each time on refresh)
        const template = Selectors.MANAGE_ICONS_TEMPLATE.content;
        const content = template.cloneNode(true);
        this.addEventListeners(content);
        Modal.show(content, 'node', 1024);
        // TO BE REMOVED TILL HERE

        Selectors.MANAGE_ICONS.addEventListener('click', e => {
            e.preventDefault();

            try {
                Processing.show();

                // const template = Selectors.MANAGE_ICONS_TEMPLATE.content;
                // const content = template.cloneNode(true);

                // Add event listeners
                // this.addEventListeners();

                // Modal.show(content, 'node', 840);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        });
    },
    events: function() {
        this.manageIconsEvent();
    }
};
