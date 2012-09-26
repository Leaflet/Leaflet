/*
 * L.Handler.TouchZoom is used internally by L.Map to add touch-zooming on Webkit-powered mobile browsers.
 */

L.Map.mergeOptions({
	touchZoom: ((L.Browser.touch && !L.Browser.android23) || L.Browser.msTouch)
});
L.Map.TouchZoom = L.Handler.extend({

	_msTouchActive : false,
	_msTouches : [],

	addHooks: function () {
		if (!L.Browser.msTouch) {
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
		} else {
			L.DomEvent.on(this._map._container, "MSPointerDown", this._translateMsDown, this);
			this._map._container.style.msTouchAction = 'none';
			this._msTouchActive = true;
		}
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;

		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			p2 = map.mouseEventToLayerPoint(e.touches[1]),
			viewCenter = map._getCenterLayerPoint(),
			currentZoom = map.getZoom();

		this._startCenter = p1.add(p2)._divideBy(2);
		this._startDist = p1.distanceTo(p2);

		this._moved = false;
		this._zooming = true;
		
		this._upperScaleLimit = Math.pow(2, map.getMaxZoom() - currentZoom);
		this._lowerScaleLimit = 1 / Math.pow(2, currentZoom - map.getMinZoom());

		this._centerOffset = viewCenter.subtract(this._startCenter);

		if (map._panAnim) {
			map._panAnim.stop();
		}

		if (!L.Browser.msTouch) {
			L.DomEvent
				.on(document, 'touchmove', this._onTouchMove, this)
				.on(document, 'touchend', this._onTouchEnd, this);
		}

		L.DomEvent.preventDefault(e);
	},

	_translateMsDown: function (e) {
		this._msTouches.push(e);
		e.preventDefault();
		e.stopPropagation();
		e.touches = this._msTouches;
		this._onTouchStart(e);
		if (this._msTouches.length === 1) {
			L.DomEvent.on(document, L.Draggable.MSPOINTERMOVE, this._translateMsMove, this);
			L.DomEvent.on(document, L.Draggable.MSPOINTERUP, this._translateMsEnd, this);
		}
	},

	_onTouchMove: function (e) {

		if (!e.touches || e.touches.length !== 2) { return; }

		var map = this._map;

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			p2 = map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);
		if (this._scale === 1) { return; }

		if (this._scale > this._upperScaleLimit) {
			this._scale = this._upperScaleLimit;
		}
		if (this._scale < this._lowerScaleLimit) {
			this._scale = this._lowerScaleLimit;
		}

		if (!this._moved) {
			L.DomUtil.addClass(map._mapPane, 'leaflet-zoom-anim leaflet-touching');

			map
				.fire('movestart')
				.fire('zoomstart')
				._prepareTileBg();

			this._moved = true;
		}

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updateOnMove, this, true, this._map._container);

		L.DomEvent.preventDefault(e);
	},

	_translateMsMove: function (e) {
		var i,
			max = this._msTouches.length;
		for (i = 0; i < max; i += 1) {
			if (this._msTouches[i].pointerId === e.pointerId) {
				this._msTouches[i] = e;
				break;
			}
		}
		e.touches = this._msTouches;
		this._onTouchMove(e);
	},

	_updateOnMove: function () {
		var map = this._map,
			origin = this._getScaleOrigin(),
			center = map.layerPointToLatLng(origin);

		map.fire('zoomanim', {
			center: center,
			zoom: map.getScaleZoom(this._scale)
		});

		// Used 2 translates instead of transform-origin because of a very strange bug -
		// it didn't count the origin on the first touch-zoom but worked correctly afterwards

		map._tileBg.style[L.DomUtil.TRANSFORM] =
			L.DomUtil.getTranslateString(this._delta) + ' ' +
			L.DomUtil.getScaleString(this._scale, this._startCenter);
	},

	_onTouchEnd: function (e) {
		if (!this._moved || !this._zooming) { return; }

		var map = this._map;

		this._zooming = false;
		L.DomUtil.removeClass(map._mapPane, 'leaflet-touching');
		if (!L.Browser.msTouch) {
			L.DomEvent
				.off(document, 'touchmove', this._onTouchMove)
				.off(document, 'touchend', this._onTouchEnd);
		}

		var origin = this._getScaleOrigin(),
			center = map.layerPointToLatLng(origin),

			oldZoom = map.getZoom(),
			floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
			roundZoomDelta = (floatZoomDelta > 0 ? Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),
			zoom = map._limitZoom(oldZoom + roundZoomDelta);

		map.fire('zoomanim', {
			center: center,
			zoom: zoom
		});

		map._runAnimation(center, zoom, map.getZoomScale(zoom) / this._scale, origin, true);
	},


	_translateMsEnd: function (e) {
		var i,
			max = this._msTouches.length;
		
		for (i = 0; i < max; i += 1) {
			if (this._msTouches[i].pointerId === e.pointerId) {
				this._msTouches.splice(i, 1);
				break;
			}
		}
		e.changedTouches = [e];
		this._onTouchEnd(e);
		if (this._msTouches.length === 0) {
			L.DomEvent.off(document, L.Draggable.MSPOINTERMOVE, this._translateMsMove);
			L.DomEvent.off(document, L.Draggable.MSPOINTERUP, this._translateMsEnd);
		}
	},

	_getScaleOrigin: function () {
		var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
		return this._startCenter.add(centerOffset);
	}
});
L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);
