// auth.js
// import { Notification } from "./notification.js";
// import { Screen } from "./screen.js";
// import { Processing } from "./processing.js";
// import { MESSAGES } from "./i18n.js";
// import { Header } from "./header.js";
// import { Storage } from "./storage.js";
// import { Limits } from "./limits.js";
import { apiBase } from "./constants.js";
// import { Settings } from "./settings.js";

export const Auth = {
	selectors: {
		BODY: document.querySelector('body'),
	    GOOGLE_LOGIN_BUTTON: document.querySelector('.social-buttons .google'),
	},
	authenticate: function () {
		if (!this.selectors.GOOGLE_LOGIN_BUTTON) {
			return;
		}

		this.selectors.GOOGLE_LOGIN_BUTTON.addEventListener('click', async e => {
            e.preventDefault();

            // TODO
            // Processing

            try {
                const token = await chrome.identity.getAuthToken({ interactive: true });
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
                const userRequest = await fetch(`${apiBase}/user`, {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    contentType: 'json',
                    body: JSON.stringify({
                        id: data['id'],
                        email: data['email'],
                        name: `${data['given_name']} ${data['family_name']}`,
                        picture: data['picture'],
                        token: token,
                        email_verified: data['verified_email'] ?? false
                    })
                });
                const userResponse = await response.json();

                // Check for `message` property in the response returned from API


                if (!data['message']['email'] || !data['message']['token']) {
                    throw new Error();
                }

                // Store entire user data
                await Storage.set({ user: data['message'] }, 'sync');

                // Set data to variable
                Storage.USER_DATA = data['message'];

                // Enforce limits (based on account level)
                Limits.init();

                // Check for user settings
                await Settings.checkAndFetchSettings();

                // Initialise storage
                await Storage.init();

                // Check for subscription status
                this.checkSubscription();

                // Check for subscription and show header
                Header.show();

                // Show "Dashboard"
                Screen.dashboard();

                // Hide processing and show logged-in notification
                Processing.hide();
                Notification.show(MESSAGES.LOGGED_IN);
            } catch (error) {
                console.error(error.message);
            }
		});
	},
	checkLogin: async function() {
		try {
			if (Storage.USER_DATA['email'] && Storage.USER_DATA['token']) {
				const request = await fetch(`${apiBase}/login`, {
					method: 'POST',
					async: true,
					headers: {
						'Content-Type': 'application/json'
					},
					contentType: 'json',
					body: JSON.stringify({
						user_id: Storage.USER_DATA['ID'],
						token: Storage.USER_DATA['token']
					})
				});

				// Get JSON data
				const data = await request.json();

				if (request.status === 200) {
					// Store entire user data
					await Storage.set({ user: data['message'] }, 'sync');

					// Set data to variable
					Storage.USER_DATA = data['message'];

					// Enforce limits (based on account level)
					Limits.init();

					// Check for user settings
					await Settings.checkAndFetchSettings();

					// Initialise storage
					await Storage.init();

					// Check for subscription status
					this.checkSubscription();

					// Check for subscription and show header
					Header.show();

					// Show dashboard
					Screen.dashboard();

					return;
				} else {
					Notification.show(data['message']);
				}
			}

			this.authenticate();
		} catch (error) {
			console.log(error);

			this.authenticate();
			Notification.show(MESSAGES.USER_CHECK_ERROR);
		}
	},
	checkSubscription: function() {
		if (!this.selectors.SUBHEADER_CTA) {
			return;
		}

		let displayStyle = 'block';

		if (Storage.USER_DATA && Storage.USER_DATA['is_premium']) {
			displayStyle = 'none';
		}

		this.selectors.SUBHEADER_CTA.style.display = displayStyle;
	},
	logout: async function() {
		await Storage.clear();

		// Hide header and proceed to logout
		Header.hide();

		setTimeout(() => {
			location.reload();
		}, 1000);
	}
};
