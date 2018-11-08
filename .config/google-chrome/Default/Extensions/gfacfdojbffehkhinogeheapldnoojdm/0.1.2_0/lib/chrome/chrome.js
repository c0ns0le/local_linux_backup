var app = {}, mainWindow = '', spotifyWindow = '';

app.version = function () {return chrome.runtime.getManifest().version};

app.tab = {
  "open": function (url) {
    if (mainWindow) chrome.windows.update(mainWindow, {"focused": true});
    window.setTimeout(function () {chrome.tabs.create({"url": url, "active": true})}, 300);
  }
};

app.storage = (function () {
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (o) {
      app.storage.GLOBAL = o;
      document.getElementById("common").src = "../common.js";
    });
  }, 300);
  /*  */
  return {
    "GLOBAL": {},
    "read": function (id) {return app.storage.GLOBAL[id]},
    "write": function (id, data, callback) {
      var _tmp = {};
      _tmp[id] = data;
      app.storage.GLOBAL[id] = data;
      chrome.storage.local.set(_tmp, callback);
    }
  }
})();

chrome.windows.onFocusChanged.addListener(function (e) {
  window.setTimeout(function () {
    if (spotifyWindow && e !== spotifyWindow) {
      if (config.UI.alwaysOnTop) {
        try {chrome.windows.update(spotifyWindow, {"focused": true})} catch (e) {}
      }
    }
  }, 300);
});

app.UI = (function () {
  var r = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.path === 'ui-to-background') {
      for (var id in r) {
        if (r[id] && (typeof r[id] === "function")) {
          if (request.method === id) r[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "close": function () {chrome.windows.remove(spotifyWindow)},
    "receive": function (id, callback) {r[id] = callback},
    "send": function (id, data) {
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          chrome.tabs.sendMessage(tab.id, {"path": 'background-to-ui', "method": id, "data": data}, function () {});
        });
      });
    },
    "create": function () {
      chrome.windows.getCurrent(function (win) {
        mainWindow = win.id;
        var width = config.UI.size.width;
        var height = config.UI.size.height;
        var url = "https://play.spotify.com/";
        var top = win.top + Math.round((win.height - height) / 2);
        var left = win.left + Math.round((win.width - width) / 2);
        chrome.windows.create({'url': url, 'type': 'popup', 'width': width, 'height': height, 'top': top, 'left': left}, function (w) {
          spotifyWindow = w.id;
        });
      });
    }
  }
})();

app.deviceReady = function (callback) {callback(true)};
app.UI.receive("deviceready", function () {app.UI.send("deviceready")});
chrome.windows.onRemoved.addListener(function (e) {if (e === spotifyWindow) {spotifyWindow = null}});
chrome.browserAction.onClicked.addListener(function () {spotifyWindow ? chrome.windows.update(spotifyWindow, {"focused": true}) : app.UI.create()});
if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL(config.welcome.url + "?v=" + app.version() + "&type=uninstall", function () {});
