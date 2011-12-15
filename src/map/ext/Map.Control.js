L.Map.include({
	addControl: function (control) {
		control.onAdd(this);

		var pos = control.getPosition(),
			corner = this._controlCorners[pos],
			container = control.getContainer();

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
			corner = this._controlCorners[pos],
			container = control.getContainer();

		corner.removeChild(container);

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

		corners.topLeft = L.DomUtil.create('div', top + ' ' + left, controlContainer);
		corners.topRight = L.DomUtil.create('div', top + ' ' + right, controlContainer);
		corners.bottomLeft = L.DomUtil.create('div', bottom + ' ' + left, controlContainer);
		corners.bottomRight = L.DomUtil.create('div', bottom + ' ' + right, controlContainer);
	}
});
