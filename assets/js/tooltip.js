// tooltip.js
import { randomString } from "./helper.js";
import { i18n } from "./i18n.js";

export const Tooltip = {
    constants: {
        CLASSNAME: '.tooltip',
        SELECTOR: '[tooltip]'
    },
    logic: function (selector) {
        // Placeholder for tooltip element
        let tooltip;

        const existing = selector.querySelector(this.constants.CLASSNAME);
        if (existing) {
            tooltip = existing;
        } else {
            const random = randomString(6, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

            tooltip = document.createElement('div');
            tooltip.setAttribute('id', `${random}-tooltip`);
            tooltip.classList.add('tooltip');

            // Set selector's ID
            selector.setAttribute('id', random);
        }

        // Set tooltip's content
        tooltip.innerText = selector.getAttribute('tooltip');

        const x = '0';
        const y = '16px';

        tooltip.style.transform = `translate(${x}, ${y})`;
        selector.appendChild(tooltip);
        selector.onpointermove = e => {
            if (e.target !== e.currentTarget) {
                return;
            }

            const rect = tooltip.getBoundingClientRect();
            const rectWidth = rect.width + 24;
            const vWidth = window.innerWidth - rectWidth;
            const rectX = e.clientX + rectWidth;
            const minX = rectX;
            const maxX = window.innerWidth;
            const x = rectX < minX ? rectWidth : rectX > maxX ? vWidth : e.clientX;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${e.clientY}px`;
        }
    },
    show: function (el, text) {
        if (!el) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        // Set tooltip attribute for `el`
        el.setAttribute('tooltip', text);

        // Initialise logic
        this.logic(el);
    },
    createEvent: function () {
        const tooltips = document.querySelectorAll(this.constants.SELECTOR);
        if (tooltips.length === 0) {
            return;
        }

        for (const selector of tooltips) {
            this.logic(selector);
        }
    },
    events: function () {
        this.createEvent();
    }
};
