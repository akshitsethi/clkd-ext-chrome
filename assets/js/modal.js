// modal.js
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { Selectors } from "./selectors.js";

export const Modal = {
    show: function (content, type = 'html') {
        if (!content) {
            throw new Error(i18n.DEFAULT_ERROR);
        }
        if (!Selectors.MODAL) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        // Add content before displaying modal
        if (type === 'html') {
            Selectors.MODAL_CONTENT.innerHTML = content;
        } else if (type === 'node') {
            Selectors.MODAL_CONTENT.appendChild(content);
        }

        // Disable scroll when modal is visible in the viewport
        document.body.style.overflow = 'hidden';
        Selectors.MODAL.style.visibility = 'visible';
    },
    hide: function () {
        if (!Selectors.MODAL) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        // Remove content
        Selectors.MODAL_CONTENT.innerHTML = null;

        document.body.style.overflow = 'auto';
        Selectors.MODAL.style.visibility = 'hidden';
    },
    escapeKeyEvent: function () {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                try {
                    this.hide();
                } catch (error) {
                    console.error(error);
                    Notification.error(error.message ?? i18n.DEFAULT_ERROR);
                }
            }
        });
    },
    closeEvent: function () {
        if (!Selectors.MODAL || !Selectors.MODAL_CLOSE) return;

        Selectors.MODAL_CLOSE.addEventListener('click', e => {
            e.preventDefault();

            try {
                this.hide();
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    events: function () {
        this.escapeKeyEvent();
        this.closeEvent();
    }
};
