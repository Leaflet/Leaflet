import {Icon} from './Icon';
import * as DomUtil from '../../dom/DomUtil';

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

export var IconDefault = Icon.extend({

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
		if (typeof IconDefault.imagePath !== 'string') {	// Deprecated, backwards-compatibility only
			IconDefault.imagePath = this._detectIconPath();
		}

		// @option imagePath: String
		// `Icon.Default` will try to auto-detect the location of the
		// blue icon images. If you are placing these images in a non-standard
		// way, set this option to point to the right path.
		return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
	},

	_stripUrl: function (path) {	// separate function to use in tests
		var strip = function (str, re, idx) {
			var match = re.exec(str);
			return match && match[idx];
		};
		path = strip(path, /^url\((['"])?(.+)\1\)$/, 2);
		return path && strip(path, /^(.*)marker-icon\.png$/, 1);
	},

	_detectIconPath: function () {
		var el = DomUtil.create('div',  'leaflet-default-icon-path', document.body);
		var path = DomUtil.getStyle(el, 'background-image') ||
		           DomUtil.getStyle(el, 'backgroundImage');	// IE8

		document.body.removeChild(el);
		path = this._stripUrl(path);
		if (path) { return path; }
		var link = document.querySelector('link[href$="leaflet.css"]');
		if (!link) { return ''; }
		return link.href.substring(0, link.href.length - 'leaflet.css'.length - 1);
	}
});
