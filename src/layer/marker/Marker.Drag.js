// @ts-check
import {Handler} from '../../core/Handler.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Draggable} from '../../dom/Draggable.js';
import {Bounds} from '../../geometry/Bounds.js';
import {Point} from '../../geometry/Point.js';

/** @import {DragEndEvent, LeafletEvent, MarkerMoveEvent} from '../../types.js' */
/** @import {Marker} from './Marker.js' */

// Used internally by Marker to make the markers draggable.
export class MarkerDrag extends Handler {
	static initHooks = true;

	/** @param {Marker} marker */
	constructor(marker) {
		super(marker._map);
		this._marker = marker;
		this.callInitHooks();
	}

	addHooks() {
		const icon = /** @type {HTMLElement} */ (this._marker._icon);

		if (!this._draggable) {
			/** @type {Draggable} */
			this._draggable = new Draggable(icon);
		}

		this._draggable.on({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).enable();

		icon.classList.add('leaflet-marker-draggable');
	}

	removeHooks() {
		this._draggable.off({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		this._marker._icon?.classList.remove('leaflet-marker-draggable');
	}

	moved() {
		return this._draggable?._moved;
	}

	/** @param {LeafletEvent & Partial<MarkerMoveEvent>} e */
	_adjustPan(e) {
		const marker = this._marker,
		map = marker._map,
		speed = this._marker.options.autoPanSpeed,
		padding = this._marker.options.autoPanPadding,
		icon = /** @type {HTMLElement} */ (marker._icon),
		iconPos = DomUtil.getPosition(icon),
		bounds = map.getPixelBounds(),
		origin = map.getPixelOrigin();

		const panBounds = new Bounds(
			bounds.min._subtract(origin).add(padding),
			bounds.max._subtract(origin).subtract(padding)
		);

		if (!panBounds.contains(iconPos)) {
			// Compute incremental movement
			const movement = new Point(
				(Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
				(Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

				(Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
				(Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
			).multiplyBy(speed);

			map.panBy(movement, {animate: false});

			this._draggable._newPos._add(movement);
			this._draggable._startPos._add(movement);

			DomUtil.setPosition(icon, this._draggable._newPos);
			this._onDrag(e);

			/** @type {number} */
			this._panRequest = requestAnimationFrame(this._adjustPan.bind(this, e));
		}
	}

	_onDragStart() {
		this._oldLatLng = this._marker.getLatLng();

		// When using ES6 imports it could not be set when `Popup` was not imported as well
		this._marker.closePopup?.();

		this._marker
			.fire('movestart')
			.fire('dragstart');
	}

	/** @param {LeafletEvent} e */
	_onPreDrag(e) {
		if (this._marker.options.autoPan) {
			cancelAnimationFrame(this._panRequest);
			this._panRequest = requestAnimationFrame(this._adjustPan.bind(this, e));
		}
	}

	/** @param {LeafletEvent & Partial<MarkerMoveEvent>} e */
	_onDrag(e) {
		const marker = this._marker,
		iconPos = DomUtil.getPosition(/** @type {HTMLElement} */ (marker._icon)),
		latlng = marker._map.layerPointToLatLng(iconPos);

		// Draggable only moved the icon and dropped its rotation
		marker._positionElements(iconPos);

		marker._latlng = latlng;
		e.latlng = latlng;
		e.oldLatLng = this._oldLatLng;

		marker
			.fire('move', e)
			.fire('drag', e);
	}

	/** @param {DragEndEvent} e */
	_onDragEnd(e) {
		cancelAnimationFrame(this._panRequest);

		delete this._oldLatLng;
		this._marker
			.fire('moveend')
			.fire('dragend', e);
	}
}
