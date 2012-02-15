L.Map.include({
	addControl: function (control) {
		var container = control.onAdd(this);

		control._container = container;
		control._map = this;

		var pos = control.getPosition(),
			corner = this._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}
		return this;
	},

	removeControl: function (control) {
		var pos = control.getPosition(),
			corner = this._controlCorners[pos];

		corner.removeChild(control._container);
		control._map = null;

		if (control.onRemove) {
			control.onRemove(this);
		}
		return this;
	},

	_initControlPos: function () {
		var top = 'leaflet-top',
			bottom = 'leaflet-bottom',
			left = 'leaflet-left',
			right = 'leaflet-right',
			container = L.DomUtil.create('div', 'leaflet-control-container', this._container),
			corners = this._controlCorners = {};

		corners.topleft     = L.DomUtil.create('div', top    + ' ' + left,  container);
		corners.topright    = L.DomUtil.create('div', top    + ' ' + right, container);
		corners.bottomleft  = L.DomUtil.create('div', bottom + ' ' + left,  container);
		corners.bottomright = L.DomUtil.create('div', bottom + ' ' + right, container);
	}
});
