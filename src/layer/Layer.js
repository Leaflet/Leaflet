
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

		if (this.beforeAdd) {
			this.beforeAdd(map);
		}

		map.whenReady(this._layerAdd, this);

		return this;
	},

	_layerAdd: function () {
		// check in case layer gets added and then removed before the map is ready
		if (!this._map) { return; }

		this.onAdd(this._map);
		this.fire('add');
		this._map.fire('layeradd', {layer: this});
	},

	removeFrom: function (map) {
		var id = L.stamp(this);
		if (!map._layers[id]) { return this; }

		if (map._loaded) {
			this.onRemove(map);
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
