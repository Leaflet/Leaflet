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
		this.setView(e.latlng, this._zoom + 1);
	}
});

L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);
