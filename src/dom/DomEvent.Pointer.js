import {falseFn} from '../core/Util';

var POINTER_DOWN =   'pointerdown';
var POINTER_MOVE =   'pointermove';
var POINTER_UP =     'pointerup';
var POINTER_CANCEL = 'pointercancel';
var pEvent = {
	touchstart  : POINTER_DOWN,
	touchmove   : POINTER_MOVE,
	touchend    : POINTER_UP,
	touchcancel : POINTER_CANCEL
};
var handle = {
	touchstart  : _onPointerStart,
	touchmove   : _handlePointer,
	touchend    : _handlePointer,
	touchcancel : _handlePointer
};
var _pointers = {};
var _pointerDocListener = false;

// Provides a touch events wrapper for pointer events.
// ref https://www.w3.org/TR/pointerevents/

export function addPointerListener(obj, type, handler) {
	if (type === 'touchstart') {
		_addPointerDocListener();
	}
	if (!handle[type]) {
		console.warn('wrong event specified:', type);
		return falseFn;
	}
	handler = handle[type].bind(this, handler);
	obj.addEventListener(pEvent[type], handler, false);
	return handler;
}

export function removePointerListener(obj, type, handler) {
	if (!pEvent[type]) {
		console.warn('wrong event specified:', type);
		return;
	}
	obj.removeEventListener(pEvent[type], handler, false);
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

function _addPointerDocListener() {
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

function _handlePointer(handler, e) {
	if (e.pointerType === 'mouse') { return; }

	e.touches = [];
	for (var i in _pointers) {
		e.touches.push(_pointers[i]);
	}
	e.changedTouches = [e];

	handler(e);
}

function _onPointerStart(handler, e) {
	_handlePointer(handler, e);
}
