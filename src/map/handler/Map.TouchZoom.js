/*
 * L.Handler.TouchZoom is used internally by L.Map to add touch-zooming on Webkit-powered mobile browsers.
 */

L.Map.TouchZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.addListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		if (!e.touches || e.touches.length !== 2 || this._map._animatingZoom) {
			return;
		}

		var p1 = this._map.mouseEventToLayerPoint(e.touches[0]),
			p2 = this._map.mouseEventToLayerPoint(e.touches[1]),
			viewCenter = this._map.containerPointToLayerPoint(this._map.getSize().divideBy(2));

		this._startCenter = p1.add(p2).divideBy(2, true);
		this._startDist = p1.distanceTo(p2);
		//this._startTransform = this._map._mapPane.style.webkitTransform;

		this._moved = false;
		this._zooming = true;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		L.DomEvent.addListener(document, 'touchmove', this._onTouchMove, this);
		L.DomEvent.addListener(document, 'touchend', this._onTouchEnd, this);

		L.DomEvent.preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2) {
			return;
		}

		if (!this._moved) {
			this._map._mapPane.className += ' leaflet-zoom-anim';

			this._map
				.fire('zoomstart')
				.fire('movestart')
				._prepareTileBg();

			this._moved = true;
		}

		var p1 = this._map.mouseEventToLayerPoint(e.touches[0]),
			p2 = this._map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1.add(p2).divideBy(2, true).subtract(this._startCenter);

		// Used 2 translates instead of transform-origin because of a very strange bug -
		// it didn't count the origin on the first touch-zoom but worked correctly afterwards

		this._map._tileBg.style.webkitTransform = [
            L.DomUtil.getTranslateString(this._delta),
            L.DomUtil.getScaleString(this._scale, this._startCenter)
        ].join(" ");

		L.DomEvent.preventDefault(e);
	},

	_onTouchEnd: function (e) {
		if (!this._moved || !this._zooming) {
			return;
		}
		this._zooming = false;

		var oldZoom = this._map.getZoom(),
			floatZoomDelta = Math.log(this._scale) / Math.LN2,
			roundZoomDelta = (floatZoomDelta > 0 ? Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),
			zoom = this._map._limitZoom(oldZoom + roundZoomDelta),
			zoomDelta = zoom - oldZoom,
			centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale),
			centerPoint = this._map.getPixelOrigin().add(this._startCenter).add(centerOffset),
			center = this._map.unproject(centerPoint);

		L.DomEvent.removeListener(document, 'touchmove', this._onTouchMove);
		L.DomEvent.removeListener(document, 'touchend', this._onTouchEnd);

		var finalScale = Math.pow(2, zoomDelta);

		this._map._runAnimation(center, zoom, finalScale / this._scale, this._startCenter.add(centerOffset));
	}
});
