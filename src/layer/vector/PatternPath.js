/*
 * L.PatternPath is the base class paths that are used to define the shapes in Patterns.
 */

L.PatternPath = L.Class.extend({

	options: {
		stroke: true,
		color: '#3388ff',
		weight: 3,
		opacity: 1,
		lineCap: 'round',
		lineJoin: 'round',
		// dashArray: null
		// dashOffset: null

		// fill: false
		// fillColor: same as color by default
		fillOpacity: 0.2,
		fillRule: 'evenodd',
		// fillPattern: L.Pattern

		// className: ''
		interactive: true

		// d: (SVG path to follow)
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	// Called when the parent Pattern get's added to the map,
	// or when added to a Pattern that is already on the map.
	onAdd: function () {
		this._renderer = this._pattern._renderer;
		this._renderer._initPatternPath(this);
		this._renderer._addPatternPath(this._pattern, this);
	},

	addTo: function (pattern) {
		pattern.addPath(this);
		return this;
	},

	redraw: function () {
		if (this._renderer) {
			this._renderer._updatePatternPath(this);
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);
		if (this._renderer) {
			this._renderer._updateStyle(this);
		}
		return this;
	},

	_pathAdd: function (pattern) {
		this._pattern = pattern;
		if(this._pattern._renderer){
			this.onAdd();
		}
	}
});

L.Pattern.include({
	addPath: function(layer) {
		var id = L.stamp(layer);
		if(this._paths[id]) { return layer; }
		this._paths[id] = layer;
		layer._pathAdd(this);
	}
});
