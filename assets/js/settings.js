// settings.js
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { Processing } from "./processing.js";
import { Selectors } from "./selectors.js";
import { Store } from "./store.js";
import { analyticsDurationNiceName, apiBase, defaultDomain, domains, planAnalyticsDuration, planDomains, storageBase } from "./constants.js";
import { User } from "./user.js";
import { Limits } from "./limits.js";

export const Settings = {
    constants: {
        ANALYTICS_DURATION_CLASSNAME: 'select[name=analytics_duration]',
        DOMAIN_FIELDS_CLASSNAME: 'select[name=default_domain], select[name=default_page_domain]',
        QR_LOGO_ADD_BUTTON_CLASSNAME: '.add-logo',
        FORM_OPTION_CLASSNAME: '.option',
        QR_LOGO_ACTIONS_CLASSNAME: '.logo-actions'
    },
    DEFAULT: {
        analytics_duration: '3days',
        links_per_page: '10',
        default_domain: defaultDomain,
        pages_per_page: '10',
        default_page_domain: defaultDomain,
        qr_background: '#ffffff',
        qr_text: '#000000',
        qr_logo: null
    },
    OPTIONS: {
        analytics_duration: ['day', '3days', 'week', '2weeks', 'month', '2months'],
        links_per_page: ['5', '10', '25', '50', '100'],
        default_domain: domains,
        pages_per_page: ['5', '10', '25', '50', '100'],
        default_page_domain: domains
    },
    fileToBase64: async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (e) => reject(e);
        });
    },
    showQRLogo: async function(element, slug) {
        if (!slug) return;

        // We have the logo, so show it on screen and skip setting the value for `file` input
        const parent = element.closest(this.constants.FORM_OPTION_CLASSNAME);
        if (!parent) return;

        const template = Selectors.LOGO_ACTIONS_TEMPLATE.content;
        const content = template.cloneNode(true);

        // Event listeners
        content.querySelector('[data-action="view"]').addEventListener('click', e => {
            e.preventDefault();
            chrome.tabs.create({ url: `${storageBase}${slug}` });
        });
        content.querySelector('[data-action="delete"]').addEventListener('click', async e => {
            e.preventDefault();

            try {
                Processing.show();

                // Remove logo from stored settings
                Store.SETTINGS.qr_logo = null;

                // TODO
                // Before updating settings, at this step remove logo file from R2
                // This is necessary for a clean and healthy system

                // Sync logo removal with API
                await this.syncWithAPI(Store.SETTINGS);

                // Lastly, remove the locally stored `logo` element
                await Store.remove('logo');

                // Remove actions and show the add button
                const actions = Selectors.SETTINGS_FORM.querySelector(this.constants.QR_LOGO_ACTIONS_CLASSNAME);
                actions.innerHTML = null;
                actions.style.display = 'none';

                Selectors.SETTINGS_FORM.querySelector(this.constants.QR_LOGO_ADD_BUTTON_CLASSNAME).style.display = 'block';
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
            }
        });

        // Append to `option` container
        // Before that, remove `add-logo` anchor
        Selectors.SETTINGS_FORM.querySelector(this.constants.QR_LOGO_ADD_BUTTON_CLASSNAME).style.display = 'none';

        // Remove existing content and add new values
        const actions = parent.querySelector(this.constants.QR_LOGO_ACTIONS_CLASSNAME);
        actions.innerHTML = null;
        actions.appendChild(content);
        actions.style.display = 'flex';
    },
    updateDOM: async function () {
        try {
            Processing.show(document.body);

            // Fetch settings from API before updating DOM
            // Before that, check if data exists in `Store.SETTINGS` object
            if (Object.entries(Store.SETTINGS).length === 0) {
                await this.fetchFromAPI();
            }

            for (const [key, value] of Object.entries(Store.SETTINGS)) {
                const element = Selectors.SETTINGS_FORM.querySelector(`#${key}`);
                if (element) {
                    // Exception of `qr_logo`
                    if (key === 'qr_logo') {
                        await this.showQRLogo(element, value);
                        continue;
                    }

                    element.value = value;
                    element.setAttribute('data-previous', value);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
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
            qr_text: response.message.setting_qr_text,
            qr_logo: response.message.setting_qr_logo
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
        await User.setSettings(settings);

        // Update default domains
        Limits.updateDefaultDomains();

        // Add success notification
        Notification.success(i18n.SETTINGS_UPDATED)
    },
    uploadLogoFile: async function(files) {
        try {
            Processing.show();

            if (!files.length) {
                throw new Error(i18n.NO_FILE_SELECTED);
            }

            // Get first entry from FileList
            const file = files.item(0);

            // Send request to server
            const response = await this.postRequest(file);

            // After uploading, save settings and save image to browser
            Store.SETTINGS.qr_logo = response.message.slug;

            // Update settings
            await this.syncWithAPI(Store.SETTINGS);

            // Convert logo to base64 and sync locally
            // Lastly, show uploaded file in settings screen
            const encodedFile = await this.fileToBase64(file);
            await Store.set({ logo: encodedFile });

            // Post logic, remove add button and show logo actions
            await this.showQRLogo(Selectors.QR_LOGO_FILE_INPUT, response.message.slug);

            // Success notification
            Notification.success(i18n.QR_LOGO_UPLOADED);
        } catch(error) {
            console.error(error);
            Notification.error(error.message ?? i18n.DEFAULT_ERROR);
        } finally {
            Processing.hide();

            // Reset file input
            // This is to make sure that user gets the error message if he tries to upload the same file again
            Selectors.QR_LOGO_FILE_INPUT.value = null;
        }
    },
    postRequest: function(file) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('file', file);
            formData.append('user_id', Store.USER.ID);
            formData.append('token', Store.USER.token);
            formData.append('context', 'qr_logo');

            // Opening connection to the server API endpoint and sending the form data
            xhr.open('POST', `${apiBase}/file`, true);
            xhr.timeout = 60000;
            xhr.addEventListener('readystatechange', async () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(JSON.parse(xhr.response));
                    }
                }
            });
            xhr.addEventListener('timeout', () => {
                reject(i18n.DEFAULT_ERROR);
            });
            xhr.addEventListener('error', (event) => {
                reject(i18n.API_ERROR);
            });

            xhr.send(formData);
        });
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
                    pages_per_page: data.get('pages_per_page') ?? this.DEFAULT.pages_per_page,
                    default_page_domain: data.get('default_page_domain') ?? this.DEFAULT.default_page_domain,
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
    colorChangeEvent: function () {
        if (!Selectors.SETTINGS_FORM) return;

        const colors = Selectors.SETTINGS_FORM.querySelectorAll('input[type=color]');
        if (!colors.length) return;

        colors.forEach(color => color.addEventListener('change', e => {
            try {
                const newValue = e.target.value;
                const oldValue = e.target.getAttribute('data-previous');

                if (newValue === oldValue) return;

                // Revert change if user is on a free plan
                if (!Store.USER.is_premium) {
                    Limits.upgradeModal('QR Code Colors');

                    // Switch back to previous value
                    e.target.value = oldValue;
                }
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    domainChangeEvent: function () {
        if (!Selectors.SETTINGS_FORM) return;

        const selectors = Selectors.SETTINGS_FORM.querySelectorAll(this.constants.DOMAIN_FIELDS_CLASSNAME);
        if (!selectors.length) return;

        selectors.forEach(select => select.addEventListener('change', e => {
            try {
                const newValue = e.target.value;
                const oldValue = e.target.getAttribute('data-previous');

                if (newValue === oldValue) return;

                // Revert change if user is on a free plan
                if (!Store.USER.is_premium) {
                    if (newValue !== this.DEFAULT.default_domain) {
                        planDomains.basic.includes(newValue) ? Limits.upgradeModal(newValue, i18n.BASIC_DOMAIN_NOT_AVAILABLE) : Limits.upgradeModal(newValue, i18n.PRO_DOMAIN_NOT_AVAILABLE);

                        // Switch back to previous value
                        e.target.value = oldValue;
                    }
                } else {
                    if (planDomains.pro.includes(newValue) && Store.USER.subscription.plan === 'basic') {
                        Limits.upgradeModal(newValue, i18n.PRO_DOMAIN_NOT_AVAILABLE);

                        // Switch back to previous value
                        e.target.value = oldValue;
                    }
                }
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        }));
    },
    analyticsDurationChangeEvent: function () {
        if (!Selectors.SETTINGS_FORM) return;

        const select = Selectors.SETTINGS_FORM.querySelector(this.constants.ANALYTICS_DURATION_CLASSNAME);
        if (!select) return;

        select.addEventListener('change', e => {
            try {
                const newValue = e.target.value;
                const oldValue = e.target.getAttribute('data-previous');

                if (newValue === oldValue) return;

                // Revert change if user is on a free plan
                if (!Store.USER.is_premium) {
                    if (!planAnalyticsDuration.registered.includes(newValue)) {
                        planAnalyticsDuration.basic.includes(newValue) ? Limits.upgradeModal(analyticsDurationNiceName[newValue], i18n.BASIC_ANALYTICS_NOT_AVAILABLE) : Limits.upgradeModal(analyticsDurationNiceName[newValue], i18n.PRO_ANALYTICS_NOT_AVAILABLE);

                        // Switch back to previous value
                        e.target.value = oldValue;
                    }
                } else {
                    if (planAnalyticsDuration.pro.includes(newValue) && Store.USER.subscription.plan === 'basic') {
                        Limits.upgradeModal(analyticsDurationNiceName[newValue], i18n.PRO_ANALYTICS_NOT_AVAILABLE);

                        // Switch back to previous value
                        e.target.value = oldValue;
                    }
                }
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    openFileDialogEvent: function() {
        if (!Selectors.SETTINGS_FORM || !Selectors.QR_LOGO_FILE_INPUT) return;

        const button = Selectors.SETTINGS_FORM.querySelector(this.constants.QR_LOGO_ADD_BUTTON_CLASSNAME);
        if (!button) return;

        button.addEventListener('click', e => {
            e.preventDefault();

            try {
                // Trigger opening of file dialog
                Selectors.QR_LOGO_FILE_INPUT.click();
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });

        Selectors.QR_LOGO_FILE_INPUT.addEventListener('change', async e => {
            await this.uploadLogoFile(e.target.files);
        });
    },
    events: function () {
        this.formSubmitEvent();
        this.colorChangeEvent();
        this.domainChangeEvent();
        this.analyticsDurationChangeEvent();
        this.openFileDialogEvent();
    },
    init: async function () {
        await this.updateDOM();
    }
};
