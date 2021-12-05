/* eslint no-extend-native: 0 */
if (!Array.prototype.map) {
	Array.prototype.map = function (fun) {
		"use strict";

		if (this === undefined || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in t) {
				res[i] = fun.call(thisp, t[i], i, t);
			}
		}

		return res;
	};
}

expect.Assertion.prototype.near = function (expected, delta) {
	expected = L.point(expected);
	delta = delta || 1;
	expect(this.obj.x).to
		.be.within(expected.x - delta, expected.x + delta);
	expect(this.obj.y).to
		.be.within(expected.y - delta, expected.y + delta);
};

expect.Assertion.prototype.nearLatLng = function (expected, delta) {
	expected = L.latLng(expected);
	delta = delta || 1e-4;
	expect(this.obj.lat).to
		.be.within(expected.lat - delta, expected.lat + delta);
	expect(this.obj.lng).to
		.be.within(expected.lng - delta, expected.lng + delta);
};

happen.at = function (what, x, y, props) {
	var event = L.Util.extend({
		type: what,
		clientX: x,
		clientY: y,
		screenX: x,
		screenY: y,
		which: 1,
		button: 0
	}, props || {});

	if (what.indexOf('touch') === 0) {
		event.touches = [event];
		event.targetTouches = [event];
		event.changedTouches = [event];
	}

	this.once(document.elementFromPoint(x, y), event);
};

// Make inheritance bearable: clone one level of properties - copy from happen
function extend(child, parent) {
	for (var property in parent) {
		if (typeof child[property] == 'undefined') {
			child[property] = parent[property];
		}
	}
	return child;
}

happen.makeEvent = (function (makeEvent) {
	return function (o) {
		var evt;
		// touchcancel is not supported by happen
		if (o.type === 'touchcancel') {
			if (typeof document.createEvent === 'undefined' &&
				typeof document.createEventObject !== 'undefined') {
				evt = document.createEventObject();
				extend(evt, o);
			} else if (typeof document.createEvent !== 'undefined') {
				evt = document.createEvent('UIEvent');
				evt.initUIEvent(o.type, true, true, window, o.detail || 1);
				extend(evt, o);
			}
		} else {
			evt = makeEvent(o);
		}
		if (o.type.substring(0, 7) === 'pointer') {
			evt.pointerId = o.pointerId;
			evt.pointerType = o.pointerType;
		}
		return evt;
	};
})(happen.makeEvent);

// We'll want to skip a couple of things when in PhantomJS, due to lack of CSS animations
it.skipIfNo3d = L.Browser.any3d ? it : it.skip;

// Viceversa: some tests we want only to run in browsers without CSS animations.
it.skipIf3d = L.Browser.any3d ? it.skip : it;

// A couple of tests need the browser to be touch-capable
it.skipIfNotTouch = L.Browser.touch ? it : it.skip;
describe.skipIfNotTouch = L.Browser.touch ? describe : describe.skip;

// if the Browser has no native touch, we need to fire pointerevents but listen on the touchevents
var pointerToTouch = L.Browser.pointer && !L.Browser.touchNative;
var touchPointerMap = { // eslint-disable-line no-unused-vars
	touchstart: pointerToTouch ? 'pointerdown' : 'touchstart',
	touchmove: pointerToTouch ? 'pointermove' : 'touchmove',
	touchend: pointerToTouch ? 'pointerup' : 'touchend',
	touchcancel: pointerToTouch ? 'pointercancel' : 'touchcancel'
};

var touchEventType = L.Browser.touchNative ? 'touch' : 'pointer'; // eslint-disable-line no-unused-vars
// Note: this override is needed to workaround prosthetic-hand fail,
//       see https://github.com/Leaflet/prosthetic-hand/issues/14

console.log('L.Browser.pointer', L.Browser.pointer);
console.log('L.Browser.touchNative', L.Browser.touchNative);
