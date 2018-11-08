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
	var URL,TITLE;
	window.addEventListener("load",function(e){
		document.getElementById("loadbutton").addEventListener("click",clickLoadButton,false);
		if(!document.hidden)loadPage();
	});
	document.addEventListener("visibilitychange", function(e){
		if(!document.hidden)loadPage();
	}, false);
	function clickLoadButton(){loadPage();}
	function loadPage(){
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.update(tab.id, {url: URL});
		});	
	}
	var url = window.location.href;
	if((url.indexOf("?") > -1)&&(url.indexOf("&") > -1)){
		var urls = url.split("?");
		if(urls[1]){		
			urls = urls[1].split("&");
			if(urls[0]){
				URL = decodeURIComponent(urls[0]);
				if(urls[1]){
					TITLE = decodeURIComponent(urls[1]);
				}else{
					TITLE = "";
				}
				setFavicon(URL,TITLE);
			}
		}
	}
	function setFavicon(url,title){
		var domain = url.replace(/^.*?\/\/(.*?)\/.*$/, "$1");
		if(domain){
			var link = document.createElement('link');
			link.setAttribute('rel', 'shortcut icon');
			link.setAttribute('href', 'http://www.google.com/s2/favicons?domain='+encodeURIComponent(domain));
			link.setAttribute('type', 'image/x-icon');
			document.querySelector('head').appendChild(link);	
		}
		document.querySelector('title').textContent = "_"+title;
	}
})();

