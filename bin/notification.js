// bin/notification.js
import { animate } from "motion";

const Notification = {
    selectors: {
        CONTAINER: document.querySelector('.toast'),
        ADD_BUTTON: document.getElementById('add-toast')
    },
    create: function(message, type = 'normal') {
        const el = document.createElement('li');
        el.classList.add(type);
        el.appendChild(document.createTextNode(message));

        // Before inserting, check for existing childs
        const children = this.selectors.CONTAINER.querySelectorAll('li');

        this.selectors.CONTAINER.prepend(el);
        animate(el, { y: [100, 0] }, { at: 1 });
        setTimeout(() => {
            animate(el, { opacity: 0, y: [0, -25] }, { ease: "easeInOut", duration: 0.25 });

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
    createToastEvent: function() {
        if (!this.selectors.ADD_BUTTON) {
            return;
        }

        this.selectors.ADD_BUTTON.addEventListener('click', e => {
            e.preventDefault();

            console.log(e.timeStamp);
            this.create(e.timeStamp, 'success');
        });
    },
    events: function() {
        this.createToastEvent();
    }
};

Notification.events();
