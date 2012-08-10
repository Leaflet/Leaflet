/*
 * L.PosAnimation is used by Leaflet internally for pan animations
 */

L.PosAnimation = L.Class.extend({
	includes: L.Mixin.Events,

	run: function (el, newPos, duration) {
		this.stop();

		this._el = el;
		this._inProgress = true;

		this.fire('start');

		el.style[L.DomUtil.TRANSITION] = 'all ' + duration + 's ease-out';

		L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
		L.DomUtil.setPosition(el, newPos);

		// Chrome flickers for some reason if you don't do this
		L.Util.falseFn(el.offsetWidth);
	},

	stop: function () {
		if (!this._inProgress) { return; }

		var pos = this._getPos();

		L.DomUtil.setPosition(this._el, pos);
		this._onTransitionEnd();
	},

	_transformRe: /(-?[\d\.]+), (-?[\d\.]+)\)/,

	_getPos: function () {
		var left, top, matches,
			el = this._el,
			style = window.getComputedStyle(el);

		if (L.Browser.any3d) {
			matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
			left = parseFloat(matches[1]);
			top  = parseFloat(matches[2]);
		} else {
			left = parseFloat(style.left);
			top  = parseFloat(style.top);
		}

		return new L.Point(left, top, true);
	},

	_onTransitionEnd: function () {
		L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);

		if (!this._inProgress) { return; }
		this._inProgress = false;

		this._el.style[L.DomUtil.TRANSITION] = '';

		this.fire('end');
	}

});
