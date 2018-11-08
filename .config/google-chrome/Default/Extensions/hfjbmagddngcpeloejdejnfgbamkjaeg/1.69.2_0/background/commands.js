"use strict";var Commands={setKeyRe:function(e){Utils.keyRe=new RegExp(e,"g")},getOptions:function(e,t){var a,o=t,n=e.length,r,l,i;if(n<=o)return null;a=Object.create(null);for(;o<n;)if(0===(r=(l=e[o++]).indexOf("="))||"__proto__"===l)console.log(0===r?"Missing":"Unsupported","option key:",l);else if(r<0)a[l]=true;else{i=l.substring(r+1);a[l=l.substring(0,r)]=i&&this.parseVal(i)}return l?a:null},hexCharRe:/\\(?:x([\da-z]{2})|\\)/gi,parseVal:function(e){try{return JSON.parse(e)}catch(e){}if(!e.startsWith('"'))return e;e=e.replace(this.hexCharRe,this.onHex);try{return JSON.parse(e)}catch(e){}return e},onHex:function(e,t){return t?"\\u00"+t:"\\\\"},loadDefaults:function(e){for(var t=this.defaultKeyMappings,a=t.length;0<=--a;){var o=t[a];e[o[0]]=Utils.makeCommand(o[1])}},parseKeyMappings:function(e){var t,a,o,n=0,r=0,l,i,s=0,c,u=CommandsData.keyToCommandRegistry=Object.create(null),m=CommandsData.cmdMap=Object.create(null),d=Object.create(null),p=Object.create(null),g=CommandsData.availableCommands;"unmapAll"!==(a=e.replace(/\\\n/g,"").replace(/[\t ]+/g," ").split("\n"))[0]&&"unmapall"!==a[0]?this.loadDefaults(u):++r;for(l=a.length;r<l;r++)if(35<(e=a[r].trim()).charCodeAt(0)){if("map"===(t=(o=e.split(" "))[0]))if((t=o[1])&&"__proto__"!==t)if(t in d)console.log("Key %c"+t,"color:red","has been mapped to",u[t].command);else if(o.length<3)console.log("Lacking command when mapping %c"+t,"color:red");else if(i=g[o[2]]){if(!(47<(c=t.charCodeAt(0))&&c<58)){u[t]=Utils.makeCommand(o[2],this.getOptions(o,3),i);d[t]=true;continue}console.log("Invalid key: %c"+t,"color:red","(the first char can not be '-' or number)")}else console.log("Command %c"+o[2],"color:red","doesn't exist!");else console.log("Unsupported key sequence %c"+(t||'""'),"color:red",'for "'+(o[2]||"")+'"');else{if("unmapAll"===t||"unmapall"===t){u=CommandsData.keyToCommandRegistry=Object.create(null);m=CommandsData.cmdMap=Object.create(null);d=Object.create(null);p=Object.create(null);(n=0)<s&&console.log("All key mappings is unmapped, but there %s been %c%d error%s%c before this instruction",1<s?"have":"has","color:red",s,1<s?"s":"","color:auto");continue}if("mapkey"===t||"mapKey"===t)if(3!==o.length)console.log("MapKey needs both source and target keys:",e);else if(1<(t=o[1]).length&&1<t.match(Utils.keyRe).length||1<o[2].length&&1<o[2].match(Utils.keyRe).length)console.log("MapKey: a source / target key should be a single key:",e);else{if(!(t in p)){p[t]=o[2];n++;continue}console.log("This key %c"+t,"color:red","has been mapped to another key:",p[t])}else if("shortcut"===t||"commmand"===t){t=o[1];if(o.length<3)console.log("Lacking command name and options in shortcut:",e);else if(Settings.CONST.GlobalCommands.indexOf(t))console.log("Shortcut %c"+t,"color:red","doesn't exist!");else{if(!(t in m)){m[t]=Utils.makeCommand(t,this.getOptions(o,2),g[t]).options;continue}console.log("Shortcut %c"+t,"color:red","has been configured")}}else if("unmap"!==t)console.log("Unknown mapping command: %c"+t,"color:red","in",e);else if(2!==o.length)console.log("Unmap needs one mapped key:",e);else{if((t=o[1])in u){delete d[t];delete u[t];continue}console.log("Unmapping: %c"+t,"color:red","has not been mapped")}}++s}CommandsData.mapKeyRegistry=0<n?p:null;CommandsData.errors=0<CommandsData.errors?~s:s},populateCommandKeys:function(){var e=CommandsData,o=e.keyMap=Object.create(null),t=Utils.keyRe,a=e.errors;a<0&&(e.errors=~a);for(var n=10;0<=--n;)o[n]=1;o["-"]=1;for(var r in e.keyToCommandRegistry){var l=r.match(t),i=l.length-1;if(0!==i){for(var s=o,c=s,u=0;(c=s[l[u]])&&u<i;){u++;s=c}if(0!==c){null!=c&&Commands.warnInactive(c,r);for(;u<i;)s=s[l[u++]]=Object.create(null);s[l[i]]=0}else Commands.warnInactive(r,l.slice(0,u+1).join(""))}else{r in o&&Commands.warnInactive(o[r],r);o[r]=0}}e.errors?console.log("%cKey Mappings: %d errors found.","background-color:#fffbe6",e.errors):a<0&&console.log("The new key mappings have no errors");var m=function(e){for(var t in e){var a=e[t];0!==a?m(a):0===o[t]&&delete e[t]}};for(var r in o){var c;0!==(c=o[r])&&1!==c&&m(c)}},warnInactive:function(e,t){console.log("inactive key:",e,"with",t);++CommandsData.errors},defaultKeyMappings:[["?","showHelp"],["j","scrollDown"],["k","scrollUp"],["h","scrollLeft"],["l","scrollRight"],["gg","scrollToTop"],["G","scrollToBottom"],["zH","scrollToLeft"],["zL","scrollToRight"],["<c-e>","scrollDown"],["<c-y>","scrollUp"],["d","scrollPageDown"],["u","scrollPageUp"],["r","reload"],["gs","toggleViewSource"],["R","reloadGivenTab"],["<a-R>","reopenTab"],["<a-r>","reloadTab"],["<a-t>","previousTab"],["<a-c>","reloadTab"],["<a-v>","nextTab"],["i","enterInsertMode"],["v","enterVisualMode"],["V","enterVisualLineMode"],["<f8>","enterVisualMode"],["H","goBack"],["L","goForward"],["gu","goUp"],["gU","goToRoot"],["gi","focusInput"],["f","LinkHints.activate"],["F","LinkHints.activateModeToOpenInNewTab"],["<a-f>","LinkHints.activateModeWithQueue"],["/","enterFindMode"],["n","performFind"],["N","performBackwardsFind"],["[[","goPrevious"],["]]","goNext"],["yy","copyCurrentUrl"],["yf","LinkHints.activateModeToCopyLinkUrl"],["p","openCopiedUrlInCurrentTab"],["P","openCopiedUrlInNewTab"],["K","nextTab"],["J","previousTab"],["gt","nextTab"],["gT","previousTab"],["^","visitPreviousTab"],["<<","moveTabLeft"],[">>","moveTabRight"],["g0","firstTab"],["g$","lastTab"],["W","moveTabToNextWindow"],["t","createTab"],["yt","duplicateTab"],["x","removeTab"],["X","restoreTab"],["<a-p>","togglePinTab"],["<a-m>","toggleMuteTab"],["o","Vomnibar.activate"],["O","Vomnibar.activateInNewTab"],["T","Vomnibar.activateTabSelection"],["b","Vomnibar.activateBookmarks"],["B","Vomnibar.activateBookmarksInNewTab"],["ge","Vomnibar.activateUrl"],["gE","Vomnibar.activateUrlInNewTab"],["gf","nextFrame"],["gF","mainFrame"],["<f1>","simBackspace"],["<F1>","switchFocus"],["<f2>","switchFocus"],["m","Marks.activateCreateMode"],["`","Marks.activate"]]},CommandsData=CommandsData||{keyToCommandRegistry:null,keyMap:null,cmdMap:null,mapKeyRegistry:null,errors:0,availableCommands:{__proto__:null,showHelp:["Show help",1,true],debugBackground:["Debug the background page",1,true,{reuse:1,url:"chrome://extensions/?id=$id",id_mask:"$id"},"openUrl"],blank:["Do nothing",1,true],toggleLinkHintCharacters:["Toggle the other link hints (use value)",1,false,{key:"linkHintCharacters"},".toggleSwitchTemp"],toggleSwitchTemp:["Toggle switch only in currnet page (use key[, value])",1,false,null,"."],scrollDown:["Scroll down",0,false,null,"scBy"],scrollUp:["Scroll up",0,false,{count:-1},"scBy"],scrollLeft:["Scroll left",0,false,{count:-1,axis:"x"},"scBy"],scrollRight:["Scroll right",0,false,{axis:"x"},"scBy"],scrollPxDown:["Scroll 1px down",0,false,{view:1},"scBy"],scrollPxUp:["Scroll 1px up",0,false,{count:-1,view:1},"scBy"],scrollPxLeft:["Scroll 1px left",0,false,{count:-1,axis:"x",view:1},"scBy"],scrollPxRight:["Scroll 1px right",0,false,{axis:"x",view:1},"scBy"],scrollTo:["Scroll to custom position",0,false,null,"scTo"],scrollToTop:["Scroll to the top of the page",0,false,null,"scTo"],scrollToBottom:["Scroll to the bottom of the page",0,false,{dest:"max"},"scTo"],scrollToLeft:["Scroll all the way to the left",0,false,{axis:"x"},"scTo"],scrollToRight:["Scroll all the way to the right",0,false,{axis:"x",dest:"max"},"scTo"],scrollPageDown:["Scroll a page down",0,false,{dir:.5,view:"viewSize"},"scBy"],scrollPageUp:["Scroll a page up",0,false,{dir:-.5,view:"viewSize"},"scBy"],scrollFullPageDown:["Scroll a full page down",0,false,{view:"viewSize"},"scBy"],scrollFullPageUp:["Scroll a full page up",0,false,{count:-1,view:"viewSize"},"scBy"],reload:["Reload current frame (use hard/force)",1,false],reloadTab:["Reload N tab(s) (use hard/bypassCache)",20,true],reloadGivenTab:["Reload N-th tab",0,true,{single:true}],reopenTab:["Reopen current page",1,true],toggleViewSource:["View page source",1,true],copyCurrentTitle:["Copy current tab's title",1,true,{type:"title"},"copyTabInfo"],copyCurrentUrl:["Copy page's info (use type=url/frame, decoded)",1,true,null,"copyTabInfo"],autoCopy:["Copy selected text or current frame's title or URL (use url, decoded)",1,false,null,"."],autoOpen:["Open selected or copied text in a new tab",1,false],searchAs:["Search selected or copied text using current search engine",1,false],searchInAnother:["Redo search in another search engine (use keyword, reuse=0)",1,true],"LinkHints.activateModeToCopyLinkUrl":["Copy a link URL to the clipboard",0,false,{mode:137},"Hints.activate"],"LinkHints.activateModeToCopyLinkText":["Copy a link text to the clipboard",0,false,{mode:130},"Hints.activate"],"LinkHints.activateModeToSearchLinkText":["Open or search a link text",0,false,{mode:131},"Hints.activate"],"LinkHints.activateModeToEdit":["Select an editable area",1,false,{mode:258},"Hints.activate"],"LinkHints.activateModeToOpenVomnibar":["Edit a link text on Vomnibar (use url, force)",1,false,{mode:257},"Hints.activate"],openCopiedUrlInCurrentTab:["Open the clipboard's URL in the current tab",1,true,{reuse:0,copied:true},"openUrl"],openCopiedUrlInNewTab:["Open the clipboard's URL in N new tab(s)",20,true,{copied:true},"openUrl"],enterInsertMode:["Enter insert mode (use code=27, stat=0)",1,true],passNextKey:["Pass the next key(s) to the page (use normal)",0,false,null,"."],enterVisualMode:["Enter visual mode",1,false,null,"Visual.activate"],enterVisualLineMode:["Enter visual line mode",1,false,{mode:"line"},"Visual.activate"],focusInput:['Focus the N-th visible text box on the page and cycle using tab (use keep, select=""/all/all-input/start/end)',0,false,null,"."],"LinkHints.activate":["Open a link in the current tab (use characters=&lt;string&gt;)",0,false,null,"Hints.activate"],"LinkHints.activateMode":["Open a link in the current tab (use characters=&lt;string&gt;)",0,false,null,"Hints.activate"],"LinkHints.activateModeToOpenInNewTab":["Open a link in a new tab",0,false,{mode:2},"Hints.activate"],"LinkHints.activateModeToOpenInNewForegroundTab":["Open a link in a new tab and switch to it",0,false,{mode:3},"Hints.activate"],"LinkHints.activateModeWithQueue":["Open multiple links in a new tab",0,false,{mode:66},"Hints.activate"],"LinkHints.activateModeToOpenIncognito":["Open a link in incognito window",0,false,{mode:138},"Hints.activate"],"LinkHints.activateModeToDownloadImage":["Download &lt;img&gt; image",0,false,{mode:132},"Hints.activate"],"LinkHints.activateModeToOpenImage":["Show &lt;img&gt; image in new extension's tab",0,false,{mode:133},"Hints.activate"],"LinkHints.activateModeToDownloadLink":["Download link URL",0,false,{mode:136},"Hints.activate"],"LinkHints.activateModeToHover":["select an element and hover",0,false,{mode:128},"Hints.activate"],"LinkHints.activateModeToLeave":["let mouse leave link",0,false,{mode:129},"Hints.activate"],"LinkHints.unhoverLast":["Stop hovering at last location",1,false,null,"Hints.unhoverLast"],enterFindMode:["Enter find mode (use last)",1,true,{active:true},"performFind"],performFind:["Cycle forward to the next find match (use dir=1/-1)",0,true],performBackwardsFind:["Cycle backward to the previous find match",0,true,{count:-1},"performFind"],clearFindHistory:["Clear find mode history",1,true],switchFocus:["blur activeElement or refocus it",1,false],simBackspace:["simulate backspace for once if focused",1,false,{act:"backspace"},"switchFocus"],goPrevious:["Follow the link labeled previous or &lt;",1,true,{rel:"prev"},"goNext"],goNext:["Follow the link labeled next or &gt;",1,true],goBack:["Go back in history",0,false],goForward:["Go forward in history",0,false,{count:-1},"goBack"],goUp:["Go up the URL hierarchy (use trailing_slash=null/&lt;boolean&gt;)",0,true],goToRoot:["Go to root of current URL hierarchy",0,true],nextTab:["Go one tab right",0,true,null,"goTab"],quickNext:["Go one tab right",0,true,null,"goTab"],previousTab:["Go one tab left",0,true,{count:-1},"goTab"],visitPreviousTab:["Go to previously-visited tab on current window",0,true],firstTab:["Go to the first N-th tab",0,true,{absolute:true},"goTab"],lastTab:["Go to the last N-th tab",0,true,{count:-1,absolute:true},"goTab"],createTab:["Create new tab(s)",20,true],duplicateTab:["Duplicate current tab for N times",20,true],removeTab:["Close N tab(s) (use allow_close, limited=null/&lt;boolean&gt;, left)",0,true],removeRightTab:["Close N-th tab on the right",0,true],restoreTab:["Restore closed tab(s)",25,true],restoreGivenTab:["Restore the last N-th tab",0,true],moveTabToNewWindow:["Move N tab(s) to new window (use limited=null/&lt;boolean&gt;)",0,true],moveTabToNextWindow:["Move tab to next window",0,true],moveTabToIncognito:["Make tab in incognito window",1,true,{incognito:true},"moveTabToNewWindow"],togglePinTab:["Pin or unpin N tab(s)",50,true],toggleMuteTab:["Mute or unmute current tab (use all, other)",1,true],closeTabsOnLeft:["Close tabs on the left",0,true,{dir:-1},"removeTabsR"],closeTabsOnRight:["Close tabs on the right",0,true,{dir:1},"removeTabsR"],closeOtherTabs:["Close all other tabs",1,true,null,"removeTabsR"],moveTabLeft:["Move tab to the left",0,true,null,"moveTab"],moveTabRight:["Move tab to the right",0,true,{dir:1},"moveTab"],enableCSTemp:["enable the site's CS in incognito window (use type=images)",0,true,{type:"images",incognito:true},"toggleCS"],toggleCS:["turn on/off the site's CS (use type=images)",0,true,{type:"images"}],clearCS:["clear extension's content settings (use type=images)",1,true,{type:"images"}],"Vomnibar.activate":['Open URL, bookmark, or history entry<br/> (use keyword="", url=false/true/&lt;string&gt;)',0,true,null,"showVomnibar"],"Vomnibar.activateInNewTab":["Open URL, history, etc,<br/> in a new tab (use keyword, url)",0,true,{force:true},"showVomnibar"],"Vomnibar.activateTabSelection":["Search through your open tabs",1,true,{mode:"tab",force:true},"showVomnibar"],"Vomnibar.activateBookmarks":["Open a bookmark",1,true,{mode:"bookm"},"showVomnibar"],"Vomnibar.activateBookmarksInNewTab":["Open a bookmark in a new tab",1,true,{mode:"bookm",force:true},"showVomnibar"],"Vomnibar.activateHistory":["Open a history",1,true,{mode:"history"},"showVomnibar"],"Vomnibar.activateHistoryInNewTab":["Open a history in a new tab",1,true,{mode:"history",force:true},"showVomnibar"],"Vomnibar.activateUrl":["Edit the current URL",0,true,{url:true},"showVomnibar"],"Vomnibar.activateUrlInNewTab":["Edit the current URL and open in a new tab",0,true,{url:true,force:true},"showVomnibar"],"Vomnibar.activateEditUrl":["Edit the current URL",0,true,{url:true},"showVomnibar"],"Vomnibar.activateEditUrlInNewTab":["Edit the current URL and open in a new tab",0,true,{url:true,force:true},"showVomnibar"],nextFrame:["Cycle forward to the next frame on the page",0,true],mainFrame:["Select the tab's main/top frame",1,true],parentFrame:["Focus a parent frame",0,true],"Marks.activateCreateMode":["Create a new mark (use swap)",1,false,{mode:"create"},"Marks.activate"],"Marks.activate":["Go to a mark (use prefix=true, swap)",1,false,null,"Marks.activate"],"Marks.clearLocal":["Remove all local marks for this site",1,true,{local:true},"clearMarks"],"Marks.clearGlobal":["Remove all global marks",1,true,null,"clearMarks"],clearGlobalMarks:["Remove all global marks (deprecated)",1,true,null,"clearMarks"],openUrl:['open URL (use url="", urls:string[], reuse=-1/0/1/-2, incognito, window, end)',20,true],focusOrLaunch:['focus a tab with given URL or open it (use url="", prefix)',1,true,{reuse:1},"openUrl"]}};if(Backend.onInit){Commands.parseKeyMappings(Settings.get("keyMappings"));Commands.populateCommandKeys();Settings.get("vimSync")||(Commands=null);chrome.commands&&chrome.commands.onCommand.addListener(Backend.ExecuteGlobal)}Commands&&(Settings.updateHooks.keyMappings=function(e){Commands.parseKeyMappings(e);Commands.populateCommandKeys();return this.broadcast({name:"keyMap",mapKeys:CommandsData.mapKeyRegistry,keyMap:CommandsData.keyMap})});