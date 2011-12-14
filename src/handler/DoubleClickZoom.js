/*
 * L.Handler.DoubleClickZoom is used internally by L.Map to add double-click zooming.
 */

L.Handler.DoubleClickZoom = L.Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick, this._map);
		// TODO remove 3d argument?
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick, this._map);
	},

	_onDoubleClick: function (e) {
		this.setView(e.latlng, this._zoom + 1);
	}
});
