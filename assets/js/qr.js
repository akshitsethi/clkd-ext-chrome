// qr.js
import { toDataURL, toCanvas } from "qrcode";
import { createCanvas, loadImage } from "canvas";
import { Notification } from "./notification.js";
import { Store } from "./store.js";
import { i18n } from "./i18n.js";

export const QR = {
    constants: {
        TEXT_COLOR: '#000000',
        BACKGROUND_COLOR: '#ffffff'
    },
    getConfig: function() {
        if (Store.SETTINGS.qr_text) {
            this.constants.TEXT_COLOR = Store.SETTINGS.qr_text;
        }
        if (Store.SETTINGS.qr_background) {
            this.constants.BACKGROUND_COLOR = Store.SETTINGS.qr_background;
        }

        return {
            errorCorrectionLevel: 'H',
            width: 400,
            margin: 2,
            rendererOpts: {
                quality: 1,
            },
            color: {
                dark: this.constants.TEXT_COLOR,
                light: this.constants.BACKGROUND_COLOR
            }
        }
    },
    generate: async function (url, type = 'basic', logo = null) {
        try {
            if (!['basic', 'with_logo'].includes(type)) {
                throw new Error(i18n.QRCODE_ERROR);
            }

            // Basic QR logo (including custom text and background)
            if (type === 'basic') {
                return toDataURL(url, this.getConfig());
            }

            const canvas = createCanvas(400, 400);
            await toCanvas(canvas, url, this.getConfig());

            if (logo) {
                const ctx = canvas.getContext('2d');

                // Set fill style to white and draw the rectangle
                ctx.fillStyle = this.constants.BACKGROUND_COLOR;
                ctx.roundRect(160, 160, 80, 80, 12);
                ctx.fill();

                const img = await loadImage(logo);
                const center = (400 - 60) / 2;
                ctx.drawImage(img, center, center, 60, 60);
            }

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error(error);
            Notification.error(i18n.QRCODE_ERROR);
        }
    }
};
