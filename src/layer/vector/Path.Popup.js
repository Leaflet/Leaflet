/*
 * Popup extension to L.Path (polylines, polygons, circles), adding bindPopup method. 
 */

L.Path.include({
	bindPopup: function(content, options) {
		this._popup = new L.Popup(null, content, options);
		this.on('click', this._openPopup, this);
		return this;
	},
	
	_openPopup: function(e) {
		this._popup._latlng = e.position;
		if (this._popup._map) {
			this._popup._updatePosition();
		}

		this._map.closePopup();
		this._map.openPopup(this._popup);
	}	
});