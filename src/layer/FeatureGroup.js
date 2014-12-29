/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
 * shared between a group of interactive layers (like vectors or markers).
 */

L.FeatureGroup = L.LayerGroup.extend({

	addLayer: function (layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		L.LayerGroup.prototype.addLayer.call(this, layer);

		return this.fire('layeradd', {layer: layer});
	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.removeEventParent(this);

		L.LayerGroup.prototype.removeLayer.call(this, layer);

		return this.fire('layerremove', {layer: layer});
	},

	openPopup: function (layerid) {
		var layer;

		if(layerid){
			layer = this.getLayer(layerid);
		} else {
			// open popup on the first layer
			for (var id in this._layers) {
				layer = this._layers[id];
				break;
			}
		}

		if (this._popup && this._map) {
			this._popup.options.offset = this._popupAnchor(layer);
			this._popup._source = layer;
			this._popup.update();
			this._map.openPopup(this._popup, layer._latlng || layer.getCenter());
		}

		return this;
	},

	togglePopup: function(layerid){
		if (this._popup) {
			if (this._popup._map) {
				this.closePopup();
			} else {
				this.openPopup(layerid);
			}
		}
		return this;
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();

		this.eachLayer(function (layer) {
			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
		});

		return bounds;
	}
});

L.featureGroup = function (layers) {
	return new L.FeatureGroup(layers);
};
