// i18n.js
export const i18n = {
    // Common
    DEFAULT_ERROR: 'Error occurred during processing.',
    API_ERROR: 'Error occured while connecting to the API.',
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
    CREATED: {
        link: 'New short link has been created.',
        page: 'New page has been created.',
    },
    ENTRY_NOT_FOUND: 'Unable to locate the specified entry in storage.',

    // Pages
    SLUG_DOMAIN_ERROR: 'Missing details. Please provide a valid slug and domain.',
    PAGE_URL_ERROR: 'Invalid URL. Please verify the source and try again.',
    DATA_ERROR: 'Unable to fetch or validate data. Please try again by refreshing the page.',
    EMBED_PROCESSING_ERROR: 'An error occurred while trying to process the embed data. Please try entering the link again.',
    EMBED_FETCH_SUCCESS: 'Embed has been fetched successfully.',
    PROFILE_UPDATED: 'Profile details have been updated.',
    SOCIAL_ICON_EXISTS: 'Social channel has already been added.',
	SOCIAL_ICONS_UPDATED: 'Social channels have been updated.',
    GRADIENT_PRESET_APPLIED: 'Gradient preset has been applied.',
    PAGE_PUBLISHED: 'Data saved successfully and updated page has been published.',

    // Analytics
    NO_DATA_ERROR: 'Unable to find analytics data.',

    // Settings
    SETTINGS_UPDATED: 'Settings have been saved successfully.',
    QR_LOGO_UPLOADED: 'QR logo has been uploaded successfully.',

    // Upload
    NO_FILE_SELECTED: 'No file has been selected. Please select one to begin processing.',
    MEDIA_UPLOADED: 'Media file has been uploaded successfully.',
    MEDIA_REMOVED: 'Media file has been removed.',
    CROP_ERROR: 'Unable to process the image for uploading.',
    FILETYPE_NOT_SUPPORTED: 'File type is not supported.',
    FILE_SIZE_EXCEEDED: 'File size exceeds limit. Please try uploading a smaller version.',

    // Subscription
    SUBSCRIPTION_DATA_NOT_AVAILABLE: 'Unable to fetch subscription details. Please try again later.',

    // Limits
    BASIC_DOMAIN_NOT_AVAILABLE: 'This domain is part of our <strong>Basic</strong> plan or above. Please consider upgrading if you wish to use it.',
    PRO_DOMAIN_NOT_AVAILABLE: 'This domain is part of our <strong>Pro</strong> plan. Please consider upgrading if you wish to use it.',
    BASIC_ANALYTICS_NOT_AVAILABLE: 'This duration is part of our <strong>Basic</strong> plan or above. Please consider upgrading if you wish to use it.',
    PRO_ANALYTICS_NOT_AVAILABLE: 'This duration is part of our <strong>Pro</strong> plan. Please consider upgrading if you wish to use it.',
    BASIC_FEATURE_NOT_AVAILABLE: 'This feature is part of our <strong>Basic</strong> plan. Please consider upgrading if you wish to use it.',
    PRO_FEATURE_NOT_AVAILABLE: 'This feature is part of our <strong>Pro</strong> plan. Please consider upgrading if you wish to use it.',

    // QR Code
    QRCODE_ERROR: 'Error occurred while generating the QR Code.',
    DOWNLOAD_ERROR: 'Unable to initiate download.'
};
