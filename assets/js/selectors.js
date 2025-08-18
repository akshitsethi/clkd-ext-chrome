// selectors.js
export const Selectors = {
    // Header (primary & secondary)
    HEADER: document.querySelector('.header'),
    SECONDARY_HEADER: document.querySelector('.secondary-header'),
    LOGOUT_LINK: document.getElementById('logout'),
    NAVIGATION: document.querySelector('.navigation'),
    PAGE_SELECTOR: document.querySelector('.page-selector'),

    // Processing
    PROCESSING_TEMPLATE: document.getElementById('processing'),

    // Screen
    SCREEN_SWITCH_LINKS: document.querySelectorAll('a[data-screen]'),
    SCREENS: document.querySelectorAll('.screen'),

    // Unlogged
    GOOGLE_OAUTH_BUTTON: document.querySelector('.social-buttons .google-oauth'),

    // Settings
    SETTINGS_FORM: document.querySelector('.settings-form'),

    // Help
    HELP_FORM: document.querySelector('.help-form'),
    HELP_SECTION: document.querySelector('.help-section'),
    HELP_SECTION_SUCCESS: document.querySelector('.help-success'),
};
