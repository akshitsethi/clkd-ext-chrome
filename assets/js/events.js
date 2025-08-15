// events.js
import { Auth } from "./auth.js";
import { Screen } from "./screen.js";

export const Events = {
    init: function() {
        Auth.events();
        Screen.events();
    }
};
