// selectors.js
export const Selectors = {
    // Header
    TABS: document.querySelectorAll('.header-tabs a'),
    SECTIONS: document.querySelectorAll('.tab'),
    MOBILE_MENU_BUTTON: document.querySelector('.mobile-menu'),

    // Content
    ADD_LINK: document.querySelector('#content .add-link'),
    EMBED_BUTTON: document.querySelector('#content .embed-button'),
    EMBED_OPTIONS: document.querySelector('#content .embed-options'),
    ENTRY_TEMPLATE: document.querySelector('#content #content-entry-template'),
    ACTIONS_TEMPLATE: document.querySelector('#content #content-actions-template'),
    NO_CONTENT_MESSAGE: document.querySelector('#content .no-content-data'),
    ITEMS_CONTAINER: document.querySelector('#content .content-items')
};
