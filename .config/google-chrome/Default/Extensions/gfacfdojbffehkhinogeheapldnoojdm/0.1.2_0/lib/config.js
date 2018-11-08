var config = {};

config.welcome = {
  "timeout": 3000,
  get version () {return app.storage.read("version")},
  "url": "http://mybrowseraddon.com/spotify-web.html",
  set version (val) {app.storage.write("version", val, function () {})}
};

config.UI = {
  set size (o) {if (o) app.storage.write("size", o, function () {})},
  set alwaysOnTop (val) {app.storage.write("alwaysOnTop", val, function () {})},
  get alwaysOnTop () {return (app.storage.read("alwaysOnTop") + '') === "true" ? true : false},
  get size () {
    var _size = app.storage.read("size");
    if (_size) return _size;
    else {
      var tmp = {"width": 1030, "height": 650};
      config.UI.size = tmp;
      return tmp;
    }
  }
};
