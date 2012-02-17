L.DivIcon = L.Icon.extend({
	options: {
		iconSize: new L.Point(12, 12),
		iconAnchor: null,
		popupAnchor: new L.Point(0, -8),
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		this._setIconStyles(div, 'icon');
		return div;
	},

	createShadow: function () {
		return null;
	}
});
