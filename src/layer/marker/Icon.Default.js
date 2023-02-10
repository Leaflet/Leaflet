import {Icon} from './Icon.js';
import * as DomUtil from '../../dom/DomUtil.js';

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

export const IconDefault = Icon.extend({

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

	_getIconUrl(name) {
		if (typeof IconDefault.imagePath !== 'string') {	// Deprecated, backwards-compatibility only
			IconDefault.imagePath = this._detectIconPath();
		}

		// @option imagePath: String
		// `Icon.Default` will try to auto-detect the location of the
		// blue icon images. If you are placing these images in a non-standard
		// way, set this option to point to the right path.
		return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
	},

	_stripUrl(path) {	// separate function to use in tests
		const strip = function (str, re, idx) {
			const match = re.exec(str);
			return match && match[idx];
		};
		path = strip(path, /^url\((['"])?(.+)\1\)$/, 2);
		return path && strip(path, /^(.*)marker-icon\.png$/, 1);
	},

	_detectIconPath() {
		const el = DomUtil.create('div',  'leaflet-default-icon-path', document.body);
		const path = this._stripUrl(getComputedStyle(el).backgroundImage);

		document.body.removeChild(el);
		if (path) { return path; }
		const link = document.querySelector('link[href$="leaflet.css"]');
		if (!link) { return ''; }
		return link.href.substring(0, link.href.length - 'leaflet.css'.length - 1);
	}
});
