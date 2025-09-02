// single.js
import DataTable from "datatables.net";
import { Chart, registerables } from "chart.js";
import { Store } from "./store.js";
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { country, language, apiBase, refreshDuration, analyticsDuration, analyticsBlankSlate, variableChartTypes, variableChartColors, dataTableLanguage } from "./constants.js";
import { formatDate } from "./helper.js";
import { Processing } from "./processing.js";
import { Selectors } from "./selectors.js";
import { Analytics } from "./analytics.js";
import { Screen } from "./screen.js";

export const Single = {
    constants: {
        SECTION_CLASSNAME: '#single'
    },
    link: {
        domain: null,
        slug: null,
        url: null,
        created: null
    },
    DATA: {},
    DATA_KEYS: ['browser', 'os', 'screen', 'lang', 'country', 'city'],
    VARIABLE_CHARTS: ['browser', 'os', 'screen', 'lang'],
    VISIT_CHARTS: ['clicks', 'scans'],
    TABLE_INSTANCES: {
        country: null,
        city: null
    },
    CHART_INSTANCES: {
        clicks: null,
        scans: null,
        browser: null,
        os: null,
        screen: null,
        lang: null
    },
    set: async function(data) {
        if (!this.link.domain || !this.link.slug) {
            throw new Error(i18n.MALFORMED_REQUEST);
        }

        // Add data to unique key
        const object = {};
        object[`${this.link.slug}:${this.link.domain}`] = data;

        await chrome.storage.session.set(object);
    },
    get: async function() {
        if (!this.link.domain || !this.link.slug) {
            throw new Error(i18n.MALFORMED_REQUEST);
        }

        const data = await chrome.storage.session.get(`${this.link.slug}:${this.link.domain}`);
        if (!data || !data.hasOwnProperty(`${this.link.slug}:${this.link.domain}`)) {
            return null;
        }

        return data[`${this.link.slug}:${this.link.domain}`];
    },
    reset: function() {
        this.DATA = {};
        this.COMPUTATIONS = {};
    },
    createClickAndScanChart: Analytics.createClickAndScanChart,
    createVariableChart: Analytics.createVariableChart,
    createDataTable: Analytics.createDataTable,
    processDataTableRecords: Analytics.processDataTableRecords,
    processVariableLabels: Analytics.processVariableLabels,
    processData: Analytics.processData,
    fetchFromAPI: async function (duration) {
        const request = await fetch(`${apiBase}/single`, {
            method: 'POST',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({
                slug: this.link.slug,
                domain: this.link.domain,
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

        // Store slug analytics data in session storage
        this.set(analytics);
    },
    updateDOM: async function () {
        // Get stored data and update DOM
        try {
            Processing.show(document.body);

            const data = await this.get();
            if (data !== null) {
                this.DATA = data;
            }
            if (
                Object.entries(this.DATA) === 0
                || !this.DATA.hasOwnProperty(Store.SETTINGS.analytics_duration)
                || this.DATA[Store.SETTINGS.analytics_duration].refresh <= Date.now()) {
                await this.fetchFromAPI(Store.SETTINGS.analytics_duration);
            }

            console.log(this.DATA);

            // Let's process data
            this.processData();

            // Register required components(or registrables)
            Chart.register(...registerables);

            // Initialise charts
            for (const key of this.VISIT_CHARTS) {
                this.createClickAndScanChart(
                    key,
                    key.charAt(0).toUpperCase() + key.substring(1),
                    this.COMPUTATIONS[key],
                    variableChartColors[key]
                );
            }

            // Create country and city records table
            this.createDataTable('country', this.processDataTableRecords('country', this.COMPUTATIONS['country']));
            this.createDataTable('city', this.processDataTableRecords('city', this.COMPUTATIONS['city']));

            for (const key of this.VARIABLE_CHARTS) {
                this.createVariableChart(
                    key,
                    variableChartTypes[key],
                    this.COMPUTATIONS[key],
                    variableChartColors[key]
                );
            }

            // Switch screen
            Screen.show('single');

            // Show `analytics-data` div
            Selectors.SINGLE_ANALYTICS_SECTION.style.display = 'block';
            Selectors.SINGLE_NO_ANALYTICS_SECTION.style.display = 'none';
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);

            // Show screen display `data not found` message
            Selectors.SINGLE_ANALYTICS_SECTION.style.display = 'none';
            Selectors.SINGLE_NO_ANALYTICS_SECTION.style.display = 'block';
        } finally {
            // Processing.hide();
        }
    },
    init: async function (domain, slug, url, created) {
        if (!domain || !slug || !url || !created) {
            throw new Error(i18n.MISSING_DETAILS_ERROR);
        }

        // Reset variables
        this.reset();

        // Update link object
        this.link = {
            domain,
            slug,
            url,
            created
        };

        await this.updateDOM();
    }
};
