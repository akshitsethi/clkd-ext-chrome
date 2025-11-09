// constants.js
// API Endpoints
export const apiBase = 'http://localhost:8788/api';
export const storageBase = 'http://localhost:8788/api/file?f=';

// Google API key (for Maps)
export const googleApiKey = 'test_key';

// Default domain
export const defaultDomain = 'clkd.in';

// List of available domains
export const domains = ['clkd.in', 'clk.gg', 'pgx.es', 'cd.lk', 'xx.lk'];

// Allowed file formats
export const allowedFormats = {
    image: [
        'image/gif',
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif'
    ],
    video: [
        'video/mp4',
        'video/webm'
    ],
    logo: [
        'image/jpg',
        'image/jpeg',
        'image/png'
    ]
};

// Max upload size
export const maxUploadSize = {
    image: 4194304, // 4mb
    video: 8388608, // 8mb
    logo: 256000 // 256kb
};

// Data refresh window for API data
const date = Date.now();
export const refreshDuration = {
    analytics: {
        account: date + 60 * 60 * 1000, // 1 hour
        slug: date + 60 * 60 * 1000
    },
    entries: date + 60 * 60 * 1000 * 24 * 7 // 7 days
};

// Blank slate for analytics computations
export const analyticsBlankSlate = {
    clicks: {
        labels: [],
        all: [],
        unique: []
    },
    scans: {
        labels: [],
        all: [],
        unique: []
    },
    pages: {
        labels: [],
        all: [],
        unique: []
    },
    browser: {},
    os: {},
    screen: {},
    lang: {},
    country: {},
    city: {}
};

// Blank slate for dashboard computations
export const dashboardBlankSlate = {
    totals: {
        today: {
            clicks: 0,
            scans: 0,
            pages: 0
        },
        week: {
            clicks: 0,
            scans: 0,
            pages: 0
        }
    },
    insights: {
        today: {
            country: {},
            city: {},
            browser: {},
            screen: {},
            lang: {},
            os: {}
        },
        week: {
            country: {},
            city: {},
            browser: {},
            screen: {},
            lang: {},
            os: {}
        }
    }
};

// Chart types
export const variableChartTypes = {
    browser: 'doughnut',
    os: 'pie',
    screen: 'doughnut',
    lang: 'pie'
};

// Chart colors
export const variableChartColors = {
    clicks: {
        all: ['rgb(255, 201, 39)'],
        unique: ['rgb(244, 109, 154)']
    },
    scans: {
        all: ['rgb(99, 193, 247)'],
        unique: ['rgb(46, 204, 113)']
    },
    pages: {
        all: ['rgb(231, 76, 60)'],
        unique: ['rgb(99, 193, 247)']
    },
    browser: [
        'rgb(255, 201, 39)',
        'rgb(46, 204, 113)',
        'rgb(244, 109, 154)',
        'rgb(99, 193, 247)',
        'rgb(231, 76, 60)',
        'rgb(207, 217, 223)'
    ],
    os: [
        'rgb(99, 193, 247)',
        'rgb(244, 109, 154)',
        'rgb(46, 204, 113)',
        'rgb(255, 201, 39)',
        'rgb(231, 76, 60)',
        'rgb(207, 217, 223)'
    ],
    screen: [
        'rgb(207, 217, 223)',
        'rgb(99, 193, 247)',
        'rgb(244, 109, 154)',
        'rgb(46, 204, 113)',
        'rgb(255, 201, 39)',
        'rgb(231, 76, 60)'
    ],
    lang: [
        'rgb(231, 76, 60)',
        'rgb(99, 193, 247)',
        'rgb(244, 109, 154)',
        'rgb(46, 204, 113)',
        'rgb(255, 201, 39)',
        'rgb(207, 217, 223)'
    ]
};

// DataTable language
export const dataTableLanguage = {
    country: {
        search: 'Filter Countries',
        entries: {
            _: 'countries',
            1: 'country'
        },
        zeroRecords: 'No matching countries found',
        emptyTable: 'Country data is not available'
    },
    city: {
        search: 'Filter Cities',
        entries: {
            _: 'cities',
            1: 'city'
        },
        zeroRecords: 'No matching cities found',
        emptyTable: 'City data is not available'
    }
};

// URL validator options
export const urlValidationOptions = {
    protocols: ['http','https'],
    require_protocol: true
}

// User plan domains
export const planDomains = {
    registered: ['clkd.in'],
    basic: ['clk.gg', 'pgx.es'],
    pro: ['cd.lk', 'xx.lk']
};

// Analytics duration as per user plan
export const planAnalyticsDuration = {
    registered: ['day', '3days'],
    basic: ['week', '2weeks'],
    pro: ['month', '2months']
};

// Default page options
export const defaultPageOptions = {
    design: {
        radioThumbnailDesign: 'bubble',
        statusWhiteLabel: 'off',
        colorProfileTitle: '#101010',
        colorProfileText: '#606060',
        radioProfileFont: 'Inter',
        radioBackground: 'gradient',
        colorBackground: '#fafafa',
        colorBackgroundGradientOne: '#a8edea',
        colorBackgroundGradientTwo: '#fed6e3',
        rangeBackgroundGradientAngle: '0',
        radioBackgroundPattern: 'leaves',
        imageBackground: {},
        statusHeroBackground: 'off',
        colorHeroBackground: '#101010',
        videoBackground: {},
        rangeBackdropBlur: '4',
        rangeBackdropOpacity: '0.25',
        rangeBackdropNoise: '0',
        colorBackdrop: '#101010',
        radioSocialPosition: 'top',
        colorSocialIcon: '#101010',
        radioButtonFill: 'solid',
        colorButtonBackground: '#ffffff',
        colorButtonText: '#101010',
        rangeButtonCorner: '32',
        rangeButtonSpacing: '8',
        radioButtonFont: 'Inter',
        radioButtonBorder: 'solid',
        rangeButtonBorderThickness: '1',
        colorButtonBorder: '#101010',
        radioButtonShadow: 'subtle',
        colorButtonShadow: '#101010',
        radioButtonShadowPosition: 'down-right',
        rangeButtonShadowThickness: '6',
        rangeButtonShadowOpacity: '0.5',
        radioButtonEffect: 'rotate'
    }
};

// Social Icons
export const socialIcons = {
    instagram: {
        name: 'Instagram',
        placeholder: 'URL',
        help: 'https://www.instagram.com/username'
    },
    email: {
        name: 'Email',
        placeholder: 'Address',
        help: 'your@emailaddress.com'
    },
    facebook: {
        name: 'Facebook',
        placeholder: 'URL',
        help: 'https://facebook.com/facebookpageurl'
    },
    youtube: {
        name: 'YouTube',
        placeholder: 'URL',
        help: 'https://youtube.com/channel/youtubechannelurl'
    },
    x: {
        name: 'X (formerly Twitter)',
        placeholder: 'URL',
        help: 'https://twitter.com/yourhandle'
    },
    tiktok: {
        name: 'TikTok',
        placeholder: 'Username',
        help: '@tiktokusername'
    },
    whatsapp: {
        name: 'WhatsApp',
        placeholder: 'Number',
        help: '001234567890 (Phone number with country code)'
    },
    'whatsapp-channel': {
        name: 'WhatsApp Channel',
        placeholder: 'URL',
        help: 'https://www.whatsapp.com/channel/yourchannel'
    },
    threads: {
        name: 'Threads',
        placeholder: 'Username',
        help: '@threadsusername'
    },
    linkedin: {
        name: 'Linkedin',
        placeholder: 'URL',
        help: 'https://linkedin.com/in/username'
    },
    snapchat: {
        name: 'Snapchat',
        placeholder: 'URL',
        help: 'https://www.snapchat.com/add/yourusername'
    },
    amazon: {
        name: 'Amazon',
        placeholder: 'URL',
        help: 'https://amazon.com/shop/yourshopname'
    },
    'google-play': {
        name: 'Google Play Store',
        placeholder: 'URL',
        help: 'https://play.google.com/store/apps/details?url=com.yourapp.app'
    },
    'app-store': {
        name: 'Apple App Store',
        placeholder: 'URL',
        help: 'https://apps.apple.com/us/yourapp/url1234567890'
    },
    'apple-music': {
        name: 'Apple Music',
        placeholder: 'URL',
        help: 'https://music.apple.com/us/album/youralbum'
    },
    'apple-podcast': {
        name: 'Apple Podcast',
        placeholder: 'URL',
        help: 'https://podcasts.apple.com/us/podcast/yourpodcast/123456789'
    },
    line: {
        name: 'LINE',
        placeholder: 'URL',
        help: 'https://line.me/xx/x/xxxxxxx'
    },
    bandcamp: {
        name: 'Bandcamp',
        placeholder: 'URL',
        help: 'https://you.bandcamp.com/'
    },
    bereal: {
        name: 'BeReal',
        placeholder: 'URL',
        help: 'https://bere.al/username'
    },
    bluesky: {
        name: 'Bluesky',
        placeholder: 'URL',
        help: 'https://bsky.app/profile/username'
    },
    cameo: {
        name: 'Cameo',
        placeholder: 'URL',
        help: 'https://cameo.com/username'
    },
    clubhouse: {
        name: 'Clubhouse',
        placeholder: 'URL',
        help: 'https://clubhouse.com/@profile'
    },
    discord: {
        name: 'Discord',
        placeholder: 'URL',
        help: 'https://discord.com/invite/yourchannel'
    },
    etsy: {
        name: 'Etsy',
        placeholder: 'URL',
        help: 'https://www.etsy.com/shop/yourshop'
    },
    github: {
        name: 'Github',
        placeholder: 'URL',
        help: 'https://www.github.com/username'
    },
    kick: {
        name: 'Kick',
        placeholder: 'URL',
        help: 'https://kick.com/username'
    },
    kickstarter: {
        name: 'Kickstarter',
        placeholder: 'URL',
        help: 'https://www.kickstarter.com/profile/username'
    },
    mastodon: {
        name: 'Mastodon',
        placeholder: 'URL',
        help: 'https://mastodon.social/@username'
    },
    patreon: {
        name: 'Patreon',
        placeholder: 'URL',
        help: 'https://patreon.com/username'
    },
    payment: {
        name: 'Payment',
        placeholder: 'URL',
        help: 'https://venmo.com/yourusername'
    },
    phone: {
        name: 'Phone',
        placeholder: 'Number',
        help: '001234567890 (Phone number with country code)'
    },
    pinterest: {
        name: 'Pinterest',
        placeholder: 'URL',
        help: 'https://pinterest.com/username'
    },
    poshmark: {
        name: 'Poshmark',
        placeholder: 'URL',
        help: 'https://poshmark.com/closet/yourcloset'
    },
    signal: {
        name: 'Signal',
        placeholder: 'URL',
        help: 'https://signal.me/#eu/xxxxxxxxxx'
    },
    soundcloud: {
        name: 'Soundcloud',
        placeholder: 'URL',
        help: 'https://soundcloud.com/username'
    },
    spotify: {
        name: 'Spotify',
        placeholder: 'URL',
        help: 'https://open.spotify.com/artist/artistname'
    },
    substack: {
        name: 'Substack',
        placeholder: 'URL',
        help: 'https://you.substack.com'
    },
    telegram: {
        name: 'Telegram',
        placeholder: 'URL',
        help: 'https://t.me/username'
    },
    twitch: {
        name: 'Twitch',
        placeholder: 'URL',
        help: 'https://twitch.tv/username'
    },
    website: {
        name: 'Website',
        placeholder: 'URL',
        help: 'https://www.yourwebsite.com'
    },
    rednote: {
        name: 'Rednote',
        placeholder: 'URL',
        help: 'https://www.xiaohongshu.com/user/profile/username'
    },
    bandsintown: {
        name: 'Bandsintown',
        placeholder: 'URL',
        help: 'https://www.bandsintown.com/a/artistname'
    }
};

// Google fonts
export const googleFonts = {
    'Alfa+Slab+One': {
        fallback: 'Georgia,Courier,serif',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Anton': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Belanosima': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'BioRhyme': {
        fallback: 'Georgia,Courier,serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Chango': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Domine': {
        fallback: 'Georgia,Courier,serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'IBM+Plex+Sans': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Kavivanar': {
        fallback: 'cursive,sans-serif',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Manrope': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Monofett': {
        fallback: '"Courier New",Consolas,Menlo,Monaco,monospace',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Old+Standard+TT': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Oxanium': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Playfair+Display': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Poppins': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Roboto': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Roboto+Slab': {
        fallback: 'Georgia,Courier,serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Salsa': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Space+Mono': {
        fallback: '"Courier New",Consolas,Menlo,Monaco,monospace',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Murecho': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Viaoda+Libre': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 400
        }
    },
    'Albert+Sans': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Bricolage+Grotesque': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'DM+Sans': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Epilogue': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Inter': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Lato': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'M+PLUS+Rounded+1c': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Red+Hat+Display': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Rubik': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Space+Grotesk': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Syne': {
        fallback: 'Arial,Calibri,"Segoe UI",Helvetica,sans-serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Bitter': {
        fallback: 'Georgia,Courier,serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Caudex': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Corben': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Hahmlet': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'IBM+Plex+Serif': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Lora': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Merriweather': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Noto+Serif': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'PT+Serif': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 400,
            title: 700
        }
    },
    'Roboto+Serif': {
        fallback: 'Garamond,"Hoefler Text","Times New Roman",serif',
        weight: {
            text: 300,
            title: 600
        }
    },
    'IBM+Plex+Mono': {
        fallback: 'Consolas,"SF Mono","DejaVu Sans Mono","Courier New",monospace',
        weight: {
            text: 300,
            title: 600
        }
    },
    'Shantell+Sans': {
        fallback: 'cursive,sans-serif',
        weight: {
            text: 300,
            title: 600
        }
    }
};

// Embed providers
export const embedProviders = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    twitter: 'X (formerly Twitter)',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    soundcloud: 'SoundCloud',
    threads: 'Threads',
    vimeo: 'Vimeo',
    googlemaps: 'Google Maps',
    spotify: 'Spotify'
};

// Social Icon positions
export const socialIconPositions = [
    'top',
    'bottom'
];

// Shadow directions
export const shadowDirections = [
    'up',
    'up-left',
    'up-right',
    'left',
    'right',
    'down',
    'down-left',
    'down-right'
];

// Language codes
export const language = {
    "af": "Afrikaans",
    "af-ZA": "Afrikaans (South Africa)",
    "ar": "Arabic",
    "ar-AE": "Arabic (U.A.E.)",
    "ar-BH": "Arabic (Bahrain)",
    "ar-DZ": "Arabic (Algeria)",
    "ar-EG": "Arabic (Egypt)",
    "ar-IQ": "Arabic (Iraq)",
    "ar-JO": "Arabic (Jordan)",
    "ar-KW": "Arabic (Kuwait)",
    "ar-LB": "Arabic (Lebanon)",
    "ar-LY": "Arabic (Libya)",
    "ar-MA": "Arabic (Morocco)",
    "ar-OM": "Arabic (Oman)",
    "ar-QA": "Arabic (Qatar)",
    "ar-SA": "Arabic (Saudi Arabia)",
    "ar-SY": "Arabic (Syria)",
    "ar-TN": "Arabic (Tunisia)",
    "ar-YE": "Arabic (Yemen)",
    "az": "Azeri (Latin)",
    "az-AZ": "Azeri (Latin) (Azerbaijan)",
    "az-AZ": "Azeri (Cyrillic) (Azerbaijan)",
    "be": "Belarusian",
    "be-BY": "Belarusian (Belarus)",
    "bg": "Bulgarian",
    "bg-BG": "Bulgarian (Bulgaria)",
    "bs-BA": "Bosnian (Bosnia and Herzegovina)",
    "ca": "Catalan",
    "ca-ES": "Catalan (Spain)",
    "cs": "Czech",
    "cs-CZ": "Czech (Czech Republic)",
    "cy": "Welsh",
    "cy-GB": "Welsh (United Kingdom)",
    "da": "Danish",
    "da-DK": "Danish (Denmark)",
    "de": "German",
    "de-AT": "German (Austria)",
    "de-CH": "German (Switzerland)",
    "de-DE": "German (Germany)",
    "de-LI": "German (Liechtenstein)",
    "de-LU": "German (Luxembourg)",
    "dv": "Divehi",
    "dv-MV": "Divehi (Maldives)",
    "el": "Greek",
    "el-GR": "Greek (Greece)",
    "en": "English",
    "en-AU": "English (Australia)",
    "en-BZ": "English (Belize)",
    "en-CA": "English (Canada)",
    "en-CB": "English (Caribbean)",
    "en-GB": "English (United Kingdom)",
    "en-IE": "English (Ireland)",
    "en-JM": "English (Jamaica)",
    "en-NZ": "English (New Zealand)",
    "en-PH": "English (Republic of the Philippines)",
    "en-TT": "English (Trinidad and Tobago)",
    "en-US": "English (United States)",
    "en-ZA": "English (South Africa)",
    "en-ZW": "English (Zimbabwe)",
    "eo": "Esperanto",
    "es": "Spanish",
    "es-AR": "Spanish (Argentina)",
    "es-BO": "Spanish (Bolivia)",
    "es-CL": "Spanish (Chile)",
    "es-CO": "Spanish (Colombia)",
    "es-CR": "Spanish (Costa Rica)",
    "es-DO": "Spanish (Dominican Republic)",
    "es-EC": "Spanish (Ecuador)",
    "es-ES": "Spanish (Castilian)",
    "es-ES": "Spanish (Spain)",
    "es-GT": "Spanish (Guatemala)",
    "es-HN": "Spanish (Honduras)",
    "es-MX": "Spanish (Mexico)",
    "es-NI": "Spanish (Nicaragua)",
    "es-PA": "Spanish (Panama)",
    "es-PE": "Spanish (Peru)",
    "es-PR": "Spanish (Puerto Rico)",
    "es-PY": "Spanish (Paraguay)",
    "es-SV": "Spanish (El Salvador)",
    "es-UY": "Spanish (Uruguay)",
    "es-VE": "Spanish (Venezuela)",
    "et": "Estonian",
    "et-EE": "Estonian (Estonia)",
    "eu": "Basque",
    "eu-ES": "Basque (Spain)",
    "fa": "Farsi",
    "fa-IR": "Farsi (Iran)",
    "fi": "Finnish",
    "fi-FI": "Finnish (Finland)",
    "fo": "Faroese",
    "fo-FO": "Faroese (Faroe Islands)",
    "fr": "French",
    "fr-BE": "French (Belgium)",
    "fr-CA": "French (Canada)",
    "fr-CH": "French (Switzerland)",
    "fr-FR": "French (France)",
    "fr-LU": "French (Luxembourg)",
    "fr-MC": "French (Principality of Monaco)",
    "gl": "Galician",
    "gl-ES": "Galician (Spain)",
    "gu": "Gujarati",
    "gu-IN": "Gujarati (India)",
    "he": "Hebrew",
    "he-IL": "Hebrew (Israel)",
    "hi": "Hindi",
    "hi-IN": "Hindi (India)",
    "hr": "Croatian",
    "hr-BA": "Croatian (Bosnia and Herzegovina)",
    "hr-HR": "Croatian (Croatia)",
    "hu": "Hungarian",
    "hu-HU": "Hungarian (Hungary)",
    "hy": "Armenian",
    "hy-AM": "Armenian (Armenia)",
    "id": "Indonesian",
    "id-ID": "Indonesian (Indonesia)",
    "is": "Icelandic",
    "is-IS": "Icelandic (Iceland)",
    "it": "Italian",
    "it-CH": "Italian (Switzerland)",
    "it-IT": "Italian (Italy)",
    "ja": "Japanese",
    "ja-JP": "Japanese (Japan)",
    "ka": "Georgian",
    "ka-GE": "Georgian (Georgia)",
    "kk": "Kazakh",
    "kk-KZ": "Kazakh (Kazakhstan)",
    "kn": "Kannada",
    "kn-IN": "Kannada (India)",
    "ko": "Korean",
    "ko-KR": "Korean (Korea)",
    "kok": "Konkani",
    "kok-IN": "Konkani (India)",
    "ky": "Kyrgyz",
    "ky-KG": "Kyrgyz (Kyrgyzstan)",
    "lt": "Lithuanian",
    "lt-LT": "Lithuanian (Lithuania)",
    "lv": "Latvian",
    "lv-LV": "Latvian (Latvia)",
    "mi": "Maori",
    "mi-NZ": "Maori (New Zealand)",
    "mk": "FYRO Macedonian",
    "mk-MK": "FYRO Macedonian (Former Yugoslav Republic of Macedonia)",
    "mn": "Mongolian",
    "mn-MN": "Mongolian (Mongolia)",
    "mr": "Marathi",
    "mr-IN": "Marathi (India)",
    "ms": "Malay",
    "ms-BN": "Malay (Brunei Darussalam)",
    "ms-MY": "Malay (Malaysia)",
    "mt": "Maltese",
    "mt-MT": "Maltese (Malta)",
    "nb": "Norwegian (Bokm?l)",
    "nb-NO": "Norwegian (Bokm?l) (Norway)",
    "nl": "Dutch",
    "nl-BE": "Dutch (Belgium)",
    "nl-NL": "Dutch (Netherlands)",
    "nn-NO": "Norwegian (Nynorsk) (Norway)",
    "ns": "Northern Sotho",
    "ns-ZA": "Northern Sotho (South Africa)",
    "pa": "Punjabi",
    "pa-IN": "Punjabi (India)",
    "pl": "Polish",
    "pl-PL": "Polish (Poland)",
    "ps": "Pashto",
    "ps-AR": "Pashto (Afghanistan)",
    "pt": "Portuguese",
    "pt-BR": "Portuguese (Brazil)",
    "pt-PT": "Portuguese (Portugal)",
    "qu": "Quechua",
    "qu-BO": "Quechua (Bolivia)",
    "qu-EC": "Quechua (Ecuador)",
    "qu-PE": "Quechua (Peru)",
    "ro": "Romanian",
    "ro-RO": "Romanian (Romania)",
    "ru": "Russian",
    "ru-RU": "Russian (Russia)",
    "sa": "Sanskrit",
    "sa-IN": "Sanskrit (India)",
    "se": "Sami (Northern)",
    "se-FI": "Sami (Northern) (Finland)",
    "se-FI": "Sami (Skolt) (Finland)",
    "se-FI": "Sami (Inari) (Finland)",
    "se-NO": "Sami (Northern) (Norway)",
    "se-NO": "Sami (Lule) (Norway)",
    "se-NO": "Sami (Southern) (Norway)",
    "se-SE": "Sami (Northern) (Sweden)",
    "se-SE": "Sami (Lule) (Sweden)",
    "se-SE": "Sami (Southern) (Sweden)",
    "sk": "Slovak",
    "sk-SK": "Slovak (Slovakia)",
    "sl": "Slovenian",
    "sl-SI": "Slovenian (Slovenia)",
    "sq": "Albanian",
    "sq-AL": "Albanian (Albania)",
    "sr-BA": "Serbian (Latin) (Bosnia and Herzegovina)",
    "sr-BA": "Serbian (Cyrillic) (Bosnia and Herzegovina)",
    "sr-SP": "Serbian (Latin) (Serbia and Montenegro)",
    "sr-SP": "Serbian (Cyrillic) (Serbia and Montenegro)",
    "sv": "Swedish",
    "sv-FI": "Swedish (Finland)",
    "sv-SE": "Swedish (Sweden)",
    "sw": "Swahili",
    "sw-KE": "Swahili (Kenya)",
    "syr": "Syriac",
    "syr-SY": "Syriac (Syria)",
    "ta": "Tamil",
    "ta-IN": "Tamil (India)",
    "te": "Telugu",
    "te-IN": "Telugu (India)",
    "th": "Thai",
    "th-TH": "Thai (Thailand)",
    "tl": "Tagalog",
    "tl-PH": "Tagalog (Philippines)",
    "tn": "Tswana",
    "tn-ZA": "Tswana (South Africa)",
    "tr": "Turkish",
    "tr-TR": "Turkish (Turkey)",
    "tt": "Tatar",
    "tt-RU": "Tatar (Russia)",
    "ts": "Tsonga",
    "uk": "Ukrainian",
    "uk-UA": "Ukrainian (Ukraine)",
    "ur": "Urdu",
    "ur-PK": "Urdu (Islamic Republic of Pakistan)",
    "uz": "Uzbek (Latin)",
    "uz-UZ": "Uzbek (Latin) (Uzbekistan)",
    "uz-UZ": "Uzbek (Cyrillic) (Uzbekistan)",
    "vi": "Vietnamese",
    "vi-VN": "Vietnamese (Viet Nam)",
    "xh": "Xhosa",
    "xh-ZA": "Xhosa (South Africa)",
    "zh": "Chinese",
    "zh-CN": "Chinese (S)",
    "zh-HK": "Chinese (Hong Kong)",
    "zh-MO": "Chinese (Macau)",
    "zh-SG": "Chinese (Singapore)",
    "zh-TW": "Chinese (T)",
    "zu": "Zulu",
    "zu-ZA": "Zulu (South Africa)"
};

// Country codes
export const country = {
    "AF": "Afghanistan",
    "AX": "Åland Islands",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BQ": "Bonaire",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "CV": "Cape Verde",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CG": "Congo",
    "CD": "The Democratic Republic of the Congo",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "CI": "Côte d'Ivoire",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (Malvinas)",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See (Vatican City State)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Islamic Republic of Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "Democratic People's Republic of Korea",
    "KR": "Republic of Korea",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MK": "The Former Yugoslav Republic of Macedonia",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Federated States of Micronesia",
    "MD": "Republic of Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "State of Palestine",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "RE": "Réunion",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French part)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SZ": "Eswatini",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "United Republic of Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UM": "United States Minor Outlying Islands",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Bolivarian Republic of Venezuela",
    "VN": "Vietnam",
    "VG": "British Virgin Islands",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
};

// Continents
export const continents = {
    "AF": "Africa",
    "AN": "Antarctica",
    "AS": "Asia",
    "EU": "Europe",
    "NA": "North America",
    "OC": "Oceania",
    "SA": "South America"
};

// Analytics duration
export const analyticsDuration = {
    'day': 1,
    '3days': 3,
    'week': 7,
    '2weeks': 14,
    'month': 30,
    '2months': 60
};

// Duration nice name
export const analyticsDurationNiceName = {
    'day': 'Today',
    '3days': 'Last 3 days',
    'week': 'This Week',
    '2weeks': 'Last 2 Weeks',
    'month': 'Last Month',
    '2months': 'Last 2 Months'
};

// oEmbed provider names
export const providerNames = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    soundcloud: 'SoundCloud',
    threads: 'Threads',
    vimeo: 'Vimeo',
    googlemaps: 'Google Maps',
    spotify: 'Spotify'
};
