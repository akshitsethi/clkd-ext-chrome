// user.js
import { Store } from "./store.js";

export const User = {
    setData: async function(data) {
        // Store entire user data
        await Store.set({ user: data }, 'sync');

        // Also, set data for the user store object
        Store.USER = data;
    },
    loginSuccess: function() {
        // TODO
        // 1. Show header
        // 2. Check for sub-header and change select input to correct value
        // 3. Based on screen, modify input CTA's

        // Switch to dashboard
        Screen.show('dashboard', 'block');
    }
};
