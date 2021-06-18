import * as DomEvent from './DomEvent';
import * as Util from '../core/Util';
import * as Browser from '../core/Browser';

/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */


const POINTER_DOWN =   Browser.msPointer ? 'MSPointerDown'   : 'pointerdown';
const POINTER_MOVE =   Browser.msPointer ? 'MSPointerMove'   : 'pointermove';
const POINTER_UP =     Browser.msPointer ? 'MSPointerUp'     : 'pointerup';
const POINTER_CANCEL = Browser.msPointer ? 'MSPointerCancel' : 'pointercancel';

const _pointers = {};
const _pointerDocListener = false;

// Provides a touch events wrapper for (ms)pointer events.
// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

export function addPointerListener(obj, type, handler, id) {
	if (type === 'touchstart') {
		return _addPointerStart(obj, handler, id);

	} else if (type === 'touchmove') {
		return _addPointerMove(obj, handler, id);

	} else if (type === 'touchend') {
		return _addPointerEnd(obj, handler, id);
	}

	return;
}

export function removePointerListener(obj, type, id) {
	const handler = obj['_leaflet_' + type + id];

	if (type === 'touchstart') {
		return obj.removeEventListener(POINTER_DOWN, handler, false);

	} else if (type === 'touchmove') {
		return obj.removeEventListener(POINTER_MOVE, handler, false);

	} else if (type === 'touchend') {
		obj.removeEventListener(POINTER_UP, handler, false);
		return obj.removeEventListener(POINTER_CANCEL, handler, false);
	}

	return;
}

function _addPointerStart(obj, handler, id) {
	const onDown = Util.bind(function (e) {
		// IE10 specific: MsTouch needs preventDefault. See #2000
		if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
			DomEvent.preventDefault(e);
		}

		_handlePointer(e, handler);
	});

	obj['_leaflet_touchstart' + id] = onDown;
	obj.addEventListener(POINTER_DOWN, onDown, false);

	// need to keep track of what pointers and how many are active to provide e.touches emulation
	if (!_pointerDocListener) {
		// we listen document as any drags that end by moving the touch off the screen get fired there
		document.addEventListener(POINTER_DOWN, _globalPointerDown, true);
		document.addEventListener(POINTER_MOVE, _globalPointerMove, true);
		document.addEventListener(POINTER_UP, _globalPointerUp, true);
		document.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

		_pointerDocListener = true;
	}
}

function _globalPointerDown(e) {
	_pointers[e.pointerId] = e;
}

function _globalPointerMove(e) {
	if (_pointers[e.pointerId]) {
		_pointers[e.pointerId] = e;
	}
}

function _globalPointerUp(e) {
	delete _pointers[e.pointerId];
}

function _handlePointer(e, handler) {
	e.touches = [];
	for (const i in _pointers) {
		e.touches.push(_pointers[i]);
	}
	e.changedTouches = [e];

	handler(e);
}

function _addPointerMove(obj, handler, id) {
	const onMove = function (e) {
		// don't fire touch moves when mouse isn't down
		if ((e.pointerType === (e.MSPOINTER_TYPE_MOUSE || 'mouse')) && e.buttons === 0) {
			return;
		}

		_handlePointer(e, handler);
	};

	obj['_leaflet_touchmove' + id] = onMove;
	obj.addEventListener(POINTER_MOVE, onMove, false);
}

function _addPointerEnd(obj, handler, id) {
	const onUp = function (e) {
		_handlePointer(e, handler);
	};

	obj['_leaflet_touchend' + id] = onUp;
	obj.addEventListener(POINTER_UP, onUp, false);
	obj.addEventListener(POINTER_CANCEL, onUp, false);
}
