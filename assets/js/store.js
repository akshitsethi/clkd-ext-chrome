// store.js
export const Store = {
	USER: {},
	SETTINGS: {},
	get: async function (key = null, type = 'local') {
		if (!key) {
			return await chrome.storage[type].get();
		}

		return await chrome.storage[type].get(key);
	},
	set: async function (data, type = 'local') {
		if (!data) {
			throw new Error('No data has been provided for storage.');
		}

		await chrome.storage[type].set(data);
	},
	remove: async function(key, type = 'local') {
		if (!key) {
			throw new Error('No key specified.');
		}

		await chrome.storage[type].remove(key);
	},
	clear: async function (type = 'local') {
		await chrome.storage[type].clear();
	},
	init: async function () {
		const {settings, user} = await this.get(null, 'sync');

		if (settings) this.SETTINGS = settings;
		if (user) this.USER = user;
	}
};
