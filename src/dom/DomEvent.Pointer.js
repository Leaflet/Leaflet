import * as DomEvent from './DomEvent';
import * as Browser from '../core/Browser';

/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */


var POINTER_DOWN =   Browser.msPointer ? 'MSPointerDown'   : 'pointerdown';
var POINTER_MOVE =   Browser.msPointer ? 'MSPointerMove'   : 'pointermove';
var POINTER_UP =     Browser.msPointer ? 'MSPointerUp'     : 'pointerup';
var POINTER_CANCEL = Browser.msPointer ? 'MSPointerCancel' : 'pointercancel';

var _pointers = {};
var _pointerDocListener = false;

// Provides a touch events wrapper for (ms)pointer events.
// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

export function addPointerListener(obj, type, handler) {
	if (type === 'touchstart') {
		_addPointerStart(obj, type, handler);

	} else if (type === 'touchmove') {
		_addPointerMove(obj, type, handler);

	} else if (type === 'touchend') {
		_addPointerEnd(obj, type, handler);

	} else if (type === 'touchcancel') {
		_addPointerCancel(obj, type, handler);
	}

	return this;
}

export function removePointerListener(obj, type, handler) {
	handler = handler[type];

	if (type === 'touchstart') {
		obj.removeEventListener(POINTER_DOWN, handler, false);

	} else if (type === 'touchmove') {
		obj.removeEventListener(POINTER_MOVE, handler, false);

	} else if (type === 'touchend') {
		obj.removeEventListener(POINTER_UP, handler, false);

	} else if (type === 'touchcancel') {
		obj.removeEventListener(POINTER_CANCEL, handler, false);
	}

	return this;
}

function _addPointerStart(obj, type, handler) {
	handler[type] = function (e) {
		// IE10 specific: MsTouch needs preventDefault. See #2000
		if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
			DomEvent.preventDefault(e);
		}

		_handlePointer(e, handler);
	};

	obj.addEventListener(POINTER_DOWN, handler[type], false);

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
	for (var i in _pointers) {
		e.touches.push(_pointers[i]);
	}
	e.changedTouches = [e];

	handler(e);
}

function _addPointerMove(obj, type, handler) {
	handler[type] = function (e) {
		// don't fire touch moves when mouse isn't down
		if ((e.pointerType === (e.MSPOINTER_TYPE_MOUSE || 'mouse')) && e.buttons === 0) {
			return;
		}

		_handlePointer(e, handler);
	};

	obj.addEventListener(POINTER_MOVE, handler[type], false);
}

function _addPointerEnd(obj, type, handler) {
	handler[type] = function (e) {
		_handlePointer(e, handler);
	};

	obj.addEventListener(POINTER_UP, handler[type], false);
}

function _addPointerCancel(obj, type, handler) {
	handler[type] = function (e) {
		_handlePointer(e, handler);
	};

	obj.addEventListener(POINTER_CANCEL, handler[type], false);
}
