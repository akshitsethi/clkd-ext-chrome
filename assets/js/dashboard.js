// dashboard.js
import { Analytics } from "./analytics.js";
import { Store } from "./store.js";
import { Processing } from "./processing.js";
import { language, country } from "./constants.js";
import { i18n } from "./i18n.js";

export const Dashboard = {
    init: async function () {
        try {
            Processing.show(document.body);

            // const data = await Store.get('analytics');
            // if (data.hasOwnProperty('analytics')) {
            //     Analytics.DATA = data['analytics'];
            // }
            // if (
            //     Object.entries(Analytics.DATA) === 0
            //     || !Analytics.DATA.hasOwnProperty('week')
            //     || Analytics.DATA['week'].refresh <= Date.now()) {
            //     await Analytics.getDataFromAPI('week');
            // }

            // console.log(Analytics.DATA);
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        }
    }
};
