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
    LINK_ENTRY_TEMPLATE: document.querySelector('#links #link-entry-template'),
    LINK_EDIT_TEMPLATE: document.querySelector('#links #link-edit-template'),
    LINKS_SECTION: document.querySelector('#links .links-data'),
    LINKS_NO_DATA_MESSAGE: document.querySelector('#links .no-links-data'),
    LINK_OUTPUT_SECTION: document.querySelector('#links .link-output'),
    LINK_DOMAIN_SELECTOR: document.querySelector('#links select[name=domain]'),
    LINK_MODE_SWITCHER: document.querySelector('#links .mode-switcher a'),

    // Archives
    LINK_ARCHIVE_SECTION: document.querySelector('#links .archive-data'),
    LINKS_NO_ARCHIVE_MESSAGE: document.querySelector('#links .no-links-archive'),
    LINK_ARCHIVE_TEMPLATE: document.querySelector('#links #link-archive-template'),

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
