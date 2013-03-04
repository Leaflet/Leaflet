/*
 * Extends L.Map to handle panning animations.
 */

L.Map.include({

	setView: function (center, zoom, forceReset) {

		zoom = this._limitZoom(zoom);
		center = L.latLng(center);

		if (this._panAnim) {
			this._panAnim.stop();
		}

		var zoomChanged = (this._zoom !== zoom),
			canBeAnimated = this._loaded && !forceReset && !!this._layers;

		if (canBeAnimated) {

			// try animating pan or zoom
			var animated = zoomChanged ?
				this.options.zoomAnimation && this._animateZoomIfClose && this._animateZoomIfClose(center, zoom) :
				this._animatePanIfClose(center);

			if (animated) {
				// prevent resize handler call, the view will refresh after animation anyway
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// animation didn't start, just reset the map view
		this._resetView(center, zoom);

		return this;
	},

	panBy: function (offset, duration, easeLinearity, noMoveStart) {
		offset = L.point(offset).round();

		// TODO add options instead of arguments to setView/panTo/panBy/etc.

		if (!offset.x && !offset.y) {
			return this;
		}

		if (!this._panAnim) {
			this._panAnim = new L.PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		// don't fire movestart if animating inertia
		if (!noMoveStart) {
			this.fire('movestart');
		}

		L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

		var newPos = this._getMapPanePos().subtract(offset);
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

	_animatePanIfClose: function (center) {
		// difference between the new and current centers in pixels
		var offset = this._getCenterOffset(center)._floor();

		if (!this.getSize().contains(offset)) { return false; }

		this.panBy(offset);
		return true;
	}
});
