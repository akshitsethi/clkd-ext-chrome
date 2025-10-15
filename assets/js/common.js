// common.js
import { i18n } from "./i18n.js";
import { Notification } from "./notification.js";
import { Modal } from "./modal.js";
import { QR } from "./qr.js";
import { Store } from "./store.js";
import { Settings } from "./settings.js";

export const Common = {
    QRCodeModal: async function(domain, slug) {
        if (!domain || !slug) {
            throw new Error(i18n.MISSING_DETAILS_ERROR);
        }

        // Generate QR using scan link
        const scanLink = `https://${domain}/${slug}?scan=1`;
        let qrcode = null;

        if (Store.SETTINGS.qr_logo) {
            const logo = await Store.get('logo');
            if (!logo || !(logo.hasOwnProperty('logo'))) {
                logo.logo = await Settings.storeLogoToLocal(Store.SETTINGS.qr_logo);
            }

            qrcode = await QR.generate(scanLink, 'with_logo', logo.logo);
        } else {
            qrcode = await QR.generate(scanLink);
        }

        // Open QR Code in modal
        const el = document.createElement('div');
        el.classList.add('modal-qrcode');

        // QRcode image
        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', qrcode);
        el.appendChild(imgEl);

        // Download button
        const divEl = document.createElement('div');
        divEl.classList.add('download');

        // Remove its event listener
        const anchorEl = document.createElement('a');
        anchorEl.setAttribute('href', qrcode);
        anchorEl.setAttribute('data-filename', `${slug}.png`);
        anchorEl.appendChild(document.createTextNode('Download'));
        anchorEl.addEventListener('click', e => {
            e.preventDefault();

            try {
                chrome.downloads.download({
                    url: e.target.href,
                    filename: e.target.getAttribute('data-filename')
                });
            } catch (error) {
                console.error(error);
                Notification.error(i18n.DOWNLOAD_ERROR);
            }
        });

        divEl.appendChild(anchorEl);
        el.appendChild(divEl);

        // Show modal
        Modal.show(el, 'node');
    },
    copyText: async function(selector) {
        try {
            const link = selector.getAttribute('data-text');
            if (link === null) {
                throw new Error(i18n.COPY_ERROR);
            }

            await navigator.clipboard.writeText(link);
            selector.innerText = 'Copied';
        } catch (error) {
            console.error(error);

            selector.innerText = 'Error';
            Notification.error(error.message ?? i18n.COPY_ERROR);
        } finally {
            setTimeout((selector) => {
                selector.innerText = 'Copy';
            }, 4000, selector);
        }
    }
};
