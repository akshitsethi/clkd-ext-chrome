// user.js
import { Store } from "./store.js";
import { Screen } from "./screen.js";
import { Selectors } from "./selectors.js";

export const User = {
    constants: {
        PROFILE_IMAGE_CLASSNAME: '.profile-link img',
        USERNAME_CLASSNAME: '.username',
        PROFILE_MENU_LINK_CLASSNAME: '.profile-link',
        PROFILE_MENU_CLASSNAME: '.profile-menu'
    },
    setData: async function (data) {
        // Store entire user data
        await Store.set({ user: data }, 'sync');

        // Also, set data for the user store object
        Store.USER = data;
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
        Selectors.HEADER.style.display = 'flex';
    },
    loginSuccess: function () {
        // TODO
        // 1. Check for sub-header and change select input to correct value
        // 2. Based on screen, modify input CTA's

        // Update user data in header & make it visible
        this.updateDataInHeader();
        this.showHeader();

        // Switch to dashboard
        Screen.show('dashboard', 'block');
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
    events: function () {
        this.userHeaderMenuEvent();
    }
};
