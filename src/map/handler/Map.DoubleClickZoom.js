/*
 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

L.Map.mergeOptions({
	doubleClickZoom: true
});

L.Map.DoubleClickZoom = L.Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick);
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick);
	},

	_onDoubleClick: function (e) {
		var map = this,
		scale = map.getZoomScale(map._zoom + 1),
		viewHalf = map.getSize()._divideBy(2),
		centerOffset = e.containerPoint._subtract(viewHalf)._multiplyBy(1 - 1 / scale),
		newCenterPoint = map._getTopLeftPoint()._add(viewHalf)._add(centerOffset);
		map.setView(map.unproject(newCenterPoint), map._zoom + 1);
	}
});

L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);
