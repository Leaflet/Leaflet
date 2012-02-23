L.Control.Attribution = L.Control.extend({
	options: {
		position: 'bottomright',
		prefix: 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>'
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);

		this._attributions = {};
	},

	onAdd: function (map) {
		this._map = map;

		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);

		this._update();

		return this._container;
	},

	setPrefix: function (prefix) {
		this.options.prefix = prefix;
		this._update();
	},

	addAttribution: function (text) {
		if (!text) { return; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();
	},

	removeAttribution: function (text) {
		if (!text) { return; }

		this._attributions[text]--;
		this._update();
	},

	_update: function () {
		if (!this._map) { return; }

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions.hasOwnProperty(i) && this._attributions[i]) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];
		
		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' &mdash; ');
	}
});
