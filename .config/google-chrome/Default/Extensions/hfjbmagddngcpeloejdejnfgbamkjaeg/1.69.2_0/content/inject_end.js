"use strict";VDom.allowScripts=false;VimiumInjector.checkIfEnabled=function(e){return e({handler:"checkIfEnabled",url:window.location.href})}.bind(null,VimiumInjector.checkIfEnabled);VDom.documentReady(function(){VimiumInjector&&addEventListener("hashchange",VimiumInjector.checkIfEnabled)});if((window.browser&&browser.runtime||chrome.runtime).onMessageExternal)VimiumInjector.alive=1;else{VimiumInjector.alive=.5;console.log("%cVimium C%c: injected %cpartly%c into %c"+(window.browser&&browser.runtime||chrome.runtime).id,"color:red","color:auto","color:red","color:auto","color:#0c85e9")}VSettings.uninit=function(e){var o=VimiumInjector;if(2<=e&&o){removeEventListener("hashchange",o.checkIfEnabled);o.alive=0;o.destroy=o.checkIfEnabled=o.getCommandCount=null}};VimiumInjector.destroy=VSettings.destroy;[VDom,VHints,VKeyboard,Vomnibar,VScroller,VMarks,VFindMode,VSettings,VHUD,VVisualMode,VimiumInjector].forEach(Object.seal);[VUtils,VEventMode,VPort].forEach(Object.freeze);