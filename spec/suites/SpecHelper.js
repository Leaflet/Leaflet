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
	this.once(document.elementFromPoint(x, y), L.Util.extend({
		type: what,
		clientX: x,
		clientY: y,
		screenX: x,
		screenY: y,
		which: 1,
		button: 0
	}, props || {}));
};

happen.makeEvent = (function (makeEvent) {
	return function (o) {
		var evt = makeEvent(o);
		if (o.type.substring(0, 7) === 'pointer') {
			evt.pointerId = o.pointerId;
			evt.pointerType = o.pointerType;
		} else if (o.type.indexOf('wheel') > -1) {
			evt.deltaY = evt.deltaY || o.deltaY;
			evt.deltaMode = evt.deltaMode || o.deltaMode;
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

var touchEventType = L.Browser.touchNative ? 'touch' : 'pointer'; // eslint-disable-line no-unused-vars
// Note: this override is needed to workaround prosthetic-hand fail,
//       see https://github.com/Leaflet/prosthetic-hand/issues/14

function createContainer(width, height) { /* eslint-disable-line no-unused-vars */
	width = width ? width : '400px';
	height = height ? height : '400px';
	var container = document.createElement("div");
	container.style.position = 'absolute';
	container.style.top = '0px';
	container.style.left = '0px';
	container.style.height = height;
	container.style.width = width;
	container.style.opacity = '0.4';
	document.body.appendChild(container);

	return container;
}

function removeMapContainer(map, container) { /* eslint-disable-line no-unused-vars */
	if (map) {
		map.remove();
	}
	if (container) {
		document.body.removeChild(container);
	}
}

console.log('L.Browser.pointer', L.Browser.pointer);
console.log('L.Browser.touchNative', L.Browser.touchNative);
