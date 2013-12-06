
L.Layer = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		pane: 'overlayPane'
	},

	addTo: function (map) {
		this._map = map;

		var id = L.stamp(this);
		if (map._layers[id]) { return this; }
		map._layers[id] = this;

		this._zoomAnimated = map._zoomAnimated;

		if (this.beforeAdd) {
			this.beforeAdd(map);
		}

		map.whenReady(this._layerAdd, this);

		return this;
	},

	_layerAdd: function () {
		var map = this._map;

		// check in case layer gets added and then removed before the map is ready
		if (!map) { return; }

		this.onAdd(map);

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	},

	removeFrom: function (map) {

		var id = L.stamp(this);
		if (!map._layers[id]) { return this; }

		if (map._loaded) {
			this.onRemove(map);
		}

		if (this.getEvents) {
			map.off(this.getEvents(), this);
		}

		delete map._layers[id];

		if (map._loaded) {
			map.fire('layerremove', {layer: this});
			this.fire('remove');
		}

		this._map = null;
	},

	getPane: function (name) {
		// TODO make pane if not present
		var paneName = name ? this.options[name] || name : this.options.pane;
		return this._map._panes[paneName];
	}
});


L.Map.addInitHook(function () {
	this._layers = {};
	this._zoomBoundLayers = {};
	this._addLayers(this.options.layers);
});

L.Map.include({
	addLayer: function (layer) {
		layer.addTo(this);
		return this;
	},

	removeLayer: function (layer) {
		layer.removeFrom(this);
		return this;
	},

	hasLayer: function (layer) {
		return !layer || L.stamp(layer) in this._layers;
	},

	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	_addLayers: function (layers) {
		layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},

	_addZoomLimit: function (layer) {
		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
			this._zoomBoundLayers[L.stamp(layer)] = layer;
			this._updateZoomLevels();
		}
	},

	_removeZoomLimit: function (layer) {
		var id = L.stamp(layer);

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}
	},

	_updateZoomLevels: function () {
		var minZoom = Infinity,
			maxZoom = -Infinity,
			oldZoomSpan = this._getZoomSpan();

		for (var i in this._zoomBoundLayers) {
			var options = this._zoomBoundLayers[i].options;

			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
		}

		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}
	}
});
