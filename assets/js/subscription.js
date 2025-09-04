// subscription.js
import confetti from "canvas-confetti";
import { Processing } from "./processing.js";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";
import { Selectors } from "./selectors.js";
import { Screen } from "./screen.js";
import { Store } from "./store.js";
import { apiBase } from "./constants.js";
import { User } from "./user.js";

export const Subscription = {
    successEvent: function (showConfetti = false) {
        if (!Selectors.SUBSCRIPTION_DETAILS_SECTION || !Store.USER.subscription) return;

        if (!Object.keys(Store.USER.subscription).length) {
            throw new Error(i18n.SUBSCRIPTION_DATA_NOT_AVAILABLE);
        }

        // Add plan info and end date
        const plan = Selectors.SUBSCRIPTION_DETAILS_SECTION.querySelector('.plan span');
        const validity = Selectors.SUBSCRIPTION_DETAILS_SECTION.querySelector('.validity span');
        if (!plan || !validity) {
            throw new Error(i18n.SELECTOR_NOT_FOUND);
        }

        plan.innerText = Store.USER.subscription.plan;
        validity.innerText = new Date(Store.USER.subscription.end * 1000).toString();

        if (showConfetti) {
            // Confetti (as a celebration for subscription purchase)
            var end = Date.now() + (3 * 1000);

            (function celebrate() {
                confetti({
                    particleCount: 4,
                    angle: 60,
                    spread: 45,
                    origin: { x: 0 },
                    colors: ['#38b6ff']
                });
                confetti({
                    particleCount: 4,
                    angle: 120,
                    spread: 45,
                    origin: { x: 1 },
                    colors: ['#38b6ff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(celebrate);
                }
            }());
        }
    },
    verifyButtonEvent: function () {
        if (!Selectors.VERIFY_SUBSCRIPTION_BUTTON) return;

        Selectors.VERIFY_SUBSCRIPTION_BUTTON.addEventListener('click', async e => {
            e.preventDefault();

            try {
                Processing.show(document.body);

                const request = await fetch(`${apiBase}/subscription`, {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    contentType: 'json',
                    body: JSON.stringify({
                        user_id: Store.USER.ID,
                        token: Store.USER.token
                    })
                });

                // Get JSON data
                const response = await request.json();

                // Check for `message` property in the response returned from API
                if (!response.hasOwnProperty('message')) {
                    throw new Error(i18n.API_INVALID_RESPONSE);
                }
                if (request.status !== 200) {
                    throw new Error(response.message);
                }

                // Update subscription details and premium status
                Store.USER.subscription = response.message;
                Store.USER.is_premium = response.message.status === 'active' ? true : false;

                // Update locally stored subscription data
                await User.setData(Store.USER);

                // Success event
                this.successEvent(true);

                // Show success screen
                await Screen.show('subscription-success');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        });
    },
    events: function () {
        this.verifyButtonEvent();
    }
};
