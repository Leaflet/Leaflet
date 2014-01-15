
L.Map.include({
	zoomPanTo: function (center, targetZoom, options) {
		var start = +new Date(),
		    duration = 1000,
		    from = this.project(this.getCenter()),
		    offset = this.project(center).subtract(from);

		this.fire('zoomstart');

		function step(t) {
			var center = this.unproject(from.add(offset.multiplyBy(t))),
				zoom = this._zoom + t * (targetZoom - this._zoom);

			this._animateZoom(center, zoom);
		}

		function frame() {
			var t = ((+new Date()) - start) / duration; // linear easing

			if (t < 1) {
				step.call(this, t);
				L.Util.requestAnimFrame(frame, this);
			} else {
				step.call(this, 1);
				this._resetView(center, targetZoom, true, true);
			}
		}

		L.Util.requestAnimFrame(frame, this);
	}
})
