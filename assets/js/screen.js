// screen.js
import { Selectors } from "./selectors";

export const Screen = {
    constants: {
        PREVIOUS_SCREEN: null,
        CURRENT_SCREEN: null,
    },
    screens: [
        'dashboard',
        'links',
        'analytics',
        'archives',
        'account',
        'settings',
        'help',
        'logout',
        'unlogged',
        'upgrade',
        'subscription-verify',
        'subscription-success',
        'subscription-exists',
    ],
    show: function (screen,) {

    },
    switchEvent: function () {
        if (Selectors.SCREEN_SWITCH_LINKS.length === 0) {
            return;
        }

        this.selectors.LINKS.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();

                let target = e.target;
                if (e.target.nodeName === 'IMG') {
                    target = e.target.parentElement;
                }

                const screen = target.dataset.screen;
                if (!screen) {
                    return;
                }

                const [screenId, style, callback] = screen.split('|');
                if (!screenId || !style || !callback) {
                    return;
                }

                // Update current and previous screen
                this.PREVIOUS_SCREEN = this.CURRENT_SCREEN;
                this.CURRENT_SCREEN = screen;

                if (callback === 'true') {
                    this[screenId]();
                } else {
                    this.switch(screenId, style);
                }
            });
        });
    },
    events: function () {
        this.switchEvent();
    }
};
