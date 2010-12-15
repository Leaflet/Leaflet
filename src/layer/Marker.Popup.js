
L.Marker.include({
	bindPopup: function(content) {
		this._popupContent = content;
		this.on('mousedown', this._onMouseDown, this);
	},
	
	_onMouseDown: function() {
		this._map.closePopup();
		this._map.openPopup(this._latlng, this._popupContent, this.options.icon.popupAnchor);
	}
});