"use strict";var _a={normalizeKeys:null,isKeyReInstalled:false,init:function(){function i(e){return e.length<4?e:4<e.length?"a-c-m-":"c-a-"===e?"a-c-":"m-a-"===e?"a-m-":"m-c-"===e?"c-m-":e}function t(e,t,n){var r=0<=(t=t.toLowerCase()).indexOf("s-");return r&&2===t.length&&1===n.length?n.toUpperCase():(t?"<"+i(r?t.replace("s-",""):t):"<")+(r?n.toUpperCase():1<n.length&&a.test(n)?n.toLowerCase():n)+">"}var n=/<(?!<)((?:[ACMSacms]-){0,4})(.[^>]*)>/g,a=/[a-z]/;this.normalizeKeys=function(e){return e.replace(n,t)};this.normalizeMap=this.normalizeMap.bind(this);this.normalizeCmd=this.normalizeCmd.bind(this);this.normalizeOptions=this.normalizeOptions.bind(this);this.init=null},quoteRe:/"/g,normalizeOptions:function(e,t,n,r){n&&(t='"'+(n=n.replace(BG.Commands.hexCharRe,BG.Commands.onHex))+'"');try{var i=JSON.parse(t);if("string"!=typeof i)return true!==i?e:"";t=i}catch(e){n&&(t=n)}return"="+(t=t&&JSON.stringify(t).replace(this.toHexCharRe,this.onToHex))+r},optionValueRe:/=("(\S*(?:\s[^=]*)?)"|\S+)(\s|$)/g,toHexCharRe:/\s/g,onToHex:function(e){var t;return"\\u"+(e.charCodeAt(0)+1048576).toString(16).substring(2)},normalizeMap:function(e,t,n,r){var i=this.normalizeKeys(n);if(i!==n){console.log("KeyMappings Checker:",n,"is corrected into",i);n=i}return t+n+(r=r?r.replace(this.optionValueRe,this.normalizeOptions):"")},normalizeCmd:function(e,t,n,r){return t+n+(r=r?r.replace(this.optionValueRe,this.normalizeOptions):"")},mapKeyRe:/(\n[ \t]*#?(?:un)?map\s+)(\S+)([^\n]*)/g,cmdKeyRe:/(\n[ \t]*#?(?:command|shortcut)\s+)(\S+)([^\n]*)/g,wrapLineRe:/\\\n/g,wrapLineRe2:/\\\r/g,check:function(e){if(!e)return e;this.init&&this.init();if(!this.isKeyReInstalled){BG.Commands.setKeyRe(KeyRe.source);this.isKeyReInstalled=true}return e=(e=(e=(e="\n"+e.replace(this.wrapLineRe,"\\\r")).replace(this.mapKeyRe,this.normalizeMap)).replace(this.cmdKeyRe,this.normalizeCmd)).replace(this.wrapLineRe2,"\\\n").trim()}};Option.all.keyMappings.checker=_a;_a=null;bgSettings.CONST.VimiumNewTab&&(Option.all.newTabUrl.checker={check:function(e){var t=/^\/?pages\/[a-z]+.html\b/i.test(e)?chrome.runtime.getURL(e):BG.Utils.convertToUrl(e.toLowerCase());return t.lastIndexOf("http",0)<0&&t in bgSettings.newTabs?bgSettings.CONST.ChromeInnerNewTab:e}});Option.all.searchUrl.checker={check:function(e){var t=Object.create(null);BG.Utils.parseSearchEngines("__k:"+e,t);var n=t.__k;if(null==n)return bgSettings.get("searchUrl",true);var r=BG.Utils.convertToUrl(n.url,null,-2);if(2<BG.Utils.lastUrlType){var i='The value "'+n.url+'" is not a valid plain URL.';console.log("searchUrl checker:",i);Option.all.searchUrl.showError(i);return bgSettings.get("searchUrl",true)}r=r.replace(BG.Utils.spacesRe,"%20");n.name&&"__k"!==n.name&&(r+=" "+n.name);Option.all.searchUrl.showError("");return r}};Option.all.vimSync.checker={check:function(e){e&&!Option.all.vimSync.previous&&setTimeout(alert,100,'Warning: the current settings will be OVERRIDDEN the next time Vimium C starts!\nPlease back up your settings using the "Export Settings" button RIGHT NOW!');return e}};Option.all.keyboard.checker={check:function(e){return null!=e&&2===e.length&&0<e[0]&&e[0]<4e3&&0<e[1]&&e[1]<1e3?[+e[0],e[1]]:bgSettings.defaults.keyboard}};(function(){function t(e){BG.Commands||BG.Utils.require("Commands");e&&this.removeEventListener("input",t)}var e=loadChecker,n=loadChecker.info;loadChecker.info="";var r=$$("[data-check]"),i;for(i=r.length;0<=--i;){var a=r[i];a.removeEventListener(a.getAttribute("data-check")||"input",e)}if("keyMappings"===n)return t();Option.all.keyMappings.element.addEventListener("input",t)})();