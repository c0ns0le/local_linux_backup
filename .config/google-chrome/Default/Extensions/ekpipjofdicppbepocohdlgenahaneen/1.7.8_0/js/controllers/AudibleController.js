!function(){function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){return e(b[g][1][a]||a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}return a}()({1:[function(a,b,c){!function(){"use strict";new(a("BaseController"))({siteName:"Audible",play:"#adbl-cloud-player-controls .adblPlayButton",pause:"#adbl-cloud-player-controls .adblPauseButton",playPrev:"#adbl-cloud-player-controls .adblFastRewind",playNext:"#adbl-cloud-player-controls .adblFastForward",buttonSwitch:!1,song:"#cp-Top-chapter-display",art:"#adbl-cloudBook",playState:".adblPlayButton.bc-hidden"}).isPlaying=function(){var a=this.doc().querySelector(this.selectors.play),b=!1;if(this.buttonSwitch)b=null===a;else if(this.selectors.playState){var c=this.doc().querySelector(this.selectors.playState);b=!!c}else a&&(b="none"===window.getComputedStyle(a,null).getPropertyValue("display"));return b}}()},{BaseController:2}],2:[function(a,b,c){!function(){"use strict";function c(a){this.siteName=a.siteName||null,this.selectors={playPause:a.playPause||null,play:a.play||null,pause:a.pause||null,playNext:a.playNext||null,playPrev:a.playPrev||null,mute:a.mute||null,like:a.like||null,dislike:a.dislike||null,iframe:a.iframe||null,playState:a.playState||null,song:a.song||null,artist:a.artist||null,album:a.album||null,art:a.art||null,currentTime:a.currentTime||null,totalTime:a.totalTime||null},this.oldState={},this.buttonSwitch=a.buttonSwitch||!1,this.attachListeners(),this.hidePlayer=a.hidePlayer||!1,this.overridePlayPrev=a.overridePlayPrev||!1,this.overridePlayPause=a.overridePlayPause||!1,this.overridePlayNext=a.overridePlayNext||!1,chrome.runtime.sendMessage({created:!0},function(){d("SK content script loaded")})}var d=a("../modules/SKLog.js");c.prototype.doc=function(){return this.selectors.iframe&&document.querySelector(this.selectors.iframe).tagName.indexOf("FRAME")>-1?document.querySelector(this.selectors.iframe).contentWindow.document:document},c.prototype.injectScript=function(a){var b=document.createElement("script");b.setAttribute("type","text/javascript"),a.url&&b.setAttribute("src",chrome.extension.getURL(a.url)),a.script&&(b.innerHTML=a.script),(document.head||document.documentElement).appendChild(b)},c.prototype.click=function(a){if(a=a||{},null===a.selectorButton)return void d("disabled",a.action);try{this.doc().querySelector(a.selectorButton).click(),d(a.action)}catch(b){d("Element not found for click.",a.selectorButton,!0)}this.updatePlayerState()},c.prototype.playPause=function(){null!==this.selectors.play&&null!==this.selectors.pause?this.isPlaying()?this.click({action:"playPause",selectorButton:this.selectors.pause,selectorFrame:this.selectors.iframe}):this.click({action:"playPause",selectorButton:this.selectors.play,selectorFrame:this.selectors.iframe}):this.click({action:"playPause",selectorButton:this.selectors.playPause,selectorFrame:this.selectors.iframe})},c.prototype.playNext=function(){this.click({action:"playNext",selectorButton:this.selectors.playNext,selectorFrame:this.selectors.iframe})},c.prototype.playPrev=function(){this.click({action:"playPrev",selectorButton:this.selectors.playPrev,selectorFrame:this.selectors.iframe})},c.prototype.stop=function(){this.isPlaying()&&this.playPause()},c.prototype.mute=function(){this.click({action:"mute",selectorButton:this.selectors.mute,selectorFrame:this.selectors.iframe})},c.prototype.like=function(){this.click({action:"like",selectorButton:this.selectors.like,selectorFrame:this.selectors.iframe})},c.prototype.dislike=function(){this.click({action:"dislike",selectorButton:this.selectors.dislike,selectorFrame:this.selectors.iframe})},c.prototype.isPlaying=function(){var a=this.doc().querySelector(this.selectors.play),b=!1;if(this.buttonSwitch)b=null===a;else if(this.selectors.playState){var c=this.doc().querySelector(this.selectors.playState);b=!(!c||"none"===window.getComputedStyle(c,null).getPropertyValue("display"))}else a&&(b="none"===window.getComputedStyle(a,null).getPropertyValue("display"));return b},c.prototype.updatePlayerState=function(){this.checkPlayer&&this.checkPlayer();var a=this.getStateData();JSON.stringify(a)!==JSON.stringify(this.oldState)&&(d("Player state change"),this.getSongChanged(a)&&chrome.runtime.sendMessage({action:"send_change_notification",stateData:a}),this.oldState=a,chrome.runtime.sendMessage({action:"update_player_state",stateData:a}))},c.prototype.getStateData=function(){return{song:this.getSongData(this.selectors.song),artist:this.getSongData(this.selectors.artist),album:this.getSongData(this.selectors.album),art:this.getArtData(this.selectors.art),currentTime:this.getSongData(this.selectors.currentTime),totalTime:this.getSongData(this.selectors.totalTime),isPlaying:this.isPlaying(),siteName:this.siteName,canDislike:!(!this.selectors.dislike||!this.doc().querySelector(this.selectors.dislike)),canPlayPrev:this.overridePlayPrev||!(!this.selectors.playPrev||!this.doc().querySelector(this.selectors.playPrev)),canPlayPause:this.overridePlayPause||!!(this.selectors.playPause&&this.doc().querySelector(this.selectors.playPause)||this.selectors.play&&this.doc().querySelector(this.selectors.play)||this.selectors.pause&&this.doc().querySelector(this.selectors.pause)),canPlayNext:this.overridePlayNext||!(!this.selectors.playNext||!this.doc().querySelector(this.selectors.playNext)),canLike:!(!this.selectors.like||!this.doc().querySelector(this.selectors.like)),hidePlayer:this.hidePlayer}},c.prototype.getSongChanged=function(a){return this.oldState&&a&&this.oldState.song!==a.song},c.prototype.getSongData=function(a){if(!a)return null;var b=this.doc().querySelector(a);return b&&b.textContent?b.textContent:null},c.prototype.getArtData=function(a){if(!a)return null;var b=this.doc().querySelector(a);return b&&b.attributes&&b.attributes.src?b.attributes.src.value:null},c.prototype.doRequest=function(a,b,c){if(void 0!==a&&("playPause"===a.action&&this.playPause(),"playNext"===a.action&&this.playNext(),"playPrev"===a.action&&this.playPrev(),"stop"===a.action&&this.stop(),"mute"===a.action&&this.mute(),"like"===a.action&&this.like(),"dislike"===a.action&&this.dislike(),"playerStateNotify"===a.action&&chrome.runtime.sendMessage({action:"send_change_notification",stateData:this.getStateData()}),"getPlayerState"===a.action)){var d=this.getStateData();this.oldState=d,c(d)}},c.prototype.attachListeners=function(){chrome.runtime.onMessage.addListener(this.doRequest.bind(this)),setInterval(this.updatePlayerState.bind(this),200),d("Attached listener for ",this)},b.exports=c}()},{"../modules/SKLog.js":3}],3:[function(a,b,c){!function(){"use strict";b.exports=function(a,b,c){a&&(b=b||"",c?(console.error("STREAMKEYS-ERROR: "+a,b),a="ERROR: "+a):console.log("STREAMKEYS-INFO: "+a,b))}}()},{}]},{},[1]);