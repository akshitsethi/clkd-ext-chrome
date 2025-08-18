// screen.js
import { Selectors } from "./selectors.js";
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";

export const Screen = {
    constants: {
        PREVIOUS_SCREEN: null,
        CURRENT_SCREEN: null,
        DEFAULT_DISPLAY: 'block'
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
    show: function (screen, display = this.constants.DEFAULT_DISPLAY, callback = null) {
        if (!this.screens.includes(screen)) {
            throw new Error(i18n.NO_SCREEN_ERROR);
        }

        // Display the desired screen
        const el = document.getElementById(screen);
        if (!el) {
            throw new Error(i18n.NO_SCREEN_ERROR);
        }

        // Update current and previous screen
        this.constants.PREVIOUS_SCREEN = this.constants.CURRENT_SCREEN;
        this.constants.CURRENT_SCREEN = screen;

        // Set current screen info on document body
        document.body.setAttribute('data-current-screen', screen);

        // Update primary and dynamic sections
        this.updateHeaderSections(screen);

        // Bring the screen to viewport
        Selectors.SCREENS.forEach(screen => screen.style.display = 'none');
        el.style.display = display;

        if (callback === 'true') {
            this[screen]();
        }
    },
    updateHeaderSections: function(screen) {
        if (Selectors.PRIMARY_SECTION.length == 0 || Selectors.DYNAMIC_SECTION.length == 0) {
            return;
        }

        // Loop over primary section
        this.showHideSections(Selectors.PRIMARY_SECTION, screen);
        this.showHideSections(Selectors.DYNAMIC_SECTION, screen);
    },
    showHideSections: function(selector, screen) {
        for (const section of selector) {
            section.style.display = 'none';

            let screens = section.getAttribute('data-screens');
            if (!screens) {
                continue;
            }

            screens = screens.split('|');
            if (screens.includes(screen)) {
                section.style.display = 'flex';
            }
        }
    },
    hideAll: function () {
        Selectors.SCREENS.forEach(screen => screen.style.display = 'none');
    },
    dashboard: function () {

    },
    links: function () {

    },
    analytics: function () {

    },
    archives: function () {

    },
    switchEvent: function () {
        if (Selectors.SCREEN_SWITCH_LINKS.length === 0) {
            return;
        }

        Selectors.SCREEN_SWITCH_LINKS.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();

                try {
                    let target = e.target;
                    if (e.target.nodeName === 'IMG') {
                        target = e.target.parentElement;
                    }

                    const id = target.getAttribute('data-screen');
                    if (!id) {
                        throw new Error(i18n.NO_SCREEN_ERROR);
                    }

                    // If display attribute is not set, it defaults to `block`
                    const display = target.getAttribute('data-display') ?? this.constants.DEFAULT_DISPLAY;

                    // Set callback to null if not required
                    const callback = target.getAttribute('data-callback') ?? null;

                    // Switch screen
                    this.show(id, display, callback);
                } catch (error) {
                    console.error(error);
                    Notification.error(error.message ?? i18n.DEFAULT_ERROR);
                }
            });
        });
    },
    events: function () {
        this.switchEvent();
    }
};
