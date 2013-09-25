/*
 * L.LayerGroup is a class to combine several layers into one so that
 * you can manipulate the group (e.g. add/remove it) as one layer.
 */

L.LayerGroup = L.Class.extend({
	initialize: function (layers) {
		this._layers = {};

		var i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	addLayer: function (layer) {
		var id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._addForBounds([layer], this._map);
		}

		return this;
	},

	removeLayer: function (layer) {
		var id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	},

	hasLayer: function (layer) {
		if (!layer) { return false; }

		return (layer in this._layers || this.getLayerId(layer) in this._layers);
	},

	clearLayers: function () {
		this.eachLayer(this.removeLayer, this);
		return this;
	},

	invoke: function (methodName) {
		var args = Array.prototype.slice.call(arguments, 1),
		    i, layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map) {
		this._map = map;
		this._addForBounds(this._layers, map);
		map.on('moveend', function () {
			this._addForBounds(this._layers, map);
		}, this);
	},

	onRemove: function (map) {
		this.eachLayer(map.removeLayer, map);
		this._map = null;
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	getLayer: function (id) {
		return this._layers[id];
	},

	getLayers: function () {
		var layers = [];

		for (var i in this._layers) {
			layers.push(this._layers[i]);
		}
		return layers;
	},

	setZIndex: function (zIndex) {
		return this.invoke('setZIndex', zIndex);
	},

	getLayerId: function (layer) {
		return L.stamp(layer);
	},

	_addForBounds: function (layerArray, map) {
		var mapBounds = map.getBounds(), intersectsMapBounds, layer, i;

		for (i in layerArray) {
			layer = layerArray[i];
			intersectsMapBounds = true; // assume should be rendered by default

			if (typeof layer.getLatLng === 'function') {
				if (!mapBounds.contains(layer.getLatLng())) {
					intersectsMapBounds = false;
				}
			} else if (typeof layer.getBounds === 'function') {
				if (!mapBounds.intersectsMapBounds(layer.getBounds())) {
					intersectsMapBounds = false;
				}
			}

			if (intersectsMapBounds) {
				map.addLayer(layer);
			} else {
				map.removeLayer(layer);
			}
		}
	}
});

L.layerGroup = function (layers) {
	return new L.LayerGroup(layers);
};
