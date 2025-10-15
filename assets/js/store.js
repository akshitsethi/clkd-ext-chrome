// store.js
export const Store = {
	USER: {},
	SETTINGS: {},
	get: async function (key = null, type = 'local') {
		if (!key) {
			return type === 'local' ? await chrome.storage.local.get() : await chrome.storage.sync.get();
		} else {
			return type === 'local' ? await chrome.storage.local.get(key) : await chrome.storage.sync.get(key);
		}
	},
	set: async function (data, type = 'local') {
		if (!data) {
			throw new Error('No data has been provided for storage.');
		}
		type === 'local' ? await chrome.storage.local.set(data) : await chrome.storage.sync.set(data);
	},
	remove: async function(key, type = 'local') {
		if (!key) {
			throw new Error('No key specified.');
		}
		type === 'local' ? await chrome.storage.local.remove(key) : await chrome.storage.sync.remove(key);
	},
	clear: async function (type = 'local') {
		type === 'local' ? await chrome.storage.local.clear() : await chrome.storage.sync.clear();
	},
	init: async function () {
		const data = await this.get(null, 'sync');

		if (data.hasOwnProperty('user')) {
			this.USER = data['user'];
		}
		if (data.hasOwnProperty('settings')) {
			this.SETTINGS = data['settings'];
		}
	}
};
