import {ImageOverlay} from './ImageOverlay';
import * as DomUtil from '../dom/DomUtil';
import * as Util from '../core/Util';

/*
 * @class SVGOverlay
 * @aka L.SVGOverlay
 * @inherits ImageOverlay
 *
 * Used to load, display and provide DOM access to an SVG file over specific bounds of the map. Extends `ImageOverlay`.
 *
 * An SVG overlay uses the [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg) element
 *
 * @example
 *
 * ```js
 * var element = '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" height="200" width="200"/></svg>,
 * 		 elementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
 * L.svgOverlay(element, elementBounds).addTo(map);
 * ```
 */

export var SVGOverlay = ImageOverlay.extend({
	_initImage: function () {
		var isElement = this._url.tagName === 'svg';
		var el = this._image = isElement ? this._url : _getSVGElement(this._url);

		var el = this._image = this._url;



		DomUtil.addClass(el, 'leaflet-image-layer');
		if (this._zoomAnimated) { DomUtil.addClass(el, 'leaflet-zoom-animated'); }

		el.onselectstart = Util.falseFn;
		el.onmousemove = Util.falseFn;
	},

	// @method getElement(): SVGElement
	// Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
	// used by this overlay.


	// _getSVGElement(url): string
	// Gets the svg image from url with ['XMLHTTPRequest'](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)


	_getSVGElement(url) {
		var request = new XMLHttpRequest();
		request.addEventListener('load', this._parseSVGElement);
		request.addEventListener('error', function(error) {
			console.error('SVGOverlay loading file error ', error)
		});

		request.open('GET', url);


	},

	// _parseSVGElement(content): SVGElement
	// Parses a given string to an SVGElement with ['DOMParser'](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser) API

	_parseSVGElement(content) {

	}
});


// @factory L.svgOverlay(svg: String|SVGElement, bounds: LatLngBounds, options?: SVGOverlay options)
// Instantiates an image overlay object given the URL of the SVG image (or an SVG root tag) and the
// geographical bounds it is tied to.

export function svgOverlay(image, bounds, options) {
	return new SVGOverlay(image, bounds, options);
}
