/***********************************************************
		Keyboard Control for Chrome™
			Distributed under the BSD license:
			http://opensource.org/licenses/BSD-3-Clause

************************************************************
		Copyright (c) 2015 Kunihiro Ando
			senna5150ando@gmail.com
        	2015-08-24T22:19:05Z
***********************************************************/

var hintobjarray = [];
var hintstring = "";
var hintflag = false;
var keyconfig = {};
var statusbartimerid = null;
var closehintflag = true;
var onloadflag = false;
var smscrolltimerid = null;
var commandiframeflag = false;
var highlihtelemary = [];
var backwardsflag = false;
var sendmsgtimerid = null;
var ignoreallflag = false;
var createhighlighttimerid = null;
var pagemaker = {top: 0,let: 0};
var mvspeedval = 2;
var createhintstr = [];
var _createhintstr = [];
var activeinputelement = null;
var activekeydownflag = false;
var hitahintstatkey = null;
var smsscrolltimerid = null;

keyEventObject();
connectPort();
document.documentElement.addEventListener("focus",checkFocusEvent,true);
window.addEventListener("mousedown",function(e){
	if((e.target.tagName.toLowerCase() == "input")||(e.target.tagName.toLowerCase() == "textarea")){
		document.documentElement.removeEventListener("focus",checkFocusEvent,true);
		activeinputelement = null;
		activekeydownflag = true;
	}
},true);
document.addEventListener("DOMContentLoaded",function(){
	if(keyconfig.on&&(window == window.parent)){
		onFocusInput();
		document.body.addEventListener("mousedown",function(){
			if(commandiframeflag)removeCommandBox();
		},false);
		createStatusBar();
		createEmulator.init();
		var cntelem = document.createElement("div");
		document.body.appendChild(cntelem);
		cntelem.style.display = "none";
		cntelem.setAttribute("id","hit_a_hint_blinkextension_container");
		document.addEventListener("visibilitychange", function(e){
		    if(document.hidden)createEmulator.closemode();	
		}, true);	
	}
},false);
window.addEventListener("load",function(e){
	onloadflag = true;
	setTimeout(function(){
		onloadflag = false;
	},1200);
	if(!activekeydownflag){
		setTimeout(function(){
			document.documentElement.removeEventListener("focus",checkFocusEvent,true);
			if(ignoreallflag||!keyconfig.on){
				if(activeinputelement)activeinputelement.focus();
			}else if(!keyconfig.autofocus){
				var autofocuselements = document.querySelectorAll("input");
				for (var i = 0; i < autofocuselements.length; i++) {
					var item = autofocuselements[i];
					var autoelem = null;
					if(item.autofocus){
						autoelem = item;
						break;
					}
				}
				if(activeinputelement)activeinputelement.focus();
			}
		},80);
	}
});
window.addEventListener("popstate",function(e){
	if(!onloadflag)clearHintObject();
	if(keyconfig.on&&keyconfig.autofocus){
	    var elem = document.activeElement;
	    if(elem&&(elem.tagName)&&(elem.tagName.toUpperCase() == "INPUT"))elem.blur();
		document.addEventListener('focus', clearFocus, true);
		setTimeout(function(){
			document.removeEventListener('focus', clearFocus, true);	
		},250);
	}
	connectPort();
},true);

function initInitialized(){
	createhintstr = [];
	if(keyconfig.hstrside == "left"){
		createhintstr = ["f","d","s","a","t","r","e","w","q","v","b","c","x","z","g"];
	}else if(keyconfig.hstrside == "both"){
		createhintstr = ["j","k","u","l","o","i","p","n","m","h","f","d","s","a","t","r","e","w","q","v","b","c","x","z","g"];
	}else if(keyconfig.hstrside == "number"){
		createhintstr = ["1","2","3","4","5","6","7","8","9","0"];
	}else if(keyconfig.hstrside == "all"){
		createhintstr = ["j","k","u","l","o","i","p","n","m","h","f","d","s","a","t","r","e","w","q","v","b","c","x","z","g","1","2","3","4","5","6","7","8","9","0"];
	}else{
		createhintstr = ["j","k","u","l","o","i","p","n","m","h"];
	}
}
function checkFocusEvent(e){
	if((e.target.tagName.toLowerCase() == "input")||(e.target.tagName.toLowerCase() == "textarea")){
		activeinputelement = e.srcElement;
		activeinputelement.blur();
	}
}
function connectPort(){
    chrome.storage.local.get("__settings____",function(obj){
    	keyconfig = obj["__settings____"];
		initInitialized();
    	keyconfig.mbutton = keyconfig.mbutton-0;
		if((keyconfig.ignoreurlary)&&(exceptURLList(keyconfig.ignoreurlary))){
			ignoreallflag = true;
		}
		if(keyconfig.gttxtmv){
			mvspeedval = keyconfig.gttxtmv-0;
		}
		setTimeout(function(){
			if(keyconfig.showclock){
			    if(window == window.parent)clockobj.init();
			}
		},2000)
    })
}
function exceptURLList(list){	
	var url = location.href;
	if(url&&list){
		var urlary = url.split("#");	
		url = urlary[0];
		var len = list.length;
	    for(var i = 0; i < len; i++){
	    	var lurl = list[i]+'';
	    	if(lurl){
		        var regex = new RegExp(lurl);
		        if (url.search(regex) != -1) {
		            return list[i];
		        }
			    if(lurl.match(/^(http|https):\/\/.+$/)){
			    	var idx = url.indexOf(lurl);
					if(idx == 0){
						return list[i];
					}
			    }else{
			    	var urlary = url.split("/");
			    	if(urlary[2]){
				    	var domain = urlary[2];
				    	var idx = domain.indexOf(lurl);
						if(idx == 0){
							return list[i];
						}
				        var regex = new RegExp(lurl);
				        if (domain.search(regex) != -1) {
				            return list[i];
				        }
			    	}
			    }
			}
	    }
	}
    return null;
}
function sendSearchCount(){
	clearTimeout(sendmsgtimerid);
	sendmsgtimerid = setTimeout(function(){
		var ary = sortHighlightWord();
		var len = ary.length;
		chrome.runtime.sendMessage({sendmsg: "sitemcount",count:len});
	},800)
}
function innerHighlight(node, word, regopt,incrflg) {
	var skip = 0;
	if((word&&(word.length >= keyconfig.searchstart))||(incrflg)){
		if (node.nodeType == 3){
			var pattern = new RegExp(word,regopt);
			var match = pattern.exec(node.nodeValue);
			if(match&&(match.index > -1)){
				var middlebit = node.splitText(match.index);
				var endbit = middlebit.splitText(word.length);
				var middleclone = middlebit.cloneNode(true);

			    var hiword = document.createElement("span");
			    hiword.setAttribute("class","blinkextension_search_13984952786_class");
			    hiword.style.display = "inline";
			    hiword.style.color = "black";
			    hiword.style.background = "yellow";
			    hiword.style.margin = 0;
			    hiword.style.padding = 0;
				hiword.appendChild(middleclone);
				middlebit.parentNode.replaceChild(hiword, middlebit);
				skip = 1;
			}
		}else if ((node.nodeType == 1 )&&node.childNodes&&(!/(script|style)/i.test(node.tagName))) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += innerHighlight(node.childNodes[i], word, regopt,incrflg);
			}
		}
		sendSearchCount();
	}else{
		removeHighlightWord();
		chrome.runtime.sendMessage({sendmsg: "sitemcount",count:0});
	}
	return skip;
}
function removeHighlightWord(){
	highlihtelemary.length = 0;
	var helems = document.body.querySelectorAll(".blinkextension_search_13984952786_class");
	for(var i = 0, l = helems.length; i < l; i++){
		var span = helems[i];
		var prntnd = span.parentNode;
		if(prntnd){
			prntnd.replaceChild(span.firstChild,span)
			prntnd.normalize();
		}
	}
}
function sortHighlightWord(){
	var results = [];
	var helems = document.body.querySelectorAll(".blinkextension_search_13984952786_class");
	var nodes = Array.prototype.slice.call(helems,0); 
	var idx = -1;
    var prnt = window.parent,cwnd = window,doc = document;
	for (var i = 0; i < 10; i++) {
		if(cwnd === prnt){
        	doc = cwnd.document;
        	break;
		}
		cwnd = cwnd.parent.window;
		prnt = cwnd.parent.parent.window.parent;
	};
	var clh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
	var clw = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] );
	function getElementPosition(elem){
		var position=elem.getBoundingClientRect();
		return {
			left:Math.round(window.scrollX+position.left),
			top:Math.round(window.scrollY+position.top)
		}
	}
	nodes.forEach(function(item){
		var flg = false;
		var rect = getElementPosition(item);
		var style = document.defaultView.getComputedStyle(item, "");

		if((style.display != "none")&&(style.visibility != "hidden")&&(!flg)){
			if(rect&&(rect.top > -1)&&(rect.left > 0)&&(clh >= rect.top)&&(clw >= rect.left)){
				idx++;
		        results[idx] = {};
		        results[idx].top = rect.top;
		        results[idx].left = rect.left;
		        results[idx].elem = item;
			}
		}
	});
	return results.sort(function(a, b) {
		if (a.top === b.top) {
			return a.left - b.left;
		} else {
			return a.top - b.top;
		}
	});
}
function checkNextHighlightWord(){
	if(highlihtelemary.length > 0){
		var selelem = document.body.querySelector(".blinkextension_search_13984952786_class_select");
		if(selelem){
			selelem.setAttribute("class","blinkextension_search_13984952786_class");
			selelem.style.background = "yellow";
			for(var i = 0, l = highlihtelemary.length; i < l; i++){
				if(selelem == highlihtelemary[i].elem){
					if(i == l-1){
						highlightElement(highlihtelemary[0],1,highlihtelemary.length);
					}else{
						highlightElement(highlihtelemary[i+1],i+2,highlihtelemary.length);
					}
				}
			}
		}else{
			var flg = false;
			var winscrtop = document.body.scrollTop;
			var winscrbotom = winscrtop+window.innerHeight;
			for(var i = 0, l = highlihtelemary.length; i < l; i++){
				if((winscrtop < highlihtelemary[i].top)&&(winscrbotom > highlihtelemary[i].top)){
					flg = true;
					highlightElement(highlihtelemary[i],i+1,highlihtelemary.length);
					break;
				}	
			}
			if(!flg){
				highlightElement(highlihtelemary[0],1,highlihtelemary.length);
			}
		}
	}
}
function checkPreHighlightWord(){
	if(highlihtelemary.length > 0){
		var selelem = document.body.querySelector(".blinkextension_search_13984952786_class_select");
		if(selelem){
			selelem.setAttribute("class","blinkextension_search_13984952786_class");
			selelem.style.background = "yellow";

			for(var i = 0, l = highlihtelemary.length; i < l; i++){
				if(selelem == highlihtelemary[i].elem){
					if(i == 0){
						highlightElement(highlihtelemary[highlihtelemary.length-1],highlihtelemary.length,highlihtelemary.length);
					}else{
						highlightElement(highlihtelemary[i-1],i,highlihtelemary.length);
					}
				}
			}
		}else{
			var flg = false;
			var winscrtop = document.body.scrollTop;
			var winscrbotom = winscrtop+(window.innerHeight/2);

			for(var i = highlihtelemary.length-1, l = 0; i >= l; i--){
				if(winscrbotom > highlihtelemary[i].top){
					flg = true;
					highlightElement(highlihtelemary[i],i+1,highlihtelemary.length);
					break;
				}	
			}
			if(!flg){
				highlightElement(highlihtelemary[highlihtelemary.length-1],highlihtelemary.length,highlihtelemary.length);
			}
		}
	}
}
function highlightElement(elemobj,idx,len){
	var winbottom = document.body.scrollTop+window.innerHeight;
	var elem = elemobj.elem;
	var elemtop = elemobj.top;
	if((elemtop+50) > winbottom){
		document.body.scrollTop = elemtop-(window.innerHeight/4);
	}else if(elemtop < document.body.scrollTop){
		document.body.scrollTop = elemtop-(window.innerHeight/2);
	}
	elem.style.background = "orange";
	elem.setAttribute("class","blinkextension_search_13984952786_class blinkextension_search_13984952786_class_select");
	showTextStatusBar("Search " + idx +" / "+len);
}
function nextSearchResult(nextflg){
	var url = location.href;
	var xpath = "";
	
	if(nextflg){
		if(url.match("^https?://[^./]+\.google(?:\.[^./]{2,3}){1,2}/")){
			xpath = 'id("pnnext")|id("navbar navcnt nav")//td[span]/following-sibling::td[1]/a|id("nn")/parent::a';
		}else if(url.match("^https?://search\.yahoo\.com")){
			xpath = 'id("pg-next")';
		}else if(url.match("^https?://www\.youtube\.com/results")){
			xpath = '//div[contains(concat(" ", @class, " "), " yt-uix-pager ")]//a[last()][@href]';
		}else if(url.match("^https?://www\.bing\.com")){
			xpath = '//ul/li/a[contains(@class,"sb_pagN")]';
		}else if(url.match("^http://(?:www\.)?yandex\.[a-z]{2,4}/yandsearch")){
			xpath = '//span[contains(@class,"b-pager__active")]/a[contains(@class,"b-pager__next")]';
		}
	}else{
		if(url.match("^https?://[^./]+\.google(?:\.[^./]{2,3}){1,2}/")){
			xpath = 'id("pnprev")';
		}else if(url.match("^https?://search\.yahoo\.com")){
			xpath = 'id("pg-prev")';
		}else if(url.match("^https?://www\.youtube\.com/results")){
			xpath = '//div[contains(concat(" ", @class, " "), " yt-uix-pager ")]//a[1][@href]';
		}else if(url.match("^https?://www\.bing\.com")){
			xpath = '//ul/li/a[contains(@class,"sb_pagP")]';
		}else if(url.match("^http://(?:www\.)?yandex\.[a-z]{2,4}/yandsearch")){
			xpath = '//span[contains(@class,"b-pager__active")]/a[contains(@class,"b-pager__prev")]';
		}
	}
	if(xpath){
		var result = document.evaluate(xpath,document,resolv,7,null);
		function resolv(p){
			if(p == 'xhtml')return 'http://www.w3.org/1999/xhtml';
		}
		var ele = result.snapshotItem(0);
		if(ele){
			ele.click();
			return true;
		}
	}
	return false;
}
function setAntiFocus(){
    var elem = document.activeElement;
    if(elem&&(elem.tagName)&&(elem.tagName.toUpperCase() == "INPUT"))elem.blur();
	setTimeout(function(){
	    var elem = document.activeElement;
	    if(elem&&(elem.tagName)&&(elem.tagName.toUpperCase() == "INPUT")){
			elem.blur();
	    }
	},10);
}
function clearFocus(e){
    var elem = e.target;
    if(elem&&(elem.tagName)&&(elem.tagName.toUpperCase() == "INPUT"))elem.blur();
}
function onFocusInput(){
	var inputs = document.querySelectorAll("input");
	for(var i = 0, l = inputs.length; i < l; i++){
		inputs[i].addEventListener("focus",function(){
			clearHintObject();
		},false);
	}
}
function createHintSpan(flg){
	if(flg){
	    var divelem = document.createElement("div");
		divelem.style.fontSize = keyconfig.hintsize+'px';
	    divelem.style.margin = 0;
		divelem.style.padding = '1px 4px';
        divelem.style.background = 'linear-gradient(rgba(70, 70, 230,1),rgba(70, 70, 230,1))';
	    divelem.style.position = 'absolute';
	    divelem.style.display = 'inline-block';
	    divelem.style.whiteSpace = 'nowrap';
	    divelem.style.overflow = 'hidden';
	    divelem.style.boxShadow = 'rgba(0, 0, 0, 0.4) 0px 2px 3px 0px';
	    divelem.style.border = '1px solid rgb(255, 255, 0)';
	    divelem.style.color = '#fff';
	    divelem.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
	    divelem.style.fontStyle = 'normal';
	    divelem.style.fontVariant = 'normal';
	    divelem.style.fontWeight = 'normal';
	    divelem.style.letterSpacing = 0;
	    divelem.style.opacity =  1;
	    divelem.style.textDecoration = 'none';
	    divelem.style.textIndent = 0;
	    divelem.style.textTransform = 'none';
	    divelem.style.zIndex = 2147483647;
	    divelem.style.top = 0;
	    divelem.style.left = 0;
		divelem.style.lineHeight = (keyconfig.hintsize-0+1)+'px';
	    divelem.style.borderRadius = "2px";
	    divelem.style.cursor = "pointer";
	    divelem.setAttribute("class","blink_extension_hintitem_class_mg");
	    divelem.classList.add("hit_a_link_blinkextension_clickelement_select__mg")
	    return divelem;
	}else{
		var divelem = document.createElement("div");
		divelem.style.fontSize = keyconfig.hintsize+'px';
		divelem.style.margin = 0;
		divelem.style.padding = '0 1px';
		divelem.style.background = 'linear-gradient(rgb(255, 255, 133),rgb(255, 203, 87))';
		divelem.style.position = 'absolute';
		divelem.style.display = 'block';
		divelem.style.whiteSpace = 'nowrap';
		divelem.style.overflow = 'hidden';
		divelem.style.boxShadow = 'rgba(20, 0, 210, 0.8) 0px 1px 6px 4px';
		divelem.style.border = 'none';
		divelem.style.color = 'black';
		divelem.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
		divelem.style.fontStyle = 'normal';
		divelem.style.fontVariant = 'normal';
		divelem.style.fontWeight = 'normal';
		divelem.style.letterSpacing = 0;
		divelem.style.lineHeight = (keyconfig.hintsize-0+1)+'px';
		divelem.style.opacity =  1;
		divelem.style.textDecoration = 'none';
		divelem.style.textIndent = 0;
		divelem.style.textTransform = 'none';
		divelem.style.zIndex =2147483647;
		divelem.style.top = 0;
		divelem.style.left = 0;
		return divelem;
	}
}
function createTextNodeHintSpan(surl){
	var timerid = null;
	var elems = [],poss = [],txtnodes = [],txtstrs = "";
	var html = document.documentElement,body = document.body,wndih = window.innerHeight,wndiw = window.innerWidth;
    var bdyscrt = body.scrollTop,htmscrt = html.scrollTop,htmclnt = html.clientTop,bdyscrl = body.scrollLeft,htmscrl = html.scrollLeft,htmclnl = html.clientLeft;
	var func = function(){
		if(txtnodes&&txtnodes.length > 0){
			var tmpary = txtnodes.concat();
			var r = document.createRange();
			r.selectNode(tmpary[0]);	
			var rect = r.getBoundingClientRect();
			if(rect){
				var top = (bdyscrt || htmscrt) - htmclnt + rect.top;
				if(((bdyscrt || htmscrt) - (htmclnt+120)) < top){
					var pos = {
						top: top,
						left: (bdyscrl || htmscrl) - htmclnl + rect.left
					};
					elems.push(txtstrs);
					poss.push(pos);
				}
			}
		}
		txtstrs = "";
		txtnodes = [];
	};
	var br = false;
	getChild(body)
	function getChild(pnode){
		var nodes = pnode.childNodes;
		for (var i = 0; i < nodes.length; i++) {
			clearTimeout(timerid)
			timerid = setTimeout(function(){
				var hintaryabj = {};
				hintaryabj.elem = elems;
				hintaryabj.pos = poss;
				hintaryabj.surl = surl;
				drawHints(true,true,false,false,false,false,hintaryabj);
			},100);	
			var nd = nodes[i];
			if (nd.nodeType === 3) {
				if(br){
					br = false;
					func();
				}
		    	var nstr = nd.nodeValue.replace(/^\s+|\s+$/g, "");
				if(!nstr)continue;
				txtstrs += nstr;
				txtnodes.push(nd);
			}else if(nd.tagName){
				if(nd.childNodes.length === 0){
					continue;					
				}
				var tagname = nd.tagName.toLowerCase();
				if(tagname === "script" || tagname === "style" || tagname === "br" || tagname === "img" || tagname === "map"){
					br = true;
					continue;
				}
				var style = document.defaultView.getComputedStyle(nd, "");
				if(style.display === "none"){
					br = true;
					continue;	
				}else if(style.display !== "inline"){
					br = true;
				}
				var rect = nd.getBoundingClientRect();
				if(rect&&rect.left >= -10&&rect.top+bdyscrt <= wndih+bdyscrt){
					getChild(nd)
				}
			}
		};
	}
}
function removeHintChar(name){
	hitahintstatkey = "";
	var hintstrs = createhintstr.concat();
	if((keyconfig[name])&&(keyconfig[name][0])&&(keyconfig[name][0][0])){
		var dhntlen = keyconfig[name].length;
		for(var i = 0; i < dhntlen; i++){
			var keyobjary = keyconfig[name][i];
			hitahintstatkey = keyobjary[0].char;
			for(var ii = 0; ii < keyobjary.length; ii++){
				var chr = keyobjary[ii].char;
				var idx = hintstrs.indexOf(chr);
				if(idx > -1)hintstrs.splice(idx,1);
			}
		}
	}
	_createhintstr = hintstrs;
}
function drawHints(newtabflag,activeflg,sendurl,continueflg,getstr,imgflg,txtndflg,multilink) {
	if(keyconfig.on&&(window == window.parent)){
		var cntelem = document.getElementById('hit_a_hint_blinkextension_container');
	    if (cntelem) {
			closehintflag = true;
			hintflag = true;
			hintstring = "";
			cntelem.innerHTML = '';
			var hintstrs = _createhintstr.concat();
			var padstrary = [];
			if(hintstrs.length > 3){
				var stridx = 0;
				var stridx2 = 0;
				var flg = true;
				var blankstr = "";
		        var df = document.createDocumentFragment();
		        if(txtndflg){
			        var rhobj = txtndflg;
			    }else if(multilink){
			        var rhobj = multilink;
		        }else{
			        var rhobj = createHintElementArray(imgflg);
		        }
		        var results = rhobj.elem;
		        var rwsultsposary = rhobj.pos;
		        var resultlen = results.length;
				var hintsmode = false;
				var histslen = hintstrs.length;

		        if(resultlen > histslen){
					padstrary[0] = hintstrs.shift();
					padstrary[1] = hintstrs.shift();
					hintsmode = true;
					histslen = hintstrs.length;
		        }

		        var orgnspan = createHintSpan(multilink);
				for(var i = 0; i < resultlen; i++ ) {
					var elem = results[i];
			        if(hintsmode){
						var hintstr = blankstr+hintstrs[stridx]+hintstrs[stridx2];
						if(stridx2 == histslen-1){
							stridx++;
							stridx2 = 0;
						}else{
							stridx2++;
						}
						if(stridx == histslen-1){
							stridx = 0;
							if(flg){
								blankstr += padstrary[0];
								flg = false;
							}else{
								blankstr = blankstr.slice(1);
								blankstr += padstrary[1];
								flg = true;
							}
						}
					}else{
						var hintstr = hintstrs[stridx];
						stridx++;
					}

					var divelem = orgnspan.cloneNode(false);
					df.appendChild(divelem)
					divelem.style.top = rwsultsposary[i].top+"px";
					divelem.style.left = rwsultsposary[i].left+"px";
					divelem.textContent = hintstr;

					(function(divelem,elem,hintstr){
						if(multilink)elem.classList.add("hit_a_link_blinkextension_clickelement___mg")
						var contflg = false;
						var hintobj = {
							elem:divelem,
							prnt:elem,
							hintstr:hintstr,
							click:function(e){
								var shift = e.shiftKey,button = 0;
								if(e.ctrlKey)button = 1;
								if(txtndflg){
									this.checkTxt(elem);
									return;
								}else if(getstr){
									this.checkA(elem);
									return;
								}else if(imgflg){
									this.checkImg(elem);
									return;
								}else if(multilink){
									this.checkMultiLinkItem(divelem,elem);
									return;
								}else if(sendurl){
									if(continueflg){
										var sndobj = {};
										sndobj.command = "sendurl";
										sndobj.sendurl = sendurl;
										closehintflag = sndobj;
										contflg = true;
									}
									this.checkA(elem);
									return;
								}else if(newtabflag){
									button = 1;
									if(activeflg){
										shift = true;
									}else{
										closehintflag = false;
										contflg = true;
										this.checkA(elem);
										return;
									}
								}
								var types = ['mousedown','mouseup', 'click'];
								for ( var i = 0, l = types.length; i < l; i++){
									var clicker = new MouseEvent(types[i], {
									  'bubbles': true,
									  'cancelable': true,
									  'view': window,
									  'detail': 0,
									  'screenX': 0,
									  'screenY': 0,
									  'clientX': 0,
									  'clientY': 0,
									  'ctrlKey': false,
									  'altKey': false,
									  'shiftKey': shift,
									  'metaKey': false,
									  'button': button,
									  'relatedTarget': null
									});
									elem.dispatchEvent(clicker);
									elem.style.boxShadow = "0 0 4px red inset";
									setTimeout(function(){
										elem.style.boxShadow = "";
									},1200)
									if((elem)&&(elem.tagName)&&(elem.tagName.toUpperCase() == "INPUT")){
										elem.focus();
									}
								}
							},
							checkMultiLinkItem:function(divelem,elem){
				                if(divelem.classList.contains("hit_a_link_blinkextension_clickelement_select__mg")){
				                    elem.classList.remove("hit_a_link_blinkextension_clickelement___mg");
				                    divelem.classList.remove("hit_a_link_blinkextension_clickelement_select__mg");
								    divelem.style.color = '#000';
				                    divelem.style.background = 'linear-gradient(rgba(200, 200, 200,1),rgba(200, 200, 200,1))';
				                }else{
				                    elem.classList.add("hit_a_link_blinkextension_clickelement___mg");
				                    divelem.classList.add("hit_a_link_blinkextension_clickelement_select__mg");
								    divelem.style.color = '#fff';
				                    divelem.style.background = 'linear-gradient(rgba(70, 70, 230,1),rgba(70, 70, 230,1))';
				                }
							},
							checkA:function(elem){
								if(elem.tagName&&elem.tagName === "A"){
									if(sendurl){
										if(elem.href){
											var srvurl = sendurl+elem.href;
											if(!newtabflag){
												chrome.runtime.sendMessage({open:"crnttab",url:srvurl});
											}else if(newtabflag&&activeflg){
												chrome.runtime.sendMessage({open:"newtab",url:srvurl});
											}else if(newtabflag&&!activeflg){
												chrome.runtime.sendMessage({open:"newtabbg",url:srvurl,contflg:contflg,ttl:elem.textContent});
											}
										}
									}else if(getstr){
										createEmulator.statpointer();
										if(getstr === "ttl"){
											createEmulator.checkpoint(elem.textContent);
										}else if(getstr === "url"){
											createEmulator.checkpoint(elem.href);
										}else if(getstr === "urlttl"){
											createEmulator.checkpoint(elem.textContent+" "+elem.href);
										}else{
											createEmulator.checkpoint("<a href='"+elem.href+"'>"+elem.textContent+"</a>");
										}
									}else{
										if(elem.href)chrome.runtime.sendMessage({open:"newtabbg",url:elem.href,contflg:contflg,ttl:elem.textContent});
									}
								}else if(elem.tagName&&elem.tagName === "BODY"){
								}else if(elem.parentNode){
									this.checkA(elem.parentNode);
								}
							},
							checkImg:function(elem){
								if(elem.tagName&&elem.tagName.toUpperCase() === "IMG"){
									var srvurl = elem.src;
									if(imgflg === "view"){
										chrome.runtime.sendMessage({open:"imgloadpage",url:srvurl,active:activeflg});
									}else if(imgflg === "save"){
										chrome.runtime.sendMessage({open:"imgsave",url:srvurl,saveas:activeflg});
									}else if(imgflg === "search"){
										chrome.runtime.sendMessage({open:"imgsearch",url:"https://www.google.com/searchbyimage?image_url="+srvurl,active:activeflg});
									}else if(imgflg === "copyurl"){
										chrome.runtime.sendMessage({clip:"crnturl",url:srvurl});
									}
								}
							},
							checkTxt:function(elem){
								if(txtndflg.surl){
									createEmulator.statpointer(null,txtndflg.surl);
								}else{
									createEmulator.statpointer();
								}
								createEmulator.checkpoint(elem);
							}
						};
						hintobjarray.push(hintobj);
						divelem.addEventListener("click",function(e){hintobj.click()},false);
					})(divelem,elem,hintstr);

				}
				orgnspan = null;
				cntelem.appendChild(df);
				cntelem.style.display = "block";
				showTextStatusBar("Hit a Hint");
			}
		}
	}
}
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};
function createHintElementArray(imgflg){
	var hintaryabj = {};
	var html = document.documentElement;
	var body = document.body;			
    var wndih = window.innerHeight;
    var wndiw = window.innerWidth;
    var bdyscrt = body.scrollTop;
    var htmscrt = html.scrollTop;
    var htmclnt = html.clientTop;
    var bdyscrl = body.scrollLeft;
    var htmscrl = html.scrollLeft;
    var htmclnl = html.clientLeft;
    if(imgflg){
		var qery = 'img';
    }else{
		var qery = 'a, input:not([type="hidden"]), textarea, button, select, [contenteditable]:not([contenteditable="false"]), [onclick], [onmousedown], [onmouseup], [role="link"], [role="button"]';
    }
    var qresults = Array.prototype.slice.call(body.querySelectorAll(qery), 0);
    var pelems = Array.prototype.slice.call(body.getElementsByTagName('*'), 0);
    var results2 = [];
    for(var i = 0, l = pelems.length; i < l; i++){
    	var el = pelems[i];
		var style = document.defaultView.getComputedStyle(el, "");
    	if(style.cursor == 'pointer')results2.push(el);
    }
	var rsary = qresults.concat(results2).unique();
	var results = [];
	var rwsultsposary = [];
	for(var i=0,l=rsary.length;i<l;i++ ) {
		var elem = rsary[i];
		var style = document.defaultView.getComputedStyle(elem, "");
		if(style.display === "none" || style.visibility === "hidden")continue;
		var pos = getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl,imgflg);
		if (!pos) continue;
		results.push(elem)
		rwsultsposary.push(pos)
	}
	hintaryabj.elem = results;
	hintaryabj.pos = rwsultsposary;
	return hintaryabj;
}
function getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl,imgflg) {
	var rect = elem.getClientRects()[0];
	if(rect){
		var recr = rect.right,recl = rect.left;		
		if(imgflg){
			return {
				top: (bdyscrt || htmscrt) - htmclnt + rect.top,
				left: (bdyscrl || htmscrl) - htmclnl + recl
			}
		}else{
			if((recl >= -10)&& (rect.top >= -10)&& (rect.bottom <= wndih + 5) && (recr <= wndiw)) {
				return {
					top: (bdyscrt || htmscrt) - htmclnt + rect.top,
					left: (bdyscrl || htmscrl) - htmclnl + recl
				}
			}
		}
	}
	return false;
}
function clearHintObject(){
	hintflag = false;
	hintobjarray.length = 0;
	hintstring = "";
	var cont = document.getElementById("hit_a_hint_blinkextension_container");
	if(cont){
		cont.innerHTML = '';
	}
	hideStatusBar();
}
function hilightHints(str,e,multilink){
	var len = hintobjarray.length;
	var hcnt = 0;
	for(var i = 0; i < len; i++){
		if(hintobjarray[i]){
			var hh = hintobjarray[i].hintstr;
			var prnt = hintobjarray[i].prnt;
			var tag = hintobjarray[i].elem;
			var txt = tag.textContent;
			if((str == "")||(hh.indexOf(str) == 0)){
				var spntxt = txt.substring(0,str.length);
				var ntxt = txt.substring(str.length);
				tag.innerHTML = "";
				var cspan = document.createElement("span");
				tag.appendChild(cspan);
				cspan.style.color = "deeppink";
				cspan.textContent = spntxt;
				tag.appendChild(document.createTextNode(ntxt));
				tag.style.display = "block";
				if(str == hh){
					if(!multilink){
						hintobjarray[i].click(e);
						clearHintObject();
						if(closehintflag&&closehintflag.command === "sendurl"){
							drawHints(true,false,closehintflag.sendurl,true);
						}else if(!closehintflag){
							drawHints(true,false);
						}
						break;
					}else{
						hintstring = "";
						hintobjarray[i].click(e);
					}
				}
			}else{
				tag.innerHTML = txt;
				if(!multilink){
					tag.style.display = "none";
					hcnt++;
				}
			}
		}
	}
	if(hcnt == len&&!multilink){
		clearHintObject();
	}
}
function setScrollPosition (x, y,exopt) {
	var flg = false,flg2 = false,srcelem = null;
	var from_y = window.pageYOffset;
	var from_x = window.pageXOffset;
	if(y !== 0){
		window.scrollBy(0,2),window.scrollBy(0,-1);
	}else{
		window.scrollBy(2,0),window.scrollBy(-1,0);
	}
	if(from_y === window.pageYOffset&&from_x === window.pageXOffset){
		var actelem = document.activeElement;
		var chkfunc = function(e) {flg2 = true;srcelem = e.srcElement;e.stopPropagation();e.preventDefault()};
		window.addEventListener('scroll',chkfunc,true);	
		var eventInit = { deltaX: 1, deltaY: 1 },eventInit2 = { deltaX: -1, deltaY: -1 };
		var whevent = new WheelEvent("mousewheel", eventInit),whevent2 = new WheelEvent("mousewheel", eventInit2);
		actelem.dispatchEvent(whevent),actelem.dispatchEvent(whevent2);
		setTimeout(function(){
			window.removeEventListener('scroll',chkfunc,true);
		},5)
	}else{
		if(y !== 0){
			window.scrollBy(0,-1);
		}else{
			window.scrollBy(-1,0);
		}
		flg = true;
	}
	clearTimeout(smsscrolltimerid)
	smsscrolltimerid = setTimeout(function(){
        clearInterval(SmoothScroll.timer);
        clearInterval(SmoothScrollElement.timer);
		window.removeEventListener('scroll',chkfunc,true);        
		if(y != 0){
			var eventInit = { deltaX: 0, deltaY: y-0 };
		}else{
			var eventInit = { deltaX: x-0, deltaY: 0 };
		}
		if(flg){
			if(keyconfig.smscroll){
				SmoothScroll(eventInit.deltaX,eventInit.deltaY);
			}else{
				window.scrollBy(eventInit.deltaX,eventInit.deltaY);
			}
		}else if(flg2){
			if(exopt === "top"){
				eventInit.deltaY = Math.max.apply( null, [srcelem.clientHeight ,srcelem.scrollHeight,document.body.clientHeight ,document.body.scrollHeight,document.documentElement.scrollHeight,document.documentElement.clientHeight] );
				eventInit.deltaY = eventInit.deltaY*-1;
			}else if(exopt === "bottom"){
				eventInit.deltaY = Math.max.apply( null, [srcelem.clientHeight ,srcelem.scrollHeight,document.body.clientHeight ,document.body.scrollHeight,document.documentElement.scrollHeight,document.documentElement.clientHeight] );
			}
			if(keyconfig.smscroll){
				SmoothScrollElement(eventInit.deltaX,eventInit.deltaY,null,actelem,srcelem)
			}else{
				var whevent = new WheelEvent("mousewheel", eventInit);
				actelem.dispatchEvent(whevent);
			}
		}else{
			checkScrollPosition(eventInit.deltaX,eventInit.deltaY,exopt)
		}
	},3)
}
function easeOutQuart(t, b, c, d) {return -c * ((t = t / d - 1) * t * t * t - 1) + b;}
function SmoothScroll(_x, _y, _duration) {
	var from_x = window.pageXOffset;
	var from_y = window.pageYOffset;
    if (SmoothScroll.timer) {
        _x += SmoothScroll.X - from_x;
        _y += SmoothScroll.Y - from_y;
        SmoothScroll.fin();
    }
    SmoothScroll.X = _x + from_x;
    SmoothScroll.Y = _y + from_y;
    var duration = _duration || 380;
    var easing = easeOutQuart;
    var begin = Date.now();
    SmoothScroll.fin = function () {
        clearInterval(SmoothScroll.timer);
        SmoothScroll.timer = void 0;
    };
    SmoothScroll.timer = setInterval(scroll, 10);
    function scroll() {
        var now = Date.now();
        var time = now - begin;
        var prog_x = easing(time, from_x, _x, duration);
        var prog_y = easing(time, from_y, _y, duration);
        window.scrollTo(prog_x, prog_y);
        if (time > duration) {
            SmoothScroll.fin();
            window.scrollTo(from_x + _x, from_y + _y);
        }
    }
}
function SmoothScrollElement(_x, _y, _duration,elem,srcelem,nowheel) {
    SmoothScrollElement.fin = function () {
        clearInterval(SmoothScrollElement.timer);
        SmoothScrollElement.timer = void 0;
    };
    if(!elem&&!srcelem){
        SmoothScrollElement.fin();
        return;
    }
    var from_x = srcelem.scrollLeft;
    var from_y = srcelem.scrollTop;
    if (SmoothScrollElement.timer) {
        _x += SmoothScrollElement.X - from_x;
        _y += SmoothScrollElement.Y - from_y;
        SmoothScrollElement.fin();
    }
    SmoothScrollElement.X = _x + from_x;
    SmoothScrollElement.Y = _y + from_y;
    var duration = _duration || 380;
    var easing = easeOutQuart;
    var begin = Date.now();
    var befposx = from_x,befposy = from_y;
    var scrltop = elem.scrollTop;
    SmoothScrollElement.timer = setInterval(scroll, 10);
    function scroll() {
        var now = Date.now();
        var time = now - begin;
        var prog_x = easing(time, from_x, _x, duration);
        var prog_y = easing(time, from_y, _y, duration);
        var mvx = prog_x - befposx;
        var mvy = prog_y - befposy;
        befposx = prog_x;
        befposy = prog_y;
        if(nowheel){
            scrltop += mvy;
            elem.scrollTop = scrltop;
        }else{
            var eventInit = { deltaX: mvx, deltaY: mvy };
            var whevent = new WheelEvent("mousewheel", eventInit);
            elem.dispatchEvent(whevent);
        }
        if (time > duration){
            SmoothScrollElement.fin();
            if(nowheel){
                scrltop += mvy;               
                elem.scrollTop = scrltop;
            }else{
                var eventInit2 = { deltaX:from_x+_x-befposx, deltaY:from_y+_y-befposy};
                var whevent2 = new WheelEvent("mousewheel", eventInit2);
                elem.dispatchEvent(whevent2);             
            }
        }
    }
}
function checkScrollPosition(_x, _y,exopt){
    var wh = parseInt(window.innerHeight/2);
    var ww = parseInt(window.innerWidth/2);
    var elem = document.elementFromPoint(ww,wh);
    if(!elem.tagName)elem = elem.parentNode;
    if(_y != 0){
        checkelem(elem,"y",wh,ww);      
    }else{
        checkelem(elem,"x",wh,ww);      
    }
    function checkelem(item,mode,wh,ww){
        if(mode === "y"){
            if (item.clientHeight > wh&&item.clientHeight+50 < item.scrollHeight) {
                if(exopt === "top"){
                    _y = Math.max.apply( null, [item.clientHeight ,item.scrollHeight,document.body.clientHeight ,document.body.scrollHeight,document.documentElement.scrollHeight,document.documentElement.clientHeight] );
                    _y = _y*-1;
                }else if(exopt === "bottom"){
                    _y = Math.max.apply( null, [item.clientHeight ,item.scrollHeight,document.body.clientHeight ,document.body.scrollHeight,document.documentElement.scrollHeight,document.documentElement.clientHeight] );
                }
                if(keyconfig.smscroll){
                    SmoothScrollElement(0, _y, null,item,item,true);
                }else{
                    item.scrollTop += _y;
                }
                return;
            }
        }else{
            if (item.clientWidth > ww&&item.clientWidth+50 < item.scrollWidth) {
                if(keyconfig.smscroll){
                    SmoothScrollElement(_x, 0, null,item,item,true);
                }else{
                    item.scrollLeft += _x;
                }
                return;
            }
        }
        var tagname = item.tagName.toLowerCase();
        if(tagname === "body" || tagname === "html")return;
        var pnd = item.parentNode;
        if(pnd)checkelem(pnd,mode,wh,ww);
    }
}
function reloadCurrentTab(){
	location.reload();
}
function superReloadCurrentTab(){
	location.reload(true);
}
function reloadAlltabs(){
    chrome.runtime.sendMessage({reload:"reloadalltab"});
}
function focusFirstInput(){
	var elems = document.body.querySelectorAll('input[type="text"]');
	if (elems.length > 0){
		for(var i = 0, l = elems.length; i < l; i++){
			var elem = elems[i];
			var style = document.defaultView.getComputedStyle(elem, "");
			if((style.display != "none")&&(style.visibility != "hidden")){
				elem.focus();
				break;
			}
		}
	}
}
function blurFocusActiveElement(){
	document.activeElement.blur();
}
function changeFocusEditableElement(dirflg){
	var query = 'input:not([type="hidden"]),button,textarea,select,[contenteditable]:not([contenteditable="false"])';
	var elems = document.body.querySelectorAll(query);
	var flg = false;
	var newelems = [];
	for(var i = 0, l = elems.length; i < l; i++){
		var elem = elems[i];
		var style = document.defaultView.getComputedStyle(elem, "");
		if((style.display != "none")&&(style.visibility != "hidden")){
			newelems.push(elem);
		}
	}
	for(var i = 0, l = newelems.length; i < l; i++){
		var elem = newelems[i];
		if(document.activeElement == elem){
			flg = true;
			if(dirflg){
				var nextelem = newelems[i+1];
			}else{
				var nextelem = newelems[i-1];
			}
			if(nextelem){
				nextelem.focus();
				if(document.activeElement != nextelem){
					if(dirflg){
						newelems[0].focus();
					}else{
						newelems[newelems.length-1].focus();
					}
				}
				break;
			}else{
				if(dirflg){
					newelems[0].focus();
				}else{
					newelems[newelems.length-1].focus();
				}
				break;
			}
		}
	}
	if(!flg){
		if(dirflg){
			newelems[0].focus();
		}else{
			newelems[newelems.length-1].focus();
		}
	}
}
function currentURLtoClipboard(){
    chrome.runtime.sendMessage({clip:"crnturl",url:location.href});
}
function currentURLTITLEtoClipboard(){
	var str = document.title + ' ' + location.href;
    chrome.runtime.sendMessage({clip:"crnturl",url:str});
}
function currentAtagtoClipboard(){
    var str = '<a href="' + location.href + '">' + document.title + '</a>';
    chrome.runtime.sendMessage({clip:"crnturl",url:str});
}
function currentShorttoClipboard(){
    chrome.runtime.sendMessage({clip:"srturl",url:location.href});
}
function backHistory(){
  window.history.back();
}
function forwardHistory(){
  window.history.forward();
}
function closeCurrentTab(){
    chrome.runtime.sendMessage({tab:"closectab"});
}
function closeOtherTabs(){
    chrome.runtime.sendMessage({tab:"closeothertabs"});
}
function closeRightTabs(){
    chrome.runtime.sendMessage({tab:"closerighttabs"});
}
function closeLeftTabs(){
    chrome.runtime.sendMessage({tab:"closelefttabs"});
}
function pinUnpinTab(){
    chrome.runtime.sendMessage({tab:"pinunpin"});
}
function selectRighttab(){
    chrome.runtime.sendMessage({tab:"selectright"});
}
function selectLeftTab(){
    chrome.runtime.sendMessage({tab:"selectleft"});
}
function selectFirstTab(){
    chrome.runtime.sendMessage({tab:"selectfirst"});
}
function selectLastTab(){
    chrome.runtime.sendMessage({tab:"selectlast"});
}
function restoreTab(){
    chrome.runtime.sendMessage({tab:"restore"});
}
function cloneTab(){
    chrome.runtime.sendMessage({tab:"clone"});
}
function gotoParentDir(){
	if (location.hash) {
		location.href = location.pathname + location.search;
		return;
	}
	var href = location.pathname + location.search;
	var paths = href.split('/');
	if(paths.length > 0){
		if(paths[paths.length-1] == ""){
			paths.pop();
			if(paths[paths.length-1]){
				paths.pop();
			}
		}else{
			paths.pop();
		}
	}
	location.href = paths.join('/')+'/';
}
function gotoRootDir(){
	var url = location.protocol + "//" + location.hostname;
	location.href = url;
}
function setMark(){
	pagemaker = {
		top: window.pageYOffset,
		left: window.pageXOffset
	};
}
function jumptoMark(){
	window.scrollTo(pagemaker.left,pagemaker.top);
}
function createNewTab(){
    chrome.runtime.sendMessage({tab:"newtab"});
}
function createNewTabBG(){
    chrome.runtime.sendMessage({tab:"newtabbg"});
}
function createNewWindow(){
    chrome.runtime.sendMessage({window:"newwindow"});
}
function closeWindow(){
    chrome.runtime.sendMessage({window:"close"});
}
function openURLCurrentTab(url){
    if(url.indexOf("javascript:") == 0){
	    chrome.runtime.sendMessage({ifrm:"comopen",url:url});
    }else{
	    chrome.runtime.sendMessage({open:"crnttab",url:url});
    }
}
function openURLNewTab(url){
    chrome.runtime.sendMessage({open:"newtab",url:url});
}
function openURLNewTabBG(url){
    chrome.runtime.sendMessage({open:"newtabbg",url:url});
}
function toggleOnOffMode(){
	if(keyconfig.on){
		keyconfig.on = false;
		showTextStatusBar("Keyboard Control Off");
	}else{
		keyconfig.on = true;
		document.body.focus()
		showTextStatusBar("Keyboard Control On");
	}
    chrome.runtime.sendMessage({check:"set",flg:keyconfig.on});
}
function createCommandBox(flg){
	var ifrm = document.getElementById("blinkexteinsion_commandbox_11923846598712349");
	if(!ifrm){
		commandiframeflag = true;
		var comboxifm = document.createElement("iframe");
		document.body.appendChild(comboxifm);
		comboxifm.style.zIndex = 0x7FFFFFFF;
		comboxifm.style.position = "fixed";
		comboxifm.style.margin = 0;
		comboxifm.style.padding = 0;
		comboxifm.style.width = "434px";
		if(flg){
			comboxifm.style.height = "100%";
		}else{
			comboxifm.style.height = "480px";
		}
		comboxifm.style.opacity = 1;
		comboxifm.setAttribute("seamless","");
		comboxifm.setAttribute("border",0);
		comboxifm.setAttribute("frameborder",0);
		comboxifm.setAttribute("src",chrome.extension.getURL('iframe.html'));
		comboxifm.setAttribute("id","blinkexteinsion_commandbox_11923846598712349");	
		if(keyconfig.cmdpos == "bl"){
			comboxifm.style.left = 0;
			comboxifm.style.bottom = 0;

		}else if(keyconfig.cmdpos == "br"){
			comboxifm.style.right = 0;
			comboxifm.style.bottom = 0;
		}
	}
}
function removeCommandBox(){
	var ifrm = document.getElementById("blinkexteinsion_commandbox_11923846598712349");
	if(ifrm){
		var prntnd = ifrm.parentNode;
		prntnd.removeChild(ifrm);
		commandiframeflag = false;
	}
}
function getNextLinkElement(nextflg){
	var clckflg = nextSearchResult(nextflg);
	if(!clckflg){
	    if(nextflg){
		    var nxids = keyconfig.nextstringsid;
		    if(nxids){
		    	nxids = nxids.split(",");
		    	for (var i = 0; i < nxids.length; i++) {
		    		var elemid = nxids[i];
		    		if(elemid){
					    elemid = elemid.replace(/^\s+|\s+$/g, "");
					    if(elemid){
				    		var nxelem = document.getElementById(elemid);
				    		if(nxelem){
				    			clickemu(nxelem);
				    			return;
				    		}else{
					    		var nxelem = document.getElementsByClassName(elemid);
					    		if(nxelem&&nxelem.length > 0){
					    			clickemu(nxelem[0]);
					    			return;
					    		}
				    		}
					    }
		    		}
		    	}
		    }
	    	if(!keyconfig.nextstrings){
	    		return;
	    	}
		    var nxtstrary = keyconfig.nextstrings.split(",");
	    }else{
		    var prids = keyconfig.prevstringsid;
		    if(prids){
		    	prids = prids.split(",");
		    	for (var i = 0; i < prids.length; i++) {
		    		var elemid = prids[i];
		    		if(elemid){
					    elemid = elemid.replace(/^\s+|\s+$/g, "");
					    if(elemid){
				    		var prelem = document.getElementById(elemid);
				    		if(prelem){
				    			clickemu(prelem);
				    			return;
				    		}else{
					    		var prelem = document.getElementsByClassName(elemid);
					    		if(prelem&&prelem.length > 0){
					    			clickemu(prelem[0]);
					    			return;
					    		}			    			
				    		}
				    	}
		    		}
		    	}
		    }
	    	if(!keyconfig.prevstrings){
	    		return;
	    	}
		    var nxtstrary = keyconfig.prevstrings.split(",");
	    }
		var qery = 'a, button, [onclick], [onmousedown], [onmouseup], [role="link"], [role="button"]';
	    var pelems = Array.prototype.slice.call(document.body.querySelectorAll(qery), 0);

	    for(var i = 0, l = pelems.length; i < l; i++){
	    	var el = pelems[i];
			var style = document.defaultView.getComputedStyle(el, "");
			if((style.display == "none")||(style.visibility == "hidden")){
				continue;
			}
			var rect = el.getClientRects()[0];
			if(rect){
				var elemtxt = el.textContent;
			    elemtxt = elemtxt.replace(/^\s+|\s+$/g, "");

			    for(var ii = 0, ll = nxtstrary.length; ii < ll; ii++){
			    	var rgstr = nxtstrary[ii];
			    	if(rgstr){
					    rgstr = rgstr.replace(/^\s+|\s+$/g, "");
						var rgex = new RegExp("^"+rgstr+"$",'i');
						if (elemtxt.match(rgex)) {
							clickemu(el);
							break;
						}
			    	}
			    }
			}				
	    }
	}
	function clickemu(elem){
		var types = ['mousedown','mouseup', 'click'];
		for ( var i = 0, l = types.length; i < l; i++){
			var clicker = new MouseEvent(types[i], {
			  'bubbles': true,
			  'cancelable': true,
			  'view': window,
			  'detail': 0,
			  'screenX': 0,
			  'screenY': 0,
			  'clientX': 0,
			  'clientY': 0,
			  'ctrlKey': false,
			  'altKey': false,
			  'shiftKey': false,
			  'metaKey': false,
			  'button': 0,
			  'relatedTarget': null
			});
			elem.dispatchEvent(clicker);
		}
	}
}
function keyEventObject(){
	var keyinputtimeid = null;
	var keyarray = [];
	var xval = 0,yval = 0,xadd = 0,yadd = 0;
	function addkeyevent(e){
		if(chrome&&chrome.tabs){
			window.addEventListener('keydown',pushKeyEvent, false);
		}else{
			window.addEventListener('keydown',pushKeyEvent, true);
		}
		window.addEventListener('keyup',resemvpointval, true);
	}
	function resemvpointval(e){
		xval = 1,yval = 1,xadd = 0,yadd = 0;
	}
	addkeyevent();
	resemvpointval();
	function pushKeyEvent(e){
		if(!ignoreallflag){
			if(e.keyCode === 16){
				return "";
			}else if(e.keyCode === 17){
				return "";
			}else if(e.keyCode === 18){
				return "";
			}
			var key = KeyParser(e);
			var txttoolflag = false;
			var firekey = false;
			var target = e.target,tagname = "";
			var multilink = false,mltlnkmv = false;
			if(hitahintstatkey === key.char)firekey = true;
			if(target.tagName)tagname = target.tagName.toLowerCase();
			if(commandiframeflag)removeCommandBox();
			if(!hintflag || linksnap.showflg){
				if(createEmulator.dshowflag&&!linksnap.showflg){
					txttoolflag = true;
					e.stopPropagation();
					e.preventDefault();
					if(key.char === "l"){
						createEmulator.setstatpos(true,true);
					}else if(key.char === "h"){
						createEmulator.setstatpos(true,false);
					}else if(key.char === "j"){
						createEmulator.checknextline();
					}else if(key.char === "k"){
						createEmulator.checknextline(true);
					}else if(key.char === "x"){
						createEmulator.rmstring();
					}else if(key.char === "Space"){
						createEmulator.mvpointer();
					}else if(key.char === "y"){
						createEmulator.toclipboard();
					}else if(key.char === "Enter"){
						createEmulator.search();
					}else if(key.char === "Esc"){
						createEmulator.closemode();
					}
					keyarray.length = 0;
					hintstring = "";
					return;				
				}else if(createEmulator.pshowflag || linksnap.showflg){
					txttoolflag = true;
					e.stopPropagation();
					e.preventDefault();
					if(key.char === "j"){
						var mobj = adjustmvpointval(yval,yadd);
						if(mobj.val !== yval){
							yval = mobj.val;
						}
						createEmulator.move(null,mobj.val);
						yadd = mobj.addval;
						mltlnkmv = true;
					}else if(key.char === "k"){
						var mobj = adjustmvpointval(yval,yadd);
						if(mobj.val !== yval){
							yval = mobj.val;
						}
						createEmulator.move(null,-mobj.val);
						yadd = mobj.addval;
						mltlnkmv = true;
					}else if(key.char === "h"){
						var mobj = adjustmvpointval(xval,xadd);
						if(mobj.val !== xval){
							xval = mobj.val;
						}
						createEmulator.move(-mobj.val,null);
						xadd = mobj.addval;
						mltlnkmv = true;
					}else if(key.char === "l"){
						var mobj = adjustmvpointval(xval,xadd);
						if(mobj.val !== xval){
							xval = mobj.val;
						}
						createEmulator.move(mobj.val,null);
						xadd = mobj.addval;
						mltlnkmv = true;
					}else if(key.char === "i"){
						createEmulator.clickelement(key.ctrl,key.meta,key.shift);
						mltlnkmv = true;
					}else if(key.char === "c"){
						mltlnkmv = true;
						mdown(document.getElementById("__cap_____cap________cap_mlobutto__c_mg"))
						createEmulator.closemode();	
					}else if(key.char === "s"){
						mltlnkmv = true;
						mdown(document.getElementById("__smt_____smt________smt_mlobutto__c_mg"))
					}else if(key.char === "Enter"){
						mltlnkmv = true;
			    		linksnap.clickHint(e);
						createEmulator.closemode();	
					}else if(key.char === "Space"){
						mltlnkmv = true;
						createEmulator.checkpoint();
					}else if(key.char === "Esc"){
						mltlnkmv = true;
						createEmulator.closemode();	
					}else{
						if(firekey){
							createEmulator.closemode();
							return;		
						}
					}
					if(linksnap.showflg){
						multilink = true;
					}
				}
			}

			if(key&&(key.char == "Esc")&&!txttoolflag&&!multilink){
				clearTimeout(keyinputtimeid);
				keyarray.length = 0;
				hintstring = "";
				clearHintObject();
				removeCommandBox();
				if(key.shift){
					e.stopPropagation();
					e.preventDefault();
					toggleOnOffMode();
				}
				removeHighlightWord();
			}else if((highlihtelemary.length > 0)&&(key)&&(key.char == "n")&&!txttoolflag&&!multilink){
				clearTimeout(keyinputtimeid);
				keyarray.length = 0;
				hintstring = "";
				clearHintObject();
				removeCommandBox();
				e.stopPropagation();
				e.preventDefault();
				if(key.shift){
					if(backwardsflag){
						checkNextHighlightWord();			
					}else{
						checkPreHighlightWord();
					}
				}else{
					if(backwardsflag){
						checkPreHighlightWord();
					}else{
						checkNextHighlightWord();			
					}
				}
			}else if (((!target.isContentEditable)&&(tagname != 'textarea' )&&(tagname != 'input' )&&(tagname != 'select'))||(e.ctrlKey)||(e.altKey)){
				if(hintflag){
					e.stopPropagation();
					e.preventDefault();
				}
				if(key){
					keyarray.push(key);
					var rflg = checkOptionAction(e,keyarray,txttoolflag,firekey,multilink);
					if(rflg == "nomap"){
						clearTimeout(keyinputtimeid);
						keyarray.length = 0;
					}else if(rflg == "hint"){
						clearTimeout(keyinputtimeid);
						keyarray.length = 0;
						checkHintInput(e,key.char,true,txttoolflag,multilink,mltlnkmv);
					}else if(rflg == true){
						clearTimeout(keyinputtimeid);
						keyarray.length = 0;
					}else if(hintflag){
						clearTimeout(keyinputtimeid);
						keyarray.length = 0;
						checkHintInput(e,key.char,false,txttoolflag,multilink,mltlnkmv);
					}else{
						clearTimeout(keyinputtimeid);
						keyinputtimeid = setTimeout(function(){
							if(checkOptionAction(e,keyarray,txttoolflag,firekey,multilink,mltlnkmv) == "hint"){
								checkHintInput(e,key.char,true,txttoolflag,multilink);
							}
							keyarray.length = 0;
						},keyconfig.kinpttime);						
					}
				}else{
					hintstring = "";
				}
			}
		}
	}
	function mdown(elem){
		var clicker = new MouseEvent('mousedown', {
		  'bubbles': true,
		  'cancelable': true,
		  'view': window,
		  'detail': 0,
		  'screenX': 0,
		  'screenY': 0,
		  'clientX': 0,
		  'clientY': 0,
		  'ctrlKey': false,
		  'altKey': false,
		  'shiftKey': false,
		  'metaKey': false,
		  'button': 0,
		  'relatedTarget': null
		});
		elem.dispatchEvent(clicker);
	}
	function checkHintInput(e,char,flg,txttoolflag,multilink,mltlnkmv){
		if(mltlnkmv)return;
		if(hintflag&&keyconfig.on&&!txttoolflag || multilink){
			clearTimeout(keyinputtimeid);
			keyarray.length = 0;
			if(("BackSpace" == char)||("Delete" == char)){
				hintstring = hintstring.slice(0, -1);
				if(hintstring.length == 0)clearHintObject();
			}else{
				if((!flg)&&(char.length == 1)){
					hintstring += char;
				}else if(flg){
					hintstring = "";
				}
			}
			hilightHints(hintstring,e,multilink);
		}else{
			hintstring = "";
		}
	}
	function checkOptionAction(e,keyary,txttoolflag,firekey,multilink){
		if(txttoolflag || multilink)return
		var opnurl = "",optkeyaryidx = null,flgary = {};
		if(keyconfig.on){
			if(!hintflag || firekey){
				if(keyconfig.nomap&&(checkOptionArray(flgary,e,keyary,keyconfig.nomap,true))){
					showTextStatusBar("IGNORE KEY")
					return "nomap";
				}else if(keyconfig.drawhint&&(checkOptionArray(flgary,e,keyary,keyconfig.drawhint))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("drawhint");						
						drawHints(false,null);
					}
					return "hint";
				}else if(keyconfig.drawhintn&&(checkOptionArray(flgary,e,keyary,keyconfig.drawhintn))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("drawhintn");						
						drawHints(true,true);
					}
					return "hint";
				}else if(keyconfig.drawhintnb&&(checkOptionArray(flgary,e,keyary,keyconfig.drawhintnb))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("drawhintnb");						
						drawHints(true,false);
					}
					return "hint";
				}else if(keyconfig.sendurltoweb&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.sendurltoweb))&&(opnurl)){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("sendurltoweb");						
						drawHints(false,true,opnurl);
					}
					return "hint";
				}else if(keyconfig.sendurltowebnewtab&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.sendurltowebnewtab))&&(opnurl)){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("sendurltowebnewtab");						
						drawHints(true,true,opnurl);
					}
					return "hint";
				}else if(keyconfig.sendurltowebbgtab&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.sendurltowebbgtab))&&(opnurl)){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("sendurltowebbgtab");						
						drawHints(true,false,opnurl);
					}
					return "hint";

				}else if(keyconfig.sendurltowebcontinuous&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.sendurltowebcontinuous))&&(opnurl)){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("sendurltowebcontinuous");						
						drawHints(true,false,opnurl,true);
					}
					return "hint";
				}else if(keyconfig.getlinkttl&&(checkOptionArray(flgary,e,keyary,keyconfig.getlinkttl))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("getlinkttl");						
						drawHints(false,false,null,false,"ttl");
					}
					return "hint";
				}else if(keyconfig.getlinkurl&&(checkOptionArray(flgary,e,keyary,keyconfig.getlinkurl))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("getlinkurl");						
						drawHints(false,false,null,false,"url");
					}
					return "hint";
				}else if(keyconfig.getlinkurlttl&&(checkOptionArray(flgary,e,keyary,keyconfig.getlinkurlttl))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("getlinkurlttl");						
						drawHints(false,false,null,false,"urlttl");
					}
					return "hint";
				}else if(keyconfig.getlinkurlttlhtml&&(checkOptionArray(flgary,e,keyary,keyconfig.getlinkurlttlhtml))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("getlinkurlttlhtml");						
						drawHints(false,false,null,false,"urlttlhtml");
					}
					return "hint";
				}else if(keyconfig.imgveiwtab&&(checkOptionArray(flgary,e,keyary,keyconfig.imgveiwtab))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("imgveiwtab");						
						drawHints(false,true,null,null,null,"view");
					}
					return "hint";
				}else if(keyconfig.imgveiwtbg&&(checkOptionArray(flgary,e,keyary,keyconfig.imgveiwtbg))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("imgveiwtbg");						
						drawHints(false,false,null,null,null,"view");
					}
					return "hint";
				}else if(keyconfig.imgsave&&(checkOptionArray(flgary,e,keyary,keyconfig.imgsave))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("imgsave");						
						drawHints(false,false,null,null,null,"save");
					}
					return "hint";
				}else if(keyconfig.imgsaveas&&(checkOptionArray(flgary,e,keyary,keyconfig.imgsaveas))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("imgsaveas");						
						drawHints(false,true,null,null,null,"save");
					}
					return "hint";
				}else if(keyconfig.imgsearch&&(checkOptionArray(flgary,e,keyary,keyconfig.imgsearch))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("imgsearch");						
						drawHints(false,true,null,null,null,"search");
					}
					return "hint";
				}else if(keyconfig.imgurlcopy&&(checkOptionArray(flgary,e,keyary,keyconfig.imgurlcopy))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("imgurlcopy");						
						drawHints(false,false,null,null,null,"copyurl");
					}
					return "hint";		
				}else if(keyconfig.hitahinttext&&(checkOptionArray(flgary,e,keyary,keyconfig.hitahinttext))){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("hitahinttext");						
						createTextNodeHintSpan();
					}
					return "hint";	
				}else if(keyconfig.hitahinttexturl&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.hitahinttexturl))&&(opnurl)){
					if(hintflag){
						clearHintObject();
					}else{
						removeHintChar("hitahinttexturl");						
						createTextNodeHintSpan(opnurl);
					}
					return "hint";
				}
				if(!hintflag){
					if(keyconfig.scrldown&&(checkOptionArray(flgary,e,keyary,keyconfig.scrldown))){
						setScrollPosition(0,keyconfig.scrval);
						showTextStatusBar("Scroll Down");
						return true;
					}else if(keyconfig.scrlup&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlup))){
						setScrollPosition(0,keyconfig.scrval*-1);
						showTextStatusBar("Scroll Up");
						return true;
					}else if(keyconfig.scrlleft&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlleft))){
						setScrollPosition(keyconfig.scrval*-1,0);
						showTextStatusBar("Scroll Left");
						return true;
					}else if(keyconfig.scrlright&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlright))){
						setScrollPosition(keyconfig.scrval,0);
						showTextStatusBar("Scroll Right");
						return true;
					}else if(keyconfig.scrlhdown&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlhdown))){
						setScrollPosition(0,window.innerHeight/2);
						showTextStatusBar("Scroll Down Half Page");
						return true;
					}else if(keyconfig.scrlhup&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlhup))){
						setScrollPosition(0,-window.innerHeight/2);
						showTextStatusBar("Scroll Up Half Page");
						return true;
					}else if(keyconfig.scrlfdown&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlfdown))){
						setScrollPosition(0,window.innerHeight);
						showTextStatusBar("Scroll Down Full Page");
						return true;
					}else if(keyconfig.scrlfup&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlfup))){
						setScrollPosition(0,-window.innerHeight);
						showTextStatusBar("Scroll Up Full Page");
						return true;
					}else if(keyconfig.scrltop&&(checkOptionArray(flgary,e,keyary,keyconfig.scrltop))){
				        var prnt = window.parent,cwnd = window,doc = document;
						for (var i = 0; i < 10; i++) {
							if(cwnd === prnt){
					        	doc = cwnd.document;
					        	break;
							}
							cwnd = cwnd.parent.window;
							prnt = cwnd.parent.parent.window.parent;
						};
						var heigh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
						var width = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] );
				        setScrollPosition(0,-heigh,"top");
				        showTextStatusBar("Scroll to Top");
						return true;
					}else if(keyconfig.scrlbottom&&(checkOptionArray(flgary,e,keyary,keyconfig.scrlbottom))){
				        var prnt = window.parent,cwnd = window,doc = document;
						for (var i = 0; i < 10; i++) {
							if(cwnd === prnt){
					        	doc = cwnd.document;
					        	break;
							}
							cwnd = cwnd.parent.window;
							prnt = cwnd.parent.parent.window.parent;
						};
						var heigh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
						var width = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] );
				        setScrollPosition(0,heigh,"bottom");
				        showTextStatusBar("Scroll to Bottom");
						return true;
					}else if(keyconfig.capfull&&(checkOptionArray(flgary,e,keyary,keyconfig.capfull))){
						startCapture("full");
						return true;
					}else if(keyconfig.capsfull&&(checkOptionArray(flgary,e,keyary,keyconfig.capsfull))){
						startCapture("full",true);
						return true;
					}else if(keyconfig.caphalf&&(checkOptionArray(flgary,e,keyary,keyconfig.caphalf))){
						startCapture("half");
						return true;
					}else if(keyconfig.capshalf&&(checkOptionArray(flgary,e,keyary,keyconfig.capshalf))){
						startCapture("half",true);
						return true;
					}else if(keyconfig.reload&&(checkOptionArray(flgary,e,keyary,keyconfig.reload))){
						reloadCurrentTab();
						showTextStatusBar("Reload");
						return true;
					}else if(keyconfig.superreload&&(checkOptionArray(flgary,e,keyary,keyconfig.superreload))){
						superReloadCurrentTab();
						showTextStatusBar("Super Reload");
						return true;
					}else if(keyconfig.reloadall&&(checkOptionArray(flgary,e,keyary,keyconfig.reloadall))){
						reloadAlltabs();
						showTextStatusBar("Reload All Tabs");
						return true;
					}else if(keyconfig.stopload&&(checkOptionArray(flgary,e,keyary,keyconfig.stopload))){
	    	    	    window.stop();
						showTextStatusBar("Stop Load");
						return true;
					}else if(keyconfig.stopall&&(checkOptionArray(flgary,e,keyary,keyconfig.stopall))){
	    	    		chrome.runtime.sendMessage({contentscr: "stopall",mode:"stopall"});
						showTextStatusBar("Stop All Tabs");
						return true;
					}else if(keyconfig.autofocuskey&&(checkOptionArray(flgary,e,keyary,keyconfig.autofocuskey))){
						focusFirstInput();
						showTextStatusBar("Focus First Input");
						return true;
					}else if(keyconfig.blurelem&&(checkOptionArray(flgary,e,keyary,keyconfig.blurelem))){
						blurFocusActiveElement();
						showTextStatusBar("Blur Focus");
						return true;
					}else if(keyconfig.nexteditelem&&(checkOptionArray(flgary,e,keyary,keyconfig.nexteditelem))){
						changeFocusEditableElement(true);
						return true;
					}else if(keyconfig.preeditelem&&(checkOptionArray(flgary,e,keyary,keyconfig.preeditelem))){
						changeFocusEditableElement(false);
						return true;
					}else if(keyconfig.curltoclip&&(checkOptionArray(flgary,e,keyary,keyconfig.curltoclip))){
						currentURLtoClipboard();
						showTextStatusBar("Copy URL to Clipboard");
						return true;
					}else if(keyconfig.curltttltoclip&&(checkOptionArray(flgary,e,keyary,keyconfig.curltttltoclip))){
						currentURLTITLEtoClipboard();
						showTextStatusBar("Copy URL+Title to Clipboard");					
						return true;
					}else if(keyconfig.curltttlatagtoclip&&(checkOptionArray(flgary,e,keyary,keyconfig.curltttlatagtoclip))){
						currentAtagtoClipboard();
						showTextStatusBar("Copy URL+Title as A tag");					
						return true;
					}else if(keyconfig.shorttoclip&&(checkOptionArray(flgary,e,keyary,keyconfig.shorttoclip))){
						currentShorttoClipboard();
						showTextStatusBar("Shorten URL to Clipboard");
						return true;
					}else if(keyconfig.backhistory&&(checkOptionArray(flgary,e,keyary,keyconfig.backhistory))){
						backHistory();
						showTextStatusBar("Back History");
						return true;
					}else if(keyconfig.forwardhistory&&(checkOptionArray(flgary,e,keyary,keyconfig.forwardhistory))){
						forwardHistory();
						showTextStatusBar("Forward History");
						return true;
					}else if(keyconfig.closectab&&(checkOptionArray(flgary,e,keyary,keyconfig.closectab))){
						closeCurrentTab();				
						return true;
					}else if(keyconfig.closeothertabs&&(checkOptionArray(flgary,e,keyary,keyconfig.closeothertabs))){
						closeOtherTabs();
						showTextStatusBar("Close Other Tabs");
						return true;
					}else if(keyconfig.closertabs&&(checkOptionArray(flgary,e,keyary,keyconfig.closertabs))){
						closeRightTabs();
						showTextStatusBar("Close Right Tabs");
						return true;
					}else if(keyconfig.closeltabs&&(checkOptionArray(flgary,e,keyary,keyconfig.closeltabs))){
						closeLeftTabs();
						showTextStatusBar("Close Left Tabs");
						return true;
					}else if(keyconfig.pinunpintab&&(checkOptionArray(flgary,e,keyary,keyconfig.pinunpintab))){
						pinUnpinTab();
						showTextStatusBar("Pin/Unpin Tabs");
						return true;
					}else if(keyconfig.selectrtab&&(checkOptionArray(flgary,e,keyary,keyconfig.selectrtab))){
						selectRighttab();
						showTextStatusBar("Next Tab");
						return true;
					}else if(keyconfig.selectltab&&(checkOptionArray(flgary,e,keyary,keyconfig.selectltab))){
						selectLeftTab();
						showTextStatusBar("Previous Tab");
						return true;
					}else if(keyconfig.selectfirst&&(checkOptionArray(flgary,e,keyary,keyconfig.selectfirst))){
						selectFirstTab();
						showTextStatusBar("First Tab");
						return true;
					}else if(keyconfig.selectlast&&(checkOptionArray(flgary,e,keyary,keyconfig.selectlast))){
						selectLastTab();
						showTextStatusBar("Last Tab");
						return true;
					}else if(keyconfig.restoretab&&(checkOptionArray(flgary,e,keyary,keyconfig.restoretab))){
						restoreTab();
						showTextStatusBar("Restore Tab");
						return true;
					}else if(keyconfig.clonetab&&(checkOptionArray(flgary,e,keyary,keyconfig.clonetab))){
						cloneTab();
						showTextStatusBar("Clone Tab");
						return true;
					}else if(keyconfig.gotoprntdir&&(checkOptionArray(flgary,e,keyary,keyconfig.gotoprntdir))){
						gotoParentDir();
						showTextStatusBar("Go to Parent DIR");
						return true;
					}else if(keyconfig.createnewtab&&(checkOptionArray(flgary,e,keyary,keyconfig.createnewtab))){
						createNewTab();
						showTextStatusBar("Create New Tab");
						return true;
					}else if(keyconfig.createnewtabb&&(checkOptionArray(flgary,e,keyary,keyconfig.createnewtabb))){
						createNewTabBG();
						showTextStatusBar("Create New Tab Background");
						return true;
					}else if(keyconfig.createnewwindow&&(checkOptionArray(flgary,e,keyary,keyconfig.createnewwindow))){
						createNewWindow();
						showTextStatusBar("Create New Window");
						return true;
					}else if(keyconfig.closewindow&&(checkOptionArray(flgary,e,keyary,keyconfig.closewindow))){
						closeWindow();
						showTextStatusBar("Close Window");
						return true;
					}else if(keyconfig.openurlcrnt&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.openurlcrnt))&&(opnurl)){
						openURLCurrentTab(opnurl);
						showTextStatusBar("Open URL");
						return true;	
					}else if(keyconfig.openurlnewtab&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.openurlnewtab))&&(opnurl)){
						openURLNewTab(opnurl);
						showTextStatusBar("Open URL in New Tab");
						return true;
					}else if(keyconfig.openurlnewtabbg&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.openurlnewtabbg))&&(opnurl)){
						openURLNewTabBG(opnurl);
						showTextStatusBar("Open URL in New Tab Background");
						return true;
					}else if(keyconfig.searchweb&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.searchweb))&&(opnurl)){
						chrome.runtime.sendMessage({contentscr: "searchweb", searchurl: opnurl,mode:"searchweb"});
						createCommandBox();
						return true;
					}else if(keyconfig.searchwebcrnt&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.searchwebcrnt))&&(opnurl)){
						chrome.runtime.sendMessage({contentscr: "searchwebcrnt", searchurl: opnurl,mode:"searchwebcrnt"});
						createCommandBox();
						return true;
					}else if(keyconfig.openbookmarkcrnt&&(checkOptionArray(flgary,e,keyary,keyconfig.openbookmarkcrnt))){
						chrome.runtime.sendMessage({contentscr: "bookmarkcrnt",mode:"bookmarkcrnt"});
						createCommandBox(true);
						return true;
					}else if(keyconfig.openbookmark&&(checkOptionArray(flgary,e,keyary,keyconfig.openbookmark))){
						chrome.runtime.sendMessage({contentscr: "bookmarknew",mode:"bookmarknew"});
						createCommandBox(true);
						return true;
					}else if(keyconfig.openhistorycrnt&&(checkOptionArray(flgary,e,keyary,keyconfig.openhistorycrnt))){
						chrome.runtime.sendMessage({contentscr: "historycrnt",mode:"historycrnt"});
						createCommandBox(true);
						return true;
					}else if(keyconfig.openhistory&&(checkOptionArray(flgary,e,keyary,keyconfig.openhistory))){
						chrome.runtime.sendMessage({contentscr: "historynew",mode:"historynew"});
						createCommandBox(true);
						return true;
					}else if(keyconfig.opentablist&&(checkOptionArray(flgary,e,keyary,keyconfig.opentablist))){
						chrome.runtime.sendMessage({contentscr: "tablistcrnt",mode:"tablistcrnt"});
						createCommandBox(true);
						return true;
					}else if(keyconfig.linklabelnext&&(checkOptionArray(flgary,e,keyary,keyconfig.linklabelnext))){
						getNextLinkElement(true);
						return true;
					}else if(keyconfig.linklabelprev&&(checkOptionArray(flgary,e,keyary,keyconfig.linklabelprev))){
						getNextLinkElement(false);
						return true;
					}else if(keyconfig.searchtextii&&(checkOptionArray(flgary,e,keyary,keyconfig.searchtextii))){
						backwardsflag = false;
						chrome.runtime.sendMessage({contentscr: "searchtextii",mode:"searchtextii"});
						createCommandBox();
						removeHighlightWord();
						return true;
					}else if(keyconfig.searchtextip&&(checkOptionArray(flgary,e,keyary,keyconfig.searchtextip))){
						backwardsflag = true;
						chrome.runtime.sendMessage({contentscr: "searchtextip",mode:"searchtextip"});
						createCommandBox();
						removeHighlightWord();
						return true;
					}else if(keyconfig.createmhtml&&(checkOptionArray(flgary,e,keyary,keyconfig.createmhtml))){
						chrome.runtime.sendMessage({mhtml: "on"});
						return true;
					}else if(keyconfig.storetabs&&(checkOptionArray(flgary,e,keyary,keyconfig.storetabs))){
						chrome.runtime.sendMessage({contentscr: "storetabs",mode:"storetabs"});
						createCommandBox();
						return true;
					}else if(keyconfig.focusnextwindow&&(checkOptionArray(flgary,e,keyary,keyconfig.focusnextwindow))){
						chrome.runtime.sendMessage({contentscr: "focusnwind",mode:"focusnwind"});
						return true;
					}else if(keyconfig.gotoroot&&(checkOptionArray(flgary,e,keyary,keyconfig.gotoroot))){
						gotoRootDir();
						showTextStatusBar("Go to Root");
						return true;
					}else if(keyconfig.setmark&&(checkOptionArray(flgary,e,keyary,keyconfig.setmark))){
						setMark();
						showTextStatusBar("set mark");
						return true;
					}else if(keyconfig.jumpmark&&(checkOptionArray(flgary,e,keyary,keyconfig.jumpmark))){
						jumptoMark();
						showTextStatusBar("jump to mark");
						return true;
					}else if(keyconfig.splitwindv&&(checkOptionArray(flgary,e,keyary,keyconfig.splitwindv))){
						chrome.runtime.sendMessage({contentscr: "slpitv",mode:"slpitv"});
						return true;
					}else if(keyconfig.splitwindh&&(checkOptionArray(flgary,e,keyary,keyconfig.splitwindh))){
						chrome.runtime.sendMessage({contentscr: "slpith",mode:"slpith"});
						return true;
					}else if(keyconfig.commandmode&&(checkOptionArray(flgary,e,keyary,keyconfig.commandmode))){
						chrome.runtime.sendMessage({contentscr: "commandmode",mode:"commandmode"});
						createCommandBox();
						return true;
					}else if(keyconfig.scriptlist&&(checkOptionArray(flgary,e,keyary,keyconfig.scriptlist))){
						chrome.runtime.sendMessage({contentscr: "scriptlist",mode:"scriptlist"});
						createCommandBox(true);
						return true;
					}else if(keyconfig.openoptpage&&(checkOptionArray(flgary,e,keyary,keyconfig.openoptpage))){
						chrome.runtime.sendMessage({contentscr: "openoptpage",mode:"openoptpage"});
						return true;
					}else if(keyconfig.sorttabtitle&&(checkOptionArray(flgary,e,keyary,keyconfig.sorttabtitle))){
						chrome.runtime.sendMessage({contentscr: "sorttabtitle",mode:"sorttabtitle"});
						return true;
					}else if(keyconfig.sorttaburl&&(checkOptionArray(flgary,e,keyary,keyconfig.sorttaburl))){
						chrome.runtime.sendMessage({contentscr: "sorttaburl",mode:"sorttaburl"});
						return true;
					}else if(keyconfig.sorttabindex&&(checkOptionArray(flgary,e,keyary,keyconfig.sorttabindex))){
						chrome.runtime.sendMessage({contentscr: "sorttabindex",mode:"sorttabindex"});
						return true;
					}else if(keyconfig.crnt2lsttab&&(checkOptionArray(flgary,e,keyary,keyconfig.crnt2lsttab))){
						chrome.runtime.sendMessage({contentscr: "crnt2lsttab"});
						return true;
					}else if(keyconfig.movetableft&&(checkOptionArray(flgary,e,keyary,keyconfig.movetableft))){
						chrome.runtime.sendMessage({contentscr: "movetableft"});
						return true;
					}else if(keyconfig.movetabright&&(checkOptionArray(flgary,e,keyary,keyconfig.movetabright))){
						chrome.runtime.sendMessage({contentscr: "movetabright"});
						return true;
					}else if(keyconfig.extensionmanager&&(optkeyaryidx = checkOptionArray(flgary,e,keyary,keyconfig.extensionmanager,null,true))){
						chrome.runtime.sendMessage({contentscr: "extensionmanager",idx:optkeyaryidx.i});
						return true;
					}else if(keyconfig.addbookmark&&(checkOptionArray(flgary,e,keyary,keyconfig.addbookmark))){
						showTextStatusBar("bookmark current tab");
		                chrome.runtime.sendMessage({msg: "addbookmark",all:false});
						return true;
					}else if(keyconfig.addallbookmark&&(checkOptionArray(flgary,e,keyary,keyconfig.addallbookmark))){
						showTextStatusBar("bookmark all tabs");
		                chrome.runtime.sendMessage({msg: "addbookmark",all:true});
						return true;
					}else if(keyconfig.opendlfolder&&(checkOptionArray(flgary,e,keyary,keyconfig.opendlfolder))){
						showTextStatusBar("open download folder");
		                chrome.runtime.sendMessage({msg: "opendlfolder"});
						return true;
					}else if(keyconfig.openreurlcrnt&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.openreurlcrnt))&&(opnurl)){
					    chrome.runtime.sendMessage({open:"crnttab",url:opnurl+location.href});
						showTextStatusBar("current URL to web service");
						return true;
					}else if(keyconfig.openreurlnewtab&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.openreurlnewtab))&&(opnurl)){
					    chrome.runtime.sendMessage({open:"newtab",url:opnurl+location.href});
						showTextStatusBar("current URL to web service");
						return true;
					}else if(keyconfig.openreurlnewtabbg&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.openreurlnewtabbg))&&(opnurl)){
					    chrome.runtime.sendMessage({open:"newtabbg",url:opnurl+location.href});
						showTextStatusBar("current URL to web service");
						return true;
					}
				}
			}
			if(!hintflag){
				if(keyconfig.texttool&&(checkOptionArray(flgary,e,keyary,keyconfig.texttool))){
					removeHintChar("texttool")
					createEmulator.statpointer();
					return true;
				}else if(keyconfig.multilink&&(checkOptionArray(flgary,e,keyary,keyconfig.multilink))){
					removeHintChar("multilink")
					createEmulator.statpointer(null,null,true);
					return true;
				}else if(keyconfig.texttoolurl&&(opnurl = checkOptionArray(flgary,e,keyary,keyconfig.texttoolurl))&&(opnurl)){
					removeHintChar("texttoolurl")
					createEmulator.statpointer(null,opnurl);
					return true;
				}
			}
			if(!hintflag&&!flgary.ok){
				return true;
			}
		}
		return false;
	}
	function checkOptionArray(flgary,e,keyary,optobjary,nopreventflg,indxflg){
		var flg = false;
		if(optobjary&&keyary){
			for(var i = 0,len = optobjary.length; i < len; i++){
				flg = false;
				var optary = optobjary[i];
				if(optary){
					for(var ii = 0,len2 = optary.length; ii < len2; ii++){
						var optkey = optary[ii];
						var key = keyary[ii];
						if(optkey&&key&&(optkey.char == key.char)&&(optkey.ctrl == key.ctrl)&&(optkey.meta == key.meta)&&(optkey.shift == key.shift)){
							flgary.ok = true;
							if(!nopreventflg){
								e.stopPropagation();
								e.preventDefault();
							}else{
								if(!exceptURLList([optkey.url])){
									flg = false;
									break;
								}
							}
							if(optkey.url){
								flg = optkey.url;
							}else{
								flg = true;
							}
						}else{
							flg = false;
							break;
						}
					}
					if(flg){
						if(indxflg){
							var ridxobj = {};
							ridxobj.i = i;
							flg = ridxobj;
						}
						return flg;
					}
				}
			}
		}
		return flg;
	}
	function adjustmvpointval(val,addval){
		var mobj = {};
		var msp = mvspeedval;
		if(val < 2){
			if(addval === 0){
				addval = 1;
				val += 3;
			}else{
				addval = 0;
			}			
		}else if(val < (36-msp*2)){
			if(addval === 0){
				addval = 1;
				if(msp > 9){
					val += 7;
				}else if(msp > 8){
					val += 7;
				}else if(msp > 7){
					val += 6;
				}else if(msp > 6){
					val += 6;
				}else if(msp > 5){
					val += 5;
				}else if(msp > 3){
					val += 4;
				}else if(msp > 2){
					val += 3;
				}else if(msp > 1){
					val += 2;
				}else{
					val += 1;
				}
			}else{
				addval = 0;
			}
		}else if(val < (72-msp*2)){
			addval = 1;
			if(msp > 9){
				val += 7;
			}else if(msp > 8){
				val += 7;
			}else if(msp > 7){
				val += 6;
			}else if(msp > 6){
				val += 6;
			}else if(msp > 5){
				val += 5;
			}else if(msp > 3){
				val += 4;
			}else if(msp > 2){
				val += 3;
			}else if(msp > 1){
				val += 2;
			}else{
				val += 1;
			}
		}else if(val < 108){
			addval = 1;
			val += addval*msp;
		}
		mobj.val = val;
		mobj.addval = addval;			
		return mobj;
	}
	function KeyParser(evt){
		var keyId = {
			"U+0008": "BackSpace",
			"U+0009": "Tab",
			"U+0018": "Cancel",
			"U+001B": "Esc",
			"U+0020": "Space",
			"U+0021": "!",
			"U+0022": "\"",
			"U+0023": "#",
			"U+0024": "$",
			"U+0026": "&",
			"U+0027": "'",
			"U+0028": "(",
			"U+0029": ")",
			"U+002A": "*",
			"U+002B": "+",
			"U+002C": ",",
			"U+002D": "-",
			"U+002E": ".",
			"U+002F": "/",
			"U+0030": "0",
			"U+0031": "1",
			"U+0032": "2",
			"U+0033": "3",
			"U+0034": "4",
			"U+0035": "5",
			"U+0036": "6",
			"U+0037": "7",
			"U+0038": "8",
			"U+0039": "9",
			"U+003A": ":",
			"U+003B": ";",
			"U+003C": "<",
			"U+003D": "=",
			"U+003E": ">",
			"U+003F": "?",
			"U+0040": "@",
			"U+0041": "a",
			"U+0042": "b",
			"U+0043": "c",
			"U+0044": "d",
			"U+0045": "e",
			"U+0046": "f",
			"U+0047": "g",
			"U+0048": "h",
			"U+0049": "i",
			"U+004A": "j",
			"U+004B": "k",
			"U+004C": "l",
			"U+004D": "m",
			"U+004E": "n",
			"U+004F": "o",
			"U+0050": "p",
			"U+0051": "q",
			"U+0052": "r",
			"U+0053": "s",
			"U+0054": "t",
			"U+0055": "u",
			"U+0056": "v",
			"U+0057": "w",
			"U+0058": "x",
			"U+0059": "y",
			"U+005A": "z",
			"U+005B": "[",
			"U+005C": "\\",
			"U+005D": "]",
			"U+005E": "^",
			"U+005F": "_",
			"U+0060": "`",
			"U+007B": "{",
			"U+007C": "|",
			"U+007D": "}",
			"U+007F": "Delete"
		};
		var winkeys = {
			"U+00BC": ",",
			"U+00BE": ".",
			"U+00BF": "/",
			"U+00E2": "\\",
			"U+00BB": ";",
			"U+00BA": ":",
			"U+00DD": "]",
			"U+00C0": "@",
			"U+00DB": "[",
			"U+00BD": "-",
			"U+00DE": "^",
			"U+00DC": "\\"
		};
		var shiftWinkeys = {
			"U+0031": "!",
			"U+0032": "\"",
			"U+0033": "#",
			"U+0034": "$",
			"U+0035": "%",
			"U+0036": "&",
			"U+0037": "'",
			"U+0038": "(",
			"U+0039": ")",
			"U+00BA": "*",
			"U+00BB": "+",
			"U+00BC": "<",
			"U+00BD": "=",
			"U+00BE": ">",
			"U+00BF": "?",
			"U+00C0": "`",
			"U+00DB": "{",
			"U+00DC": "|",
			"U+00DD": "}",
			"U+00DE": "~",
			"U+00E2": "_"
		};
		var shiftLinuxkeys = {
			"U+0030": ")",
			"U+0031": "!",
			"U+0033": "#",
			"U+0034": "$",
			"U+0035": "%",
			"U+0037": "&",
			"U+0038": "*",
			"U+0039": "(",
			"U+00BB": "+",
			"U+00BC": "<",
			"U+00BD": "_",
			"U+00BE": ">",
			"U+00BF": "?",
			"U+00C0": "~",
			"U+00DB": "{",
			"U+00DC": "|",
			"U+00DD": "}",
			"U+00DE": "\""
		};
		var key = {};
		key.ctrl = evt.ctrlKey ? true : false,
		key.meta = (evt.metaKey || evt.altKey) ? true : false,
		key.shift = evt.shiftKey ? true : false;
		if(evt.key){
		    // if (/^(Meta|Shift|Control|Alt)$/.test(key.code)) return "";
			key.char = evt.key.toLowerCase();
		    if (/^(Backspace)$/.test(evt.code)) key.char = "BackSpace";
		    if (/^(Tab)$/.test(evt.code)) key.char = "Tab";
		    if (/^(Esc)$/.test(evt.code)) key.char = "Esc";
		    if (/^(Space)$/.test(evt.code)) key.char = "Space";
		    if (/^(Escape)$/.test(evt.code)) key.char = "Esc";
		    if (/^(Delete)$/.test(evt.code)) key.char = "Delete";
		    if (/^(Enter)$/.test(evt.code)) key.char = "Enter";
		    if (/^(Home)$/.test(evt.code)) key.char = "Home";
		    if (/^(End)$/.test(evt.code)) key.char = "End";
		    if (/^(ArrowLeft)$/.test(evt.code)) key.char = "Left";
		    if (/^(ArrowRight)$/.test(evt.code)) key.char = "Right";
		    if (/^(ArrowUp)$/.test(evt.code)) key.char = "Up";
		    if (/^(ArrowDown)$/.test(evt.code)) key.char = "Down";
		    if (/^(PageUp)$/.test(evt.code)) key.char = "PageUp";
		    if (/^(F\d\d?)$/.test(evt.code)) key.char = evt.code;
		}else{
			var shiftKeysfix = /linux/i.test(navigator.platform) ? shiftLinuxkeys : shiftWinkeys;
			key.char = keyId[evt.keyIdentifier] || winkeys[evt.keyIdentifier] || evt.keyIdentifier;
		    if (evt.shiftKey && shiftKeysfix[evt.keyIdentifier]) key.char = shiftKeysfix[evt.keyIdentifier];
		    if (/^(Meta|Shift|Control|Alt)$/.test(key.char)) return "";
		}
		return key;
	}
}
var createEmulator = {
	top:0,
	left:0,
	pointer:null,
	dialogflagtxtlen:0,
	dialogtxtstatpos:0,
	dialogtxtendpos:0,
	dialogtxtendflag:false,
	dialogcloseflag:false,
	pshowflag:false,
	dshowflag:false,
	searchurl:"",
	multilink:false,

	init:function(){
		this.create();
		this.createdialog();
		this.createwrap();
	},
	createwrap:function(){
		var that = this;
		var cntelem = document.createElement("div");
		document.body.appendChild(cntelem);
		cntelem.style.display = "none";
		cntelem.style.position = "absolute";
		cntelem.style.left = 0;
		cntelem.style.top = 0;
		cntelem.style.width = 0;
		cntelem.style.zIndex = 0x7FFFFFFF;
		cntelem.setAttribute("id","_blink_keybord_extension_________wrap___");
		cntelem.style.background = "rgba(0,0,0,.04)";
		cntelem.style.height = 0;
		cntelem.addEventListener("click",function(){
			that.closemode();
		},false);
		linksnap.init(cntelem);
		histobject.init(cntelem);
    },
	createdialog:function(){
		var that = this;
		var dialog = document.createElement("dialog");
		document.body.appendChild(dialog);
		dialog.setAttribute("id","_blink_keybord_extension_________dialog");
		dialog.addEventListener("click",function(){
			document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
			this.close();
		},false);
		dialog.addEventListener("close",function(){
			that.dshowflag = false;
			that.pshowflag = false;
			that.hidepointer();
			that.resetval();
		});
		dialog.style.border = "1px solid rgba(0, 0, 0, 0.3)";
		dialog.style.boxShadow = "0 3px 7px rgba(0, 0, 0, 0.4)";
		dialog.style.padding = 0;

		var maincontainer = document.createElement("div");
		maincontainer.setAttribute("id","_blink_keybord_extension_________dialog_maincontainer_maininfo_");
		dialog.appendChild(maincontainer);
		maincontainer.style.display = "none";

		var maininfo = document.createElement("div");
		maininfo.setAttribute("id","_blink_keybord_extension_________dialog_textcontainer_maininfo_");
		maincontainer.appendChild(maininfo);
		var minfostyle = maininfo.style;
		minfostyle.width = "402px";
		minfostyle.background = "#500095";
		minfostyle.color = "#fff";
		minfostyle.border = 0;
		minfostyle.fontSize = "13px";
		minfostyle.padding = "3px 1px";
		minfostyle.margin = 0;
		minfostyle.opacity = 1;
		minfostyle.textAlign = "center";
		maininfo.textContent = "Start position?";

		var info = document.createElement("div");
		maincontainer.appendChild(info);
		var infostyle = info.style;
		infostyle.width = "400px";
		infostyle.background = "#000";
		infostyle.color = "#fff";
		infostyle.border = 0;
		infostyle.fontSize = "13px";
		infostyle.padding = "2px";
		infostyle.margin = 0;
		infostyle.opacity = 1;
		infostyle.textAlign = "center";
		info.innerHTML = "<strong style='color:lime'>h</strong>=Left <strong style='color:lime'>l</strong>=Right <strong style='color:lime'>j</strong>=Down <strong style='color:lime'>k</strong>=Up <strong style='color:lime'>x</strong>=Delete <strong style='color:lime'>y</strong>=Copy <br><strong style='color:lime'>Space</strong>=Set <strong style='color:lime'>Enter</strong>=Search";

		var pointer = document.createElement("div");
		pointer.setAttribute("id","_blink_keybord_extension_________dialog_textcontainer");
		maincontainer.appendChild(pointer);
		var imgstyle = pointer.style;
		imgstyle.width = "401px";
		imgstyle.maxHeight = "500px";
		imgstyle.background = "#fff";
		imgstyle.color = "#333";
		imgstyle.border = 0;
		imgstyle.fontSize = "15px";
		imgstyle.padding = "3px";
		imgstyle.margin = 0;
		imgstyle.opacity = 1;
		imgstyle.textAlign = "left";
		imgstyle.overflowY = "auto";
		imgstyle.lineHeight = "1.7";
		imgstyle.wordWrap = "break-word";
		imgstyle.boxSizing = "border-box";
		pointer.addEventListener("click",function(e){
			e.stopPropagation();
		},false);
	},
	create:function(){
		var imgelem = document.createElement("img");
		document.body.appendChild(imgelem);
		imgelem.setAttribute("src",chrome.extension.getURL('img/picon.png'));
		this.pointer = imgelem;
		var imgstyle = imgelem.style;
		imgstyle.width = "24px";
		imgstyle.height = "24px";
		imgstyle.zoom = 1;
		imgstyle.position = "fixed";
		imgstyle.zIndex = 2147483647;
		imgstyle.border = 0;
		imgstyle.padding = 0;
		imgstyle.margin = 0;
		imgstyle.display = "none";
		imgstyle.borderRadius = 0;
		imgstyle.opacity = 1;
		this.resetval();
	},
	showpointer:function(){
		this.pointer.style.display = "block";
		this.pshowflag = true;
		this.showwrap();
	},
	hidepointer:function(){
		this.pointer.style.display = "none";
		this.pshowflag = false;
		this.hidewrap();
	},
    showwrap:function(){
		var cntelem = document.getElementById("_blink_keybord_extension_________wrap___");
		if(cntelem){
	        var prnt = window.parent,cwnd = window,doc = document;
			for (var i = 0; i < 10; i++) {
				if(cwnd === prnt){
		        	doc = cwnd.document;
		        	break;
				}
				cwnd = cwnd.parent.window;
				prnt = cwnd.parent.parent.window.parent;
			};
			var heigh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
			var width = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] );			
			cntelem.style.display = "block";
			cntelem.style.width = "100%";
			cntelem.style.height = heigh +"px";
		}
    },
    hidewrap:function(){
		var cntelem = document.getElementById("_blink_keybord_extension_________wrap___");
		if(cntelem){
			cntelem.style.display = "none";
		}
    },
	statpointer:function(e,url,multimode){
		if(multimode){
			this.multilink = true;
		}else{
			this.multilink = false;
		}
		if(!this.pshowflag){
			if(!url){
				this.searchurl = "";
			}else{
				this.searchurl = url;
			}
			this.showpointer();
		}else{
			if(this.dshowflag){
				var dialog = document.querySelector('#_blink_keybord_extension_________dialog');
				setTimeout(function(){
					document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
					dialog.close();
				},10);
			}
			this.dshowflag = false;
			this.pshowflag = false;
			this.hidepointer();
			this.resetval();
		}
	},
	clickelement:function(ctrl,alt,shift){
		var that = this;
		var x = this.left,y = this.top;
		this.pointer.style.display = "none";
		this.hidewrap();
		var elem = document.elementFromPoint(x,y);
		clicke(elem);
		this.showwrap();
		this.pointer.style.display = "block";

		function clicke(elem){
			var types = ['mousedown','mouseup', 'click'];
			for ( var i = 0, l = types.length; i < l; i++){
				var clicker = new MouseEvent(types[i], {
				  'bubbles': true,
				  'cancelable': true,
				  'view': window,
				  'detail': 0,
				  'screenX': 0,
				  'screenY': 0,
				  'clientX': 0,
				  'clientY': 0,
				  'ctrlKey': false,
				  'altKey': false,
				  'shiftKey': false,
				  'metaKey': false,
				  'button': 0,
				  'relatedTarget': null
				});
				elem.dispatchEvent(clicker);
				elem.style.boxShadow = "0 0 4px red inset";
				setTimeout(function(){
					elem.style.boxShadow = "";
				},800);
				if((elem)&&(elem.tagName)&&(elem.tagName.toUpperCase() == "INPUT")){
					elem.focus();
					setTimeout(function(){
						that.closemode();
					},800);
				}
			}
		}
	},
	checkpoint:function(txtflg){
		if(!this.pshowflag){
			return;
		}else if(!this.dshowflag){
			if(txtflg){
				var getflg = true;
				var getstring = txtflg;
			}else{
				var getstring = "";
				var getflg = false;
				var x = this.left,y = this.top;
				if(this.multilink){
					linksnap.start(x,y);
					return;
				}
				var dialog = document.querySelector('#_blink_keybord_extension_________dialog');
				this.pointer.style.display = "none";
				this.hidewrap();
				var el = document.elementFromPoint(x,y+10);
				this.pointer.style.display = "block";
				this.showwrap();
				var nodes = el.childNodes;	
				if(!nodes||nodes.length < 1)return;
				for ( var i = 0, nd; nd = nodes[i++];) {
				    var r = document.createRange();
				    r.selectNode(nd);
					var rects = r.getClientRects();
					var item = rects[0];
					var height = 0;
					for (var jj = 0; jj < rects.length; jj++) {
						height += rects[jj].height;
					};
					if(item&&item.top&&item.top+height > y){
						getflg = true;
					}
					if(getflg){
						if (nd.nodeType === 3) {
						    var nodevalue = nd.nodeValue;
						    if(nodevalue){	
						    	var nstr = nodevalue.replace(/^\s+|\s+$/g, "");
						    	if(nstr){
									getstring += nstr;
						    	}
						    }
						}else{
							if(nd.textContent){
						    	var nstr = nd.textContent.replace(/^\s+|\s+$/g, "");
						    	if(nstr){
									getstring += nstr;
						    	}
							}
						}
					}
				}
			}
			if(getflg){
				var maincont = document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_");
				var dialog = document.getElementById('_blink_keybord_extension_________dialog');
				var dialogtxt = document.getElementById('_blink_keybord_extension_________dialog_textcontainer');

				dialogtxt.scrollTop = 0;
				dialogtxt.textContent = getstring;
				this.dialogtxtstatpos = 0;
				this.dialogtxtendpos = 0;
				this.dialogflagtxtlen = getstring.length;
				this.dialogtxtendflag = false;
				this.dialogcloseflag = false;

				maincont.style.display = "block";

				dialog.showModal();
				this.dshowflag = true;
				this.setstatpos();
			}else{
				// this.hidepointer();
			}
		}
	},
	mvpointer:function(){
		if(this.dshowflag){
			this.setstrings();
		}
	},
	rmstring:function(){
		var el = document.getElementById('_blink_keybord_extension_________dialog_textcontainer');
		var dialog = document.getElementById('_blink_keybord_extension_________dialog');
		var txtnode = el.textContent;
		var rtxt = "",pos = "";
		if(0 === this.dialogtxtstatpos){
			var splittxte = txtnode.substring(1);	
			rtxt = splittxte;
			pos = "fst";
		}else if(txtnode.length-1 <= this.dialogtxtstatpos){
			var splittxte = txtnode.substring(0,this.dialogtxtstatpos);
			rtxt = splittxte;
			pos = "lst";
		}else{
			var rmtxt = txtnode.slice(this.dialogtxtstatpos,this.dialogtxtstatpos+1);
			var splittxts = txtnode.slice(0,this.dialogtxtstatpos);
			var splittxte = txtnode.slice(this.dialogtxtstatpos+1);
			if(/\s/.test(rmtxt)){
				rtxt = splittxts+""+splittxte;
			}else{
				rtxt = splittxts+" "+splittxte;
			}
		}
		rtxt = rtxt.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		if(!rtxt){
			document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
			dialog.close();
		}
		el.textContent = rtxt;
		this.dialogflagtxtlen = rtxt.length;

		if("lst" === pos){
			this.dialogtxtstatpos = rtxt.length-1;
		}else if("fst" === pos){
			this.dialogtxtstatpos = 0;
		}else{
			if(this.dialogtxtstatpos >= rtxt.length){
				this.dialogtxtstatpos = rtxt.length-1;
			}
		}
	    this.setrange();
	},
	setstatpos:function(setflg,mvflg){
		if(!this.dshowflag){
			return;
		}
	    if(setflg){
	    	if(mvflg){
	            this.dialogtxtstatpos++;
	            if(this.dialogtxtstatpos >= this.dialogflagtxtlen){
	            	this.dialogtxtstatpos = this.dialogflagtxtlen;
	            	return;
	            }
	    	}else{
	            this.dialogtxtstatpos--;
	            if(this.dialogtxtstatpos < 0){
	            	this.dialogtxtstatpos = 0;
	            	return;
	            }
	    	}
	    }
	    this.setrange();
	},
	move:function(x,y){
		if(!this.pshowflag)return;
		if(x !== null){
			var elem = this.pointer;
			var xval = this.left+x;
			if((xval > -1)&&(document.documentElement.clientWidth+1 > xval)){
				this.left = xval;
				elem.style.left = this.left+"px";
			}
		}else if(y !== null){
			var elem = this.pointer;
			var yval = this.top+y;
			if((yval > -23)&&(document.documentElement.clientHeight-20 > yval)){
				this.top = this.top+y;
				elem.style.top = this.top+"px";
			}
		}
		if(this.multilink){
			linksnap.movePointer(this.left,this.top)
			return;
		}
	},
	setrange:function(){
		var el = document.querySelector('#_blink_keybord_extension_________dialog_textcontainer');
		var nodes = el.childNodes;
		for ( var i = 0, nd; nd = nodes[i++];) {
			if (nd.nodeType === 3) {
			    var nodevalue = nd.nodeValue.replace(/^\s+|\s+$/g, "");
			    if(nodevalue){
				    var r = document.createRange();
			        r.setStart(nd, this.dialogtxtstatpos);
			        r.setEnd(nd, this.dialogtxtstatpos+1);
				    var sel = window.getSelection();
				    sel.removeAllRanges();
				    sel.addRange(r);
			    }
			}
		}
	},
	checknextline:function(flg){
		var el = document.querySelector('#_blink_keybord_extension_________dialog_textcontainer');
		var nodes = el.childNodes;
		if(nodes&&nodes.length > 0){
			var nd = nodes[0];
			if (nd.nodeType === 3) {
			    var nodevalue = nd.nodeValue.replace(/^\s+|\s+$/g, "");
			    if(nodevalue){
				    var r = document.createRange();
			        r.setStart(nd, this.dialogtxtstatpos);
			        r.setEnd(nd, this.dialogtxtstatpos+1);
					var item = r.getClientRects()[0];
					var stath = item.top;
					var len = nd.length;
					var statpos = this.dialogtxtstatpos;
					var prntr = el.getClientRects()[0];

					if(flg){
						for (var i = statpos; -1 < i; i--) {
					        r.setStart(nd, i);
					        r.setEnd(nd, i+1);
							var item2 = r.getClientRects()[0];
							if(stath > item2.top){
								this.dialogtxtstatpos = i;
								this.setrange();
								if(prntr.top+40 > item2.top){
									el.scrollTop -= 90;
								}
								break;							
							}
						};
					}else{
						for (var i = statpos; i < len-1; i++) {
					        r.setStart(nd, i);
					        r.setEnd(nd, i+1);
							var item2 = r.getClientRects()[0];
							if(stath < item2.top){
								this.dialogtxtstatpos = i;
								this.setrange();
								if(prntr.top+prntr.height < item2.top+30){
									el.scrollTop += 80;
								}
								break;							
							}
						};
					}
			    }
			}
		}
	},
	setstrings:function(){
		var el = document.getElementById('_blink_keybord_extension_________dialog_textcontainer');
		var dialog = document.getElementById('_blink_keybord_extension_________dialog');
		var minfo = document.getElementById('_blink_keybord_extension_________dialog_textcontainer_maininfo_');
		var endflg = false;
		if(this.dialogcloseflag){
			document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
			dialog.close();
			return;
		}else if(!this.dialogtxtendflag){
			var splittxt = el.textContent.substring(this.dialogtxtstatpos);
			minfo.textContent = "End position?"
		}else{
			endflg = true;
			this.dialogcloseflag = true;
			var splittxt = el.textContent.substring(0,this.dialogtxtstatpos);
			minfo.textContent = "Search = Enter"
		}
		if(!splittxt||splittxt.length < 1){
			document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
			dialog.close();
		}else{
			this.dialogflagtxtlen = splittxt.length;
	    	this.dialogtxtstatpos = 0;
			this.dialogtxtendflag = true;
			el.textContent = splittxt;
			if(!endflg){
			    this.setrange();
			}
		}
	},
	closemode:function(){
		var that = this;
		if(that.dshowflag){
			var dialog = document.querySelector('#_blink_keybord_extension_________dialog');
			setTimeout(function(){
				document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
				dialog.close();
			},10);
		}
		that.dshowflag = false;
		that.pshowflag = false;
		that.hidepointer();
		that.resetval();
		linksnap.reset();
		clearHintObject();
	},
	resetval:function(){
		var xval = parseInt(window.innerWidth/3);
		var yval = parseInt(window.innerHeight/3);
		this.left = xval;
		this.top = yval;
		this.pointer.style.left = xval+"px";
		this.pointer.style.top = yval+"px";
		this.dialogtxtstatpos = 0;
		this.dialogtxtendpos = 0;
		this.dialogflagtxtlen = 0;
		this.dialogtxtendflag = false;
		this.dialogcloseflag = false;
		this.pshowflag = false;
		this.dshowflag = false;
		var info = document.getElementById('_blink_keybord_extension_________dialog_textcontainer_maininfo_');
		if(info){
			info.textContent = "Start position?";
		}
	},
	toclipboard:function(){
		var el = document.querySelector('#_blink_keybord_extension_________dialog_textcontainer');
		var txt = el.textContent;
		chrome.runtime.sendMessage({contentscr: "toclipboard",str:txt});
		var dialog = document.querySelector('#_blink_keybord_extension_________dialog');
		document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
		dialog.close();
	},
	search:function(){
		var el = document.querySelector('#_blink_keybord_extension_________dialog_textcontainer');
		var txt = el.textContent;
		var opnurl = "https://www.google.com/search?q="+encodeURIComponent(txt);
		if(this.searchurl){
			opnurl = this.searchurl+encodeURIComponent(txt);
			this.searchurl = "";
		}
		openURLNewTab(opnurl);
		var dialog = document.querySelector('#_blink_keybord_extension_________dialog');
		document.getElementById("_blink_keybord_extension_________dialog_maincontainer_maininfo_").style.display = "none";
		dialog.close();
	}
};
function createStatusBar(){
	var sbar = document.createElement("div");
	document.body.appendChild(sbar);
	sbar.style.display = "inline-block";
	sbar.setAttribute("id","blinkexteinsion_12039457112341983245_statusbar");
	sbar.style.position = "fixed";
	sbar.style.bottom = "0";
	sbar.style.left = "0";
	sbar.style.fontSize = "12px";
	sbar.style.fontWeight = "bold";
	sbar.style.zIndex = 2147483647;
	sbar.style.padding = "2px 5px";
	sbar.style.background = "rgba(200,200,200,0.7)";
	sbar.textContent = "";
	sbar.style.color = "#222";
}
function hideStatusBar(){
	var stbar = document.getElementById("blinkexteinsion_12039457112341983245_statusbar");
	if(stbar){
		stbar.style.display = "none";
		stbar.textContent = "";
	}
}
function showTextStatusBar(txt){
	var stbar = document.getElementById("blinkexteinsion_12039457112341983245_statusbar");
	if(stbar){
		stbar.textContent = txt;
		stbar.style.display = "block";
		clearTimeout(statusbartimerid);
		statusbartimerid = setTimeout(function(){
			hideStatusBar();
		},2000)
	}
}
function createOption(){
	var optary = [];
	for (var i = 1; i < arguments.length; i++) {
		optary.push(arguments[i]);
	}
	keyconfig[arguments[0]] = optary;
}
function downloadMHTML(url){
	var title = document.title;
	if(!title){
		title = "No Title";
	}
	var downloadLink = document.createElement("a");
	downloadLink.href = url;
	downloadLink.download = title+".mhtml";
	downloadLink.click();
	downloadLink = null;
}
var clockobj = {
    init:function(){
        var that = this;
        this.createStatusBar("");
        that.clocknow();
        setInterval(function(){
            that.clocknow();
        },10000);
    },
    createStatusBar:function(text){
    	if(document.getElementById('blink__extension___clock_for_web__12394701982658087012098437'))return;
    	var sbar = document.createElement("div");
    	document.body.appendChild(sbar);
    	sbar.style.display = "block";
    	sbar.setAttribute("id","blink__extension___clock_for_web__12394701982658087012098437");
    	sbar.style.position = "fixed";
    	sbar.style.bottom = "0";
    	sbar.style.right = "0";
		sbar.style.fontFamily = '"Arial, sans-serif';
    	sbar.style.fontSize = "11px";
    	sbar.style.fontWeight = "normal";
    	sbar.style.zIndex = 2147483647;
    	sbar.style.padding = "1px 2px";
    	sbar.style.lineHeight = 1;
    	sbar.style.background = "rgba(0,0,0,.5)";
    	sbar.textContent = text;
    	sbar.style.color = "#fff";
    },
    showStatusBarText:function(txt){
        document.getElementById('blink__extension___clock_for_web__12394701982658087012098437').textContent = txt;
    },
    clocknow:function(){
    	var now = new Date() ;
    	var h = now.getHours();
    	var mi = now.getMinutes();
    	if ( h < 10 )h = "0" +h;
    	if ( mi < 10 )mi = "0" + mi ;
    	var txt = h+":"+mi;
    	this.showStatusBarText(txt);
    }
}
var fixedelementobject = {
    results:[],
	get:function(){
		var html = document.documentElement;
		var body = document.body;			
	    var wndih = window.innerHeight;
	    var wndiw = window.innerWidth;
	    var bdyscrt = body.scrollTop;
	    var htmscrt = html.scrollTop;
	    var htmclnt = html.clientTop;
	    var bdyscrl = body.scrollLeft;
	    var htmscrl = html.scrollLeft;
	    var htmclnl = html.clientLeft;
	    var pelems = Array.prototype.slice.call(body.querySelectorAll('*'), 0);

	    for(var i = 0, l = pelems.length; i < l; i++){
	    	var el = pelems[i];
			var style = document.defaultView.getComputedStyle(el, "");
	    	if((style.position == 'fixed')){
				// var pos = getAbsolutePosition(el,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl);
				// if (!pos) continue;
	    		this.results.push(el);
	    		el.style.visibility = "hidden";
	    	}
	    }
		function getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl) {
			var rect = elem.getClientRects()[0];
			if(rect){
				var recr = rect.right;
				var recl = rect.left;
				if((recl >= 0)&& (rect.top >= -5)&& (rect.bottom <= wndih + 5) && (recr <= wndiw)) {
					return {
						top: (bdyscrt || htmscrt) - htmclnt + rect.top,
						left: (bdyscrl || htmscrl) - htmclnl + recl
					}
				}
			}
			return false;
		}
	},
	clear:function(){
		var ary = this.results;
		for(var i = 0, l = ary.length; i < l; i++){
			ary[i].style.visibility = "visible";
		}
		this.results.length = 0;
	}
};
function startCapture(mode,saveas){
	if(window !== window.parent)return;
    var prnt = window.parent,cwnd = window,doc = document;
	for (var i = 0; i < 10; i++) {
		if(cwnd === prnt){
        	doc = cwnd.document;
        	break;
		}
		cwnd = cwnd.parent.window;
		prnt = cwnd.parent.parent.window.parent;
	};
	var heigh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
	var width = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] );
    if(mode == "full"){
        var capinfo = {
		    width:width,
		    height:heigh,
            statposx:0,
            statposy:0,
            statscrx:0,
            statscry:0,
            imgoffsetx:0,
            imgoffsety:0,
            clentwidth:document.documentElement.clientWidth,
            clentheight:document.documentElement.clientHeight,
		    scrolheight:heigh,
		    scrolwidth:width,
            devicePixelRatio: window.devicePixelRatio,
            saveas:saveas
        };
        chrome.runtime.sendMessage({contentscr: "scrncap",capinfo: capinfo});
    }else if(mode == "half"){
        var capinfo = {
            width:document.documentElement.clientWidth,
            height:document.documentElement.clientHeight,
            statposx:0,
            statposy:0,
            statscrx:window.pageXOffset,
            statscry:window.pageYOffset,
            imgoffsetx:0,
            imgoffsety:0,
            clentwidth:document.documentElement.clientWidth,
            clentheight:document.documentElement.clientHeight,
		    scrolheight:heigh,
		    scrolwidth:width,
            devicePixelRatio: window.devicePixelRatio,
            saveas:saveas
        };
        chrome.runtime.sendMessage({contentscr: "scrncap",capinfo: capinfo});
    }
}
function setCaptureScroll(idx,posobjary){
	var top = posobjary[idx].scry;
	var left = posobjary[idx].scrx;

	if(idx > 0){
		fixedelementobject.get();
	}
	if((left == window.pageXOffset)&&(top == window.pageYOffset)){
		chrome.runtime.sendMessage({contentscr: "pagecap",posobjary: posobjary, idx: idx});	
	}else{
		window.addEventListener("scroll",sendportPostMessage,true);
	    window.scrollTo(left,top);
	}
	function sendportPostMessage(e){
		window.removeEventListener("scroll",sendportPostMessage,true);
		setTimeout(function(e){
			chrome.runtime.sendMessage({contentscr: "pagecap",posobjary: posobjary, idx: idx});	
		},200);
	}
}
function fnishScreenCapture(posary,title){
	fixedelementobject.clear();
    var devicePixelRatio = posary[0].devicePixelRatio;
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.display = "none";
    canvas.width = Math.floor(posary[0].width*devicePixelRatio);
    canvas.height = Math.floor(posary[0].height*devicePixelRatio);
    var canvashpos = 0;
    var canvaswpos = 0;
    var cont = 0
    var ctx = canvas.getContext('2d');
    var callback = function(posary,i){
    	if(!posary[i]){
            var dataURI = canvas.toDataURL("image/jpeg");
            if(posary[0].saveas){
                chrome.runtime.sendMessage({cap: "saveas",uri: dataURI,title:document.title,saveas:true});

            }else{
                chrome.runtime.sendMessage({cap: "saveas",uri: dataURI,title:document.title,saveas:false});

            }
    		return;
    	}
        var img = new Image();
        img.onload = function(e) {
    		var imgleft = Math.ceil(posary[i].imgleft*devicePixelRatio);
    		var imgtop = Math.ceil(posary[i].imgtop*devicePixelRatio);
    		var offsety = Math.ceil(posary[i].offsety*devicePixelRatio);
    		var offsetx = Math.ceil(posary[i].offsetx*devicePixelRatio);
    		var imgwidth = Math.ceil(posary[i].imgwidth*devicePixelRatio);
    		var imgheight = Math.ceil(posary[i].imgheight*devicePixelRatio);
    		var scrx = Math.ceil(posary[i].scrx*devicePixelRatio);
    		var scry = Math.ceil(posary[i].scry*devicePixelRatio);
    		var clenh = Math.ceil(posary[i].clentheight*devicePixelRatio);
    		var clenw = Math.ceil(posary[i].clentwidth*devicePixelRatio);
    		var xcnt = posary[i].ii;
    		var ycnt = posary[i].i;
			ctx.drawImage(img,
				offsetx+imgleft,
				offsety+imgtop,
				imgwidth,
				imgheight,
				canvaswpos,
				canvashpos,
			    imgwidth,
			    imgheight
			);
			if(posary[i+1]){
				if(posary[i].i == posary[i+1].i){
            		canvaswpos += imgwidth;
				}else{
            		canvaswpos = 0;
            		canvashpos += imgheight;
				}
			}
			i++
	        callback(posary,i);
        };
        img.src = posary[i].pic;
    };
    callback(posary,cont);
}
var linksnap = {
    scrlendpos:null,
    scrlpos:null,
    saveas:true,
    removetimer:null,
    showflg:false,
    robj:null,
    init: function(prnt) {
    	var that = this;
        this.box = document.createElement("div");
        prnt.appendChild(this.box);
        this.box.setAttribute("id","blinkextension_snap_links_box_mg");
        this.bs = this.box.style;
        this.bs.backgroundColor = "rgba(250,128,0,0.07)";
        this.bs.border = "3px dashed blue";
        this.bs.boxSizing = 'border-box';
        this.bs.position = "absolute";
        this.bs.zIndex = 0x7FFFFFFF;
        this.bs.display = "none";
        createButton(prnt,"__cap_____cap________cap_mlobutto__c_mg","Capture",0,0,50,"blue","#fff",linksnap.getsize)
        createButton(prnt,"__smt_____smt________smt_mlobutto__c_mg","SmartLink",0,0,60,"deeppink","#black",linksnap.clickSmartButton,true)
        this.box.addEventListener("click",function(e){
        	that.reset();
        },false)
	    function createButton(cntelem,id,ttl,x,y,w,bg,cr,event,smt){
	        var capbtn = document.createElement("div");
	        cntelem.appendChild(capbtn);
	        capbtn.style.fontSize = "12px";
	        capbtn.style.fontWeight = "normal";
	        capbtn.style.margin = 0;
	        capbtn.style.position = "absolute";
	        capbtn.style.background = bg;
	        capbtn.style.color = cr;
	        capbtn.style.cursor = "pointer";
	        capbtn.textContent = ttl;
	        capbtn.style.width = w+"px";
	        capbtn.style.lineHeight = "20px";
	        capbtn.style.minHeight = "20px";
	        capbtn.style.maxHeight = "20px";
	        capbtn.style.boxSizing = 'border-box';
	        capbtn.style.textAlign = "center";
	        capbtn.style.top = y+"px";
	        capbtn.style.left = x+"px";
	        capbtn.style.cursor = "pointer";
	        capbtn.setAttribute("id",id);
	        capbtn.style.display = "none";
	        capbtn.addEventListener("mousedown",event,true);
	        capbtn.addEventListener("click",function(e){
	        	e.stopPropagation();
	        },true);
	        if(smt){
	            if(histobject.disablesmart){
	                capbtn.style.background = "#ccc"
	                capbtn.classList.add("off_smartselect");
	            }
	        }
	    }
    },
    clickHint:function(e){
    	if(!this.showflg || !createEmulator.multilink)return;
        var items = document.body.querySelectorAll(".hit_a_link_blinkextension_clickelement___mg");       
        var itemlen = items.length;
        if(items&&itemlen > 0){
	        var urlary = [],titleary = [];
            for(var i = 0; i < itemlen; i++){
                var elem = items[i];
                var aurl = elem.href.split("#")[0];
                if(urlary.indexOf(aurl) === -1){
                    urlary.push(aurl);
                    titleary.push(elem.textContent);
                }
            }
            if(e.ctrlKey){
                setTimeout(function(){
                    chrome.runtime.sendMessage({greeting: "link", ary:urlary, ttl: titleary,metakey: "ctrl"});
                },100);
            }else if(e.shiftKey){
                setTimeout(function(){
                    chrome.runtime.sendMessage({greeting: "link", ary:urlary, ttl: titleary,metakey: "shift"});
                },100);
            }else{
                setTimeout(function(){
                    chrome.runtime.sendMessage({greeting: "link", ary:urlary, ttl: titleary,metakey: "null"});
                },100);
            }
        }
    },
    start:function(x,y){
    	if(!createEmulator.multilink)return;
        var that = this;
    	var _x = window.pageXOffset+parseInt(x)+8;
    	var _y = window.pageYOffset+parseInt(y)+8;
		var evnt = {};
		evnt.pageX = _x;
		evnt.pageY = _y;
		evnt.clientX = parseInt(x)+8;
		evnt.clientY = parseInt(y)+8;
		evnt.type = "mousedown";
        this.downX = _x;
        this.downY = _y;
        this.bs.left = this.downX + "px";
        this.bs.top  = this.downY + "px";
        this.statX = this.downX;
        this.statY = this.downY;
        this.showflg = true;
        var obj = {
            pageYOffset:window.pageYOffset,
            pageXOffset:window.pageXOffset,
            clientY:evnt.clientY,
            clientX:evnt.clientX
        };
        this.scrlpos = obj;
        histobject.getLink();   
        document.getElementById("hit_a_link_blinkextension_container_mg").innerHTML = '';
        this.moveLabel();
    },
    hideLabel:function(){
        document.getElementById("__cap_____cap________cap_mlobutto__c_mg").style.display = "none"
        document.getElementById("__smt_____smt________smt_mlobutto__c_mg").style.display = "none"
    },
    moveLabel:function(){
        document.getElementById("__cap_____cap________cap_mlobutto__c_mg").style.display = "block"
        document.getElementById("__cap_____cap________cap_mlobutto__c_mg").style.left = parseInt(this.bs.left)+60+"px";
        document.getElementById("__cap_____cap________cap_mlobutto__c_mg").style.top =  parseInt(this.bs.top)-21+"px";
        document.getElementById("__smt_____smt________smt_mlobutto__c_mg").style.display = "block"
        document.getElementById("__smt_____smt________smt_mlobutto__c_mg").style.left = this.bs.left;
        document.getElementById("__smt_____smt________smt_mlobutto__c_mg").style.top = parseInt(this.bs.top)-21+"px";
    },
    movePointer:function(left,top){
    	if(!this.showflg || !createEmulator.multilink)return;
    	var _x = window.pageXOffset+parseInt(left)+8;
    	var _y = window.pageYOffset+parseInt(top)+8;
		var evnt = {};
		evnt.pageX = _x;
		evnt.pageY = _y;
		evnt.clientX = parseInt(left)+8;
		evnt.clientY = parseInt(top)+8;
		evnt.type = "mousemove";
        var moveX =  _x;
        var moveY = _y;
        if (this.downX > moveX) this.bs.left = moveX + "px";
        if (this.downY > moveY) this.bs.top  = moveY + "px";
        this.bs.width  = Math.abs(moveX - this.downX) + "px";
        this.bs.height = Math.abs(moveY - this.downY) + "px";
        this.box.style.display = "block";
	    var obj = {
	        pageYOffset:window.pageYOffset,
	        pageXOffset:window.pageXOffset,
	        clientY:evnt.clientY,
	        clientX:evnt.clientX
	    };
	    linksnap.scrlendpos = obj;
        this.hover(evnt);   
        this.moveLabel();
    },
    clickSmartButton:function(e){
    	if(e)e.stopPropagation();
        if(!this.classList.contains("off_smartselect")){
            this.classList.add("off_smartselect");
            this.style.background = "#ccc"
            histobject.disablesmart = true;
            histobject.createElement(linksnap.robj,true);
        }else{
            this.classList.remove("off_smartselect");
            this.style.background = "deeppink"
            histobject.disablesmart = false;
            histobject.createElement(linksnap.robj,true);
        }
    },
    reset:function(){
    	linksnap.hideLabel();
    	linksnap.showflg = false;
        linksnap.bs.display = "none";
        var cntelem = document.getElementById("hit_a_link_blinkextension_container_mg");
        if(cntelem)cntelem.innerHTML = '';
        histobject.removeElement();
    },
    hover: function(e){
        var html = document.documentElement;
        var body = document.body;           
        var wndih = window.innerHeight;
        var wndiw = window.innerWidth;
        var bdyscrt = body.scrollTop;
        var htmscrt = html.scrollTop;
        var htmclnt = html.clientTop;
        var bdyscrl = body.scrollLeft;
        var htmscrl = html.scrollLeft;
        var htmclnl = html.clientLeft;
        var pos = getAbsolutePosition(this.box,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl);
        linksnap.robj = pos;
        histobject.createElement(pos);
        function getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl) {
            var rect = elem.getClientRects()[0];
            if(rect){
                return {
                    top: (bdyscrt || htmscrt) - htmclnt + rect.top,
                    left: (bdyscrl || htmscrl) - htmclnl + rect.left,
                    width:rect.width,
                    height:rect.height
                }
            }
            return false;
        }
    },
    getsize: function(e){
    	e.stopPropagation();
        var html = document.documentElement;
        var body = document.body;           
        var wndih = window.innerHeight;
        var wndiw = window.innerWidth;
        var bdyscrt = body.scrollTop;
        var htmscrt = html.scrollTop;
        var htmclnt = html.clientTop;
        var bdyscrl = body.scrollLeft;
        var htmscrl = html.scrollLeft;
        var htmclnl = html.clientLeft;
        var pos = getAbsolutePosition(linksnap.box,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl);
        var prnt = window.parent,cwnd = window,doc = document;
        for (var i = 0; i < 10; i++) {
            if(cwnd === prnt){
                doc = cwnd.document;
                break;
            }
            cwnd = cwnd.parent.window;
            prnt = cwnd.parent.parent.window.parent;
        };
        var heigh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
        var width = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] )
        var capinfo = {
            width:pos.width,
            height:pos.height,
            statposx:linksnap.scrlpos.clientX,
            statposy:linksnap.scrlpos.clientY,
            statscrx:linksnap.scrlpos.pageXOffset,
            statscry:linksnap.scrlpos.pageYOffset,
            imgoffsetx:0,
            imgoffsety:0,
            clentwidth:document.documentElement.clientWidth,
            clentheight:document.documentElement.clientHeight,
            scrolheight:heigh,
            scrolwidth:width,
            devicePixelRatio: window.devicePixelRatio,
            saveas:linksnap.saveas
        };
        if(linksnap.scrlpos.pageYOffset >= linksnap.scrlendpos.pageYOffset){
            if(linksnap.scrlpos.clientY > linksnap.scrlendpos.clientY){
                capinfo.statposy = linksnap.scrlendpos.clientY;
                capinfo.statscry = linksnap.scrlendpos.pageYOffset;
            }
        }
        if(linksnap.scrlpos.pageXOffset >= linksnap.scrlendpos.pageXOffset){
            if(linksnap.scrlpos.clientX > linksnap.scrlendpos.clientX){
                capinfo.statposx = linksnap.scrlendpos.clientX;
                capinfo.statscrx = linksnap.scrlendpos.pageXOffset;
            }
        }
        setTimeout(function(){
            chrome.runtime.sendMessage({contentscr: "scrncap",capinfo:capinfo});
        },250);
        linksnap.reset();
        function getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl) {
            var rect = elem.getClientRects()[0];
            if(rect){
                return {
                    top: (bdyscrt || htmscrt) - htmclnt + rect.top,
                    left: (bdyscrl || htmscrl) - htmclnl + rect.left,
                    width:rect.width,
                    height:rect.height
                }
            }
            return false;
        }
    }
};
var histobject = {
    hints:{
    	htagspos:[],
    	pos:[]
    },
    showhint:0,
    hintsizew:16,
    hintsizeh:16,
    disablesmart:false,
    init:function(pcntelem){
        var cntelem = document.createElement("div");
        pcntelem.appendChild(cntelem);
        cntelem.style.display = "none";
        cntelem.style.position = "absolute";
        cntelem.style.left = 0;
        cntelem.style.top = 0;
        cntelem.style.width = 0;
        cntelem.style.height = 0;
        cntelem.style.zIndex = 0x7FFFFFFF;
        cntelem.setAttribute("id","hit_a_link_blinkextension_container_mg");
        cntelem.style.background = "rgba(0,0,0,0)";
    },
    getLink:function(){
        this.hints = this.createArray();
        var prnt = window.parent,cwnd = window,doc = document;
        for (var i = 0; i < 10; i++) {
            if(cwnd === prnt){
                doc = cwnd.document;
                break;
            }
            cwnd = cwnd.parent.window;
            prnt = cwnd.parent.parent.window.parent;
        };
        var heigh = Math.max.apply( null, [doc.body.clientHeight ,doc.body.scrollHeight,doc.documentElement.scrollHeight,doc.documentElement.clientHeight] );
        var width = Math.max.apply( null, [doc.body.clientWidth ,doc.body.scrollWidth,doc.documentElement.scrollWidth,doc.documentElement.clientWidth] )
        var cntelem = document.getElementById("hit_a_link_blinkextension_container_mg");
        cntelem.innerHTML = '';
        cntelem.style.display = "block";
    },
    createElement:function(rectobj,cancel){
        var hcnt = 0,mhintelems = [],mhintpos = [];
        var items = document.body.querySelectorAll(".hit_a_link_blinkextension_clickelement___mg");
        for(var i = 0, l = items.length; i < l; i++){
        	items[i].classList.remove("hit_a_link_blinkextension_clickelement___mg");
        }
        var checkhover = function(helemary,hposary){
	        for(var i = 0, l = helemary.length; i < l; i++ ) {   
	            var item = helemary[i];
	            var prnt = hposary[i];
	            if(((rectobj.left < item.left)&&(rectobj.left+rectobj.width > item.left))
	                ||((rectobj.left > item.left)&&(rectobj.left < item.left+item.width))){
	                if(((rectobj.top > item.top)&&(rectobj.top < item.top+item.height))
	                    ||((rectobj.top < item.top)&&(rectobj.top+rectobj.height > item.top+item.height))){
	                	hcnt++;
	                    mhintelems.push(prnt)
	                    mhintpos.push(item)
	                }
	            }
	        }
	    };
	    checkhover(this.hints.htagspos,this.hints.htags)
        if(hcnt < 1 || this.disablesmart)checkhover(this.hints.pos,this.hints.elem)
        if(mhintelems.length > 0){
        	clearHintObject();
			var hintstrs = _createhintstr.concat();
			var rmchr = function(chr){
				var idx = hintstrs.indexOf(chr);
				if(idx > -1)hintstrs.splice(idx,1);
			};
			rmchr("j")
			rmchr("k")
			rmchr("h")
			rmchr("l")
			rmchr("i")
			rmchr("c")
			rmchr("s")
			if(hintstrs.length < 3)return;
			_createhintstr = hintstrs;
	        var hobj = {};
	        hobj.pos = mhintpos;
	        hobj.elem = mhintelems;
	        drawHints(false,false,false,false,false,false,false,hobj)
        }
    },
    removeElement:function(){
        var that = this;
        var cntelem = document.getElementById("hit_a_link_blinkextension_container_mg");
        cntelem.innerHTML = '';
        cntelem.style.display = "none";
        var items = document.body.querySelectorAll(".hit_a_link_blinkextension_clickelement___mg");
        for(var i = 0, l = items.length; i < l; i++){
            items[i].style.boxShadow = "";
            items[i].classList.remove("hit_a_link_blinkextension_clickelement___mg");
        }
        setTimeout(function(){that.showhint = 0;},200);
    },
    createArray:function(){
        var hintaryabj = {};
        var html = document.documentElement;
        var body = document.body;           
        var wndih = window.innerHeight;
        var wndiw = window.innerWidth;
        var bdyscrt = body.scrollTop;
        var htmscrt = html.scrollTop;
        var htmclnt = html.clientTop;
        var bdyscrl = body.scrollLeft;
        var htmscrl = html.scrollLeft;
        var htmclnl = html.clientLeft;
        var rsary = Array.prototype.slice.call(body.querySelectorAll('a'), 0);
        var results = [],rwsultsposary = [];
        var htags = [],htagspos = [];
        for(var i=0,l=rsary.length;i<l;i++ ) {
            var elem = rsary[i];
            var style = document.defaultView.getComputedStyle(elem, "");
            if((style.display == "none") || (style.visibility == "hidden")){
                continue;
            }
            var pos = getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl);
            if (!pos) continue;
            var hts = elem.querySelectorAll("h1, h2, h3, h4, h5, h6");
            if(elem.parentNode.nodeName.match(/H\d/i) || hts.length > 0){
                htags.push(elem);
                htagspos.push(pos)
            }else{
                results.push(elem)
                rwsultsposary.push(pos)             
            }
        }
        hintaryabj.elem = results;
        hintaryabj.pos = rwsultsposary;
        hintaryabj.htags = htags;
        hintaryabj.htagspos = htagspos;
        return hintaryabj;
        function getAbsolutePosition(elem,wndih,wndiw,bdyscrt,htmscrt,htmclnt,bdyscrl,htmscrl,htmclnl) {
            var rect = elem.getClientRects()[0];
            if(rect){
                var recr = rect.right;
                var recl = rect.left;
                if((recl >= 0)&& (rect.top >= -(wndih*2))&& (rect.bottom <= wndih*2 + 5) && (recr <= wndiw)) {
                    return {
                        top: (bdyscrt || htmscrt) - htmclnt + rect.top,
                        left: (bdyscrl || htmscrl) - htmclnl + recl,
                        width:rect.width,
                        height:rect.height
                    }
                }
            }
            return false;
        }
    }
};
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.msg == "resend"){
		var opts = request.opts;
		keyconfig = opts;
		initInitialized();
		if((keyconfig.ignoreurlary)&&(exceptURLList(keyconfig.ignoreurlary))){
			ignoreallflag = true;
		}	
	    sendResponse({});
	}else if(request.msg == "stopall"){
	    sendResponse({});
		window.stop();	    
	}else if(request.msg == "autoscroll"){		
		if(window === window.parent){	
			var posobjary = request.posobjary;
			var idx = request.idx;
			if(idx != posobjary.length){
				setCaptureScroll(idx,posobjary);					
			}else{
				var title = document.title;
				if(!title){
					title = "pageCapture";
				}
		        window.scrollTo(posobjary[0].scrx,posobjary[0].scry);
				fnishScreenCapture(posobjary,title);
			}
		}
	    sendResponse({});
	}else if(request.msg == "removeiframe"){
		removeCommandBox();
	    sendResponse({});
	}else if(request.msg == "sendtext"){
		if(window == window.parent){
			var val = request.val;
			clearTimeout(createhighlighttimerid);
			createhighlighttimerid = setTimeout(function(){
				removeHighlightWord();
				innerHighlight(document.body,val,keyconfig.searchopt,false);
			},250);
		}
	    sendResponse({});
	}else if(request.msg == "sethighlightsearch"){
		if(window == window.parent){
			var val = request.val;
			if(val&&(val.length >= keyconfig.searchstart)){
			}else{
				innerHighlight(document.body,val,keyconfig.searchopt,true);
			}
			highlihtelemary = sortHighlightWord();
			if(highlihtelemary&&(highlihtelemary.length > 0)){
				checkNextHighlightWord();
			}
		}
	    sendResponse({});
	}else if(request.msg == "sethighlightsearchp"){
		if(window == window.parent){
			var val = request.val;
			if(val&&(val.length >= keyconfig.searchstart)){
			}else{
				innerHighlight(document.body,val,keyconfig.searchopt,true);
			}
			highlihtelemary = sortHighlightWord();
			if(highlihtelemary&&(highlihtelemary.length > 0)){
				checkPreHighlightWord();
			}
		}
	    sendResponse({});
	}else if(request.mhtml == "on"){
		if(window == window.parent){
			var url = request.url;
			downloadMHTML(url);
		}
	    sendResponse({});
	}	
});
