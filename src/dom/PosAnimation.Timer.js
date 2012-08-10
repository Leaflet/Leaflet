/*
 * L.PosAnimation fallback implementation that powers Leaflet pan animations
 * in browsers that don't support CSS3 Transitions
 */

L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.Class.extend({
	includes: L.Mixin.Events,

	run: function (el, newPos, duration) {
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._duration = duration;

		this._startPos = L.DomUtil.getPosition(el);
		this._offset = newPos.subtract(this._startPos);
		this._startTime = +new Date();

		this.fire('start');

		this._animate();
	},

	stop: function () {
		if (!this._inProgress) { return; }

		this._step();
		this._complete();
	},

	_animate: function () {
		this._animId = L.Util.requestAnimFrame(this._animate, this, false, this._el);
		this._step();
	},

	_step: function () {
		var elapsed = (+new Date()) - this._startTime,
			duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._easeOut(elapsed / duration));
		} else {
			this._runFrame(1);
			this._complete();
		}
	},

	_runFrame: function (progress) {
		var pos = this._startPos.add(this._offset.multiplyBy(progress));
		L.DomUtil.setPosition(this._el, pos);
		this.fire('step');
	},

	_complete: function () {
		L.Util.cancelAnimFrame(this._animId);
		this.fire('end');
		this._inProgress = false;
	},

	_easeOut: function (t) {
		return t * (2 - t);
	}
});
