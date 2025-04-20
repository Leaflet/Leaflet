import * as DomEvent from './DomEvent.js';

/*
 * Extends the event handling code with double tap support for mobile browsers.
 *
 * Note: currently most browsers fire native dblclick, with only a few exceptions
 * (see https://github.com/Leaflet/Leaflet/issues/7012#issuecomment-595087386)
 */

function makeDblclick(ev) {
	let init = {
		// EventInit
		bubbles: ev.bubbles,
		cancelable: ev.cancelable,
		composed: ev.composed,

		// UIEventInit
		detail: 2,
		view: ev.view,

		// mouseEventInit
		screenX: ev.screenX,
		screenY: ev.screenY,
		clientX: ev.clientX,
		clientY: ev.clientY,
		ctrlKey: ev.ctrlKey,
		shiftKey: ev.shiftKey,
		altKey: ev.altKey,
		metaKey: ev.metaKey,
		button: ev.button,
		buttons: ev.buttons,
		relatedTarget: ev.relatedTarget,
		region: ev.region,
	};

	let newEvent;
	// The `click` event received should be a PointerEvent - but some
	// Firefox versions still use MouseEvent.
	if (ev instanceof PointerEvent) {
		init = {
			...init,
			pointerId: ev.pointerId,
			width: ev.width,
			height: ev.height,
			pressure: ev.pressure,
			tangentialPressure: ev.tangentialPressure,
			tiltX: ev.tiltX,
			tiltY: ev.tiltY,
			twist: ev.twist,
			pointerType: ev.pointerType,
			isPrimary: ev.isPrimary,
		};
		newEvent = new PointerEvent('dblclick', init);
	} else {
		newEvent = new MouseEvent('dblclick', init);
	}
	return newEvent;
}

const delay = 200;
export function addDoubleTapListener(obj, handler) {
	// Most browsers handle double tap natively
	obj.addEventListener('dblclick', handler);

	// On some platforms the browser doesn't fire native dblclicks for touch events.
	// It seems that in all such cases `detail` property of `click` event is always `1`.
	// So here we rely on that fact to avoid excessive 'dblclick' simulation when not needed.
	let last = 0,
	    detail;
	function simDblclick(ev) {
		if (ev.detail !== 1) {
			detail = ev.detail; // keep in sync to avoid false dblclick in some cases
			return;
		}

		if (ev.pointerType === 'mouse' ||
			(ev.sourceCapabilities && !ev.sourceCapabilities.firesTouchEvents)) {

			return;
		}

		// When clicking on an <input>, the browser generates a click on its
		// <label> (and vice versa) triggering two clicks in quick succession.
		// This ignores clicks on elements which are a label with a 'for'
		// attribute (or children of such a label), but not children of
		// a <input>.
		const path = DomEvent.getPropagationPath(ev);
		if (path.some(el => el instanceof HTMLLabelElement && el.attributes.for) &&
			!path.some(el => (
				el instanceof HTMLInputElement ||
					el instanceof HTMLSelectElement
			))
		) {
			return;
		}

		const now = Date.now();
		if (now - last <= delay) {
			detail++;
			if (detail === 2) {
				ev.target.dispatchEvent(makeDblclick(ev));
			}
		} else {
			detail = 1;
		}
		last = now;
	}

	obj.addEventListener('click', simDblclick);

	return {
		dblclick: handler,
		simDblclick
	};
}

export function removeDoubleTapListener(obj, handlers) {
	obj.removeEventListener('dblclick', handlers.dblclick);
	obj.removeEventListener('click', handlers.simDblclick);
}
