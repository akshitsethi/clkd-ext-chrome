// tooltip.js
import { randomString } from "./helper.js";
import { i18n } from "./i18n.js";
import { Selectors } from "./selectors.js";

export const Tooltip = {
    constants: {
        CLASSNAME: '.tooltip'
    },
    logic: function(selector, tooltip) {
        const x = '0';
        const y = '16px';

        tooltip.style.transform = `translate(${x}, ${y})`;
        selector.appendChild(tooltip);
        selector.onpointermove = e => {
            if (e.target !== e.currentTarget) {
                return;
            }

            const rect = tooltip.getBoundingClientRect();
            const rectWidth = rect.width + 16;
            const vWidth = window.innerWidth - rectWidth;
            const rectX = e.clientX + rectWidth;
            const minX = rectX;
            const maxX = window.innerWidth;
            const x = rectX < minX ? rectWidth : rectX > maxX ? vWidth : e.clientX;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${e.clientY}px`;
        }
    },
    show: function(el, text) {
        if (!el) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        // Set tooltip attribute for `el`
        el.setAttribute('tooltip', text);

        // Placeholder for tooltip element
        let tooltip;

        const existing = el.querySelector(this.constants.CLASSNAME);
        if (existing) {
            tooltip = existing;
        } else {
            const random = randomString(6, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

            tooltip = document.createElement('div');
            tooltip.setAttribute('id', `${random}-tooltip`);
            tooltip.classList.add('tooltip');

            // Set selector's ID
            el.setAttribute('id', random);
        }

        // Set tooltip's content
        tooltip.innerText = text;

        // Initialise logic
        this.logic(el, tooltip);
    },
    createEvent: function() {
        if (Selectors.TOOLTIPS.length === 0) {
            return;
        }

        for (const selector of Selectors.TOOLTIPS) {
            const tooltip = document.createElement('div');
            const random = randomString(6, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

            // Set selector's ID
            selector.setAttribute('id', random);

            // Set tooltip's ID
            tooltip.setAttribute('id', `${random}-tooltip`);
            tooltip.classList.add('tooltip');
            tooltip.innerText = selector.getAttribute('tooltip');

            // Tooltip logic
            this.logic(selector, tooltip);
        }
    },
    events: function () {
        this.createEvent();
    }
};
