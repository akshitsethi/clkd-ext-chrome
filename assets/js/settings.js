// settings.js
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Selectors } from "./selectors.js";
import { Store } from "./store.js";
import { apiBase } from "./constants.js";
import { User } from "./user.js";
import { Limits } from "./limits.js";

export const Settings = {
    DEFAULT: {
        analytics_duration: 'week',
        links_per_page: '10',
        default_domain: 'clkdin',
        pages_per_page: '10',
        default_page_domain: 'clkdin',
        qr_background: '#ffffff',
        qr_text: '#000000'
    },
    OPTIONS: {
        analytics_duration: ['day', 'week', '2weeks', 'month'],
        links_per_page: ['5', '10', '25', '50', '100'],
        default_domain: ['clkd.in', 'clk.gg', 'pgx.es', 'cd.lk', 'xx.lk'],
        pages_per_page: ['5', '10', '25', '50', '100'],
        default_page_domain: ['clkd.in', 'clk.gg', 'pgx.es', 'cd.lk', 'xx.lk']
    },
    updateDOM: async function () {
        try {
            Processing.show(document.body);

            // Fetch settings from API before updating DOM
            // Before that, check if data exists in `Store.SETTINGS` object
            if (Object.entries(Store.SETTINGS).length === 0) {
                await this.fetchFromAPI();
            }
        } catch (error) {
            console.error(error);
        } finally {
            for (const [key, value] of Object.entries(Store.SETTINGS)) {
                const element = Selectors.SETTINGS_FORM.querySelector(`#${key}`);
                if (element) {
                    element.value = value;

                    if (element.type === 'color') {
                        element.setAttribute('data-previous', value);
                    }
                }
            }

            Processing.hide();
        }
    },
    verifyData: function (data) {
        for (const option of Object.keys(this.OPTIONS)) {
            if (!data.hasOwnProperty(option) || !this.OPTIONS[option].includes(data[option])) {
                data[option] = this.DEFAULT[option];
            }
        }

        return data;
    },
    fetchFromAPI: async function () {
        const request = await fetch(`${apiBase}/settings?ID=${Store.USER.ID}`, {
            method: 'GET',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            contentType: 'json'
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

        // Settings object
        const settings = {
            analytics_duration: response.message.setting_analytics_duration,
            links_per_page: response.message.setting_links_per_page,
            default_domain: response.message.setting_default_domain,
            pages_per_page: response.message.setting_pages_per_page,
            default_page_domain: response.message.setting_default_page_domain,
            qr_background: response.message.setting_qr_background,
            qr_text: response.message.setting_qr_text
        };

        // Store user settings
        await User.setSettings(settings);
    },
    syncWithAPI: async function (settings) {
        const request = await fetch(`${apiBase}/settings`, {
            method: 'POST',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({
                ...settings,
                user_id: Store.USER.ID,
                token: Store.USER.token
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

        // Store data locally
        await Store.set({ settings: settings }, 'sync');

        // Also, update local variable for the current session
        Store.SETTINGS = settings;

        // Add success notification
        Notification.success(i18n.SETTINGS_UPDATED)
    },
    formSubmitEvent: function () {
        if (!Selectors.SETTINGS_FORM) return;

        Selectors.SETTINGS_FORM.addEventListener('submit', async e => {
            e.preventDefault();

            try {
                Processing.show(document.body);

                // Create form data object
                const data = new FormData(e.target);

                // Store settings
                let settings = {
                    analytics_duration: data.get('analytics_duration') ?? this.DEFAULT.analytics_duration,
                    links_per_page: data.get('links_per_page') ?? this.DEFAULT.links_per_page,
                    default_domain: data.get('default_domain') ?? this.DEFAULT.default_domain,
                    qr_background: data.get('qr_background') ?? this.DEFAULT.qr_background,
                    qr_text: data.get('qr_text') ?? this.DEFAULT.qr_text
                };

                // Before saving settings, ensure that user's membership levels allows for settings to be saved.
                // Also, verify that data saved does not exceed set limitations.
                settings = this.verifyData(settings);

                // Sync settings with API (before storing them locally)
                await this.syncWithAPI(settings);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        });
    },
    colorChangeEvent: function() {
        if (!Selectors.SETTINGS_FORM) return;

        const colors = Selectors.SETTINGS_FORM.querySelectorAll('input[type=color]');
        if (!colors) return;

        colors.forEach(color => color.addEventListener('change', e => {
            const newValue = e.target.value;
            const oldValue = e.target.getAttribute('data-previous');

            if (newValue === oldValue) return;

            // Revert change if user is on a free plan
            console.log(Store.USER);
            if (!Store.USER.is_premium) {
                Limits.upgradeModal('QR Code Colors');

                e.target.value = oldValue;
            }
        }));
    },
    events: function () {
        this.formSubmitEvent();
        this.colorChangeEvent();
    },
    init: async function() {
        await this.updateDOM();
    }
};
