"use strict";"undefined"!=typeof browser&&null!=(browser&&browser.runtime)&&(window.chrome=browser);var KeyRe=/<(?!<)(?:a-)?(?:c-)?(?:m-)?(?:[A-Z][\dA-Z]+|[a-z][\da-z]+|\S)>|\S/g,__extends=function(e,t){function n(){this.constructor=e}n.prototype=t.prototype;e.prototype=new n},debounce=function(t,n,i,s){var r=0,o,l=function(){var e=Date.now()-o;if(e<n&&0<=e)r=setTimeout(l,n-e);else{r=0;if(o!==s)return t.call(i)}};s=s?1:0;return function(){o=Date.now();if(!r){r=setTimeout(l,n);if(s){s=o;return t.call(i)}}}},_idRegex=/^#[0-9A-Z_a-z]+$/,$=function(e){return"#"===e[0]?document.getElementById(e.substring(1)):document.querySelector(e)},BG=chrome.extension.getBackgroundPage(),bgSettings=BG.Settings,Option=(function(){function s(e,t){this.element=e;this.field=e.id;this.previous=this.onUpdated=null;this.saved=true;this.field in bgSettings.bufferToLoad&&(t=this._onCacheUpdated.bind(this,t));this.fetch();(s.all[this.field]=this).onUpdated=debounce(t,330,this,1)}s.prototype.fetch=function(){this.saved=true;return this.populateElement(this.previous=bgSettings.get(this.field))};s.prototype.normalize=function(e,t,n){var i=this.checker;if(t){n=i||!n?JSON.stringify(i?i.check(e):e):n;return BG.JSON.parse(n)}return i?i.check(e):e};s.prototype.save=function(){var e=this.readValueFromElement(),t="object"==typeof e,n=t?JSON.stringify(this.previous):this.previous,i=t?JSON.stringify(e):e;if(i!==n){n=i;e=this.normalize(e,t,t?i:"");t&&(i=JSON.stringify(e))===JSON.stringify(bgSettings.defaults[this.field])&&(e=bgSettings.defaults[this.field]);bgSettings.set(this.field,e);this.previous=e=bgSettings.get(this.field);this.saved=true;n!==(t?JSON.stringify(e):e)&&this.populateElement(e,true);this.field in bgSettings.bufferToLoad&&s.syncToFrontend.push(this.field);this.onSave&&this.onSave()}};s.areJSONEqual=function(e,t){return JSON.stringify(e)===JSON.stringify(t)};s.all=Object.create(null);return s})(),ExclusionRulesOption=(function(i){function r(e,t){var n=i.call(this,e,t)||this;n.areEqual=Option.areJSONEqual;bgSettings.fetchFile("exclusionTemplate",function(){n.element.innerHTML=bgSettings.cache.exclusionTemplate;n.template=$("#exclusionRuleTemplate").content.firstChild;n.list=n.element.getElementsByTagName("tbody")[0];n.fetch=i.prototype.fetch;n.fetch();n.list.addEventListener("input",n.onUpdated);n.list.addEventListener("click",function(e){return n.onRemoveRow(e)});$("#exclusionAddButton").onclick=function(){return n.addRule("")};return n.onInit()});return n}__extends(r,i);r.prototype.fetch=function(){};r.prototype.onRowChange=function(e){};r.prototype.addRule=function(e){var t=this.appendRule(this.list,{pattern:e,passKeys:""});this.getPattern(t).focus();e&&this.onUpdated();this.onRowChange(1);return t};r.prototype.populateElement=function(e){this.list.textContent="";if(e.length<=0);else if(1===e.length)this.appendRule(this.list,e[0]);else{var t=document.createDocumentFragment();e.forEach(this.appendRule.bind(this,t));this.list.appendChild(t)}return this.onRowChange(e.length)};r.prototype.appendRule=function(e,t){var n=document.importNode(this.template,true),i=n.querySelector(".pattern"),s;i.value=s=t.pattern;s&&(i.placeholder="");(i=n.querySelector(".passKeys")).value=s=t.passKeys.trimRight();s?i.placeholder="":i.addEventListener("input",r.OnNewPassKeyInput);e.appendChild(n);return n};r.OnNewPassKeyInput=function(){this.removeEventListener("input",r.OnNewPassKeyInput);this.title="Example: "+this.placeholder;this.placeholder=""};r.prototype.onRemoveRow=function(e){for(var t=e.target,n=0;n<2&&!t.classList.contains("exclusionRemoveButton");n++)t=t.parentElement;if((t=t.parentNode.parentNode).classList.contains("exclusionRuleInstance")){t.remove();this.onUpdated();return this.onRowChange(0)}};r.prototype.readValueFromElement=function(e){var t=[],n=this.element.getElementsByClassName("exclusionRuleInstance");e=true===e;for(var i=0,s=n.length;i<s;i++){var r=n[i];if(!e||"none"!==r.style.display){var o=this.getPattern(r).value.trim();if(o){":"===o[0]||"none"===r.style.display||(o=this.reChar.test(o)?"^"===o[0]?o:(-1===o.indexOf("://")?"^http://":"^")+("*"===o[0]?"."+o:o):(-1===(o=o.replace(this._escapeRe,"$1")).indexOf("://")?":http://":":")+o);var l=this.getPassKeys(r).value;if(l){var a=l.match(KeyRe);l=a?a.sort().join(" ")+" ":""}t.push({pattern:o,passKeys:l})}}}return t};r.prototype.getPattern=function(e){return e.getElementsByClassName("pattern")[0]};r.prototype.getPassKeys=function(e){return e.getElementsByClassName("passKeys")[0]};r.prototype.onInit=function(){};return r})(Option);ExclusionRulesOption.prototype.reChar=/^[\^*]|[^\\][$()*+?\[\]{|}]/;ExclusionRulesOption.prototype._escapeRe=/\\(.)/g;65<=bgSettings.CONST.ChromeVersion&&document.documentElement.removeAttribute("spellcheck");(bgSettings.CONST.ChromeVersion<48||window.devicePixelRatio<2&&61<=bgSettings.CONST.ChromeVersion)&&(function(){var e=document.createElement("style"),t=window.devicePixelRatio,n=bgSettings.CONST.ChromeVersion,i=61<=n&&1<=t,s=i||48<=n?1.12/t:1;s=(""+s).substring(0,7);e.textContent=i?"input, textarea { border-width: "+s+"px; }":"* { border-width: "+s+"px !important; }";document.head.appendChild(e)})();$(".version").textContent=bgSettings.CONST.CurrentVersion;-1!==location.pathname.indexOf("/popup.html")&&BG.Utils.require("Exclusions").then((function(e){return function(){chrome.tabs.query({currentWindow:true,active:true},e)}})(function(e){function s(e){e=e.trim();for(var t=Object.create(null),n=0,i=e.split(" ");n<i.length;n++){var s=i[n],r=s.charCodeAt(0);t[s=60===r?"&lt;":62===r?"&gt;":38===r?"&amp;":s]=1}return Object.keys(t).join(" ")}function i(e){var t=h.getTemp(v.url,v.readValueFromElement(true));t&&(t=s(t));e&&(b=2<=v.inited?t:null);var n=3===v.inited;v.inited=2;var i=t===b;g.innerHTML='<span class="Vim">Vim</span>ium <span class="C">C</span> '+(n?"becomes to ":i?"keeps to ":"will ")+(t?'exclude: <span class="state-value code">'+t+"</span>":'be:<span class="state-value fixed-width">'+(null!==t?"disabled":" enabled")+"</span>");m.disabled=i;m.firstChild.data=i?"No Changes":"Save Changes"}function t(){if(y){y=false;var e=$("#helpSpan");if(e){e.nextElementSibling.style.display="";e.remove()}m.removeAttribute("disabled");m.firstChild.data="Save Changes"}v.init||i(false)}function n(){if(!m.disabled){var e=h.testers;v.save();setTimeout(function(){h.testers=e},50);v.inited=3;i(true);m.firstChild.data="Saved";y=m.disabled=true}}function r(e,t){t&&t.preventDefault();BG.Backend.forceStatus(e.toLowerCase(),f);window.close()}var o=BG.Backend.indexPorts(e[0].id),l=$("#blocked-msg"),a=!(o||e[0]&&e[0].url&&"loading"===e[0].status&&(0===e[0].url.lastIndexOf("http",0)||0===e[0].url.lastIndexOf("ftp",0)));if(a){var u=document.body;l.style.display=u.textContent="";l.querySelector(".version").textContent=bgSettings.CONST.CurrentVersion;var c=l.querySelector("#refresh-after-install");e[0]&&e[0].url&&(0===e[0].url.lastIndexOf("http",0)||0===e[0].url.lastIndexOf("ftp",0))?BG.IsEdge&&(c.querySelector(".action").textContent="open a new web page"):c.remove();u.style.width="auto";u.appendChild(l);document.documentElement.style.height=""}else{l.remove();l=null}var d=$(".options-link"),p=bgSettings.CONST.OptionsPage;d.href!==p&&(d.href=p);d.onclick=function(e){e.preventDefault();var t=BG.Object.create(null);t.url=bgSettings.CONST.OptionsPage;BG.Backend.focus(t);window.close()};if(!a){var h=BG.Exclusions,f=o?o[0].sender.tabId:e[0].id,g=$("#state"),m=$("#saveOptions"),v=Object.setPrototypeOf({url:o?o[0].sender.url:e[0].url,inited:0,init:function(e,t,n){this.rebuildTesters();this.onInit=n;ExclusionRulesOption.call(this,e,t);this.element.addEventListener("input",this.OnInput);this.init=null},rebuildTesters:function(){for(var e=bgSettings.get("exclusionRules"),t=h.testers=BG.Object.create(null),n=h.rules,i=0,s=e.length;i<s;i++)t[e[i].pattern]=n[2*i];this.rebuildTesters=null},addRule:function(){return ExclusionRulesOption.prototype.addRule.call(this,this.generateDefaultPattern())},populateElement:function(e){ExclusionRulesOption.prototype.populateElement.call(this,e);for(var t=this.element.getElementsByClassName("exclusionRuleInstance"),n=-1,i=0,s=t.length;i<s;i++){var r=t[i],o=this.getPattern(r).value.trim();h.testers[o](this.url)?n=i:r.style.display="none"}if(0===this.inited){0<=n?this.getPassKeys(t[n]).focus():this.addRule();this.inited=0<=n?2:1}this.populateElement=null},OnInput:function(e){var t=e.target;if(t.classList.contains("pattern"))if(h.getRe(t.value)(v.url))t.title=t.style.color="";else{t.style.color="red";t.title="Red text means that the pattern does not\nmatch the current URL."}},generateDefaultPattern:function(){var e=0===this.url.lastIndexOf("https:",0)?"^https?://"+this.url.split("/",3)[2].replace(/[.[\]]/g,"\\$&")+"/":/^[^:]+:\/\/./.test(this.url)&&this.url.lastIndexOf("file:",0)<0?":"+this.url.split("/",3).join("/")+"/":":"+this.url;this.generateDefaultPattern=function(){return e};return e}},ExclusionRulesOption.prototype),y=true,b=null;m.onclick=n;document.addEventListener("keyup",function(e){if((e.ctrlKey||e.metaKey)&&13===e.keyCode){setTimeout(window.close,300);if(!y)return n()}});v.init($("#exclusionRules"),t,function(){var e=o?o[0].sender:{status:0,flags:0},t,n=2!==e.status?"Disable":"Enable";o=null;(t=$("#toggleOnce")).textContent=n+" for once";t.onclick=r.bind(null,n);if(1&e.flags){(t=t.nextElementSibling).classList.remove("hidden");(t=t.firstElementChild).onclick=r.bind(null,"Reset")}setTimeout(function(){document.documentElement.style.height=""},17);this.onInit=null;return i(true)});window.exclusions=v;window.onunload=function(){h.testers=null;BG.Utils.GC()}}}));