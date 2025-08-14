// notification.js
export const Notification = {
	show: function (message) {
		try {
            toast(message);
		} catch (error) {
			console.error(error);
            throw new Error(error.message);
		}
	},
    loadLibraryEvent: function() {
        const sourdough = new Sourdough();
        sourdough.boot();
    },
    events: function() {
        this.loadLibraryEvent();
    }
};
