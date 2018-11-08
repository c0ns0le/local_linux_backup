chrome.browserAction.onClicked.addListener(function() {
	chrome.windows.create({'url': 'http://www.pandora.com', 'type': 'popup', 'width': 1100, 'height': 768} , 

function(window) { });

});
