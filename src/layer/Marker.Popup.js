
L.Marker.include({
	openPopup: function() {
		this._map.openPopup(this._latlng, this._popupContent, this.options.icon.popupAnchor);
		return this;
	},
	
	bindPopup: function(content) {
		this._popupContent = content;
		this.on('click', this.openPopup, this);
		return this;
	}
});