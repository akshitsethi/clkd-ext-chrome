// selectors.js
export const Selectors = {
    // Header (primary & secondary)
    HEADER: document.querySelector('.header'),
    SECONDARY_HEADER: document.querySelector('.secondary-header'),
    PRIMARY_SECTION: document.querySelectorAll('.primary-section'),
    DYNAMIC_SECTION: document.querySelectorAll('.dynamic-section'),
    LOGOUT_LINK: document.getElementById('logout'),
    NAVIGATION: document.querySelector('.navigation'),
    PAGE_SELECTOR: document.querySelector('.page-selector'),
    STATE_SWITCHERS: document.querySelectorAll('.state-switcher'),

    // Screen
    SCREEN_SWITCH_LINKS: document.querySelectorAll('a[data-screen]'),
    SCREENS: document.querySelectorAll('.screen'),

    // Unlogged
    GOOGLE_OAUTH_BUTTON: document.querySelector('#unlogged .social-buttons .google-oauth'),

    // Dashboard
    ENGAGEMENTS_SECTION: document.querySelector('#dashboard .engagements-data'),
    INSIGHTS_SECTION: document.querySelector('#dashboard .insights-data'),
    STATS_SWITCHER_BUTTON: document.querySelector('.stats-switcher a'),

    // Links
    LINK_FORM: document.querySelector('#links .link-form'),
    LINK_FROM_TAB_BUTTON: document.querySelector('#links #create-from-tab'),
    REVEAL_URL_LINK: document.querySelector('#links .reveal-url'),
    LINK_TEMPLATE: {
        active: document.querySelector('#links #link-entry-template'),
        archive: document.querySelector('#links #link-archive-template'),
        edit: document.querySelector('#links #link-edit-template')
    },
    LINKS_SECTION: {
        active: document.querySelector('#links .links-table'),
        archive: document.querySelector('#links .archive-table')
    },
    LINKS_NO_DATA_MESSAGE: {
        active: document.querySelector('#links .no-links-data'),
        archive: document.querySelector('#links .no-links-archive')
    },
    LINK_OUTPUT_SECTION: document.querySelector('#links .link-output'),
    LINK_DOMAIN_SELECTOR: document.querySelector('#links select[name=domain]'),
    LINK_MODE_SWITCHER: document.querySelector('#links .mode-switcher a'),

    // Analytics
    ANALYTICS_SECTION: document.querySelector('#analytics .analytics-data'),
    NO_ANALYTICS_SECTION: document.querySelector('#analytics .no-analytics-data'),

    // Single
    SINGLE_ANALYTICS_SECTION: document.querySelector('#single .analytics-data'),
    SINGLE_NO_ANALYTICS_SECTION: document.querySelector('#single .no-analytics-data'),
    SINGLE_LINK_DETAILS: document.querySelector('#single .link-details'),
    SINGLE_HEADER_TEMPLATE: document.querySelector('#single #single-header-template'),

    // Account
    ACCOUNT_USER_SECTION: document.querySelector('#account .account-user'),
    ACCOUNT_SUBSCRIPTION_SECTION: document.querySelector('#account .account-subscription'),
    ACCOUNT_NO_SUBSCRIPTION_TEMPLATE: document.querySelector('#account #account-subscription-template'),

    // Settings
    SETTINGS_FORM: document.querySelector('#settings .settings-form'),

    // Upgrade
    UPGRADE_BUTTONS: document.querySelectorAll('#upgrade .upgrade-now'),
    TENURE_SWITCHER: document.querySelector('#tenure'),
    TENURE_MONTHLY: document.querySelectorAll('#upgrade .plan-monthly'),
    TENURE_YEARLY: document.querySelectorAll('#upgrade .plan-yearly'),
    UPGRADE_SAVER_PILL: document.querySelector('.saver-pill'),

    // Subscription
    VERIFY_SUBSCRIPTION_BUTTON: document.querySelector('#subscription-verify .verify-subscription'),
    SUBSCRIPTION_DETAILS_SECTION: document.querySelector('#subscription-success .subscription-details'),

    // Help
    HELP_FORM: document.querySelector('#help .help-form'),
    HELP_SECTION: document.querySelector('#help .help-section'),
    HELP_SECTION_SUCCESS: document.querySelector('#help .help-success'),
    HELP_LINKS: document.querySelectorAll('#help .help-links a[data-action]'),

    // Processing
    PROCESSING_TEMPLATE: document.getElementById('processing'),

    // Modal
    MODAL: document.querySelector('.modal'),
    MODAL_CONTENT: document.querySelector('.modal-content'),
    MODAL_CLOSE: document.querySelector('.modal-close'),

    // Content sections (used in links & pages)
    CONTENT_SECTIONS: {
        links: document.querySelectorAll('#links [data-content]')
    }
};
