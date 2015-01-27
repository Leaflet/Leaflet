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
			var filter = L.DomUtil.getFilter(el, 'DXImageTransform.Microsoft.Alpha');

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
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

	setTransform: function (el, offset, scale) {
		var pos = offset || new L.Point(0, 0);

		el.style[L.DomUtil.TRANSFORM] =
			'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
	},

	getFilter: function (el, filterName) {
		if (!el.style.filter) {
			el.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(enabled=false) ' +
							  'progid:DXImageTransform.Microsoft.Alpha(enabled=false)';
		}
		return el.filters.item(filterName);
	},

	setAnchoredTransform: function (el, pos, anchor, angle, scale) { // (HTMLElement, Point, Point, number, number)
		// this method positions rotated & scaled elements.
		// rotation and scaling is performed at 'anchor'.
		// an anchor of 0 0 rotates the element at the center.

		// jshint camelcase: false
		el._leaflet_pos = pos;

		var theta = angle * Math.PI / 180,
			scaleSinTheta = Math.sin(theta) * scale,
			scaleCosTheta = Math.cos(theta) * scale,
			shift = L.point(pos.x + anchor.x - scaleCosTheta * anchor.x + scaleSinTheta * anchor.y,
							pos.y + anchor.y - scaleCosTheta * anchor.y - scaleSinTheta * anchor.x);
		
		if (L.Browser.any3d) {
			var is3d = L.Browser.webkit3d;
			el.style[L.DomUtil.TRANSFORM] =
				'translate' + (is3d ? '3d(' : '(') + shift.x + 'px,' + shift.y + 'px' + (is3d ? ',0)' : ')') +
				(scale !== 1 ? ' scale(' + scale + ')' : '') +
				(angle !== 0 ? ' rotate(' + angle + 'deg)' : '');
		} else if (L.Browser.ie) {
			// DXImageTransform shifts and enlarges the image to avoid clipping.
			// We apply an opposite shift to ensure the element appears in the correct position.
			var bounds = L.point(el.width, el.height),
				rotatedBounds = L.point(el.width * Math.abs(scaleCosTheta) + el.height * Math.abs(scaleSinTheta),
										el.width * Math.abs(scaleSinTheta) + el.height * Math.abs(scaleCosTheta));

			shift = shift.add(bounds.subtract(rotatedBounds).divideBy(2));

			var filter = L.DomUtil.getFilter(el, 'DXImageTransform.Microsoft.Matrix');
			filter.sizingMethod = 'auto expand';
			filter.m11 = scaleCosTheta;
			filter.m12 = -scaleSinTheta;
			filter.m21 = scaleSinTheta;
			filter.m22 = scaleCosTheta;
			filter.Enabled = true;
			el.style.left = shift.x + 'px';
			el.style.top = shift.y + 'px';
		} else {
			el.style.left = pos.x + 'px';
			el.style.top = pos.y + 'px';
		}
	},

	setPosition: function (el, point, no3d) { // (HTMLElement, Point[, Boolean])
		// jshint camelcase: false
		el._leaflet_pos = point;

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

		// jshint camelcase: false
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
})();
