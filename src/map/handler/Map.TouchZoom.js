/*
 * L.Handler.TouchZoom is used internally by L.Map to add touch-zooming on Webkit-powered mobile browsers.
 */

L.Map.mergeOptions({
	touchZoom: L.Browser.touch && !L.Browser.android
});

L.Map.TouchZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.addListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;

		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			p2 = map.mouseEventToLayerPoint(e.touches[1]),
			viewCenter = map.containerPointToLayerPoint(map.getSize().divideBy(2));

		this._startCenter = p1.add(p2).divideBy(2, true);
		this._startDist = p1.distanceTo(p2);

		this._moved = false;
		this._zooming = true;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		L.DomEvent
			.addListener(document, 'touchmove', this._onTouchMove, this)
			.addListener(document, 'touchend', this._onTouchEnd, this);

		L.DomEvent.preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2) { return; }

		var map = this._map;

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			p2 = map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1.add(p2).divideBy(2, true).subtract(this._startCenter);

		if (this._scale === 1) { return; }

		if (!this._moved) {
			map._mapPane.className += ' leaflet-zoom-anim';

			map
				.fire('zoomstart')
				.fire('movestart')
				._prepareTileBg();

			this._moved = true;
		}

		// Used 2 translates instead of transform-origin because of a very strange bug -
		// it didn't count the origin on the first touch-zoom but worked correctly afterwards

		map._tileBg.style.webkitTransform =
			L.DomUtil.getTranslateString(this._delta) + ' ' +
            L.DomUtil.getScaleString(this._scale, this._startCenter);

		L.DomEvent.preventDefault(e);
	},

	_onTouchEnd: function (e) {
		if (!this._moved || !this._zooming) { return; }

		this._zooming = false;

		L.DomEvent
			.removeListener(document, 'touchmove', this._onTouchMove)
			.removeListener(document, 'touchend', this._onTouchEnd);

		var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale),
			centerPoint = this._map.getPixelOrigin().add(this._startCenter).add(centerOffset),
			center = this._map.unproject(centerPoint),

			oldZoom = this._map.getZoom(),
			floatZoomDelta = Math.log(this._scale) / Math.LN2,
			roundZoomDelta = (floatZoomDelta > 0 ? Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),
			zoom = this._map._limitZoom(oldZoom + roundZoomDelta),
			finalScale = Math.pow(2, zoom - oldZoom);

		this._map._runAnimation(center, zoom, finalScale / this._scale, this._startCenter.add(centerOffset));
	}
});

L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);