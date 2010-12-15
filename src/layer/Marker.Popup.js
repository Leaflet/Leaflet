
L.Marker.include({
	bindPopup: function(content) {
		this._popupContent = content;
		this.on('click', this._onMarkerClick, this);
	},
	
	_onMarkerClick: function() {
		this._map.closePopup();
		this._map.openPopup(this._latlng, this._popupContent, this.options.icon.popupAnchor);
	}
});