// upgrade.js
import { apiBase } from "./constants.js";
import { Screen } from "./screen.js";
import { Selectors } from "./selectors.js";
import { Processing } from "./processing.js";
import { i18n } from "./i18n.js";
import { Store } from "./store.js";
import { Notification } from "./notification.js";

export const Upgrade = {
    constants: {
        PLANS_CLASSNAME: '.plans'
    },
    upgradeButtonEvent: function () {
        if (Selectors.UPGRADE_BUTTONS.length === 0) {
            return;
        }

        Selectors.UPGRADE_BUTTONS.forEach(button => button.addEventListener('click', async e => {
            e.preventDefault();

            try {
                const planEl = e.target.closest(this.constants.PLANS_CLASSNAME);
                Processing.show(document.body);

                const plan = e.target.getAttribute('data-plan');
                const term = e.target.getAttribute('data-term');
                if (!plan || !term) {
                    throw new Error(i18n.MALFORMED_REQUEST);
                }

                const request = await fetch(`${apiBase}/checkout`, {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    contentType: 'json',
                    body: JSON.stringify({
                        email: Store.USER.email,
                        plan,
                        term
                    })
                });

                // Get JSON data
                const response = await request.json();

                // Check for `message` property in the response returned from API
                if (!response.hasOwnProperty('message')) {
                    throw new Error(i18n.API_INVALID_RESPONSE);
                }

                // Exception for 210 status
                // which means subscription already exists for the user
                if (request.status === 210) {
                    await Screen.show('subscription-exists');
                    return;
                }
                if (request.status !== 200) {
                    throw new Error(response.message);
                }

                // Create new tab for stripe payment
                chrome.tabs.create({ url: response.message });

                // Show a new screen to verify subscription status
                await Screen.show('subscription-verify');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        }));
    },
    tenureSwitcherEvent: function () {
        if (!Selectors.TENURE_SWITCHER) {
            return;
        }

        Selectors.TENURE_SWITCHER.addEventListener('click', e => {
            if (Selectors.TENURE_MONTHLY.length === 0 || Selectors.TENURE_YEARLY.length === 0) {
                return;
            }

            if (e.target.checked) {
                Selectors.TENURE_MONTHLY.forEach(monthly => monthly.style.display = 'none');
                Selectors.TENURE_YEARLY.forEach(yearly => yearly.style.display = 'flex');

                Selectors.UPGRADE_BUTTONS.forEach(button => button.setAttribute('data-term', 'yearly'));
                Selectors.UPGRADE_SAVER_PILL.style.display = 'block';
            } else {
                Selectors.TENURE_MONTHLY.forEach(monthly => monthly.style.display = 'block');
                Selectors.TENURE_YEARLY.forEach(yearly => yearly.style.display = 'none');

                Selectors.UPGRADE_BUTTONS.forEach(button => button.setAttribute('data-term', 'monthly'));
                Selectors.UPGRADE_SAVER_PILL.style.display = 'none';
            }
        });
    },
    events: function () {
        this.upgradeButtonEvent();
        this.tenureSwitcherEvent();
    }
};
