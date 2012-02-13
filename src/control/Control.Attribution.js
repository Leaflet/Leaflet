L.Control.Attribution = L.Class.extend({
	initialize: function (prefix) {
		this._prefix = prefix || 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>';
		this._attributions = {};
	},

	onAdd: function (map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);
		this._map = map;
		this._update();
	},

	getPosition: function () {
		return L.Control.Position.BOTTOM_RIGHT;
	},

	getContainer: function () {
		return this._container;
	},

	setPrefix: function (prefix) {
		this._prefix = prefix;
		this._update();
	},

	addAttribution: function (text) {
		if (!text) {
			return;
		}
		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;
		this._update();
	},

	removeAttribution: function (text) {
		if (!text) {
			return;
		}
		this._attributions[text]--;
		this._update();
	},

	_update: function () {
		if (!this._map) {
			return;
		}

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions.hasOwnProperty(i)) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];
		if (this._prefix) {
			prefixAndAttribs.push(this._prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' &mdash; ');
	}
});
