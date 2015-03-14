/*
 * Adds popup-related methods to all layers.
 */

L.Layer.include({

	bindPopup: function (content, options) {

		if (content instanceof L.Popup) {
			L.setOptions(content, options);
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
				click: this._togglePopup,
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
				click: this._togglePopup,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = false;
			this._popup = null;
		}
		return this;
	},

	openPopup: function (target) {
		var layer;
		var latlng;

		if (!target) {
			for (var id in this._layers) {
				layer = this._layers[id];
				break;
			}
			layer = layer || this;
		}

		if (target instanceof L.Layer) {
			layer = target;
		}

		latlng = (layer) ? layer._popupLatLng() : target;

		if (this._popup && this._map) {
			this._setupPopup(layer || this);
			this._map.openPopup(this._popup, latlng);
		}

		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	togglePopup: function (target) {
		if (this._popup) {
			if (this._popup._map) {
				this.closePopup();
			} else {
				this.openPopup(target);
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

	_togglePopup: function (e) {
		var layer = e.layer || e.target;
		if (this._popup && this._map && this._map.hasLayer(this._popup) && this._popup._source === layer) {
			this.closePopup();
		} else {
			this._setupPopup(layer);
			this._map.openPopup(this._popup, e.latlng);
		}
	},

	_setupPopup: function (layer) {
		this._popup.options.offset = this._popupAnchor(layer);
		this._popup._source = layer;
		this._popup.update();
	},

	_popupAnchor: function(layer){
		var anchor = (layer._getPopupAnchor) ? layer._getPopupAnchor() : [0,0];
		return L.point(anchor).add(L.Popup.prototype.options.offset);
	},

	_movePopup: function (e) {
		this._popup.setLatLng(e.latlng);
	},

	_popupLatLng: function(){
		return this._latlng || this.getCenter();
	}
});
