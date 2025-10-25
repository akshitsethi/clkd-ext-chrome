// page/profile.js
import Cropper from "cropperjs";
import { storageBase } from "../constants.js";
import { i18n } from "../i18n.js";
import { Modal } from "../modal.js";
import { Notification } from "../notification.js";
import { Processing } from "../processing.js";
import { Upload } from "../upload.js";
import { Page } from "./page.js";
import { Selectors } from "./selectors.js";

export const Profile = {
    CROPPER: null,
    updateImageThumbnail: function(url) {
        if (!Selectors.PROFILE_THUMBNAIL_CONTAINER || !url) {
            throw new Error(i18n.DEFAULT_ERROR);
        }

        Selectors.PROFILE_THUMBNAIL_CONTAINER.setAttribute('src', url);
    },
    initialiseCropper: function(selector) {
        this.CROPPER = new Cropper(selector, {
            aspectRatio: 1,
            viewMode: 1,
            minCropBoxHeight: 240,
            minCropBoxWidth: 240,
            center: true,
            dragMode: 'move'
        });
    },
    cropEvent: function(selector) {
        if (!selector) return;

        selector.addEventListener('click', e => {
            e.preventDefault();

            try {
                Processing.show();

                const canvas = this.CROPPER.getCroppedCanvas({
                    width: 240,
                    height: 240,
                });
                canvas.toBlob(async (blob) => {
                    try {
                        if (blob === null) {
                            throw new Error(i18n.CROP_ERROR);
                        }

                        // Make POST request for uploading file to API
                        // Convert blob to `File` object for uploading
                        const file = new File([blob], `${Page.SLUG}-${Page.DOMAIN}.png`, { type: blob.type, lastModified: new Date().getTime() });

                        const response = await Upload.postRequest(file, 'file');
                        const url = `${storageBase}${response.message.slug}`;
                        const imageData = {
                            name: response.message.name,
                            url
                        };

                        // Save `thumbnail` data
                        Page.set('design', imageData, 'thumbnail');
                        Page.save();

                        // Finally, update header styles with the newly uploaded image
                        this.updateImageThumbnail(url);
                    } catch (error) {
                        console.error(error);
                        Notification.error(error.message ?? i18n.DEFAULT_ERROR);
                    } finally {
                        if (this.CROPPER instanceof Cropper) {
                            this.CROPPER.destroy();
                            this.CROPPER = null;
                        }

                        Modal.hide();
                        Processing.hide();
                    }
                });
            } catch (error) {
                console.log(error);
                Notification.show(MESSAGES.DEFAULT_ERROR);
            }
        });
    },
    cancelEvent: function(selector) {
        if (!selector) return;

        selector.addEventListener('click', e => {
            e.preventDefault();

            if (this.CROPPER instanceof Cropper) {
                this.CROPPER.destroy();
                this.CROPPER = null;
            }

            Modal.hide();
        });
    },
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
        if (!Selectors.EDIT_IMAGE_FIELD || !Selectors.PROFILE_THUMBNAIL_TEMPLATE) return;

        Selectors.EDIT_IMAGE_FIELD.addEventListener('change', e => {
            try {
                if (!e.target.files.length) {
                    throw new Error(i18n.NO_FILE_SELECTED);
                }

                Processing.show();

                // Get first entry from FileList
                const file = e.target.files.item(0);

                // Create data url for image
                const url = URL.createObjectURL(file);
                const template = Selectors.PROFILE_THUMBNAIL_TEMPLATE.content;
                const content = template.cloneNode(true);

                // First, add desired triggers
                // and then append template to modal
                const cancel = content.querySelector('.cancel');
                this.cancelEvent(cancel);

                const crop = content.querySelector('.crop-image');
                this.cropEvent(crop);

                const image = content.querySelector('#selected-profile-image');
                image.src = url;
                image.onload = () => this.initialiseCropper(image);

                // Show modal by passing the node object
                Modal.show(content, 'node', 600);
            } catch (error) {
                console.error(error);
                Notification.error(error.message ?? i18n.DEFAULT_ERROR);
            } finally {
                Processing.hide();
                e.target.value = null;
            }
        });
    },
    events: function() {
        this.openFileDialogEvent();
        this.fileChangeEvent();
    }
};
