/*
 * Popup extension to L.Path (polylines, polygons, circles), adding bindPopup method.
 */

L.Path.include({

	bindPopup: function (content, options) {

		if (!this._popup || this._popup.options !== options) {
			this._popup = new L.Popup(options, this);
		}

		this._popup.setContent(content);

		if (!this._openPopupAdded) {
			this.on('click', this._openPopup, this);
			this._openPopupAdded = true;
		}

		return this;
	},

	openPopup: function (latlng) {

		if (this._popup) {
			latlng = latlng || this._latlng ||
					this._latlngs[Math.floor(this._latlngs.length / 2)];

			this._openPopup({latlng: latlng});
		}

		return this;
	},

	_openPopup: function (e) {
		this._popup.setLatLng(e.latlng);
		this._map.openPopup(this._popup);
	}
});
