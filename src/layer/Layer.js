
L.Layer = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		pane: 'overlayPane'
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	getPane: function () {
		// TODO make pane if not present
		return this._map._panes[this.options.pane];
	}
});
