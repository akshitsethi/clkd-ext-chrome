// tmp.js
import { toCanvas } from "qrcode";
import { createCanvas, loadImage } from "canvas";
import { Notification } from "./notification.js";
import { i18n } from "./i18n.js";

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

            const ctx = canvas.getContext("2d");
            const boxX = (canvas.width - 80) / 2;
            const boxY = (canvas.height - 80) / 2;

            // Set fill style to white and draw the rectangle
            ctx.fillStyle = background;
            ctx.fillRect(boxX, boxY, 80, 80);

            const img = await loadImage(image);

            console.log(img);
            const center = (400 - 60) / 2;
            ctx.drawImage(img, center, center, 60, 60);

            return canvas.toDataURL("image/png");
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
