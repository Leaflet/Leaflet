/*
 * L.DomUtil contains various utility functions for working with DOM
 */

L.DomUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getStyle: function (el, style) {
		var value = el.style[style];
		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}
		if (!value || value === 'auto') {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}
		return (value === 'auto' ? null : value);
	},

	getViewportOffset: function (element) {
		var top = 0,
			left = 0,
			el = element,
			docBody = document.body;

		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;

			if (el.offsetParent === docBody &&
					L.DomUtil.getStyle(el, 'position') === 'absolute') {
				break;
			}
			if (L.DomUtil.getStyle(el, 'position') === 'fixed') {
				top += docBody.scrollTop || 0;
				left += docBody.scrollLeft || 0;
				break;
			}

			el = el.offsetParent;
		} while (el);

		el = element;

		do {
			if (el === docBody) {
				break;
			}

			top -= el.scrollTop || 0;
			left -= el.scrollLeft || 0;

			el = el.parentNode;
		} while (el);

		return new L.Point(left, top);
	},

	create: function (tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},

	disableTextSelection: function () {
		if (document.selection && document.selection.empty) {
			document.selection.empty();
		}
		if (!this._onselectstart) {
			this._onselectstart = document.onselectstart;
			document.onselectstart = L.Util.falseFn;
		}
	},

	enableTextSelection: function () {
		document.onselectstart = this._onselectstart;
		this._onselectstart = null;
	},

	hasClass: function (el, name) {
		return (el.className.length > 0) &&
				new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
	},

	addClass: function (el, name) {
		if (!L.DomUtil.hasClass(el, name)) {
			el.className += (el.className ? ' ' : '') + name;
		}
	},

	removeClass: function (el, name) {
		function replaceFn(w, match) {
			if (match === name) {
				return '';
			}
			return w;
		}
		el.className = el.className
				.replace(/(\S+)\s*/g, replaceFn)
				.replace(/(^\s+|\s+$)/, '');
	},

	setOpacity: function (el, value) {

		if ('opacity' in el.style) {
			el.style.opacity = value;

		} else if (L.Browser.ie) {

			var filter = false,
				filterName = 'DXImageTransform.Microsoft.Alpha';

			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try { filter = el.filters.item(filterName); } catch (e) {}

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		}
	},

	testProp: function (props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	getTranslateString: function (point) {
		// On webkit browsers (Chrome/Safari/MobileSafari/Android) using translate3d instead of translate
		// makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
		// (same speed either way), Opera 12 doesn't support translate3d

		var is3d = L.Browser.webkit3d,
			open = 'translate' + (is3d ? '3d' : '') + '(',
			close = (is3d ? ',0' : '') + ')';

		return open + point.x + 'px,' + point.y + 'px' + close;
	},

	getScaleString: function (scale, origin) {
		var preTranslateStr = L.DomUtil.getTranslateString(origin),
			scaleStr = ' scale(' + scale + ') ',
			postTranslateStr = L.DomUtil.getTranslateString(origin.multiplyBy(-1));

		return preTranslateStr + scaleStr + postTranslateStr;
	},

	setPosition: function (el, point, disable3D) {
		el._leaflet_pos = point;
		if (!disable3D && L.Browser.any3d) {
			el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);

			// workaround for Android 2/3 stability (https://github.com/CloudMade/Leaflet/issues/69)
			if (L.Browser.mobileWebkit3d) {
				el.style.WebkitBackfaceVisibility = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		return el._leaflet_pos;
	}
};

L.Util.extend(L.DomUtil, {
	TRANSITION: L.DomUtil.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']),
	TRANSFORM: L.DomUtil.testProp(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'])
});
