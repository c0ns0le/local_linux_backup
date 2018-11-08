var SENDPORT = chrome.runtime.connect();
var searchengine = "https://www.google.com/search?q=";
var mode = "";
var newtabflag = false;
var getbookmarkflag = false;
var tablistsearchflag = false;
var currenttabs = null;
var rmselfflg = false;
document.addEventListener("DOMContentLoaded", function() {
	SENDPORT.postMessage({ifrm: "getinfo"});
	var inputelem = document.getElementById("searchinput");
	inputelem.addEventListener("keyup",getInputText,true);
	inputelem.addEventListener("keydown",getKeyDown,true);
	document.body.addEventListener("keydown",removeSelf,false);
});
SENDPORT.onMessage.addListener(function(msg) {
	if(msg.ifrm == "searchurl"){
		var surl = msg.sengine;
		if(surl){
			surl = surl +'';
			if(surl == "true"){
				searchengine = "https://www.google.com/search?q=";
			}else{
				searchengine = surl;
			}
			newtabflag = true;
			mode = "searchweb";
			document.getElementById("resultcontainer").textContent = "NewTab :"+ searchengine;
		}
	}else if(msg.ifrm == "searchurlcrnt"){
		var surl = msg.sengine;
		if(surl){
			surl = surl +'';
			if(surl == "true"){
				searchengine = "https://www.google.com/search?q=";
			}else{
				searchengine = surl;
			}
			newtabflag = false;
			mode = "searchweb";
			document.getElementById("resultcontainer").textContent = searchengine;
		}
	}else if(msg.ifrm == "bookmarkcrnt"){
		newtabflag = false;
		mode = "bookmark";
		document.getElementById("resultcontainer").textContent = "Search Bookmarks";
		document.getElementById("searchinput").setAttribute("placeholder","/=bookmarks bar   .=other bookmarks [=recent")
	}else if(msg.ifrm == "bookmarknew"){
		newtabflag = true;
		mode = "bookmark";
		document.getElementById("resultcontainer").textContent = "NewTab :Search Bookmarks";
		document.getElementById("searchinput").setAttribute("placeholder","/=bookmarks bar   .=other bookmarks [=recent")
	}else if(msg.ifrm == "historycrnt"){
		newtabflag = false;
		mode = "history";
		document.getElementById("resultcontainer").textContent = "History";
		document.getElementById("searchinput").setAttribute("placeholder","j=up, k=down, enter=select, /=search on-off")
		SENDPORT.postMessage({ifrm: "gethistory",val: ""});
	}else if(msg.ifrm == "historynew"){
		newtabflag = true;
		mode = "history";
		document.getElementById("resultcontainer").textContent = "NewTab :History";
		document.getElementById("searchinput").setAttribute("placeholder","j=up, k=down, enter=select, /=search on-off")
		SENDPORT.postMessage({ifrm: "gethistory",val: ""});
	}else if(msg.ifrm == "tablistcrnt"){
		newtabflag = false;
		mode = "tablist";
		document.getElementById("resultcontainer").textContent = "Tab List";
		document.getElementById("searchinput").setAttribute("placeholder","j=up, k=down, enter=select, /=search on-off")
		SENDPORT.postMessage({ifrm: "gettablist",val:""});
	}else if(msg.ifrm == "searchtextii"){
		newtabflag = false;
		mode = "searchtext";
		document.getElementById("resultcontainer").textContent = "Search ";
	}else if(msg.ifrm == "searchtextip"){
		newtabflag = false;
		mode = "searchtextp";
		document.getElementById("resultcontainer").textContent = "Search backwards";
	}else if(msg.ifrm == "storetabs"){
		newtabflag = false;
		mode = "storetabs";
		document.getElementById("resultcontainer").textContent = "Load/Store Tabs : store name ?";
		document.getElementById("searchinput").setAttribute("placeholder","store name");
		loadTabs();
    }else if(msg.ifrm == "commandmode"){
        var bkary = msg.bkary;
        var mobj = {};
        if(bkary&&bkary.length > 0){
            for (var i = 0; i < bkary.length; i++) {
                var item = bkary[i];
                var obj = {};
                obj.url = item.url;
                var ttl = item.title;
                if(!ttl)continue;
                var ttls = ttl.split(",");
                var prefix = ttls.pop();
                if(prefix === "-n"){
                    obj.opt = "-n"
                }else if(prefix === "-"){
                    obj.opt = ""
                }else{
                	ttls.push(prefix)
                    obj.opt = ""
                }
                ttl = ttls.join(",");
                mobj[ttl] = obj;
            };
            localStorage.setItem("alias_object",JSON.stringify(mobj));
        }else{
            localStorage.removeItem("alias_object");
        }
        newtabflag = false;
        mode = "commandmode";
        currenttabs = msg.tabs;
        document.getElementById("resultcontainer").textContent = "open URL alias";
        document.getElementById("searchinput").setAttribute("placeholder","alias name");
        createCommand();
    }else if(msg.ifrm == "scriptlist"){
        newtabflag = false;
        mode = "scriptlist";
        document.getElementById("resultcontainer").textContent = "script list";
        document.getElementById("searchinput").setAttribute("placeholder","script name");
        createScriptList();
    }
});

function createScriptList(){
	var lclobj = localStorage.getItem("script__list");
	if(lclobj){
		var jsonobj = JSON.parse(lclobj);
	    addItem(jsonobj,null);
	}
}
function createCommand(){
	var comlist = ["options","add","remove"];
	var lclobj = localStorage.getItem("alias_object");
	if(lclobj){
		var jsonobj = JSON.parse(lclobj);
		var optary = Object.getOwnPropertyNames(jsonobj);	
		if(optary&&optary.length > 12){
			optary.length = 12;
		}		
		comlist = comlist.concat(optary);
	}
    addItem(comlist,null);
}
function loadTabs(){
	var ttlary = [];
    var lclobj = localStorage.getItem("store_tabs");
    if(lclobj){
        var storetabsary = JSON.parse(lclobj);
        for(var i = 0, l = storetabsary.length; i < l; i++){
        	ttlary.push(storetabsary[i].name + " [" + storetabsary[i].title.length + " tabs]");
        }
		addItem(ttlary,storetabsary);
    }
}
function removeSelf(){
	SENDPORT.postMessage({ifrm: "removeself"});
}
function getKeyDown(e){
	var key = KeyParser(e);
	var keycode = e.keyCode;
	var value = e.currentTarget.value;
	e.stopPropagation();
	if(key.char == "Esc"){
		removeSelf();
	}else if(key.char == "Tab"){
		e.preventDefault();
		if(e.shiftKey){
			selectPreviousItem();
		}else{
			selectNextItem();
		}
	}else if(key.char == "Up"){
		e.preventDefault();
		selectPreviousItem();
	}else if(key.char == "Down"){
		e.preventDefault();
		selectNextItem();
	}else if(key.char == "Enter"){
		e.preventDefault();
		keyDownEnter(this);
	}else if((key.char == "/")&&(mode == "tablist") || (key.char == "/")&&(mode == "history")){
		e.preventDefault();
		e.stopPropagation();
		if(!tablistsearchflag){
			this.style.boxShadow = "0 0 0 2px orange inset";
		}else{
			this.style.boxShadow = "";
		}
		tablistsearchflag = !tablistsearchflag;
	}else if((tablistsearchflag)&&(mode == "tablist") || (tablistsearchflag)&&(mode == "history")){
	}else if(key.char == "k"){
		if(((mode == "tablist")&&(!tablistsearchflag))||((mode == "history")&&(!tablistsearchflag))){
			e.preventDefault();
			selectPreviousItem();	
			if(mode == "tablist" || mode == "history"){
				document.getElementById("searchinput").setAttribute("placeholder","/=search tab on-off")
			}
		}else if((mode == "bookmark")&&((value == "/")||(value == ".")||(value == "["))){
			e.preventDefault();
			selectPreviousItem();			
		}
	}else if(key.char == "j"){
		if(((mode == "tablist")&&(!tablistsearchflag))||((mode == "history")&&(!tablistsearchflag))){
			e.preventDefault();
			selectNextItem();
			if(mode == "tablist" || mode == "history"){
				document.getElementById("searchinput").setAttribute("placeholder","/=search tab on-off")
			}
		}else if((mode == "bookmark")&&((value == "/")||(value == ".")||(value == "["))){
			e.preventDefault();
			selectNextItem();
		}
	}else if((!tablistsearchflag)&&(mode == "tablist")||(!tablistsearchflag)&&(mode == "history")){
		e.preventDefault();
		e.stopPropagation();
		document.getElementById("searchinput").setAttribute("placeholder","/=search tab on-off")
	}else if((mode == "bookmark")&&((value == "/")||(value == ".")||(value == "["))){
		if((key.char != "BackSpace")&&(key.char != "Delete")){
			e.preventDefault();
		}
	}
}
function selectNextItem(){
	var selelem = document.querySelector(".suggestitemsclassselect");
	if(selelem){
		selelem.setAttribute("class","suggestitemsclass");
		var nextelem = selelem.nextSibling;
		if(nextelem){
			nextelem.setAttribute("class","suggestitemsclassselect");
		}else{
			var fstelem = document.getElementById("suggestitem0");
			if(fstelem){
				fstelem.setAttribute("class","suggestitemsclassselect");
			}
		}
	}else{
		var fstelem = document.getElementById("suggestitem0");
		if(fstelem){
			fstelem.setAttribute("class","suggestitemsclassselect");
		}
	}
	selectItem();
}
function selectPreviousItem(){
	var prntelem = document.getElementById("resultcontainer");
	var selelem = document.querySelector(".suggestitemsclassselect");
	if(selelem){
		selelem.setAttribute("class","suggestitemsclass");
		var preelem = selelem.previousSibling;
		if(preelem){
			preelem.setAttribute("class","suggestitemsclassselect");
		}else{
			var lstelem = prntelem.firstChild.lastChild;
			if(lstelem){
				lstelem.setAttribute("class","suggestitemsclassselect");
			}
		}
	}else{
		var lstelem = prntelem.firstChild.lastChild;
		if(lstelem){
			lstelem.setAttribute("class","suggestitemsclassselect");
		}
	}
	selectItem();
}
function selectItem(){
	var lielem = document.querySelector(".suggestitemsclassselect");
	if(!lielem)return;
	if(mode === "searchweb")document.getElementById("searchinput").value = lielem.textContent;
	var cont = document.getElementById("resultcontainer");
    var cntheight = cont.clientHeight;
	var bounds = lielem.getBoundingClientRect();
	var y = bounds.top;
	if(y+cont.scrollTop > cont.scrollTop+cntheight-(bounds.height*3)){
	    cont.scrollTop = (y/2)+cont.scrollTop;
	}else if(y+cont.scrollTop < cont.scrollTop+30){
	    cont.scrollTop = (y)+cont.scrollTop-(cntheight/2);
	}
}
function getInputText(e){
	e.stopPropagation();
	var key = KeyParser(e);
	var val = this.value;
    val = val.replace(/^\s+|\s+$/g, "");
	if(val){
		rmselfflg = false;
		if(key&&key.char&&((key.char.length == 1)||(key.char == "BackSpace")||(key.char == "Delete")||(key.char == "Enter"))){
			if(mode == "searchweb"){
				getJson(val);
			}else if(mode == "bookmark"){
				if(((val == "/")||(val == ".")||(val == "["))&&(getbookmarkflag)){		
				}else{
					getbookmarkflag = true;
					SENDPORT.postMessage({ifrm: "getbookmark",val: val});
				}
			}else if(mode == "commandmode"){
				createSuggestCommand(val);
			}else if(mode == "scriptlist"){
				createSuggestScript(val);
			}else if(mode == "tablist"){
				if(val&&tablistsearchflag){
					SENDPORT.postMessage({ifrm: "gettablist",val:val});
				}
			}else if(mode == "history"){
				if(val&&tablistsearchflag){
					SENDPORT.postMessage({ifrm: "gethistory",val:val});
				}
			}
		}
	}else{
		if((key.char == "BackSpace")){
			if(!rmselfflg){
				if(mode === "bookmark")getbookmarkflag = false
				rmselfflg = true;
			}else{
				removeSelf();
			}
		}
	}
	if((mode == "searchtext")&&(key.char != "Enter")){
		SENDPORT.postMessage({ifrm: "sendsearchtext",val: val});
	}else if((mode == "searchtextp")&&(key.char != "Enter")){
		SENDPORT.postMessage({ifrm: "sendsearchtext",val: val});
	}
}
function createSuggestScript(val){
	if(val){
		var lclobj = localStorage.getItem("script__list");
		if(lclobj){
			var sgstary = [];
			var jsonobj = JSON.parse(lclobj);
            var objkeys = Object.keys(jsonobj);       
            for (var i = 0, len = objkeys.length; i < len; i++) {
                var key = objkeys[i];
                var item = jsonobj[key];
                if(!item.sel)continue;
				if(item.sel.indexOf(val) !== -1){
					sgstary.push(item);
				}
			}
			if(sgstary.length > 0){
			    addItem(sgstary,null);
			}else{
			    addItem([],null);
			}
		}
	}
}
function createSuggestCommand(gval){
	var val = gval,rmflg = false;
	if((val.indexOf("remove ") === 0)&&(mode == "commandmode")){
		val = val.substring(7);
		if(!val){
			return;
		}
		rmflg = true;
	}
	if(val){
		var lclobj = localStorage.getItem("alias_object");
		if(lclobj){
			var sgstary = [];
			var jsonobj = JSON.parse(lclobj);
			var optary = Object.getOwnPropertyNames(jsonobj);
			if(optary){
				for(var i = 0, l = optary.length; i < l; i++){
					var alias = optary[i];
					if(alias.indexOf(val) == 0){
						if(rmflg){
							alias = "remove "+alias;
						}
						sgstary.push(alias);
						if(sgstary.length > 15){
							sgstary.length = 15;
						}
					}
				}
				if(sgstary.length > 0){
				    addItem(sgstary,null);
				}else{
				    addItem([],null);
				}
			}	
		}
	}
}
function getJson(val){
	var enval = encodeURIComponent(val);
	var url = 'https://suggestqueries.google.com/complete/search?client=chrome&q='+ enval;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url , true);
    xhr.onreadystatechange = function() {
        if((xhr.readyState == 4) && (xhr.status == 200)){
            var json = JSON.parse(xhr.responseText);
            addItem(json[1],null)
        }
    };
    xhr.send(null);
}
function addItem(list,bknds){
    var sgstcont = document.getElementById("resultcontainer");
    var srchbox = document.getElementById("searchinput");
    var itemlen = list.length;
    var docclhei = document.documentElement.clientHeight;
    var h = 0;
    sgstcont.innerHTML = "";
    sgstcont.style.display = 'block';
    if ((itemlen > 10)&&(mode == "searchweb")) {
        itemlen = 10;
    }
	var tablstcont = document.createElement("div");
	sgstcont.appendChild(tablstcont);
    for (var i = 0; i < itemlen; i++){
        var row = document.createElement("div");
        tablstcont.appendChild(row);
		if(!list[i]){
			if(mode == "bookmark"){
				list[i] = bknds[i].url;
			}else if(mode == "history"){
				list[i] = bknds[i].title;
				if(!list[i])list[i] = bknds[i].url;
			}else{
				list[i] = "_";
			}
		}
		row.setAttribute("class","suggestitemsclass");
		row.addEventListener("click",function(e){clickSuggestItem(e,bknds)},false);
		if(mode == "scriptlist"){
			if(list[i].sel){
				row.setAttribute("data-script",list[i].url)
				row.textContent = list[i].sel;
			}else{
				row.setAttribute("data-script","")
				row.textContent = "Script";				
			}
		}else{
	        row.textContent = list[i];
		}
        row.index = i;
		row.setAttribute("id","suggestitem"+i);
        h += row.offsetHeight;
    }
    if(itemlen === 1&&(mode === "commandmode" || mode === "scriptlist" || mode === "bookmark" || mode === "history" || mode === "tablist")){
    	row.setAttribute("class","suggestitemsclassselect");
    }
    if (itemlen <= 0) {
        sgstcont.style.display = 'none';
    }else {
        sgstcont.style.display = 'block';
        sgstcont.style.left = 0;
        sgstcont.style.bottom = srchbox.offsetHeight + "px";
        tablstcont.style.height = h + "px";
        if((docclhei-srchbox.offsetHeight) < h){
	        sgstcont.style.height = (docclhei-srchbox.offsetHeight)+"px";
	        sgstcont.style.overflowY = "auto";
        }else{
	        sgstcont.style.height = h + "px";
	        sgstcont.style.overflowY = "hidden";
        }
    }
};
function clickSuggestItem(e,bknds){
    var row = e.currentTarget;
	actMode(row,false,bknds);
}
function keyDownEnter(elem){
	var selelem = document.querySelector(".suggestitemsclassselect");
	if(selelem){
		selelem.click();
	}else{
		actMode(elem,true,null);
	}
}
function actMode(elem,flg,bknds){
	if(flg){
		var val = elem.value;
	}else{
	    var val = elem.textContent;
	}
	
    if(mode == "searchweb"){
    	if(!newtabflag){
			SENDPORT.postMessage({ifrm: "searctab",url: searchengine+val});
    	}else{
			SENDPORT.postMessage({ifrm: "searchcreatetab",url: searchengine+val});
    	}
		SENDPORT.postMessage({ifrm: "removeself"});
    }else if((mode == "bookmark")||(mode == "history")){
    	if(!flg){
    		var idx = elem.index;
    		var url = bknds[idx].url;
	    	if(!newtabflag){
				SENDPORT.postMessage({ifrm: "searctab",url: url});
	    	}else{
				SENDPORT.postMessage({ifrm: "searchcreatetab",url: url});
	    	}
			SENDPORT.postMessage({ifrm: "removeself"});
    	}
    }else if(mode == "tablist"){
    	if(!flg){
    		var idx = elem.index;
    		var tab = bknds[idx];
			SENDPORT.postMessage({ifrm: "tablistselect",tab: tab});
			SENDPORT.postMessage({ifrm: "removeself"});
    	}
    }else if(mode == "searchtext"){
	    val = val.replace(/^\s+|\s+$/g, "");
		SENDPORT.postMessage({ifrm: "sethighlightsearch",val: val});
    }else if(mode == "searchtextp"){
	    val = val.replace(/^\s+|\s+$/g, "");
		SENDPORT.postMessage({ifrm: "sethighlightsearchp",val: val});
    }else if(mode == "storetabs"){
    	if(flg){
		    val = val.replace(/^\s+|\s+$/g, "");
			SENDPORT.postMessage({ifrm: "storetabs",name:val});
			SENDPORT.postMessage({ifrm: "removeself"});
    	}else{
    		var idx = elem.index;
    		var bknd = bknds[idx];    
    		if(bknd){
				SENDPORT.postMessage({ifrm: "loadtabs",bknds:bknd});
    		}		
    	}
    }else if(mode == "commandmode"){
		var sgstcont = document.getElementById("resultcontainer");
		var srchbox = document.getElementById("searchinput");
    	if(val == "options"){
			SENDPORT.postMessage({ifrm: "comopen",url: "options"});
		}else if(val == "add"){
			addItem([
				"add [AliasName] [URL] option '-n'",
				"-n = new tab",
				"[URL] empty = Current URL",
				"e.g.) add ggl",
				"e.g.) add ggl http://www.google.com",
				"e.g.) add ggl http://www.google.com -n",
				"e.g.) add art javascript:alert('Hello world')",
			],null);
			srchbox.setAttribute("placeholder","add ggl http://www.google.com");
			srchbox.value = "add ";
		}else if(val == "remove"){
			addItem(["remove [AliasName]"],null);
			srchbox.setAttribute("placeholder","remove ggl");
			srchbox.value = "remove ";
		}else{
		    val = val.replace(/^\s+|\s+$/g, "");
			if(val){
				parseAddCommand(val);
			}
		}
    }else if(mode == "scriptlist"){
    	var script = elem.getAttribute("data-script");
		if(script)SENDPORT.postMessage({ifrm: "scriptlist",url:script});
    }
}
function parseAddCommand(comstr){
	var str = comstr.replace(/ +/g,' ');
	var strary = str.split(" ");
	var command = strary[0];
	var alias = strary[1];
	var url = strary[2];
	var opt = strary[3];
	var aliasobj = {};
	var lclobj = localStorage.getItem("alias_object");
	if(lclobj){
		aliasobj = JSON.parse(lclobj);
	}
	if(command&&command == "add"){
		if(alias){
			if(!url){
				if(currenttabs&&currenttabs.length > 0){
					url = currenttabs[0].url;
				}else{
					url = document.referrer;
				}
			}else if((url == "-n")){
				if(currenttabs&&currenttabs.length > 0){
					url = currenttabs[0].url;
				}else{
					url = document.referrer;
				}
				opt = "-n";
			}
			if(opt&&(opt == "-n")){
			}else{
				opt = "";
			}
			if(url&&(url.indexOf("javascript:") == 0)){
				var js = "";
				for(var i = 2, l = strary.length; i < l; i++){
					js +=  strary[i]+" ";
				}
				url = js;
			}
			var optobj = {
				url:url,
				opt:opt
			}
			aliasobj[alias] = optobj;
			localStorage.setItem("alias_object",JSON.stringify(aliasobj));
			SENDPORT.postMessage({cifrm: "changealias"});
			addItem([],null);
			document.getElementById("searchinput").value = "add";
			createCommand();
		}
	}else if(command&&command == "remove"){
		if(alias){
			if(aliasobj[alias]){
				delete aliasobj[alias];
				localStorage.setItem("alias_object",JSON.stringify(aliasobj));
				SENDPORT.postMessage({cifrm: "changealias"});
				addItem([],null);
				document.getElementById("searchinput").value = "remove";
				createCommand();
			}
		}
	}else if(command&&aliasobj[command]){
		var url = aliasobj[command].url;
		if(url){
			var opt = "";
			if(aliasobj[command].opt&&(aliasobj[command].opt == "-n")){
				opt = "-n";
			}
			SENDPORT.postMessage({ifrm: "openalias",url:url, opt:opt});
		}
	}
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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.ifrm == "sendbookmark"){
		var bknds = request.bknd;
		var ttlary = [];
		for(var i = 0, l = bknds.length; i < l; i++){
			ttlary.push(bknds[i].title);
		}
		addItem(ttlary,bknds);
	}else if(request.ifrm == "sendcount"){
		var cunt = request.count;
		document.getElementById("resultcontainer").textContent = "Search : "+cunt;
	}	
});

