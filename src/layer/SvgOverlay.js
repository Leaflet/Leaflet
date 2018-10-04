import {ImageOverlay} from './ImageOverlay';
import * as DomUtil from '../dom/DomUtil';


/*
 * @class SvgOverlay
 * @aka L.SvgOverlay
 * @inherits ImageOverlay
 *
 * Used to load and display a single image over specific bounds of the map. Extends `ImageOverlay`.
 * Due to web browser security policy, svg from other domains may not be rendered.
 *
 * @example
 *
 * ```js
 * var imageUrl = 'file.svg',
 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 *  L.SvgOverlay(imageUrl, bounds).addTo(mymap);
 * ```
 */

export var SvgOverlay = ImageOverlay.extend({
	options: {
		className: '',
		zIndex: 1
	},

	_checkURL: function () {
		var url = document.createElement('a');
		var location = window.location;

		url.href = this._url;

		if (url.protocol + url.host !== location.protocol + location.host) {
			throw new Error('Leaflet SvgOverlay: SVG from other hosts are unavailable due to security reasons');
		}
	},

	_initImage: function () {
		this._checkURL();

		var that = this;
		this._image = DomUtil.create('object');
		this._image.className = 'leaflet-image-layer leaflet-zoom-animated';
		this._image.setAttribute('type', 'image/svg+xml');
		this._image.setAttribute('data', this._url);

		this._image.onselectstart = function () {
			return false;
		};
		this._image.onmousemove = function () {
			return false;
		};

		this._image.onload = function () {
			var svg = that._image.getSVGDocument().querySelector('svg');
			var bBox = svg.getBBox();
			svg.setAttribute('viewBox', bBox.x + ' ' + bBox.y + ' ' + bBox.width + ' ' + bBox.height);
			svg.setAttribute('preserveAspectRatio', 'none');
			svg.setAttribute('style', 'width: 100%; height: 100%;');
			that.fire('load');
		};
	}
});

// @factory L.svgOverlay(imageUrl: String, bounds: LatLngBounds, options?: SvgOverlay options)
// Instantiates an svg image overlay object given the URL of the image and the
// geographical bounds it is tied to.

export var svgOverlay = function (url, bounds, options) {
	return new SvgOverlay(url, bounds, options);
};
