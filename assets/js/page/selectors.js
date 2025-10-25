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
    INLINE_TEMPLATE: document.querySelector('#content #content-inline-template'),
    NO_CONTENT_MESSAGE: document.querySelector('#content .no-content-data'),
    ITEMS_CONTAINER: document.querySelector('#content .content-items'),

    // Profile (thumbnail, title, and bio)
    EDIT_PROFILE_IMAGE: document.querySelector('#design .edit-profile-image'),
    EDIT_BIO: document.querySelector('#design .edit-bio'),
    EDIT_IMAGE_FIELD: document.querySelector('#design input[name="profile-image-file"]'),
    PROFILE_THUMBNAIL_TEMPLATE: document.querySelector('#design #thumbnail-modal-template'),
    PROFILE_DETAILS_TEMPLATE: document.querySelector('#design #profile-modal-template'),
    PROFILE_THUMBNAIL_CONTAINER: document.querySelector('#design .profile-thumbnail .thumbnail img'),

    // Preview
    PREVIEW_FRAME: document.querySelector('.preview iframe')
};
