// tmp.js
import { toCanvas } from "qrcode";
import { createCanvas, loadImage } from "canvas";
import { Notification } from "../assets/js/notification.js";
import { i18n } from "../assets/js/i18n.js";

export const Tmp = {
    fileToBase64: async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (e) => reject(e);
        });
    },
    generate: async function (url, image, text = '#000000', background = '#ffffff') {
        try {
            const canvas = createCanvas(400, 400);
            await toCanvas(
                canvas,
                url,
                {
                    errorCorrectionLevel: 'H',
                    width: 400,
                    margin: 1,
                    rendererOpts: {
                        quality: 1,
                    },
                    color: {
                        dark: text,
                        light: background,
                    },
                }
            );

            const ctx = canvas.getContext('2d');

            // Set fill style to white and draw the rectangle
            ctx.fillStyle = background;
            ctx.roundRect(160, 160, 80, 80, 12);
            ctx.fill();

            const img = await loadImage(image);
            const center = (400 - 60) / 2;
            ctx.drawImage(img, center, center, 60, 60);

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error(error);
            Notification.error(i18n.QRCODE_ERROR);
        }
    },
    qrFormEvent: function() {
        const form = document.querySelector('.qrcode-form');
        if (!form) return;

        form.addEventListener('submit', async e => {
            e.preventDefault();

            const data = new FormData(e.target);
            const image = await this.fileToBase64(data.get('logo'));
            const output = await this.generate('https://akshitsethi.com', image);

            console.log(output);
        });
    },
    events: function() {
        this.qrFormEvent();
    }
};
