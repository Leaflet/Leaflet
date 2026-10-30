// @ts-check
import {DivOverlay} from './DivOverlay.js';
import {Point} from '../geometry/Point.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as Util from '../core/Util.js';

/** @import {Defaults, DivOverlayEventMap, PointExpression, TooltipOptions, ZoomAnimEvent} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */
/** @import {LeafletMap} from '../map/Map.js' */

const defaultOptions = {
	/** `Map pane` where the tooltip will be added. */
	pane: 'tooltipPane',

	/**
	 * Optional offset of the tooltip position.
	 * @type {PointExpression}
	 */
	offset: [0, 0],

	/**
	 * Direction where to open the tooltip. Possible values are: `right`, `left`, `top`, `bottom`, `center`, `auto`.
	 * `auto` will dynamically switch between `right` and `left` according to the tooltip position on the map.
	 * @type {'right' | 'left' | 'top' | 'bottom' | 'center' | 'auto'}
	 */
	direction: 'auto',

	/** Whether to open the tooltip permanently or only on pointerover. */
	permanent: false,

	/** If true, the tooltip will follow the pointer instead of being fixed at the feature center. */
	sticky: false,

	/** Tooltip container opacity. */
	opacity: 0.9
};

/** @typedef {typeof defaultOptions} TooltipDefaults */


/**
 * Used to display small texts on top of map layers.
 * @example
 * If you want to just bind a tooltip to marker:
 *
 * ```js
 * marker.bindTooltip("my tooltip text").openTooltip();
 * ```
 * Path overlays like polylines also have a `bindTooltip` method.
 *
 * A tooltip can be also standalone:
 *
 * ```js
 * const tooltip = new Tooltip()
 * 	.setLatLng(latlng)
 * 	.setContent('Hello world!<br />This is a nice tooltip.')
 * 	.addTo(map);
 * ```
 * or
 * ```js
 * const tooltip = new Tooltip(latlng, {content: 'Hello world!<br />This is a nice tooltip.'})
 * 	.addTo(map);
 * ```
 *
 * **Security note.** Tooltip string content is rendered as HTML. If your content
 * may include untrusted input (e.g. data from users or external APIs), sanitize
 * it with a library like [DOMPurify](https://github.com/cure53/DOMPurify), or
 * build a DOM element using `textContent` to render it as plain text:
 *
 * ```js
 * const el = document.createElement('div');
 * el.textContent = untrustedString;
 * marker.bindTooltip(el);
 * ```
 *
 * Note about tooltip offset. Leaflet takes two options in consideration
 * for computing tooltip offsetting:
 * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
 *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
 *   move it to the bottom. Negatives will move to the left and top.
 * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
 *   should adapt this value if you use a custom icon.
 *
 * @template {TooltipOptions} [O=TooltipOptions]
 * @template {DivOverlayEventMap} [E=DivOverlayEventMap]
 * @extends {DivOverlay<O, E>}
 */
export class Tooltip extends DivOverlay {

	/** @type {Defaults<TooltipOptions>} */
	static defaultOptions = defaultOptions;

	/** @param {LeafletMap} map */
	onAdd(map) {
		super.onAdd(map);
		this.setOpacity(this.options.opacity);

		map.fire('tooltipopen', {tooltip: this});

		if (this._source) {
			this.addEventParent(this._source);

			this._source.fire('tooltipopen', {tooltip: this}, true);
		}
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		super.onRemove(map);

		map.fire('tooltipclose', {tooltip: this});

		if (this._source) {
			this.removeEventParent(this._source);

			this._source.fire('tooltipclose', {tooltip: this}, true);
		}
	}

	getEvents() {
		const events = super.getEvents();

		if (!this.options.permanent) {
			events.preclick = this.close;
		}

		return events;
	}

	_initLayout() {
		const prefix = 'leaflet-tooltip',
		className = `${prefix} ${this.options.className || ''} leaflet-zoom-animated`;

		this._contentNode = this._container = DomUtil.create('div', className);

		this._container.setAttribute('role', 'tooltip');
		this._container.setAttribute('id', `leaflet-tooltip-${Util.stamp(this)}`);
	}

	_updateLayout() {}

	_adjustPan() {}

	/** @param {Point} pos */
	_setPosition(pos) {
		let subX, subY, direction = this.options.direction;
		const map = this._map,
		container = this._container,
		centerPoint = map.latLngToContainerPoint(map.getCenter()),
		tooltipPoint = map.layerPointToContainerPoint(pos),
		tooltipWidth = container.offsetWidth,
		tooltipHeight = container.offsetHeight,
		offset = new Point(this.options.offset),
		anchor = this._getAnchor();

		if (direction === 'top') {
			subX = tooltipWidth / 2;
			subY = tooltipHeight;
		} else if (direction === 'bottom') {
			subX = tooltipWidth / 2;
			subY = 0;
		} else if (direction === 'center') {
			subX = tooltipWidth / 2;
			subY = tooltipHeight / 2;
		} else if (direction === 'right') {
			subX = 0;
			subY = tooltipHeight / 2;
		} else if (direction === 'left') {
			subX = tooltipWidth;
			subY = tooltipHeight / 2;
		} else if (tooltipPoint.x < centerPoint.x) {
			direction = 'right';
			subX = 0;
			subY = tooltipHeight / 2;
		} else {
			direction = 'left';
			subX = tooltipWidth + (offset.x + anchor.x) * 2;
			subY = tooltipHeight / 2;
		}

		pos = pos.subtract(new Point(subX, subY, true)).add(offset).add(anchor);

		container.classList.remove(
			'leaflet-tooltip-right',
			'leaflet-tooltip-left',
			'leaflet-tooltip-top',
			'leaflet-tooltip-bottom'
		);
		container.classList.add(`leaflet-tooltip-${direction}`);
		DomUtil.setPosition(container, pos);
	}

	_updatePosition() {
		const pos = this._map.latLngToLayerPoint(/** @type {LatLng} */ (this._latlng))._round();
		this._setPosition(pos);
	}

	/** @param {number} opacity */
	setOpacity(opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			this._container.style.opacity = `${opacity}`;
		}
	}

	/** @param {ZoomAnimEvent} e */
	_animateZoom(e) {
		const pos = this._map._latLngToNewLayerPoint(/** @type {LatLng} */ (this._latlng), e.zoom, e.center);
		this._setPosition(pos);
	}

	_getAnchor() {
		// Where should we anchor the tooltip on the source layer?
		return new Point(this._source?._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
	}

}
