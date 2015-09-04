if (!Array.prototype.map) {
	/*eslint no-extend-native:0*/
	Array.prototype.map = function (fun /*, thisp */) {
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
	delta = delta || 1;
	expect(this.obj.x).to
		.be.within(expected.x - delta, expected.x + delta);
	expect(this.obj.y).to
		.be.within(expected.y - delta, expected.y + delta);
};

expect.Assertion.prototype.nearLatLng = function (expected, delta) {
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
    }, props || {}));
};
happen.drag = function (fromX, fromY, toX, toY, then, duration) {
	happen.at('mousemove', fromX, fromY);
	happen.at('mousedown', fromX, fromY);
	var moveX = function () {
		if (fromX <= toX) {
			happen.at('mousemove', fromX++, fromY);
			window.setTimeout(moveX, 5);
		}
	};
	moveX();
	var moveY = function () {
		if (fromY <= toY) {
			happen.at('mousemove', fromX, fromY++);
			window.setTimeout(moveY, 5);
		}
	};
	moveY();
	window.setTimeout(function () {
		happen.at('mouseup', toX, toY);
		happen.at('click', toX, toY);
		if (then) { then(); }
	}, duration || 100);
};
