/*
 * L.Pane is used for pane management
 */

L.Pane = L.Class.extend({

	initialize: function (map, name, container) {
		this._name = name;

		// Define the class name for the container
		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : '');

		// Create the container
		this._container = L.DomUtil.create('div', className, container || map._mapPane.getContainer());

		// Shortcut for accessing DOM container styles
		this.style = this._container.style;
	},

	// Get the name of the pane
	getName: function() {
		return this._name;
	},

	// Get the container of the pane
	getContainer: function () {
		return this._container;
	},

	// Get the renderer (creates a new one if it doesn't exist)
	getRenderer: function () {
		var renderer = this._renderer;

		// Create renderer if it doesn't exist
		if ( !renderer ) {
			renderer = this._renderer = (L.SVG && L.svg()) || (L.Canvas && L.canvas());
			renderer.options.pane = this._name;
		}

		return renderer;
	},

	// Add DOM element to pane
	appendChild: function (container) {
		this._container.appendChild(container);
	},

	// Remove DOM element from pane
	removeChild: function (container) {
		this._container.removeChild(container);
	},

});

L.pane = function (map, name, container) {
	return new L.Pane(map, name, container);
};
