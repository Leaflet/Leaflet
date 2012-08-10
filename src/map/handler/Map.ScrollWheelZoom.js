/*
 * L.Handler.ScrollWheelZoom is used internally by L.Map to enable mouse scroll wheel zooming on the map.
 */

L.Map.mergeOptions({
	scrollWheelZoom: !L.Browser.touch
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

		clearTimeout(this._timer);
		this._timer = setTimeout(L.Util.bind(this._performZoom, this), 40);

		L.DomEvent.preventDefault(e);
	},

	_performZoom: function () {
		var map = this._map,
			delta = Math.round(this._delta),
			zoom = map.getZoom();

		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;

		if (!delta) { return; }

		var newZoom = zoom + delta,
			newCenter = this._getCenterForScrollWheelZoom(this._lastMousePos, newZoom);

		map.setView(newCenter, newZoom);
	},

	_getCenterForScrollWheelZoom: function (mousePos, newZoom) {
		var map = this._map,
			scale = map.getZoomScale(newZoom),
			viewHalf = map.getSize().divideBy(2),
			centerOffset = mousePos.subtract(viewHalf).multiplyBy(1 - 1 / scale),
			newCenterPoint = map._getTopLeftPoint().add(viewHalf).add(centerOffset);

		return map.unproject(newCenterPoint);
	}
});

L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);
