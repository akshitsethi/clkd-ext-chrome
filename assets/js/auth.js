// auth.js
import { Selectors } from "./selectors.js";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";
import { apiBase } from "./constants.js";
import { Processing } from "./processing.js";

export const Auth = {
	googleLoginEvent: function() {
		if (!Selectors.GOOGLE_OAUTH_BUTTON) {
			throw new Error(i18n.SELECTOR_NOT_FOUND);
		}

		Selectors.GOOGLE_OAUTH_BUTTON.addEventListener('click', async e => {
            e.preventDefault();

			try {
				// Show processing to prevent accidental clicks
				Processing.show(document.body);

				const { token } = await chrome.identity.getAuthToken({ interactive: true });
				const options = {
					method: 'GET',
					async: true,
					headers: {
						Authorization: 'Bearer ' + token,
						'Content-Type': 'application/json'
					},
					contentType: 'json'
				};

				const request = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', options);
				const response = await request.json();

				// We have response from Google's endpoint
				// Send a request to CLKD's API endpoint for registering the user
				// Call API endpoint for registering user
				// Wrap them in separate try/catch so as to show accurate error to the user
				const apiRequest = await fetch(`${apiBase}/user`, {
					method: 'POST',
					async: true,
					headers: {
						'Content-Type': 'application/json'
					},
					contentType: 'json',
					body: JSON.stringify({
						id: response.id,
						email: response.email,
						name: `${response.given_name} ${response.family_name}`,
						picture: response.picture,
						token: token,
						email_verified: response.verified_email ?? false
					})
				});
				const apiResponse = await apiRequest.json();

				// Check for `message` property in the response returned from API
				if (!apiResponse.hasOwnProperty('message')) {
					throw new Error('')
				}

				if (!data['message']['email'] || !data['message']['token']) {
					throw new Error('');
				}
			} catch (error) {
				console.log(error);
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	events: function () {
		this.googleLoginEvent();
	},
	init: function () {

	}
};
