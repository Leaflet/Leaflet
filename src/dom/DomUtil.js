/*
 * L.DomUtil contains various utility functions for working with DOM
 */

L.DomUtil = {
	get: function(id) {
		return (typeof id == 'string' ? document.getElementById(id) : id);
	},
	
	getStyle: function(el, style) {
	    var value = el.style[style];
	    if ((typeof value == 'undefined') && el.currentStyle) {
	    	value = el.currentStyle[style];
	    }
	    if (typeof value == 'undefined') {
	      var css = document.defaultView.getComputedStyle(el, null);
	      value = css ? css[style] : null;
	    }
	    return (value == 'auto' ? null : value);
	},
	
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
	
	TRANSLATE_OPEN: 'translate' + (L.Browser.webkit3d ? '3d(' : '('),
	TRANSLATE_CLOSE: L.Browser.webkit3d ? ',0)' : ')',
	
	setPosition: function(el, point) {
		el._leaflet_pos = point;
		if (L.Browser.webkit) {
			el.style.webkitTransform =  L.DomUtil.TRANSLATE_OPEN + 
					point.x + 'px,' + point.y + 'px' + L.DomUtil.TRANSLATE_CLOSE;
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},
	
	getPosition: function(el) {
		return el._leaflet_pos;
	}
};