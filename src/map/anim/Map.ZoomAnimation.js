/*
 * Extends L.Map to handle zoom animations.
 */

L.Map.mergeOptions({
	zoomAnimation: L.DomUtil.TRANSITION && !L.Browser.android23 && !L.Browser.mobileOpera
});

if (L.DomUtil.TRANSITION) {
	L.Map.addInitHook(function () {
		L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
	});
}

L.Map.include(!L.DomUtil.TRANSITION ? {} : {

	_zoomToIfClose: function (center, zoom) {

		if (this._animatingZoom) { return true; }

		if (!this.options.zoomAnimation) { return false; }

		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// if offset does not exceed half of the view
		if (!this._offsetIsWithinView(offset, 1)) { return false; }

		this
		    .fire('movestart')
		    .fire('zoomstart');

		var origin = this._getCenterLayerPoint().add(offset);

		this._animateZoom(center, zoom, origin, scale);

		return true;
	},

	_animateZoom: function (center, zoom, origin, scale, delta, backwards) {

		L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');

		this._animateToCenter = center;
		this._animateToZoom = zoom;
		this._animatingZoom = true;

		if (L.Draggable) {
			L.Draggable._disabled = true;
		}

		this.fire('zoomanim', {
			center: center,
			zoom: zoom,
			origin: origin,
			scale: scale,
			delta: delta,
			backwards: backwards
		});
	},

	_catchTransitionEnd: function () {
		if (this._animatingZoom) {
			this._onZoomTransitionEnd();
		}
	},

	_onZoomTransitionEnd: function () {

		L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');

		this._animatingZoom = false;
		this._resetView(this._animateToCenter, this._animateToZoom, true, true);

		if (L.Draggable) {
			L.Draggable._disabled = false;
		}
	}
});
