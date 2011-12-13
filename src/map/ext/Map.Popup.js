
L.Map.include({
	openPopup: function (popup) {
		this.closePopup();
		this._popup = popup;
		this.addLayer(popup);
		this.fire('popupopen', { popup: this._popup });
	
		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this.removeLayer(this._popup);
			this.fire('popupclose', { popup: this._popup });
			this._popup = null;
		}
		return this;
	}
});
