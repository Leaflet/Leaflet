
L.Control.Zoom = L.Class.extend({
	initialize: function () {
		this._zoomPosition = L.Control.Position.TOP_LEFT;
	},

	onAdd: function (map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-zoom');

		this._zoomInButton = this._createButton(
				'Zoom in', 'leaflet-control-zoom-in', this._map.zoomIn, this._map);
		this._zoomOutButton = this._createButton(
				'Zoom out', 'leaflet-control-zoom-out', this._map.zoomOut, this._map);

		this._container.appendChild(this._zoomInButton);
		this._container.appendChild(this._zoomOutButton);
	},

	getContainer: function () {
		return this._container;
	},

	getPosition: function () {
		return this._zoomPosition;
	},

	setPosition: function (position) {
		this._zoomPosition = position;
	},

	_createButton: function (title, className, fn, context) {
		var link = document.createElement('a');
		link.href = '#';
		link.title = title;
		link.className = className;

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(link);
		}
		L.DomEvent.addListener(link, 'click', L.DomEvent.preventDefault);
		L.DomEvent.addListener(link, 'click', fn, context);

		return link;
	}
});
