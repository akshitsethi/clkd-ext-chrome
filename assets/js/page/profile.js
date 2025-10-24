// page/profile.js
import { i18n } from "../i18n.js";
import { Notification } from "../notification.js";
import { Selectors } from "./selectors.js";

export const Profile = {

    openFileDialogEvent: function() {
        if (!Selectors.EDIT_PROFILE_IMAGE || !Selectors.EDIT_IMAGE_FIELD) return;

        Selectors.EDIT_PROFILE_IMAGE.addEventListener('click', e => {
            e.preventDefault();

            try {
                Selectors.EDIT_IMAGE_FIELD.click();
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    fileChangeEvent: function() {
        if (!Selectors.EDIT_IMAGE_FIELD) return;

        Selectors.EDIT_IMAGE_FIELD.addEventListener('change', e => {
            try {
                if (!e.target.files.length) {
                    throw new Error(i18n.NO_FILE_SELECTED);
                }

                
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            }
        });
    },
    events: function() {
        this.openFileDialogEvent();
        this.fileChangeEvent();
    }
};
