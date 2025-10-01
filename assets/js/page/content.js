// page/content.js
import { Selectors } from "./selectors.js";

export const Content = {
    addLinkEvent: function() {
        if (!Selectors.ADD_LINK || !) return;
    },
    addEmbedEvent: function() {

    },
    embedButtonEvent: function() {

    },
    events: function() {
        this.addLinkEvent();
        this.addEmbedEvent();
        this.embedButtonEvent();
    }
};
