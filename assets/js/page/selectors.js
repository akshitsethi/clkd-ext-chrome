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

    // Design
    DESIGN_FORM_INPUTS: document.querySelectorAll('#design input[type="checkbox"], #design input[type="radio"], #design input[type="color"], #design input[type="range"]'),
    DESIGN_INLINE_ACTIONS: document.querySelectorAll('#design .inline-section .actions a[data-action]'),
    DESIGN_PRESET_ITEMS: document.querySelectorAll('#design .presets .preset-item'),

    // Profile (thumbnail, title, and bio)
    EDIT_PROFILE_IMAGE: document.querySelector('#design .edit-profile-image'),
    EDIT_BIO: document.querySelector('#design .edit-bio'),
    EDIT_IMAGE_FIELD: document.querySelector('#design input[name="profile-image-file"]'),
    PROFILE_THUMBNAIL_TEMPLATE: document.querySelector('#design #thumbnail-modal-template'),
    PROFILE_DETAILS_TEMPLATE: document.querySelector('#design #profile-modal-template'),
    PROFILE_THUMBNAIL_CONTAINER: document.querySelector('#design .profile-thumbnail .thumbnail img'),

    // Social
    MANAGE_ICONS: document.querySelector('#design .manage-icons'),
    MANAGE_ICONS_TEMPLATE: document.querySelector('#design #social-modal-template'),
    SOCIAL_ENTRY_TEMPLATE: document.querySelector('#design #social-entry-template'),
    SOCIAL_ICONS_CONTAINER: document.querySelector('#design .social .selected-icons'),
    NO_SOCIAL_ICONS_SECTION: document.querySelector('#design .social .no-icons-data'),

    // Preview
    PREVIEW_FRAME: document.querySelector('.preview iframe')
};
