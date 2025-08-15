// auth.js
import { Selectors } from "./selectors.js";
import { Store } from "./store.js";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Screen } from "./screen.js";
import { User } from "./user.js";
import { i18n } from "./i18n.js";
import { apiBase } from "./constants.js";

export const Auth = {
	login: async function () {
		try {
			// Show processing to prevent accidental clicks
			Processing.show(document.body);

			const request = await fetch(`${apiBase}/login`, {
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

			// Store entire user data
			await User.setData(response.message);

			// Steps to take care of post authentication
			User.loginSuccess();
		} catch (error) {
			console.error(error);

			// Switch to login screen and show error message
			Screen.show('unlogged', 'flex');
			Notification.error(error.message ?? i18n.DEFAULT_ERROR);
		} finally {
			Processing.hide();
		}
	},
	googleLoginEvent: function () {
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
					throw new Error(i18n.API_INVALID_RESPONSE);
				}
				if (!apiResponse.message.hasOwnProperty('email') || !apiResponse.message.hasOwnProperty('token')) {
					throw new Error(i18n.API_INVALID_RESPONSE);
				}

				// Set user data
				await User.setData(apiResponse.message);

				// Steps to take care of post authentication
				User.loginSuccess();
			} catch (error) {
				console.error(error);

				// Switch to login screen and show error message
				Screen.show('unlogged', 'flex');
				Notification.error(error.message ?? i18n.DEFAULT_ERROR);
			} finally {
				Processing.hide();
			}
		});
	},
	events: function () {
		this.googleLoginEvent();
	},
	init: async function () {
		if (Store.USER.ID && Store.USER.token) {
			await this.login();
		} else {
			Screen.show('unlogged', 'flex');
		}
	}
};
