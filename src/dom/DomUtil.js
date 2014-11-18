/*
 * L.DomUtil contains various utility functions for working with DOM.
 */

L.DomUtil = {
	get: function (id) {
		return typeof id === 'string' ? document.getElementById(id) : id;
	},

	getStyle: function (el, style) {

		var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

		if ((!value || value === 'auto') && document.defaultView) {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}

		return value === 'auto' ? null : value;
	},

	create: function (tagName, className, container) {

		var el = document.createElement(tagName);
		el.className = className;

		if (container) {
			container.appendChild(el);
		}

		return el;
	},

	remove: function (el) {
		var parent = el.parentNode;
		if (parent) {
			parent.removeChild(el);
		}
	},

	empty: function (el) {
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	},

	toFront: function (el) {
		el.parentNode.appendChild(el);
	},

	toBack: function (el) {
		var parent = el.parentNode;
		parent.insertBefore(el, parent.firstChild);
	},

	hasClass: function (el, name) {
		if (el.classList !== undefined) {
			return el.classList.contains(name);
		}
		var className = L.DomUtil.getClass(el);
		return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	},

	addClass: function (el, name) {
		if (el.classList !== undefined) {
			var classes = L.Util.splitWords(name);
			for (var i = 0, len = classes.length; i < len; i++) {
				el.classList.add(classes[i]);
			}
		} else if (!L.DomUtil.hasClass(el, name)) {
			var className = L.DomUtil.getClass(el);
			L.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
		}
	},

	removeClass: function (el, name) {
		if (el.classList !== undefined) {
			el.classList.remove(name);
		} else {
			L.DomUtil.setClass(el, L.Util.trim((' ' + L.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
		}
	},

	setClass: function (el, name) {
		if (el.className.baseVal === undefined) {
			el.className = name;
		} else {
			// in case of SVG element
			el.className.baseVal = name;
		}
	},

	getClass: function (el) {
		return el.className.baseVal === undefined ? el.className : el.className.baseVal;
	},

	setOpacity: function (el, value) {

		if ('opacity' in el.style) {
			el.style.opacity = value;

		} else if ('filter' in el.style) {
			L.DomUtil._setOpacityIE(el, value);
		}
	},

	_setOpacityIE: function (el, value) {
		var filter = false,
		    filterName = 'DXImageTransform.Microsoft.Alpha';

		// filters collection throws an error if we try to retrieve a filter that doesn't exist
		try {
			filter = el.filters.item(filterName);
		} catch (e) {
			// don't set opacity to 1 if we haven't already set an opacity,
			// it isn't needed and breaks transparent pngs.
			if (value === 1) { return; }
		}

		value = Math.round(value * 100);

		if (filter) {
			filter.Enabled = (value !== 100);
			filter.Opacity = value;
		} else {
			el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
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

	setTransform: function (el, offset, scale) {
		var pos = offset || new L.Point(0, 0);

		el.style[L.DomUtil.TRANSFORM] =
			'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
	},

	setPosition: function (el, point, no3d) { // (HTMLElement, Point[, Boolean])

		/*eslint-disable */
		el._leaflet_pos = point;
		/*eslint-enable */

		if (L.Browser.any3d && !no3d) {
			L.DomUtil.setTransform(el, point);
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		// this method is only used for elements previously positioned using setPosition,
		// so it's safe to cache the position for performance

		return el._leaflet_pos;
	}
};


(function () {
	// prefix style property names

	L.DomUtil.TRANSFORM = L.DomUtil.testProp(
			['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);


	// webkitTransition comes first because some browser versions that drop vendor prefix don't do
	// the same for the transitionend event, in particular the Android 4.1 stock browser

	var transition = L.DomUtil.TRANSITION = L.DomUtil.testProp(
			['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

	L.DomUtil.TRANSITION_END =
			transition === 'webkitTransition' || transition === 'OTransition' ? transition + 'End' : 'transitionend';


	if ('onselectstart' in document) {
		L.DomUtil.disableTextSelection = function () {
			L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
		};
		L.DomUtil.enableTextSelection = function () {
			L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
		};

	} else {
		var userSelectProperty = L.DomUtil.testProp(
			['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

		L.DomUtil.disableTextSelection = function () {
			if (userSelectProperty) {
				var style = document.documentElement.style;
				this._userSelect = style[userSelectProperty];
				style[userSelectProperty] = 'none';
			}
		};
		L.DomUtil.enableTextSelection = function () {
			if (userSelectProperty) {
				document.documentElement.style[userSelectProperty] = this._userSelect;
				delete this._userSelect;
			}
		};
	}

	L.DomUtil.disableImageDrag = function () {
		L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
	};
	L.DomUtil.enableImageDrag = function () {
		L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
	};

	L.DomUtil.preventOutline = function (element) {
		L.DomUtil.restoreOutline();
		this._outlineElement = element;
		this._outlineStyle = element.style.outline;
		element.style.outline = 'none';
		L.DomEvent.on(window, 'keydown', L.DomUtil.restoreOutline, this);
	};
	L.DomUtil.restoreOutline = function () {
		if (!this._outlineElement) { return; }
		this._outlineElement.style.outline = this._outlineStyle;
		delete this._outlineElement;
		delete this._outlineStyle;
		L.DomEvent.off(window, 'keydown', L.DomUtil.restoreOutline, this);
	};
})();
