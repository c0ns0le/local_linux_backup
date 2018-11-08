/***********************************************************
        Simple Mouse Gestures
            Distributed under the BSD license:
            http://opensource.org/licenses/BSD-3-Clause

************************************************************
        Copyright (c) 2015 Kunihiro Ando 
            senna5150ando@gmail.com
            2015-08-24T23:42:05Z
***********************************************************/ 

(function(){
	window.addEventListener("keydown", keydownEvent, true);	
	window.addEventListener("mousewheel", scrollEvent, false);	
	window.addEventListener("DOMContentLoaded",getURLTitle,false);
	var currntzoom = 1;
	function keydownEvent(e){
		if(e.keyCode === 74){
			window.scrollBy(0,40);
			e.preventDefault();
			e.stopPropagation();	
		}else if(e.keyCode === 38){
			window.scrollBy(0,-50);
			e.preventDefault();
			e.stopPropagation();				
		}else if(e.keyCode === 37){
			currntzoom -= 0.04;
			e.preventDefault();
			e.stopPropagation();				
		}else if(e.keyCode === 39){
			currntzoom += 0.04;
			e.preventDefault();
			e.stopPropagation();				
		}
		document.documentElement.style.zoom = currntzoom;
	}
	function scrollEvent(e){
		if(e.altKey || e.ctrlKey || e.shiftKey){
			e.preventDefault();
			e.stopPropagation();			
			if(e.wheelDelta > 0){
				window.scrollBy(0,-50);
			}else{
				window.scrollBy(0,50);
			}	
		}else{
			e.preventDefault();
			e.stopPropagation();
			if(e.wheelDelta > 0){
				currntzoom += 0.04;
			}else{
				currntzoom -= 0.04;
			}	
			document.documentElement.style.zoom = currntzoom;
		}
	}
	function getURLTitle(){
		var url = window.location.href;
		if(url.indexOf("?") > -1){
			var urls = url.split("?");
			if(urls[1]){		
				imgurl = decodeURIComponent(urls[1]);
				createImage(imgurl)
			}
		}
		createdialog();
	}
	function createImage(url){
		var img = document.createElement("img");
		document.body.appendChild(img);
		img.addEventListener("load",function(e){
			setTimeout(function(){checkSize(img)},300)
		},false);
		var imgw = window.innerWidth-24;
		img.style.width = imgw+"px";
		img.style.height = "";
		img.setAttribute("src",url);
	}
	function checkSize(elem){
		var imgh = window.innerHeight-24;
		if(elem.offsetHeight > imgh){
			elem.style.height = imgh+"px";
			elem.style.width = "";
		}
	}
})();
function createdialog(){
	if(localStorage.getItem("___imageview_info"))return;
	var dialog = document.createElement("dialog");
	document.body.appendChild(dialog);
	dialog.style.border = "1px solid rgba(0, 0, 0, 0.3)";
	dialog.style.boxShadow = "0 3px 7px rgba(0, 0, 0, 0.4)";
	dialog.style.padding = 0;

	var maincontainer = document.createElement("div");
	dialog.appendChild(maincontainer);
	var maininfo = document.createElement("div");
	maincontainer.appendChild(maininfo);

	var minfostyle = maininfo.style;
	minfostyle.width = "600px";
	minfostyle.background = "#500095";
	minfostyle.color = "#fff";
	minfostyle.border = 0;
	minfostyle.fontSize = "16px";
	minfostyle.padding = "6px 1px";
	minfostyle.margin = 0;
	minfostyle.opacity = 1;
	minfostyle.textAlign = "center";
	maininfo.textContent = "Arrow Right=Zoom In, Arrow Left=Zoom Out";
	minfostyle.position = "relative";

	var btn = document.createElement("button");
	maincontainer.appendChild(btn);
	btn.textContent = ("Close")
	btn.style.position = "absolute";
	minfostyle.padding = "6px 1px";
	btn.style.right = 0;
	btn.style.top = 0;
	btn.addEventListener("click",function(){
		maininfo.style.display = "none"
		dialog.close();
		localStorage.setItem("___imageview_info","on")

	});
	dialog.showModal();
}

