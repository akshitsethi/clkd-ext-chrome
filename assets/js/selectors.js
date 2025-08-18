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
    GOOGLE_OAUTH_BUTTON: document.querySelector('.social-buttons .google-oauth'),

    // Settings
    SETTINGS_FORM: document.querySelector('.settings-form'),

    // Upgrade
    UPGRADE_BUTTONS: document.querySelectorAll('.upgrade-now'),
    TENURE_SWITCHER: document.querySelector('#tenure'),
    TENURE_MONTHLY: document.querySelectorAll('.plan-monthly'),
    TENURE_YEARLY: document.querySelectorAll('.plan-yearly'),
    UPGRADE_SAVER_PILL: document.querySelector('.saver-pill'),

    // Help
    HELP_FORM: document.querySelector('.help-form'),
    HELP_SECTION: document.querySelector('.help-section'),
    HELP_SECTION_SUCCESS: document.querySelector('.help-success'),
    HELP_LINKS: document.querySelectorAll('.help-links a'),

    // Processing
    PROCESSING_TEMPLATE: document.getElementById('processing'),
};
