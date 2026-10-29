// @ts-check
import {Icon} from './Icon.js';
import {Point} from '../../geometry/Point.js';

/** @import {Defaults, DivIconOptions, IconOptions, PointExpression} from '../../types.js' */

/** @satisfies {Defaults<IconOptions>} */
const defaultOptions = {
	iconSize: [12, 12], // also can be set through CSS

	/**
	 * Custom HTML code to put inside the div element, empty by default. Alternatively, an instance of `HTMLElement`.
	 * @type {string | HTMLElement | false}
	 */
	html: false,

	/**
	 * Optional relative position of the background, in pixels.
	 * @type {PointExpression | null}
	 */
	bgPos: null,

	className: 'leaflet-div-icon'
};

/** @typedef {typeof defaultOptions} DivIconDefaults */

/**
 * Represents a lightweight icon for markers that uses a simple `<div>` element instead
 * of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
 * @example
 * ```js
 * const myIcon = new DivIcon({className: 'my-div-icon'});
 * // you can set .my-div-icon styles in CSS
 *
 * new Marker([50.505, 30.57], {icon: myIcon}).addTo(map);
 * ```
 *
 * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
 * @template {DivIconOptions} [O=DivIconOptions]
 * @extends {Icon<O>}
 */
export class DivIcon extends Icon {

	/** @type {Defaults<DivIconOptions>} */
	static defaultOptions = defaultOptions;

	/** @param {HTMLElement | null} [oldIcon] */
	createIcon(oldIcon) {
		const div = oldIcon instanceof HTMLDivElement ? oldIcon : document.createElement('div'),
		options = this.options;

		if (options.html instanceof Element) {
			div.replaceChildren();
			div.appendChild(options.html);
		} else {
			div.innerHTML = options.html !== false ? options.html : '';
		}

		if (options.bgPos) {
			const bgPos = new Point(options.bgPos);
			div.style.backgroundPosition = `${-bgPos.x}px ${-bgPos.y}px`;
		}
		this._setIconStyles(div, 'icon');

		return div;
	}

	/** @returns {null} */
	createShadow() {
		return null;
	}
}
