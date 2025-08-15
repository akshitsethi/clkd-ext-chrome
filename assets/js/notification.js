// notification.js
import { animate } from "motion";

export const Notification = {
    constants: {
        TOAST_CLASSNAME: '.toast'
    },
    show: function (message, type = 'normal') {
        const el = document.createElement('div');
        el.classList.add('toast', type);
        el.appendChild(document.createTextNode(message));

        // Before inserting, check for existing children
        const children = document.body.querySelectorAll(this.constants.TOAST_CLASSNAME);

        // Prepend to DOM
        document.body.prepend(el);
        animate(el, { y: [10, 0] }, { at: 1 });
        setTimeout(() => {
            animate(el, { opacity: 0 }, { ease: "easeInOut", duration: 0.25 });

            // Wait 1s for animation to finish before removing element from DOM
            setTimeout(() => {
                el.remove();
            }, 1000);
        }, 4000);

        if (children.length !== 0) {
            let bottom = 0;
            let scale = 1;
            let count = 0;
            let zIndex = -1;
            let y = 0;

            for (const el of children) {
                ++count;

                // Remove all children but first 2 children
                if (count > 2) {
                    --zIndex;
                    animate(el, { opacity: 0, y: [0, -35], zIndex: zIndex }, { ease: "easeInOut", duration: 0.25 });
                    continue;
                }

                scale -= 0.06;
                bottom -= 10;

                animate(el, { scale: scale, y: [y, bottom] }, { ease: "easeInOut", duration: 0.25 });
                y -= 15;
            }
        }
    },
    success: function (message) {
        this.show(message, 'success');
    },
    error: function (message) {
        this.show(message, 'error');
    },
    info: function (message) {
        this.show(message, 'info');
    },
    warning: function (message) {
        this.show(message, 'warning');
    }
};
