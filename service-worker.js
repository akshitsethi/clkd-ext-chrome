// service-worker.js

// For future use
// @todo add an on-boarding page that help users get a better understanding of extension features.
//
// On-boarding page
// chrome.runtime.onInstalled.addListener(({reason}) => {
// 	if (reason === 'install') {
// 			chrome.tabs.create({
// 			url: "onboarding.html"
// 		});
// 	}
// });

// Open side panel on clicking extension icon
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));
