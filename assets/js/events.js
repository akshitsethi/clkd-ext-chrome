// events.js
import { Auth } from "./auth.js";
import { Screen } from "./screen.js";
import { Settings } from "./settings.js";
import { User } from "./user.js";

export const Events = {
    init: function () {
        Auth.events();
        Screen.events();
        User.events();
        Settings.events();
    }
};
