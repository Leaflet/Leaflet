
L.Path = L.Layer.extend({

	options: {
		renderer: L.svg(),

		stroke: true,
		color: '#0033ff',
		// dashArray: null,
		// lineCap: null,
		// lineJoin: null,
		weight: 5,
		opacity: 0.5,

		// fill: false,
		// fillColor: null, same as color by default
		fillOpacity: 0.2,

		// className: ''
		clickable: true
	},

	onAdd: function () {
		this._renderer = this._map.getRenderer(this.options.renderer);
		this._renderer._initPath(this);

		this._project();
		this._update();

		this._renderer._addPath(this);
	},

	onRemove: function () {
		this._renderer._removePath(this);
	},

	getEvents: function () {
		return {
			viewreset: this._project,
			moveend: this._update
		};
	},

	redraw: function () {
		if (this._map) {
			this._project();
			this._update();
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);

		if (this._path) {
			this._renderer._updateStyle(this);
		}
		return this;
	},

	bringToFront: function () {
		this._renderer._bringToFront(this);
		return this;
	},

	bringToBack: function () {
		this._renderer._bringToBack(this);
		return this;
	},

	_update: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
	},

	_updatePath: function () {
		this._renderer._updatePoly(this);
	}
});
