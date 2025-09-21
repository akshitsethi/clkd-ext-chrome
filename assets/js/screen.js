// screen.js
import { Selectors } from "./selectors.js";
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { Settings } from "./settings.js";
import { Analytics } from "./analytics.js";
import { Dashboard } from "./dashboard.js";
import { Links } from "./links.js";
import { Help } from "./help.js";
import { Account } from "./account.js";

export const Screen = {
    constants: {
        PREVIOUS_SCREEN: null,
        CURRENT_SCREEN: null,
        DEFAULT_DISPLAY: 'block'
    },
    dynamic: ['links', 'analytics'],
    pages: ['dashboard', 'links', 'analytics'],
    screens: [
        'dashboard',
        'links',
        'analytics',
        'single',
        'account',
        'settings',
        'help',
        'logout',
        'unlogged',
        'upgrade',
        'subscription-verify',
        'subscription-success',
        'subscription-exists',
        'qrcode'
    ],
    show: async function (screen, display = this.constants.DEFAULT_DISPLAY, callback = null, async = false) {
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

        // Update header sections along with dynamic links
        this.updateHeaderSections(screen);

        // Update selected value for the `page-selector` based on screen
        this.updatePageSelector(screen);

        // Bring the screen to viewport
        Selectors.SCREENS.forEach(screen => screen.style.display = 'none');
        el.style.display = display;

        if (callback === 'true') {
            async === true ? await this[screen]() : this[screen]();
        }
    },
    updateHeaderSections: function (screen) {
        if (Selectors.PRIMARY_SECTION.length === 0 || Selectors.DYNAMIC_SECTION.length === 0) return;

        // Update dynamic link
        const anchor = Selectors.DYNAMIC_LINK.querySelector('a');
        if (this.dynamic.includes(this.constants.PREVIOUS_SCREEN)) {
            anchor.setAttribute('data-screen', this.constants.PREVIOUS_SCREEN);
            anchor.querySelector('span').innerText = this.constants.PREVIOUS_SCREEN.charAt(0).toUpperCase() + this.constants.PREVIOUS_SCREEN.substring(1);
        } else {
            anchor.setAttribute('data-screen', 'dashboard');
            anchor.querySelector('span').innerText = 'Dashboard';
        }

        // Loop over primary section
        this.showHideSections(Selectors.PRIMARY_SECTION, screen);
        this.showHideSections(Selectors.DYNAMIC_SECTION, screen);
    },
    updatePageSelector: function(screen) {
        if (!this.pages.includes(screen)) return;

        // If the above condition is not met, reset page selector to `dashboard`
        // Remove `selected` from all and add it to the current target
        const anchors = Selectors.PAGE_SELECTOR.querySelectorAll('a');

        if (!anchors.length) return;
        anchors.forEach(anchor => anchor.getAttribute('data-section') !== screen ? anchor.classList.remove('selected') : anchor.classList.add('selected'));

        // Update current page value
        Selectors.NAVIGATION.querySelector('.current-page').innerText = screen;
    },
    showHideSections: function (selector, screen) {
        for (const section of selector) {
            section.style.display = 'none';

            let screens = section.getAttribute('data-screens');
            if (!screens) continue;

            screens = screens.split('|');
            if (screens.includes(screen)) {
                section.style.display = 'flex';
            }
        }
    },
    hideAll: function () {
        Selectors.SCREENS.forEach(screen => screen.style.display = 'none');
    },
    dashboard: async function () {
        await Dashboard.init();
    },
    links: async function () {
        await Links.init();
    },
    analytics: async function () {
        await Analytics.init();
    },
    account: function () {
        Account.init();
    },
    settings: async function () {
        await Settings.init();
    },
    help: function () {
        Help.init();
    },
    switchEvent: function () {
        if (Selectors.SCREEN_SWITCH_LINKS.length === 0) return;

        Selectors.SCREEN_SWITCH_LINKS.forEach(link => {
            link.addEventListener('click', async e => {
                e.preventDefault();

                try {
                    let target = e.target;
                    if (e.target.nodeName === 'IMG' || e.target.nodeName === 'SPAN') {
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

                    // Check if the functions needs to be synchronous
                    const sync = Boolean(target.getAttribute('data-async')) ?? false;

                    // Switch screen
                    await this.show(id, display, callback, sync);
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
