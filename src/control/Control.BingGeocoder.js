
L.Control.BingGeocoder = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		callback: function (results) {
			var bbox = results.resourceSets[0].resources[0].bbox,
				first = new L.LatLng(bbox[0], bbox[1]),
				second = new L.LatLng(bbox[2], bbox[3]),
				bounds = new L.LatLngBounds([first, second]);
			this._map.fitBounds(bounds);
		},
		key: null
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;
		var className = 'leaflet-control-geocoder',
			container = this._container = L.DomUtil.create('div', className);

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-form');
		
		var input = this._input = document.createElement('input');
		input.type = "text";

		var submit = document.createElement('button');
		submit.type = "submit";
		submit.innerHTML = "Localiser";

		form.appendChild(input);
		form.appendChild(submit);

		L.DomEvent.addListener(form, 'submit', this._geocode, this);

		if (this.options.collapsed) {
			L.DomEvent.addListener(container, 'mouseover', this._expand, this);
			L.DomEvent.addListener(container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Bing Geocoder';

			L.DomEvent.addListener(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

			this._map.on('movestart', this._collapse, this);
		} else {
			this._expand();
		}

		container.appendChild(form);

		return container;
	},
	
	_geocode: function (event) {
		L.DomEvent.preventDefault(event);
		var $ = window.JQuery || window.$;
		$.getJSON("http://dev.virtualearth.net/REST/v1/Locations?jsonp=?",
			{
				key: this._options.key,
				query: this._input.value
			}
		)
		.success(this._options.callback)
		.error(
			function (error) {
				console.info(error);
			}
		);
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-geocoder-expanded', '');
	}
});
