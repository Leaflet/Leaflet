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
		var corners = this._controlCorners = {},
			classPart = 'leaflet-',
			top = classPart + 'top',
			bottom = classPart + 'bottom',
			left = classPart + 'left',
			right = classPart + 'right',
			controlContainer = L.DomUtil.create('div', classPart + 'control-container', this._container);

		if (L.Browser.touch) {
			controlContainer.className += ' ' + classPart + 'big-buttons';
		}

		corners.topleft = L.DomUtil.create('div', top + ' ' + left, controlContainer);
		corners.topright = L.DomUtil.create('div', top + ' ' + right, controlContainer);
		corners.bottomleft = L.DomUtil.create('div', bottom + ' ' + left, controlContainer);
		corners.bottomright = L.DomUtil.create('div', bottom + ' ' + right, controlContainer);
	}
});
