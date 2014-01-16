
L.Map.include({
	zoomPanTo: function (center, targetZoom) {

		var V = 3,
		    rho = 1.42,
		    rho2 = rho * rho;

		function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
		function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
		function tanh(n) { return sinh(n) / cosh(n); }

		var from = this.project(this.getCenter()),
		    to = this.project(center),
		    offset = to.subtract(from),
		    u1 = to.distanceTo(from),
		    size = this.getSize(),
		    w0 = Math.max(size.x, size.y),
		    w1 = w0 * this.getZoomScale(this._zoom) / this.getZoomScale(targetZoom);

		function r(i) {
			var b = (w1 * w1 - w0 * w0 + (i ? -1 : 1) * rho2 * rho2 * u1 * u1) / (2 * (i ? w1 : w0) * rho2 * u1);
			return Math.log(Math.sqrt(b * b + 1) - b);
		}

		var r0 = r(0),
		    S = (r(1) - r0) / rho;

		function w(s) { return w0 * cosh(r0) / cosh(r0 + rho * s); }
		function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

		var duration = 1000 * S / V;

		this.fire('zoomstart');

		function step(t) {
			var s = t * S,
			    zoom = this.getScaleZoom(this.getZoomScale(this._zoom) * w0 / w(s)),
			    center = this.unproject(from.add(offset.multiplyBy(u(s) / u1)));

			this._animateZoom(center, zoom);
		}

		var start = +new Date();

		function frame() {
			var t = ((+new Date()) - start) / duration; // linear easing

			if (t <= 1) {
				step.call(this, t);
				L.Util.requestAnimFrame(frame, this);
			} else {
				step.call(this, 1);
				this._resetView(center, targetZoom, true, true);
			}
		}

		frame.call(this);
	}
});
