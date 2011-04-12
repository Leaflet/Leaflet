/*
 * Popup extension to L.Path (polylines, polygons, circles), adding bindPopup method. 
 */

L.Path.include({
	bindPopup: function(content, options) {
		this._popup = new L.Popup(options);
		this._popup.setContent(content);
		this.on('click', this._openPopup, this);
		return this;
	},
	
	_openPopup: function(e) {
		this._popup.setLatLng(e.latlng);
		this._map.openPopup(this._popup);
	}	
});