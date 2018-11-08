"use strict";function showBgLink(){var e,t=shownNode.scrollWidth;bgLink.style.height=shownNode.scrollHeight+"px";bgLink.style.width=t+"px";bgLink.style.display=""}function clickLink(e,t){t.preventDefault();if(url){var n=document.createElement("a");Object.setPrototypeOf(e,null);for(var i in e)n.setAttribute(i,e[i]);n.href=url;simulateClick(n,t)}}function simulateClick(e,t){var n=document.createEvent("MouseEvents");n.initMouseEvent("click",true,true,window,1,0,0,0,0,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,0,null);return e.dispatchEvent(n)}function imgOnKeydown(e){var t=e.keyCode;if(shownNode.alt)return false;if(32===t||13===t){e.preventDefault();simulateClick(shownNode,e);return true}if(!window.VKeyboard)return false;var n=VKeyboard.getKeyChar(e);if(!n)return false;var i=0;switch(VKeyboard.getKey(e,n)){case"<c-=>":case"+":case"=":case"<up>":i=1;break;case"<left>":i=-2;break;case"<right>":i=2;break;case"<c--\x3e":case"-":case"<down>":i=-1;break;default:return false}e.preventDefault();e.stopImmediatePropagation();if(window.viewer&&window.viewer.viewed)doImageAction(window.viewer,i);else{var o;loadViewer().then(showSlide).then(function(e){doImageAction(e,i)}).catch(defaultOnError)}return true}function doImageAction(e,t){2===t||-2===t?e.rotate(45*t):e.zoom(t/10,true)}function decodeURLPart(e){try{e=decodeURIComponent(e)}catch(e){}return e}function importBody(e){var t=$("#bodyTemplate"),n=document.importNode(t.content.querySelector("#"+e),true);document.body.insertBefore(n,t);return n}function defaultOnClick(e){if(e.altKey){e.stopImmediatePropagation();return clickLink({download:file},e)}switch(type){case"url":clickLink({target:"_blank"},e);break;case"image":if(shownNode.alt)return;loadViewer().then(showSlide).catch(defaultOnError)}}function clickShownNode(e){e.preventDefault();shownNode.onclick&&shownNode.onclick(e)}function showText(e,t){$("#textTip").setAttribute("data-text",e);var n=$("#textBody");if(t){n.textContent="string"!=typeof t?t.join(" "):t;shownNode.onclick=copyThing}else n.classList.add("null");return showBgLink()}function copyThing(e){e.preventDefault();var t=url;"url"==type&&(t=$("#textBody").textContent);if(t&&window.VPort){VPort.post({handler:"copy",data:t});return VHUD.showCopied(t)}}function toggleInvert(e){"image"===type&&(shownNode.alt||window.viewer&&window.viewer.visible?e.preventDefault():shownNode.classList.toggle("invert"))}function requireJS(i,o){return window[i]?Promise.resolve(window[i]):window[i]=new Promise(function(t,e){var n=document.createElement("script");n.src=o;n.onerror=function(){e("ImportError: "+i)};n.onload=function(){var e=window[i];e?t(e):this.onerror()};document.head.appendChild(n)})}function loadCSS(e){if(!$('link[href="'+e+'"]')){var t=document.createElement("link");t.rel="stylesheet";t.href=e;document.head.insertBefore(t,$('link[href$="show.css"]'))}}function defaultOnError(e){e&&console.log(e)}function loadViewer(){if(window.Viewer)return Promise.resolve(Viewer);loadCSS("../lib/viewer.min.css");return requireJS("Viewer","../lib/viewer.min.js").then(function(e){e.setDefaults({navbar:false,shown:function(){bgLink.style.display="none"},viewed:function(){if(tempEmit)return tempEmit(true)},hide:function(){bgLink.style.display="";if(tempEmit)return tempEmit(false)}});return e})}function showSlide(e){var t=window.getSelection();"Range"==t.type&&t.collapseToStart();var i=window.viewer=window.viewer||new e(shownNode);i.visible||i.show();return i.viewed?i:new Promise(function(t,n){tempEmit=function(e){tempEmit=null;e?t(i):n("failed to view the image")}})}function clean(){if("image"===type){document.body.classList.remove("filled");if(window.viewer){window.viewer.destroy();window.viewer=null}}}"undefined"!=typeof browser&&null!=(browser&&browser.runtime)&&(window.chrome=browser);var _idRegex=/^#[0-9A-Z_a-z]+$/,$=function(e){return _idRegex.test(e)?document.getElementById(e.substring(1)):document.querySelector(e)},BG=window.chrome&&chrome.extension&&chrome.extension.getBackgroundPage();BG&&BG.Utils&&BG.Utils.convertToUrl||(BG=null);var shownNode,bgLink=$("#bgLink"),url,type,file,tempEmit=null;window.onhashchange=function(){var e,t;if(shownNode){clean();bgLink.style.display="none";shownNode.remove();shownNode=null}type=file="";url=location.hash;if(!location.hash&&BG&&BG.Settings&&BG.Settings.temp.shownHash){url=BG.Settings.temp.shownHash()||"";window.name=url}else url||(url=window.name);if(url.length<3);else if(url.startsWith("#!image")){url=url.substring(8);type="image"}else if(url.startsWith("#!url")){url=url.substring(6);type="url"}if((t=url.indexOf("&")+1)&&url.startsWith("download=")){file=decodeURLPart(url.substring(9,t-1));url=url.substring(t)}url.indexOf(":")<=0&&url.indexOf("/")<0&&(url=decodeURLPart(url).trim());if(url)if(url.toLowerCase().startsWith("javascript:"))type=url=file="";else if(BG){e=BG.Utils.convertToUrl(url,null,-2);BG.Utils.lastUrlType<=2&&(url=e)}else url.startsWith("//")?url="http:"+url:/^([-.\dA-Za-z]+|\[[\dA-Fa-f:]+])(:\d{2,5})?\//.test(url)&&(url="http://"+url);else"image"==type&&(type="");switch(type){case"image":(shownNode=importBody("shownImage")).classList.add("hidden");shownNode.onerror=function(){this.onerror=this.onload=null;shownNode.alt="\xa0(fail to load)\xa0";BG&&BG.Settings&&60<=BG.Settings.CONST.ChromeVersion&&shownNode.classList.add("broken");shownNode.classList.remove("hidden");setTimeout(showBgLink,34);shownNode.onclick=function(e){chrome.tabs&&chrome.tabs.update?chrome.tabs.update({url:url}):clickLink({target:"_top"},e)}};if(0<url.indexOf(":")||0<url.lastIndexOf(".")){shownNode.src=url;shownNode.onclick=defaultOnClick;shownNode.onload=function(){this.onerror=this.onload=null;setTimeout(function(){shownNode.src=shownNode.src},0);showBgLink();shownNode.classList.remove("hidden");shownNode.classList.add("zoom-in");this.width>=.9*window.innerWidth&&document.body.classList.add("filled")}}else{url="";shownNode.onerror();shownNode.alt="\xa0(null)\xa0"}if(file){shownNode.setAttribute("download",file);shownNode.alt=file;shownNode.title=file}break;case"url":shownNode=importBody("shownText");if(url&&BG){e=null;url.startsWith("vimium://")&&(e=BG.Utils.evalVimiumUrl(url.substring(9),1,true));if("string"==typeof(e=null!==e?e:BG.Utils.convertToUrl(url,null,-1)));else{if(e instanceof BG.Promise){e.then(function(e){showText(e[1],e[0]||e[2]||"")});break}if(e instanceof BG.Array){showText(e[1],e[0]);break}}url=e}showText(type,url);break;default:url="";(shownNode=importBody("shownImage")).src="../icons/vimium.png";bgLink.style.display="none"}bgLink.setAttribute("data-vim-url",url);if(file){bgLink.setAttribute("data-vim-text",file);bgLink.download=file}else{bgLink.removeAttribute("data-vim-text");bgLink.removeAttribute("download")}bgLink.onclick=shownNode?clickShownNode:defaultOnClick;e=$("title").getAttribute("data-title");e=BG?BG.Utils.createSearch(file?file.split(/\s+/):[],e):e.replace(/\$[sS](?:\{[^}]*})?/,file&&file+" | ");document.title=e};String.prototype.startsWith||(String.prototype.startsWith=function(e){return 0===this.lastIndexOf(e,0)});window.onhashchange();document.addEventListener("keydown",function(e){if(("image"!==type||!imgOnKeydown(e))&&(e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&!e.repeat){var t=String.fromCharCode(e.keyCode);return"S"===t?clickLink({download:file},e):"C"===t?window.getSelection().toString()?copyThing(e):void 0:"A"===t?toggleInvert(e):void 0}});