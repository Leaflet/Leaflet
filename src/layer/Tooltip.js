import {DivOverlay} from './DivOverlay.js';
import {Point} from '../geometry/Point.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as Util from '../core/Util.js';

/** @import {Defaults, DivOverlayEventMap, PointExpression, TooltipDefaults, TooltipOptions, ZoomAnimEvent} from '../types.js' */
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

/** @typedef {typeof defaultOptions} TooltipDefaultsValues */

/**
 * Which point of the tooltip (as a fraction of its width and height) sits at the anchor, for each direction.
 * @type {Record<string, [number, number]>}
 */
const directions = {top: [0.5, 1], bottom: [0.5, 0], center: [0.5, 0.5], right: [0, 0.5], left: [1, 0.5]};

/**
 * @typedef {Object} TooltipEventProps
 * @property {Tooltip} tooltip The tooltip that was opened or closed.
 */

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
 * **Security note.** Tooltip string content is rendered as HTML. If your content may include untrusted input (e.g.
 * data from users or external APIs), sanitize it first, or build a DOM element using `textContent` to render it as
 * plain text:
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
 * @extends {DivOverlay<O & TooltipDefaults, E>}
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
			this._source.getElement?.()?.setAttribute('aria-describedby', this._container.id);

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
		this._container.id = `leaflet-tooltip-${Util.stamp(this)}`;
	}

	_updateLayout() {}

	_adjustPan() {}

	/** @param {Point} pos */
	_setPosition(pos) {
		const container = this._container,
		shift = this._getAnchor().add(this.options.offset);
		let direction = this.options.direction;

		if (!(direction in directions)) { // auto: open away from the map center, mirroring the offset and anchor
			direction = pos.x <= this._map._getCenterLayerPoint().x ? 'right' : 'left';
			if (direction === 'left') { shift.x = -shift.x; }
		}
		const [fx, fy] = directions[direction];

		for (const d in directions) {
			container.classList.toggle(`leaflet-tooltip-${d}`, d === direction);
		}
		// a percentage translate follows the tooltip's own size, so it never has to be measured (which would
		// force a reflow per tooltip on every zoom); browsers without CSS round() ignore the second value
		container.style.translate = `${-fx * 100}% ${-fy * 100}%`;
		container.style.translate = `round(${-fx * 100}%, 1px) round(${-fy * 100}%, 1px)`;
		DomUtil.setPosition(container, pos._add(shift));
	}

	_updatePosition() {
		const pos = this._map.latLngToLayerPoint(/** @type {LatLng} */ (this._latlng))._round();
		this._setPosition(pos);
	}

	/**
	 * Sets the opacity of the tooltip.
	 * @param {number} opacity
	 */
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
