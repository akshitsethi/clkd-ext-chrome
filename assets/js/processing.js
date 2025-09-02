// processing.js
import { Selectors } from "./selectors.js";
import { i18n } from "./i18n.js";

export const Processing = {
    constants: {
        PROCESSING_CLASSNAME: '.processing'
    },
    SELECTOR: null,
    show: function (selector, position = 'fixed') {
        if (!selector) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        // This needs to be used later for hiding it
        this.SELECTOR = selector;

        // First, check if processing existing inside selector
        // If not, `processing` to selector
        const existing = this.SELECTOR.querySelector(this.constants.PROCESSING_CLASSNAME);
        if (!existing) {
            const template = Selectors.PROCESSING_TEMPLATE.content;
            const content = template.cloneNode(true);

            // Change display to flex
            const processing = content.querySelector(this.constants.PROCESSING_CLASSNAME);
            processing.style.display = 'flex';
            processing.style.position = position;

            // Append to selector
            this.SELECTOR.append(content);
        }
    },
    hide: function () {
        if (!this.SELECTOR) return;

        // Remove injected processing `div`
        const el = this.SELECTOR.querySelector(this.constants.PROCESSING_CLASSNAME);
        if (el) el.remove();

        // Set to null
        this.SELECTOR = null;
    }
};
