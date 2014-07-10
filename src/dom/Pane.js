/*
 * L.Pane is used for pane management
 */

L.Pane = L.Class.extend({

	initialize: function (map, name, container) {
		this._name = name;
		this._renderer = null;

		// Define the class name for the container
		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : '');

		// Create the container
		this._container = L.DomUtil.create('div', className, container || map._mapPane.getContainer());

		// Shortcut for accessing Pane's container's styles
		this.style = this._container.style;
	},

	getName: function() {
		return this._name;
	},

	getContainer: function () {
		return this._container;
	},

	getRenderer: function (layer) {
		var renderer = this._renderer;

		// Create renderer if it doesn't exist
		if ( !renderer ) {
			renderer = this._renderer = (L.SVG && L.svg()) || (L.Canvas && L.canvas());
			renderer.options.pane = this._name;
		}

		return renderer;
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
