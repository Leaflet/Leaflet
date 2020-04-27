import * as Browser from '../core/Browser';

/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

var _touchstart = Browser.msPointer ? 'MSPointerDown' : Browser.pointer ? 'pointerdown' : 'touchstart';
var _touchend = Browser.msPointer ? 'MSPointerUp' : Browser.pointer ? 'pointerup' : 'touchend';
var _pre = '_leaflet_';

// inspired by Zepto touch code by Thomas Fuchs
export function addDoubleTapListener(obj, handler, id) {
	var last, touch,
	    doubleTap = false,
	    delay = 250;

	function onTouchStart(e) {

		if (Browser.pointer) {
			if (!e.isPrimary) { return; }
			if (e.pointerType === 'mouse') { return; } // mouse fires native dblclick
		} else if (e.touches.length > 1) {
			return;
		}

		var now = Date.now(),
		    delta = now - (last || now);

		touch = e.touches ? e.touches[0] : e;
		doubleTap = (delta > 0 && delta <= delay);
		last = now;
	}

	function onTouchEnd(e) {
		if (doubleTap && !touch.cancelBubble) {
			if (Browser.pointer) {
				if (e.pointerType === 'mouse') { return; }
				// work around .type being readonly with MSPointer* events
				var newTouch = {},
				    prop, i;

				for (i in touch) {
					prop = touch[i];
					newTouch[i] = prop && prop.bind ? prop.bind(touch) : prop;
				}
				touch = newTouch;
			}
			touch.type = 'dblclick';
			touch.button = 0;
			handler(touch);
			last = null;
		}
	}

	obj[_pre + _touchstart + id] = onTouchStart;
	obj[_pre + _touchend + id] = onTouchEnd;
	obj[_pre + 'dblclick' + id] = handler;

	obj.addEventListener(_touchstart, onTouchStart, Browser.passiveEvents ? {passive: false} : false);
	obj.addEventListener(_touchend, onTouchEnd, Browser.passiveEvents ? {passive: false} : false);

	// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
	// the browser doesn't fire touchend/pointerup events but does fire
	// native dblclicks. See #4127.
	// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
	obj.addEventListener('dblclick', handler, false);

	return this;
}

export function removeDoubleTapListener(obj, id) {
	var touchstart = obj[_pre + _touchstart + id],
	    touchend = obj[_pre + _touchend + id],
	    dblclick = obj[_pre + 'dblclick' + id];

	obj.removeEventListener(_touchstart, touchstart, Browser.passiveEvents ? {passive: false} : false);
	obj.removeEventListener(_touchend, touchend, Browser.passiveEvents ? {passive: false} : false);
	obj.removeEventListener('dblclick', dblclick, false);

	return this;
}
