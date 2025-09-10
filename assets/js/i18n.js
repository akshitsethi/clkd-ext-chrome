// i18n.js
export const i18n = {
    // Common
    DEFAULT_ERROR: 'Error occurred during processing.',
    LOGGED_IN: 'Logged-in successfully.',
    NO_SCREEN_ERROR: 'Unable to find the specified screen.',
    SELECTOR_NOT_FOUND: 'Specified selector does not exist.',
    API_INVALID_RESPONSE: 'Invalid API response.',
    MALFORMED_REQUEST: 'Invalid request. Please check the source and try again.',
    MISSING_DETAILS_ERROR: 'Required data is missing.',
    NO_CREDENTIALS_ERROR: 'User credentials not found. Please authenticate to continue.',

    // Links
    URL_DOMAIN_ERROR: 'Missing details. Please provide a valid URL and domain.',
    URL_VALIDATION_ERROR: 'Please provide a valid URL and ensure it starts with either http or https.',
    COPY_ERROR: 'Error occurred while trying to copy link.',
    EMPTY_SLUG_ERROR: 'Please provide a unique slug or switch to "Auto" mode.',
    SLUG_VALIDATION_ERROR: 'Slug can only contain alphanumeric characters along with hyphen and underscore.',
    SLUG_HYPHEN_ERROR: 'Slug cannot start or end with a hyphen.',
    LINK_NOT_FOUND: 'Unable to locate the specified link in storage.',
    LINK_CREATED: 'New short link has been created.',

    // Analytics
    NO_DATA_ERROR: 'Unable to find analytics data.',

    // Settings
    SETTINGS_UPDATED: 'Settings have been saved successfully.',

    // Subscription
    SUBSCRIPTION_DATA_NOT_AVAILABLE: 'Unable to fetch subscription details. Please try again later.',

    // Limits
    BASIC_DOMAIN_NOT_AVAILABLE: 'This domain is part of our <strong>Basic</strong> plan or above. Please consider upgrading if you wish to use it.',
    PRO_DOMAIN_NOT_AVAILABLE: 'This domain is part of our <strong>Pro</strong> plan. Please consider upgrading if you wish to use it.',
    BASIC_ANALYTICS_NOT_AVAILABLE: 'This duration is part of our <strong>Basic</strong> plan or above. Please consider upgrading if you wish to use it.',
    PRO_ANALYTICS_NOT_AVAILABLE: 'This duration is part of our <strong>Pro</strong> plan. Please consider upgrading if you wish to use it.',

    // QR Code
    QRCODE_ERROR: 'Error occurred while generating the QR Code.',
    DOWNLOAD_ERROR: 'Unable to initiate download.'
};
