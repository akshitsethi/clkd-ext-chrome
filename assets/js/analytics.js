// analytics.js
import { Store } from "./store.js";
import { User } from "./user.js";
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { country, apiBase, refreshDuration, analyticsDuration } from "./constants.js";
import { formatDate } from "./helper.js";

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
        if (request.status !== 200) {
            throw new Error(response.message);
        }

        if (typeof response.message === 'object') {
            data = duration === 'day' ? [{ ...response.message }] : response.message;
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
    processVariableData: function(data) {
        console.log(data);
    },
    processClickAndScanData: function(data) {
        // Add an entry for zero data
        if (data === null) {

        }

        // Add action and unique number for the given date
        
    },
    processData: function() {
        // Set initial data
        this.COMPUTATIONS = {
            clicks: {
                all: [],
    			unique: []
            },
            scans: {
                all: [],
                unique: []
            },
            browser: {},
			os: {},
			screen: {},
			lang: {},
			country: {},
			city: {}
        };

        const data = this.DATA[Store.SETTINGS.analytics_duration]['data'];
        const date = new Date();

        for (let i = 0; i < analyticsDuration[Store.SETTINGS.analytics_duration]; i++) {
            const query = formatDate(new Date(date.getTime() - (i * 24 * 60 * 60 * 1000)));
            const find = data.find(obj => obj.date === query);

            if (find) {
                this.processVariableData(find);
                this.processClickAndScanData(find);
            } else {
                this.processClickAndScanData(null);
            }
        }
    },
    updateDOM: function () {
        this.processData();
    },
    events: function () {

    },
    init: async function () {
        // Get stored data and update DOM
        try {
            const data = await Store.get('analytics');
            if (data.hasOwnProperty('analytics')) {
                this.DATA = data['analytics'];
            }

            if (
                Object.entries(this.DATA) === 0
                || !this.DATA.hasOwnProperty(Store.SETTINGS.analytics_duration)
                || this.DATA[Store.SETTINGS.analytics_duration].refresh <= Date.now()) {
                await this.getDataFromAPI(Store.SETTINGS.analytics_duration);
            }

            // Now that we have data, update DOM
            this.updateDOM();
        } catch (error) {
            // TODO
            // Show `no data` screen here as either the data is not available or we encountered an error


            console.log(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        }
    }
};
