// dashboard.js
import { Analytics } from "./analytics.js";
import { Store } from "./store.js";
import { Processing } from "./processing.js";
import { language, country, dashboardBlankSlate, analyticsDuration } from "./constants.js";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";
import { formatDate } from "./helper.js";
import { Selectors } from "./selectors.js";

export const Dashboard = {
    DATA_KEYS: Analytics.DATA_KEYS,
    processData: function() {
        // Initial data
        this.COMPUTATIONS = structuredClone(dashboardBlankSlate);

        // Country codes array
        const countryCodes = Object.keys(country);

        const data = Analytics.DATA.week.data;
        const date = new Date();

        for (let i = 0; i < analyticsDuration.week; i++) {
            const query = formatDate(new Date(date.getTime() - (i * 24 * 60 * 60 * 1000)));
            const find = data.find(obj => obj.date === query);

            // If found, compute data
            if (find) {
                // Weekly computation for click & scan data
                this.COMPUTATIONS.totals.week.clicks += find.clicks;
                this.COMPUTATIONS.totals.week.scans += find.scans;

                // Today's computation
                if (i === 0) {
                    this.COMPUTATIONS.totals.today.clicks += find.clicks;
                    this.COMPUTATIONS.totals.today.scans += find.scans;
                }

                // Variable data such as country, browser, screen etc
                for (const key of this.DATA_KEYS) {
                    if (Object.keys(find[key]).length !== 0) {
                        for (let [name, clicks] of Object.entries(find[key])) {
                            if (key === 'country' && !countryCodes.includes(name)) {
                                name = 'XX';
                            }

                            // Today's computation
                            if (i === 0) {
                                this.COMPUTATIONS.insights.today[key][name] = clicks;
                            }

                            // Weekly computation
                            if (this.COMPUTATIONS.insights.week[key][name]) {
                                this.COMPUTATIONS.insights.week[key][name] = this.COMPUTATIONS.insights.week[key][name] + clicks;
                            } else {
                                this.COMPUTATIONS.insights.week[key][name] = clicks;
                            }
                        }
                    }
                }
            }
        }

        // After computation, find out the top performing values (daily & weekly)
        
    },
    updateEngagementsAndInsights: function() {
        if (!Selectors.ENGAGEMENTS_SECTION || !Selectors.INSIGHTS_SECTION) {
            return;
        }


    },
    updateDOM: async function() {
        try {
            Processing.show(document.body);

            const data = await Store.get('analytics');
            if (data.hasOwnProperty('analytics')) {
                Analytics.DATA = data['analytics'];
            }
            if (
                Object.entries(Analytics.DATA) === 0
                || !Analytics.DATA.hasOwnProperty('week')
                || Analytics.DATA['week'].refresh <= Date.now()) {
                await Analytics.getDataFromAPI('week');
            }

            // Process data in desired format
            this.processData();

            // Update engagements & insights
            this.updateEngagementsAndInsights();
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    },
    init: async function () {
        await this.updateDOM();
    }
};
