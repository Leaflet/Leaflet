/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

L.Map.mergeOptions({
	scrollWheelZoom: true
});

L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
		this._delta = 0;
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll);
	},

	_onWheelScroll: function (e) {
		var delta = L.DomEvent.getWheelDelta(e);

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(40 - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.bind(this._performZoom, this), left);

		L.DomEvent.preventDefault(e);
		L.DomEvent.stopPropagation(e);
	},

	_performZoom: function () {
		var map = this._map,
		    delta = this._delta,
		    zoom = map.getZoom();

		delta = delta > 0 ? Math.ceil(delta) : Math.round(delta);
		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;

		this._startTime = null;

		if (!delta) { return; }

		var newZoom = zoom + delta,
		    newCenter = this._getCenterForScrollWheelZoom(newZoom);

		map.setView(newCenter, newZoom);
	},

	_getCenterForScrollWheelZoom: function (newZoom) {
		var map = this._map,
		    scale = map.getZoomScale(newZoom),
		    viewHalf = map.getSize()._divideBy(2),
		    centerOffset = this._lastMousePos._subtract(viewHalf)._multiplyBy(1 - 1 / scale),
		    newCenterPoint = map._getTopLeftPoint()._add(viewHalf)._add(centerOffset);

		return map.unproject(newCenterPoint);
	}
});

L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);
