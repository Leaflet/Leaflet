/*
 * L.Pane is used for pane management
 */

L.Pane = L.Class.extend({

	initialize: function (map, name, container) {
		this._name = name;

		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : '');
		this._container = L.DomUtil.create('div', className, container || map._mapPane.getContainer());
	},

	getContainer: function () {
		return this._container;
	},

	add: function (container) {
		this._container.appendChild(container);
	},

	remove: function (container) {
		this._container.removeChild(container);
	}


});

L.pane = function (map, name, container) {
	return new L.Pane(map, name, container);
};
