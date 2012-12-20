/*
 * Adds popup-related methods to L.Map.
 */

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
			this._popup._close();
		}
		return this;
	}
});
