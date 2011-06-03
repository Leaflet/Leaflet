/*
 * L.DomUtil contains various utility functions for working with DOM
 */

L.DomUtil = {
	get: function(id) {
		return (typeof id == 'string' ? document.getElementById(id) : id);
	},
	
	getStyle: function(el, style) {
		var value = el.style[style];
		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}
		if (!value || value == 'auto') {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}
		return (value == 'auto' ? null : value);
	},
	
	getCumulativeOffset: function(el) {
		var top = 0, 
			left = 0;
		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;
			el = el.offsetParent;
		} while (el);
		return new L.Point(left, top);
	},
	
	create: function(tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},
	
	disableTextSelection: function() {
		if (document.selection && document.selection.empty) { 
			document.selection.empty();
		}
		if (!this._onselectstart) {
			this._onselectstart = document.onselectstart;
			document.onselectstart = L.Util.falseFn;
		}
	},
	
	enableTextSelection: function() {
		document.onselectstart = this._onselectstart;
		this._onselectstart = null;
	},
	
	CLASS_RE: /(\\s|^)'+cls+'(\\s|$)/,
	
	hasClass: function(el, name) {
		return (el.className.length > 0) && 
				new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
	},
	
	addClass: function(el, name) {
		if (!L.DomUtil.hasClass(el, name)) {
			el.className += (el.className ? ' ' : '') + name; 
		}
	},
	
	setOpacity: function(el, value) {
		if (L.Browser.ie) {
			el.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';
		} else {
			el.style.opacity = value;
		}
	},
	
	//TODO refactor away this ugly translate/position mess
	
	testProp: function(props) {
		var style = document.documentElement.style;
		
		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},
	
	getTranslateString: function(point) {
		return L.DomUtil.TRANSLATE_OPEN + 
				point.x + 'px,' + point.y + 'px' + 
				L.DomUtil.TRANSLATE_CLOSE;
	},
	
	getScaleString: function(scale, origin) {
		 return L.DomUtil.getTranslateString(origin) + 
         		' scale(' + scale + ') ' +
         		L.DomUtil.getTranslateString(origin.multiplyBy(-1));
	},
	
	setPosition: function(el, point) {
		el._leaflet_pos = point;
		if (L.Browser.webkit) {
			el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},
	
	getPosition: function(el) {
		return el._leaflet_pos;
	}
};

L.Util.extend(L.DomUtil, {
	TRANSITION: L.DomUtil.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']),
	TRANSFORM: L.DomUtil.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),
	
	TRANSLATE_OPEN: 'translate' + (L.Browser.webkit3d ? '3d(' : '('),
	TRANSLATE_CLOSE: L.Browser.webkit3d ? ',0)' : ')'
});