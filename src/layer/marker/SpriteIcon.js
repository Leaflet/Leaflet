L.SpriteIcon = L.DivIcon.extend({
	options: {
		iconSize: new L.Point(12, 12), // also can be set through CSS
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		offset: (Point)
		*/
		className: 'leaflet-sprite-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');

		if (this.options.offset) {
			div.style.backgroundPosition = this.options.offset.x + 'px ' + this.options.offset.y + 'px';
		}

		this._setIconStyles(div, 'icon');
		return div;
	},

	createShadow: function () {
		return null;
	}
});
