"use strict";function loadJS(e){var t=document.createElement("script");t.src=e;return document.head.appendChild(t)}function loadChecker(){if(null==loadChecker.info){loadChecker.info=this.id;loadJS("options_checker.js")}}function OnBgUnload(){function t(){var e=Option.all;for(var t in e){var n=e[t],o=n.previous;"object"==typeof o&&o&&(n.previous=bgSettings.get(n.field))}Option.all.keyMappings.saved||BG.Commands||BG.Utils.require("Commands");0<Option.all.exclusionRules.list.childElementCount&&(BG.Exclusions||BG.Utils.require("Exclusions"))}BG.removeEventListener("unload",OnBgUnload);setTimeout(function(){BG=chrome.extension.getBackgroundPage();if(BG){bgSettings=BG.Settings;if(bgSettings){BG.addEventListener("unload",OnBgUnload);if("loading"!==BG.document.readyState)return t();BG.addEventListener("DOMContentLoaded",function e(){BG.removeEventListener("DOMContentLoaded",e,true);return t()},true)}else BG=null}else{window.onbeforeunload=null;window.close()}},100)}function click(e){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",true,true,window,1,0,0,0,0,false,false,false,false,0,null);return e.dispatchEvent(t)}var $$=document.querySelectorAll.bind(document);Option.syncToFrontend=[];Option.prototype._onCacheUpdated=function(e){e.call(this);window.VSettings&&(window.VSettings.cache[this.field]=this.readValueFromElement())};Option.saveOptions=function(){var e=Option.all;e.vimSync.saved||e.vimSync.save();for(var t in e)e[t].saved||e[t].save()};Option.needSaveOptions=function(){var e=Option.all;for(var t in e)if(!e[t].saved)return true;return false};Option.prototype.areEqual=function(e,t){return e===t};var NumberOption=(function(r){function a(e,t){var n=r.call(this,e,t)||this,o,i;n.checker={min:(o=e.min)&&!isNaN(i=parseFloat(o))?i:null,max:(o=e.max)&&!isNaN(i=parseFloat(o))?i:null,default:bgSettings.defaults[n.field],check:a.Check};n.element.oninput=n.onUpdated;n.element.onfocus=n.addWheelListener.bind(n);return n}__extends(a,r);a.prototype.populateElement=function(e){this.element.value=""+e};a.prototype.readValueFromElement=function(){return parseFloat(this.element.value)};a.prototype.addWheelListener=function(){var t=this,e=this.element,n=function(e){return t.onWheel(e)},o=function(){e.removeEventListener("wheel",n,{passive:false});e.removeEventListener("blur",o);t.wheelTime=0};this.wheelTime=0;e.addEventListener("wheel",n,{passive:false});e.addEventListener("blur",o)};a.prototype.onWheel=function(e){e.preventDefault();var t=this.wheelTime,n=Date.now();if(!(n-t<100&&0<t)){this.wheelTime=n;var o=this.element,i=0<e.wheelDelta,r=o.value,a,l=i?o.stepUp:o.stepDown;if("function"==typeof l){l.call(o);a=o.value;o.value=r}else{var s=(l=parseFloat)(o.step)||1;n=(+o.value||0)+(i?s:-s);isNaN(s=l(o.max))||(n=Math.min(n,s));isNaN(s=l(o.min))||(n=Math.max(n,s));a=""+n}return this.atomicUpdate(a,0<t,false)}};a.Check=function(e){isNaN(e)&&(e=this.default);e=null!=this.min?Math.max(this.min,e):e;return null!=this.max?Math.min(this.max,e):e};return a})(Option),TextOption=(function(o){function e(e,t){var n=o.call(this,e,t)||this;n.element.oninput=n.onUpdated;n.converter=n.element.getAttribute("data-converter")||"";return n}__extends(e,o);e.prototype.populateElement=function(e,t){e=e.replace(this.whiteRe,"\xa0");if(true===t)return this.atomicUpdate(e,true,true);this.element.value=e};e.prototype.readValueFromElement=function(){var e=this.element.value.trim().replace(this.whiteMaskRe," ");e&&this.converter&&(e="lower"===this.converter?e.toLowerCase():"upper"===this.converter?e.toUpperCase():e);return e};return e})(Option);TextOption.prototype.whiteRe=/ /g;TextOption.prototype.whiteMaskRe=/\xa0/g;var NonEmptyTextOption=(function(t){function e(){return null!==t&&t.apply(this,arguments)||this}__extends(e,t);e.prototype.readValueFromElement=function(){var e=t.prototype.readValueFromElement.call(this);if(!e){e=bgSettings.defaults[this.field];this.populateElement(e,true)}return e};return e})(TextOption);TextOption.prototype.atomicUpdate=NumberOption.prototype.atomicUpdate=function(e,t,n){if(t){this.locked=true;document.activeElement!==this.element&&this.element.focus();document.execCommand("undo")}this.locked=n;this.element.select();document.execCommand("insertText",false,e);this.locked=false};var JSONOption=(function(r){function e(){return null!==r&&r.apply(this,arguments)||this}__extends(e,r);e.prototype.populateElement=function(e,t){var n=this.element instanceof HTMLInputElement,o=JSON.stringify(e,null,n?1:2),i=n?o.replace(/(,?)\n\s*/g,function(e,t){return t?", ":""}):o;r.prototype.populateElement.call(this,i,t)};e.prototype.readValueFromElement=function(){var e=r.prototype.readValueFromElement.call(this),t=null;if(e)try{t=JSON.parse(e)}catch(e){}else{t=bgSettings.defaults[this.field];this.populateElement(t,true)}return t};return e})(TextOption);JSONOption.prototype.areEqual=Option.areJSONEqual;var BooleanOption=(function(o){function e(e,t){var n=o.call(this,e,t)||this;n.element.onchange=n.onUpdated;return n}__extends(e,o);e.prototype.populateElement=function(e){this.element.checked=e||false;null===e&&(this.element.indeterminate=true)};e.prototype.readValueFromElement=function(){return this.element.indeterminate?null:this.element.checked};return e})(Option);ExclusionRulesOption.prototype.onRowChange=function(e){var t=this.list.childElementCount;if(t-e==0){e&&(BG.Exclusions||BG.Utils.require("Exclusions"));var n=$("#exclusionToolbar"),o=n.querySelectorAll("[data-model]");n.style.visibility=0<t?"":"hidden";for(var i=0,r=o.length;i<r;i++){var a=Option.all[o[i].id],l=a.element.parentNode.style;l.visibility=e||a.saved?"":"visible";l.display=!e&&a.saved?"none":""}}};ExclusionRulesOption.prototype.onInit=function(){0<this.previous.length&&($("#exclusionToolbar").style.visibility="")};TextOption.prototype.showError=function(e,t,n){null!=n||(n=!!e);var o=this.element,i=o.classList,r=o.parentElement,a=r.querySelector(".tip");if(n){if(null==a){(a=document.createElement("div")).className="tip";r.insertBefore(a,r.querySelector(".nonEmptyTip"))}a.textContent=e;null!==t&&i.add(t||"has-error")}else{i.remove("has-error"),i.remove("highlight");a&&a.remove()}};(function(){function e(){if(!this.locked)if(this.saved=this.areEqual(this.readValueFromElement(),this.previous)){if(l&&!Option.needSaveOptions()){r.disabled=true;r.firstChild.data="No Changes";l=a.disabled=false;window.onbeforeunload=null}}else if(!l){window.onbeforeunload=i;l=true;r.disabled=false;r.firstChild.data="Save Changes";a.disabled=true}}function n(e){for(var t=bgSettings.bufferToLoad,n={name:"settingsUpdate"},o=0,i=e;o<i.length;o++){var r=i[o];n[r]=t[r]=bgSettings.get(r)}bgSettings.broadcast(n)}function o(e){var t=BG.devicePixelRatio,n=document.getElementById("openInTab");document.body.classList.add("chrome-ui");document.getElementById("mainHeader").remove();n.onclick=function(){setTimeout(window.close,17)};n.style.display="";n.nextElementSibling.remove();if(!(61<=bgSettings.CONST.ChromeVersion||"chrome-extension:"!==location.protocol)){1<t&&(document.body.style.width=910/t+"px");chrome.tabs.getZoom&&chrome.tabs.getZoom(e,function(e){if(!e)return chrome.runtime.lastError;var t=Math.round(window.devicePixelRatio/e*1024)/1024;document.body.style.width=1!==t?910/t+"px":""})}}function t(e){e.tabIndex=-1;return e.setAttribute("aria-hidden","true")}function i(){return"You have unsaved changes to options."}var r=$("#saveOptions"),a=$("#exportButton"),l=false;r.onclick=function(e){false!==e&&Option.saveOptions();var t=Option.syncToFrontend;Option.syncToFrontend=[];this.disabled=true;this.firstChild.data="Saved";l=a.disabled=false;window.onbeforeunload=null;0!==t.length&&setTimeout(n,100,t)};for(var s=$$("[data-model]"),u,d={Number:NumberOption,Text:TextOption,NonEmptyText:NonEmptyTextOption,JSON:JSONOption,Boolean:BooleanOption,ExclusionRules:ExclusionRulesOption},c=s.length;0<=--c;){var h;new(d[(u=s[c]).getAttribute("data-model")])(u,e)}for(var c=(s=$$("[data-check]")).length;0<=--c;)(u=s[c]).addEventListener(u.getAttribute("data-check")||"input",loadChecker);var p=false;(u=$("#advancedOptionsButton")).onclick=function(e,t){if(null==t||"hash"===t&&false===bgSettings.get("showAdvancedOptions")){p=!p;bgSettings.set("showAdvancedOptions",p)}else p=bgSettings.get("showAdvancedOptions");var n=$("#advancedOptions");n.previousElementSibling.style.display=n.style.display=p?"":"none";this.firstChild.data=(p?"Hide":"Show")+" Advanced Options";this.setAttribute("aria-checked",""+p)};u.onclick(null,true);document.addEventListener("keydown",function(e){if(32===e.keyCode){var t;e.target.parentElement instanceof HTMLLabelElement&&e.preventDefault()}else{if(!window.VKeyboard)return;var n=191===e.keyCode||63===e.keyCode?"?":"";n&&VKeyboard.getKeyChar(e)===n&&VKeyboard.getKey(e,n)===n&&$("#showCommands").click()}});document.addEventListener("keyup",function(e){var t=e.target,n=e.keyCode;if(13===n){if(t instanceof HTMLAnchorElement)t.hasAttribute("href")||setTimeout(function(e){click(e);e.blur()},0,t);else if(e.ctrlKey||e.metaKey){t.blur&&t.blur();if(l)return r.onclick()}}else{if(32!==n)return;if(t.parentElement instanceof HTMLLabelElement){e.preventDefault();click(t.parentElement.control)}}});for(var c=(s=document.getElementsByClassName("nonEmptyTip")).length;0<=--c;){(u=s[c]).className+=" info";u.textContent="Delete all to reset this option."}for(var m=function(){var e=$("#"+this.getAttribute("data-auto-resize")),t=e.scrollHeight,n=e.scrollWidth,o=n-e.clientWidth;if(!(t<=e.clientHeight&&o<=0)){var i=Math.max(Math.min(window.innerWidth,1024)-120,550);e.style.maxWidth=i<n?i+"px":"";e.style.height=e.style.width="";var r=e.offsetHeight-e.clientHeight;t+=r=0<(o=n-e.clientWidth)?Math.max(26,r):r+18;0<o&&(e.style.width=e.offsetWidth+o+4+"px");e.style.height=t+"px"}},c=(s=$$("[data-auto-resize]")).length;0<=--c;){(u=s[c]).onclick=m;u.tabIndex=0;u.textContent="Auto resize";u.setAttribute("role","button")}m=function(e){var t=this.getAttribute("data-delay"),n=null;"continue"!==t&&e&&e.preventDefault();"event"===t&&(n=e||null);window._delayed=["#"+this.id,n];"complete"!==document.readyState?window.onload=function(e){if(e.target===window){window.onload=null;loadJS("options_ext.js")}}:loadJS("options_ext.js")};for(var c=(s=$$("[data-delay]")).length;0<=--c;)s[c].onclick=m;m=function(e){if(e.target===this){window.getSelection().selectAllChildren(this);e.preventDefault()}};for(var c=(s=$$(".sel-all")).length;0<=--c;)s[c].onmousedown=m;"#chrome-ui"===window.location.hash?o(null):chrome.tabs.query&&chrome.tabs.query({active:true,currentWindow:true},function(e){var t;document.hasFocus()&&e[0]&&0===(t=e[0].url).lastIndexOf("chrome",0)&&t.lastIndexOf("chrome-extension:",0)<0&&o(e[0].id)});Option.all.keyMappings.onSave=function(){var e=BG.CommandsData.errors,t;return this.showError(e?(1===e?"There's 1 error.":"There're "+e+" errors")+" found.\nPlease see logs of background page for more details.":"")};Option.all.keyMappings.onSave();Option.all.linkHintCharacters.onSave=function(){var e;return this.showError(this.previous.length<3?"Characters for LinkHints are too few.":"")};Option.all.linkHintCharacters.onSave();Option.all.vomnibarPage.onSave=function(){var e=this.element,t=this.previous,n=!t.lastIndexOf("chrome",0)||!t.lastIndexOf("front/",0);if(bgSettings.CONST.ChromeVersion<50){e.style.textDecoration=n?"":"line-through";return this.showError("Only extension vomnibar pages can work before Chrome 50.",null)}t=bgSettings.cache.vomnibarPage_f||t;if(n);else{if(-1!==t.lastIndexOf("file://",0))return this.showError("A file page of vomnibar is limited by Chrome to only work on file://* pages.","highlight");if(-1!==t.lastIndexOf("http://",0))return this.showError("A HTTP page of vomnibar is limited by Chrome and doesn't work on HTTPS pages.","highlight")}return this.showError("")};Option.all.vomnibarPage.onSave();0<(s=$$("[data-permission]")).length&&(function(e){function t(){var e=this.querySelector("[data-permission]");this.onclick=null;if(e){var t=e.getAttribute("data-permission");e.placeholder="lacking permission"+(t?' "'+t+'"':"")}}for(var n=chrome.runtime.getManifest(),o,i=0,r=n.permissions||[];i<r.length;i++){var a;n[a=r[i]]=true}for(var l=e.length;0<=--l;){var s=e[l],a;if(!((a=s.getAttribute("data-permission"))in n)){s.disabled=true;a="This option is disabled for lacking permission"+(a?":\n* "+a:"");if(s instanceof HTMLInputElement&&"checkbox"===s.type){s.checked=false;(s=s.parentElement).title=a}else{s.value="";s.title=a;s.parentElement.onclick=t}}}})(s);for(var c=(s=$$('[data-model="Boolean"]')).length;0<=--c;)if(!(u=s[c]).disabled){t(u);t(u.parentElement);(u=u.nextElementSibling).classList.add("checkboxHint");u.setAttribute("role","button");u.tabIndex=0;u.setAttribute("aria-hidden","false")}u=$("#openExtensionPage");if(bgSettings.CONST.ChromeVersion<65){u.href="chrome://extensions/configureCommands";u.parentElement.insertBefore(document.createTextNode('"Keyboard shortcuts" of '),u)}u.onclick=function(e){e.preventDefault();return BG.Backend.focus({url:this.href,reuse:1,prefix:true})}})();$("#importButton").onclick=function(){var e=$("#importOptions");e.onchange?e.onchange():click($("#settingsFile"))};$("#browser").textContent=(BG.IsEdge?"MS Edge":BG.IsFirefox?"Firefox":(/\bChrom(e|ium)/.exec(navigator.appVersion)||["Chrome"])[0])+(BG.NotChrome?"":" "+bgSettings.CONST.ChromeVersion)+", "+bgSettings.CONST.Platform[0].toUpperCase()+bgSettings.CONST.Platform.substring(1);window.onhashchange=function(){var e=window.location.hash,t;if((e=e.substring("!"===e[1]?2:1))&&!/[^a-z\d_\.]/i.test(e))if(t=$('[data-hash="'+e+'"]')){if(t.onclick)return t.onclick(null,"hash")}else if(t=$("#"+e)){t.getAttribute("data-model")&&t.classList.add("highlight");var n=function(e){if(!e||e.target===window){if(window.onload){window.onload=null;window.scrollTo(0,0)}window.VDom?VDom.ensureInView(t):t.scrollIntoViewIfNeeded?t.scrollIntoViewIfNeeded():t.scrollIntoView()}};if("complete"===document.readyState)return n();window.scrollTo(0,0);window.onload=n}};4<window.location.hash.length&&window.onhashchange();window.onunload=function(){BG.removeEventListener("unload",OnBgUnload);BG.Utils.GC()};BG.addEventListener("unload",OnBgUnload);document.addEventListener("click",function e(t){if(window.VDom&&VDom.UI.box===t.target){document.removeEventListener("click",e,true);VDom.UI.root.addEventListener("click",function(e){var t=e.target,n;if(VPort&&t.classList.contains("HelpCommandName")){n=t.textContent.slice(1,-1);VPort.post({handler:"copy",data:n});return VHUD.showCopied(n)}},true)}},true);