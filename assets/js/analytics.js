// analytics.js
import { Store } from "./store.js";
import { apiBase } from "./constants.js";

export const Analytics = {
    getDataFromAPI: async function (duration = 'week') {
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

        // Get JSON data
        const response = await request.json();

        // Check for `message` property in the response returned from API
        if (!response.hasOwnProperty('message')) {
            throw new Error(i18n.API_INVALID_RESPONSE);
        }
        if (request.status !== 200) {
            throw new Error(response.message);
        }

        console.log(response);
    }
};
