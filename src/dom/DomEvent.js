/*
 * L.DomEvent contains functions for working with DOM events.
 */

L.DomEvent = {
	WHEEL:
		'onwheel' in document ? 'wheel' :
		'onmousewheel' in document ? 'mousewheel' :
			'MozMousePixelScroll',

	/* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])

		var id = L.stamp(fn),
		    key = '_leaflet_' + type + id,
		    handler, originalHandler, newType;

		if (obj[key]) { return this; }

		handler = function (e) {
			return fn.call(context || obj, e || L.DomEvent._getEvent());
		};

		if (L.Browser.msTouch && type.indexOf('touch') === 0) {
			return this.addMsTouchListener(obj, type, handler, id);
		}
		if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		}

		if (type === 'wheel' || type === 'mousewheel') {
			type = L.DomEvent.WHEEL;
		}

		if ('addEventListener' in obj) {

			if ((type === 'mouseenter') || (type === 'mouseleave')) {

				originalHandler = handler;
				newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');

				handler = function (e) {
					if (!L.DomEvent._checkMouse(obj, e)) { return; }
					return originalHandler(e);
				};

				obj.addEventListener(newType, handler, false);

			} else if (type === 'click' && L.Browser.android) {
				originalHandler = handler;
				handler = function (e) {
					return L.DomEvent._filterClick(e, originalHandler);
				};

				obj.addEventListener(type, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}

		} else if ('attachEvent' in obj) {
			obj.attachEvent('on' + type, handler);
		}

		obj[key] = handler;

		return this;
	},

	removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)

		var id = L.stamp(fn),
		    key = '_leaflet_' + type + id,
		    handler = obj[key];

		if (!handler) { return this; }

		if (type === 'wheel' || type === 'mousewheel') {
			type = L.DomEvent.WHEEL;
		}

		if (L.Browser.msTouch && type.indexOf('touch') === 0) {
			this.removeMsTouchListener(obj, type, id);
		} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);

		} else if ('removeEventListener' in obj) {

			if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent('on' + type, handler);
		}

		obj[key] = null;

		return this;
	},

	stopPropagation: function (e) {

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		return this;
	},

	disableClickPropagation: function (el) {
		var stop = L.DomEvent.stopPropagation;

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.addListener(el, L.Draggable.START[i], stop);
		}

		return L.DomEvent
			.addListener(el, 'click', L.DomEvent._fakeStop)
			.addListener(el, 'dblclick', stop);
	},

	preventDefault: function (e) {

		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return this;
	},

	stop: function (e) {
		return L.DomEvent.preventDefault(e).stopPropagation(e);
	},

	getMousePosition: function (e, container) {

		var body = document.body,
		    docEl = document.documentElement,
		    x = e.pageX ? e.pageX : e.clientX + body.scrollLeft + docEl.scrollLeft,
		    y = e.pageY ? e.pageY : e.clientY + body.scrollTop + docEl.scrollTop,
		    pos = new L.Point(x, y);

		return (container ? pos._subtract(L.DomUtil.getViewportOffset(container)) : pos);
	},

	getWheelDelta: function (e) {
		var delta = 0;

		if (e.type === 'wheel') {
			delta = -e.deltaY / (e.deltaMode ? 1 : 120);
		} else if (e.type === 'mousewheel') {
			delta = e.wheelDelta / 120;
		} else if (e.type === 'MozMousePixelScroll') {
			delta = -e.detail;
		}

		return delta;
	},

	_fakeStop: function stop(e) {
		// fakes stopPropagation by setting a special event flag checked in Map mouse events handler
		// jshint camelcase: false
		e._leaflet_stop = true;
	},

	// check if element really left/entered the event target (for mouseenter/mouseleave)
	_checkMouse: function (el, e) {

		var related = e.relatedTarget;

		if (!related) { return true; }

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}
		return (related !== el);
	},

	_getEvent: function () { // evil magic for IE
		/*jshint noarg:false */
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

	// this solves a bug in Android WebView where a single touch triggers two click events.
	_filterClick: function (e, handler) {
		// check if click is simulated on the element, and if it is, reject any non-simulated events
		if (e.target._simulatedClick && !e._simulated) { return; }
		return handler(e);
	}
};

L.DomEvent.on = L.DomEvent.addListener;
L.DomEvent.off = L.DomEvent.removeListener;
