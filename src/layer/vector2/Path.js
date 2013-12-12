
L.Path = L.Layer.extend({

	options: {
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
		this._renderer._initPath(this);

		this._projectLatlngs();
		this._updatePath();

		this._renderer._addPath(this);
	},

	onRemove: function () {
		this._renderer._removePath(this);
	},

	getEvents: function () {
		return {
			viewreset: this._projectLatlngs,
			moveend: this._updatePath
		};
	},

	redraw: function () {
		if (this._map) {
			this._projectLatlngs();
			this._updatePath();
		}
		return this;
	},

	_updatePath: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();

		this._renderer._updatePoly(this);
	}
});

L.polyline2 = function (latlngs, options) {
	return new L.Polyline2(latlngs, options);
};
