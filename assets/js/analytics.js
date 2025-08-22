// analytics.js
import { Store } from "./store.js";
import { apiBase, refreshDuration } from "./constants.js";
import { User } from "./user.js";

export const Analytics = {
    DATA: {},
    getDataFromAPI: async function (duration) {
        const request = await fetch(`${apiBase}/analytics`, {
            method: 'POST',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({
                user_id: Store.USER.ID,
                token: Store.USER.token,
                duration
            })
        });

        // Create empty array for data
        let data = [];

        // Get JSON data
        const response = await request.json();

        // Check for `message` property in the response returned from API
        if (!response.hasOwnProperty('message')) {
            throw new Error(i18n.API_INVALID_RESPONSE);
        }

        // Exception for 210 status
        // which means no data found for the user's account
        if (request.status !== 200 && request.status !== 210) {
            throw new Error(response.message);
        }
        if (typeof response.message === 'object') {
            data = duration === 'day' ? [{...response.message}] : response.message;
        }

        // Analytics object
        const analytics = this.DATA;
        analytics[duration] = {
            data,
            refresh: refreshDuration.analytics.account
        };

        // Store analytics data for the user
        User.setAnalytics(analytics);
    },
    init: function() {

    }
};
