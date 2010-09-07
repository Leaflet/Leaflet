/*
 * L.DomUtil contains various utility functions for working with DOM
 */

L.DomUtil = {
	getCumulativeOffset: function(el) {
		var top = 0, 
			left = 0;
		do {
			top += (el.offsetTop - el.scrollTop) || 0;
			left += el.offsetLeft || 0;
			el = el.offsetParent;
		} while (el);
		return new L.Point(left, top);
	},
		
	// used for disabling text selection while dragging
	disableTextSelection: function() {
		if (document.selection && document.selection.empty) { 
			document.selection.empty();
		}
		if (!L.DomUtil._onselectstart) {
			L.DomUtil._onselectstart = document.onselectstart;
			document.onselectstart = function() { return false; };
		}
	},
	enableTextSelection: function() {
		document.onselectstart = L.DomUtil._onselectstart;
		CM.DomEvent._onselectstart = null;
	}
};