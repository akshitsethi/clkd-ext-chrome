// page/preview.js
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";
import { QR } from "../qr.js";
import { Common } from "../common.js";

export const Preview = {
    updateShareButton: async function() {
        if (!Selectors.SHARE_BUTTON) return;

        // 1. Add link to anchor tag
        const linkEl = Selectors.SHARE_BUTTON.querySelectorAll('.share-link');
        linkEl.forEach(el => el.innerText = `${Page.DOMAIN}/${Page.SLUG}`);

        // 2. Generate QR code
        const qrEl = Selectors.SHARE_BUTTON.querySelector('.qr-code');
        const qrcode = await QR.generate(`https://${Page.DOMAIN}/${Page.SLUG}?scan=1`);

        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', qrcode);
        qrEl.appendChild(imgEl);

        // 3. Download QR code
        const downloadEl = Selectors.SHARE_BUTTON.querySelector('.download a');
        downloadEl.addEventListener('click', e => {
            e.preventDefault();

            try {
                chrome.downloads.download({
                    url: qrcode,
                    filename: `${Page.SLUG}.png`
                });
            } catch (error) {
                console.error(error);
                Notification.error(i18n.DOWNLOAD_ERROR);
            }
        });

        // 4. Add link along with copy button
        const copyEl = Selectors.SHARE_BUTTON.querySelector('.copy');
        copyEl.setAttribute('data-text', `https://${Page.DOMAIN}/${Page.SLUG}`);
        copyEl.addEventListener('click', e => {
            e.preventDefault();
            Common.copyText(e.target);
        });

        // 5. Update social links
        const links = Selectors.SHARE_BUTTON.querySelectorAll('.social a');
        if (links.length) {
            links.forEach(link => link.addEventListener('click', e => {
                e.preventDefault();

                let target = e.target;
                if (target.nodeName !== 'A') {
                    target = e.target.parentElement;
                }

                // Get href attribute and replace tje
                const url = target.getAttribute('href').replace('{PAGE_URL}', `${Page.DOMAIN}/${Page.SLUG}`);

                // Open new tab
                chrome.tabs.create({ url });
            }));
        }
    },
    showSharePopoverEvent: function() {
        if (!Selectors.SHARE_BUTTON) return;

        Selectors.SHARE_BUTTON.addEventListener('click', e => {
            e.preventDefault();

            try {
                const target = e.target.closest('.share');
                target.classList.add('show');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    hideSharePopoverEvent: function() {
        if (!Selectors.SHARE_BUTTON) return;

        const closeEl = Selectors.SHARE_BUTTON.querySelector('.close');
        if (!closeEl) return;

        closeEl.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            try {
                const parentEl = e.target.closest('.share');
                if (!parentEl) {
                    throw new Error(i18n.SELECTOR_NOT_FOUND);
                }

                parentEl.classList.remove('show');
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    closeSharePopoverEvent: function() {
        document.addEventListener('click', e => {
            e.stopPropagation();

            if (!Selectors.SHARE_BUTTON.contains(e.target) && e.target !== Selectors.SHARE_BUTTON) {
                Selectors.SHARE_BUTTON.classList.remove('show');
            }
        });
    },
    events: function() {
        this.showSharePopoverEvent();
        this.hideSharePopoverEvent();
        this.closeSharePopoverEvent();
    }
};
