/*
 * @miniclass Icon.Default (Icon)
 * @aka L.Icon.Default
 * @section
 *
 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
 * no icon is specified. Points to the blue marker image distributed with Leaflet
 * releases.
 *
 * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `L.Marker.prototype.options.icon` with your own icon instead.
 */

L.Icon.Default = L.Icon.extend({

	options: {
		iconUrl:       'marker-icon.png',
		iconRetinaUrl: 'marker-icon-2x.png',
		shadowUrl:     'marker-shadow.png',
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	},

	_getIconUrl: function (name) {
		// if (!L.Icon.Default.imagePath) {	// Deprecated, backwards-compatibility only
		L.Icon.Default.imagePath = this._detectIconPath(name);
		// }

		// @option imagePath: String
		// `L.Icon.Default` will try to auto-detect the absolute location of the
		// blue icon images. If you are placing these images in a non-standard
		// way, set this option to point to the right absolute path.
		var path = this.options.imagePath || L.Icon.Default.imagePath;
		return path.indexOf('data:') === 0 ? path : path + L.Icon.prototype._getIconUrl.call(this, name);
	},

	_detectIconPath: function (name) {
		var el = L.DomUtil.create('div',  'leaflet-default-' + name + '-path', document.body);
		var path = L.DomUtil.getStyle(el, 'background-image') ||
		           L.DomUtil.getStyle(el, 'backgroundImage');	// IE8

		document.body.removeChild(el);
		var re2 = new RegExp('(marker-' + name + '\.png)?[\\"\\\']?\\)$');
		return path.indexOf('url') === 0 ?
			path.replace(/^url\([\"\']?/, '').replace(re2, '') : '';
	}
});
