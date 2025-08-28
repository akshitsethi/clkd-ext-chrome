// qr.js
import { toDataURL } from "qrcode";
import { Notification } from "./notification.js";
import { Store } from "./store.js";
import { i18n } from "./i18n.js";

export const QR = {
    generate: async function (url, text = '#000000', background = '#ffffff') {
        try {
            if (Store.SETTINGS.qr_background) {
                background = Store.SETTINGS.qr_background;
            }
            if (Store.SETTINGS.qr_text) {
                text = Store.SETTINGS.qr_text;
            }

            return toDataURL(
                url,
                {
                    errorCorrectionLevel: 'H',
                    width: 400,
                    margin: 2,
                    rendererOpts: {
                        quality: 1,
                    },
                    color: {
                        dark: text,
                        light: background
                    }
                }
            );
        } catch (error) {
            console.error(error);
            Notification.error(i18n.QRCODE_ERROR);
        }
    }
};
