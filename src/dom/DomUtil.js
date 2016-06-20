/*
 * L.DomUtil contains various utility functions for working with DOM.
 */

L.DomUtil = {
	get: function (id) {
		return typeof id === 'string' ? document.getElementById(id) : id;
	},

	getStyle: function (el, style) {

		var value = Polymer.dom(el).node.style[style] || (Polymer.dom(el).node.currentStyle && Polymer.dom(el).node.currentStyle[style]);

		if ((!value || value === 'auto') && document.defaultView) {
			Polymer.dom.flush();
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}

		return value === 'auto' ? null : value;
	},

	create: function (tagName, className, container) {

		var el = document.createElement(tagName);
		el.className = className || '';

		if (container) {
			Polymer.dom(container).appendChild(el);
		}

		return el;
	},

	// @function remove(el: HTMLElement)
	// Removes `el` from its parent element
	remove: function (el) {
		var parent = Polymer.dom(el).parentNode;
		if (parent) {
			Polymer.dom(parent).removeChild(el);
		}
	},

	empty: function (el) {
		while (Polymer.dom(el).firstChild) {
			Polymer.dom(el).removeChild(Polymer.dom(el).firstChild);
		}
	},

	toFront: function (el) {
		Polymer.dom(Polymer.dom(el).parentNode).appendChild(el);
	},

	toBack: function (el) {
		var parent = Polymer.dom(el).parentNode;
		Polymer.dom(parent).insertBefore(el, Polymer.dom(parent).firstChild);
	},

	hasClass: function (el, name) {
		if (Polymer.dom(el).classList !== undefined) {
			return Polymer.dom(el).classList.contains(name);
		}
		var className = L.DomUtil.getClass(el);
		return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	},

	addClass: function (el, name) {
		if (Polymer.dom(el).classList !== undefined) {
			var classes = L.Util.splitWords(name);
			for (var i = 0, len = classes.length; i < len; i++) {
				Polymer.dom(el).classList.add(classes[i]);
			}
		} else if (!L.DomUtil.hasClass(el, name)) {
			var className = L.DomUtil.getClass(el);
			L.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
		}
	},

	removeClass: function (el, name) {
		if (Polymer.dom(el).classList !== undefined) {
			Polymer.dom(el).classList.remove(name);
		} else {
			L.DomUtil.setClass(el, L.Util.trim((' ' + L.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
		}
	},

	setClass: function (el, name) {
		if (Polymer.dom(el).classList.node.className.baseVal === undefined) {
			Polymer.dom(el).classList.node.className = name;
		} else {
			// in case of SVG element
			Polymer.dom(el).classList.node.className.baseVal = name;
		}
	},

	getClass: function (el) {
		return Polymer.dom(el).classList.node.className.baseVal === undefined ? Polymer.dom(el).classList.node.className : Polymer.dom(el).classList.node.className.baseVal;
	},

	setOpacity: function (el, value) {

		if ('opacity' in Polymer.dom(el).node.style) {
			Polymer.dom(el).node.style.opacity = value;

		} else if ('filter' in Polymer.dom(el).node.style) {
			L.DomUtil._setOpacityIE(el, value);
		}
	},

	_setOpacityIE: function (el, value) {
		var filter = false,
		    filterName = 'DXImageTransform.Microsoft.Alpha';

		// filters collection throws an error if we try to retrieve a filter that doesn't exist
		try {
			filter = Polymer.dom(el).filters.item(filterName);
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
			Polymer.dom(el).node.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
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

		Polymer.dom(el).node.style[L.DomUtil.TRANSFORM] =
			(L.Browser.ie3d ?
				'translate(' + pos.x + 'px,' + pos.y + 'px)' :
				'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
			(scale ? ' scale(' + scale + ')' : '');
	},

	setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])

		/*eslint-disable */
		Polymer.dom(el)._leaflet_pos = point;
		/*eslint-enable */

		if (L.Browser.any3d) {
			L.DomUtil.setTransform(el, point);
		} else {
			Polymer.dom(el).node.style.left = point.x + 'px';
			Polymer.dom(el).node.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		// this method is only used for elements previously positioned using setPosition,
		// so it's safe to cache the position for performance

		return Polymer.dom(el)._leaflet_pos || new L.Point(0, 0);
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
		while (Polymer.dom(element).node.tabIndex === -1) {
			element = Polymer.dom(element).parentNode;
		}
		if (!element || !Polymer.dom(element).node.style) { return; }
		L.DomUtil.restoreOutline();
		this._outlineElement = element;
		this._outlineStyle = Polymer.dom(element).node.style.outline;
		Polymer.dom(element).node.style.outline = 'none';
		L.DomEvent.on(window, 'keydown', L.DomUtil.restoreOutline, this);
	};
	L.DomUtil.restoreOutline = function () {
		if (!this._outlineElement) { return; }
		Polymer.dom(this._outlineElement).node.style.outline = this._outlineStyle;
		delete this._outlineElement;
		delete this._outlineStyle;
		L.DomEvent.off(window, 'keydown', L.DomUtil.restoreOutline, this);
	};
})();
