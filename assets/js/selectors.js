// selectors.js
export const Selectors = {
    HEADER: document.querySelector('.header'),
    SECONDARY_HEADER: document.querySelector('.secondary-header'),
    PROCESSING_TEMPLATE: document.getElementById('processing'),
    SCREEN_SWITCH_LINKS: document.querySelectorAll('a[data-screen]'),
    SCREENS: document.querySelectorAll('.screen'),
    GOOGLE_OAUTH_BUTTON: document.querySelector('.social-buttons .google-oauth'),
    LOGOUT_LINK: document.getElementById('logout'),
    NAVIGATION: document.querySelector('.navigation'),
    PAGE_SELECTOR: document.querySelector('.page-selector')
};
