var defaultsearchengine = null;
var ifrmmode = "";
var keyconfig = {};
var tabaobject = [];
var _optobj = localStorage.getItem("option__object");
if(_optobj){
    keyconfig = JSON.parse(_optobj);
    if(keyconfig.tab__suspend__)tabaobject = keyconfig.tab__suspend__;
}else{
    setDefaultOption();
}
function openLink(urlary,ttlary,actflg){
    var loadhtml = chrome.extension.getURL('lazy.html');
    for(var i = 0, l = urlary.length; i < l; i++){
        var url = urlary[i];
        var ttl = ttlary[i];
        if(keyconfig.lazyload){
            var openurl = loadhtml+"?"+encodeURIComponent(url)+"&"+encodeURIComponent(ttl);
        }else{
            var openurl = url;
        }
        if(i != 0){
            actflg = false;
        }
        chrome.tabs.create({url: openurl, active:actflg});
    }
}
function openWindow(urlary,ttlary){
    var urls = [];
    var loadhtml = chrome.extension.getURL('lazy.html');
    for(var i = 0, l = urlary.length; i < l; i++){
        var url = urlary[i];
        var ttl = ttlary[i];
        if(keyconfig.lazyload){
            urls.push(loadhtml+"?"+encodeURIComponent(url)+"&"+encodeURIComponent(ttl));
        }else{
            urls.push(url);
        }
    }
    chrome.windows.getCurrent(null, function (wd){
        chrome.windows.create({url:urls,height:wd.height,left: wd.left,top: wd.top,width: wd.width},function(wnd){
            var tabs = wnd.tabs;
            chrome.tabs.update(tabs[0].id,{active: true});
            chrome.windows.update(wnd.id,{state:wd.state});
        });
    });
}
function moveTab(dirct,tabid){
    chrome.windows.getCurrent({populate:true},function(wnd){
        var tab = null;
        var tabs = wnd.tabs;
        var tablen = tabs.length;
        for (var i = 0; i < tablen; i++) {
            var item = tabs[i];
            if(item.active){
                tab = item;
                break;
            }
        };
        if(tab){
            var idx = tab.index;
            if(dirct === "left"){
                idx--;
                if(idx < 0){
                    idx = 0;
                }
            }else if(dirct === "right"){
                idx++;
                if(idx === tablen){
                    idx--;
                }
            }
            chrome.tabs.move(tabid,{index:idx})
        }
    });
}
function setOptionObject(optobj){
    keyconfig = optobj;
    sendAlltabsMessage();
    syncStore.set(keyconfig);
}
function sendAlltabsMessage(){
    chrome.tabs.query({},function(tabs){
        for(var i = 0, l = tabs.length; i < l; i++){
            if(tabs[i].id)chrome.tabs.sendMessage(tabs[i].id,{msg:"resend",opts: keyconfig});
        }
    });
}
function openURLNewTab(url,flg){
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
        var tab = tabs[0];
        chrome.tabs.create({windowId: tab.windowId,active: flg,url: url});
    });
}
function createNewTab(flg){
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
        var tab = tabs[0];
        chrome.tabs.create({windowId: tab.windowId,active: flg,url:"chrome://newtab"});
    });
}
function setClipboard(str){
	var inpt = document.createElement("input");
	document.body.appendChild(inpt);
	inpt.setAttribute("type","text");
    inpt.value = str;
    inpt.focus();
    inpt.select();
    document.execCommand("copy");
    setTimeout(function(){
		document.body.removeChild(inpt);
    },800)
}
function sortCurrentWindow(opt){
    chrome.tabs.query({currentWindow:true},function(tabs){
        function cmp(a, b) {
            if(opt == "title"){
                if(!a.title){
                    a.title = "zz";
                }
                if(!b.title){
                    b.title = "zzx";
                }
                return a.title.localeCompare(b.title);
            }else if(opt == "url"){
                return a.url.localeCompare(b.url);
            }else{     
                return a.id - b.id;
            }
        }
        tabs.sort(cmp);
        for(var i = 0, l = tabs.length; i < l; i++){
            var tab = tabs[i];
            chrome.tabs.move(tab.id,{index: i});
        }
    });
}
function commandOpenURL(url,tabid){
    if(url == "options"){
        openOptionsPage();
    }else if(url.indexOf("javascript:") == 0){
        chrome.tabs.update(null, { url: url});
    }else if(url){
        chrome.tabs.update(tabid, {url: url,"active": true}); 
    }
}
function startScreenCapture(tabid,capinfo){
    if((capinfo.width > 0)&&(capinfo.height > 0)&&(capinfo.clentwidth > 0)&&(capinfo.clentheight > 0)){
        var ycapcnt = parseInt((capinfo.height+capinfo.statposy) / capinfo.clentheight,10);
        var ymod = capinfo.height % capinfo.clentheight;
        if(ymod > 0){
            ycapcnt++;
        }
        var xcapcnt = parseInt((capinfo.width+capinfo.statposx) / capinfo.clentwidth,10);
        var xmod = capinfo.width % capinfo.clentwidth;
        if(xmod > 0){
            xcapcnt++;
        }
        var posobjary = [];

        for(var i = 0; i < ycapcnt; i++){
            for(var ii = 0; ii < xcapcnt; ii++){
                var posobj = {};
                posobj.width = capinfo.width;
                posobj.height = capinfo.height;
                posobj.clentheight = capinfo.clentheight;
                posobj.clentwidth = capinfo.clentwidth;
                posobj.devicePixelRatio = capinfo.devicePixelRatio;
                posobj.saveas = capinfo.saveas;
                posobj.i = i;
                posobj.ii = ii;
                if((capinfo.statscry+capinfo.clentheight*(i+1)) > capinfo.scrolheight){
                    var tmp = capinfo.statscry+capinfo.clentheight*(i+1) - capinfo.scrolheight;
                    posobj.scry = capinfo.statscry+capinfo.clentheight*i - tmp;
                    posobj.offsety = tmp;
                }else{
                    posobj.scry = capinfo.statscry+capinfo.clentheight*i;
                    posobj.offsety = 0;
                }

                if(capinfo.statscrx+capinfo.clentwidth*(ii+1) > capinfo.scrolwidth){
                    var tmp2 = capinfo.statscrx+capinfo.clentwidth*(ii+1) - capinfo.scrolwidth;
                    posobj.scrx = capinfo.statscrx+capinfo.clentwidth*ii - tmp2;
                    posobj.offsetx = tmp2;
                }else{
                    posobj.scrx = capinfo.statscrx+capinfo.clentwidth*ii;
                    posobj.offsetx = 0;
                }

                if(i == 0){
                    posobj.imgtop = capinfo.statposy;
                }else{
                    posobj.imgtop = 0;
                }

                if(ii == 0){
                    posobj.imgleft = capinfo.statposx;
                }else{
                    posobj.imgleft = 0;
                }

                if(posobj.imgleft+capinfo.width <= capinfo.clentwidth){
                    posobj.imgwidth = capinfo.width;
                }else{
                    if(ii == 0){
                        posobj.imgwidth = capinfo.clentwidth-posobj.imgleft;
                    }else if(ii == xcapcnt-1){
                        posobj.imgwidth = capinfo.width-posobj.offsetx;
                    }else{
                        posobj.imgwidth = capinfo.clentwidth;
                    }
                }
                if(posobj.imgtop+capinfo.height <= capinfo.clentheight){
                    posobj.imgheight = capinfo.height;
                }else{
                    if(i == 0){
                        posobj.imgheight = capinfo.clentheight-posobj.imgtop;
                    }else if(i == ycapcnt-1){
                        posobj.imgheight = capinfo.height-posobj.offsety;
                    }else{
                        posobj.imgheight = capinfo.clentheight;
                    }
                }
                posobjary.push(posobj);
            }
        }
        chrome.tabs.sendMessage(tabid,{msg:"autoscroll",posobjary: posobjary,idx: 0});
    }
}
function saveasScreenCapture(uri,title,online,saveas){
    var fname = "",ex = "";
    if(online === "img"){
        title = uri.replace(/(jpg-large|jpg:large)/i,"jpg");
        if(title.indexOf("/") !== -1){
            var paths = title.split("/");
            fname = paths[paths.length-1];
        }
        if(/\.(jpe?g)/i.test(fname)){
            ex = "";
        }else if(/\.(gif)/i.test(fname)){
            ex = "";
        }else if(/\.(png)/i.test(fname)){
            ex = "";
        }else{
            ex = ".jpg";
        }
        var imgurl = uri;
    }else{
        var blob = Base64toBlob(uri);
        var webkitURL = (window.URL || window.webkitURL);
        var imgurl = webkitURL.createObjectURL(blob);
        ex = ".jpg";
    }
    title = title.replace(/[\\\'\`\|\^\"\<\>\)\(\}\{\]\[\;\#\/\*\!\?\:\@\%\&\=\+\$\,]/g,"");
    chrome.downloads.download({saveAs:saveas,url:imgurl,filename:title+ex});
    function Base64toBlob(_base64){
        var i;
        var tmp = _base64.split(',');
        var data = atob(tmp[1]);
        var mime = tmp[0].split(':')[1].split(';')[0];
        var arr = new Uint8Array(data.length);
        for (i = 0; i < data.length; i++) {arr[i] = data.charCodeAt(i);}
        var blob = new Blob([arr], { type: mime });
        return blob;
    }
}
function setAliastoBookmarks(){
    var lclobj = localStorage.getItem("alias_object");
    if(!lclobj)return;
    var optobj = JSON.parse(lclobj);
    var that = this;
    var callback = function(pbk){
        chrome.bookmarks.getChildren(pbk.id, function (bkary){
            var cb = function(){
                chrome.bookmarks.create({parentId:pbk.id,title:"alias"},function(bk){
                    var objkeys = Object.keys(optobj);       
                    for (var i = 0, len = objkeys.length; i < len; i++) {
                        var key = objkeys[i];
                        var item = optobj[key];
                        if(!item)continue;
                        var ttl = key;
                        if(item.opt == "-n"){
                            ttl += ",-n"
                        }else{
                            ttl += ",-"
                        }
                        chrome.bookmarks.create({parentId:bk.id,title:ttl,url:item.url});
                    }
                });
            };
            if(bkary&&bkary.length > 0){
                chrome.bookmarks.removeTree(bkary[0].id, function (bkary){
                    cb();
                });
            }else{
                cb();
            }
        });  
    };
    chrome.bookmarks.search("__keyboard_control_extension__", function (bkary){
        if(bkary&&bkary.length > 0){
            callback(bkary[0])
        }else{
            chrome.bookmarks.getChildren("0", function (bkary){
                if(bkary&&bkary.length > 0){
                    chrome.bookmarks.create({parentId:bkary[1].id,title:"__keyboard_control_extension__"},function(bk){
                        callback(bk)
                    });
                }
            });
        }
    });
}
var syncStore = {
	flag:true,
	set:function(optobj){
	    if(this.flag){
		    var storageObj = {};
			var lclobj = localStorage.getItem("_alias_object");
			if(lclobj){
				var alsary = JSON.parse(lclobj);
			    this.setobj(storageObj,alsary,"alias_",null);
			}
		    this.setobj(storageObj,optobj,"opt_","aliasary")
		    chrome.storage.sync.set(storageObj, function(){});
        }
	},
	setobj:function(storageObj,optobj,name,excpt){
	    var idx = 0;
		var objkeys = Object.keys(optobj);		 
		var optary = [];
		for (var i = 0, len = objkeys.length; i < len; i++) {
			var key = objkeys[i];
			if(key === excpt){
				continue;
			}
			var value = optobj[key];
			optary[idx] = {};
			optary[idx].key = key;
			optary[idx].value = value;
	        var index =  name + idx;
	        storageObj[index] = optary[idx];
	        idx++;
		}
	}
};
function openOptionsPage(){
    var extviews = chrome.extension.getViews({"type": "tab"});
    for (var i=0; i <= extviews.length; i++) { 
        if (i == extviews.length) { 
            chrome.tabs.create({url: "options.html"});
        }else if (extviews[i].location.href == chrome.extension.getURL("options.html")) { 
            extviews[i].chrome.tabs.getCurrent(function (focusTab){
                chrome.tabs.update(focusTab.id, {"active": true}); 
            }); 
            break; 
        } 
    } 
}
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    sendResponse({});
    if(msg.check == "set"){
        keyconfig.on = JSON.parse(msg.flg);
        sendAlltabsMessage();
    }else if (msg.greeting == "link"){
        var linkary = msg.ary;
        var ttlary = msg.ttl;
        var metakey = msg.metakey;
        if(metakey == "ctrl"){
            openLink(linkary,ttlary,false);
        }else if(metakey == "shift"){
            openWindow(linkary,ttlary);            
        }else{
            openLink(linkary,ttlary,true);
        }
    }else if(msg.reload == "reloadalltab"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            tabs.forEach(function (tab) {
                chrome.tabs.reload(tab.id,{bypassCache: false});
            });
        });
    }else if(msg.contentscr == "stopall"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id,{msg:"stopall"});
            });
        });  
    }else if(msg.open == "imgloadpage"){
        var loadhtml = chrome.extension.getURL('../load.html');
        var lhtml = loadhtml+"?"+encodeURIComponent(msg.url);
        chrome.tabs.create({url:lhtml,active:msg.active},function(tab){});
    }else if(msg.open == "imgsave"){
        saveasScreenCapture(msg.url,msg.url,"img",msg.saveas)
    }else if(msg.open == "imgsearch"){
        openURLNewTab(msg.url,msg.active);
    }else if(msg.clip == "crnturl"){
        var url = msg.url;
        setClipboard(url);
    }else if(msg.clip == "srturl"){
        var url = msg.url;
        var xhr = new XMLHttpRequest();
        var snddata = JSON.stringify({longUrl: url});
        xhr.open('POST', 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDytAfgKTvNb5k58YWYwIdphNAshWfO484', true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200){
                var resp = JSON.parse(xhr.responseText);
                if(resp){
                    if(resp.id){
                        setClipboard(resp.id)
                    }
                }
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(snddata);
    }else if(msg.ifrm == "comopen"){
        chrome.tabs.sendMessage(sender.tab.id,{msg:"removeiframe"});
        var url = msg.url;
        commandOpenURL(url,sender.tab.id);
    }else if(msg.tab == "closectab"){
        chrome.tabs.remove(sender.tab.id);
    }else if(msg.tab == "closeothertabs"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            for(var i = 0, l = tabs.length; i < l; i++){
                var tab = tabs[i];
                if(tab.active != true){
                    chrome.tabs.remove(tab.id);
                }
            }
        })  
    }else if(msg.tab == "closerighttabs"){
        var tab = sender.tab;
        chrome.tabs.query({currentWindow:true},function(tabs){
            tabs.reverse().some(function (_tab, i) {
                if (_tab.id !== tab.id && !_tab.pinned) {
                    chrome.tabs.remove(_tab.id);
                } else {
                    return true;
                }
            });
        });
    }else if(msg.tab == "closelefttabs"){
        var tab = sender.tab;
        chrome.tabs.query({currentWindow:true},function(tabs){
            tabs.some(function (_tab, i) {
                if (_tab.id !== tab.id && !_tab.pinned) {
                    chrome.tabs.remove(_tab.id);
                } else {
                    return true;
                }
            });
        });
    }else if(msg.tab == "pinunpin"){
        chrome.tabs.query({active:true, currentWindow:true},function(tabs){
            var tabid = tabs[0].id;
            chrome.tabs.update(tabid,{pinned:!tabs[0].pinned});
        })
    }else if(msg.tab == "selectright"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            var tablen = tabs.length;
            for(var i = 0; i < tablen; i++){
                var tab = tabs[i];
                if(tab.active == true){
                    var ntab = tabs[i+1];
                    if(ntab){
                        chrome.tabs.update(ntab.id,{active :true});
                    }else{
                        chrome.tabs.update(tabs[0].id,{active :true});
                    }
                }
            }
        });   
    }else if(msg.tab == "selectleft"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            var tablen = tabs.length;
            for(var i = 0; i < tablen; i++){
                var tab = tabs[i];
                if(tab.active == true){
                    var ptab = tabs[i-1];
                    if(ptab){
                        chrome.tabs.update(ptab.id,{active :true});
                    }else{
                        chrome.tabs.update(tabs[tablen-1].id,{active :true});
                    }
                }
            }
        });   
    }else if(msg.tab == "selectfirst"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            chrome.tabs.update(tabs[0].id,{active :true});
        }); 
    }else if(msg.tab == "selectlast"){
        chrome.tabs.query({currentWindow:true},function(tabs){
            var tablen = tabs.length;
            chrome.tabs.update(tabs[tablen-1].id,{active :true});
        });
    }else if(msg.tab == "restore"){
        chrome.sessions.getRecentlyClosed({},function(sess){
            chrome.sessions.restore(sess[0].tab.sessionId);
        });
    }else if(msg.tab == "clone"){
        chrome.tabs.query({active:true, currentWindow:true},function(tabs){
            var tab = tabs[0];
            chrome.tabs.create({windowId: tab.windowId, url: tab.url, active: true});
        });
    }else if(msg.tab == "newtab"){
        createNewTab(true);
    }else if(msg.tab == "newtabbg"){
        createNewTab(false);
    }else if(msg.window == "newwindow"){
        chrome.windows.create();
    }else if(msg.window == "close"){
        chrome.tabs.query({active:true, currentWindow:true},function(tabs){
            var tab = tabs[0];
            chrome.windows.remove(tab.windowId);
        });
    }else if(msg.open == "newtab"){
        var url = msg.url;
        openURLNewTab(url,true);
    }else if(msg.open == "newtabbg"){
        var openurl = msg.url;
        if(msg.contflg&&keyconfig.lazyload){
            var loadhtml = chrome.extension.getURL('lazy.html');
            openurl = loadhtml+"?"+encodeURIComponent(openurl)+"&"+encodeURIComponent(msg.ttl);
        }
        openURLNewTab(openurl,false);
    }else if(msg.open == "crnttab"){
        var url = msg.url;
        chrome.tabs.query({active:true, currentWindow:true},function(tabs){
            var tab = tabs[0];
            chrome.tabs.update(tab.id,{url: url});
        });
    }else if(msg.contentscr == "searchweb"){
        var surl = msg.searchurl;
        ifrmmode = msg.mode;
        defaultsearchengine = surl;
    }else if(msg.contentscr == "searchwebcrnt"){
        var surl = msg.searchurl;
        ifrmmode = msg.mode;
        defaultsearchengine = surl;
    }else if(msg.contentscr == "bookmarkcrnt"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "bookmarknew"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "historycrnt"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "historynew"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "tablistcrnt"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "searchtextii"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "searchtextip"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "storetabs"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "focusnwind"){
        chrome.windows.getAll({populate: false}, function (winds){
            if(winds&&(winds.length > 1)){
                for(var i = 0, l = winds.length; i < l; i++){
                    if(winds[i].focused){
                        if(i == l-1){
                            chrome.windows.update(winds[0].id,{focused:true});
                        }else{
                            chrome.windows.update(winds[i+1].id,{focused:true});
                        }
                    }
                }
            }
        });
    }else if(msg.contentscr == "slpitv"){
        chrome.windows.getCurrent({populate:true},function(wnd){
            var tabs = wnd.tabs;
            var halfw = parseInt(wnd.width/2);
            chrome.windows.update(wnd.id,{left: wnd.left,top: wnd.top,width: halfw,height: wnd.height, state: "normal"},function(wnd1){
                for(var i = 0, l = tabs.length; i < l; i++){
                    if(tabs[i].active){
                        var acttaburl = tabs[i].url;
                    } 
                }
                var left = wnd1.left+wnd1.width;
                chrome.windows.create({left: left,top: wnd1.top,width: wnd1.width,height: wnd1.height, url: acttaburl});
            });
        });
    }else if(msg.contentscr == "slpith"){
        chrome.windows.getCurrent({populate:true},function(wnd){
            var tabs = wnd.tabs;
            var halfh = parseInt(wnd.height/2);
            chrome.windows.update(wnd.id,{left: wnd.left,top: wnd.top,width: wnd.width,height: halfh, state: "normal"},function(wnd1){
                for(var i = 0, l = tabs.length; i < l; i++){
                    if(tabs[i].active){
                        var acttaburl = tabs[i].url;
                    } 
                }
                var top = wnd1.top+wnd1.height;
                chrome.windows.create({left: wnd1.left,top: top,width: wnd1.width,height: wnd1.height, url: acttaburl});
            });
        });
    }else if(msg.contentscr == "commandmode"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "scriptlist"){
        ifrmmode = msg.mode;
    }else if(msg.contentscr == "sorttabtitle"){
        sortCurrentWindow("title");
    }else if(msg.contentscr == "sorttaburl"){
        sortCurrentWindow("url");
    }else if(msg.contentscr == "sorttabindex"){
        sortCurrentWindow("index");
    }else if(msg.contentscr == "scrncap"){
        var capinfo = msg.capinfo;
        startScreenCapture(sender.tab.id,capinfo); 
    }else if(msg.contentscr == "pagecap"){
        var posobjary = msg.posobjary;
        var idx = msg.idx;
        var tabid = sender.tab.id;
        chrome.tabs.captureVisibleTab(null,{format:'jpeg',quality: 100}, function(dataUrl){
            posobjary[idx].pic = dataUrl;
            idx +=1;
            chrome.tabs.sendMessage(tabid,{msg:"autoscroll",posobjary: posobjary,idx: idx});
        })
    }else if(msg.cap == "saveas"){
        saveasScreenCapture(msg.uri,msg.title,false,msg.saveas);
    }else if(msg.contentscr == "openoptpage"){
        openOptionsPage();
    }else if(msg.contentscr == "extensionmanager"){
        var idx = msg.idx;
        var lclobj = localStorage.getItem("_extension__settings");
        if(lclobj){
            var exoptary = JSON.parse(lclobj);
            if(exoptary&&exoptary.length > 0&&exoptary[idx]){
                checkEx(exoptary[idx]);
            }
        }
        function checkEx(optary){
            chrome.management.getAll(function(exinfoary){
                for(var i = 0; i < exinfoary.length; i++){
                    var item = exinfoary[i];
                    for (var ii = 0; ii < optary.length; ii++) {
                        var optitem = optary[ii];
                        if(item.id === optitem.id){
                            if(item.enabled !== optitem.enabled){
                                setEx(optitem.id,optitem.enabled);
                            }
                            break;
                        }
                    };
                }
            });
        }
        function setEx(id,enabled){
            chrome.management.setEnabled(id,enabled);
        }
    }else if(msg.sendmsg == "sitemcount"){
        var cunt = msg.count;
        chrome.tabs.sendMessage(sender.tab.id,{ifrm:"sendcount",count:cunt});
    }else if(msg.mhtml == "on"){
        chrome.tabs.query({currentWindow :true, active: true}, function (tabs) {
            chrome.pageCapture.saveAsMHTML({tabId: tabs[0].id},function(mhtml){
                var webkitURL = (window.URL || window.webkitURL);
                var url = webkitURL.createObjectURL(mhtml);
                var title = tabs[0].title;
                title = title.replace(/[\\\'\`\|\^\"\<\>\)\(\}\{\]\[\;\#\/\*\!\?\:\@\%\&\=\+\$\,]/g,"");
                chrome.downloads.download({saveAs:true,url:url,filename:title+".mhtml"});
            });
        });
    }else if(msg.contentscr == "crnt2lsttab"){
        var tlen = tabaobject.length;
        if(tlen > 1){
            var selid = tabaobject[tlen-2];
            if(selid > -1)chrome.tabs.update(selid,{active:true});
        }
    }else if(msg.contentscr == "movetableft"){
        var tabid = sender.tab.id;
        moveTab("left",tabid);
    }else if(msg.contentscr == "movetabright"){
        var tabid = sender.tab.id;
        moveTab("right",tabid);
    }else if(msg.contentscr == "toclipboard"){
        var txt = msg.str;
        setClipboard(txt);
    }else if(msg.msg == "addbookmark"){
        var allflg = msg.all;
        chrome.tabs.query({currentWindow :true}, function (tabs) {
            if(allflg){
                var opt = {
                    'parentId': "1",
                    'title': tabs[0].title
                };
            }else{
                for (var i = 0; i < tabs.length; i++) {
                    if(tabs[i].active){
                        var opt = {
                            'parentId': "1",
                            'title': tabs[i].title,
                            'url': tabs[i].url
                        };
                        break;
                    }
                };
            }
            chrome.bookmarks.create(opt, function (bknd){
                if(allflg)addtabs(bknd.id)
            });
            function addtabs(prntbkid){
                chrome.tabs.query({currentWindow :true}, function (tabs) {
                    for(var i = 0; i < tabs.length; i++){
                        chrome.bookmarks.create({
                            'parentId': prntbkid,
                            'title': tabs[i].title,
                            'url': tabs[i].url
                        });
                    }
                });
            }
        });
    }else if(msg.msg == "opendlfolder"){
        chrome.downloads.showDefaultFolder()
    }
});
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if(msg.ifrm == "getinfo"){
            if(ifrmmode == "searchweb"){
                port.postMessage({ifrm:"searchurl",sengine:defaultsearchengine});
            }else if(ifrmmode == "searchwebcrnt"){
                port.postMessage({ifrm:"searchurlcrnt",sengine:defaultsearchengine});
            }else if(ifrmmode == "bookmarkcrnt"){
                port.postMessage({ifrm:"bookmarkcrnt"});
            }else if(ifrmmode == "bookmarknew"){
                port.postMessage({ifrm:"bookmarknew"});
            }else if(ifrmmode == "historycrnt"){
                port.postMessage({ifrm:"historycrnt"});
            }else if(ifrmmode == "historynew"){
                port.postMessage({ifrm:"historynew"});
            }else if(ifrmmode == "tablistcrnt"){
                port.postMessage({ifrm:"tablistcrnt"});
            }else if(ifrmmode == "searchtextii"){
                port.postMessage({ifrm:"searchtextii"});
            }else if(ifrmmode == "searchtextip"){
                port.postMessage({ifrm:"searchtextip"});
            }else if(ifrmmode == "storetabs"){
                port.postMessage({ifrm:"storetabs"});
            }else if(ifrmmode == "commandmode"){
                chrome.tabs.query({currentWindow:true,active:true},function(tabs){
                    chrome.bookmarks.search("__keyboard_control_extension__", function (bkary){
                        if(bkary&&bkary.length > 0){
                            chrome.bookmarks.getSubTree(bkary[0].id, function (bkary){
                                if(bkary&&bkary[0]&&bkary[0].children&&bkary[0].children[0]&&bkary[0].children[0].children){
                                    port.postMessage({ifrm:"commandmode",tabs:tabs,bkary:bkary[0].children[0].children});
                                }else{
                                    port.postMessage({ifrm:"commandmode",tabs:tabs,bkary:[]});
                                }
                            });
                        }else{
                            port.postMessage({ifrm:"commandmode",tabs:tabs,bkary:[]});
                        }
                    });
                });
            }else if(ifrmmode == "scriptlist"){
                port.postMessage({ifrm:"scriptlist"});
            }
        }else if(msg.ifrm == "scriptlist"){
            if(msg.url)chrome.tabs.executeScript(port.sender.tab.id,{code:msg.url})
        }else if(msg.ifrm == "searctab"){
            var url = msg.url;
            chrome.tabs.update(port.sender.tab.id,{url: url});
        }else if(msg.ifrm == "searchcreatetab"){
            var url = msg.url;
            chrome.tabs.create({url: url});
        }else if(msg.ifrm == "removeself"){
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"removeiframe"});
        }else if(msg.ifrm == "tablistselect"){
            var tab = msg.tab;
            chrome.tabs.update(tab.id,{active: true});
        }else if(msg.ifrm == "sendsearchtext"){
            var val = msg.val;
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"sendtext",val:val});
        }else if(msg.ifrm == "sethighlightsearch"){
            var val = msg.val;
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"removeiframe"});
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"sethighlightsearch",val:val});
        }else if(msg.ifrm == "sethighlightsearchp"){
            var val = msg.val;
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"removeiframe"});
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"sethighlightsearchp",val:val});
        }else if(msg.ifrm == "storetabs"){
            var name = msg.name;
            var storetabsary = [];
            var lclobj = localStorage.getItem("store_tabs");
            if(lclobj){
                storetabsary = JSON.parse(lclobj);
            }
            chrome.tabs.query({currentWindow:true},function(tabs){
                if(tabs&&(tabs.length > 0)){
                    var urls = [];
                    var titles = [];
                    var tabobj = {};
                    for(var i = 0, l = tabs.length; i < l; i++){
                        urls.push(tabs[i].url);
                        titles.push(tabs[i].title);
                        if(!name&&(tabs[i].active)){
                            name = tabs[i].title;
                        }
                    }
                    tabobj.name = name;
                    tabobj.url = urls;
                    tabobj.title = titles;
                    storetabsary.push(tabobj);
                    if(storetabsary.length > 10){
                        storetabsary.shift();
                    }
                    localStorage.setItem("store_tabs",JSON.stringify(storetabsary));
                }
            });
        }else if(msg.ifrm == "comopen"){
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"removeiframe"});
            var url = msg.url;
            commandOpenURL(url,port.sender.tab.id);
        }else if(msg.ifrm == "openalias"){
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"removeiframe"});
            var url = msg.url;
            if(msg.opt&&(msg.opt == "-n")){
                openURLNewTab(url,true);
            }else{
                commandOpenURL(url,port.sender.tab.id);
            }
        }else if(msg.ifrm == "getbookmark"){
            var srcvalue = msg.val;
            var tabid = port.sender.tab.id;
            if((srcvalue == "/")||(srcvalue == ".")){
                var bkidx = 0;
                if(srcvalue == "."){
                    bkidx = 1;
                }
                chrome.bookmarks.getChildren("0",function(bknds){
                    chrome.bookmarks.getChildren(bknds[bkidx].id,function(obknds){
                        var bklen = obknds.length;
                        var bknds = [];
                        for(var i = 0; i < bklen; i++){
                            if(obknds[i].url){
                                bknds.push(obknds[i]);
                            }
                        }
                        chrome.tabs.sendMessage(tabid,{ifrm:"sendbookmark",bknd: bknds});
                    });
                });

            }else if(srcvalue == "["){
                chrome.bookmarks.getRecent(50,function(bknds){
                    chrome.tabs.sendMessage(tabid,{ifrm:"sendbookmark",bknd: bknds});
                });
            }else{
                chrome.bookmarks.search(srcvalue,function(obknds){
                    var bklen = obknds.length;
                    var bknds = [];
                    for(var i = 0; i < bklen; i++){
                        if(obknds[i].url){
                            bknds.push(obknds[i]);
                            if(bknds.length == 50){
                                break;
                            }
                        }
                    }
                    chrome.tabs.sendMessage(tabid,{ifrm:"sendbookmark",bknd: bknds});
                });   
            }
        }else if(msg.ifrm == "gethistory"){
            var val = msg.val;
            var tabid = port.sender.tab.id;
            if(!val)val = "";
            chrome.history.search({text:val,maxResults:50}, function(hists){
                chrome.tabs.sendMessage(tabid,{ifrm:"sendbookmark",bknd: hists});
            });
        }else if(msg.ifrm == "gettablist"){
            var val = msg.val;
            var tabid = port.sender.tab.id;
            chrome.tabs.query({currentWindow:true},function(tabs){
                var bknds = tabs;
                var sendnd = [];
                if(val){
                    for(var i = 0, l = bknds.length; i < l; i++){
                        var ttl = bknds[i].title;
                        var url = bknds[i].url;
                        var pattern = new RegExp(val,"i");
                        var match = pattern.exec(ttl);
                        var pattern2 = new RegExp(val,"i");
                        var match2 = pattern2.exec(url);
                        if((match&&(match.index > -1))||(match2&&(match2.index > -1))){
                            sendnd.push(bknds[i]);
                        }
                    }
                }else{
                    sendnd = bknds;
                }
                chrome.tabs.sendMessage(tabid,{ifrm:"sendbookmark",bknd: sendnd});
            });   
        }else if(msg.ifrm == "loadtabs"){
            chrome.tabs.sendMessage(port.sender.tab.id,{msg:"removeiframe"});
            var bknds = msg.bknds;
            if(bknds&&(bknds.url.length > 0)){
                var urls = bknds.url;
                for(var i = 0, l = urls.length; i < l; i++){
                    var url = urls[i];
                    chrome.tabs.create({url: url});
                }
            }
        }else if(msg.cifrm == "changealias"){
		    syncStore.set(keyconfig);
            setAliastoBookmarks();
        }
    });
});
chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install"){
        setTimeout(function(){openOptionsPage()},1200)
    }else if(details.reason == "update"){
        setAliastoBookmarks();
    }
});
chrome.runtime.onSuspend.addListener(function(){
    keyconfig.tab__suspend__ = tabaobject;
    localStorage.setItem("option__object",JSON.stringify(keyconfig)); 
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
    var idx = tabaobject.indexOf(activeInfo.tabId);
    if(idx > -1)tabaobject.splice(idx,1);
    tabaobject.push(activeInfo.tabId);
    if(tabaobject.length > 3)tabaobject.shift();
});
chrome.tabs.onRemoved.addListener(function (tabid,removeInfo) {
    var idx = tabaobject.indexOf(tabid);
    if(idx > -1)tabaobject.splice(idx,1);
});
function setDefaultOption(callback){
    createOption("drawhint",[{char: "Space",ctrl: false,meta: false,shift: false}]);
    createOption("drawhintn",[{char: "Space",ctrl: false,meta: false,shift: true}]);
    createOption("drawhintnb",[{char: "Space",ctrl: true,meta: false,shift: false}]);
    createOption("scrldown",[{char: "j",ctrl: false,meta: false,shift: false}]);
    createOption("scrlup",[{char: "k",ctrl: false,meta: false,shift: false}]);
    createOption("scrlleft",[{char: "h",ctrl: false,meta: false,shift: false}]);
    createOption("scrlright",[{char: "l",ctrl: false,meta: false,shift: false}]);
    // createOption("scrlhdown",[{char: "j",ctrl: false,meta: false,shift: true}]);
    // createOption("scrlhup",[{char: "k",ctrl: false,meta: false,shift: true}]);
    createOption("scrlfdown",[{char: "d",ctrl: false,meta: false,shift: false}]);
    createOption("scrlfup",[{char: "u",ctrl: false,meta: false,shift: false}]);
    createOption("scrltop",[{char: "g",ctrl: false,meta: false,shift: false},{char: "g",ctrl: false,meta: false,shift: false}]);
    createOption("scrlbottom",[{char: "g",ctrl: false,meta: false,shift: true}]);
    createOption("reload",[{char: "r",ctrl: false,meta: false,shift: false}]);
    // createOption("superreload",[{char: "r",ctrl: false,meta: false,shift: true}]);
    // createOption("reloadall",[{char: "r",ctrl: false,meta: true,shift: false}]);
    createOption("autofocuskey",[{char: "i",ctrl: false,meta: false,shift: false}]);
    createOption("blurelem",[{char: "i",ctrl: false,meta: true,shift: false}]);
    // createOption("nexteditelem",[{char: "d",ctrl: true,meta: false,shift: false}]);
    // createOption("preeditelem",[{char: "u",ctrl: true,meta: false,shift: false}]);
    createOption("curltoclip",[{char: "y",ctrl: false,meta: false,shift: false},{char: "y",ctrl: false,meta: false,shift: false}]);
    // createOption("curltttltoclip",[{char: "y",ctrl: false,meta: false,shift: false},{char: "t",ctrl: false,meta: false,shift: false}]);
    // createOption("curltttlatagtoclip",[{char: "y",ctrl: false,meta: false,shift: false},{char: "h",ctrl: false,meta: false,shift: false}]);
    // createOption("shorttoclip",[{char: "y",ctrl: false,meta: false,shift: false},{char: "s",ctrl: false,meta: false,shift: false}]);
    createOption("backhistory",[{char: "h",ctrl: false,meta: false,shift: true}]);
    createOption("forwardhistory",[{char: "l",ctrl: false,meta: false,shift: true}]);
    createOption("closectab",[{char: "x",ctrl: false,meta: false,shift: false}]);
    // createOption("closeothertabs",[{char: "x",ctrl: false,meta: true,shift: false},{char: "o",ctrl: false,meta: false,shift: false}]);
    // createOption("closertabs",[{char: "x",ctrl: false,meta: true,shift: false},{char: "r",ctrl: false,meta: false,shift: false}]);
    // createOption("closeltabs",[{char: "x",ctrl: false,meta: true,shift: false},{char: "l",ctrl: false,meta: false,shift: false}]);
    createOption("pinunpintab",[{char: "p",ctrl: false,meta: false,shift: false}]);
    createOption("selectrtab",[{char: "k",ctrl: false,meta: false,shift: true}],[{char: "g",ctrl: false,meta: false,shift: false},{char: "t",ctrl: false,meta: false,shift: false}]);
    createOption("selectltab",[{char: "j",ctrl: false,meta: false,shift: true}],[{char: "g",ctrl: false,meta: false,shift: false},{char: "t",ctrl: false,meta: false,shift: true}]);
    createOption("selectfirst",[{char: "g",ctrl: false,meta: false,shift: false},{char: "0",ctrl: false,meta: false,shift: false}]);
    createOption("selectlast",[{char: "g",ctrl: false,meta: false,shift: false},{char: "$",ctrl: false,meta: false,shift: true}]);
    createOption("restoretab",[{char: "x",ctrl: false,meta: false,shift: true}]);
    // createOption("clonetab",[{char: "c",ctrl: false,meta: false,shift: false},{char: "t",ctrl: false,meta: false,shift: false}]);
    createOption("createnewtab",[{char: "t",ctrl: false,meta: false,shift: false}]);
    // createOption("createnewtabb",[{char: "t",ctrl: false,meta: true,shift: false}]);
    // createOption("createnewwindow",[{char: "w",ctrl: false,meta: false,shift: false}]);
    createOption("closewindow",[{char: "q",ctrl: false,meta: false,shift: false},{char: "a",ctrl: false,meta: false,shift: false}]);
    createOption("openurlcrnt",
        [
            {char: "o",ctrl: false,meta: false,shift: false,url: "http://www.google.com/"},
            {char: "g",ctrl: false,meta: false,shift: false,url: "http://www.google.com/"}
        ],
        [
            {char: "o",ctrl: false,meta: false,shift: false,url: "javascript:(function(){m='http://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su='+encodeURIComponent(document.title)+'&body='+encodeURIComponent(document.location);w=window.open(m,'addwindow','status=no,toolbar=no,width=575,height=545,resizable=yes');setTimeout(function(){w.focus();},250);})();"},
            {char: "j",ctrl: false,meta: false,shift: false,url: "javascript:(function(){m='http://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su='+encodeURIComponent(document.title)+'&body='+encodeURIComponent(document.location);w=window.open(m,'addwindow','status=no,toolbar=no,width=575,height=545,resizable=yes');setTimeout(function(){w.focus();},250);})();"}
        ]
    );
    createOption("openurlnewtab",[{char: "o",ctrl: false,meta: false,shift: true,url: "http://www.google.co.jp/"}]);
    // createOption("openurlnewtabbg",[{char: "o",ctrl: false,meta: true,shift: false,url: "http://www.google.co.jp/"}]);
    createOption("searchweb",[{char: "s",ctrl: false,meta: false,shift: true,url: "https://www.google.com/search?q="}]);
    createOption("searchwebcrnt",[{char: "s",ctrl: false,meta: false,shift: false,url: "https://www.google.com/search?q="}]);
    createOption("openbookmark",[{char: "b",ctrl: false,meta: false,shift: true}]);
    createOption("openbookmarkcrnt",[{char: "b",ctrl: false,meta: false,shift: false}]);
    createOption("openhistory",[{char: "v",ctrl: false,meta: false,shift: true}]);
    createOption("openhistorycrnt",[{char: "v",ctrl: false,meta: false,shift: false}]);
    createOption("opentablist",[{char: "t",ctrl: false,meta: false,shift: true}]);
    createOption("linklabelnext",[{char: "]",ctrl: false,meta: false,shift: false},{char: "]",ctrl: false,meta: false,shift: false}]);
    createOption("linklabelprev",[{char: "[",ctrl: false,meta: false,shift: false},{char: "[",ctrl: false,meta: false,shift: false}]);
    createOption("searchtextii",[{char: "/",ctrl: false,meta: false,shift: false}]);
    createOption("searchtextip",[{char: "?",ctrl: false,meta: false,shift: true}]);
    createOption("createmhtml",[{char: "m",ctrl: false,meta: false,shift: false},{char: "h",ctrl: false,meta: false,shift: false}]);
    createOption("storetabs",[{char: "m",ctrl: false,meta: false,shift: false},{char: "s",ctrl: false,meta: false,shift: false}]);
    createOption("focusnextwindow",[{char: "w",ctrl: false,meta: false,shift: true}]);
    createOption("gotoprntdir",[{char: "g",ctrl: false,meta: false,shift: false},{char: "p",ctrl: false,meta: false,shift: false}]);
    createOption("gotoroot",[{char: "g",ctrl: false,meta: false,shift: false},{char: "r",ctrl: false,meta: false,shift: false}]);
    createOption("setmark",[{char: "m",ctrl: false,meta: false,shift: false},{char: "m",ctrl: false,meta: false,shift: false}]);
    createOption("jumpmark",[{char: "m",ctrl: false,meta: false,shift: false},{char: "j",ctrl: false,meta: false,shift: false}]);
    createOption("splitwindv",[{char: "w",ctrl: false,meta: false,shift: false},{char: "v",ctrl: false,meta: false,shift: false}]);
    createOption("splitwindh",[{char: "w",ctrl: false,meta: false,shift: false},{char: "h",ctrl: false,meta: false,shift: false}]);
    // createOption("scrncap",[{char: "c",ctrl: false,meta: false,shift: false},{char: "f",ctrl: false,meta: false,shift: false}]);
    createOption("commandmode",[{char: "a",ctrl: false,meta: false,shift: false}]);
    createOption("openoptpage",[{char: "o",ctrl: false,meta: false,shift: false},{char: "p",ctrl: false,meta: false,shift: false}]);
    // createOption("sorttabtitle",[{char: "o",ctrl: false,meta: false,shift: false},{char: "t",ctrl: false,meta: false,shift: false}]);
    // createOption("sorttaburl",[{char: "o",ctrl: false,meta: false,shift: false},{char: "u",ctrl: false,meta: false,shift: false}]);
    // createOption("sorttabindex",[{char: "o",ctrl: false,meta: false,shift: false},{char: "i",ctrl: false,meta: false,shift: false}]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // createOption("crnt2lsttab",[{char: "c",ctrl: false,meta: false,shift: false}]);
    // createOption("movetableft",[{char: "c",ctrl: false,meta: false,shift: false}]);
    // createOption("movetabright",[{char: "z",ctrl: false,meta: false,shift: false}]);
    // createOption("extensionmanager",[{char: "e",ctrl: false,meta: false,shift: false}]);
    // createOption("texttool",[{char: "n",ctrl: false,meta: false,shift: false}]);
    createOption("nomap",
     [
         {char: "j",ctrl: false,meta: false,shift: false,url: "https?:\/\/twitter\.com"}
     ],
     [
         {char: "k",ctrl: false,meta: false,shift: false,url: "https?:\/\/twitter\.com"}
     ]
    );
    keyconfig.ignoreurlary = [
        "https://mail.google.com"
    ];
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    keyconfig.on = true;
    keyconfig.smscroll = true;
    keyconfig.autofocus = true;
    keyconfig.kinpttime = 700;
    keyconfig.scrval = 240;
    keyconfig.hintsize = 12;
    keyconfig.showclock = false;
    keyconfig.hstrside = "right";
    keyconfig.lazyload = false;
    keyconfig.searchstart = 2;
    keyconfig.searchopt = "i";
    keyconfig.cmdpos = "bl";
    keyconfig.nextstrings = "next,next »,next >>,next ≫,next >>,>,→,»,≫,>>";
    keyconfig.prevstrings = "prev,previous,« prev,<< prev,<< previous,« previous,« back,back,<,←,«,≪,<<";
    keyconfig.nextstringsid = "";
    keyconfig.prevstringsid = "";
    var obj = {};
    obj["__settings____"] = keyconfig;
    chrome.storage.local.set(obj,function(){
        localStorage.setItem("option__object",JSON.stringify(keyconfig)); 
        if(callback)callback();
    });
	function createOption(){
	    var optary = [];
	    for (var i = 1; i < arguments.length; i++) {
	        optary.push(arguments[i]);
	    }
	    keyconfig[arguments[0]] = optary;
	}
}
