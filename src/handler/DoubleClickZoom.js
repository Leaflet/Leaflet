/*
 * L.Handler.DoubleClickZoom is used internally by L.Map to add double-click zooming.
 */

L.Handler.DoubleClickZoom = L.Handler.extend({
	enable: function() {
		if (this._enabled) { return; }
		this._map.on('dblclick', this._onDoubleClick, this._map);
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		this._map.off('dblclick', this._onDoubleClick, this._map);
		this._enabled = false;
	},
	
	_onDoubleClick: function(e) {
		this.setView(e.latlng, this._zoom + 1);
	}
});