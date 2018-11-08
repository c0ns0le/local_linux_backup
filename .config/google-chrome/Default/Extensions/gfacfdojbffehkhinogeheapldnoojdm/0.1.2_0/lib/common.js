window.setTimeout(function () {
  var version = config.welcome.version;
  if (!version) app.tab.open(config.welcome.url + "?v=" + app.version() + "&type=install");
  config.welcome.version = app.version();
}, config.welcome.timeout);

app.UI.receive("support", function (o) {app.tab.open(config.welcome.url)});
app.UI.receive("app.storage.write", function (o) {app.storage.write(o.id, o.data, function () {})});
app.UI.receive("storage.init", function () {app.UI.send("storage.init", {"GLOBAL": app.storage.GLOBAL})});
app.UI.receive("storage.update", function () {app.UI.send("storage.update", {"GLOBAL": app.storage.GLOBAL})});

app.UI.receive("popout", function () {
  app.UI.close();
  window.setTimeout(function () {app.tab.open("https://open.spotify.com/")} ,300);
});
