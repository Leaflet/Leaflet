/*
 * L.Pattern is the base class for fill patterns for leaflet Paths.
 */

L.Pattern = L.Evented.extend({
	options: {
		x: 0,
		y: 0,
		width: 8,
		height: 8,
		patternUnits: 'userSpaceOnUse',
		patternContentUnits: 'userSpaceOnUse'
		// patternTransform: null
	},

	initialize: function (options) {
		this._paths = {};
		L.setOptions(this, options);
	},

	onAdd: function () {
		this._renderer = this._map.getRenderer(this);
		this._renderer._initPattern(this);

		// Any paths that were added before this was added to the map
		// Need to have their onAdd called.
		for(var i in this._paths){
			this._paths[i].onAdd();
		}

		// Call any children that want to add their own paths.
		this._addPaths();

		this._renderer._addPattern(this);
		this.redraw();
	},

	_addPaths: L.Util.falseFn,
	_update: L.Util.falseFn,

	onRemove: function () {
		this._renderer._removePattern(this);
	},

	redraw: function () {
		if (this._map) {
			this._renderer._updatePattern(this);
			for(var i in this._paths){
				this._paths[i].redraw();
			}
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);
		if (this._renderer) {
			this._renderer._updatePatternStyle(this);
		}
		return this;
	},

	addTo: function (map) {
		map.addPattern(this);
		return this;
	},

	remove: function () {
		return this.removeFrom(this._map);
	},

	removeFrom: function (obj) {
		if (obj) {
			obj.removePattern(this);
		}
		return this;
	},

	getPane: function (name) {
		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	},

	_patternAdd: function (e) {
		var map = e.target;

		if (!map.hasPattern(this)) { return; }

		this._map = map;
		this.onAdd();

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}

		this.fire('add');
		map.fire('patternadd', {pattern: this});
	}
});


L.Map.include({
	addPattern: function (pattern) {
		var id = L.stamp(pattern);
		if (this._patterns[id]) { return pattern; }
		this._patterns[id] = pattern;

		this.whenReady(pattern._patternAdd, pattern);
		return this;
	},

	removePattern: function (pattern) {
		var id = L.stamp(pattern);

		if (!this._patterns[id]) { return this; }

		if (this._loaded) {
			pattern.onRemove(this);
		}

		if (pattern.getEvents) {
			this.off(pattern.getEvents(), pattern);
		}

		delete this._patterns[id];

		if (this._loaded) {
			this.fire('patternremove', {pattern: pattern});
			pattern.fire('remove');
		}

		pattern._map = null;

		return this;
	},

	hasPattern: function (pattern) {
		return !!pattern && (L.stamp(pattern) in this._patterns);
	}
});