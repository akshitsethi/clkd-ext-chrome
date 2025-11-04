// page/events.js
import { Modal } from "../modal.js";
import { Content } from "./content.js";
import { Design } from "./design.js";
import { Preview } from "./preview.js";
import { Profile } from "./profile.js";
import { Settings } from "./settings.js";
import { Social } from "./social.js";

export const Events = {
    init: function () {
        Content.events();
        Design.events();
        Settings.events();
        Profile.events();
        Social.events();
        Preview.events();
        Modal.events();
    }
};
