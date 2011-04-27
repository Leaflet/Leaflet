
L.Map.include({
	openPopup: function(popup) {
		this.closePopup();
		this._popup = popup;
		return this.addLayer(popup);
	},
	
	closePopup: function() {
		if (this._popup) {
			this.removeLayer(this._popup);
		}
		return this;
	}
});