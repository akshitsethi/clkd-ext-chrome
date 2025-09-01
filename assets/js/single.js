// single.js
import DataTable from "datatables.net";
import { Chart, registerables } from "chart.js";
import { Store } from "./store.js";
import { User } from "./user.js";
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { country, language, apiBase, refreshDuration, analyticsDuration, analyticsBlankSlate, variableChartTypes, variableChartColors, dataTableLanguage } from "./constants.js";
import { formatDate, getCurrentTab } from "./helper.js";
import { Processing } from "./processing.js";
import { Selectors } from "./selectors.js";

export const Single = {
    PAGE: {
        slug: null,
        domain: null,
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
    updateDOM: async function () {
        // Get stored data and update DOM
        try {
            Processing.show(document.body);

            const data = await Store.get('analytics');
            if (data.hasOwnProperty('analytics')) {
                this.DATA = data['analytics'];
            }
            if (
                Object.entries(this.DATA) === 0
                || !this.DATA.hasOwnProperty(Store.SETTINGS.analytics_duration)
                || this.DATA[Store.SETTINGS.analytics_duration].refresh <= Date.now()) {
                await this.fetchFromAPI(Store.SETTINGS.analytics_duration);
            }

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

            // Show `analytics-data` div
            Selectors.ANALYTICS_SECTION.style.display = 'block';
            Selectors.NO_ANALYTICS_SECTION.style.display = 'none';
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);

            // Show screen display `data not found` message
            Selectors.ANALYTICS_SECTION.style.display = 'none';
            Selectors.NO_ANALYTICS_SECTION.style.display = 'block';
        } finally {
            Processing.hide();
        }
    },
    init: async function () {
        try {
            Processing.show(document.body);

            // Fetch current tab details
            const tab = await getCurrentTab();

            // Mandatory checks for the following:
            // 1. Both slug and domain exists
            // 2. Presence of valid user details
            const url = new URL(window.location.href);

            // Page slug & domain
            this.PAGE.slug = url.searchParams.get('slug');
            this.PAGE.domain = url.searchParams.get('domain');
            if (!this.PAGE.slug || !this.PAGE.domain) {
                chrome.tabs.update(tab.id, { url: "400.html" });
                throw new Error(i18n.MISSING_DETAILS_ERROR);
            }

            console.log(Store.USER);
            console.log(Store.SETTINGS);

            // await this.updateDOM();
        } catch (error) {
            console.error(error);
        } finally {
            Processing.hide();
        }
    }
};
Single.init();
