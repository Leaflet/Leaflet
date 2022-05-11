import * as DomEvent from './DomEvent';

/*
 * Extends the event handling code with double tap support for mobile browsers.
 *
 * Note: currently most browsers fire native dblclick, with only a few exceptions
 * (see https://github.com/Leaflet/Leaflet/issues/7012#issuecomment-595087386)
 */

function makeDblclick(event) {
	// in modern browsers `type` cannot be just overridden:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only
	var newEvent = {},
	    prop, i;
	for (i in event) {
		prop = event[i];
		newEvent[i] = prop && prop.bind ? prop.bind(event) : prop;
	}
	event = newEvent;
	newEvent.type = 'dblclick';
	newEvent.detail = 2;
	newEvent.isTrusted = false;
	newEvent._simulated = true; // for debug purposes
	return newEvent;
}

var delay = 200;
export function addDoubleTapListener(obj, handler) {
	// Most browsers handle double tap natively
	obj.addEventListener('dblclick', handler);

	// On some platforms the browser doesn't fire native dblclicks for touch events.
	// It seems that in all such cases `detail` property of `click` event is always `1`.
	// So here we rely on that fact to avoid excessive 'dblclick' simulation when not needed.
	var last = 0,
	    detail;
	function simDblclick(e) {
		if (e.detail !== 1) {
			detail = e.detail; // keep in sync to avoid false dblclick in some cases
			return;
		}

		if (e.pointerType === 'mouse' ||
			(e.sourceCapabilities && !e.sourceCapabilities.firesTouchEvents)) {

			return;
		}

		// When clicking on an <input>, the browser generates a click on its
		// <label> (and vice versa) triggering two clicks in quick succession.
		// This ignores clicks on elements which are a label with a 'for'
		// attribute (or children of such a label), but not children of
		// a <input>.
		var path = DomEvent.getPropagationPath(e);
		if (path.some(function (el) {
			return el instanceof HTMLLabelElement && el.attributes.for;
		}) &&
			!path.some(function (el) {
				return (
					el instanceof HTMLInputElement ||
					el instanceof HTMLSelectElement
				);
			})
		) {
			return;
		}

		var now = Date.now();
		if (now - last <= delay) {
			detail++;
			if (detail === 2) {
				handler(makeDblclick(e));
			}
		} else {
			detail = 1;
		}
		last = now;
	}

	obj.addEventListener('click', simDblclick);

	return {
		dblclick: handler,
		simDblclick: simDblclick
	};
}

export function removeDoubleTapListener(obj, handlers) {
	obj.removeEventListener('dblclick', handlers.dblclick);
	obj.removeEventListener('click', handlers.simDblclick);
}
