// page/providers.js
import { apiBase } from "../constants.js";
import { i18n } from "../i18n.js";
import { Page } from "./page.js";
import { Notification } from "../notification.js";

export const Providers = {
    constants: {
        KEY_NAME: 'providers',
        FETCH_OPTIONS: {
            method: 'GET',
            contentType: 'json'
        },
        FIELDS: [
            'title',
            'author_name',
            'author_url',
            'html'
        ],
        URLS: {
            youtube: 'https://www.youtube.com/oembed?url=',
            twitter: `${apiBase}/oembed?p=twitter&get=`,
            vimeo: 'https://vimeo.com/api/oembed.json?url=',
            soundcloud: 'https://soundcloud.com/oembed?format=json&url=',
            tiktok: 'https://www.tiktok.com/oembed?url=',
            spotify: 'https://open.spotify.com/oembed?url='
        }
    },
    fetch: async function(id, provider, value) {
        try {
            const request = await fetch(
                `${this.constants.URLS[provider]}${value}`,
                this.constants.FETCH_OPTIONS
            );

            if (request.status !== 200) {
                Page.set(this.constants.KEY_NAME, {}, id);
                throw new Error(i18n.EMBED_PROCESSING_ERROR);
            }

            // Get JSON data
            const response = await request.json();
            const embed = { url: value };

            // Fields to fetch from API
            // Fields are different for certain providers
            for (const field of this.constants.FIELDS) {
                if (response.hasOwnProperty(field)) {
                    embed[field] = response[field];
                }
            }

            // Set data
            Page.set(this.constants.KEY_NAME, embed, id);

            // Show success notification
            Notification.success(i18n.EMBED_FETCH_SUCCESS);
        } catch (error) {
            console.error(error);
            Notification.error(error.message ?? i18n.EMBED_PROCESSING_ERROR);
        }
    }
};
