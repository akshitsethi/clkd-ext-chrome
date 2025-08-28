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
    REVEAL_URL_LINK: document.querySelector('#links .reveal-url'),

    // Analytics
    ANALYTICS_SECTION: document.querySelector('#analytics .analytics-data'),
    NO_ANALYTICS_SECTION: document.querySelector('#analytics .no-analytics-data'),

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

    // Tooltips
    TOOLTIPS: document.querySelectorAll('[tooltip]'),

    // Processing
    PROCESSING_TEMPLATE: document.getElementById('processing'),
};
