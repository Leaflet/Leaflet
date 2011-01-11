
L.Marker.include({
	openPopup: function(content) {
		this._map.openPopup(this._latlng, content, this.options.icon.popupAnchor);
	},
	
	bindPopup: function(content) {
		this._popupContent = content;
		this.on('click', this._onMouseDown, this);
	},
	
	_onMouseDown: function() {
		this.openPopup(this._popupContent);
	}
});