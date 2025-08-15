// events.js
import { Auth } from "./auth.js";
import { Screen } from "./screen.js";
import { User } from "./user.js";

export const Events = {
    init: function () {
        Auth.events();
        Screen.events();
        User.events();
    }
};
