import {ImageOverlay} from './ImageOverlay.js';
import * as Util from '../core/Util.js';

/*
 * @class SVGOverlay
 * @inherits ImageOverlay
 *
 * Used to load, display and provide DOM access to an SVG file over specific bounds of the map. Extends `ImageOverlay`.
 *
 * An SVG overlay uses the [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg) element.
 *
 * @example
 *
 * ```js
 * const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
 * svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
 * svgElement.setAttribute('viewBox', "0 0 200 200");
 * svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
 * const svgElementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
 * new SVGOverlay(svgElement, svgElementBounds).addTo(map);
 * ```
 */

// @constructor SVGOverlay(svg: String|SVGElement, bounds: LatLngBounds, options?: SVGOverlay options)
// Instantiates an image overlay object given an SVG element and the geographical bounds it is tied to.
// A viewBox attribute is required on the SVG element to zoom in and out properly.
export class SVGOverlay extends ImageOverlay {
	_initImage() {
		const el = this._image = this._url;

		el.classList.add('leaflet-image-layer');
		if (this._zoomAnimated) { el.classList.add('leaflet-zoom-animated'); }
		if (this.options.className) { el.classList.add(...Util.splitWords(this.options.className)); }

		el.onselectstart = Util.falseFn;
		el.onpointermove = Util.falseFn;
	}

	// @method getElement(): SVGElement
	// Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
	// used by this overlay.
}
