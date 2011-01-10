
L.Map.include({
	openPopup: function(latlng, content, offset) {
		if (!this._popup) {
			this._popup = new L.Popup();
			
			if (this.options.closePopupOnClick) {
				this.on('click', this.closePopup, this);
			}
		} else {
			this.removeLayer(this._popup);
		}
		this._popup.setData(latlng, content, offset);
		
		this.addLayer(this._popup);
	},
	
	closePopup: function() {
		if (this._popup) {
			this.removeLayer(this._popup);
		}
	}
});