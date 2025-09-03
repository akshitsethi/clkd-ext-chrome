// account.js
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Selectors } from "./selectors.js";
import { Store } from "./store.js";

export const Account = {
    pointers: {
        user: {
            name: 'Name',
            email: 'Email',
            picture: 'Photo',
            email_verified: 'Status',
            uuid: 'UUID'
        },
        subscription: {
            plan: 'Plan',
            cycle: 'Billing',
            price: 'Cost',
            start: 'Start Date',
            end: 'Valid Until',
            status: 'Status'
        }
    },
    updateDOM: function () {
        try {
            if (!Selectors.ACCOUNT_USER_SECTION || !Selectors.ACCOUNT_SUBSCRIPTION_SECTION) {
                throw new Error(i18n.SELECTOR_NOT_FOUND);
            }

            // Processing
            Processing.show(document.body);

            // Before starting, remove existing data
            Selectors.ACCOUNT_USER_SECTION.innerHTML = null;
            Selectors.ACCOUNT_SUBSCRIPTION_SECTION.innerHTML = null;

            // User details
            for (const [key, value] of Object.entries(this.pointers.user)) {
                if (!Store.USER[key]) {
                    continue;
                }

                // Parent container
                const container = document.createElement('div');

                // Label
                const labelEl = document.createElement('span');
                labelEl.classList.add('label');
                labelEl.appendChild(document.createTextNode(value));

                // Data value based on key
                let data;
                if (key === 'picture') {
                    data = document.createElement('img');
                    data.setAttribute('src', Store.USER[key] ?? './assets/images/gravatar.png');
                    data.setAttribute('alt', Store.USER.name);
                } else if (key === 'email_verified') {
                    data = document.createElement('img');
                    data.setAttribute('src', Store.USER[key] === true ? './assets/images/verified.png' : './assets/images/unverified.png');
                } else {
                    data = document.createTextNode(Store.USER[key]);
                }

                const dataEl = document.createElement('span');
                dataEl.classList.add('data');
                dataEl.appendChild(data);

                container.appendChild(labelEl);
                container.appendChild(dataEl);

                Selectors.ACCOUNT_USER_SECTION.appendChild(container);
            }

            // Subscription
            const headingEl = document.createElement('h2');
            headingEl.appendChild(document.createTextNode('Subscription'));
            Selectors.ACCOUNT_SUBSCRIPTION_SECTION.appendChild(headingEl);

            if (Object.keys(Store.USER.subscription).length) {
                for (const [key, value] of Object.entries(this.pointers.subscription)) {
                    if (!Store.USER.subscription[key]) {
                        continue;
                    }

                    // Parent container
                    const container = document.createElement('div');

                    // Label
                    const labelEl = document.createElement('span');
                    labelEl.classList.add('label');
                    labelEl.appendChild(document.createTextNode(value));

                    // Data value based on key
                    let data;
                    if (key === 'price') {
                        data = document.createTextNode(`USD ${Store.USER.subscription[key] / 100}`);
                    } else if (key === 'start' || key === 'end') {
                        data = document.createTextNode(new Date(Store.USER.subscription[key] * 1000).toUTCString());
                    } else {
                        data = document.createTextNode(Store.USER.subscription[key]);
                    }

                    const dataEl = document.createElement('span');
                    dataEl.classList.add('data');
                    dataEl.appendChild(data);

                    container.appendChild(labelEl);
                    container.appendChild(dataEl);

                    Selectors.ACCOUNT_SUBSCRIPTION_SECTION.appendChild(container);
                }
            } else {
                const template = Selectors.ACCOUNT_NO_SUBSCRIPTION_TEMPLATE.content;
                const content = template.cloneNode(true);

                Selectors.ACCOUNT_SUBSCRIPTION_SECTION.appendChild(content);
            }
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    },
    init: function () {
        this.updateDOM();
    }
};
