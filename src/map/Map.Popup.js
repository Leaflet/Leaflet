
L.Map.include({
	openPopup: function(popup) {
		this._popup = popup;
		this.addLayer(popup);
	},
	
	closePopup: function() {
		if (this._popup) {
			this.removeLayer(this._popup);
		}
	}
});