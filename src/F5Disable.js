window.onkeydown = function(e) {
	if (e.keyCode == 116 ) {
		// F5 key
		e.keyCode = 0;
		e.returnValue = false;                  
		return false;
	}

	if (e.ctrlKey || e.metaKey) {
		// Ctrl key
		e.keyCode = 0;
		e.returnValue = false;
		return false;
	}

	if (e.altKey) {
		// Alt key - does not work for Alt + F4 and Ctrl + Alt + Del
		e.keyCode = 0;
		e.returnValue = false;
		return false;
	}
}
