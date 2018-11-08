var manifest = {"url": chrome.extension.getURL('')};

var background = (function () {
  var r = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.path === 'background-to-ui') {
      for (var id in r) {
        if (request.method === id) r[id](request.data);
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {r[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'ui-to-background', "method": id, "data": data})}
  }
})();

var storage = {
  "GLOBAL": {},
  "read": function (id) {return storage.GLOBAL[id]},
  "init": function () {background.send("storage.init")},
  "update": function (o) {background.send("storage.update", o)},
  "write": function (id, data) {
    storage.GLOBAL[id] = data;
    background.send('app.storage.write', {"id": id, "data": data});
  }
};

var config, init = function () {
  config = {
    "storage": {
      "read": function (id) {return storage.read(id)},
      "write": function (id, obj) {storage.write(id, obj)}
    },
    "view": function (e) {
      window.setTimeout(function () {
        var size = config.storage.read("size");
        var outer = (size.height === window.outerHeight) && (size.width === window.outerWidth);
        var inner = (size.height === window.innerHeight) && (size.width === window.innerWidth);
        if (outer || inner) {
          var table = document.createElement("table");
          var tr = document.createElement("tr");
          table.setAttribute("id", "toolbar");
          /*  */
          var td = document.createElement("td");
          td.setAttribute("id", "back");
          td.setAttribute("title", "Back");
          td.addEventListener("click", function () {window.history.back()});
          td.style.backgroundImage = "url(" + manifest.url + "data/icons/back.png)";
          tr.appendChild(td);
          var td = document.createElement("td");
          td.setAttribute("id", "reload");
          td.setAttribute("title", "Reoad current page");
          td.addEventListener("click", function () {document.location.reload()});
          td.style.backgroundImage = "url(" + manifest.url + "data/icons/reload.png)";
          tr.appendChild(td);
          var td = document.createElement("td");
          td.setAttribute("id", "popout");
          td.setAttribute("title", "Open Spotify in a new tab (note: this window will be closed)");
          td.style.backgroundImage = "url(" + manifest.url + "data/icons/popout.png)";
          tr.appendChild(td);
          var td = document.createElement("td");
          td.setAttribute("id", "alwaysOnTop");
          td.setAttribute("title", "Make window to stay always on top");
          td.style.backgroundImage = "url(" + manifest.url + "data/icons/unpin.png)";
          tr.appendChild(td);
          var td = document.createElement("td");
          td.setAttribute("id", "support");
          td.setAttribute("title", "Open support page");
          td.style.backgroundImage = "url(" + manifest.url + "data/icons/support.png)";
          tr.appendChild(td);
          table.appendChild(tr);
          var td = document.createElement("td");
          td.setAttribute("id", "forward");
          td.setAttribute("title", "Forward");
          td.addEventListener("click", function () {window.history.forward()});
          td.style.backgroundImage = "url(" + manifest.url + "data/icons/forward.png)";
          tr.appendChild(td);
          /*  */
          document.body.insertBefore(table, document.body.firstChild);
          /*  */
          var _popout = document.getElementById("popout");
          var _support = document.getElementById("support");
          var _toolbar = document.getElementById("toolbar");
          var _alwaysOnTop = document.getElementById("alwaysOnTop");
          var png = config.storage.read("alwaysOnTop") ? "pin" : "unpin";
          _popout.addEventListener("click", function () {background.send("popout")});
          _support.addEventListener("click", function () {background.send("support")});
          _alwaysOnTop.style.backgroundImage = "url(" + manifest.url + "data/icons/" + png + ".png)";
          _alwaysOnTop.addEventListener("click", function () {
            var _pin = config.storage.read("alwaysOnTop");
            _pin = (_pin === true) ? false : true;
            config.storage.write("alwaysOnTop", _pin);
            background.send("alwaysOnTop", _pin);
            var png = config.storage.read("alwaysOnTop") ? "pin" : "unpin";
            this.style.backgroundImage = "url(" + manifest.url + "data/icons/" + png + ".png)";
          });
          /*  */
          window.setTimeout(function () {_toolbar.setAttribute("show", false)}, 7000);
          _toolbar.addEventListener('mouseenter', function (e) {this.setAttribute("show", true)});
          _toolbar.addEventListener('mouseleave', function (e) {this.setAttribute("show", false)});
          window.addEventListener("resize", function (e) {
            var tmp = {"width": e.target.outerWidth, "height": e.target.outerHeight};
            config.storage.write("size", tmp);
          });
        }
      }, 300);
    }
  };
  /*  */
  config.view();
  window.removeEventListener("load", init, false);
};

background.send("deviceready");
window.addEventListener("load", init, false);
background.receive('storage.update', storage.update);
background.receive("deviceready", function () {storage.init()});
background.receive("storage.update", function (e) {storage.GLOBAL = e.GLOBAL});
background.receive("storage.init", function (e) {storage.GLOBAL = e.GLOBAL});
