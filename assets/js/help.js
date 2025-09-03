// help.js
import { Selectors } from "./selectors.js";
import { Processing } from "./processing.js";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";
import { apiBase } from "./constants.js";
import { Store } from "./store.js";

export const Help = {
    updateDOM: function () {
        if (!Selectors.HELP_FORM) return;

        const name = Selectors.HELP_FORM.querySelector('[name="name"]');
        if (name) {
            name.value = Store.USER.name;
        }

        const email = Selectors.HELP_FORM.querySelector('[name="email"]');
        if (email) {
            email.value = Store.USER.email;
        }
    },
    formSubmitEvent: function () {
        if (!Selectors.HELP_FORM) return;

        Selectors.HELP_FORM.addEventListener('submit', async e => {
            e.preventDefault();

            try {
                Processing.show(document.body);

                const data = new FormData(e.target);
                const request = await fetch(`${apiBase}/support`, {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    contentType: 'json',
                    body: JSON.stringify({
                        user_id: Store.USER.ID,
                        password: Store.USER.token,
                        email: data.get('email'),
                        name: data.get('name'),
                        subject: data.get('subject'),
                        message: data.get('issue')
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

                Selectors.HELP_SECTION_SUCCESS.style.display = 'block';
                Selectors.HELP_SECTION.style.display = 'none';
            } catch (error) {
                console.error(error);
                Notification.error(error.message || i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        });
    },
    resetHelpScreenEvent: function () {
        if (!Selectors.HELP_SECTION_SUCCESS) return;

        const button = Selectors.HELP_SECTION_SUCCESS.querySelector('button');
        if (!button) {
            return;
        }

        button.addEventListener('click', e => {
            e.preventDefault();

            // Reset form
            Selectors.HELP_FORM.reset();

            // Update DOM again
            this.updateDOM();

            Selectors.HELP_SECTION_SUCCESS.style.display = 'none';
            Selectors.HELP_SECTION.style.display = 'block';
        });
    },
    actionLinksEvent: function () {
        if (Selectors.HELP_LINKS.length === 0) return;

        Selectors.HELP_LINKS.forEach(link => link.addEventListener('click', e => {
            e.preventDefault();

            try {
                const action = e.target.getAttribute('data-action');
                const input = e.target.getAttribute('data-input');
                if (!action || !input) {
                    throw new Error(i18n.MALFORMED_REQUEST);
                }

                chrome.tabs.create({ url: `${action}:${input}` });
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    events: function () {
        this.formSubmitEvent();
        this.resetHelpScreenEvent();
        this.actionLinksEvent();
    },
    init: function () {
        this.updateDOM();
    }
};
