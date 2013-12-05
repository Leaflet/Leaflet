
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

	getPane: function () {
		// TODO make pane if not present
		return this._map._panes[this.options.pane];
	}
});
