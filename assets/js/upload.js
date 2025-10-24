// upload.js
import { Store } from "./store.js";
import { apiBase } from "./constants.js";
import { i18n } from "./i18n.js";
import { Page } from "./page/page.js";

export const Upload = {
    postRequest: function(file, context) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('file', file);
            formData.append('user_id', Store.USER.ID);
            formData.append('token', Store.USER.token);
            formData.append('context', context);

            if (context === 'file') {
                formData.append('slug', Page.SLUG);
                formData.append('domain', Page.DOMAIN);
            }

            // Opening connection to the server API endpoint and sending the form data
            xhr.open('POST', `${apiBase}/file`, true);
            xhr.timeout = 45000;
            xhr.addEventListener('readystatechange', async () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(JSON.parse(xhr.response));
                    }
                }
            });
            xhr.addEventListener('timeout', () => {
                reject(i18n.DEFAULT_ERROR);
            });
            xhr.addEventListener('error', (event) => {
                reject(i18n.API_ERROR);
            });

            xhr.send(formData);
        });
    }
};
