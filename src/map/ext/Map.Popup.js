
L.Map.include({
	openPopup: function (popup) {
		this.closePopup();

		this._popup = popup;

		return this
			.addLayer(popup)
			.fire('popupopen', {popup: this._popup});
	},

	closePopup: function () {
		if (this._popup) {
			this
				.removeLayer(this._popup)
				.fire('popupclose', {popup: this._popup});

			this._popup = null;
		}
		return this;
	}
});