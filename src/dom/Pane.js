/*
 * L.Pane is used for pane management
 */

L.Pane = L.Class.extend({

	initialize: function (map, name, container) {
		console.log('initializing pane object: ' + name);

		this._name = name;

		var className = 'leaflet-pane2' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : '');
		this._container = L.DomUtil.create('div', className, container || map._mapPane);

		console.log(this);
	}


});

L.pane = function (map, name, container) {
	return new L.Pane(map, name, container);
};
