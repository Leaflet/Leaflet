/*
 * Extends L.Map to handle panning animations.
 */

L.Map.include({

	setView: function (center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);

		var zoomChanged = (this._zoom !== zoom);

		if (this._loaded && !forceReset && this._layers) {

			if (this._panAnim) {
				this._panAnim.stop();
			}

			var done = (zoomChanged ?
			        this._zoomToIfClose && this._zoomToIfClose(center, zoom) :
			        this._panByIfClose(center));

			// exit if animated pan or zoom started
			if (done) {
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// reset the map view
		this._resetView(center, zoom);

		return this;
	},

	panBy: function (offset, duration, easeLinearity) {
		offset = L.point(offset);

		if (!(offset.x || offset.y)) {
			return this;
		}

		if (!this._panAnim) {
			this._panAnim = new L.PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		this.fire('movestart');

		L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

		var newPos = L.DomUtil.getPosition(this._mapPane).subtract(offset)._round();
		this._panAnim.run(this._mapPane, newPos, duration || 0.25, easeLinearity);

		return this;
	},

	_onPanTransitionStep: function () {
		this.fire('move');
	},

	_onPanTransitionEnd: function () {
		L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
		this.fire('moveend');
	},

	_panByIfClose: function (center) {
		// difference between the new and current centers in pixels
		var offset = this._getCenterOffset(center)._floor();

		if (this._offsetIsWithinView(offset)) {
			this.panBy(offset);
			return true;
		}
		return false;
	},

	_offsetIsWithinView: function (offset, multiplyFactor) {
		var m = multiplyFactor || 1,
		    size = this.getSize();

		return (Math.abs(offset.x) <= size.x * m) &&
		       (Math.abs(offset.y) <= size.y * m);
	}
});
