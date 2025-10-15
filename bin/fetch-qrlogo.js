// Try to get logo, either the existing encoded or fetch from remote storage
const logo = await Store.get('logo');
if (!logo || (logo.hasOwnProperty('logo'))) {
    // Fetch logo from remote storage
    try {
        const response = await fetch(`${storageBase}${slug}`, {
            method: 'GET',
            async: true
        });

        // Throw error if there is an error fetching file
        if (response.status !== 200) {
            throw new Error(i18n.API_ERROR);
        }

        const file = new Blob([await response.blob()], { type: 'image/png' });
        const encodedLogo = await this.fileToBase64(file);

        // Store logo locally
        await Store.set('logo', encodedLogo);
    } catch(error) {
        throw new Error(error.message ?? i18n.API_ERROR);
    }
}