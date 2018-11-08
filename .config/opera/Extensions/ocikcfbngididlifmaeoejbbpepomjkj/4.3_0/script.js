// onClicked callback function.
function onClickHandler(info, tab) {
  chrome.tabs.create({"url": "http://docs.google.com/viewer?url="+info.linkUrl, "selected": true});
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Setting up context menu items.
chrome.contextMenus.create({"title": "Open with Google Drive Viewer","contexts": ["link"],"id": "gdocs"});