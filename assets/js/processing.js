// processing.js
import { Selectors } from "./selectors.js";

export const Processing = {
    constants: {
        PROCESSING_CLASSNAME: '.processing'
    },
    SELECTOR: null,
    show: function (selector, position = 'fixed') {
        // Do nothing if processing template does not exist
        if (!Selectors.PROCESSING_TEMPLATE) return;

        // If the selector does not exist, use <body> tag
        if (!selector) {
            selector = document.body;
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
