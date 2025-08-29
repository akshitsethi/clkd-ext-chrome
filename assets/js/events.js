// events.js
import { Auth } from "./auth.js";
import { Screen } from "./screen.js";
import { Settings } from "./settings.js";
import { Help } from "./help.js";
import { User } from "./user.js";
import { Upgrade } from "./upgrade.js";
import { Subscription } from "./subscription.js";
import { Dashboard } from "./dashboard.js";
import { Links } from "./links.js";
import { Modal } from "./modal.js";

export const Events = {
    init: function () {
        Auth.events();
        Screen.events();
        User.events();
        Settings.events();
        Help.events();
        Upgrade.events();
        Subscription.events();
        Dashboard.events();
        Links.events();
        Modal.events();
    }
};
