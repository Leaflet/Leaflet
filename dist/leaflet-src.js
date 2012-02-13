/*
 Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 Leaflet is a modern open-source JavaScript library for interactive maps.
 http://leaflet.cloudmade.com
*/

(function (root) {
	root.L = {
		VERSION: '0.3',

		ROOT_URL: root.L_ROOT_URL || (function () {
			var scripts = document.getElementsByTagName('script'),
				leafletRe = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/;

			var i, len, src, matches;

			for (i = 0, len = scripts.length; i < len; i++) {
				src = scripts[i].src;
				matches = src.match(leafletRe);

				if (matches) {
					if (matches[1] === 'include') {
						return '../../dist/';
					}
					return src.replace(leafletRe, '') + '/';
				}
			}
			return '';
		}()),

		noConflict: function () {
			root.L = this._originalL;
			return this;
		},

		_originalL: root.L
	};
}(this));


/*
 * L.Util is a namespace for various utility functions.
 */

L.Util = {
	extend: function (/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
		var sources = Array.prototype.slice.call(arguments, 1);
		for (var j = 0, len = sources.length, src; j < len; j++) {
			src = sources[j] || {};
			for (var i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},

	bind: function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
		return function () {
			return fn.apply(obj, arguments);
		};
	},

	stamp: (function () {
		var lastId = 0, key = '_leaflet_id';
		return function (/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),

	requestAnimFrame: (function () {
		function timeoutDefer(callback) {
			window.setTimeout(callback, 1000 / 60);
		}

		var requestFn = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			timeoutDefer;

		return function (callback, context, immediate, contextEl) {
			callback = context ? L.Util.bind(callback, context) : callback;
			if (immediate && requestFn === timeoutDefer) {
				callback();
			} else {
				requestFn(callback, contextEl);
			}
		};
	}()),

	limitExecByInterval: function (fn, time, context) {
		var lock, execOnUnlock, args;
		function exec() {
			lock = false;
			if (execOnUnlock) {
				args.callee.apply(context, args);
				execOnUnlock = false;
			}
		}
		return function () {
			args = arguments;
			if (!lock) {
				lock = true;
				setTimeout(exec, time);
				fn.apply(context, args);
			} else {
				execOnUnlock = true;
			}
		};
	},

	falseFn: function () {
		return false;
	},

	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	setOptions: function (obj, options) {
		obj.options = L.Util.extend({}, obj.options, options);
	},

	getParamString: function (obj) {
		var params = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				params.push(i + '=' + obj[i]);
			}
		}
		return '?' + params.join('&');
	},

	template: function (str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			var value = data[key];
			if (!data.hasOwnProperty(key)) {
				throw new Error('No value provided for variable ' + str);
			}
			return value;
		});
	}
};


/*
 * Class powers the OOP facilities of the library. Thanks to John Resig and Dean Edwards for inspiration!
 */

L.Class = function () {};

L.Class.extend = function (/*Object*/ props) /*-> Class*/ {

	// extended class with the new prototype
	var NewClass = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;
	var proto = new F();

	proto.constructor = NewClass;
	NewClass.prototype = proto;

	// add superclass access
	NewClass.superclass = this.prototype;

	// add class name
	//proto.className = props;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== 'superclass') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		L.Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = L.Util.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	L.Util.extend(proto, props);

	// allow inheriting further
	NewClass.extend = L.Class.extend;

	// method for adding properties to prototype
	NewClass.include = function (props) {
		L.Util.extend(this.prototype, props);
	};

	return NewClass;
};


/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes
 */

L.Mixin = {};

L.Mixin.Events = {
	addEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._leaflet_events = this._leaflet_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context || this
		});
		return this;
	},

	hasEventListeners: function (/*String*/ type) /*-> Boolean*/ {
		var k = '_leaflet_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},

	removeEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		for (var i = 0, events = this._leaflet_events, len = events[type].length; i < len; i++) {
			if (
				(events[type][i].action === fn) &&
				(!context || (events[type][i].context === context))
			) {
				events[type].splice(i, 1);
				return this;
			}
		}
		return this;
	},

	fireEvent: function (/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({
			type: type,
			target: this
		}, data);

		var listeners = this._leaflet_events[type].slice();

		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}

		return this;
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;


(function () {
	var ua = navigator.userAgent.toLowerCase(),
		ie = !!window.ActiveXObject,
		webkit = ua.indexOf("webkit") !== -1,
		mobile = typeof orientation !== 'undefined' ? true : false,
		android = ua.indexOf("android") !== -1,
		opera = window.opera;

	L.Browser = {
		ie: ie,
		ie6: ie && !window.XMLHttpRequest,

		webkit: webkit,
		webkit3d: webkit && ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),

		gecko: ua.indexOf("gecko") !== -1,

		opera: opera,

		android: android,
		mobileWebkit: mobile && webkit,
		mobileOpera: mobile && opera,

		mobile: mobile,
		touch: (function () {
			var touchSupported = false,
				startName = 'ontouchstart';

			// WebKit, etc
			if (startName in document.documentElement) {
				return true;
			}

			// Firefox/Gecko
			var e = document.createElement('div');

			// If no support for basic event stuff, unlikely to have touch support
			if (!e.setAttribute || !e.removeAttribute) {
				return false;
			}

			e.setAttribute(startName, 'return;');
			if (typeof e[startName] === 'function') {
				touchSupported = true;
			}

			e.removeAttribute(startName);
			e = null;

			return touchSupported;
		}())
	};
}());


/*
 * L.Point represents a point with x and y coordinates.
 */

L.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

L.Point.prototype = {
	add: function (point) {
		return this.clone()._add(point);
	},

	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(point);
	},

	// destructive subtract (faster)
	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num, round) {
		return new L.Point(this.x / num, this.y / num, round);
	},

	multiplyBy: function (num) {
		return new L.Point(this.x * num, this.y * num);
	},

	distanceTo: function (point) {
		var x = point.x - this.x,
			y = point.y - this.y;
		return Math.sqrt(x * x + y * y);
	},

	round: function () {
		return this.clone()._round();
	},

	// destructive round
	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	clone: function () {
		return new L.Point(this.x, this.y);
	},

	toString: function () {
		return 'Point(' +
				L.Util.formatNum(this.x) + ', ' +
				L.Util.formatNum(this.y) + ')';
	}
};


/*
 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

L.Bounds = L.Class.extend({
	initialize: function (min, max) {	//(Point, Point) or Point[]
		if (!min) {
			return;
		}
		var points = (min instanceof Array ? min : [min, max]);
		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	},

	// extend the bounds to contain the given point
	extend: function (/*Point*/ point) {
		if (!this.min && !this.max) {
			this.min = new L.Point(point.x, point.y);
			this.max = new L.Point(point.x, point.y);
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
	},

	getCenter: function (round)/*->Point*/ {
		return new L.Point(
				(this.min.x + this.max.x) / 2,
				(this.min.y + this.max.y) / 2, round);
	},

	contains: function (/*Bounds or Point*/ obj)/*->Boolean*/ {
		var min, max;

		if (obj instanceof L.Bounds) {
			min = obj.min;
			max = obj.max;
		} else {
			min = max = obj;
		}

		return (min.x >= this.min.x) &&
				(max.x <= this.max.x) &&
				(min.y >= this.min.y) &&
				(max.y <= this.max.y);
	},

	intersects: function (/*Bounds*/ bounds) {
		var min = this.min,
			max = this.max,
			min2 = bounds.min,
			max2 = bounds.max;

		var xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
			yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	}

});


/*
 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

L.Transformation = L.Class.extend({
	initialize: function (/*Number*/ a, /*Number*/ b, /*Number*/ c, /*Number*/ d) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	},

	transform: function (point, scale) {
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (/*Point*/ point, /*Number*/ scale) /*-> Point*/ {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	untransform: function (/*Point*/ point, /*Number*/ scale) /*-> Point*/ {
		scale = scale || 1;
		return new L.Point(
			(point.x / scale - this._b) / this._a,
			(point.y / scale - this._d) / this._c);
	}
});


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
		el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
			if (match === name) {
				return '';
			}
			return w;
		}).replace(/^\s+/, '');
	},

	setOpacity: function (el, value) {
		if (L.Browser.ie) {
			el.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';
		} else {
			el.style.opacity = value;
		}
	},

	//TODO refactor away this ugly translate/position mess

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
		return L.DomUtil.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				L.DomUtil.TRANSLATE_CLOSE;
	},

	getScaleString: function (scale, origin) {
		var preTranslateStr = L.DomUtil.getTranslateString(origin),
			scaleStr = ' scale(' + scale + ') ',
			postTranslateStr = L.DomUtil.getTranslateString(origin.multiplyBy(-1));

		return preTranslateStr + scaleStr + postTranslateStr;
	},

	setPosition: function (el, point) {
		el._leaflet_pos = point;
		if (L.Browser.webkit3d) {
			el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);

			if (L.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
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
	TRANSFORM: L.DomUtil.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),

	TRANSLATE_OPEN: 'translate' + (L.Browser.webkit3d ? '3d(' : '('),
	TRANSLATE_CLOSE: L.Browser.webkit3d ? ',0)' : ')'
});


/*
	CM.LatLng represents a geographical point with latitude and longtitude coordinates.
*/

L.LatLng = function (/*Number*/ rawLat, /*Number*/ rawLng, /*Boolean*/ noWrap) {
	var lat = parseFloat(rawLat),
		lng = parseFloat(rawLng);

	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + rawLat + ', ' + rawLng + ')');
	}

	if (noWrap !== true) {
		lat = Math.max(Math.min(lat, 90), -90);					// clamp latitude into -90..90
		lng = (lng + 180) % 360 + ((lng < -180 || lng === 180) ? 180 : -180);	// wrap longtitude into -180..180
	}

	//TODO change to lat() & lng()
	this.lat = lat;
	this.lng = lng;
};

L.Util.extend(L.LatLng, {
	DEG_TO_RAD: Math.PI / 180,
	RAD_TO_DEG: 180 / Math.PI,
	MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

L.LatLng.prototype = {
	equals: function (/*LatLng*/ obj) {
		if (!(obj instanceof L.LatLng)) {
			return false;
		}

		var margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));
		return margin <= L.LatLng.MAX_MARGIN;
	},

	toString: function () {
		return 'LatLng(' +
				L.Util.formatNum(this.lat) + ', ' +
				L.Util.formatNum(this.lng) + ')';
	},

	// Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
	distanceTo: function (/*LatLng*/ other)/*->Double*/ {
		var R = 6378137, // earth radius in meters
			d2r = L.LatLng.DEG_TO_RAD,
			dLat = (other.lat - this.lat) * d2r,
			dLon = (other.lng - this.lng) * d2r,
			lat1 = this.lat * d2r,
			lat2 = other.lat * d2r,
			sin1 = Math.sin(dLat / 2),
			sin2 = Math.sin(dLon / 2);

		var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

		return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	}
};


/*
 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

L.LatLngBounds = L.Class.extend({
	initialize: function (southWest, northEast) {	// (LatLng, LatLng) or (LatLng[])
		if (!southWest) {
			return;
		}
		var latlngs = (southWest instanceof Array ? southWest : [southWest, northEast]);
		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	},

	// extend the bounds to contain the given point
	extend: function (/*LatLng*/ latlng) {
		if (!this._southWest && !this._northEast) {
			this._southWest = new L.LatLng(latlng.lat, latlng.lng, true);
			this._northEast = new L.LatLng(latlng.lat, latlng.lng, true);
		} else {
			this._southWest.lat = Math.min(latlng.lat, this._southWest.lat);
			this._southWest.lng = Math.min(latlng.lng, this._southWest.lng);
			this._northEast.lat = Math.max(latlng.lat, this._northEast.lat);
			this._northEast.lng = Math.max(latlng.lng, this._northEast.lng);
		}
	},

	getCenter: function () /*-> LatLng*/ {
		return new L.LatLng(
				(this._southWest.lat + this._northEast.lat) / 2,
				(this._southWest.lng + this._northEast.lng) / 2);
	},

	getSouthWest: function () {
		return this._southWest;
	},

	getNorthEast: function () {
		return this._northEast;
	},

	getNorthWest: function () {
		return new L.LatLng(this._northEast.lat, this._southWest.lng, true);
	},

	getSouthEast: function () {
		return new L.LatLng(this._southWest.lat, this._northEast.lng, true);
	},

	contains: function (/*LatLngBounds or LatLng*/ obj) /*-> Boolean*/ {
		var sw = this._southWest,
			ne = this._northEast,
			sw2, ne2;

		if (obj instanceof L.LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
				(sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	intersects: function (/*LatLngBounds*/ bounds) {
		var sw = this._southWest,
			ne = this._northEast,
			sw2 = bounds.getSouthWest(),
			ne2 = bounds.getNorthEast();

		var latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
			lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	toBBoxString: function () {
		var sw = this._southWest,
			ne = this._northEast;
		return [sw.lng, sw.lat, ne.lng, ne.lat].join(',');
	}
});

//TODO International date line?


/*
 * L.Projection contains various geographical projections used by CRS classes.
 */

L.Projection = {};



L.Projection.SphericalMercator = {
	MAX_LATITUDE: 85.0511287798,

	project: function (/*LatLng*/ latlng) /*-> Point*/ {
		var d = L.LatLng.DEG_TO_RAD,
			max = this.MAX_LATITUDE,
			lat = Math.max(Math.min(max, latlng.lat), -max),
			x = latlng.lng * d,
			y = lat * d;
		y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

		return new L.Point(x, y);
	},

	unproject: function (/*Point*/ point, /*Boolean*/ unbounded) /*-> LatLng*/ {
		var d = L.LatLng.RAD_TO_DEG,
			lng = point.x * d,
			lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d;

		return new L.LatLng(lat, lng, unbounded);
	}
};



L.Projection.LonLat = {
	project: function (latlng) {
		return new L.Point(latlng.lng, latlng.lat);
	},

	unproject: function (point, unbounded) {
		return new L.LatLng(point.y, point.x, unbounded);
	}
};



L.CRS = {
	latLngToPoint: function (/*LatLng*/ latlng, /*Number*/ scale)/*-> Point*/ {
		var projectedPoint = this.projection.project(latlng);
		return this.transformation._transform(projectedPoint, scale);
	},

	pointToLatLng: function (/*Point*/ point, /*Number*/ scale, /*(optional) Boolean*/ unbounded)/*-> LatLng*/ {
		var untransformedPoint = this.transformation.untransform(point, scale);
		return this.projection.unproject(untransformedPoint, unbounded);
		//TODO get rid of 'unbounded' everywhere
	},

	project: function (latlng) {
		return this.projection.project(latlng);
	}
};



L.CRS.EPSG3857 = L.Util.extend({}, L.CRS, {
	code: 'EPSG:3857',

	projection: L.Projection.SphericalMercator,
	transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

	project: function (/*LatLng*/ latlng)/*-> Point*/ {
		var projectedPoint = this.projection.project(latlng),
			earthRadius = 6378137;
		return projectedPoint.multiplyBy(earthRadius);
	}
});

L.CRS.EPSG900913 = L.Util.extend({}, L.CRS.EPSG3857, {
	code: 'EPSG:900913'
});



L.CRS.EPSG4326 = L.Util.extend({}, L.CRS, {
	code: 'EPSG:4326',

	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
});


/*
 * L.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		// projection
		crs: L.CRS.EPSG3857 || L.CRS.EPSG4326,
		scale: function (zoom) {
			return 256 * Math.pow(2, zoom);
		},

		// state
		center: null,
		zoom: null,
		layers: [],

		// interaction
		dragging: true,
		touchZoom: L.Browser.touch && !L.Browser.android,
		scrollWheelZoom: !L.Browser.touch,
		doubleClickZoom: true,
		boxZoom: true,

		// controls
		zoomControl: true,
		attributionControl: true,

		// animation
		fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android,
		zoomAnimation: L.DomUtil.TRANSITION && !L.Browser.android && !L.Browser.mobileOpera,

		// misc
		trackResize: true,
		closePopupOnClick: true,
		worldCopyJump: true
	},


	// constructor

	initialize: function (id, options) { // (HTMLElement or String, Object)
		L.Util.setOptions(this, options);

		this._container = L.DomUtil.get(id);

		if (this._container._leaflet) {
			throw new Error("Map container is already initialized.");
		}
		this._container._leaflet = true;

		this._initLayout();

		if (L.DomEvent) {
			this._initEvents();
			if (L.Handler) {
				this._initInteraction();
			}
			if (L.Control) {
				this._initControls();
			}
		}

		if (this.options.maxBounds) {
			this.setMaxBounds(this.options.maxBounds);
		}

		var center = this.options.center,
			zoom = this.options.zoom;

		if (center !== null && zoom !== null) {
			this.setView(center, zoom, true);
		}

		var layers = this.options.layers;
		layers = (layers instanceof Array ? layers : [layers]);
		this._tileLayersNum = 0;
		this._initLayers(layers);
	},


	// public methods that modify map state

	// replaced by animation-powered implementation in Map.PanAnimation.js
	setView: function (center, zoom) {
		// reset the map view
		this._resetView(center, this._limitZoom(zoom));
		return this;
	},

	setZoom: function (zoom) { // (Number)
		return this.setView(this.getCenter(), zoom);
	},

	zoomIn: function () {
		return this.setZoom(this._zoom + 1);
	},

	zoomOut: function () {
		return this.setZoom(this._zoom - 1);
	},

	fitBounds: function (bounds) { // (LatLngBounds)
		var zoom = this.getBoundsZoom(bounds);
		return this.setView(bounds.getCenter(), zoom);
	},

	fitWorld: function () {
		var sw = new L.LatLng(-60, -170),
			ne = new L.LatLng(85, 179);
		return this.fitBounds(new L.LatLngBounds(sw, ne));
	},

	panTo: function (center) { // (LatLng)
		return this.setView(center, this._zoom);
	},

	panBy: function (offset) { // (Point)
		// replaced with animated panBy in Map.Animation.js
		this.fire('movestart');

		this._rawPanBy(offset);

		this.fire('move');
		this.fire('moveend');

		return this;
	},

	setMaxBounds: function (bounds) {
		this.options.maxBounds = bounds;

		if (!bounds) {
			this._boundsMinZoom = null;
			return this;
		}

		var minZoom = this.getBoundsZoom(bounds, true);

		this._boundsMinZoom = minZoom;

		if (this._loaded) {
			if (this._zoom < minZoom) {
				this.setView(bounds.getCenter(), minZoom);
			} else {
				this.panInsideBounds(bounds);
			}
		}
		return this;
	},

	panInsideBounds: function (bounds) {
		var viewBounds = this.getBounds(),
			viewSw = this.project(viewBounds.getSouthWest()),
			viewNe = this.project(viewBounds.getNorthEast()),
			sw = this.project(bounds.getSouthWest()),
			ne = this.project(bounds.getNorthEast()),
			dx = 0,
			dy = 0;

		if (viewNe.y < ne.y) { // north
			dy = ne.y - viewNe.y;
		}
		if (viewNe.x > ne.x) { // east
			dx = ne.x - viewNe.x;
		}
		if (viewSw.y > sw.y) { // south
			dy = sw.y - viewSw.y;
		}
		if (viewSw.x < sw.x) { // west
			dx = sw.x - viewSw.x;
		}

		return this.panBy(new L.Point(dx, dy, true));
	},

	addLayer: function (layer, insertAtTheTop) {
		var id = L.Util.stamp(layer);

		if (this._layers[id]) {
			return this;
		}

		this._layers[id] = layer;

		if (layer.options && !isNaN(layer.options.maxZoom)) {
			this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, layer.options.maxZoom);
		}
		if (layer.options && !isNaN(layer.options.minZoom)) {
			this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, layer.options.minZoom);
		}
		//TODO getMaxZoom, getMinZoom in ILayer (instead of options)

		if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
			this._tileLayersNum++;
			layer.on('load', this._onTileLayerLoad, this);
		}
		if (this.attributionControl && layer.getAttribution) {
			this.attributionControl.addAttribution(layer.getAttribution());
		}

		var onMapLoad = function () {
			layer.onAdd(this, insertAtTheTop);
			this.fire('layeradd', {layer: layer});
		};

		if (this._loaded) {
			onMapLoad.call(this);
		} else {
			this.on('load', onMapLoad, this);
		}

		return this;
	},

	removeLayer: function (layer) {
		var id = L.Util.stamp(layer);

		if (this._layers[id]) {
			layer.onRemove(this);
			delete this._layers[id];

			if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
				this._tileLayersNum--;
				layer.off('load', this._onTileLayerLoad, this);
			}
			if (this.attributionControl && layer.getAttribution) {
				this.attributionControl.removeAttribution(layer.getAttribution());
			}

			this.fire('layerremove', {layer: layer});
		}
		return this;
	},

	hasLayer: function (layer) {
		var id = L.Util.stamp(layer);
		return this._layers.hasOwnProperty(id);
	},

	invalidateSize: function () {
		var oldSize = this.getSize();

		this._sizeChanged = true;

		if (this.options.maxBounds) {
			this.setMaxBounds(this.options.maxBounds);
		}

		if (!this._loaded) {
			return this;
		}

		this._rawPanBy(oldSize.subtract(this.getSize()).divideBy(2, true));

		this.fire('move');

		clearTimeout(this._sizeTimer);
		this._sizeTimer = setTimeout(L.Util.bind(function () {
			this.fire('moveend');
		}, this), 200);

		return this;
	},


	// public methods for getting map state

	getCenter: function (unbounded) { // (Boolean)
		var viewHalf = this.getSize().divideBy(2),
			centerPoint = this._getTopLeftPoint().add(viewHalf);
		return this.unproject(centerPoint, this._zoom, unbounded);
	},

	getZoom: function () {
		return this._zoom;
	},

	getBounds: function () {
		var bounds = this.getPixelBounds(),
			sw = this.unproject(new L.Point(bounds.min.x, bounds.max.y), this._zoom, true),
			ne = this.unproject(new L.Point(bounds.max.x, bounds.min.y), this._zoom, true);
		return new L.LatLngBounds(sw, ne);
	},

	getMinZoom: function () {
		var z1 = this.options.minZoom || 0,
			z2 = this._layersMinZoom || 0,
			z3 = this._boundsMinZoom || 0;

		return Math.max(z1, z2, z3);
	},

	getMaxZoom: function () {
		var z1 = isNaN(this.options.maxZoom) ? Infinity : this.options.maxZoom,
			z2 = this._layersMaxZoom || Infinity;

		return Math.min(z1, z2);
	},

	getBoundsZoom: function (bounds, inside) { // (LatLngBounds)
		var size = this.getSize(),
			zoom = this.options.minZoom || 0,
			maxZoom = this.getMaxZoom(),
			ne = bounds.getNorthEast(),
			sw = bounds.getSouthWest(),
			boundsSize,
			nePoint,
			swPoint,
			zoomNotFound = true;

		if (inside) {
			zoom--;
		}

		do {
			zoom++;
			nePoint = this.project(ne, zoom);
			swPoint = this.project(sw, zoom);
			boundsSize = new L.Point(nePoint.x - swPoint.x, swPoint.y - nePoint.y);

			if (!inside) {
				zoomNotFound = (boundsSize.x <= size.x) && (boundsSize.y <= size.y);
			} else {
				zoomNotFound = (boundsSize.x < size.x) || (boundsSize.y < size.y);
			}
		} while (zoomNotFound && (zoom <= maxZoom));

		if (zoomNotFound && inside) {
			return null;
		}

		return inside ? zoom : zoom - 1;
	},

	getSize: function () {
		if (!this._size || this._sizeChanged) {
			this._size = new L.Point(this._container.clientWidth, this._container.clientHeight);
			this._sizeChanged = false;
		}
		return this._size;
	},

	getPixelBounds: function () {
		var topLeftPoint = this._getTopLeftPoint(),
			size = this.getSize();
		return new L.Bounds(topLeftPoint, topLeftPoint.add(size));
	},

	getPixelOrigin: function () {
		return this._initialTopLeftPoint;
	},

	getPanes: function () {
		return this._panes;
	},


	// conversion methods

	mouseEventToContainerPoint: function (e) { // (MouseEvent)
		return L.DomEvent.getMousePosition(e, this._container);
	},

	mouseEventToLayerPoint: function (e) { // (MouseEvent)
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},

	mouseEventToLatLng: function (e) { // (MouseEvent)
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},

	containerPointToLayerPoint: function (point) { // (Point)
		return point.subtract(L.DomUtil.getPosition(this._mapPane));
	},

	layerPointToContainerPoint: function (point) { // (Point)
		return point.add(L.DomUtil.getPosition(this._mapPane));
	},

	layerPointToLatLng: function (point) { // (Point)
		return this.unproject(point.add(this._initialTopLeftPoint));
	},

	latLngToLayerPoint: function (latlng) { // (LatLng)
		return this.project(latlng)._round()._subtract(this._initialTopLeftPoint);
	},

	project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
		zoom = (typeof zoom === 'undefined' ? this._zoom : zoom);
		return this.options.crs.latLngToPoint(latlng, this.options.scale(zoom));
	},

	unproject: function (point, zoom, unbounded) { // (Point[, Number, Boolean]) -> LatLng
		zoom = (typeof zoom === 'undefined' ? this._zoom : zoom);
		return this.options.crs.pointToLatLng(point, this.options.scale(zoom), unbounded);
	},


	// private methods that modify map state

	_initLayout: function () {
		var container = this._container;

		container.innerHTML = '';

		container.className += ' leaflet-container';

		if (this.options.fadeAnimation) {
			container.className += ' leaflet-fade-anim';
		}

		var position = L.DomUtil.getStyle(container, 'position');
		if (position !== 'absolute' && position !== 'relative') {
			container.style.position = 'relative';
		}

		this._initPanes();

		if (this._initControlPos) {
			this._initControlPos();
		}
	},

	_initPanes: function () {
		var panes = this._panes = {};

		this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane', this._container);

		this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane', this._mapPane);
		this._objectsPane = panes.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane);

		panes.shadowPane = this._createPane('leaflet-shadow-pane');
		panes.overlayPane = this._createPane('leaflet-overlay-pane');
		panes.markerPane = this._createPane('leaflet-marker-pane');
		panes.popupPane = this._createPane('leaflet-popup-pane');
	},

	_createPane: function (className, container) {
		return L.DomUtil.create('div', className, container || this._objectsPane);
	},

	_resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {
		var zoomChanged = (this._zoom !== zoom);

		if (!afterZoomAnim) {
			this.fire('movestart');

			if (zoomChanged) {
				this.fire('zoomstart');
			}
		}

		this._zoom = zoom;

		this._initialTopLeftPoint = this._getNewTopLeftPoint(center);

		if (!preserveMapOffset) {
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		} else {
			var offset = L.DomUtil.getPosition(this._mapPane);
			this._initialTopLeftPoint._add(offset);
		}

		this._tileLayersToLoad = this._tileLayersNum;
		this.fire('viewreset', {hard: !preserveMapOffset});

		this.fire('move');
		if (zoomChanged || afterZoomAnim) {
			this.fire('zoomend');
		}
		this.fire('moveend');

		if (!this._loaded) {
			this._loaded = true;
			this.fire('load');
		}
	},

	_initLayers: function (layers) {
		this._layers = {};

		var i, len;

		for (i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},

	_initControls: function () {
		if (this.options.zoomControl) {
			this.addControl(new L.Control.Zoom());
		}
		if (this.options.attributionControl) {
			this.attributionControl = new L.Control.Attribution();
			this.addControl(this.attributionControl);
		}
	},

	_rawPanBy: function (offset) {
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane);
		L.DomUtil.setPosition(this._mapPane, mapPaneOffset.subtract(offset));
	},


	// map events

	_initEvents: function () {
		L.DomEvent.addListener(this._container, 'click', this._onMouseClick, this);

		var events = ['dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'contextmenu'];

		var i, len;

		for (i = 0, len = events.length; i < len; i++) {
			L.DomEvent.addListener(this._container, events[i], this._fireMouseEvent, this);
		}

		if (this.options.trackResize) {
			L.DomEvent.addListener(window, 'resize', this._onResize, this);
		}
	},

	_onResize: function () {
		L.Util.requestAnimFrame(this.invalidateSize, this, false, this._container);
	},

	_onMouseClick: function (e) {
		if (!this._loaded || (this.dragging && this.dragging.moved())) {
			return;
		}

		this.fire('pre' + e.type);
		this._fireMouseEvent(e);
	},

	_fireMouseEvent: function (e) {
		if (!this._loaded) {
			return;
		}

		var type = e.type;
		type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

		if (!this.hasEventListeners(type)) {
			return;
		}

		if (type === 'contextmenu') {
			L.DomEvent.preventDefault(e);
		}
		
		this.fire(type, {
			latlng: this.mouseEventToLatLng(e),
			layerPoint: this.mouseEventToLayerPoint(e)
		});
	},

	_initInteraction: function () {
		var handlers = {
			dragging: L.Map.Drag,
			touchZoom: L.Map.TouchZoom,
			doubleClickZoom: L.Map.DoubleClickZoom,
			scrollWheelZoom: L.Map.ScrollWheelZoom,
			boxZoom: L.Map.BoxZoom
		};

		var i;
		for (i in handlers) {
			if (handlers.hasOwnProperty(i) && handlers[i]) {
				this[i] = new handlers[i](this);
				if (this.options[i]) {
					this[i].enable();
				}
				// TODO move enabling to handler contructor
			}
		}
	},

	_onTileLayerLoad: function () {
		// clear scaled tiles after all new tiles are loaded (for performance)
		this._tileLayersToLoad--;
		if (this._tileLayersNum && !this._tileLayersToLoad && this._tileBg) {
			clearTimeout(this._clearTileBgTimer);
			this._clearTileBgTimer = setTimeout(L.Util.bind(this._clearTileBg, this), 500);
		}
	},


	// private methods for getting map state

	_getTopLeftPoint: function () {
		if (!this._loaded) {
			throw new Error('Set map center and zoom first.');
		}

		var offset = L.DomUtil.getPosition(this._mapPane);
		return this._initialTopLeftPoint.subtract(offset);
	},

	_getNewTopLeftPoint: function (center) {
		var viewHalf = this.getSize().divideBy(2);
		return this.project(center).subtract(viewHalf).round();
	},

	_limitZoom: function (zoom) {
		var min = this.getMinZoom();
		var max = this.getMaxZoom();
		return Math.max(min, Math.min(max, zoom));
	}
});



L.Projection.Mercator = {
	MAX_LATITUDE: 85.0840591556,

	R_MINOR: 6356752.3142,
	R_MAJOR: 6378137,

	project: function (/*LatLng*/ latlng) /*-> Point*/ {
		var d = L.LatLng.DEG_TO_RAD,
			max = this.MAX_LATITUDE,
			lat = Math.max(Math.min(max, latlng.lat), -max),
			r = this.R_MAJOR,
			r2 = this.R_MINOR,
			x = latlng.lng * d * r,
			y = lat * d,
			tmp = r2 / r,
			eccent = Math.sqrt(1.0 - tmp * tmp),
			con = eccent * Math.sin(y);

		con = Math.pow((1 - con) / (1 + con), eccent * 0.5);

		var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
		y = -r2 * Math.log(ts);

		return new L.Point(x, y);
	},

	unproject: function (/*Point*/ point, /*Boolean*/ unbounded) /*-> LatLng*/ {
		var d = L.LatLng.RAD_TO_DEG,
			r = this.R_MAJOR,
			r2 = this.R_MINOR,
			lng = point.x * d / r,
			tmp = r2 / r,
			eccent = Math.sqrt(1 - (tmp * tmp)),
			ts = Math.exp(- point.y / r2),
			phi = (Math.PI / 2) - 2 * Math.atan(ts),
			numIter = 15,
			tol = 1e-7,
			i = numIter,
			dphi = 0.1,
			con;

		while ((Math.abs(dphi) > tol) && (--i > 0)) {
			con = eccent * Math.sin(phi);
			dphi = (Math.PI / 2) - 2 * Math.atan(ts * Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
			phi += dphi;
		}

		return new L.LatLng(phi * d, lng, unbounded);
	}
};



L.CRS.EPSG3395 = L.Util.extend({}, L.CRS, {
	code: 'EPSG:3395',

	projection: L.Projection.Mercator,
	transformation: (function () {
		var m = L.Projection.Mercator,
			r = m.R_MAJOR,
			r2 = m.R_MINOR;

		return new L.Transformation(0.5 / (Math.PI * r), 0.5, -0.5 / (Math.PI * r2), 0.5);
	}())
});


/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.TileLayer = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		opacity: 1,
		scheme: 'xyz',
		continuousWorld: false,
		noWrap: false,
		zoomOffset: 0,
		zoomReverse: false,

		unloadInvisibleTiles: L.Browser.mobile,
		updateWhenIdle: L.Browser.mobile,
		reuseTiles: L.Browser.mobile
	},

	initialize: function (url, options, urlParams) {
		L.Util.setOptions(this, options);

		this._url = url;
		this._urlParams = urlParams;

		if (typeof this.options.subdomains === 'string') {
			this.options.subdomains = this.options.subdomains.split('');
		}
	},

	onAdd: function (map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// create a container div for tiles
		this._initContainer();

		// create an image to clone for tiles
		this._createTileProto();

		// set up events
		map.on('viewreset', this._resetCallback, this);

		if (this.options.updateWhenIdle) {
			map.on('moveend', this._update, this);
		} else {
			this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
			map.on('move', this._limitedUpdate, this);
		}

		this._reset();
		this._update();
	},

	onRemove: function (map) {
		this._map.getPanes().tilePane.removeChild(this._container);
		this._container = null;

		this._map.off('viewreset', this._resetCallback, this);

		if (this.options.updateWhenIdle) {
			this._map.off('moveend', this._update, this);
		} else {
			this._map.off('move', this._limitedUpdate, this);
		}
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		this._setOpacity(opacity);

		// stupid webkit hack to force redrawing of tiles
		if (L.Browser.webkit) {
			for (var i in this._tiles) {
				if (this._tiles.hasOwnProperty(i)) {
					this._tiles[i].style.webkitTransform += ' translate(0,0)';
				}
			}
		}
	},

	_setOpacity: function (opacity) {
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_initContainer: function () {
		var tilePane = this._map.getPanes().tilePane,
			first = tilePane.firstChild;

		if (!this._container || tilePane.empty) {
			this._container = L.DomUtil.create('div', 'leaflet-layer');

			if (this._insertAtTheBottom && first) {
				tilePane.insertBefore(this._container, first);
			} else {
				tilePane.appendChild(this._container);
			}

			this._setOpacity(this.options.opacity);
		}
	},

	_resetCallback: function (e) {
		this._reset(e.hard);
	},

	_reset: function (clearOldContainer) {
		var key;
		for (key in this._tiles) {
			if (this._tiles.hasOwnProperty(key)) {
				this.fire("tileunload", {tile: this._tiles[key]});
			}
		}
		this._tiles = {};

		if (this.options.reuseTiles) {
			this._unusedTiles = [];
		}

		if (clearOldContainer && this._container) {
			this._container.innerHTML = "";
		}
		this._initContainer();
	},

	_update: function () {
		var bounds = this._map.getPixelBounds(),
			zoom = this._map.getZoom(),
			tileSize = this.options.tileSize;

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		var nwTilePoint = new L.Point(
				Math.floor(bounds.min.x / tileSize),
				Math.floor(bounds.min.y / tileSize)),
			seTilePoint = new L.Point(
				Math.floor(bounds.max.x / tileSize),
				Math.floor(bounds.max.y / tileSize)),
			tileBounds = new L.Bounds(nwTilePoint, seTilePoint);

		this._addTilesFromCenterOut(tileBounds);

		if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
			this._removeOtherTiles(tileBounds);
		}
	},

	_addTilesFromCenterOut: function (bounds) {
		var queue = [],
			center = bounds.getCenter();

		for (var j = bounds.min.y; j <= bounds.max.y; j++) {
			for (var i = bounds.min.x; i <= bounds.max.x; i++) {
				if ((i + ':' + j) in this._tiles) {
					continue;
				}
				queue.push(new L.Point(i, j));
			}
		}

		// load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});

		var fragment = document.createDocumentFragment();

		this._tilesToLoad = queue.length;
		for (var k = 0, len = this._tilesToLoad; k < len; k++) {
			this._addTile(queue[k], fragment);
		}

		this._container.appendChild(fragment);
	},

	_removeOtherTiles: function (bounds) {
		var kArr, x, y, key, tile;

		for (key in this._tiles) {
			if (this._tiles.hasOwnProperty(key)) {
				kArr = key.split(':');
				x = parseInt(kArr[0], 10);
				y = parseInt(kArr[1], 10);

				// remove tile if it's out of bounds
				if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {

					tile = this._tiles[key];
					this.fire("tileunload", {tile: tile, url: tile.src});

					if (tile.parentNode === this._container) {
						this._container.removeChild(tile);
					}
					if (this.options.reuseTiles) {
						this._unusedTiles.push(this._tiles[key]);
					}
					//tile.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

					delete this._tiles[key];
				}
			}
		}
	},

	_addTile: function (tilePoint, container) {
		var tilePos = this._getTilePos(tilePoint),
			zoom = this._map.getZoom(),
			key = tilePoint.x + ':' + tilePoint.y,
			tileLimit = Math.pow(2, this._getOffsetZoom(zoom));

		// wrap tile coordinates
		if (!this.options.continuousWorld) {
			if (!this.options.noWrap) {
				tilePoint.x = ((tilePoint.x % tileLimit) + tileLimit) % tileLimit;
			} else if (tilePoint.x < 0 || tilePoint.x >= tileLimit) {
				this._tilesToLoad--;
				return;
			}

			if (tilePoint.y < 0 || tilePoint.y >= tileLimit) {
				this._tilesToLoad--;
				return;
			}
		}

		// get unused tile - or create a new tile
		var tile = this._getTile();
		L.DomUtil.setPosition(tile, tilePos);

		this._tiles[key] = tile;

		if (this.options.scheme === 'tms') {
			tilePoint.y = tileLimit - tilePoint.y - 1;
		}

		this._loadTile(tile, tilePoint, zoom);

		container.appendChild(tile);
	},

	_getOffsetZoom: function (zoom) {
		zoom = this.options.zoomReverse ? this.options.maxZoom - zoom : zoom;
		return zoom + this.options.zoomOffset;
	},

	_getTilePos: function (tilePoint) {
		var origin = this._map.getPixelOrigin(),
			tileSize = this.options.tileSize;

		return tilePoint.multiplyBy(tileSize).subtract(origin);
	},

	// image-specific code (override to implement e.g. Canvas or SVG tile layer)

	getTileUrl: function (tilePoint, zoom) {
		var subdomains = this.options.subdomains,
			s = this.options.subdomains[(tilePoint.x + tilePoint.y) % subdomains.length];

		return L.Util.template(this._url, L.Util.extend({
			s: s,
			z: this._getOffsetZoom(zoom),
			x: tilePoint.x,
			y: tilePoint.y
		}, this._urlParams));
	},

	_createTileProto: function () {
		this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
		this._tileImg.galleryimg = 'no';

		var tileSize = this.options.tileSize;
		this._tileImg.style.width = tileSize + 'px';
		this._tileImg.style.height = tileSize + 'px';
	},

	_getTile: function () {
		if (this.options.reuseTiles && this._unusedTiles.length > 0) {
			var tile = this._unusedTiles.pop();
			this._resetTile(tile);
			return tile;
		}
		return this._createTile();
	},

	_resetTile: function (tile) {
		// Override if data stored on a tile needs to be cleaned up before reuse
	},

	_createTile: function () {
		var tile = this._tileImg.cloneNode(false);
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},

	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		tile.src = this.getTileUrl(tilePoint, zoom);
	},

	_tileOnLoad: function (e) {
		var layer = this._layer;

		this.className += ' leaflet-tile-loaded';

		layer.fire('tileload', {tile: this, url: this.src});

		layer._tilesToLoad--;
		if (!layer._tilesToLoad) {
			layer.fire('load');
		}
	},

	_tileOnError: function (e) {
		var layer = this._layer;

		layer.fire('tileerror', {tile: this, url: this.src});

		var newUrl = layer.options.errorTileUrl;
		if (newUrl) {
			this.src = newUrl;
		}
	}
});


L.TileLayer.WMS = L.TileLayer.extend({
	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/jpeg',
		transparent: false
	},

	initialize: function (/*String*/ url, /*Object*/ options) {
		this._url = url;

		this.wmsParams = L.Util.extend({}, this.defaultWmsParams);
		this.wmsParams.width = this.wmsParams.height = this.options.tileSize;

		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i)) {
				this.wmsParams[i] = options[i];
			}
		}

		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		var projectionKey = (parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs');
		this.wmsParams[projectionKey] = map.options.crs.code;

		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (/*Point*/ tilePoint, /*Number*/ zoom)/*-> String*/ {
		var tileSize = this.options.tileSize,
			nwPoint = tilePoint.multiplyBy(tileSize),
			sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
			nwMap = this._map.unproject(nwPoint, this._zoom, true),
			seMap = this._map.unproject(sePoint, this._zoom, true),
			nw = this._map.options.crs.project(nwMap),
			se = this._map.options.crs.project(seMap),
			bbox = [nw.x, se.y, se.x, nw.y].join(',');

		return this._url + L.Util.getParamString(this.wmsParams) + "&bbox=" + bbox;
	}
});


L.TileLayer.Canvas = L.TileLayer.extend({
	options: {
		async: false
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	redraw: function () {
		for (var i in this._tiles) {
			var tile = this._tiles[i];
			this._redrawTile(tile);
		}
	},

	_redrawTile: function (tile) {
		this.drawTile(tile, tile._tilePoint, tile._zoom);
	},

	_createTileProto: function () {
		this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile');

		var tileSize = this.options.tileSize;
		this._canvasProto.width = tileSize;
		this._canvasProto.height = tileSize;
	},

	_createTile: function () {
		var tile = this._canvasProto.cloneNode(false);
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},

	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile._tilePoint = tilePoint;
		tile._zoom = zoom;

		this.drawTile(tile, tilePoint, zoom);

		if (!this.options.async) {
			this.tileDrawn(tile);
		}
	},

	drawTile: function (tile, tilePoint, zoom) {
		// override with rendering code
	},

	tileDrawn: function (tile) {
		this._tileOnLoad.call(tile);
	}
});


L.ImageOverlay = L.Class.extend({
	includes: L.Mixin.Events,

	initialize: function (/*String*/ url, /*LatLngBounds*/ bounds) {
		this._url = url;
		this._bounds = bounds;
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._image) {
			this._initImage();
		}

		map.getPanes().overlayPane.appendChild(this._image);

		map.on('viewreset', this._reset, this);
		this._reset();
	},

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._image);
		map.off('viewreset', this._reset, this);
	},

	_initImage: function () {
		this._image = L.DomUtil.create('img', 'leaflet-image-layer');

		this._image.style.visibility = 'hidden';
		//TODO opacity option

		//TODO createImage util method to remove duplication
		L.Util.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.Util.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_reset: function () {
		var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			bottomRight = this._map.latLngToLayerPoint(this._bounds.getSouthEast()),
			size = bottomRight.subtract(topLeft);

		L.DomUtil.setPosition(this._image, topLeft);

		this._image.style.width = size.x + 'px';
		this._image.style.height = size.y + 'px';
	},

	_onImageLoad: function () {
		this._image.style.visibility = '';
		this.fire('load');
	}
});


L.Icon = L.Class.extend({
	iconUrl: L.ROOT_URL + 'images/marker.png',
	shadowUrl: L.ROOT_URL + 'images/marker-shadow.png',

	iconSize: new L.Point(25, 41),
	shadowSize: new L.Point(41, 41),

	iconAnchor: new L.Point(13, 41),
	popupAnchor: new L.Point(0, -33),

	initialize: function (iconUrl) {
		if (iconUrl) {
			this.iconUrl = iconUrl;
		}
	},

	createIcon: function () {
		return this._createIcon('icon');
	},

	createShadow: function () {
		return this._createIcon('shadow');
	},

	_createIcon: function (name) {
		var size = this[name + 'Size'],
			src = this[name + 'Url'];
		if (!src && name === 'shadow') {
			return null;
		}

		var img;
		if (!src) {
			img = this._createDiv();
		}
		else {
			img = this._createImg(src);
		}

		img.className = 'leaflet-marker-' + name;

		img.style.marginLeft = (-this.iconAnchor.x) + 'px';
		img.style.marginTop = (-this.iconAnchor.y) + 'px';

		if (size) {
			img.style.width = size.x + 'px';
			img.style.height = size.y + 'px';
		}

		return img;
	},

	_createImg: function (src) {
		var el;
		if (!L.Browser.ie6) {
			el = document.createElement('img');
			el.src = src;
		} else {
			el = document.createElement('div');
			el.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
		}
		return el;
	},

	_createDiv: function () {
		return document.createElement('div');
	}
});


/*
 * L.Marker is used to display clickable/draggable icons on the map.
 */

L.Marker = L.Class.extend({

	includes: L.Mixin.Events,

	options: {
		icon: new L.Icon(),
		title: '',
		clickable: true,
		draggable: false,
		zIndexOffset: 0
	},

	initialize: function (latlng, options) {
		L.Util.setOptions(this, options);
		this._latlng = latlng;
	},

	onAdd: function (map) {
		this._map = map;

		this._initIcon();

		map.on('viewreset', this._reset, this);
		this._reset();
	},

	onRemove: function (map) {
		this._removeIcon();

		// TODO move to Marker.Popup.js
		if (this.closePopup) {
			this.closePopup();
		}

		this._map = null;

		map.off('viewreset', this._reset, this);
	},

	getLatLng: function () {
		return this._latlng;
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		if (this._icon) {
			this._reset();

			if (this._popup) {
				this._popup.setLatLng(this._latlng);
			}
		}
	},

	setZIndexOffset: function (offset) {
		this.options.zIndexOffset = offset;
		if (this._icon) {
			this._reset();
		}
	},

	setIcon: function (icon) {
		if (this._map) {
			this._removeIcon();
		}

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this._reset();
		}
	},

	_initIcon: function () {
		if (!this._icon) {
			this._icon = this.options.icon.createIcon();

			if (this.options.title) {
				this._icon.title = this.options.title;
			}

			this._initInteraction();
		}
		if (!this._shadow) {
			this._shadow = this.options.icon.createShadow();
		}

		this._map._panes.markerPane.appendChild(this._icon);
		if (this._shadow) {
			this._map._panes.shadowPane.appendChild(this._shadow);
		}
	},

	_removeIcon: function () {
		this._map._panes.markerPane.removeChild(this._icon);
		if (this._shadow) {
			this._map._panes.shadowPane.removeChild(this._shadow);
		}
		this._icon = this._shadow = null;
	},

	_reset: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng).round();

		L.DomUtil.setPosition(this._icon, pos);
		if (this._shadow) {
			L.DomUtil.setPosition(this._shadow, pos);
		}

		this._icon.style.zIndex = pos.y + this.options.zIndexOffset;
	},

	_initInteraction: function () {
		if (this.options.clickable) {
			this._icon.className += ' leaflet-clickable';

			L.DomEvent.addListener(this._icon, 'click', this._onMouseClick, this);

			var events = ['dblclick', 'mousedown', 'mouseover', 'mouseout'];
			for (var i = 0; i < events.length; i++) {
				L.DomEvent.addListener(this._icon, events[i], this._fireMouseEvent, this);
			}
		}

		if (L.Handler.MarkerDrag) {
			this.dragging = new L.Handler.MarkerDrag(this);

			if (this.options.draggable) {
				this.dragging.enable();
			}
		}
	},

	_onMouseClick: function (e) {
		L.DomEvent.stopPropagation(e);
		if (this.dragging && this.dragging.moved()) { return; }
		this.fire(e.type);
	},

	_fireMouseEvent: function (e) {
		this.fire(e.type);
		L.DomEvent.stopPropagation(e);
	}
});



L.Popup = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		autoPan: true,
		closeButton: true,
		offset: new L.Point(0, 2),
		autoPanPadding: new L.Point(5, 5),
		className: ''
	},

	initialize: function (options, source) {
		L.Util.setOptions(this, options);

		this._source = source;
	},

	onAdd: function (map) {
		this._map = map;
		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		this._container.style.opacity = '0';

		this._map._panes.popupPane.appendChild(this._container);
		this._map.on('viewreset', this._updatePosition, this);

		if (this._map.options.closePopupOnClick) {
			this._map.on('preclick', this._close, this);
		}

		this._update();

		this._container.style.opacity = '1'; //TODO fix ugly opacity hack

		this._opened = true;
	},

	onRemove: function (map) {
		map._panes.popupPane.removeChild(this._container);
		L.Util.falseFn(this._container.offsetWidth);

		map.off('viewreset', this._updatePosition, this);
		map.off('click', this._close, this);

		this._container.style.opacity = '0';

		this._opened = false;
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		if (this._opened) {
			this._update();
		}
		return this;
	},

	setContent: function (content) {
		this._content = content;
		if (this._opened) {
			this._update();
		}
		return this;
	},

	_close: function () {
		if (this._opened) {
			this._map.closePopup();
		}
	},

	_initLayout: function () {
		this._container = L.DomUtil.create('div', 'leaflet-popup ' + this.options.className);

		if (this.options.closeButton) {
			this._closeButton = L.DomUtil.create('a', 'leaflet-popup-close-button', this._container);
			this._closeButton.href = '#close';
			L.DomEvent.addListener(this._closeButton, 'click', this._onCloseButtonClick, this);
		}

		this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', this._container);
		L.DomEvent.disableClickPropagation(this._wrapper);
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', this._wrapper);

		this._tipContainer = L.DomUtil.create('div', 'leaflet-popup-tip-container', this._container);
		this._tip = L.DomUtil.create('div', 'leaflet-popup-tip', this._tipContainer);
	},

	_update: function () {
		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	_updateContent: function () {
		if (!this._content) {
			return;
		}

		if (typeof this._content === 'string') {
			this._contentNode.innerHTML = this._content;
		} else {
			this._contentNode.innerHTML = '';
			this._contentNode.appendChild(this._content);
		}
	},

	_updateLayout: function () {
		this._container.style.width = '';
		this._container.style.whiteSpace = 'nowrap';

		var width = this._container.offsetWidth;

		this._container.style.width = (width > this.options.maxWidth ?
				this.options.maxWidth : (width < this.options.minWidth ? this.options.minWidth : width)) + 'px';
		this._container.style.whiteSpace = '';

		this._containerWidth = this._container.offsetWidth;
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._containerBottom = -pos.y - this.options.offset.y;
		this._containerLeft = pos.x - Math.round(this._containerWidth / 2) + this.options.offset.x;

		this._container.style.bottom = this._containerBottom + 'px';
		this._container.style.left = this._containerLeft + 'px';
	},

	_adjustPan: function () {
		if (!this.options.autoPan) {
			return;
		}

		var containerHeight = this._container.offsetHeight,
			layerPos = new L.Point(
				this._containerLeft,
				-containerHeight - this._containerBottom),
			containerPos = this._map.layerPointToContainerPoint(layerPos),
			adjustOffset = new L.Point(0, 0),
			padding = this.options.autoPanPadding,
			size = this._map.getSize();

		if (containerPos.x < 0) {
			adjustOffset.x = containerPos.x - padding.x;
		}
		if (containerPos.x + this._containerWidth > size.x) {
			adjustOffset.x = containerPos.x + this._containerWidth - size.x + padding.x;
		}
		if (containerPos.y < 0) {
			adjustOffset.y = containerPos.y - padding.y;
		}
		if (containerPos.y + containerHeight > size.y) {
			adjustOffset.y = containerPos.y + containerHeight - size.y + padding.y;
		}

		if (adjustOffset.x || adjustOffset.y) {
			this._map.panBy(adjustOffset);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		L.DomEvent.stop(e);
	}
});


/*
 * Popup extension to L.Marker, adding openPopup & bindPopup methods.
 */

L.Marker.include({
	openPopup: function () {
		this._popup.setLatLng(this._latlng);
		if (this._map) {
			this._map.openPopup(this._popup);
		}

		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	bindPopup: function (content, options) {
		options = L.Util.extend({offset: this.options.icon.popupAnchor}, options);

		if (!this._popup) {
			this.on('click', this.openPopup, this);
		}

		this._popup = new L.Popup(options, this);
		this._popup.setContent(content);

		return this;
	},

	unbindPopup: function () {
		if (this._popup) {
			this._popup = null;
			this.off('click', this.openPopup);
		}
		return this;
	}
});



L.Map.include({
	openPopup: function (popup) {
		this.closePopup();
		this._popup = popup;
		this.addLayer(popup);
		this.fire('popupopen', { popup: this._popup });
	
		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this.removeLayer(this._popup);
			this.fire('popupclose', { popup: this._popup });
			this._popup = null;
		}
		return this;
	}
});


/*
 * L.LayerGroup is a class to combine several layers so you can manipulate the group (e.g. add/remove it) as one layer.
 */

L.LayerGroup = L.Class.extend({
	initialize: function (layers) {
		this._layers = {};

		if (layers) {
			for (var i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	addLayer: function (layer) {
		var id = L.Util.stamp(layer);
		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}
		return this;
	},

	removeLayer: function (layer) {
		var id = L.Util.stamp(layer);
		delete this._layers[id];

		if (this._map) {
			this._map.removeLayer(layer);
		}
		return this;
	},

	clearLayers: function () {
		this._iterateLayers(this.removeLayer, this);
		return this;
	},

	invoke: function (methodName) {
		var args = Array.prototype.slice.call(arguments, 1),
			i, layer;

		for (i in this._layers) {
			if (this._layers.hasOwnProperty(i)) {
				layer = this._layers[i];

				if (layer[methodName]) {
					layer[methodName].apply(layer, args);
				}
			}
		}
		return this;
	},

	onAdd: function (map) {
		this._map = map;
		this._iterateLayers(map.addLayer, map);
	},

	onRemove: function (map) {
		this._iterateLayers(map.removeLayer, map);
		delete this._map;
	},

	_iterateLayers: function (method, context) {
		for (var i in this._layers) {
			if (this._layers.hasOwnProperty(i)) {
				method.call(context, this._layers[i]);
			}
		}
	}
});


/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and bindPopup method shared between a group of layers.
 */

L.FeatureGroup = L.LayerGroup.extend({
	includes: L.Mixin.Events,

	addLayer: function (layer) {
		this._initEvents(layer);
		L.LayerGroup.prototype.addLayer.call(this, layer);

		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent);
		}
	},

	bindPopup: function (content) {
		this._popupContent = content;

		return this.invoke('bindPopup', content);
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	_events: ['click', 'dblclick', 'mouseover', 'mouseout'],

	_initEvents: function (layer) {
		for (var i = 0, len = this._events.length; i < len; i++) {
			layer.on(this._events[i], this._propagateEvent, this);
		}
	},

	_propagateEvent: function (e) {
		e.layer = e.target;
		e.target = this;
		this.fire(e.type, e);
	}
});


/*
 * L.Path is a base class for rendering vector paths on a map. It's inherited by Polyline, Circle, etc.
 */

L.Path = L.Class.extend({
	includes: [L.Mixin.Events],

	statics: {
		// how much to extend the clip area around the map view
		// (relative to its size, e.g. 0.5 is half the screen in each direction)
		CLIP_PADDING: 0.5
	},

	options: {
		stroke: true,
		color: '#0033ff',
		weight: 5,
		opacity: 0.5,

		fill: false,
		fillColor: null, //same as color by default
		fillOpacity: 0.2,

		clickable: true,

		// TODO remove this, as all paths now update on moveend
		updateOnMoveEnd: true
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		this._initElements();
		this._initEvents();
		this.projectLatlngs();
		this._updatePath();

		map.on('viewreset', this.projectLatlngs, this);

		this._updateTrigger = this.options.updateOnMoveEnd ? 'moveend' : 'viewreset';
		map.on(this._updateTrigger, this._updatePath, this);
	},

	onRemove: function (map) {
		this._map = null;

		map._pathRoot.removeChild(this._container);

		map.off('viewreset', this.projectLatlngs, this);
		map.off(this._updateTrigger, this._updatePath, this);
	},

	projectLatlngs: function () {
		// do all projection stuff here
	},

	setStyle: function (style) {
		L.Util.setOptions(this, style);
		if (this._container) {
			this._updateStyle();
		}
		return this;
	},

	_redraw: function () {
		if (this._map) {
			this.projectLatlngs();
			this._updatePath();
		}
	}
});

L.Map.include({
	_updatePathViewport: function () {
		var p = L.Path.CLIP_PADDING,
			size = this.getSize(),
			//TODO this._map._getMapPanePos()
			panePos = L.DomUtil.getPosition(this._mapPane),
			min = panePos.multiplyBy(-1).subtract(size.multiplyBy(p)),
			max = min.add(size.multiplyBy(1 + p * 2));

		this._pathViewport = new L.Bounds(min, max);
	}
});


L.Path.SVG_NS = 'http://www.w3.org/2000/svg';

L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);

L.Path = L.Path.extend({
	statics: {
		SVG: L.Browser.svg,
		_createElement: function (name) {
			return document.createElementNS(L.Path.SVG_NS, name);
		}
	},

	getPathString: function () {
		// form path string here
	},

	_initElements: function () {
		this._map._initPathRoot();
		this._initPath();
		this._initStyle();
	},

	_initPath: function () {
		this._container = L.Path._createElement('g');

		this._path = L.Path._createElement('path');
		this._container.appendChild(this._path);

		this._map._pathRoot.appendChild(this._container);
	},

	_initStyle: function () {
		if (this.options.stroke) {
			this._path.setAttribute('stroke-linejoin', 'round');
			this._path.setAttribute('stroke-linecap', 'round');
		}
		if (this.options.fill) {
			this._path.setAttribute('fill-rule', 'evenodd');
		} else {
			this._path.setAttribute('fill', 'none');
		}
		this._updateStyle();
	},

	_updateStyle: function () {
		if (this.options.stroke) {
			this._path.setAttribute('stroke', this.options.color);
			this._path.setAttribute('stroke-opacity', this.options.opacity);
			this._path.setAttribute('stroke-width', this.options.weight);
		}
		if (this.options.fill) {
			this._path.setAttribute('fill', this.options.fillColor || this.options.color);
			this._path.setAttribute('fill-opacity', this.options.fillOpacity);
		}
	},

	_updatePath: function () {
		var str = this.getPathString();
		if (!str) {
			// fix webkit empty string parsing bug
			str = 'M0 0';
		}
		this._path.setAttribute('d', str);
	},

	// TODO remove duplication with L.Map
	_initEvents: function () {
		if (this.options.clickable) {
			if (!L.Browser.vml) {
				this._path.setAttribute('class', 'leaflet-clickable');
			}

			L.DomEvent.addListener(this._container, 'click', this._onMouseClick, this);

			var events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'mousemove'];
			for (var i = 0; i < events.length; i++) {
				L.DomEvent.addListener(this._container, events[i], this._fireMouseEvent, this);
			}
		}
	},

	_onMouseClick: function (e) {
		if (this._map.dragging && this._map.dragging.moved()) {
			return;
		}
		this._fireMouseEvent(e);
	},

	_fireMouseEvent: function (e) {
		if (!this.hasEventListeners(e.type)) {
			return;
		}
		this.fire(e.type, {
			latlng: this._map.mouseEventToLatLng(e),
			layerPoint: this._map.mouseEventToLayerPoint(e)
		});
		L.DomEvent.stopPropagation(e);
	}
});

L.Map.include({
	_initPathRoot: function () {
		if (!this._pathRoot) {
			this._pathRoot = L.Path._createElement('svg');
			this._panes.overlayPane.appendChild(this._pathRoot);

			this.on('moveend', this._updateSvgViewport);
			this._updateSvgViewport();
		}
	},

	_updateSvgViewport: function () {
		this._updatePathViewport();

		var vp = this._pathViewport,
			min = vp.min,
			max = vp.max,
			width = max.x - min.x,
			height = max.y - min.y,
			root = this._pathRoot,
			pane = this._panes.overlayPane;

		// Hack to make flicker on drag end on mobile webkit less irritating
		// Unfortunately I haven't found a good workaround for this yet
		if (L.Browser.webkit) {
			pane.removeChild(root);
		}

		L.DomUtil.setPosition(root, min);
		root.setAttribute('width', width);
		root.setAttribute('height', height);
		root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));

		if (L.Browser.webkit) {
			pane.appendChild(root);
		}
	}
});


/*
 * Popup extension to L.Path (polylines, polygons, circles), adding bindPopup method.
 */

L.Path.include({
	bindPopup: function (content, options) {
		if (!this._popup || this._popup.options !== options) {
			this._popup = new L.Popup(options, this);
		}
		this._popup.setContent(content);

		if (!this._openPopupAdded) {
			this.on('click', this._openPopup, this);
			this._openPopupAdded = true;
		}

		return this;
	},

	_openPopup: function (e) {
		this._popup.setLatLng(e.latlng);
		this._map.openPopup(this._popup);
	}
});


/*
 * Vector rendering for IE6-8 through VML.
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */

L.Browser.vml = (function () {
	var d = document.createElement('div'), s;
	d.innerHTML = '<v:shape adj="1"/>';
	s = d.firstChild;
	s.style.behavior = 'url(#default#VML)';

	return (s && (typeof s.adj === 'object'));
}());

L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
	statics: {
		VML: true,
		CLIP_PADDING: 0.02,
		_createElement: (function () {
			try {
				document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
				return function (name) {
					return document.createElement('<lvml:' + name + ' class="lvml">');
				};
			} catch (e) {
				return function (name) {
					return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
				};
			}
		}())
	},

	_initPath: function () {
		this._container = L.Path._createElement('shape');
		this._container.className += ' leaflet-vml-shape' +
				(this.options.clickable ? ' leaflet-clickable' : '');
		this._container.coordsize = '1 1';

		this._path = L.Path._createElement('path');
		this._container.appendChild(this._path);

		this._map._pathRoot.appendChild(this._container);
	},

	_initStyle: function () {
		if (this.options.stroke) {
			this._stroke = L.Path._createElement('stroke');
			this._stroke.endcap = 'round';
			this._container.appendChild(this._stroke);
		} else {
			this._container.stroked = false;
		}
		if (this.options.fill) {
			this._container.filled = true;
			this._fill = L.Path._createElement('fill');
			this._container.appendChild(this._fill);
		} else {
			this._container.filled = false;
		}
		this._updateStyle();
	},

	_updateStyle: function () {
		if (this.options.stroke) {
			this._stroke.weight = this.options.weight + 'px';
			this._stroke.color = this.options.color;
			this._stroke.opacity = this.options.opacity;
		}
		if (this.options.fill) {
			this._fill.color = this.options.fillColor || this.options.color;
			this._fill.opacity = this.options.fillOpacity;
		}
	},

	_updatePath: function () {
		this._container.style.display = 'none';
		this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
		this._container.style.display = '';
	}
});

L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
	_initPathRoot: function () {
		if (!this._pathRoot) {
			this._pathRoot = document.createElement('div');
			this._pathRoot.className = 'leaflet-vml-container';
			this._panes.overlayPane.appendChild(this._pathRoot);

			this.on('moveend', this._updatePathViewport);
			this._updatePathViewport();
		}
	}
});


/*
 * Vector rendering for all browsers that support canvas.
 */

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.Path = (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? L.Path : L.Path.extend({
	statics: {
		//CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
		CANVAS: true,
		SVG: false
	},

	options: {
		updateOnMoveEnd: true
	},

	_initElements: function () {
		this._map._initPathRoot();
		this._ctx = this._map._canvasCtx;
	},

	_updateStyle: function () {
		if (this.options.stroke) {
			this._ctx.lineWidth = this.options.weight;
			this._ctx.strokeStyle = this.options.color;
		}
		if (this.options.fill) {
			this._ctx.fillStyle = this.options.fillColor || this.options.color;
		}
	},

	_drawPath: function () {
		var i, j, len, len2, point, drawMethod;

		this._ctx.beginPath();

		for (i = 0, len = this._parts.length; i < len; i++) {
			for (j = 0, len2 = this._parts[i].length; j < len2; j++) {
				point = this._parts[i][j];
				drawMethod = (j === 0 ? 'move' : 'line') + 'To';

				this._ctx[drawMethod](point.x, point.y);
			}
			// TODO refactor ugly hack
			if (this instanceof L.Polygon) {
				this._ctx.closePath();
			}
		}
	},

	_checkIfEmpty: function () {
		return !this._parts.length;
	},

	_updatePath: function () {
		if (this._checkIfEmpty()) {
			return;
		}

		this._drawPath();

		this._ctx.save();

		this._updateStyle();

		var opacity = this.options.opacity,
			fillOpacity = this.options.fillOpacity;

		if (this.options.fill) {
			if (fillOpacity < 1) {
				this._ctx.globalAlpha = fillOpacity;
			}
			this._ctx.fill();
		}

		if (this.options.stroke) {
			if (opacity < 1) {
				this._ctx.globalAlpha = opacity;
			}
			this._ctx.stroke();
		}

		this._ctx.restore();

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_initEvents: function () {
		if (this.options.clickable) {
			// TODO hand cursor
			// TODO mouseover, mouseout, dblclick
			this._map.on('click', this._onClick, this);
		}
	},

	_onClick: function (e) {
		if (this._containsPoint(e.layerPoint)) {
			this.fire('click', e);
		}
	},

    onRemove: function (map) {
        map.off('viewreset', this._projectLatlngs, this);
        map.off(this._updateTrigger, this._updatePath, this);
        map.fire(this._updateTrigger);
    }
});

L.Map.include((L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? {} : {
	_initPathRoot: function () {
		var root = this._pathRoot,
			ctx;

		if (!root) {
			root = this._pathRoot = document.createElement("canvas");
			root.style.position = 'absolute';
			ctx = this._canvasCtx = root.getContext('2d');

			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			this._panes.overlayPane.appendChild(root);

			this.on('moveend', this._updateCanvasViewport);
			this._updateCanvasViewport();
		}
	},

	_updateCanvasViewport: function () {
		this._updatePathViewport();

		var vp = this._pathViewport,
			min = vp.min,
			size = vp.max.subtract(min),
			root = this._pathRoot;

		//TODO check if it's works properly on mobile webkit
		L.DomUtil.setPosition(root, min);
		root.width = size.x;
		root.height = size.y;
		root.getContext('2d').translate(-min.x, -min.y);
	}
});


/*
 * L.LineUtil contains different utility functions for line segments
 * and polylines (clipping, simplification, distances, etc.)
 */

L.LineUtil = {

	// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	// Improves rendering performance dramatically by lessening the number of points to draw.

	simplify: function (/*Point[]*/ points, /*Number*/ tolerance) {
		if (!tolerance || !points.length) {
			return points.slice();
		}

		var sqTolerance = tolerance * tolerance;

		// stage 1: vertex reduction
		points = this._reducePoints(points, sqTolerance);

		// stage 2: Douglas-Peucker simplification
		points = this._simplifyDP(points, sqTolerance);

		return points;
	},

	// distance from a point to a segment between two points
	pointToSegmentDistance:  function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
	},

	closestPointOnSegment: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return this._sqClosestPointOnSegment(p, p1, p2);
	},

	// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	_simplifyDP: function (points, sqTolerance) {

		var len = points.length,
			ArrayConstructor = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
			markers = new ArrayConstructor(len);

		markers[0] = markers[len - 1] = 1;

		this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

		var i,
			newPoints = [];

		for (i = 0; i < len; i++) {
			if (markers[i]) {
				newPoints.push(points[i]);
			}
		}

		return newPoints;
	},

	_simplifyDPStep: function (points, markers, sqTolerance, first, last) {

		var maxSqDist = 0,
			index, i, sqDist;

		for (i = first + 1; i <= last - 1; i++) {
			sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

			if (sqDist > maxSqDist) {
				index = i;
				maxSqDist = sqDist;
			}
		}

		if (maxSqDist > sqTolerance) {
			markers[index] = 1;

			this._simplifyDPStep(points, markers, sqTolerance, first, index);
			this._simplifyDPStep(points, markers, sqTolerance, index, last);
		}
	},

	// reduce points that are too close to each other to a single point
	_reducePoints: function (points, sqTolerance) {
		var reducedPoints = [points[0]];

		for (var i = 1, prev = 0, len = points.length; i < len; i++) {
			if (this._sqDist(points[i], points[prev]) > sqTolerance) {
				reducedPoints.push(points[i]);
				prev = i;
			}
		}
		if (prev < len - 1) {
			reducedPoints.push(points[len - 1]);
		}
		return reducedPoints;
	},

	/*jshint bitwise:false */ // temporarily allow bitwise oprations

	// Cohen-Sutherland line clipping algorithm.
	// Used to avoid rendering parts of a polyline that are not currently visible.

	clipSegment: function (a, b, bounds, useLastCode) {
		var min = bounds.min,
			max = bounds.max;

		var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			codeB = this._getBitCode(b, bounds);

		// save 2nd code to avoid calculating it on the next segment
		this._lastCode = codeB;

		while (true) {
			// if a,b is inside the clip window (trivial accept)
			if (!(codeA | codeB)) {
				return [a, b];
			// if a,b is outside the clip window (trivial reject)
			} else if (codeA & codeB) {
				return false;
			// other cases
			} else {
				var codeOut = codeA || codeB,
					p = this._getEdgeIntersection(a, b, codeOut, bounds),
					newCode = this._getBitCode(p, bounds);

				if (codeOut === codeA) {
					a = p;
					codeA = newCode;
				} else {
					b = p;
					codeB = newCode;
				}
			}
		}
	},

	_getEdgeIntersection: function (a, b, code, bounds) {
		var dx = b.x - a.x,
			dy = b.y - a.y,
			min = bounds.min,
			max = bounds.max;

		if (code & 8) { // top
			return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
		} else if (code & 4) { // bottom
			return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
		} else if (code & 2) { // right
			return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
		} else if (code & 1) { // left
			return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
		}
	},

	_getBitCode: function (/*Point*/ p, bounds) {
		var code = 0;

		if (p.x < bounds.min.x) { // left
			code |= 1;
		} else if (p.x > bounds.max.x) { // right
			code |= 2;
		}
		if (p.y < bounds.min.y) { // bottom
			code |= 4;
		} else if (p.y > bounds.max.y) { // top
			code |= 8;
		}

		return code;
	},

	/*jshint bitwise:true */

	// square distance (to avoid unnecessary Math.sqrt calls)
	_sqDist: function (p1, p2) {
		var dx = p2.x - p1.x,
			dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	},

	// return closest point on segment or distance to that point
	_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
		var x = p1.x,
			y = p1.y,
			dx = p2.x - x,
			dy = p2.y - y,
			dot = dx * dx + dy * dy,
			t;

		if (dot > 0) {
			t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

			if (t > 1) {
				x = p2.x;
				y = p2.y;
			} else if (t > 0) {
				x += dx * t;
				y += dy * t;
			}
		}

		dx = p.x - x;
		dy = p.y - y;

		return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
	}
};



L.Polyline = L.Path.extend({
	initialize: function (latlngs, options) {
		L.Path.prototype.initialize.call(this, options);
		this._latlngs = latlngs;
	},

	options: {
		// how much to simplify the polyline on each zoom level
		// more = better performance and smoother look, less = more accurate
		smoothFactor: 1.0,
		noClip: false,

		updateOnMoveEnd: true
	},

	projectLatlngs: function () {
		this._originalPoints = [];

		for (var i = 0, len = this._latlngs.length; i < len; i++) {
			this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
		}
	},

	getPathString: function () {
		for (var i = 0, len = this._parts.length, str = ''; i < len; i++) {
			str += this._getPathPartStr(this._parts[i]);
		}
		return str;
	},

	getLatLngs: function () {
		return this._latlngs;
	},

	setLatLngs: function (latlngs) {
		this._latlngs = latlngs;
		this._redraw();
		return this;
	},

	addLatLng: function (latlng) {
		this._latlngs.push(latlng);
		this._redraw();
		return this;
	},

	spliceLatLngs: function (index, howMany) {
		var removed = [].splice.apply(this._latlngs, arguments);
		this._redraw();
		return removed;
	},

	closestLayerPoint: function (p) {
		var minDistance = Infinity, parts = this._parts, p1, p2, minPoint = null;

		for (var j = 0, jLen = parts.length; j < jLen; j++) {
			var points = parts[j];
			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];
				var point = L.LineUtil._sqClosestPointOnSegment(p, p1, p2);
				if (point._sqDist < minDistance) {
					minDistance = point._sqDist;
					minPoint = point;
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	getBounds: function () {
		var b = new L.LatLngBounds();
		var latLngs = this.getLatLngs();
		for (var i = 0, len = latLngs.length; i < len; i++) {
			b.extend(latLngs[i]);
		}
		return b;
	},

	_getPathPartStr: function (points) {
		var round = L.Path.VML;

		for (var j = 0, len2 = points.length, str = '', p; j < len2; j++) {
			p = points[j];
			if (round) {
				p._round();
			}
			str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
		}
		return str;
	},

	_clipPoints: function () {
		var points = this._originalPoints,
			len = points.length,
			i, k, segment;

		if (this.options.noClip) {
			this._parts = [points];
			return;
		}

		this._parts = [];

		var parts = this._parts,
			vp = this._map._pathViewport,
			lu = L.LineUtil;

		for (i = 0, k = 0; i < len - 1; i++) {
			segment = lu.clipSegment(points[i], points[i + 1], vp, i);
			if (!segment) {
				continue;
			}

			parts[k] = parts[k] || [];
			parts[k].push(segment[0]);

			// if segment goes out of screen, or it's the last one, it's the end of the line part
			if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
				parts[k].push(segment[1]);
				k++;
			}
		}
	},

	// simplify each clipped part of the polyline
	_simplifyPoints: function () {
		var parts = this._parts,
			lu = L.LineUtil;

		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
		}
	},

	_updatePath: function () {
		this._clipPoints();
		this._simplifyPoints();

		L.Path.prototype._updatePath.call(this);
	}
});


/*
 * L.PolyUtil contains utilify functions for polygons (clipping, etc.).
 */

/*jshint bitwise:false */ // allow bitwise oprations here

L.PolyUtil = {};

/*
 * Sutherland-Hodgeman polygon clipping algorithm.
 * Used to avoid rendering parts of a polygon that are not currently visible.
 */
L.PolyUtil.clipPolygon = function (points, bounds) {
	var min = bounds.min,
		max = bounds.max,
		clippedPoints,
		edges = [1, 4, 2, 8],
		i, j, k,
		a, b,
		len, edge, p,
		lu = L.LineUtil;

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = lu._getBitCode(points[i], bounds);
	}

	// for each edge (left, bottom, right, top)
	for (k = 0; k < 4; k++) {
		edge = edges[k];
		clippedPoints = [];

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			a = points[i];
			b = points[j];

			// if a is inside the clip window
			if (!(a._code & edge)) {
				// if b is outside the clip window (a->b goes out of screen)
				if (b._code & edge) {
					p = lu._getEdgeIntersection(b, a, edge, bounds);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = lu._getEdgeIntersection(b, a, edge, bounds);
				p._code = lu._getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
};

/*jshint bitwise:true */


/*
 * L.Polygon is used to display polygons on a map.
 */

L.Polygon = L.Polyline.extend({
	options: {
		fill: true
	},

	initialize: function (latlngs, options) {
		L.Polyline.prototype.initialize.call(this, latlngs, options);

		if (latlngs && (latlngs[0] instanceof Array)) {
			this._latlngs = latlngs[0];
			this._holes = latlngs.slice(1);
		}
	},

	projectLatlngs: function () {
		L.Polyline.prototype.projectLatlngs.call(this);

		// project polygon holes points
		// TODO move this logic to Polyline to get rid of duplication
		this._holePoints = [];

		if (!this._holes) {
			return;
		}

		for (var i = 0, len = this._holes.length, hole; i < len; i++) {
			this._holePoints[i] = [];

			for (var j = 0, len2 = this._holes[i].length; j < len2; j++) {
				this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);
			}
		}
	},

	_clipPoints: function () {
		var points = this._originalPoints,
			newParts = [];

		this._parts = [points].concat(this._holePoints);

		if (this.options.noClip) {
			return;
		}

		for (var i = 0, len = this._parts.length; i < len; i++) {
			var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
			if (!clipped.length) {
				continue;
			}
			newParts.push(clipped);
		}

		this._parts = newParts;
	},

	_getPathPartStr: function (points) {
		var str = L.Polyline.prototype._getPathPartStr.call(this, points);
		return str + (L.Browser.svg ? 'z' : 'x');
	}
});


/*
 * Contains L.MultiPolyline and L.MultiPolygon layers.
 */

(function () {
	function createMulti(Klass) {
		return L.FeatureGroup.extend({
			initialize: function (latlngs, options) {
				this._layers = {};
				this._options = options;
				this.setLatLngs(latlngs);
			},

			setLatLngs: function (latlngs) {
				var i = 0, len = latlngs.length;

				this._iterateLayers(function (layer) {
					if (i < len) {
						layer.setLatLngs(latlngs[i++]);
					} else {
						this.removeLayer(layer);
					}
				}, this);

				while (i < len) {
					this.addLayer(new Klass(latlngs[i++], this._options));
				}
			}
		});
	}

	L.MultiPolyline = createMulti(L.Polyline);
	L.MultiPolygon = createMulti(L.Polygon);
}());


/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 */

L.Circle = L.Path.extend({
	initialize: function (latlng, radius, options) {
		L.Path.prototype.initialize.call(this, options);

		this._latlng = latlng;
		this._mRadius = radius;
	},

	options: {
		fill: true
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		this._redraw();
		return this;
	},

	setRadius: function (radius) {
		this._mRadius = radius;
		this._redraw();
		return this;
	},

	projectLatlngs: function () {
		var equatorLength = 40075017,
			hLength = equatorLength * Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);

		var lngSpan = (this._mRadius / hLength) * 360,
			latlng2 = new L.LatLng(this._latlng.lat, this._latlng.lng - lngSpan, true),
			point2 = this._map.latLngToLayerPoint(latlng2);

		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._radius = Math.round(this._point.x - point2.x);
	},

	getPathString: function () {
		var p = this._point,
			r = this._radius;

		if (this._checkIfEmpty()) {
			return '';
		}

		if (L.Browser.svg) {
			return "M" + p.x + "," + (p.y - r) +
					"A" + r + "," + r + ",0,1,1," +
					(p.x - 0.1) + "," + (p.y - r) + " z";
		} else {
			p._round();
			r = Math.round(r);
			return "AL " + p.x + "," + p.y + " " + r + "," + r + " 0," + (65535 * 360);
		}
	},

	_checkIfEmpty: function () {
		var vp = this._map._pathViewport,
			r = this._radius,
			p = this._point;

		return p.x - r > vp.max.x || p.y - r > vp.max.y ||
			p.x + r < vp.min.x || p.y + r < vp.min.y;
	}
});


/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

L.CircleMarker = L.Circle.extend({
	options: {
		radius: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Circle.prototype.initialize.call(this, latlng, null, options);
		this._radius = this.options.radius;
	},

	projectLatlngs: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},

	setRadius: function (radius) {
		this._radius = radius;
		this._redraw();
		return this;
	}
});



L.Polyline.include(!L.Path.CANVAS ? {} : {
	_containsPoint: function (p, closed) {
		var i, j, k, len, len2, dist, part,
			w = this.options.weight / 2;

		if (L.Browser.touch) {
			w += 10; // polyline click tolerance on touch devices
		}

		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];
			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) {
					continue;
				}

				dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);

				if (dist <= w) {
					return true;
				}
			}
		}
		return false;
	}
});



L.Polygon.include(!L.Path.CANVAS ? {} : {
	_containsPoint: function (p) {
		var inside = false,
			part, p1, p2,
			i, j, k,
			len, len2;

		// TODO optimization: check if within bounds first

		if (L.Polyline.prototype._containsPoint.call(this, p, true)) {
			// click on polygon border
			return true;
		}

		// ray casting algorithm for detecting if point is in polygon

		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) &&
						(p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		return inside;
	}
});


/*
 * Circle canvas specific drawing parts.
 */

L.Circle.include(!L.Path.CANVAS ? {} : {
	_drawPath: function () {
		var p = this._point;
		this._ctx.beginPath();
		this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2);
	},

	_containsPoint: function (p) {
		var center = this._point,
			w2 = this.options.stroke ? this.options.weight / 2 : 0;

		return (p.distanceTo(center) <= this._radius + w2);
	}
});



L.GeoJSON = L.FeatureGroup.extend({
	initialize: function (geojson, options) {
		L.Util.setOptions(this, options);
		this._geojson = geojson;
		this._layers = {};

		if (geojson) {
			this.addGeoJSON(geojson);
		}
	},

	addGeoJSON: function (geojson) {
		if (geojson.features) {
			for (var i = 0, len = geojson.features.length; i < len; i++) {
				this.addGeoJSON(geojson.features[i]);
			}
			return;
		}

		var isFeature = (geojson.type === 'Feature'),
			geometry = (isFeature ? geojson.geometry : geojson),
			layer = L.GeoJSON.geometryToLayer(geometry, this.options.pointToLayer);

		this.fire('featureparse', {
			layer: layer,
			properties: geojson.properties,
			geometryType: geometry.type,
			bbox: geojson.bbox,
			id: geojson.id
		});

		this.addLayer(layer);
	}
});

L.Util.extend(L.GeoJSON, {
	geometryToLayer: function (geometry, pointToLayer) {
		var coords = geometry.coordinates,
			latlng, latlngs,
			i, len,
			layer,
			layers = [];

		switch (geometry.type) {
		case 'Point':
			latlng = this.coordsToLatLng(coords);
			return pointToLayer ? pointToLayer(latlng) : new L.Marker(latlng);

		case 'MultiPoint':
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = this.coordsToLatLng(coords[i]);
				layer = pointToLayer ? pointToLayer(latlng) : new L.Marker(latlng);
				layers.push(layer);
			}
			return new L.FeatureGroup(layers);

		case 'LineString':
			latlngs = this.coordsToLatLngs(coords);
			return new L.Polyline(latlngs);

		case 'Polygon':
			latlngs = this.coordsToLatLngs(coords, 1);
			return new L.Polygon(latlngs);

		case 'MultiLineString':
			latlngs = this.coordsToLatLngs(coords, 1);
			return new L.MultiPolyline(latlngs);

		case "MultiPolygon":
			latlngs = this.coordsToLatLngs(coords, 2);
			return new L.MultiPolygon(latlngs);

		case "GeometryCollection":
			for (i = 0, len = geometry.geometries.length; i < len; i++) {
				layer = this.geometryToLayer(geometry.geometries[i], pointToLayer);
				layers.push(layer);
			}
			return new L.FeatureGroup(layers);

		default:
			throw new Error('Invalid GeoJSON object.');
		}
	},

	coordsToLatLng: function (/*Array*/ coords, /*Boolean*/ reverse)/*: LatLng*/ {
		var lat = parseFloat(coords[reverse ? 0 : 1]),
			lng = parseFloat(coords[reverse ? 1 : 0]);
		return new L.LatLng(lat, lng, true);
	},

	coordsToLatLngs: function (/*Array*/ coords, /*Number*/ levelsDeep, /*Boolean*/ reverse)/*: Array*/ {
		var latlng, latlngs = [],
			i, len = coords.length;

		for (i = 0; i < len; i++) {
			latlng = levelsDeep ?
					this.coordsToLatLngs(coords[i], levelsDeep - 1, reverse) :
					this.coordsToLatLng(coords[i], reverse);
			latlngs.push(latlng);
		}
		return latlngs;
	}
});


/*
 * L.DomEvent contains functions for working with DOM events.
 */

L.DomEvent = {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = L.Util.stamp(fn),
			key = '_leaflet_' + type + id;

		if (obj[key]) {
			return;
		}

		var handler = function (e) {
			return fn.call(context || obj, e || L.DomEvent._getEvent());
		};

		if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		} else if ('addEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				var originalHandler = handler,
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
				handler = function (e) {
					if (!L.DomEvent._checkMouse(obj, e)) {
						return;
					}
					return originalHandler(e);
				};
				obj.addEventListener(newType, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}
		} else if ('attachEvent' in obj) {
			obj.attachEvent("on" + type, handler);
		}

		obj[key] = handler;
	},

	removeListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = L.Util.stamp(fn),
			key = '_leaflet_' + type + id,
			handler = obj[key];

		if (!handler) {
			return;
		}

		if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else if ('removeEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null;
	},

	_checkMouse: function (el, e) {
		var related = e.relatedTarget;

		if (!related) {
			return true;
		}

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}

		return (related !== el);
	},

	/*jshint noarg:false */ // evil magic for IE
	_getEvent: function () {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},
	/*jshint noarg:false */

	stopPropagation: function (/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},

	disableClickPropagation: function (/*HTMLElement*/ el) {
		L.DomEvent.addListener(el, L.Draggable.START, L.DomEvent.stopPropagation);
		L.DomEvent.addListener(el, 'click', L.DomEvent.stopPropagation);
		L.DomEvent.addListener(el, 'dblclick', L.DomEvent.stopPropagation);
	},

	preventDefault: function (/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},

	stop: function (e) {
		L.DomEvent.preventDefault(e);
		L.DomEvent.stopPropagation(e);
	},

	getMousePosition: function (e, container) {
		var x = e.pageX ? e.pageX : e.clientX +
				document.body.scrollLeft + document.documentElement.scrollLeft,
			y = e.pageY ? e.pageY : e.clientY +
					document.body.scrollTop + document.documentElement.scrollTop,
			pos = new L.Point(x, y);
		return (container ?
					pos.subtract(L.DomUtil.getViewportOffset(container)) : pos);
	},

	getWheelDelta: function (e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	}
};



/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		START: L.Browser.touch ? 'touchstart' : 'mousedown',
		END: L.Browser.touch ? 'touchend' : 'mouseup',
		MOVE: L.Browser.touch ? 'touchmove' : 'mousemove',
		TAP_TOLERANCE: 15
	},

	initialize: function (element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},

	enable: function () {
		if (this._enabled) {
			return;
		}
		L.DomEvent.addListener(this._dragStartTarget, L.Draggable.START, this._onDown, this);
		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) {
			return;
		}
		L.DomEvent.removeListener(this._dragStartTarget, L.Draggable.START, this._onDown);
		this._enabled = false;
	},

	_onDown: function (e) {
		if ((!L.Browser.touch && e.shiftKey) || ((e.which !== 1) && (e.button !== 1) && !e.touches)) {
			return;
		}

		if (e.touches && e.touches.length > 1) {
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			el = first.target;

		L.DomEvent.preventDefault(e);

		if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
			el.className += ' leaflet-active';
		}

		this._moved = false;
		if (this._moving) {
			return;
		}

		if (!L.Browser.touch) {
			L.DomUtil.disableTextSelection();
			this._setMovingCursor();
		}

		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
		this._startPoint = new L.Point(first.clientX, first.clientY);

		L.DomEvent.addListener(document, L.Draggable.MOVE, this._onMove, this);
		L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			return;
		}

		L.DomEvent.preventDefault(e);

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e);

		if (!this._moved) {
			this.fire('dragstart');
			this._moved = true;
		}
		this._moving = true;

		var newPoint = new L.Point(first.clientX, first.clientY);
		this._newPos = this._startPos.add(newPoint).subtract(this._startPoint);

		L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		this.fire('predrag');
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},

	_onUp: function (e) {
		if (e.changedTouches) {
			var first = e.changedTouches[0],
				el = first.target,
				dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;

			if (el.tagName.toLowerCase() === 'a') {
				el.className = el.className.replace(' leaflet-active', '');
			}

			if (dist < L.Draggable.TAP_TOLERANCE) {
				this._simulateEvent('click', first);
			}
		}

		if (!L.Browser.touch) {
			L.DomUtil.enableTextSelection();
			this._restoreCursor();
		}

		L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove);
		L.DomEvent.removeListener(document, L.Draggable.END, this._onUp);

		if (this._moved) {
			this.fire('dragend');
		}
		this._moving = false;
	},

	_setMovingCursor: function () {
		this._bodyCursor = document.body.style.cursor;
		document.body.style.cursor = 'move';
	},

	_restoreCursor: function () {
		document.body.style.cursor = this._bodyCursor;
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent.initMouseEvent(
				type, true, true, window, 1,
				e.screenX, e.screenY,
				e.clientX, e.clientY,
				false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});


/*
 * L.Handler classes are used internally to inject interaction features to classes like Map and Marker.
 */

L.Handler = L.Class.extend({
	initialize: function (map) {
		this._map = map;
	},

	enable: function () {
		if (this._enabled) {
			return;
		}
		this._enabled = true;
		this.addHooks();
	},

	disable: function () {
		if (!this._enabled) {
			return;
		}
		this._enabled = false;
		this.removeHooks();
	},

	enabled: function () {
		return !!this._enabled;
	}
});


/*
 * L.Handler.MapDrag is used internally by L.Map to make the map draggable.
 */

L.Map.Drag = L.Handler.extend({
	addHooks: function () {
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._map._mapPane, this._map._container);

			this._draggable
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);

			var options = this._map.options;

			if (options.worldCopyJump && !options.continuousWorld) {
				this._draggable.on('predrag', this._onPreDrag, this);
				this._map.on('viewreset', this._onViewReset, this);
			}
		}
		this._draggable.enable();
	},

	removeHooks: function () {
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		this._map
			.fire('movestart')
			.fire('dragstart');
	},

	_onDrag: function () {
		this._map
			.fire('move')
			.fire('drag');
	},

	_onViewReset: function () {
		var pxCenter = this._map.getSize().divideBy(2),
			pxWorldCenter = this._map.latLngToLayerPoint(new L.LatLng(0, 0));

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter);
	},

	_onPreDrag: function () {
		var map = this._map,
			worldWidth = map.options.scale(map.getZoom()),
			halfWidth = Math.round(worldWidth / 2),
			dx = this._initialWorldOffset.x,
			x = this._draggable._newPos.x,
			newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

		this._draggable._newPos.x = newX;
	},

	_onDragEnd: function () {
		var map = this._map;

		map
			.fire('moveend')
			.fire('dragend');

		if (map.options.maxBounds) {
			// TODO predrag validation instead of animation
			L.Util.requestAnimFrame(this._panInsideMaxBounds, map, true, map._container);
		}
	},

	_panInsideMaxBounds: function () {
		this.panInsideBounds(this.options.maxBounds);
	}
});


/*
 * L.Handler.DoubleClickZoom is used internally by L.Map to add double-click zooming.
 */

L.Map.DoubleClickZoom = L.Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick);
		// TODO remove 3d argument?
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick);
	},

	_onDoubleClick: function (e) {
		this.setView(e.latlng, this._zoom + 1);
	}
});


/*
 * L.Handler.ScrollWheelZoom is used internally by L.Map to enable mouse scroll wheel zooming on the map.
 */

L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.addListener(this._map._container, 'mousewheel', this._onWheelScroll, this);
		this._delta = 0;
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._map._container, 'mousewheel', this._onWheelScroll);
	},

	_onWheelScroll: function (e) {
		var delta = L.DomEvent.getWheelDelta(e);
		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.Util.bind(this._performZoom, this), 50);

		L.DomEvent.preventDefault(e);
	},

	_performZoom: function () {
		var map = this._map,
			delta = Math.round(this._delta),
			zoom = map.getZoom();

		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;

		if (!delta) {
			return;
		}

		var newCenter = this._getCenterForScrollWheelZoom(this._lastMousePos, delta),
			newZoom = zoom + delta;

		map.setView(newCenter, newZoom);
	},

	_getCenterForScrollWheelZoom: function (mousePos, delta) {
		var map = this._map,
			centerPoint = map.getPixelBounds().getCenter(),
			viewHalf = map.getSize().divideBy(2),
			centerOffset = mousePos.subtract(viewHalf).multiplyBy(1 - Math.pow(2, -delta)),
			newCenterPoint = centerPoint.add(centerOffset);

		return map.unproject(newCenterPoint, map._zoom, true);
	}
});


L.Util.extend(L.DomEvent, {
	// inspired by Zepto touch code by Thomas Fuchs
	addDoubleTapListener: function (obj, handler, id) {
		var last,
			doubleTap = false,
			delay = 250,
			touch,
			pre = '_leaflet_',
			touchstart = 'touchstart',
			touchend = 'touchend';

		function onTouchStart(e) {
			if (e.touches.length !== 1) {
				return;
			}

			var now = Date.now(),
				delta = now - (last || now);

			touch = e.touches[0];
			doubleTap = (delta > 0 && delta <= delay);
			last = now;
		}
		function onTouchEnd(e) {
			if (doubleTap) {
				touch.type = 'dblclick';
				handler(touch);
				last = null;
			}
		}
		obj[pre + touchstart + id] = onTouchStart;
		obj[pre + touchend + id] = onTouchEnd;

		obj.addEventListener(touchstart, onTouchStart, false);
		obj.addEventListener(touchend, onTouchEnd, false);
	},

	removeDoubleTapListener: function (obj, id) {
		var pre = '_leaflet_';
		obj.removeEventListener(obj, obj[pre + 'touchstart' + id], false);
		obj.removeEventListener(obj, obj[pre + 'touchend' + id], false);
	}
});


/*
 * L.Handler.TouchZoom is used internally by L.Map to add touch-zooming on Webkit-powered mobile browsers.
 */

L.Map.TouchZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.addListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		if (!e.touches || e.touches.length !== 2 || this._map._animatingZoom) {
			return;
		}

		var p1 = this._map.mouseEventToLayerPoint(e.touches[0]),
			p2 = this._map.mouseEventToLayerPoint(e.touches[1]),
			viewCenter = this._map.containerPointToLayerPoint(this._map.getSize().divideBy(2));

		this._startCenter = p1.add(p2).divideBy(2, true);
		this._startDist = p1.distanceTo(p2);
		//this._startTransform = this._map._mapPane.style.webkitTransform;

		this._moved = false;
		this._zooming = true;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		L.DomEvent.addListener(document, 'touchmove', this._onTouchMove, this);
		L.DomEvent.addListener(document, 'touchend', this._onTouchEnd, this);

		L.DomEvent.preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2) {
			return;
		}

		if (!this._moved) {
			this._map._mapPane.className += ' leaflet-zoom-anim';

			this._map
				.fire('zoomstart')
				.fire('movestart')
				._prepareTileBg();

			this._moved = true;
		}

		var p1 = this._map.mouseEventToLayerPoint(e.touches[0]),
			p2 = this._map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1.add(p2).divideBy(2, true).subtract(this._startCenter);

		// Used 2 translates instead of transform-origin because of a very strange bug -
		// it didn't count the origin on the first touch-zoom but worked correctly afterwards

		this._map._tileBg.style.webkitTransform = [
            L.DomUtil.getTranslateString(this._delta),
            L.DomUtil.getScaleString(this._scale, this._startCenter)
        ].join(" ");

		L.DomEvent.preventDefault(e);
	},

	_onTouchEnd: function (e) {
		if (!this._moved || !this._zooming) {
			return;
		}
		this._zooming = false;

		var oldZoom = this._map.getZoom(),
			floatZoomDelta = Math.log(this._scale) / Math.LN2,
			roundZoomDelta = (floatZoomDelta > 0 ? Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),
			zoom = this._map._limitZoom(oldZoom + roundZoomDelta),
			zoomDelta = zoom - oldZoom,
			centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale),
			centerPoint = this._map.getPixelOrigin().add(this._startCenter).add(centerOffset),
			center = this._map.unproject(centerPoint);

		L.DomEvent.removeListener(document, 'touchmove', this._onTouchMove);
		L.DomEvent.removeListener(document, 'touchend', this._onTouchEnd);

		var finalScale = Math.pow(2, zoomDelta);

		this._map._runAnimation(center, zoom, finalScale / this._scale, this._startCenter.add(centerOffset));
	}
});


/*
 * L.Handler.ShiftDragZoom is used internally by L.Map to add shift-drag zoom (zoom to a selected bounding box).
 */

L.Map.BoxZoom = L.Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		L.DomEvent.addListener(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._container, 'mousedown', this._onMouseDown);
	},

	_onMouseDown: function (e) {
		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) {
			return false;
		}

		L.DomUtil.disableTextSelection();

		this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

		this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
		L.DomUtil.setPosition(this._box, this._startLayerPoint);

		//TODO move cursor to styles
		this._container.style.cursor = 'crosshair';

		L.DomEvent.addListener(document, 'mousemove', this._onMouseMove, this);
		L.DomEvent.addListener(document, 'mouseup', this._onMouseUp, this);

		L.DomEvent.preventDefault(e);
	},

	_onMouseMove: function (e) {
		var layerPoint = this._map.mouseEventToLayerPoint(e),
			dx = layerPoint.x - this._startLayerPoint.x,
			dy = layerPoint.y - this._startLayerPoint.y;

		var newX = Math.min(layerPoint.x, this._startLayerPoint.x),
			newY = Math.min(layerPoint.y, this._startLayerPoint.y),
			newPos = new L.Point(newX, newY);

		L.DomUtil.setPosition(this._box, newPos);

		this._box.style.width = (Math.abs(dx) - 4) + 'px';
		this._box.style.height = (Math.abs(dy) - 4) + 'px';
	},

	_onMouseUp: function (e) {
		this._pane.removeChild(this._box);
		this._container.style.cursor = '';

		L.DomUtil.enableTextSelection();

		L.DomEvent.removeListener(document, 'mousemove', this._onMouseMove);
		L.DomEvent.removeListener(document, 'mouseup', this._onMouseUp);

		var layerPoint = this._map.mouseEventToLayerPoint(e);

		var bounds = new L.LatLngBounds(
				this._map.layerPointToLatLng(this._startLayerPoint),
				this._map.layerPointToLatLng(layerPoint));

		this._map.fitBounds(bounds);
	}
});


/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */

L.Handler.MarkerDrag = L.Handler.extend({
	initialize: function (marker) {
		this._marker = marker;
	},

	addHooks: function () {
		var icon = this._marker._icon;
		if (!this._draggable) {
			this._draggable = new L.Draggable(icon, icon);

			this._draggable
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);
		}
		this._draggable.enable();
	},

	removeHooks: function () {
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function (e) {
		this._marker
			.closePopup()
			.fire('movestart')
			.fire('dragstart');
	},

	_onDrag: function (e) {
		// update shadow position
		var iconPos = L.DomUtil.getPosition(this._marker._icon);
		if (this._marker._shadow) {
			L.DomUtil.setPosition(this._marker._shadow, iconPos);
		}

		this._marker._latlng = this._marker._map.layerPointToLatLng(iconPos);

		this._marker
			.fire('move')
			.fire('drag');
	},

	_onDragEnd: function () {
		this._marker
			.fire('moveend')
			.fire('dragend');
	}
});



L.Control = {};

L.Control.Position = {
	TOP_LEFT: 'topLeft',
	TOP_RIGHT: 'topRight',
	BOTTOM_LEFT: 'bottomLeft',
	BOTTOM_RIGHT: 'bottomRight'
};


L.Map.include({
	addControl: function (control) {
		control.onAdd(this);

		var pos = control.getPosition(),
			corner = this._controlCorners[pos],
			container = control.getContainer();

		L.DomUtil.addClass(container, 'leaflet-control');

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}
		return this;
	},

	removeControl: function (control) {
		var pos = control.getPosition(),
			corner = this._controlCorners[pos],
			container = control.getContainer();

		corner.removeChild(container);

		if (control.onRemove) {
			control.onRemove(this);
		}
		return this;
	},

	_initControlPos: function () {
		var corners = this._controlCorners = {},
			classPart = 'leaflet-',
			top = classPart + 'top',
			bottom = classPart + 'bottom',
			left = classPart + 'left',
			right = classPart + 'right',
			controlContainer = L.DomUtil.create('div', classPart + 'control-container', this._container);

		if (L.Browser.touch) {
			controlContainer.className += ' ' + classPart + 'big-buttons';
		}

		corners.topLeft = L.DomUtil.create('div', top + ' ' + left, controlContainer);
		corners.topRight = L.DomUtil.create('div', top + ' ' + right, controlContainer);
		corners.bottomLeft = L.DomUtil.create('div', bottom + ' ' + left, controlContainer);
		corners.bottomRight = L.DomUtil.create('div', bottom + ' ' + right, controlContainer);
	}
});



L.Control.Zoom = L.Class.extend({
	onAdd: function (map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-zoom');

		this._zoomInButton = this._createButton(
				'Zoom in', 'leaflet-control-zoom-in', this._map.zoomIn, this._map);
		this._zoomOutButton = this._createButton(
				'Zoom out', 'leaflet-control-zoom-out', this._map.zoomOut, this._map);

		this._container.appendChild(this._zoomInButton);
		this._container.appendChild(this._zoomOutButton);
	},

	getContainer: function () {
		return this._container;
	},

	getPosition: function () {
		return L.Control.Position.TOP_LEFT;
	},

	_createButton: function (title, className, fn, context) {
		var link = document.createElement('a');
		link.href = '#';
		link.title = title;
		link.className = className;

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(link);
		}
		L.DomEvent.addListener(link, 'click', L.DomEvent.preventDefault);
		L.DomEvent.addListener(link, 'click', fn, context);

		return link;
	}
});


L.Control.Attribution = L.Class.extend({
	initialize: function (prefix) {
		this._prefix = prefix || 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>';
		this._attributions = {};
	},

	onAdd: function (map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);
		this._map = map;
		this._update();
	},

	getPosition: function () {
		return L.Control.Position.BOTTOM_RIGHT;
	},

	getContainer: function () {
		return this._container;
	},

	setPrefix: function (prefix) {
		this._prefix = prefix;
		this._update();
	},

	addAttribution: function (text) {
		if (!text) {
			return;
		}
		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;
		this._update();
	},

	removeAttribution: function (text) {
		if (!text) {
			return;
		}
		this._attributions[text]--;
		this._update();
	},

	_update: function () {
		if (!this._map) {
			return;
		}

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions.hasOwnProperty(i)) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];
		if (this._prefix) {
			prefixAndAttribs.push(this._prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' &mdash; ');
	}
});



L.Control.Layers = L.Class.extend({
	options: {
		collapsed: true
	},

	initialize: function (baseLayers, overlays, options) {
		L.Util.setOptions(this, options);

		this._layers = {};

		for (var i in baseLayers) {
			if (baseLayers.hasOwnProperty(i)) {
				this._addLayer(baseLayers[i], i);
			}
		}

		for (i in overlays) {
			if (overlays.hasOwnProperty(i)) {
				this._addLayer(overlays[i], i, true);
			}
		}
	},

	onAdd: function (map) {
		this._map = map;

		this._initLayout();
		this._update();
	},

	getContainer: function () {
		return this._container;
	},

	getPosition: function () {
		return L.Control.Position.TOP_RIGHT;
	},

	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		this._update();
		return this;
	},

	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		this._update();
		return this;
	},

	removeLayer: function (layer) {
		var id = L.Util.stamp(layer);
		delete this._layers[id];
		this._update();
		return this;
	},

	_initLayout: function () {
		this._container = L.DomUtil.create('div', 'leaflet-control-layers');
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(this._container);
		}

		this._form = L.DomUtil.create('form', 'leaflet-control-layers-list');

		if (this.options.collapsed) {
			L.DomEvent.addListener(this._container, 'mouseover', this._expand, this);
			L.DomEvent.addListener(this._container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', 'leaflet-control-layers-toggle');
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent.addListener(link, 'click', this._expand, this);
				//L.DomEvent.disableClickPropagation(link);
			} else {
				L.DomEvent.addListener(link, 'focus', this._expand, this);
			}
			this._map.on('movestart', this._collapse, this);
			// TODO keyboard accessibility

			this._container.appendChild(link);
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', 'leaflet-control-layers-base', this._form);
		this._separator = L.DomUtil.create('div', 'leaflet-control-layers-separator', this._form);
		this._overlaysList = L.DomUtil.create('div', 'leaflet-control-layers-overlays', this._form);

		this._container.appendChild(this._form);
	},

	_addLayer: function (layer, name, overlay) {
		var id = L.Util.stamp(layer);
		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};
	},

	_update: function () {
		if (!this._container) {
			return;
		}

		this._baseLayersList.innerHTML = '';
		this._overlaysList.innerHTML = '';

		var baseLayersPresent = false,
			overlaysPresent = false;

		for (var i in this._layers) {
			if (this._layers.hasOwnProperty(i)) {
				var obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
			}
		}

		this._separator.style.display = (overlaysPresent && baseLayersPresent ? '' : 'none');
	},

	_addItem: function (obj, onclick) {
		var label = document.createElement('label');

		var input = document.createElement('input');
		if (!obj.overlay) {
			input.name = 'leaflet-base-layers';
		}
		input.type = obj.overlay ? 'checkbox' : 'radio';
		input.checked = this._map.hasLayer(obj.layer);
		input.layerId = L.Util.stamp(obj.layer);

		L.DomEvent.addListener(input, 'click', this._onInputClick, this);

		var name = document.createTextNode(' ' + obj.name);

		label.appendChild(input);
		label.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);
	},

	_onInputClick: function () {
		var i, input, obj,
			inputs = this._form.getElementsByTagName('input'),
			inputsLen = inputs.length;

		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			obj = this._layers[input.layerId];

			if (input.checked) {
				this._map.addLayer(obj.layer, !obj.overlay);
			} else {
				this._map.removeLayer(obj.layer);
			}
		}
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
	}
});


L.Transition = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		CUSTOM_PROPS_SETTERS: {
			position: L.DomUtil.setPosition
			//TODO transform custom attr
		},

		implemented: function () {
			return L.Transition.NATIVE || L.Transition.TIMER;
		}
	},

	options: {
		easing: 'ease',
		duration: 0.5
	},

	_setProperty: function (prop, value) {
		var setters = L.Transition.CUSTOM_PROPS_SETTERS;
		if (prop in setters) {
			setters[prop](this._el, value);
		} else {
			this._el.style[prop] = value;
		}
	}
});


/*
 * L.Transition native implementation that powers Leaflet animation
 * in browsers that support CSS3 Transitions
 */

L.Transition = L.Transition.extend({
	statics: (function () {
		var transition = L.DomUtil.TRANSITION,
			transitionEnd = (transition === 'webkitTransition' || transition === 'OTransition' ?
				transition + 'End' : 'transitionend');

		return {
			NATIVE: !!transition,

			TRANSITION: transition,
			PROPERTY: transition + 'Property',
			DURATION: transition + 'Duration',
			EASING: transition + 'TimingFunction',
			END: transitionEnd,

			// transition-property value to use with each particular custom property
			CUSTOM_PROPS_PROPERTIES: {
				position: L.Browser.webkit ? L.DomUtil.TRANSFORM : 'top, left'
			}
		};
	}()),

	options: {
		fakeStepInterval: 100
	},

	initialize: function (/*HTMLElement*/ el, /*Object*/ options) {
		this._el = el;
		L.Util.setOptions(this, options);

		L.DomEvent.addListener(el, L.Transition.END, this._onTransitionEnd, this);
		this._onFakeStep = L.Util.bind(this._onFakeStep, this);
	},

	run: function (/*Object*/ props) {
		var prop,
			propsList = [],
			customProp = L.Transition.CUSTOM_PROPS_PROPERTIES;

		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				prop = customProp[prop] ? customProp[prop] : prop;
				prop = this._dasherize(prop);
				propsList.push(prop);
			}
		}

		this._el.style[L.Transition.DURATION] = this.options.duration + 's';
		this._el.style[L.Transition.EASING] = this.options.easing;
		this._el.style[L.Transition.PROPERTY] = propsList.join(', ');

		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				this._setProperty(prop, props[prop]);
			}
		}

		this._inProgress = true;

		this.fire('start');

		if (L.Transition.NATIVE) {
			clearInterval(this._timer);
			this._timer = setInterval(this._onFakeStep, this.options.fakeStepInterval);
		} else {
			this._onTransitionEnd();
		}
	},

	_dasherize: (function () {
		var re = /([A-Z])/g;

		function replaceFn(w) {
			return '-' + w.toLowerCase();
		}

		return function (str) {
			return str.replace(re, replaceFn);
		};
	}()),

	_onFakeStep: function () {
		this.fire('step');
	},

	_onTransitionEnd: function () {
		if (this._inProgress) {
			this._inProgress = false;
			clearInterval(this._timer);

			this._el.style[L.Transition.PROPERTY] = 'none';

			this.fire('step');
			this.fire('end');
		}
	}
});


/*
 * L.Transition fallback implementation that powers Leaflet animation
 * in browsers that don't support CSS3 Transitions
 */

L.Transition = L.Transition.NATIVE ? L.Transition : L.Transition.extend({
	statics: {
		getTime: Date.now || function () {
			return +new Date();
		},

		TIMER: true,

		EASINGS: {
			'ease': [0.25, 0.1, 0.25, 1.0],
			'linear': [0.0, 0.0, 1.0, 1.0],
			'ease-in': [0.42, 0, 1.0, 1.0],
			'ease-out': [0, 0, 0.58, 1.0],
			'ease-in-out': [0.42, 0, 0.58, 1.0]
		},

		CUSTOM_PROPS_GETTERS: {
			position: L.DomUtil.getPosition
		},

		//used to get units from strings like "10.5px" (->px)
		UNIT_RE: /^[\d\.]+(\D*)$/
	},

	options: {
		fps: 50
	},

	initialize: function (el, options) {
		this._el = el;
		L.Util.extend(this.options, options);

		var easings = L.Transition.EASINGS[this.options.easing] || L.Transition.EASINGS.ease;

		this._p1 = new L.Point(0, 0);
		this._p2 = new L.Point(easings[0], easings[1]);
		this._p3 = new L.Point(easings[2], easings[3]);
		this._p4 = new L.Point(1, 1);

		this._step = L.Util.bind(this._step, this);
		this._interval = Math.round(1000 / this.options.fps);
	},

	run: function (props) {
		this._props = {};

		var getters = L.Transition.CUSTOM_PROPS_GETTERS,
			re = L.Transition.UNIT_RE;

		this.fire('start');

		for (var prop in props) {
			if (props.hasOwnProperty(prop)) {
				var p = {};
				if (prop in getters) {
					p.from = getters[prop](this._el);
				} else {
					var matches = this._el.style[prop].match(re);
					p.from = parseFloat(matches[0]);
					p.unit = matches[1];
				}
				p.to = props[prop];
				this._props[prop] = p;
			}
		}

		clearInterval(this._timer);
		this._timer = setInterval(this._step, this._interval);
		this._startTime = L.Transition.getTime();
	},

	_step: function () {
		var time = L.Transition.getTime(),
			elapsed = time - this._startTime,
			duration = this.options.duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._cubicBezier(elapsed / duration));
		} else {
			this._runFrame(1);
			this._complete();
		}
	},

	_runFrame: function (percentComplete) {
		var setters = L.Transition.CUSTOM_PROPS_SETTERS,
			prop, p, value;

		for (prop in this._props) {
			if (this._props.hasOwnProperty(prop)) {
				p = this._props[prop];
				if (prop in setters) {
					value = p.to.subtract(p.from).multiplyBy(percentComplete).add(p.from);
					setters[prop](this._el, value);
				} else {
					this._el.style[prop] =
							((p.to - p.from) * percentComplete + p.from) + p.unit;
				}
			}
		}
		this.fire('step');
	},

	_complete: function () {
		clearInterval(this._timer);
		this.fire('end');
	},

	_cubicBezier: function (t) {
		var a = Math.pow(1 - t, 3),
			b = 3 * Math.pow(1 - t, 2) * t,
			c = 3 * (1 - t) * Math.pow(t, 2),
			d = Math.pow(t, 3),
			p1 = this._p1.multiplyBy(a),
			p2 = this._p2.multiplyBy(b),
			p3 = this._p3.multiplyBy(c),
			p4 = this._p4.multiplyBy(d);

		return p1.add(p2).add(p3).add(p4).y;
	}
});


L.Map.include(!(L.Transition && L.Transition.implemented()) ? {} : {
	setView: function (center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);
		var zoomChanged = (this._zoom !== zoom);

		if (this._loaded && !forceReset && this._layers) {
			// difference between the new and current centers in pixels
			var offset = this._getNewTopLeftPoint(center).subtract(this._getTopLeftPoint());

			center = new L.LatLng(center.lat, center.lng);

			var done = (zoomChanged ?
						!!this._zoomToIfCenterInView && this._zoomToIfCenterInView(center, zoom, offset) :
						this._panByIfClose(offset));

			// exit if animated pan or zoom started
			if (done) {
				return this;
			}
		}

		// reset the map view
		this._resetView(center, zoom);

		return this;
	},

	panBy: function (offset) {
		if (!(offset.x || offset.y)) {
			return this;
		}

		if (!this._panTransition) {
			this._panTransition = new L.Transition(this._mapPane, {duration: 0.3});

			this._panTransition.on('step', this._onPanTransitionStep, this);
			this._panTransition.on('end', this._onPanTransitionEnd, this);
		}
		this.fire('movestart');

		this._panTransition.run({
			position: L.DomUtil.getPosition(this._mapPane).subtract(offset)
		});

		return this;
	},

	_onPanTransitionStep: function () {
		this.fire('move');
	},

	_onPanTransitionEnd: function () {
		this.fire('moveend');
	},

	_panByIfClose: function (offset) {
		if (this._offsetIsWithinView(offset)) {
			this.panBy(offset);
			return true;
		}
		return false;
	},

	_offsetIsWithinView: function (offset, multiplyFactor) {
		var m = multiplyFactor || 1,
			size = this.getSize();
		return (Math.abs(offset.x) <= size.x * m) &&
				(Math.abs(offset.y) <= size.y * m);
	}
});


L.Map.include(!L.DomUtil.TRANSITION ? {} : {
	_zoomToIfCenterInView: function (center, zoom, centerOffset) {

		if (this._animatingZoom) {
			return true;
		}
		if (!this.options.zoomAnimation) {
			return false;
		}

		var zoomDelta = zoom - this._zoom,
			scale = Math.pow(2, zoomDelta),
			offset = centerOffset.divideBy(1 - 1 / scale);

		//if offset does not exceed half of the view
		if (!this._offsetIsWithinView(offset, 1)) {
			return false;
		}

		this._mapPane.className += ' leaflet-zoom-anim';

        this
			.fire('movestart')
			.fire('zoomstart');

		var centerPoint = this.containerPointToLayerPoint(this.getSize().divideBy(2)),
			origin = centerPoint.add(offset);

		this._prepareTileBg();

		this._runAnimation(center, zoom, scale, origin);

		return true;
	},


	_runAnimation: function (center, zoom, scale, origin) {
		this._animatingZoom = true;

		this._animateToCenter = center;
		this._animateToZoom = zoom;

		var transform = L.DomUtil.TRANSFORM;

		clearTimeout(this._clearTileBgTimer);

		//dumb FireFox hack, I have no idea why this magic zero translate fixes the scale transition problem
		if (L.Browser.gecko || window.opera) {
			this._tileBg.style[transform] += ' translate(0,0)';
		}

		var scaleStr;

		// Android doesn't like translate/scale chains, transformOrigin + scale works better but
		// it breaks touch zoom which Anroid doesn't support anyway, so that's a really ugly hack
		// TODO work around this prettier
		if (L.Browser.android) {
			this._tileBg.style[transform + 'Origin'] = origin.x + 'px ' + origin.y + 'px';
			scaleStr = 'scale(' + scale + ')';
		} else {
			scaleStr = L.DomUtil.getScaleString(scale, origin);
		}

		L.Util.falseFn(this._tileBg.offsetWidth); //hack to make sure transform is updated before running animation

		var options = {};
		options[transform] = this._tileBg.style[transform] + ' ' + scaleStr;
		this._tileBg.transition.run(options);
	},

	_prepareTileBg: function () {
		if (!this._tileBg) {
			this._tileBg = this._createPane('leaflet-tile-pane', this._mapPane);
			this._tileBg.style.zIndex = 1;
		}

		var tilePane = this._tilePane,
			tileBg = this._tileBg;

		// prepare the background pane to become the main tile pane
		//tileBg.innerHTML = '';
		tileBg.style[L.DomUtil.TRANSFORM] = '';
		tileBg.style.visibility = 'hidden';

		// tells tile layers to reinitialize their containers
		tileBg.empty = true;
		tilePane.empty = false;

		this._tilePane = this._panes.tilePane = tileBg;
		this._tileBg = tilePane;

		if (!this._tileBg.transition) {
			this._tileBg.transition = new L.Transition(this._tileBg, {duration: 0.3, easing: 'cubic-bezier(0.25,0.1,0.25,0.75)'});
			this._tileBg.transition.on('end', this._onZoomTransitionEnd, this);
		}

		this._stopLoadingBgTiles();
	},

	// stops loading all tiles in the background layer
	_stopLoadingBgTiles: function () {
		var tiles = [].slice.call(this._tileBg.getElementsByTagName('img'));

		for (var i = 0, len = tiles.length; i < len; i++) {
			if (!tiles[i].complete) {
				tiles[i].onload = L.Util.falseFn;
				tiles[i].onerror = L.Util.falseFn;
				tiles[i].src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

				tiles[i].parentNode.removeChild(tiles[i]);
				tiles[i] = null;
			}
		}
	},

	_onZoomTransitionEnd: function () {
		this._restoreTileFront();

		L.Util.falseFn(this._tileBg.offsetWidth);
		this._resetView(this._animateToCenter, this._animateToZoom, true, true);

		this._mapPane.className = this._mapPane.className.replace(' leaflet-zoom-anim', ''); //TODO toggleClass util
		this._animatingZoom = false;
	},

	_restoreTileFront: function () {
		this._tilePane.innerHTML = '';
		this._tilePane.style.visibility = '';
		this._tilePane.style.zIndex = 2;
		this._tileBg.style.zIndex = 1;
	},

	_clearTileBg: function () {
		if (!this._animatingZoom && !this.touchZoom._zooming) {
			this._tileBg.innerHTML = '';
		}
	}
});


/*
 * Provides L.Map with convenient shortcuts for W3C geolocation.
 */

L.Map.include({
	locate: function (/*Object*/ options) {

		this._locationOptions = options = L.Util.extend({
			watch: false,
			setView: false,
			maxZoom: Infinity,
			timeout: 10000,
			maximumAge: 0,
			enableHighAccuracy: false
		}, options);

		if (!navigator.geolocation) {
			return this.fire('locationerror', {
				code: 0,
				message: "Geolocation not supported."
			});
		}

		var onResponse = L.Util.bind(this._handleGeolocationResponse, this),
			onError = L.Util.bind(this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	},

	stopLocate: function () {
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
	},

	locateAndSetView: function (maxZoom, options) {
		options = L.Util.extend({
			maxZoom: maxZoom || Infinity,
			setView: true
		}, options);
		return this.locate(options);
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
			message = (c === 1 ? "permission denied" :
				(c === 2 ? "position unavailable" : "timeout"));

		if (this._locationOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		this.fire('locationerror', {
			code: c,
			message: "Geolocation error: " + message + "."
		});
	},

	_handleGeolocationResponse: function (pos) {
		var latAccuracy = 180 * pos.coords.accuracy / 4e7,
			lngAccuracy = latAccuracy * 2,
			lat = pos.coords.latitude,
			lng = pos.coords.longitude,
			latlng = new L.LatLng(lat, lng);

		var sw = new L.LatLng(lat - latAccuracy, lng - lngAccuracy),
			ne = new L.LatLng(lat + latAccuracy, lng + lngAccuracy),
			bounds = new L.LatLngBounds(sw, ne);

		if (this._locationOptions.setView) {
			var zoom = Math.min(this.getBoundsZoom(bounds), this._locationOptions.maxZoom);
			this.setView(latlng, zoom);
		}

		this.fire('locationfound', {
			latlng: latlng,
			bounds: bounds,
			accuracy: pos.coords.accuracy
		});
	}
});


