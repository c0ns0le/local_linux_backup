(function() {

    chrome.runtime.onMessage.addListener(onMessage);
    chrome.runtime.onInstalled.addListener(injectEverywhere);

	function onMessage(message, sender, sendResponse) {
		if (!sender.tab) {
			return;
		}
		
		if (message == 'up') {
			onUpMessage(sender.tab);
		}
		
		if (message == 'down') {
			onDownMessage(sender.tab);
		}
	}
	
	function onUpMessage(senderTab) {
		var index = senderTab.index - 1;
		
		activeTab(index, senderTab.windowId);
	}
	
	function onDownMessage(senderTab) {
		var index = senderTab.index + 1;
		
		activeTab(index, senderTab.windowId);
	}
	
	function activeTab(tabIndex, windowId) {
		var query = {
			'index': tabIndex,
			'windowId': windowId
		};
		
		chrome.tabs.query(query, function(tabs) {
			var tab = tabs[0];

			if (tab) {
				chrome.tabs.update(tab.id, {active:true});
                chrome.tabs.executeScript(tab.id, {
                    code: 'window.addEventListener("contextmenu", preventOneContextMenuEvent);'
                });
			}
		});
	}
	
	function injectEverywhere() {
		var InjectDetails = {
			'file': 'main.js'
		};
	
		chrome.tabs.query({}, function(tabs)
		{
			for (i in tabs)
			{
				// no inject on internal browser url
				if (!isInternalChromeTab(tabs[i])) {
					chrome.tabs.executeScript(tabs[i].id, InjectDetails);
				}
			}
		});
	}

    function isInternalChromeTab(tab) {
        return tab.url.substr(0, 6) == 'chrome';
    }
})();
