
L.Control = L.Class.extend({
	options: {
		position: 'topright'
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	getPosition: function () {
		return this.options.position;
	},

	setPosition: function (position) {
		this.options.position = position;

		if (this._map) {
			this._map.removeControl(this);
			this._map.addControl(this);
		}
	}
});

L.Control.Position = {
	TOP_LEFT: 'topleft',
	TOP_RIGHT: 'topright',
	BOTTOM_LEFT: 'bottomleft',
	BOTTOM_RIGHT: 'bottomright'
};
