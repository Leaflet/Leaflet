/*
 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
 * to use with L.Marker.
 */

L.DivIcon = L.Icon.extend({
	options: {
		iconSize: [12, 12], // also can be set through CSS
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		html: (String)
		bgPos: (Point)
		*/
		className: 'leaflet-div-icon',
		html: false
	},

	createIcon: function (oldIcon) {
		var options = this.options;

		this._container = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div');
		this._innerHTML = (options.html !== false) ? options.html : '';

		this._updateHTMLContent();

		if (options.bgPos) {
			this._container.style.backgroundPosition = (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
		}
		this._setIconStyles(this._container, 'icon');

		return this._container;
	},

	_updateHTMLContent: function() {
		if (typeof this._innerHTML === 'string') {
			this._container.innerHTML = this._innerHTML;
		} else {
			while (this._container.hasChildNodes()) {
				this._container.removeChild(this._container.firstChild);
			}
			this._container.appendChild(this._innerHTML);
		}
	},

	createShadow: function () {
		return null;
	}
});

L.divIcon = function (options) {
	return new L.DivIcon(options);
};
