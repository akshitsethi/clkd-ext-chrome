// user.js
import { Store } from "./store.js";
import { Screen } from "./screen.js";
import { Selectors } from "./selectors.js";
import { Notification } from "./notification.js";
import { Analytics } from "./analytics.js";
import { i18n } from "./i18n.js";
import { Settings } from "./settings.js";

export const User = {
    constants: {
        PROFILE_IMAGE_CLASSNAME: '.profile-link img',
        USERNAME_CLASSNAME: '.username',
        PROFILE_MENU_LINK_CLASSNAME: '.profile-link',
        PROFILE_MENU_CLASSNAME: '.profile-menu',
        PAGE_SELECTOR_CLASSNAME: '.page-selector',
        NAVIGATION_CLASSNAME: '.navigation'
    },
    setData: async function (data) {
        // Store entire user data
        await Store.set({ user: data }, 'sync');

        // Also, set data for the user store object
        Store.USER = data;
    },
    setSettings: async function (data) {
        // Store user settings data
        await Store.set({ settings: data }, 'sync');

        // Also, set data for the user store object
        Store.SETTINGS = data;
    },
    setAnalytics: async function (data) {
        // Store analytics data to locally
        await Store.set({ analytics: data });

        // Also, set data for the user store object
        Analytics.DATA = data;
    },
    clearData: async function () {
        // Clear both local and synced storage
        await Store.clear('local');
        await Store.clear('sync');
    },
    updateDataInHeader: function () {
        if (!Selectors.HEADER) {
            return;
        }
        if (Store.USER['picture']) {
            Selectors.HEADER.querySelector(this.constants.PROFILE_IMAGE_CLASSNAME).src = Store.USER['picture'];
        }
        if (Store.USER['name']) {
            Selectors.HEADER.querySelector(this.constants.USERNAME_CLASSNAME).innerText = Store.USER['name'];
        }
    },
    showHeader: function () {
        if (!Selectors.HEADER || !Selectors.SECONDARY_HEADER) {
            return;
        }
        Selectors.HEADER.style.display = 'flex';
        Selectors.SECONDARY_HEADER.style.display = 'flex';
    },
    hideHeader: function () {
        if (!Selectors.HEADER || !Selectors.SECONDARY_HEADER) {
            return;
        }
        Selectors.HEADER.style.display = 'none';
        Selectors.SECONDARY_HEADER.style.display = 'none';
    },
    loginSuccess: async function () {
        // Fetch settings (because it'll be required by various modules)
        if (Object.entries(Store.SETTINGS).length === 0) {
            await Settings.fetchFromAPI();
        }

        // Update user data in header & make it visible
        this.updateDataInHeader();
        this.showHeader();

        // Switch to dashboard
        await Screen.show('dashboard', 'block', 'true', true);
    },
    userHeaderMenuEvent: function () {
        if (!Selectors.HEADER) {
            return;
        }
        const trigger = Selectors.HEADER.querySelector(this.constants.PROFILE_MENU_LINK_CLASSNAME);
        const menu = Selectors.HEADER.querySelector(this.constants.PROFILE_MENU_CLASSNAME);
        if (!trigger || !menu) {
            return;
        }

        trigger.addEventListener('click', e => {
            menu.classList.toggle('show');
        });

        menu.querySelectorAll('li').forEach(li => li.addEventListener('click', e => menu.classList.remove('show')));
    },
    userNavigationEvent: function () {
        if (!Selectors.NAVIGATION || !Selectors.PAGE_SELECTOR) {
            return;
        }

        // 1. Toggle for `page-selector` dropdown
        // 2. Screen switch once the page is selected
        Selectors.NAVIGATION.addEventListener('click', e => {
            e.preventDefault();
            Selectors.PAGE_SELECTOR.classList.toggle('show');
        });
        Selectors.PAGE_SELECTOR.addEventListener('click', async e => {
            e.preventDefault();

            try {
                const section = e.target.getAttribute('data-section');

                // Switch screen
                await Screen.show(section.toLowerCase(), 'block', 'true', true);

                // Remove `selected` from all and add it to the current target
                const anchors = Selectors.PAGE_SELECTOR.querySelectorAll('a');

                if (anchors.length !== 0) {
                    anchors.forEach(anchor => anchor.classList.remove('selected'));
                }
                e.target.classList.add('selected');

                // If the screen switched just fine, update `page-selector` value
                Selectors.NAVIGATION.querySelector('.current-page').innerText = section;
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    events: function () {
        this.userHeaderMenuEvent();
        this.userNavigationEvent();
    }
};
