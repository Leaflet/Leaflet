import {Class} from '../../core/Class.js';
import {setOptions} from '../../core/Util.js';
import {Point} from '../../geometry/Point.js';

/** @import {Defaults, IconDefaults, IconOptions, PointExpression} from '../../types.js' */

const defaultOptions = {
	/**
	 * **(required)** The URL to the icon image (absolute or relative to your script path).
	 * @type {string | null}
	 */
	iconUrl: null,

	/**
	 * The URL to a retina sized version of the icon image (absolute or relative to your script path). Used for
	 * Retina screen devices.
	 * @type {string | null}
	 */
	iconRetinaUrl: null,

	/**
	 * Size of the icon image in pixels. A number sets both width and height.
	 * @type {PointExpression | number | null}
	 */
	iconSize: null,

	/**
	 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that
	 * this point is at the marker's geographical location. Centered by default if size is specified, also can be
	 * set in CSS with negative margins.
	 * @type {PointExpression | null}
	 */
	iconAnchor: null,

	/**
	 * The coordinates of the point from which popups will "open", relative to the icon anchor.
	 * @type {PointExpression}
	 */
	popupAnchor: [0, 0],

	/**
	 * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
	 * @type {PointExpression}
	 */
	tooltipAnchor: [0, 0],

	/**
	 * The URL to the icon shadow image. If not specified, no shadow image will be created.
	 * @type {string | null}
	 */
	shadowUrl: null,

	/**
	 * The URL to a retina sized version of the shadow image. Used for Retina screen devices.
	 * @type {string | null}
	 */
	shadowRetinaUrl: null,

	/**
	 * Size of the shadow image in pixels. A number sets both width and height.
	 * @type {PointExpression | number | null}
	 */
	shadowSize: null,

	/**
	 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same as iconAnchor if not
	 * specified).
	 * @type {PointExpression | null}
	 */
	shadowAnchor: null,

	/** A custom class name to assign to both icon and shadow images. */
	className: '',

	/**
	 * Whether the crossOrigin attribute will be added to the icon images. If a String is provided, all images will
	 * have their crossOrigin attribute set to the String provided. Refer to [CORS
	 * Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
	 * @type {boolean | string}
	 */
	crossOrigin: false
};

/** @typedef {typeof defaultOptions} IconDefaultsValues */

/**
 * Represents an icon to provide when creating a marker.
 * @example
 * ```js
 * const myIcon = new Icon({
 *     iconUrl: 'my-icon.png',
 *     iconRetinaUrl: 'my-icon@2x.png',
 *     iconSize: [38, 95],
 *     iconAnchor: [22, 94],
 *     popupAnchor: [-3, -76],
 *     shadowUrl: 'my-icon-shadow.png',
 *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
 *     shadowSize: [68, 95],
 *     shadowAnchor: [22, 94]
 * });
 *
 * new Marker([50.505, 30.57], {icon: myIcon}).addTo(map);
 * ```
 *
 * `DefaultIcon` extends `Icon` and is the blue icon Leaflet uses for markers by default.
 * @template {IconOptions} [O=IconOptions]
 * @extends {Class<O & IconDefaults>}
 */
export class Icon extends Class {

	static initHooks = true;

	/** @type {Defaults<IconOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Creates an icon instance with the given options.
	 * @param {NoInfer<Partial<O>>} [options]
	 */
	constructor(options) {
		super();
		setOptions(this, options);
		this.callInitHooks();
	}

	/**
	 * Called internally when the icon has to be shown, returns
	 * a `<img>` HTML element styled according to the options.
	 * @param {HTMLElement | null} [oldIcon]
	 * @returns {HTMLElement}
	 */
	createIcon(oldIcon) {
		return this._createIcon('icon', oldIcon);
	}

	/**
	 * As `createIcon`, but for the shadow beneath it.
	 * @param {HTMLElement | null} [oldIcon]
	 */
	createShadow(oldIcon) {
		return this._createIcon('shadow', oldIcon);
	}

	/**
	 * @overload
	 * @param {'icon'} name
	 * @param {HTMLElement | null} [oldIcon]
	 * @returns {HTMLImageElement}
	 */
	/**
	 * @overload
	 * @param {'icon' | 'shadow'} name
	 * @param {HTMLElement | null} [oldIcon]
	 * @returns {HTMLImageElement | null}
	 */
	/**
	 * @param {'icon' | 'shadow'} name
	 * @param {HTMLElement | null} [oldIcon]
	 */
	_createIcon(name, oldIcon) {
		const src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error('iconUrl not set in Icon options (see the docs).');
			}
			return null;
		}

		const img = this._createImg(src, oldIcon instanceof HTMLImageElement ? oldIcon : null);
		this._setIconStyles(img, name);

		if (this.options.crossOrigin || this.options.crossOrigin === '') {
			// the DOM types leave out '', which is how the attribute spells 'anonymous'
			img.crossOrigin = /** @type {HTMLImageElement['crossOrigin']} */ (this.options.crossOrigin === true ? '' : this.options.crossOrigin);
		}

		return img;
	}

	/**
	 * @param {HTMLElement} img
	 * @param {'icon' | 'shadow'} name
	 */
	_setIconStyles(img, name) {
		const options = this.options;
		let sizeOption = options[`${name}Size`];

		if (typeof sizeOption === 'number') {
			sizeOption = [sizeOption, sizeOption];
		}

		const size = Point.validate(sizeOption) && new Point(sizeOption);

		const anchorPosition = name === 'shadow' && options.shadowAnchor || options.iconAnchor || size && size.divideBy(2);
		const anchor = Point.validate(anchorPosition) && new Point(anchorPosition);

		img.className = `leaflet-marker-${name} ${options.className || ''}`;

		if (anchor) {
			img.style.marginLeft = `${-anchor.x}px`;
			img.style.marginTop  = `${-anchor.y}px`;
			img.style.transformOrigin = `${anchor.x}px ${anchor.y}px`;
		}

		if (size) {
			img.style.width  = `${size.x}px`;
			img.style.height = `${size.y}px`;
		}
	}

	/**
	 * @param {string} src
	 * @param {HTMLImageElement | null} el
	 */
	_createImg(src, el) {
		el ??= document.createElement('img');
		el.src = src;
		return el;
	}

	/** @param {'icon' | 'shadow'} name */
	_getIconUrl(name) {
		return window.devicePixelRatio > 1 && this.options[`${name}RetinaUrl`] || this.options[`${name}Url`];
	}
}
