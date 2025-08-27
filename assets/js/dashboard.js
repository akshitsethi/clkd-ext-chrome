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
    CURRENT_PERIOD: 'today',
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
        for (const key of this.DATA_KEYS) {
            for (const period of ['today', 'week']) {
                if (Object.keys(this.COMPUTATIONS.insights[period]).length !== 0) {
                    this.COMPUTATIONS.insights[period][key] = Object.keys(this.COMPUTATIONS.insights[period][key]).reduce((a, b) => this.COMPUTATIONS.insights[period][key][a] > this.COMPUTATIONS.insights[period][key][b] ? a : b);
                } else {
                    this.COMPUTATIONS.insights[period][key] = '--';
                }
            }
		}
    },
    processPrettyName: function(type, value) {
        if (type === 'lang') {
            return language[value.replace('_', '-')] ?? value;
        } else if (type === 'country') {
            value = value.replace('_', '-');
            return `<span><img src="./assets/images/flags/${value}.svg"> ${country[value] ?? value}</span>`
        } else if (type === 'city') {
            return value.replace('_', ' ');
        }

        return value;
    },
    updateEngagementsAndInsights: function(period = 'today') {
        if (!Selectors.ENGAGEMENTS_SECTION || !Selectors.INSIGHTS_SECTION) {
            return;
        }

        // Engagements
        const stats = Selectors.ENGAGEMENTS_SECTION.querySelectorAll('div[data-stat]');
        if (stats.length !== 0) {
            stats.forEach(stat => {
                const type = stat.getAttribute('data-stat');
                const number = stat.querySelector('.number');
                if (!type || !number) {
                    return;
                }

                number.innerText = this.COMPUTATIONS.totals[period][type];
            });
        }

        // Insights
        const insights = Selectors.INSIGHTS_SECTION.querySelectorAll('div[data-insight]');
        if (insights.length !== 0) {
            insights.forEach(insight => {
                const type = insight.getAttribute('data-insight');
                const span = insight.querySelector('span');
                if (!type || !span) {
                    return;
                }

                span.innerHTML = this.processPrettyName(type, this.COMPUTATIONS.insights[period][type]);
            });
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
            this.updateEngagementsAndInsights(this.CURRENT_PERIOD);
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();
        }
    },
    updatePeriodEvent: function() {
        if (!Selectors.STATS_SWITCHER_BUTTON) {
            return;
        }

        Selectors.STATS_SWITCHER_BUTTON.addEventListener('click', e => {
            e.preventDefault();

            try {
                Processing.show(document.body);

                const currentPeriod = e.target.getAttribute('data-period');
                if (!currentPeriod) {
                    throw new Error(i18n.SELECTOR_NOT_FOUND);
                }
                this.CURRENT_PERIOD = currentPeriod === 'today' ? 'week' : 'today';

                // Update attribute and text
                e.target.setAttribute('data-period', this.CURRENT_PERIOD);
                e.target.innerText = this.CURRENT_PERIOD;

                // Update engagements & insights
                this.updateEngagementsAndInsights(this.CURRENT_PERIOD);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        });
    },

    events: function() {
        this.updatePeriodEvent();
    },
    init: async function () {
        // Update DOM with computations
        await this.updateDOM();
    }
};
