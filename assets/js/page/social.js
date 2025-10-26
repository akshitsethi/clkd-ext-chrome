// page/social.js
import { Processing } from "../processing.js";
import { Modal } from "../modal.js";
import { Selectors } from "./selectors.js";
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";

export const Social = {
    DATA: {
        order: new Map(),
        content: {}
    },
    SWAPY: null,
    manageIconsEvent: function() {
        if (!Selectors.MANAGE_ICONS || !Selectors.MANAGE_ICONS_TEMPLATE) return;

        Selectors.MANAGE_ICONS.addEventListener('click', e => {
            e.preventDefault();

            try {
                Processing.show();

                const template = Selectors.MANAGE_ICONS_TEMPLATE.content;
                const content = template.cloneNode(true);

                Modal.show(content, 'node', 840);
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
