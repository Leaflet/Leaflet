L.DivIcon = L.Icon.extend({
	options: {
		iconSize: new L.Point(12, 12), // also can be set through CSS
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		innerHTML: (String)
		*/
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		if (this.options.innerHTML) {
			div.innerHTML = this.options.innerHTML;
		}
		this._setIconStyles(div, 'icon');
		return div;
	},

	createShadow: function () {
		return null;
	}
});
