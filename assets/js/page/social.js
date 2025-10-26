// page/social.js
import { createSwapy } from "swapy";
import { isURL } from "validator";
import { Processing } from "../processing.js";
import { Modal } from "../modal.js";
import { Selectors } from "./selectors.js";
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
import { socialIcons } from "../constants.js";
import { debounce, randomString } from "../helper.js";

export const Social = {
    DATA: {
        order: new Map(),
        content: {}
    },
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

                const isActive = target.getAttribute('data-active');
                if (isActive) {
                    throw new Error(i18n.SOCIAL_ICON_EXISTS);
                }

                const network = e.target.getAttribute('data-social');
                if (!network || !Object.keys(socialIcons).includes(network)) {
                    throw new Error(i18n.DEFAULT_ERROR);
                }

                // Adds a new item to the top of `social-items` div
                await this.addNewItem(network);

                // Add the `data-active` attribute to link
                target.setAttribute('data-active', true);

                this.updateContentSectionVisibility(parent, true);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    addNewItem: async function() {
        
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
