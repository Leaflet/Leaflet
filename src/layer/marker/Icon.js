L.Icon = L.Class.extend({
	options: {
		iconUrl: L.ROOT_URL + 'images/marker.png',
		iconSize: new L.Point(25, 41),
		iconAnchor: new L.Point(13, 41),
		popupAnchor: new L.Point(0, -33),

		shadowUrl: L.ROOT_URL + 'images/marker-shadow.png',
		shadowSize: new L.Point(41, 41),
		shadowOffset: new L.Point(0, 0),

		className: ''
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	createIcon: function () {
		return this._createIcon('icon');
	},

	createShadow: function () {
		return this.options.shadowUrl ? this._createIcon('shadow') : null;
	},

	_createIcon: function (name) {
		var img = this._createImg(this.options[name + 'Url']);
		this._setIconStyles(img, name);
		return img;
	},

	_setIconStyles: function (img, name) {
		var options = this.options,
			size = options[name + 'Size'],
			anchor = options.iconAnchor || size.divideBy(2, true);

		if (name === 'shadow') {
			anchor._add(options.shadowOffset);
		}

		img.className = 'leaflet-marker-' + name + ' ' + options.className;

		img.style.marginLeft = (-anchor.x) + 'px';
		img.style.marginTop  = (-anchor.y) + 'px';

		if (options.iconSize) {
			img.style.width  = size.x + 'px';
			img.style.height = size.y + 'px';
		}
	},

	_createImg: function (src) {
		var el;
		if (!L.Browser.ie6) {
			el = document.createElement('img');
			el.src = src;
		} else {
			el = document.createElement('div');
			el.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
		}
		return el;
	}
});
