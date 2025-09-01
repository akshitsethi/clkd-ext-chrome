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
    set: function(data) {
        sessionStorage.setItem(`${this.PAGE.slug}:${this.PAGE.domain}`, JSON.stringify(data));
    },
    get: function() {
        const data = sessionStorage.getItem(`${this.PAGE.slug}:${this.PAGE.domain}`);
        if (data === null) {
            return data;
        }

        return JSON.parse(data);
    },
    createClickAndScanChart: function(selector, label, data, colors) {
        const el = document.querySelector(`#analytics #${selector}`);
        if (!el) return;

        if (this.CHART_INSTANCES[selector] instanceof Chart) {
            this.CHART_INSTANCES[selector].destroy();
        }

        this.CHART_INSTANCES[selector] = new Chart(el, {
            type: 'bar',
			data: {
				labels: data.labels,
				datasets: [
					{
						label: label,
						data: data.all,
						backgroundColor: colors.all
					},
					{
						label: 'Unique',
						data: data.unique,
						backgroundColor: colors.unique
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
    },
    createVariableChart: function(selector, type, data, colors) {
        const el = document.querySelector(`#analytics #${selector}`);
        if (!el) return;

        if (this.CHART_INSTANCES[selector] instanceof Chart) {
            this.CHART_INSTANCES[selector].destroy();
        }

        this.CHART_INSTANCES[selector] = new Chart(el, {
			type: type,
			data: {
				labels: this.processVariableLabels(selector, Object.keys(data)),
				datasets: [
					{
						label: 'Visits',
						data: Object.values(data),
						backgroundColor: colors,
						hoverOffset: 4
					},
				]
			}
		});
    },
    createDataTable: function(selector, data) {
        const el = document.querySelector(`#analytics #${selector}`);
        if (!el) return;

        if (DataTable.isDataTable(this.TABLE_INSTANCES[selector])) {
			this.TABLE_INSTANCES[selector].destroy();
		}

		this.TABLE_INSTANCES[selector] = new DataTable(
			el,
			{
				data: data,
				language: dataTableLanguage[selector],
				pageLength: 10,
				lengthChange: false
			}
		);
    },
    processDataTableRecords: function(selector, data) {
        const output = [];

        if (selector === 'country') {
            for (let [name, clicks] of Object.entries(data)) {
                name = name.replace('_', '-');
                output.push([`<span><img src="./assets/images/flags/${name}.svg"> ${country[name] ?? name}</span>`, clicks]);
            }
        } else if (selector === 'city') {
            for (let [name, clicks] of Object.entries(data)) {
                output.push([name.replace('_', ' '), clicks]);
            }
        }

        return output;
    },
    processVariableLabels: function(selector, labels) {
        if (selector === 'lang') {
            return labels.map(label => language[label.replace('_', '-')] ?? label);
        }

        return labels;
    },
    processData: function () {
        // Initial data
        this.COMPUTATIONS = structuredClone(analyticsBlankSlate);

        // Country codes array
        const countryCodes = Object.keys(country);

        const data = this.DATA[Store.SETTINGS.analytics_duration].data;
        const date = new Date();

        for (let i = 0; i < analyticsDuration[Store.SETTINGS.analytics_duration]; i++) {
            const query = formatDate(new Date(date.getTime() - (i * 24 * 60 * 60 * 1000)));
            const find = data.find(obj => obj.date === query);

            // Click and scan data
            for (const type of ['clicks', 'scans']) {
                this.COMPUTATIONS[type].labels.unshift(formatDate(new Date(query), 'chart'));

                // Add an entry for zero data
                if (!find) {
                    this.COMPUTATIONS[type].all.unshift(0);
                    this.COMPUTATIONS[type].unique.unshift(0);
                } else {
                    // Add action and unique number for the given date
                    this.COMPUTATIONS[type].all.unshift(find[type]);
                    this.COMPUTATIONS[type].unique.unshift(find[`u_${type}`]);
                }
            }

            // We don't need to process variable data if data is not found for the specified date
            if (!find) continue;

            // Variable data such as country, browser, screen etc
            for (const key of this.DATA_KEYS) {
                if (Object.keys(find[key]).length !== 0) {
                    for (let [name, clicks] of Object.entries(find[key])) {
                        if (key === 'country' && !countryCodes.includes(name)) {
                            name = 'XX';
                        }

                        if (this.COMPUTATIONS[key][name]) {
                            this.COMPUTATIONS[key][name] = this.COMPUTATIONS[key][name] + clicks;
                        } else {
                            this.COMPUTATIONS[key][name] = clicks;
                        }
                    }
                }
            }
        }
    },
    fetchFromAPI: async function (duration) {
        const request = await fetch(`${apiBase}/single`, {
            method: 'POST',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({
                slug: this.PAGE.slug,
                domain: this.PAGE.domain,
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

            const data = this.get();
            if (data !== null) {
                this.DATA = data;
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

            // Mandatory checks for the following:
            // 1. Both slug and domain exists
            // 2. Presence of valid user details
            const url = new URL(window.location.href);

            // Page slug & domain
            this.PAGE.slug = url.searchParams.get('slug');
            this.PAGE.domain = url.searchParams.get('domain');
            if (!this.PAGE.slug || !this.PAGE.domain) {
                // TODO
                // Show missing details error screen

                throw new Error(i18n.MISSING_DETAILS_ERROR);
            }

            // Initialise store
            await Store.init();

            // Check for user authentication details
            if (!Store.USER.ID || !Store.USER.token) {
                // TODO
                // Show authentication error screen

                throw new Error(i18n.NO_CREDENTIALS_ERROR);
            }

            await this.updateDOM();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    }
};
Single.init();
