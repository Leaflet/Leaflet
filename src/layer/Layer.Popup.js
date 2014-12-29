/*
 * Adds popup-related methods to all layers.
 */

L.Layer.include({

	bindPopup: function (content, options) {

		if (content instanceof L.Popup) {
			this._popup = content;
			content._source = this;
		} else {
			if (!this._popup || options) {
				this._popup = new L.Popup(options, this);
			}
			this._popup.setContent(content);
		}

		if (!this._popupHandlersAdded) {
			this.on({
				click: this._openPopup,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = true;
		}

		return this;
	},

	unbindPopup: function () {
		if (this._popup) {
			this.off({
			    click: this._openPopup,
			    remove: this.closePopup,
			    move: this._movePopup
			});
			this._popupHandlersAdded = false;
			this._popup = null;
		}
		return this;
	},

	openPopup: function (latlng) {
		if (this._popup && this._map) {
			this._popup.options.offset = this._popupAnchor(this);
			this._map.openPopup(this._popup, latlng ||  this._latlng || this.getCenter());
		}
		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	togglePopup: function () {
		if (this._popup) {
			if (this._popup._map) {
				this.closePopup();
			} else {
				this.openPopup();
			}
		}
		return this;
	},

	setPopupContent: function (content) {
		if (this._popup) {
			this._popup.setContent(content);
		}
		return this;
	},

	getPopup: function () {
		return this._popup;
	},

	_openPopup: function (e) {
		if(this._popup && this._map && this._map.hasLayer(this._popup) && this._popup._source === e.layer){
			this.closePopup();
		} else {
			this._popup.options.offset = this._popupAnchor(e.layer || e.target);
			this._popup._source = e.layer;
			if(typeof this._popup._content === 'function') {
				this._popup.update();
			}
			this._map.openPopup(this._popup, e.latlng);
		}
	},

	_popupAnchor: function(layer){
		var anchor = (layer._getPopupAnchor) ? layer._getPopupAnchor() : [0,0];
		return L.point(anchor).add(L.Popup.prototype.options.offset);
	},

	_movePopup: function (e) {
		this._popup.setLatLng(e.latlng);
	}
});