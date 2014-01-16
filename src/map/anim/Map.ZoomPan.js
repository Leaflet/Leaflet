
L.Map.include({
	zoomPanTo: function (center, targetZoom) {

		var from = this.project(this.getCenter()),
		    to = this.project(center),
		    u1 = to.distanceTo(from),
		    size = this.getSize(),
		    w0 = Math.max(size.x, size.y),
		    w1 = w0 * this.getZoomScale(this._zoom) / this.getZoomScale(targetZoom),
		    rho = 1.42,
		    rho2 = rho * rho;

		function r(i) {
			var b = (w1 * w1 - w0 * w0 + (i ? -1 : 1) * rho2 * rho2 * u1 * u1) / (2 * (i ? w1 : w0) * rho2 * u1);
			return Math.log(Math.sqrt(b * b + 1) - b);
		}

		var r0 = r(0);

		function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
		function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
		function tanh(n) { return sinh(n) / cosh(n); }

		function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
		function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

		function step(s) {
			var center = this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1))),
			    zoom = this.getScaleZoom(this.getZoomScale(this._zoom) * w0 / w(s));

			this._animateZoom(center, zoom);
		}

		function easeOut(t) { return 1 - Math.pow(1 - t, 2); }
		function now() { return (window.performance || Date).now(); }

		var start = now(),
		    S = (r(1) - r0) / rho,
		    duration = 1000 * S;

		function frame() {
			var t = (now() - start) / duration;

			if (t <= 1) {
				step.call(this, easeOut(t) * S);
				L.Util.requestAnimFrame(frame, this);
			} else {
				step.call(this, S, true);
				this._resetView(center, targetZoom, true, true);
			}
		}

		this.fire('zoomstart');
		frame.call(this);
	}
});
