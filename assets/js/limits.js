// limits.js
import { animate } from "motion";
import { Selectors } from "./selectors.js";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";
import { Screen } from "./screen.js";

export const Limits = {
    updateDOM: function () {
        // TODO
        //
        // Update UI so that certain elements can be hidden or shown based on user's membership plan.
        // For registered users, certain features will remain disabled.
        // For example, list of available domains will be short for non-premium users.
    },
    upgradeModal: function () {
        animate(Selectors.UPGRADE_TRIGGER, { y: [100, 0], opacity: 1 }, { ease: "easeInOut", duration: 0.25 });
    },
    upgradeButtonEvent: function() {
        if (!Selectors.UPGRADE_TRIGGER) return;

        const button = Selectors.UPGRADE_TRIGGER.querySelector('.button');
        if (!button) return;

        button.addEventListener('click', e => {
            e.preventDefault();

            try {
                // Close upgrade modal and switch to upgrade screen
                animate(Selectors.UPGRADE_TRIGGER, { opacity: 0 }, { ease: "easeInOut", duration: 0.25 });
                Screen.show('upgrade');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    closeUpgradeModalEvent: function () {
        if (!Selectors.UPGRADE_TRIGGER) return;

        const close = Selectors.UPGRADE_TRIGGER.querySelector('.upgrade-close');
        if (!close) return;

        close.addEventListener('click', e => {
            e.preventDefault();

            try {
                animate(Selectors.UPGRADE_TRIGGER, { opacity: 0 }, { ease: "easeInOut", duration: 0.25 });
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                animate(Selectors.UPGRADE_TRIGGER, { opacity: 0 }, { ease: "easeInOut", duration: 0.25 });
            }
        });
    },
    events: function () {
        this.upgradeButtonEvent();
        this.closeUpgradeModalEvent();
    },
    init: function () {
        this.updateDOM();
    }
};
