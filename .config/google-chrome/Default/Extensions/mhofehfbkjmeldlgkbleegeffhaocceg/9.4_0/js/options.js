/***********************************************************
		Keyboard Control for Chrome™
			Distributed under the BSD license:
			http://opensource.org/licenses/BSD-3-Clause

************************************************************
		Copyright (c) 2015 Kunihiro Ando
			senna5150ando@gmail.com
        	2015-08-24T22:19:05Z
***********************************************************/

var addactindex = -1;
var addexpindex = -1;
var keyconfig = {};
var keyinputtime = 700;
var keyinputtimeid = null;
var keyarray = [];
var keystrarray = [];		
var clickselectobject = {};
var extensionsettingarray = [];
var scriptsourcearray = [];
var scriptsourceidex = -1;

document.addEventListener("DOMContentLoaded",function(){
	var callback = function(){
    	parseOptionObjcet();
    	keyinputtime = keyconfig.kinpttime;
    	createHelpTable();
    	createHiddenButton();	
    	createAllAddButtonItem();
    	document.documentElement.addEventListener("keydown",checkScroll,true);
    	document.getElementById("syncbutton").addEventListener("click",getSyncData,false);
    	document.getElementById("importbutton").addEventListener("click",importSettingText,false);
    	document.getElementById("exportbutton").addEventListener("click",saveSettingText,false);
    	document.getElementById("restorebutton").addEventListener("click",clickRestoreButton,false);
    	document.getElementById("defaultkeybutton").addEventListener("mousedown",showHelpWrap,false);
    	document.getElementById("searchenurllistbutton").addEventListener("mousedown",showSearchURLList,false);
        document.getElementById("webservicellistbutton").addEventListener("mousedown",function(e){
            showSearchURLList(e,true)
        },false);
    	var dialog = document.getElementById("searcheurllistdialog");
    	dialog.addEventListener("click",function(){
    		this.close();
    	},false);
    	var dialogcont = document.querySelector(".urllistdialogcontainer");
    	dialogcont.addEventListener("click",function(e){
    		e.stopPropagation();
    	},true);
    	dialogcont.addEventListener("mousedown",function(e){
    		e.stopPropagation();
    	},true);    	
		document.getElementById("addscriptbuttondiv").addEventListener("click",hideUserScriptModal,false);
        document.getElementById("addscriptbuttoncontainer").addEventListener("click",function(e){
    		e.stopPropagation();
    	},true);
		document.getElementById("addscript").addEventListener("mousedown",clickAddScriptButton,true);
    	document.getElementById("helpdiv").addEventListener("mousedown",hiddeHelpWrap,false);
    	document.getElementById("addbutton").addEventListener("mousedown",showaddCommandWrap,false);
    	document.getElementById("addbuttondiv").addEventListener("mousedown",hiddeaddCommandWrap,false);
    	document.getElementById("addexbutton").addEventListener("mousedown",clickAddEXButtonItem,false);
    	document.getElementById("qhitatinbutton").addEventListener("mousedown",showQHitaHintWrap,false);
    	document.getElementById("qhitahintbuttondiv").addEventListener("mousedown",hiddeHelpWrap,false);
    	document.getElementById("addextbuttondiv").addEventListener("mousedown",hiddeHelpWrap,false);
    	document.getElementById("gettextbutton").addEventListener("mousedown",function(){
    		showGetTextWrap("video/gettext.mp4");
    	},false);
    	document.getElementById("multilinkopnerbutton").addEventListener("mousedown",function(){
    		showGetTextWrap("video/multi.mp4",true);
    	},false);
        document.getElementById("extensiontable1").addEventListener("mousedown",function(e){
    		e.stopPropagation();
    	},true);
    
    	var dsautofocus = document.getElementById("disableautofocus");
    	dsautofocus.addEventListener("change",changeDisableAntiFocus,false);
    	dsautofocus.checked = keyconfig.autofocus;
    
    	var inpttime = document.getElementById("inputtimeout");
    	inpttime.addEventListener("change",changeInputTimeoutTime,false);
    	inpttime.value = keyconfig.kinpttime;
    
    	var inptscrlstep = document.getElementById("inputscrollstep");
    	inptscrlstep.addEventListener("change",changeScrollStepValue,false);
    	inptscrlstep.value = keyconfig.scrval;
    
    	var cmpos = document.getElementById("commandposselect");
    	cmpos.addEventListener("change",changeCommandPosition,false);
    	cmpos.value = keyconfig.cmdpos;
    
    	var inptfntsize = document.getElementById("inputhhfontsize");
    	inptfntsize.addEventListener("change",changeFontSizeValue,false);
    	inptfntsize.value = keyconfig.hintsize;
    
    	var hhcar = document.getElementById("hhcharacterselect");
    	hhcar.addEventListener("change",changeHintChara,false);
    	hhcar.value = keyconfig.hstrside;
    
    	var sincrmnt = document.getElementById("inputincsearch");
    	sincrmnt.addEventListener("change",changeMiniLength,false);
    	sincrmnt.value = keyconfig.searchstart;
    
    	var srchignore = document.getElementById("searchignorecasecheckbox");
    	srchignore.addEventListener("change",changeIgnoreSearch,false);
    	if(keyconfig.searchopt == ""){
    		srchignore.checked = false;
    	}
    
    	var lnklblnext = document.getElementById("linklabelednext");
    	lnklblnext.addEventListener("change",changeLinkLabelNextInput,false);
    	lnklblnext.value = keyconfig.nextstrings;
    
    	var lnklblnextid = document.getElementById("linklabelednextid");
    	lnklblnextid.addEventListener("change",changeLinkLabelNextIDInput,false);
    	if(keyconfig.nextstringsid){
    		lnklblnextid.value = keyconfig.nextstringsid;	
    	}
    
    	var lnklblpre = document.getElementById("linklabeledpre");
    	lnklblpre.addEventListener("change",changeLinkLabelPreInput,false);
    	lnklblpre.value = keyconfig.prevstrings;
    
    	var lnklblpreid = document.getElementById("linklabeledpreid");
    	lnklblpreid.addEventListener("change",changeLinkLabelPreIDInput,false);
    	if(keyconfig.prevstringsid){
    		lnklblpreid.value = keyconfig.prevstringsid;	
    	}
    
    	var gttxtmv = document.getElementById("inputgettextmvspeed");
    	gttxtmv.addEventListener("change",changeGetTextMove,false);
    	if(keyconfig.gttxtmv){
    		gttxtmv.value = keyconfig.gttxtmv;	
    	}
    
    	var sclock = document.getElementById("showclockcheckbox");
    	sclock.addEventListener("change",changeShowClock,false);
    	if(keyconfig.showclock){
    		sclock.checked = keyconfig.showclock;	
    	}
    	
    	var smscroll = document.getElementById("smoothscrollchekbox");
    	smscroll.addEventListener("change",changeSmoothScroll,false);
    	if(keyconfig.smscroll){
    		smscroll.checked = keyconfig.smscroll;	
    	}
    
    	var lzyld = document.getElementById("usinglazyload");
    	lzyld.addEventListener("change",changeLazyLoad,false);
    	if(keyconfig.lazyload){
    		lzyld.checked = keyconfig.lazyload;	
    	}

		var scrobj = localStorage.getItem("script__list");
		if(scrobj){
			var ldingurlary = JSON.parse(scrobj);
			if(ldingurlary&&(ldingurlary.length > 0)){
				for(var i = 0; i < ldingurlary.length; i++){
					scriptsourcearray.push(ldingurlary[i]);
					createScriptItem(ldingurlary[i].url,ldingurlary[i].sel);
				}
			}
		}
    	getExteinsonArray();
	};
	var optobj = localStorage.getItem("option__object");
	if(optobj){
		var jsonobj = JSON.parse(optobj);
		keyconfig = jsonobj;
		callback();
	}else{
        chrome.storage.local.get("__settings____",function(obj){
        	keyconfig = obj["__settings____"];
        	callback();
        })
	}
},false);

function getSyncData(){
	getSyncStore("alias_",0,{},false);
}
function getSyncStore(idx,si,optobj,flg){
    var sidx = idx+si;
    chrome.storage.sync.get(sidx,function(items) {
    	if(items[sidx]){
    		var obj = items[sidx];
    		if(obj){
	    		optobj[obj.key] = obj.value;
	    		si++;
	    		getSyncStore(idx,si,optobj,flg);
	    	}
    	}else{
    		if(flg){
	    		if(optobj&&optobj.hstrside&&optobj.cmdpos){
	    			keyconfig = optobj;
					checkObject();
					setTimeout(function(){
						location.reload();
					},700)
				}
    		}else{
    			setTimeout(function(){
					getSyncStore("opt_",0,{},true);
    			},100);
				var objkeys = Object.keys(optobj);
				if(objkeys&&objkeys.length > 0){
					// localStorage.setItem("alias_object",JSON.stringify(optobj));
				}
    		}
    	}
    });
}
function checkScroll(e){
	var hdiv = document.getElementById("addbuttondiv");
	if(hdiv.style.display === "block"){
		if((38 === e.keyCode)){
			e.stopPropagation();
			e.preventDefault();
			wheel(30);
		}else if((40 === e.keyCode)){
			e.stopPropagation();
			e.preventDefault();
			wheel(-30);
		}
	}
	function wheel(val){
		var cont = document.getElementById("addbuttoncontainer");
		var eventInit = { deltaX: 0, deltaY: -val }
		var whevent = new WheelEvent("mousewheel", eventInit);
		cont.dispatchEvent(whevent);	
	}
}
function showSearchURLList(e,webservice){
	var dialog = document.getElementById("searcheurllistdialog");
	var cont = document.querySelector(".urllistdialogcontainer");
	cont.innerHTML = "";
    if(webservice){
        var opt = loadWebServiceMenu();
    }else{
        var opt = loadSearchEngineMenu();
    }
	var urls = opt.url;
	var names = opt.name;

	for (var i = 0; i < urls.length; i++) {
		var itemcont = document.createElement("div");
		cont.appendChild(itemcont);
		var div = document.createElement("div");
		itemcont.appendChild(div);
		div.appendChild(document.createTextNode(names[i]));
		var div2 = document.createElement("div");
		itemcont.appendChild(div2);
		div2.appendChild(document.createTextNode(urls[i]));
	};
	dialog.showModal();
}
function showQHitaHintWrap(){
	document.getElementById("multilinkhelpcont").style.display = "none";
	document.getElementById("cursorhelpcont").style.display = "none";
	var hdiv = document.getElementById("qhitahintbuttondiv");
	var cont = document.getElementById("qhitahintbuttoncontainer");
	var whei = parseInt(window.innerHeight*0.84);
	var wwid = parseInt(window.innerWidth*0.8);
	cont.style.height = whei+"px";
	cont.style.width = wwid+"px";
	cont.style.marginLeft = (-wwid/2)+"px";
	cont.style.left = "50%";
	hdiv.style.display = "block";

	var video = document.getElementById("hitahintvideo");
	video.src = "video/hitahint.mp4";
	setTimeout(function(){	
		video.style.width = "";
		video.style.height = "";		
		video.play();
	},250);
}
function showGetTextWrap(vurl,flg){
	document.getElementById("multilinkhelpcont").style.display = "none";
	document.getElementById("cursorhelpcont").style.display = "block";
	var hdiv = document.getElementById("qhitahintbuttondiv");
	var cont = document.getElementById("qhitahintbuttoncontainer");
	var whei = parseInt(window.innerHeight*0.84);
	var wwid = parseInt(window.innerWidth*0.8);
	if(flg){
		document.getElementById("cursorhelpcont").style.display = "none";
		document.getElementById("multilinkhelpcont").style.display = "block";
	}
	cont.style.height = whei+"px";
	cont.style.width = wwid+"px";
	cont.style.marginLeft = (-wwid/2)+"px";
	cont.style.left = "50%";
	hdiv.style.display = "block";
	var video = document.getElementById("hitahintvideo");
	video.src = vurl;
	setTimeout(function(){	
		var vw = video.videoWidth;
		var vh = video.videoHeight;
		video.style.width = parseInt(vw*1.5)+"px";
		video.style.height = parseInt(vh*1.5)+"px";
		video.play();
	},250);
}
function changeSmoothScroll(e){
	var row = e.currentTarget;
	if(row.checked){
	    keyconfig.smscroll = true;
	}else{
	    keyconfig.smscroll = false;
	}
	checkObject();
}
function changeShowClock(e){
	var row = e.currentTarget;
	if(row.checked){
	    keyconfig.showclock = true;
	}else{
	    keyconfig.showclock = false;
	}
	checkObject();
}
function changeLazyLoad(e){
	var row = e.currentTarget;
	if(row.checked){
	    keyconfig.lazyload = true;
	}else{
	    keyconfig.lazyload = false;
	}
	checkObject();
}
function changeGetTextMove(e){
    var val = this.value;
    if((10 < val)||(1 > val)){
        val = 2;
        this.value = 2;
    }
    keyconfig.gttxtmv = val;
	checkObject();
}
function changeDisableAntiFocus(e){
	var row = e.currentTarget;
	if(row.checked){
	    keyconfig.autofocus = true;
	}else{
	    keyconfig.autofocus = false;
	}
	checkObject();
}
function changeInputTimeoutTime(e){
    var val = this.value;
    if((5000 < val)||(100 > val)){
        val = 700;
        this.value = 700;
    }
    keyconfig.kinpttime = val;
	checkObject();
}
function changeScrollStepValue(e){
    var val = this.value;
    if((500 < val)||(4 > val)){
        val = 50;
        this.value = 50;
    }
    keyconfig.scrval = val;
	checkObject();
}
function changeCommandPosition(e){
	var row = e.currentTarget;
    keyconfig.cmdpos = row.value;
	checkObject();
}
function changeFontSizeValue(e){
    var val = this.value;
    if((30 < val)||(8 > val)){
        val = 12;
        this.value = 12;
    }
    keyconfig.hintsize = val;
	checkObject();
}
function changeHintChara(e){
	var row = e.currentTarget;
    keyconfig.hstrside = row.value;
	checkObject();
}
function changeMiniLength(e){
    var val = this.value;
    if((100 < val)||(1 > val)){
        val = 2;
        this.value = 2;
    }
    keyconfig.searchstart = val;
	checkObject();
}
function changeIgnoreSearch(e){
	var row = e.currentTarget;
	if(row.checked){
	    keyconfig.searchopt = "i";
	}else{
	    keyconfig.searchopt = "";
	}
	checkObject();
}
function changeLinkLabelNextInput(e){
	var value = this.value;
    value = value.replace(/^\s+|\s+$/g, "");
    keyconfig.nextstrings = value;
	checkObject();   
}
function changeLinkLabelNextIDInput(e){
	var value = this.value;
    value = value.replace(/^\s+|\s+$/g, "");
    keyconfig.nextstringsid = value;
	checkObject();   
}
function changeLinkLabelPreInput(e){
	var value = this.value;
    value = value.replace(/^\s+|\s+$/g, "");
    keyconfig.prevstrings = value;
	checkObject();   
}
function changeLinkLabelPreIDInput(e){
	var value = this.value;
    value = value.replace(/^\s+|\s+$/g, "");
    keyconfig.prevstringsid = value;
	checkObject();   
}
function parseOptionObjcet(){
	parseOptionKey("drawhint");
	parseOptionKey("drawhintn");
	parseOptionKey("drawhintnb");
	parseOptionKey("getlinkttl");
	parseOptionKey("getlinkurl");
	parseOptionKey("getlinkurlttl");
	parseOptionKey("getlinkurlttlhtml");
	parseOptionKey("sendurltoweb");
	parseOptionKey("sendurltowebnewtab");
	parseOptionKey("sendurltowebbgtab");
	parseOptionKey("sendurltowebcontinuous");
	parseOptionKey("capfull");
	parseOptionKey("capsfull");
	parseOptionKey("caphalf");
	parseOptionKey("capshalf");
	parseOptionKey("scrlup");
	parseOptionKey("scrldown");
	parseOptionKey("scrlleft");
	parseOptionKey("scrlright");
	parseOptionKey("scrltop");
	parseOptionKey("scrlbottom");
	parseOptionKey("scrlfup");
	parseOptionKey("scrlfdown");
	parseOptionKey("scrlhup");
	parseOptionKey("scrlhdown");
	parseOptionKey("selectfirst");
	parseOptionKey("selectlast");
	parseOptionKey("selectltab");
	parseOptionKey("selectrtab");
	parseOptionKey("focusnextwindow");
	parseOptionKey("forwardhistory");
	parseOptionKey("backhistory");
	parseOptionKey("searchwebcrnt");
	parseOptionKey("searchweb");
	parseOptionKey("openbookmarkcrnt");
	parseOptionKey("openbookmark");
	parseOptionKey("openhistorycrnt");
	parseOptionKey("openhistory");
	parseOptionKey("opentablist");
	parseOptionKey("openurlcrnt");
	parseOptionKey("openurlnewtab");
	parseOptionKey("openurlnewtabbg");
	parseOptionKey("openreurlcrnt");
	parseOptionKey("openreurlnewtab");
	parseOptionKey("openreurlnewtabbg");
	parseOptionKey("autofocuskey");
	parseOptionKey("blurelem");
	parseOptionKey("closectab");
	parseOptionKey("closeltabs");
	parseOptionKey("closertabs");
	parseOptionKey("closeothertabs");
	parseOptionKey("closewindow");
	parseOptionKey("restoretab");
	parseOptionKey("pinunpintab");
	parseOptionKey("createnewtab");
	parseOptionKey("createnewtabb");
	parseOptionKey("createnewwindow");
	parseOptionKey("curltoclip");
	parseOptionKey("curltttltoclip");
	parseOptionKey("curltttlatagtoclip");
	parseOptionKey("linklabelnext");
	parseOptionKey("linklabelprev");
	parseOptionKey("gotoprntdir");
	parseOptionKey("gotoroot");
	parseOptionKey("setmark");
	parseOptionKey("jumpmark");
    parseOptionKey("addbookmark");
    parseOptionKey("addallbookmark");
    parseOptionKey("opendlfolder");
    parseOptionKey("imgveiwtab");
    parseOptionKey("imgveiwtbg");
    parseOptionKey("imgsave");
    parseOptionKey("imgsaveas");
    parseOptionKey("imgsearch");
    parseOptionKey("imgurlcopy");
	parseOptionKey("splitwindv");
	parseOptionKey("splitwindh");
	parseOptionKey("reload");
	parseOptionKey("reloadall");
	parseOptionKey("stopload");
	parseOptionKey("stopall");
	parseOptionKey("superreload");
	parseOptionKey("searchtextii");
	parseOptionKey("searchtextip");
	parseOptionKey("clonetab");
	parseOptionKey("storetabs");
	parseOptionKey("preeditelem");
	parseOptionKey("nexteditelem");
	parseOptionKey("createmhtml");
	parseOptionKey("shorttoclip");
	parseOptionKey("commandmode");
	parseOptionKey("openoptpage");
	parseOptionKey("sorttabtitle");
	parseOptionKey("sorttaburl");
	parseOptionKey("sorttabindex");
	parseOptionKey("crnt2lsttab");
	parseOptionKey("movetableft");
	parseOptionKey("movetabright");
	parseOptionKey("texttool");
	parseOptionKey("texttoolurl");
	parseOptionKey("multilink");
	parseOptionKey("scriptlist");
	parseOptionKey("hitahinttext");
	parseOptionKey("hitahinttexturl");
	parseOptionKey("extensionmanager");
	parseOptionKey("nomap",true);
	var ignoreallurls = keyconfig.ignoreurlary;
	for(var i = 0, l = ignoreallurls.length; i < l; i++){
		var ignurl = ignoreallurls[i];
		createExcludedItem("","ignoreurlary",ignurl,"excludcontainer",true,ignoreallurls,i,false)
	}
}
function parseOptionKey(optname,flg){
	var optkeyobj = keyconfig[optname];
	var keystr = "";
	if(optkeyobj){
		for(var i = 0, l = optkeyobj.length; i < l; i++){
			keystr = "";
			var keyary = optkeyobj[i];
			if(keyary){
				for(var ii = 0, ll = keyary.length; ii < ll; ii++){
					var key = keyary[ii];
					var subchar = "";
					var url = "";

					if(key.char){
						if(key.char == "nomap"){
							var keychar = "";
						}else{
							var keychar = key.char;
						}
					}else{
						var keychar = "";
					}

					if(ii != 0){
						subchar += " ";
					}
					if(key.ctrl){
						subchar += 'C-';
					}
					if(key.meta){
						subchar += 'M-';
					}

					if (/^[a-z]$/.test(keychar)){
						if(key.shift){
							keychar = keychar.toUpperCase();
						}
					}else{
						if(key.shift&&(keychar.length > 1)){
							subchar = 'S-';
						}
					}
					keystr += subchar+keychar;

					if(key.url){
						url = key.url;
					}
				}
				if(flg){
					createExcludedItem(keystr,optname,url,"excludcontainer",false,optkeyobj,i,false);
				}else{
					createOpenURLItem(keystr,optname,url,"actioncontainer",optkeyobj,i,false);
				}
			}
		}
	}
}
function createOpenURLItem(keyvalue,actvalue,urlvalue,prntelem,keyary,idx,fflg){
	addactindex++;
	var maincont = document.getElementById(prntelem);
	var cont = document.createElement("div");

	if(fflg){
		maincont.insertBefore(cont,maincont.firstChild);
	}else{
		maincont.appendChild(cont);
	}
	cont.setAttribute("class","actionitemclass");

	var imgcont = document.createElement("div");
	cont.appendChild(imgcont);
	imgcont.setAttribute("class","imgcontclass");
	var cimg = document.createElement("img");
	imgcont.appendChild(cimg);
	cimg.setAttribute("src","img/close.png");
	cimg.setAttribute("class","closeimgclass");
	cimg.index = addactindex;
	cimg.setAttribute("id","actionitemimg"+addactindex)

	var btncont = document.createElement("div");
	cont.appendChild(btncont);
	btncont.setAttribute("class","buttoncontclass");
	var btninpu = document.createElement("input");
	btncont.appendChild(btninpu);
	btninpu.setAttribute("type","button");
	btninpu.setAttribute("class","buttoninputclass");
	btninpu.value = keyvalue;
	btninpu.index = addactindex;
	btninpu.setAttribute("id","actionitembtn"+addactindex)

	var selinptcont = document.createElement("div");
	cont.appendChild(selinptcont);
	selinptcont.setAttribute("class","selcontclass");
	var slct = document.createElement("select");
	selinptcont.appendChild(slct);
	slct.setAttribute("class","actionselectclass");
	var urlcheckflg = createSelectAction(slct,actvalue);
	selinptcont.appendChild(document.createElement("br"));
	slct.value = actvalue;
	slct.index = addactindex;
	slct.setAttribute("id","actionitemselect"+addactindex)

	var inpt = document.createElement("input");
	selinptcont.appendChild(inpt);
	inpt.setAttribute("type","text");
	inpt.setAttribute("class","actionurlinputclass");
	inpt.setAttribute("placeholder","URL");

	if(urlvalue&&(urlvalue.indexOf("chrome_://") != 0)){
		inpt.value = urlvalue;
	}else{
		inpt.value = "";
	}

	inpt.index = addactindex;
	inpt.setAttribute("id","actioniteminput"+addactindex);

	if(!urlcheckflg){
		inpt.style.display = "none";
	}

	var exbtn = document.createElement("input");
	selinptcont.appendChild(exbtn);
	exbtn.type = "button"
	exbtn.value = "Extension Manager"
	exbtn.index = idx;
	exbtn.setAttribute("id","extensionitemselect"+addactindex);
	exbtn.setAttribute("class","openextensionbtn");

	if(actvalue === "extensionmanager"){
		exbtn.value = "Extension Manager"
		exbtn.style.display = "inline";
		exbtn.addEventListener("click",function(e){
			showExtensionManager(idx);
		},false);
	}else if(actvalue === "scriptlist"){
		exbtn.value = "Scripts"
		exbtn.style.display = "inline";
		exbtn.addEventListener("click",function(e){
			showUserScriptModal();
		},false);
	}else{
		exbtn.style.display = "none";
	}

	attachElementEvent(cimg,btninpu,slct,inpt,keyary,idx,actvalue);
	if(fflg){
		cont.style.background = "yellow";
		setTimeout(function(){
			cont.style.background = "";
		},300);
	}
}
function attachElementEvent(cimg,btninpu,slct,inpt,keyary,idx,actvalue){
	cimg.addEventListener("click",function cimgevent(e){clickCloseButton(e,keyary,idx)},false)
	btninpu.addEventListener('keydown',function btndevent(e){keyEventObject(e,keyary,idx,actvalue,false);}, true);
	inpt.addEventListener("change",function slctevent(e){changeActionURLText(e,keyary,idx)},false);
	slct.addEventListener("mousedown",function(e){showaddCommandWrap(e,keyary,idx)},false);
}
function removeElementEvent(cimg,btninpu,slct,inpt,exbtn){
	replaceelem(cimg);
	replaceelem(btninpu);
	replaceselelem(slct);
	replaceelem(inpt);
	replaceelem(exbtn);

	function replaceelem (oldelem){
		var idx = oldelem.index;
		var newelement = oldelem.cloneNode(true);
		newelement.index = idx;
		oldelem.parentNode.replaceChild(newelement, oldelem);
	}
	function replaceselelem(oldelem){
		var val = oldelem.value;
		var idx = oldelem.index;
		var newelement = oldelem.cloneNode(true);
		newelement.index = idx;
		newelement.value = val;
		oldelem.parentNode.replaceChild(newelement, oldelem);
	}
}
function createExcludedItem(keyvalue,actvalue,urlvalue,prntelem,allflg,keyary,idx,fflg){
	addexpindex++;
	var maincont = document.getElementById(prntelem);
	var cont = document.createElement("div");

	if(fflg){
		maincont.insertBefore(cont,maincont.firstChild);
	}else{
		maincont.appendChild(cont);
	}
	cont.setAttribute("class","actionitemclass");

	var imgcont = document.createElement("div");
	cont.appendChild(imgcont);
	imgcont.setAttribute("class","imgcontclass");
	var cimg = document.createElement("img");
	imgcont.appendChild(cimg);
	cimg.setAttribute("src","img/close.png");
	cimg.setAttribute("class","closeimgclass");
	cimg.index = addexpindex;
	cimg.setAttribute("id","exactionitemimg"+addexpindex)

	var btncont = document.createElement("div");
	cont.appendChild(btncont);
	btncont.setAttribute("class","buttoncontclass");
	var btninpu = document.createElement("input");
	btncont.appendChild(btninpu);
	btninpu.setAttribute("type","button");
	btninpu.setAttribute("class","buttoninputclass");
	btninpu.index = addexpindex;
	btninpu.value = keyvalue;
	btninpu.setAttribute("id","exactionitembtn"+addexpindex)

	var selinptcont = document.createElement("div");
	cont.appendChild(selinptcont);
	selinptcont.setAttribute("class","selcontclass");
	var allkeylbl = document.createElement("label");
	selinptcont.appendChild(allkeylbl);
	allkeylbl.setAttribute("class","allkeylabel");

	var chkbox = document.createElement("input");
	selinptcont.appendChild(chkbox);
	chkbox.setAttribute("type","checkbox");
	chkbox.index = addexpindex;
	chkbox.setAttribute("id","exactionitemchkbox"+addexpindex)

	allkeylbl.appendChild(chkbox)
	allkeylbl.appendChild(document.createTextNode("ALL KEYS"))
	selinptcont.appendChild(document.createElement("br"));

	var inpt = document.createElement("input");
	selinptcont.appendChild(inpt);
	inpt.setAttribute("type","text");
	inpt.setAttribute("class","actionurlinputclass");
	inpt.setAttribute("placeholder","URL");
	inpt.index = addexpindex;

	if(urlvalue&&(urlvalue.indexOf("chrome_://") != 0)){
		inpt.value = urlvalue;
	}else{
		inpt.value = "";
	}
	inpt.setAttribute("id","exactioniteminput"+addexpindex)

	if(allflg){
		btncont.style.visibility = "hidden";
		chkbox.checked = true;
	}
	attachExElementEvent(cimg,btninpu,chkbox,inpt,keyary,idx,actvalue,allflg);
	if(fflg){
		cont.style.background = "yellow";
		setTimeout(function(){
			cont.style.background = "";
		},300)
	}
}
function attachExElementEvent(cimg,btninpu,chkbox,inpt,keyary,idx,actvalue,allflg){
	cimg.addEventListener("click",function(e){clickCloseButton(e,keyary,idx)},false)
	btninpu.addEventListener('keydown',function(e){keyEventObject(e,keyary,idx,actvalue,true);}, true);
	if(allflg){
		chkbox.addEventListener("change",function(e){changeIgnoreCheckbox(e,keyary,idx,true,actvalue)},false);
		inpt.addEventListener("change",function(e){changeIgnoreAllText(e,keyary,idx)},false);
	}else{
		chkbox.addEventListener("change",function(e){changeIgnoreCheckbox(e,keyary,idx,false,actvalue)},false);
		inpt.addEventListener("change",function(e){changeActionURLText(e,keyary,idx)},false);
	}
}
function removeExElementEvent(cimg,btninpu,chkbox,inpt){
	replaceelem(cimg);
	replaceelem(btninpu);
	replaceelem(chkbox);
	replaceelem(inpt);
	function replaceelem (oldelem){
		var idx = oldelem.index;
		var newelement = oldelem.cloneNode(true);
		newelement.index = idx;
		oldelem.parentNode.replaceChild(newelement, oldelem);
	}
}
function changeActionURLText(e,ary,idx){
	var row = e.currentTarget;
	var value = row.value;
    value = value.replace(/^\s+|\s+$/g, "");
    if(ary[idx]){
    	var keyary = ary[idx];
    	for(var i = 0, l = keyary.length; i < l; i++){
			keyary[i].url = value;
    	}    	
    }
	checkObject();   
}
function clickCloseButton(e,ary,idx){
	var row = e.currentTarget;
	row.style.visibility = "hidden";
	ary[idx] = null;
	checkObject();
	var pprntnd = row.parentNode.parentNode;
	pprntnd.style.opacity = 0;
	pprntnd.style.background = "black";
	setTimeout(function(){
		pprntnd.parentNode.removeChild(pprntnd);
	},400);
}
function getExteinsonArray(){
	var lclobj = localStorage.getItem("_extension__settings");
	if(lclobj){
		extensionsettingarray = JSON.parse(lclobj);
		if(keyconfig.extensionmanager&&keyconfig.extensionmanager.length < extensionsettingarray.length){
			extensionsettingarray.length = keyconfig.extensionmanager.length;
			setExteinsonArray();
		}
	}
}
function setExteinsonArray(){
	var nary = [];
	for (var i = 0; i < extensionsettingarray.length; i++) {
		var item = extensionsettingarray[i];
		if(item){
			nary.push(item);
		}
	};
	localStorage.setItem("_extension__settings",JSON.stringify(nary));
}
function removeExtensionSetting(){
	localStorage.removeItem("_extension__settings");
}
function showExtensionManager(idx){
	var hdiv = document.getElementById("addextbuttondiv");
	var cont = document.getElementById("addextbuttoncontainer");
	var whei = parseInt(window.innerHeight*0.84);
	cont.style.height = whei+"px";
	hdiv.style.display = "block";
	createExtensionMenu(idx);
}
function createExtensionMenu(extidx){
    chrome.management.getAll(function(exinfoary){
		var tb2cont = document.getElementById("extensiontable1");
		tb2cont.innerHTML = "";
		var tr = document.createElement("tr");
		tb2cont.appendChild(tr);
		var parentdvi = document.createElement("td");
		tr.appendChild(parentdvi);
		var nflg = false;
		var disableidarray = extensionsettingarray[extidx];
		if(!disableidarray){
			nflg = true;
			disableidarray = [];
		}

        for(var i = 0; i < exinfoary.length; i++){
        	var item = exinfoary[i];

            var exttldiv = document.createElement("div");
            parentdvi.appendChild(exttldiv);
            exttldiv.setAttribute("class","extensionitemclass");

            var ttllbl = document.createElement("label");
            exttldiv.appendChild(ttllbl);
            ttllbl.addEventListener("mousedown",function(e){
				e.stopPropagation();
			},true);

            var extchk = document.createElement("input");
            ttllbl.appendChild(extchk);
            extchk.setAttribute("type","checkbox");
            extchk.value = item.id;
            extchk.addEventListener("change",function(e){
            	clickelem(this.value,this.checked,disableidarray,extidx);
            },false);
            ttllbl.appendChild(document.createTextNode(exinfoary[i].name));

            var extobj = {};
            extobj.id = item.id;
        	extobj.enabled = item.enabled;
    		if(item.enabled){
    			extchk.checked = true;
    		}else{
    			extchk.checked = false;
    		}
            if(!nflg){
            	var ritem = setarray(extobj.id,disableidarray);
            	if(ritem){
            		if(ritem.enabled){
            			extchk.checked = true;
            		}else{
            			extchk.checked = false;
            		}
            	}else{
	            	disableidarray.push(extobj);
            	}
            }else{
            	disableidarray.push(extobj);
            }
        }
		setval(extidx,disableidarray);
    });
	function setarray(exid,disableidarray){
		var flg = false;
		for (var i = 0; i < disableidarray.length; i++) {
			var item = disableidarray[i];
			if(item.id === exid){
				return item;
			}
		};
		return null;
	}
	function clickelem(exid,checked,disableidarray,extidx){
		for (var i = 0; i < disableidarray.length; i++) {
			var item = disableidarray[i];
			if(item.id === exid){
				item.enabled = checked;
				setval(extidx,disableidarray)
				return;
			}
		};
	}
	function setval(idx,disableidarray){
		extensionsettingarray[idx] = disableidarray;
		setExteinsonArray();
	}
}
function changeActionSelect(e,ary,idx,elemid){
	var row = e.srcElement;
	var newactvalue = row.value;
	var mvary = ary[idx];
	var newidx = 0;
	var eindex = elemid.substring(16);

	var cimg = document.getElementById("actionitemimg"+eindex);
	var btninpu = document.getElementById("actionitembtn"+eindex);
	var slct = document.getElementById("actionitemselect"+eindex);
	var inpt = document.getElementById("actioniteminput"+eindex);
	var exbtn = document.getElementById("extensionitemselect"+eindex);

	removeElementEvent(cimg,btninpu,slct,inpt,exbtn);

	cimg = document.getElementById("actionitemimg"+eindex);
	btninpu = document.getElementById("actionitembtn"+eindex);
	slct = document.getElementById("actionitemselect"+eindex);
	inpt = document.getElementById("actioniteminput"+eindex);
	exbtn = document.getElementById("extensionitemselect"+eindex);

	if(newactvalue == "openurlcrnt"){
		inpt.style.display = "inline";
	}else if(newactvalue == "openurlnewtab"){
		inpt.style.display = "inline";
	}else if(newactvalue == "openurlnewtabbg"){
		inpt.style.display = "inline";
	}else if(newactvalue == "searchweb"){
		inpt.style.display = "inline";
	}else if(newactvalue == "openreurlcrnt"){
		inpt.style.display = "inline";
	}else if(newactvalue == "openreurlnewtab"){
		inpt.style.display = "inline";
	}else if(newactvalue == "openreurlnewtabbg"){
		inpt.style.display = "inline";
	}else if(newactvalue == "searchwebcrnt"){
		inpt.style.display = "inline";
	}else if(newactvalue == "sendurltoweb"){
		inpt.style.display = "inline";
	}else if(newactvalue == "sendurltowebnewtab"){
		inpt.style.display = "inline";
	}else if(newactvalue == "sendurltowebbgtab"){
		inpt.style.display = "inline";
	}else if(newactvalue == "sendurltowebcontinuous"){
		inpt.style.display = "inline";
	}else if(newactvalue == "texttoolurl"){
		inpt.style.display = "inline";
	}else if(newactvalue == "hitahinttexturl"){
		inpt.style.display = "inline";
	}else{
		inpt.style.display = "none";
	}
	if(newactvalue == "extensionmanager"){
		exbtn.value = "Extension Manager"
		exbtn.style.display = "inline";
		exbtn.addEventListener("click",function(e){
			showExtensionManager(idx);
		},false);
	}else if(newactvalue == "scriptlist"){
		exbtn.value = "Scripts"
		exbtn.style.display = "inline";
		exbtn.addEventListener("click",function(e){
			showUserScriptModal();
		},false);
	}else{
		exbtn.style.display = "none";
	}
		
	ary[idx] = null;

	if(keyconfig[newactvalue]){
		keyconfig[newactvalue].push(mvary);
		newidx = keyconfig[newactvalue].length-1;
	}else{
		keyconfig[newactvalue] = [mvary];
		newidx = 0;
	}

	attachElementEvent(cimg,btninpu,slct,inpt,keyconfig[newactvalue],newidx,newactvalue);
	checkObject();
}
function hideUserScriptModal(e){
	var row = e.currentTarget;
	row.style.display = "none";
}
function showUserScriptModal(){
	var hdiv = document.getElementById("addscriptbuttondiv");
	hdiv.style.display = "block";
}
function clickAddScriptButton(){
	createScriptItem("");
}
function createScriptItem(inpuval,selno){
	scriptsourceidex++;
	var maincont = document.getElementById("scriptsourcellist");

	var cont = document.createElement("div");
	maincont.appendChild(cont);
	cont.setAttribute("class","scriptcontclass");

	var cimg = document.createElement("img");
	cont.appendChild(cimg);
	cimg.setAttribute("src","img/close.png");
	cimg.setAttribute("class","closeimgclass");
	cimg.index = scriptsourceidex;
	cimg.addEventListener("click",clickScriptCloseImg,false);

	var actslct = document.createElement("input");
	cont.appendChild(actslct);
	actslct.setAttribute("class","scriptsourcename");
	actslct.setAttribute("id","scriptsourceselect"+scriptsourceidex);
	actslct.setAttribute("placeholder","Script Name");
	actslct.index = scriptsourceidex;
	actslct.addEventListener("change",blurScriptSourceInput,false);
	if(selno)actslct.value = selno;

	var scont = document.createElement("div");
	cont.appendChild(scont);
	scont.setAttribute("class","scripttextareacont");
	var inpt = document.createElement("textarea");
	scont.appendChild(inpt);
	inpt.setAttribute("class","scriptsrcitemclass");
	inpt.index = scriptsourceidex;
	inpt.setAttribute("placeholder","alert(1)");
	inpt.value = inpuval;
	inpt.addEventListener("blur",blurScriptSourceInput,false);
	inpt.setAttribute("id","scriptsourceinput"+scriptsourceidex);
}
function clickScriptCloseImg(e){
	var eindx = e.currentTarget.index;
	var row = document.getElementById("scriptsourceinput"+eindx);
	row.focus();
	row.value = "";
	row.blur();
}
function blurScriptSourceInput(e){
	var eindx = e.currentTarget.index;
	var row = document.getElementById("scriptsourceinput"+eindx);
	var val = row.value;
	val = val.replace(/^\s+|\s+$/g, "");
	if(val){
		setScriptSourceOption(val,row.index);
	}else{
		if(e.srcElement.tagName.toUpperCase() === "TEXTAREA"){
			setScriptSourceOption(null,row.index)
			var prntnd = row.parentNode.parentNode;
			prntnd.parentNode.removeChild(prntnd);	
		}
	}
}
function setScriptSourceOption(val,index){
	if(val){
		var actelem = document.getElementById("scriptsourceselect"+index);
		var optionobj = {};
		optionobj.url = val;
		optionobj.sel = actelem.value;	
		scriptsourcearray[index] = optionobj;
	}else{
		scriptsourcearray[index] = null;
	}
	var opt =[];
	for(var i = 0; i < scriptsourcearray.length; i++){
		if(scriptsourcearray[i]){
			opt.push(scriptsourcearray[i]);
		}
	}
	localStorage.setItem("script__list",JSON.stringify(opt))
}
function changeIgnoreAllText(e,keyary,idx){
	var row = e.currentTarget;
	var value = row.value;
    value = value.replace(/^\s+|\s+$/g, "");
	keyary[idx] = value;
	checkObject();   
}
function changeIgnoreCheckbox(e,ary,idx,allflg,actvalue){
	var row = e.currentTarget;
	var eindex = row.index;
	var newidx = 0;

	var cimg = document.getElementById("exactionitemimg"+eindex);
	var btninpu = document.getElementById("exactionitembtn"+eindex);
	var chkbox = document.getElementById("exactionitemchkbox"+eindex);
	var inpt = document.getElementById("exactioniteminput"+eindex);

	removeExElementEvent(cimg,btninpu,chkbox,inpt);

	cimg = document.getElementById("exactionitemimg"+eindex);
	btninpu = document.getElementById("exactionitembtn"+eindex);
	chkbox = document.getElementById("exactionitemchkbox"+eindex);
	inpt = document.getElementById("exactioniteminput"+eindex);

	ary[idx] = null;

	var inputval = inpt.value;
	if(!inputval){
		inputval = "chrome_://chrome.chrome"
	}
	if(allflg){
		var key = {};
		key.char = "nomap";
		key.ctrl = false;
		key.meta = false;
		key.shift = false;
		key.url = inputval
		if(keyconfig["nomap"]){
			keyconfig["nomap"].push([key]);
			newidx = keyconfig["nomap"].length-1;
		}else{
			keyconfig["nomap"] = [[key]];
			newidx = 0;
		}
		btninpu.value = "";
		btninpu.style.visibility = "visible";
		attachExElementEvent(cimg,btninpu,chkbox,inpt,keyconfig["nomap"],newidx,"nomap",false);
	}else{
		keyconfig.ignoreurlary.push(inputval);
		newidx = keyconfig.ignoreurlary.length-1;
		btninpu.style.visibility = "hidden";
		attachExElementEvent(cimg,btninpu,chkbox,inpt,keyconfig.ignoreurlary,newidx,"nomap",true);
	}
	checkObject();
}
function checkObject(){
	localStorage.setItem("option__object",JSON.stringify(keyconfig));
	var optobj = JSON.parse(localStorage.getItem("option__object"));
	checkKeyObjArray(optobj,"drawhint");
	checkKeyObjArray(optobj,"drawhintn");
	checkKeyObjArray(optobj,"drawhintnb");
	checkKeyObjArray(optobj,"getlinkttl");
	checkKeyObjArray(optobj,"getlinkurl");
	checkKeyObjArray(optobj,"getlinkurlttl");
	checkKeyObjArray(optobj,"getlinkurlttlhtml");
	checkKeyObjArray(optobj,"sendurltoweb");
	checkKeyObjArray(optobj,"sendurltowebnewtab");
	checkKeyObjArray(optobj,"sendurltowebbgtab");
	checkKeyObjArray(optobj,"sendurltowebcontinuous");
	checkKeyObjArray(optobj,"capfull");
	checkKeyObjArray(optobj,"capsfull");
	checkKeyObjArray(optobj,"caphalf");
	checkKeyObjArray(optobj,"capshalf");
	checkKeyObjArray(optobj,"scrlup");
	checkKeyObjArray(optobj,"scrldown");
	checkKeyObjArray(optobj,"scrlleft");
	checkKeyObjArray(optobj,"scrlright");
	checkKeyObjArray(optobj,"scrltop");
	checkKeyObjArray(optobj,"scrlbottom");
	checkKeyObjArray(optobj,"scrlfup");
	checkKeyObjArray(optobj,"scrlfdown");
	checkKeyObjArray(optobj,"scrlhup");
	checkKeyObjArray(optobj,"scrlhdown");
	checkKeyObjArray(optobj,"selectfirst");
	checkKeyObjArray(optobj,"selectlast");
	checkKeyObjArray(optobj,"selectltab");
	checkKeyObjArray(optobj,"selectrtab");
	checkKeyObjArray(optobj,"focusnextwindow");
	checkKeyObjArray(optobj,"forwardhistory");
	checkKeyObjArray(optobj,"backhistory");
	checkKeyObjArray(optobj,"searchwebcrnt");
	checkKeyObjArray(optobj,"searchweb");
	checkKeyObjArray(optobj,"openbookmarkcrnt");
	checkKeyObjArray(optobj,"openbookmark");
	checkKeyObjArray(optobj,"openhistorycrnt");
	checkKeyObjArray(optobj,"openhistory");
	checkKeyObjArray(optobj,"opentablist");
	checkKeyObjArray(optobj,"openurlcrnt");
	checkKeyObjArray(optobj,"openurlnewtab");
	checkKeyObjArray(optobj,"openurlnewtabbg");
	checkKeyObjArray(optobj,"openreurlcrnt");
	checkKeyObjArray(optobj,"openreurlnewtab");
	checkKeyObjArray(optobj,"openreurlnewtabbg");
	checkKeyObjArray(optobj,"autofocuskey");
	checkKeyObjArray(optobj,"blurelem");
	checkKeyObjArray(optobj,"closectab");
	checkKeyObjArray(optobj,"closeltabs");
	checkKeyObjArray(optobj,"closertabs");
	checkKeyObjArray(optobj,"closeothertabs");
	checkKeyObjArray(optobj,"closewindow");
	checkKeyObjArray(optobj,"restoretab");
	checkKeyObjArray(optobj,"pinunpintab");
	checkKeyObjArray(optobj,"createnewtab");
	checkKeyObjArray(optobj,"createnewtabb");
	checkKeyObjArray(optobj,"createnewwindow");
	checkKeyObjArray(optobj,"curltoclip");
	checkKeyObjArray(optobj,"curltttltoclip");
	checkKeyObjArray(optobj,"curltttlatagtoclip");
	checkKeyObjArray(optobj,"linklabelnext");
	checkKeyObjArray(optobj,"linklabelprev");
	checkKeyObjArray(optobj,"gotoprntdir");
	checkKeyObjArray(optobj,"gotoroot");
	checkKeyObjArray(optobj,"setmark");
	checkKeyObjArray(optobj,"jumpmark");
    checkKeyObjArray(optobj,"addbookmark");
    checkKeyObjArray(optobj,"addallbookmark");
    checkKeyObjArray(optobj,"opendlfolder");
    checkKeyObjArray(optobj,"imgveiwtab");
    checkKeyObjArray(optobj,"imgveiwtbg");
    checkKeyObjArray(optobj,"imgsave");
    checkKeyObjArray(optobj,"imgsaveas");
    checkKeyObjArray(optobj,"imgsearch");
    checkKeyObjArray(optobj,"imgurlcopy");
	checkKeyObjArray(optobj,"splitwindv");
	checkKeyObjArray(optobj,"splitwindh");
	checkKeyObjArray(optobj,"reload");
	checkKeyObjArray(optobj,"reloadall");
	checkKeyObjArray(optobj,"stopload");
	checkKeyObjArray(optobj,"stopall");
	checkKeyObjArray(optobj,"superreload");
	checkKeyObjArray(optobj,"searchtextii");
	checkKeyObjArray(optobj,"searchtextip");
	checkKeyObjArray(optobj,"clonetab");
	checkKeyObjArray(optobj,"storetabs");
	checkKeyObjArray(optobj,"preeditelem");
	checkKeyObjArray(optobj,"nexteditelem");
	checkKeyObjArray(optobj,"createmhtml");
	checkKeyObjArray(optobj,"shorttoclip");
	checkKeyObjArray(optobj,"commandmode");
	checkKeyObjArray(optobj,"openoptpage");
	checkKeyObjArray(optobj,"sorttabtitle");
	checkKeyObjArray(optobj,"sorttaburl");
	checkKeyObjArray(optobj,"sorttabindex");
	checkKeyObjArray(optobj,"crnt2lsttab");
	checkKeyObjArray(optobj,"movetableft");
	checkKeyObjArray(optobj,"movetabright");
	checkKeyObjArray(optobj,"texttool");
	checkKeyObjArray(optobj,"texttoolurl");
	checkKeyObjArray(optobj,"multilink");
	checkKeyObjArray(optobj,"scriptlist");
	checkKeyObjArray(optobj,"hitahinttext");
	checkKeyObjArray(optobj,"hitahinttexturl");
	checkKeyObjArray(optobj,"extensionmanager",true);
	checkKeyObjArray(optobj,"nomap");

	var ignoreallurls = optobj.ignoreurlary;
	for(var i = ignoreallurls.length-1; 0 <= i; i--){
		var ignurl = ignoreallurls[i];
		if(ignurl === null){
			ignoreallurls.splice(i,1);
		}
	}
	storeOptionObject(optobj);
}
function checkKeyObjArray(optobj,optname,extenflg){
	var keyobjary = optobj[optname];
	if(keyobjary){
		for(var i = keyobjary.length-1; 0 <= i; i--){
			var keyobj = keyobjary[i];
			if(keyobj === null){
				if(extenflg){
					extensionsettingarray[i] = null;
				}
				keyobjary.splice(i,1);
			}else if(keyobj){
				for(var ii = 0, ll = keyobj.length; ii < ll; ii++){
					var key = keyobj[ii]
					if(!key.char){
						key.char = "nomap";
					}
				}
			}
		}
		if(keyobjary.length < 1){
			optobj[optname] = null;
		}
		if(extenflg){
			setExteinsonArray();
		}
	}
}
function storeOptionObject(optobj){
    var stobj = {};
    stobj["__settings____"] = optobj;
    chrome.storage.local.set(stobj,function(){
	    chrome.runtime.getBackgroundPage(function(bgpage){
			bgpage.setOptionObject(optobj);
			localStorage.setItem("option__object",JSON.stringify(optobj));
		});
    })
}
function clickRestoreButton(){
	keyconfig = {};
	localStorage.removeItem("option__object");
    chrome.runtime.getBackgroundPage(function(bg){
        var callback = function(){
			setTimeout(function(){
				location.reload();
			},700)      	
        };
        bg.setDefaultOption(callback);
    });	
}
function saveSettingText() {
	var optobj = localStorage.getItem("option__object");
	if(optobj){
		var lclobj = localStorage.getItem("alias_object");
		if(lclobj){
			var jsonobj = JSON.parse(lclobj);
			var ojsonobj = JSON.parse(optobj);
			ojsonobj.aliasary = jsonobj;
			optobj = JSON.stringify(ojsonobj);
		}
		var lclobj = localStorage.getItem("script__list");
		if(lclobj){
			var jsonobj = JSON.parse(lclobj);
			var ojsonobj = JSON.parse(optobj);
			ojsonobj.script__list = jsonobj;
			optobj = JSON.stringify(ojsonobj);
		}
	    var a = document.createElement('a');
	    a.href = 'data:text/plain,' + encodeURIComponent(optobj);
	    a.download = "keyconfig.txt";
		var types = ['click'];
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
			a.dispatchEvent(clicker);
		}
	}
}
function importSettingText(){
	document.getElementById("hiddenfilebutton").click();
}
function fileHandler(e){
	var file = this.files[0];
	if(file.type == "text/plain"){
		var fr = new FileReader();
	    fr.onload = function () {
	    	var txtobj = fr.result;
			var jsonobj = JSON.parse(txtobj);
			if(jsonobj.cmdpos&&jsonobj.hstrside){
				if(jsonobj.aliasary){
					var aliasobj = jsonobj.aliasary;
					localStorage.setItem("alias_object",JSON.stringify(aliasobj));
				    chrome.runtime.getBackgroundPage(function(bg){
				    	bg.setAliastoBookmarks();
					});
					delete jsonobj.aliasary;
				}
				if(jsonobj.script__list){
					var scrptobj = jsonobj.script__list;
					localStorage.setItem("script__list",JSON.stringify(scrptobj));
					delete jsonobj.script__list;
				}
				keyconfig = {};
				keyconfig = jsonobj;
				checkObject();
				setTimeout(function(){
					location.reload();
				},1000)
			}
	    };
	    fr.readAsText(file);
	}
}
function createHiddenButton(){
	var btn = document.createElement("input");
	document.body.appendChild(btn);
	btn.style.visibility = "hidden";
	btn.setAttribute("type","file");
	btn.setAttribute("id","hiddenfilebutton");
	btn.setAttribute("accept","text/plain");
	btn.addEventListener("change",fileHandler,false);
}
function keyEventObject(e,keyary,idx,actvalue,exflg){
	var row = e.currentTarget;
	function pushKeyEvent(e){
		e.stopPropagation();
		e.preventDefault();	
		if(e.keyCode === 16){
			return "";
		}else if(e.keyCode === 17){
			return "";
		}else if(e.keyCode === 18){
			return "";
		}
		var key = KeyParser(e);
		var keystr = get_key(e);

		if(key){
			keyarray.push(key);
			keystrarray.push(keystr);

			var rflg = checkOptionAction(e,keyarray,actvalue);
			if(rflg&&(!exflg)){
				clearTimeout(keyinputtimeid);
				keyarray.length = 0;
				keystrarray.length = 0;

				row.style.background = "red";
				setTimeout(function(){
					row.style.background = "";
				},800)
			}else{
				clearTimeout(keyinputtimeid);
				keyinputtimeid = setTimeout(function(){
					var copyary = keyarray.concat();

					if((keyary[idx][0])&&(keyary[idx][0].url)){
						for(var i = 0, l = copyary.length; i < l; i++){
							copyary[i].url = keyary[idx][0].url;
						}
					}
					keyary[idx] = copyary;
					row.value = keystrarray.toString().replace(/,/g, " ");
					checkObject();
					keyarray.length = 0;
					keystrarray.length = 0;
				},keyinputtime);						
			}
		}
	}
	function checkOptionAction(e,keyary,actvalue){
		if(keyconfig.drawhint&&(checkOptionArray(e,keyary,keyconfig.drawhint))){
			if("drawhint" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.drawhintn&&(checkOptionArray(e,keyary,keyconfig.drawhintn))){
			if("drawhintn" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.drawhintnb&&(checkOptionArray(e,keyary,keyconfig.drawhintnb))){
			if("drawhintnb" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.getlinkttl&&(checkOptionArray(e,keyary,keyconfig.getlinkttl))){
			if("getlinkttl" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.getlinkurl&&(checkOptionArray(e,keyary,keyconfig.getlinkurl))){
			if("getlinkurl" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.getlinkurlttl&&(checkOptionArray(e,keyary,keyconfig.getlinkurlttl))){
			if("getlinkurlttl" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.getlinkurlttlhtml&&(checkOptionArray(e,keyary,keyconfig.getlinkurlttlhtml))){
			if("getlinkurlttlhtml" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.capfull&&(checkOptionArray(e,keyary,keyconfig.capfull))){
			if("capfull" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.capsfull&&(checkOptionArray(e,keyary,keyconfig.capsfull))){
			if("capsfull" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.caphalf&&(checkOptionArray(e,keyary,keyconfig.caphalf))){
			if("caphalf" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.capshalf&&(checkOptionArray(e,keyary,keyconfig.capshalf))){
			if("capshalf" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrldown&&(checkOptionArray(e,keyary,keyconfig.scrldown))){
			if("scrldown" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrlup&&(checkOptionArray(e,keyary,keyconfig.scrlup))){
			if("scrlup" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrlleft&&(checkOptionArray(e,keyary,keyconfig.scrlleft))){
			if("scrlleft" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrlright&&(checkOptionArray(e,keyary,keyconfig.scrlright))){
			if("scrlright" ==  actvalue){
				return false;
			}else{
				return true;
			}	
		}else if(keyconfig.scrlhdown&&(checkOptionArray(e,keyary,keyconfig.scrlhdown))){
			if("scrlhdown" ==  actvalue){
				return false;
			}else{
				return true;
			}	
		}else if(keyconfig.scrlhup&&(checkOptionArray(e,keyary,keyconfig.scrlhup))){
			if("scrlhup" ==  actvalue){
				return false;
			}else{
				return true;
			}	
		}else if(keyconfig.scrlfdown&&(checkOptionArray(e,keyary,keyconfig.scrlfdown))){
			if("scrlfdown" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrlfup&&(checkOptionArray(e,keyary,keyconfig.scrlfup))){
			if("scrlfup" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrltop&&(checkOptionArray(e,keyary,keyconfig.scrltop))){
			if("scrltop" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scrlbottom&&(checkOptionArray(e,keyary,keyconfig.scrlbottom))){
			if("scrlbottom" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.reload&&(checkOptionArray(e,keyary,keyconfig.reload))){
			if("reload" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.superreload&&(checkOptionArray(e,keyary,keyconfig.superreload))){
			if("superreload" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.reloadall&&(checkOptionArray(e,keyary,keyconfig.reloadall))){
			if("reloadall" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.stopload&&(checkOptionArray(e,keyary,keyconfig.stopload))){
			if("stopload" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.stopall&&(checkOptionArray(e,keyary,keyconfig.stopall))){
			if("stopall" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.autofocuskey&&(checkOptionArray(e,keyary,keyconfig.autofocuskey))){
			if("autofocuskey" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.blurelem&&(checkOptionArray(e,keyary,keyconfig.blurelem))){
			if("blurelem" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.nexteditelem&&(checkOptionArray(e,keyary,keyconfig.nexteditelem))){
			if("nexteditelem" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.preeditelem&&(checkOptionArray(e,keyary,keyconfig.preeditelem))){
			if("preeditelem" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.curltoclip&&(checkOptionArray(e,keyary,keyconfig.curltoclip))){
			if("curltoclip" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.curltttltoclip&&(checkOptionArray(e,keyary,keyconfig.curltttltoclip))){
			if("curltttltoclip" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.curltttlatagtoclip&&(checkOptionArray(e,keyary,keyconfig.curltttlatagtoclip))){
			if("curltttlatagtoclip" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.shorttoclip&&(checkOptionArray(e,keyary,keyconfig.shorttoclip))){
			if("shorttoclip" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.commandmode&&(checkOptionArray(e,keyary,keyconfig.commandmode))){
			if("commandmode" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openoptpage&&(checkOptionArray(e,keyary,keyconfig.openoptpage))){
			if("openoptpage" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sorttabtitle&&(checkOptionArray(e,keyary,keyconfig.sorttabtitle))){
			if("sorttabtitle" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sorttaburl&&(checkOptionArray(e,keyary,keyconfig.sorttaburl))){
			if("sorttaburl" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sorttabindex&&(checkOptionArray(e,keyary,keyconfig.sorttabindex))){
			if("sorttabindex" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.crnt2lsttab&&(checkOptionArray(e,keyary,keyconfig.crnt2lsttab))){
			if("crnt2lsttab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.movetableft&&(checkOptionArray(e,keyary,keyconfig.movetableft))){
			if("movetableft" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.movetabright&&(checkOptionArray(e,keyary,keyconfig.movetabright))){
			if("movetabright" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.texttool&&(checkOptionArray(e,keyary,keyconfig.texttool))){
			if("texttool" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.multilink&&(checkOptionArray(e,keyary,keyconfig.multilink))){
			if("multilink" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.scriptlist&&(checkOptionArray(e,keyary,keyconfig.scriptlist))){
			if("scriptlist" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.texttoolurl&&(checkOptionArray(e,keyary,keyconfig.texttoolurl))){
			if("texttoolurl" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.hitahinttext&&(checkOptionArray(e,keyary,keyconfig.hitahinttext))){
			if("hitahinttext" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.hitahinttexturl&&(checkOptionArray(e,keyary,keyconfig.hitahinttexturl))){
			if("hitahinttexturl" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sendurltoweb&&(checkOptionArray(e,keyary,keyconfig.sendurltoweb))){
			if("sendurltoweb" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sendurltowebnewtab&&(checkOptionArray(e,keyary,keyconfig.sendurltowebnewtab))){
			if("sendurltowebnewtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sendurltowebbgtab&&(checkOptionArray(e,keyary,keyconfig.sendurltowebbgtab))){
			if("sendurltowebbgtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.sendurltowebcontinuous&&(checkOptionArray(e,keyary,keyconfig.sendurltowebcontinuous))){
			if("sendurltowebcontinuous" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.extensionmanager&&(checkOptionArray(e,keyary,keyconfig.extensionmanager))){
			if("extensionmanager" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.backhistory&&(checkOptionArray(e,keyary,keyconfig.backhistory))){
			if("backhistory" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.forwardhistory&&(checkOptionArray(e,keyary,keyconfig.forwardhistory))){
			if("forwardhistory" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.closectab&&(checkOptionArray(e,keyary,keyconfig.closectab))){
			if("closectab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.closeothertabs&&(checkOptionArray(e,keyary,keyconfig.closeothertabs))){
			if("closeothertabs" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.closertabs&&(checkOptionArray(e,keyary,keyconfig.closertabs))){
			if("closertabs" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.closeltabs&&(checkOptionArray(e,keyary,keyconfig.closeltabs))){
			if("closeltabs" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.pinunpintab&&(checkOptionArray(e,keyary,keyconfig.pinunpintab))){
			if("pinunpintab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.selectrtab&&(checkOptionArray(e,keyary,keyconfig.selectrtab))){
			if("selectrtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.focusnextwindow&&(checkOptionArray(e,keyary,keyconfig.focusnextwindow))){
			if("focusnextwindow" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.gotoroot&&(checkOptionArray(e,keyary,keyconfig.gotoroot))){
			if("gotoroot" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.setmark&&(checkOptionArray(e,keyary,keyconfig.setmark))){
			if("setmark" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.jumpmark&&(checkOptionArray(e,keyary,keyconfig.jumpmark))){
			if("jumpmark" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.addbookmark&&(checkOptionArray(e,keyary,keyconfig.addbookmark))){
			if("addbookmark" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.addallbookmark&&(checkOptionArray(e,keyary,keyconfig.addallbookmark))){
			if("addallbookmark" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.opendlfolder&&(checkOptionArray(e,keyary,keyconfig.opendlfolder))){
			if("opendlfolder" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.imgveiwtab&&(checkOptionArray(e,keyary,keyconfig.imgveiwtab))){
			if("imgveiwtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.imgveiwtbg&&(checkOptionArray(e,keyary,keyconfig.imgveiwtbg))){
			if("imgveiwtbg" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.imgsave&&(checkOptionArray(e,keyary,keyconfig.imgsave))){
			if("imgsave" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.imgsaveas&&(checkOptionArray(e,keyary,keyconfig.imgsaveas))){
			if("imgsaveas" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.imgsearch&&(checkOptionArray(e,keyary,keyconfig.imgsearch))){
			if("imgsearch" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.imgurlcopy&&(checkOptionArray(e,keyary,keyconfig.imgurlcopy))){
			if("imgurlcopy" ==  actvalue){
				return false;
			}else{
				return true;
			}			
		}else if(keyconfig.splitwindv&&(checkOptionArray(e,keyary,keyconfig.splitwindv))){
			if("splitwindv" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.splitwindh&&(checkOptionArray(e,keyary,keyconfig.splitwindh))){
			if("splitwindh" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.selectltab&&(checkOptionArray(e,keyary,keyconfig.selectltab))){
			if("selectltab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.selectfirst&&(checkOptionArray(e,keyary,keyconfig.selectfirst))){
			if("selectfirst" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.selectlast&&(checkOptionArray(e,keyary,keyconfig.selectlast))){
			if("selectlast" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.restoretab&&(checkOptionArray(e,keyary,keyconfig.restoretab))){
			if("restoretab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.clonetab&&(checkOptionArray(e,keyary,keyconfig.clonetab))){
			if("clonetab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.gotoprntdir&&(checkOptionArray(e,keyary,keyconfig.gotoprntdir))){
			if("gotoprntdir" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.createnewtab&&(checkOptionArray(e,keyary,keyconfig.createnewtab))){
			if("createnewtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.createnewtabb&&(checkOptionArray(e,keyary,keyconfig.createnewtabb))){
			if("createnewtabb" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.createnewwindow&&(checkOptionArray(e,keyary,keyconfig.createnewwindow))){
			if("createnewwindow" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.closewindow&&(checkOptionArray(e,keyary,keyconfig.closewindow))){
			if("closewindow" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openurlcrnt&&(checkOptionArray(e,keyary,keyconfig.openurlcrnt))){
			if("openurlcrnt" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openurlnewtab&&(checkOptionArray(e,keyary,keyconfig.openurlnewtab))){
			if("openurlnewtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openurlnewtabbg&&(checkOptionArray(e,keyary,keyconfig.openurlnewtabbg))){
			if("openurlnewtabbg" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openreurlcrnt&&(checkOptionArray(e,keyary,keyconfig.openreurlcrnt))){
			if("openreurlcrnt" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openreurlnewtab&&(checkOptionArray(e,keyary,keyconfig.openreurlnewtab))){
			if("openreurlnewtab" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openreurlnewtabbg&&(checkOptionArray(e,keyary,keyconfig.openreurlnewtabbg))){
			if("openreurlnewtabbg" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.searchweb&&(checkOptionArray(e,keyary,keyconfig.searchweb))){
			if("searchweb" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.searchwebcrnt&&(checkOptionArray(e,keyary,keyconfig.searchwebcrnt))){
			if("searchwebcrnt" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openbookmarkcrnt&&(checkOptionArray(e,keyary,keyconfig.openbookmarkcrnt))){
			if("openbookmarkcrnt" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openbookmark&&(checkOptionArray(e,keyary,keyconfig.openbookmark))){
			if("openbookmark" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openhistorycrnt&&(checkOptionArray(e,keyary,keyconfig.openhistorycrnt))){
			if("openhistorycrnt" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.openhistory&&(checkOptionArray(e,keyary,keyconfig.openhistory))){
			if("openhistory" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.opentablist&&(checkOptionArray(e,keyary,keyconfig.opentablist))){
			if("opentablist" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.linklabelnext&&(checkOptionArray(e,keyary,keyconfig.linklabelnext))){
			if("linklabelnext" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.linklabelprev&&(checkOptionArray(e,keyary,keyconfig.linklabelprev))){
			if("linklabelprev" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.searchtextii&&(checkOptionArray(e,keyary,keyconfig.searchtextii))){
			if("searchtextii" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.searchtextip&&(checkOptionArray(e,keyary,keyconfig.searchtextip))){
			if("searchtextip" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.createmhtml&&(checkOptionArray(e,keyary,keyconfig.createmhtml))){
			if("createmhtml" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}else if(keyconfig.storetabs&&(checkOptionArray(e,keyary,keyconfig.storetabs))){
			if("storetabs" ==  actvalue){
				return false;
			}else{
				return true;
			}
		}
		return false;
	}
	function checkOptionArray(e,keyary,optobjary){
		var flg = false;
		if(optobjary&&keyary){
			var len = optobjary.length;
			for(var i = 0; i < len; i++){
				flg = false;
				var optary = optobjary[i];
				if(optary){
					var len2 = optary.length;
					for(var ii = 0; ii < len2; ii++){
						var optkey = optary[ii];
						var key = keyary[ii];
						if(key&&optkey){
							if((key)&&(optkey.char == key.char)&&(optkey.ctrl == key.ctrl)&&(optkey.meta == key.meta)&&(optkey.shift == key.shift)){
								e.stopPropagation();
								e.preventDefault();
								if(optkey.url){
									flg = optkey.url;
								}else{
									flg = true;
								}
							}else{
								flg = false;
								break;
							}
						}else{
							flg = false;
							break;
						}
					}
					if(flg){
						return flg;
					}
				}
			}
		}
		return flg;
	}
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
	function KeyParser(evt){
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
		}else{
			var shiftKeysfix = /linux/i.test(navigator.platform) ? shiftLinuxkeys : shiftWinkeys;
			key.char = keyId[evt.keyIdentifier] || winkeys[evt.keyIdentifier] || evt.keyIdentifier;
		    if (evt.shiftKey && shiftKeysfix[evt.keyIdentifier]) key.char = shiftKeysfix[evt.keyIdentifier];
		    if (/^(Meta|Shift|Control|Alt)$/.test(key.char)) return "";
		}
		return key;
	}
	function get_key(evt) {
		var key = keyId[evt.keyIdentifier] || winkeys[evt.keyIdentifier] || evt.keyIdentifier,
		ctrl = evt.ctrlKey ? 'C-' : '',
		meta = (evt.metaKey || evt.altKey) ? 'M-' : '',
		shift = evt.shiftKey ? 'S-' : '';
		if(evt.key){
		    // if (/^(Meta|Shift|Control|Alt)$/.test(key.code)) return "";
			key = evt.key.toLowerCase();
		    if (/^(Backspace)$/.test(evt.code)) key = "BackSpace";
		    if (/^(Tab)$/.test(evt.code)) key = "Tab";
		    if (/^(Esc)$/.test(evt.code)) key = "Esc";
		    if (/^(Space)$/.test(evt.code)) key = "Space";
		    if (/^(Escape)$/.test(evt.code)) key = "Esc";
		    if (/^(Delete)$/.test(evt.code)) key = "Delete";
		    if (/^(Enter)$/.test(evt.code)) key = "Enter";
		    if (/^(Home)$/.test(evt.code)) key = "Home";
		    if (/^(End)$/.test(evt.code)) key = "End";
		    if (/^(ArrowLeft)$/.test(evt.code)) key = "Left";
		    if (/^(ArrowRight)$/.test(evt.code)) key = "Right";
		    if (/^(ArrowUp)$/.test(evt.code)) key = "Up";
		    if (/^(ArrowDown)$/.test(evt.code)) key = "Down";
		    if (/^(PageUp)$/.test(evt.code)) key = "PageUp";
		    if (/^(F\d\d?)$/.test(evt.code)) key = evt.code;
		}else{
			var shiftKeysfix = /linux/i.test(navigator.platform) ? shiftLinuxkeys : shiftWinkeys;
			if (evt.shiftKey && shiftKeysfix[evt.keyIdentifier]) key = shiftKeysfix[evt.keyIdentifier];
			if (/^(Meta|Shift|Control|Alt)$/.test(key)) return key;
		}
		if (evt.shiftKey) {
			if (/^[a-z]$/.test(key))
				return ctrl + meta + key.toUpperCase();
			if (/^(Enter|Space|BackSpace|Tab|Esc|Home|End|Left|Right|Up|Down|PageUp|PageDown|Delete|F\d\d?)$/.test(key))
				return ctrl + meta + shift + key;
		}
		return ctrl + meta + key;		
	}
	pushKeyEvent(e);
}
function createSelectAction(prntnd,actvalue){
	createSelectOption("hit a hint on/off","drawhint",prntnd);
	createSelectOption("hit a hint -newtab on/off","drawhintn",prntnd);
	createSelectOption("hit a hint -continuous on/off","drawhintnb",prntnd);
	createSelectOption("get link title","getlinkttl",prntnd);
	createSelectOption("get link url","getlinkurl",prntnd);
	createSelectOption("get link and title","getlinkurlttl",prntnd);
	createSelectOption("get link and title html","getlinkurlttlhtml",prntnd);
	createSelectOption("send URL to web service","sendurltoweb",prntnd);
	createSelectOption("send URL to web service in newtab","sendurltowebnewtab",prntnd);
	createSelectOption("send URL to web service in background tab","sendurltowebbgtab",prntnd);
	createSelectOption("send URL to web service -continuous","sendurltowebcontinuous",prntnd);
	createSelectOption("capture entire page","capfull",prntnd);
	createSelectOption("capture entire page (save dialog)","capsfull",prntnd);
	createSelectOption("capture visible part of page","caphalf",prntnd);
	createSelectOption("capture visible part of page (save dialog)","capshalf",prntnd);
	createSelectOption("scroll up","scrlup",prntnd);
	createSelectOption("scroll down","scrldown",prntnd);
	createSelectOption("scroll right","scrlright",prntnd);
	createSelectOption("scroll left","scrlleft",prntnd);
	createSelectOption("scroll to top","scrltop",prntnd);
	createSelectOption("scroll to bottom","scrlbottom",prntnd);
	createSelectOption("scroll up full page","scrlfup",prntnd);
	createSelectOption("scroll down full page","scrlfdown",prntnd);
	createSelectOption("scroll up half page","scrlhup",prntnd);
	createSelectOption("scroll down half page","scrlhdown",prntnd);
	createSelectOption("select first tab","selectfirst",prntnd);
	createSelectOption("select last tab","selectlast",prntnd);
	createSelectOption("select left tab","selectltab",prntnd);
	createSelectOption("select right tab","selectrtab",prntnd);
	createSelectOption("switch between current and last active tab","crnt2lsttab",prntnd);
	createSelectOption("move tab left","movetableft",prntnd);
	createSelectOption("move tab right","movetabright",prntnd);
	createSelectOption("get text","texttool",prntnd);
	createSelectOption("get text (custom search engine)","texttoolurl",prntnd);
	createSelectOption("multi link opener","multilink",prntnd);
	createSelectOption("execute script list","scriptlist",prntnd);
	createSelectOption("hit a hint text","hitahinttext",prntnd);
	createSelectOption("hit a hint text (custom search engine)","hitahinttexturl",prntnd);
	createSelectOption("extension manager","extensionmanager",prntnd);
	createSelectOption("select next window","focusnextwindow",prntnd);
	createSelectOption("forward in history","forwardhistory",prntnd);
	createSelectOption("back in history","backhistory",prntnd);
	createSelectOption("search web","searchwebcrnt",prntnd);
	createSelectOption("search web in new tab","searchweb",prntnd);
	createSelectOption("open bookmark","openbookmarkcrnt",prntnd);
	createSelectOption("open bookmark in new tab","openbookmark",prntnd);
	createSelectOption("open history entry","openhistorycrnt",prntnd);
	createSelectOption("open history entry in new tab","openhistory",prntnd);
	createSelectOption("show tabList","opentablist",prntnd);
	createSelectOption("open URL","openurlcrnt",prntnd);
	createSelectOption("open URL in new tab","openurlnewtab",prntnd);
	createSelectOption("open URL in new tab background","openurlnewtabbg",prntnd);
	createSelectOption("current URL to web service","openreurlcrnt",prntnd);
	createSelectOption("current URL to web service (new tab)","openreurlnewtab",prntnd);
	createSelectOption("current URL to web service (background tab)","openreurlnewtabbg",prntnd);
	createSelectOption("focus first text input","autofocuskey",prntnd);
	createSelectOption("blur focus","blurelem",prntnd);
	createSelectOption("close current tab","closectab",prntnd);
	createSelectOption("close left tabs","closeltabs",prntnd);
	createSelectOption("close other tabs","closeothertabs",prntnd);
	createSelectOption("close right tabs","closertabs",prntnd);
	createSelectOption("close current window","closewindow",prntnd);
	createSelectOption("restore closed tab","restoretab",prntnd);
	createSelectOption("pin/unpin tab","pinunpintab",prntnd);
	createSelectOption("duplicate tab","clonetab",prntnd);
	createSelectOption("create new tab","createnewtab",prntnd);
	createSelectOption("create new tab background","createnewtabb",prntnd);
	createSelectOption("create new window","createnewwindow",prntnd);
	createSelectOption("copy current URL","curltoclip",prntnd);
	createSelectOption("copy url and title as a tag","curltttlatagtoclip",prntnd);
	createSelectOption("copy url and title","curltttltoclip",prntnd);
	createSelectOption("follow link labeled previous","linklabelprev",prntnd);
	createSelectOption("follow link labeled next ","linklabelnext",prntnd);
	createSelectOption("go to parent dir","gotoprntdir",prntnd);
	createSelectOption("go to root","gotoroot",prntnd);
	createSelectOption("set mark","setmark",prntnd);
	createSelectOption("jump to mark","jumpmark",prntnd);
    createSelectOption("bookmark current tab","addbookmark",prntnd);
    createSelectOption("bookmark all tabs","addallbookmark",prntnd);
    createSelectOption("open download folder","opendlfolder",prntnd);
    createSelectOption("open image in newtab","imgveiwtab",prntnd);
    createSelectOption("open image in background tab","imgveiwtbg",prntnd);
    createSelectOption("save image","imgsave",prntnd);
    createSelectOption("save image (saveas)","imgsaveas",prntnd);
    createSelectOption("search image","imgsearch",prntnd);
    createSelectOption("copy image url","imgurlcopy",prntnd);
	createSelectOption("split window vertically","splitwindv",prntnd);
	createSelectOption("split window horizontally","splitwindh",prntnd);
	createSelectOption("reload","reload",prntnd);
	createSelectOption("cacheless reload","superreload",prntnd);
	createSelectOption("reload all tabs","reloadall",prntnd);
	createSelectOption("stop load","stopload",prntnd);
	createSelectOption("stop all tabs","stopall",prntnd);
	createSelectOption("search mode forward","searchtextii",prntnd);
	createSelectOption("search mode backward","searchtextip",prntnd);
	createSelectOption("focus next editable element","nexteditelem",prntnd);
	createSelectOption("focus previous editable element","preeditelem",prntnd);
	createSelectOption("save as MHTML","createmhtml",prntnd);
	createSelectOption("URL Shortener","shorttoclip",prntnd);
	createSelectOption("URL alias mode","commandmode",prntnd);
	createSelectOption("options page","openoptpage",prntnd);
	createSelectOption("sort tab (title)","sorttabtitle",prntnd);
	createSelectOption("sort tab (url)","sorttaburl",prntnd);
	createSelectOption("sort tab (id)","sorttabindex",prntnd);
	createSelectOption("store/load tabs","storetabs",prntnd);

	if(actvalue == "openurlcrnt"){
		return true;
	}else if(actvalue == "openurlnewtab"){
		return true;
	}else if(actvalue == "openurlnewtabbg"){
		return true;
	}else if(actvalue == "openreurlcrnt"){
		return true;
	}else if(actvalue == "openreurlnewtab"){
		return true;
	}else if(actvalue == "openreurlnewtabbg"){
		return true;
	}else if(actvalue == "searchweb"){
		return true;
	}else if(actvalue == "searchwebcrnt"){
		return true;
	}else if(actvalue == "sendurltoweb"){
		return true;
	}else if(actvalue == "sendurltowebnewtab"){
		return true;
	}else if(actvalue == "sendurltowebbgtab"){
		return true;
	}else if(actvalue == "sendurltowebcontinuous"){
		return true;
	}else if(actvalue == "texttoolurl"){
		return true;
	}else if(actvalue == "hitahinttexturl"){
		return true;
	}
	return false;
}
function createSelectOption(optt,optv,prntnd){
    var optelem = document.createElement("option");
    optelem.text = optt;
    optelem.value = optv;
    prntnd.add(optelem);
}
function createOption(){
	var optary = [];
	for (var i = 1, l = arguments.length; i < l; i++) {
		optary.push(arguments[i]);
	}
	keyconfig[arguments[0]] = optary;
}
function hiddeHelpWrap(e){
	document.getElementById("hitahintvideo").pause();
	var row = e.currentTarget;
	row.style.display = "none";
}
function showHelpWrap(){
	var hdiv = document.getElementById("helpdiv");
	var cont = document.body.querySelector(".helpcontainer");
	var whei = parseInt(window.innerHeight*0.84);
	var wwid = parseInt(window.innerWidth*0.8);
	cont.style.height = whei+"px";
	cont.style.width = wwid+"px";
	cont.style.marginLeft = (-wwid/2)+"px";
	cont.style.left = "50%";
	hdiv.style.display = "block";
}
function createHelpTable(){
	var tlbdy = document.getElementById("keylefttable");
	
	createTableItem("Shift+Esc","disable/enable extension",tlbdy);
	createTableBlank(tlbdy);
	createTableItem("Space","hit a hint on/off",tlbdy);
	createTableItem("Shift-Space","hit a hint -newtab on/off",tlbdy);
	createTableItem("C-Space","hit a hint -continuous on/off",tlbdy);
	createTableBlank(tlbdy);

	createTableItem("j","scroll down",tlbdy);
	createTableItem("k","scroll up",tlbdy);
	createTableItem("l","scroll right",tlbdy);
	createTableItem("h","scroll left",tlbdy);
	createTableItem("gg","scroll to top",tlbdy);
	createTableItem("G","scroll to bottom",tlbdy);
	createTableItem("d","scroll down full page",tlbdy);
	createTableItem("u","scroll up full page",tlbdy);
	createTableBlank(tlbdy);

	createTableItem("H","back in history",tlbdy);
	createTableItem("L","forward in history",tlbdy);
	createTableBlank(tlbdy);

	createTableItem("J, gT","select left tab",tlbdy);
	createTableItem("K, gt","select right tab",tlbdy);
	createTableItem("g0","select first tab",tlbdy);
	createTableItem("g$","select last tab",tlbdy);
	createTableItem("W","select next window",tlbdy);
	createTableBlank(tlbdy);

	var tmbdy = document.getElementById("keymiddletable");

	createTableItem("t","create new tab",tmbdy);
	createTableItem("x","close current tab",tmbdy);
	createTableItem("X","restore closed tab",tmbdy);
	createTableItem("r","reload",tmbdy);
	createTableItem("p","pin/unpin tab",tmbdy);
	createTableItem("qa","close current window",tmbdy);
	createTableBlank(tmbdy);

	createTableItem("og","open URL (Google)",tmbdy);
	createTableItem("oj","open URL (bookmarklet)",tmbdy);
	createTableItem("O","open URL in new tab (Google)",tmbdy);
	createTableBlank(tmbdy);

	createTableItem("s","search web",tmbdy);
	createTableItem("S","search web in new tab",tmbdy);
	createTableItem("b","open bookmark",tmbdy);
	createTableItem("B","open bookmark in new tab",tmbdy);
	createTableItem("v","open history entry",tmbdy);
	createTableItem("V","open history entry in new tab",tmbdy);
	createTableItem("T","show tabList",tmbdy);

	createTableBlank(tmbdy);
	createTableItem("gp","go to parent dir",tmbdy);
	createTableItem("gr","go to root",tmbdy);

	var trbdy = document.getElementById("keyrighttable");
	createTableItem("]]","follow link labeled next ",trbdy);
	createTableItem("[[","follow link labeled previous",trbdy);
	createTableBlank(trbdy);
	createTableItem("i","focus first text input",trbdy);
	createTableItem("M-i","blur focus",trbdy);
	createTableBlank(trbdy);
	createTableItem("/","search mode backward",trbdy);
	createTableItem("?","search mode forward",trbdy);
	createTableBlank(trbdy);

	createTableItem("yy","copy current URL",trbdy);
	createTableItem("mh","save as MHTML",trbdy);
	createTableItem("ms","store/load tabs",trbdy);

	createTableBlank(trbdy);
	createTableItem("mm","set mark",trbdy);
	createTableItem("mj","jump to mark",trbdy);

	createTableBlank(trbdy);
	createTableItem("wv","split window vertically",trbdy);
	createTableItem("wh","split window horizontally",trbdy);

	createTableBlank(trbdy);
	createTableItem("a","URL alias mode",trbdy);
	createTableBlank(trbdy);
	createTableItem("op","options page",trbdy);
}
function createTableItem(key,str,tbdy){
	var tr = document.createElement("tr");
	tbdy.appendChild(tr);

	var td = document.createElement("td");
	tr.appendChild(td);
	td.appendChild(document.createTextNode(key));
	td.setAttribute("class","keytableitemclass");

	var td2 = document.createElement("td");
	tr.appendChild(td2);
	td2.style.padding = "0 5px";
	td2.appendChild(document.createTextNode(":"));

	var td3 = document.createElement("td");
	tr.appendChild(td3);
	td3.appendChild(document.createTextNode(str));
	return tr;
}
function createTableBlank(tbdy){
	var tr = document.createElement("tr");
	tbdy.appendChild(tr);

	var td = document.createElement("td");
	tr.appendChild(td);
	td.appendChild(document.createTextNode("."));
	td.style.visibility = "hidden";
}
function showaddCommandWrap(e,keyary,idx){
	var row = e.currentTarget;
	e.preventDefault();
	e.stopPropagation();

	if(row.id == "addbutton"){
		clickselectobject = "addbutton";
	}else if(row.id&&(row.id.indexOf("actionitemselect") == 0)){
		clickselectobject = row;
		clickselectobject.event = e;
		clickselectobject.ary = keyary;
		clickselectobject.index = idx;
	}else{
		clickselectobject = null;
	}
	var hdiv = document.getElementById("addbuttondiv");
	var cont = document.getElementById("addbuttoncontainer");
	var whei = parseInt(window.innerHeight*0.84);
	cont.style.height = whei+"px";
	hdiv.style.display = "block";
}
function createAllAddButtonItem(){
	var tbcont = document.getElementById("addbuttontable1");

	createAddButtonString("---hit a hint---",tbcont)
	createAddButtonItem("hit a hint on/off","drawhint",tbcont);
	createAddButtonItem("hit a hint -newtab on/off","drawhintn",tbcont);
	createAddButtonItem("hit a hint -continuous on/off","drawhintnb",tbcont);

	createAddButtonItem("get link title","getlinkttl",tbcont);
	createAddButtonItem("get link url","getlinkurl",tbcont);
	createAddButtonItem("get link and title","getlinkurlttl",tbcont);
	createAddButtonItem("get link and title html","getlinkurlttlhtml",tbcont);

	createAddButtonItem("send URL to web service","sendurltoweb",tbcont);
	createAddButtonItem("send URL to web service in newtab","sendurltowebnewtab",tbcont);
	createAddButtonItem("send URL to web service in background tab","sendurltowebbgtab",tbcont);
	createAddButtonItem("send URL to web service -continuous","sendurltowebcontinuous",tbcont);

	createAddButtonString("---scroll---",tbcont)
	createAddButtonItem("scroll up","scrlup",tbcont);
	createAddButtonItem("scroll down","scrldown",tbcont);
	createAddButtonItem("scroll right","scrlright",tbcont);
	createAddButtonItem("scroll left","scrlleft",tbcont);
	createAddButtonItem("scroll to top","scrltop",tbcont);
	createAddButtonItem("scroll to bottom","scrlbottom",tbcont);
	createAddButtonItem("scroll up full page","scrlfup",tbcont);
	createAddButtonItem("scroll down full page","scrlfdown",tbcont);
	createAddButtonItem("scroll up half page","scrlhup",tbcont);
	createAddButtonItem("scroll down half page","scrlhdown",tbcont);

	createAddButtonString("---focus---",tbcont)
	createAddButtonItem("focus first text input","autofocuskey",tbcont);
	createAddButtonItem("blur focus","blurelem",tbcont);
	createAddButtonItem("focus next editable element","nexteditelem",tbcont);
	createAddButtonItem("focus previous editable element","preeditelem",tbcont);

	createAddButtonString("---clipboard---",tbcont)
	createAddButtonItem("copy current URL","curltoclip",tbcont);
	createAddButtonItem("copy url and title as a tag","curltttlatagtoclip",tbcont);
	createAddButtonItem("copy url and title","curltttltoclip",tbcont);
	createAddButtonItem("URL Shortener","shorttoclip",tbcont);

	createAddButtonString("---link labeled---",tbcont)
	createAddButtonItem("follow link labeled previous","linklabelprev",tbcont);
	createAddButtonItem("follow link labeled next ","linklabelnext",tbcont);

	createAddButtonString("---split window---",tbcont)
	createAddButtonItem("split window vertically","splitwindv",tbcont);
	createAddButtonItem("split window horizontally","splitwindh",tbcont);

	createAddButtonString("---get text---",tbcont)
	createAddButtonItem("get text","texttool",tbcont);
	createAddButtonItem("get text (custom search engine)","texttoolurl",tbcont);
	createAddButtonItem("hit a hint text","hitahinttext",tbcont);
	createAddButtonItem("hit a hint text (custom search engine)","hitahinttexturl",tbcont);

	createAddButtonString("---multi link opener---",tbcont)
	createAddButtonItem("multi link opner","multilink",tbcont);

	createAddButtonString("---execute scripts---",tbcont)
	createAddButtonItem("execute script list","scriptlist",tbcont);

	createAddButtonString("---extension manager---",tbcont)
	createAddButtonItem("extension manager","extensionmanager",tbcont);

	var tb2cont = document.getElementById("addbuttontable2");

	createAddButtonString("---select---",tb2cont)
	createAddButtonItem("select first tab","selectfirst",tb2cont);
	createAddButtonItem("select last tab","selectlast",tb2cont);
	createAddButtonItem("select left tab","selectltab",tb2cont);
	createAddButtonItem("select right tab","selectrtab",tb2cont);
	createAddButtonItem("switch between current and last active tab","crnt2lsttab",tb2cont);
	createAddButtonItem("select next window","focusnextwindow",tb2cont);
	createAddButtonString("---move---",tb2cont)
	createAddButtonItem("move tab left","movetableft",tb2cont);
	createAddButtonItem("move tab right","movetabright",tb2cont);

	createAddButtonString("---history---",tb2cont)
	createAddButtonItem("forward in history","forwardhistory",tb2cont);
	createAddButtonItem("back in history","backhistory",tb2cont);

	createAddButtonString("---search web---",tb2cont)
	createAddButtonItem("search web","searchwebcrnt",tb2cont);
	createAddButtonItem("search web in new tab","searchweb",tb2cont);

	createAddButtonString("---open bookmarks---",tb2cont)
	createAddButtonItem("open bookmark","openbookmarkcrnt",tb2cont);
	createAddButtonItem("open bookmark in new tab","openbookmark",tb2cont);

	createAddButtonString("---open history---",tb2cont)
	createAddButtonItem("open history entry","openhistorycrnt",tb2cont);
	createAddButtonItem("open history entry in new tab","openhistory",tb2cont);

	createAddButtonString("---search---",tb2cont)
	createAddButtonItem("search mode forward","searchtextii",tb2cont);
	createAddButtonItem("search mode backward","searchtextip",tb2cont);

	createAddButtonString("---tablist---",tb2cont)
	createAddButtonItem("show tabList","opentablist",tb2cont);

	createAddButtonString("---go to---",tb2cont)
	createAddButtonItem("go to parent dir","gotoprntdir",tb2cont);
	createAddButtonItem("go to root","gotoroot",tb2cont);

	createAddButtonString("---mark---",tb2cont)
	createAddButtonItem("set mark","setmark",tb2cont);
	createAddButtonItem("jump to mark","jumpmark",tb2cont);

    createAddButtonString("---bookmark---",tb2cont)
    createAddButtonItem("bookmark current tab","addbookmark",tb2cont);
    createAddButtonItem("bookmark all tabs","addallbookmark",tb2cont);

    createAddButtonString("---open download folder---",tb2cont)
    createAddButtonItem("open download folder","opendlfolder",tb2cont);

    createAddButtonString("---image---",tb2cont)
    createAddButtonItem("open image in newtab","imgveiwtab",tb2cont);
    createAddButtonItem("open image in background tab","imgveiwtbg",tb2cont);
    createAddButtonItem("save image","imgsave",tb2cont);
    createAddButtonItem("save image (saveas)","imgsaveas",tb2cont);
    createAddButtonItem("search image","imgsearch",tb2cont);
    createAddButtonItem("copy image url","imgurlcopy",tb2cont);

	var tb3cont = document.getElementById("addbuttontable3");

	createAddButtonString("---open---",tb3cont)
	createAddButtonItem("open URL","openurlcrnt",tb3cont);
	createAddButtonItem("open URL in new tab","openurlnewtab",tb3cont);
	createAddButtonItem("open URL in new tab background","openurlnewtabbg",tb3cont);

	createAddButtonString("---reopen---",tb3cont)
	createAddButtonItem("current URL to web service","openreurlcrnt",tb3cont);
	createAddButtonItem("current URL to web service (new tab)","openreurlnewtab",tb3cont);
	createAddButtonItem("current URL to web service (background tab)","openreurlnewtabbg",tb3cont);

	createAddButtonString("---close---",tb3cont)
	createAddButtonItem("close current tab","closectab",tb3cont);
	createAddButtonItem("close left tabs","closeltabs",tb3cont);
	createAddButtonItem("close right tabs","closertabs",tb3cont);
	createAddButtonItem("close other tabs","closeothertabs",tb3cont);
	createAddButtonItem("close current window","closewindow",tb3cont);

	createAddButtonString("---restore closed tab---",tb3cont)
	createAddButtonItem("restore closed tab","restoretab",tb3cont);

	createAddButtonString("---create---",tb3cont)
	createAddButtonItem("create new tab","createnewtab",tb3cont);
	createAddButtonItem("create new tab background","createnewtabb",tb3cont);
	createAddButtonItem("create new window","createnewwindow",tb3cont);

	createAddButtonString("---reload---",tb3cont)
	createAddButtonItem("reload","reload",tb3cont);
	createAddButtonItem("cacheless reload","superreload",tb3cont);
	createAddButtonItem("reload all tabs","reloadall",tb3cont);
	createAddButtonItem("stop load","stopload",tb3cont);
	createAddButtonItem("stop all tabs","stopall",tb3cont);

	createAddButtonString("---sort tab---",tb3cont)
	createAddButtonItem("sort tab (title)","sorttabtitle",tb3cont);
	createAddButtonItem("sort tab (url)","sorttaburl",tb3cont);
	createAddButtonItem("sort tab (index)","sorttabindex",tb3cont);

	createAddButtonString("---screenshot---",tb3cont)
	createAddButtonItem("capture entire page","capfull",tb3cont);
	createAddButtonItem("capture entire page (save dialog)","capsfull",tb3cont);
	createAddButtonItem("capture visible part of page","caphalf",tb3cont);
	createAddButtonItem("capture visible part of page (save dialog)","capshalf",tb3cont);

	createAddButtonString("---etc---",tb3cont)
	createAddButtonItem("pin/unpin tab","pinunpintab",tb3cont);
	createAddButtonItem("duplicate tab","clonetab",tb3cont);
	createAddButtonItem("save as MHTML","createmhtml",tb3cont);
	createAddButtonItem("store/load tabs","storetabs",tb3cont);
	createAddButtonItem("URL alias mode","commandmode",tb3cont);
	createAddButtonItem("options page","openoptpage",tb3cont);
}
function hiddeaddCommandWrap(e){
	var row = e.currentTarget;
	row.style.display = "none";
}
function createAddButtonItem(str,value,tbdy){
	var tr = document.createElement("tr");
	tbdy.appendChild(tr);

	var td = document.createElement("td");
	tr.appendChild(td);

	var btn = document.createElement("input");
	td.appendChild(btn);
	btn.setAttribute("type","button");
	btn.setAttribute("class","additembuttonclass");
	btn.value = str;
	btn.addEventListener("mousedown",function(e){clickAddButtonItem(e,value)},true);
	return tr;
}
function createAddButtonString(str,tbdy){
	var tr = document.createElement("tr");
	tbdy.appendChild(tr);
	var td = document.createElement("td");
	tr.appendChild(td);
	var lbl = document.createElement("label");
	td.appendChild(lbl);
	lbl.setAttribute("class","addbtnstringclass");
	lbl.appendChild(document.createTextNode(str));
}
function clickAddButtonItem(e,value){
	if(clickselectobject&&(clickselectobject == "addbutton")){
		var newidx = 0;
		var key = {};
		key.char = "nomap";
		key.ctrl = false;
		key.meta = false;
		key.shift = false;
		if(keyconfig[value]){
			keyconfig[value].push([key]);
			newidx = keyconfig[value].length-1;
		}else{
			keyconfig[value] = [[key]];
			newidx = 0;
		}
		checkObject();
		var optkeyobj = keyconfig[value];
		createOpenURLItem("",value,"","actioncontainer",optkeyobj,newidx,true);

		if(value === "extensionmanager"){
			extensionsettingarray.push(null);
			setExteinsonArray();
		}
	}else if(clickselectobject&&(clickselectobject.value != value)&&((clickselectobject.id.indexOf("actionitemselect") == 0))){
		var prntnod = clickselectobject.parentNode.parentNode;
		prntnod.style.background = "yellow";
		setTimeout(function(){
			prntnod.style.background = "";
		},300)
		clickselectobject.value = value;
		changeActionSelect(clickselectobject.event,clickselectobject.ary,clickselectobject.index,clickselectobject.id);
	}
}
function clickAddEXButtonItem(e){
	var ignoreallurls = keyconfig.ignoreurlary;
	if(!ignoreallurls&&(ignoreallurls.length < 1)){
		ignoreallurls = [];
	}
	ignoreallurls.push("");
	checkObject();
	var idx = ignoreallurls.length-1;
	createExcludedItem("","ignoreurlary","","excludcontainer",true,ignoreallurls,idx,true);
}
function loadWebServiceMenu(){
    var otp = {},searchenginary = [],searchnameary = [];
    searchenginary[0] = "http://www.readability.com/m?url=";
    searchenginary[1] = "http://mobilizer.instapaper.com/m?u=";
    searchenginary[2] = "http://s.evernote.com/grclip?url=";
    searchenginary[3] = "http://wayback.archive.org/web/*/"
    searchenginary[4] = "http://webcache.googleusercontent.com/search?q=cache:"

    searchnameary[0] = "Readability";
    searchnameary[1] = "Instapaper";
    searchnameary[2] = "Evernote";
    searchnameary[3] = "Wayback Machine";
    searchnameary[4] = "Google Cache";

    otp.url = searchenginary;
    otp.name = searchnameary;
    return otp;
}
function loadSearchEngineMenu(){
	var otp = {},searchenginary = [],searchnameary = [];
	searchenginary[0] = "https://www.google.com/search?q=";
	searchenginary[1] = "https://www.google.com/search?tbm=isch&q=";
	searchenginary[2] = "https://www.google.com/searchbyimage?image_url=";
	searchenginary[3] = "https://maps.google.com/maps?q=";
	searchenginary[4] = "https://www.google.com/search?tbm=vid&q=";
	searchenginary[5] = "https://mail.google.com/mail/?fs=1&tf=1&source=ig&view=cm&to=&cc=&bcc=&su=&body=";
	searchenginary[6] = 'https://www.google.com/search?tbs=qdr:h&q=';
	searchenginary[7] = 'https://www.google.com/search?tbs=qdr:d&q=';
	searchenginary[8] = 'https://www.google.com/search?tbs=qdr:w&q=';
	searchenginary[9] = 'https://www.google.com/search?tbs=qdr:m&q=';
	searchenginary[10] = 'https://www.google.com/search?tbs=qdr:m3&q=';
	searchenginary[11] = 'https://www.google.com/search?tbs=qdr:m6&q=';
	searchenginary[12] = 'https://www.google.com/search?tbs=qdr:y&q=';
	searchenginary[13] = 'http://webcache.googleusercontent.com/search?q=cache:';
	searchenginary[14] = "https://www.youtube.com/results?search_query=";
	searchenginary[15] = "https://www.youtube.com/results?filters=long&lclk=long&search_query=";
	searchenginary[16] = "https://www.youtube.com/results?filters=playlist&lclk=playlist&search_query=";
	searchenginary[17] = "https://en.wikipedia.org/wiki/";
	searchenginary[18] = "https://twitter.com/search?f=realtime&q=";
	searchenginary[19] = "https://vine.co/search/";
	searchenginary[20] = "http://www.tumblr.com/tagged/";
	searchenginary[21] = "http://www.pinterest.com/search/pins/?q=";
	searchenginary[22] = "http://www.reddit.com/search?q=";
	searchenginary[23] = "http://digg.com/search?q=";
	searchenginary[24] = "http://www.baidu.com/s?wd=";
	searchenginary[25] = "http://www.bing.com/search?q=";
	searchenginary[26] = "https://duckduckgo.com/?q=";
	searchenginary[27] = "http://www.imdb.com/find?q=";
	searchenginary[28] = "http://stackoverflow.com/search?q=";
	searchenginary[29] = "https://www.flickr.com/search/?q=";
	searchenginary[30] = "http://search.yahoo.com/search?p=";
	searchenginary[31] = "http://yandex.ru/yandsearch?text=";
	searchenginary[32] = "http://images.yandex.ru/yandsearch?text=";
	searchenginary[33] = "http://yandex.ru/video/search?text=";
	searchenginary[34] = "http://b.hatena.ne.jp/search/text?safe=off&sort=popular&q=";
	searchenginary[35] = "http://search.naver.com/search.naver?query=";
	searchenginary[36] = 'http://www.onelook.com/?w=';
	searchenginary[37] = 'http://search.azlyrics.com/search.php?q=';

	searchnameary[0] = "Google";
	searchnameary[1] = "Google Images";
	searchnameary[2] = "Google Image URL";
	searchnameary[3] = "Google Maps";
	searchnameary[4] = "Google Video";
	searchnameary[5] = "Gmail";
	searchnameary[6] = "Google(Past hour)";
	searchnameary[7] = "Google(Past 24h)";
	searchnameary[8] = "Google(Past week)";
	searchnameary[9] = "Google(Past month)";
	searchnameary[10] = "Google(Past 3m)";
	searchnameary[11] = "Google(Past 6m)";
	searchnameary[12] = "Google(Past year)";
	searchnameary[13] = "Google Cache";
	searchnameary[14] = "Youtube";
	searchnameary[15] = "Youtube Long";
	searchnameary[16] = "Youtube Playlist";
	searchnameary[17] = "Wikipedia";
	searchnameary[18] = "Twitter";
	searchnameary[19] = "Vine";
	searchnameary[20] = "Tumblr";
	searchnameary[21] = "Pinterest";
	searchnameary[22] = "Reddit";
	searchnameary[23] = "Digg";
	searchnameary[24] = "Baidu";
	searchnameary[25] = "Bing";
	searchnameary[26] = "DuckDuckGo";
	searchnameary[27] = "IMDb";
	searchnameary[28] = "Stackoverflow";
	searchnameary[29] = "Flickr";
	searchnameary[30] = "Yahoo";
	searchnameary[31] = "Yandex";
	searchnameary[32] = "Yandex	Images";
	searchnameary[33] = "Yandex	Videos";
	searchnameary[34] = "Hatena Bookmark";
	searchnameary[35] = "NAVER";
	searchnameary[36] = "OneLook Dictionary";
	searchnameary[37] = "AZLyrics";

	otp.url = searchenginary;
	otp.name = searchnameary;
	return otp;
}
