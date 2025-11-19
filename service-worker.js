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

// Workaround for YouTube embeds
const iframeHosts = [
	'youtube.com',
];
chrome.runtime.onInstalled.addListener(() => {
	const RULE = {
		id: 1,
		condition: {
			initiatorDomains: [chrome.runtime.id],
			requestDomains: iframeHosts,
			resourceTypes: ['sub_frame'],
		},
		action: {
			type: 'modifyHeaders',
			requestHeaders: [
				{
					header: 'Referer',
					operation: 'set',
					value: chrome.runtime.id
				},
			],
		},
	};
	chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [RULE.id],
		addRules: [RULE],
	});
});
