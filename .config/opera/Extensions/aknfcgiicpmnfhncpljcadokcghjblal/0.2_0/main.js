if(chrome && chrome.runtime)
{
	window.addEventListener('mousewheel', function(e) {
		if (e.altKey || e.buttons == 2) {
			if (e.wheelDelta /120 > 0) {
					chrome.runtime.sendMessage('up');	
			}
			else {
				chrome.runtime.sendMessage('down');
			}
			e.preventDefault();
		}
	});

    function preventOneContextMenuEvent(e) {
        e.preventDefault();
        window.removeEventListener('contextmenu', preventOneContextMenuEvent);
    }
}
