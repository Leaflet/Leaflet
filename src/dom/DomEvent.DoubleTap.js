/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

function makeDblclick(event) {
	// work around .type being readonly with Pointer* events
	if (!(event instanceof MouseEvent)) {
		var newEvent = {},
		    prop, i;
		for (i in event) {
			prop = event[i];
			newEvent[i] = prop && prop.bind ? prop.bind(event) : prop;
		}
		event = newEvent;
	}
	event._simulated = true;
	event.type = 'dblclick';
	return event;
}

var delay = 250;
export function addDoubleTapListener(obj, handler) {
	// Most browsers handle double tap natively
	obj.addEventListener('dblclick', handler);

	// On some platforms the browser doesn't fire native dblclicks for touch events.
	// It seems that in all such cases `detail` property of `click` event is always `1`.
	// So here we rely on that fact to avoid excessive 'dblclick' simulation when not needed.
	var last;
	handler.simDblclick = function (e) {
		if (e.detail !== 1 || e.pointerType === 'mouse' ||
			(e.sourceCapabilities && !e.sourceCapabilities.firesTouchEvents)) { return; }
		var now = Date.now(),
		    delta = now - (last || now);

		if (delta > 0 && delta <= delay) {
			handler(makeDblclick(e));
		}
		last = now;
	};
	obj.addEventListener('click', handler.simDblclick);

	return this;
}

export function removeDoubleTapListener(obj, handler) {
	obj.removeEventListener('dblclick', handler);
	obj.removeEventListener('click', handler.simDblclick);

	return this;
}
