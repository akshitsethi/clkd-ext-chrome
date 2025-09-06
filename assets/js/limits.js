// limits.js
import { animate } from "motion";
import { Selectors } from "./selectors.js";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";
import { Screen } from "./screen.js";
import { Store } from "./store.js";

export const Limits = {
    updateDOM: function () {
        // Upgrade CTA button
        if (Selectors.HEADER_UPGRADE_CTA) {
            if (Store.USER.is_premium) {
                Selectors.HEADER_UPGRADE_CTA.style.display = 'none';
            } else {
                Selectors.HEADER_UPGRADE_CTA.style.display = 'block';
            }
        }

        
    },
    upgradeModal: function (heading = 'Premium Feature', content = null) {
        if (!Selectors.UPGRADE_TRIGGER) return;

        // Before displaying upgrade modal, update feature name in the header
        const header = Selectors.UPGRADE_TRIGGER.querySelector('h2');
        header.innerText = heading;

        if (content) {
            const lead = Selectors.UPGRADE_TRIGGER.querySelector('.lead');
            lead.innerHTML = content;
        }

        animate(Selectors.UPGRADE_TRIGGER, { y: [100, 0], visibility: 'visible' }, { ease: "easeInOut", duration: 0.25 });
    },
    upgradeButtonEvent: function() {
        if (!Selectors.UPGRADE_TRIGGER) return;

        const button = Selectors.UPGRADE_TRIGGER.querySelector('.button');
        if (!button) return;

        button.addEventListener('click', e => {
            e.preventDefault();

            try {
                // Close upgrade modal and switch to upgrade screen
                animate(Selectors.UPGRADE_TRIGGER, { y: [0, 400], visibility: 'hidden' }, { ease: "easeInOut", duration: 0.25 });
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
                animate(Selectors.UPGRADE_TRIGGER, { y: [0, 400], visibility: 'hidden' }, { ease: "easeInOut", duration: 0.25 });
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                animate(Selectors.UPGRADE_TRIGGER, { y: [0, 400], visibility: 'hidden' }, { ease: "easeInOut", duration: 0.25 });
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
