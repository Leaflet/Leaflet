/*
 * L.DomEvent contains functions for working with DOM events.
 */

L.DomEvent = {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function(/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = L.Util.stamp(fn);
		function handler(e) {
			return fn.call(context || obj, e || L.DomEvent._getEvent());
		}
		obj['_leaflet_' + type + id] = handler;
		if ('addEventListener' in obj) {
			if (type == 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false); 
			}
			obj.addEventListener(type, handler, false);
		} else if ('attachEvent' in obj) {
			obj.attachEvent("on" + type, handler);
		}
	},
	
	removeListener: function(/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = L.Util.stamp(fn),
			key = '_leaflet_' + type + id;
			handler = obj[key];
		if ('removeEventListener' in obj) {
			if (type == 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false); 
			}
			obj.removeEventListener(type, handler, false);
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null; 
	},
	
	fireEvent: function (/*HTMLElement*/ obj, /*String*/ type) {
		if (document.createEventObject){
			// dispatch for IE
			var evt = document.createEventObject();
			return obj.fireEvent('on'+type,evt)
		} else{
			// dispatch for firefox + others
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(type, true, true ); // event type,bubbling,cancelable
			return !obj.dispatchEvent(evt);
		}
	},
	
	_getEvent: function()/*->Event*/ {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && Event == e.constructor) { break; }
				caller = caller.caller;
			}
		}
		return e;
	},
	
	stopPropagation: function(/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},
	
	disableClickPropagation: function(/*HTMLElement*/ el) {
		L.DomEvent.addListener(el, 'mousedown', L.DomEvent.stopPropagation);
		L.DomEvent.addListener(el, 'click', L.DomEvent.stopPropagation);
		L.DomEvent.addListener(el, 'dblclick', L.DomEvent.stopPropagation);
	},
	
	preventDefault: function(/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},
	
	getMousePosition: function(e, container) {
		var x = e.pageX ? e.pageX : e.clientX + 
				document.body.scrollLeft + document.documentElement.scrollLeft,
			y = e.pageY ? e.pageY : e.clientY + 
					document.body.scrollTop + document.documentElement.scrollTop,
			pos = new L.Point(x, y);
			
		return (container ? 
					pos.subtract(L.DomUtil.getCumulativeOffset(container)) : pos);
	},
	
	getWheelDelta: function(e) {
		var delta = 0;
		if (e.wheelDelta) { delta = e.wheelDelta/120; }
			if (e.detail) { delta = -e.detail/3; }
			return delta;
	}
};

