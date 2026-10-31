import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Draggable} from '../../dom/Draggable.js';
import {Bounds} from '../../geometry/Bounds.js';
import {Point} from '../../geometry/Point.js';
import {KeyboardHandler} from '../../map/handler/KeyboardHandler.js';

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

		DomEvent.on(icon, {keydown: this._onKeyDown, keyup: this._onKeyUp, blur: this._onKeyUp}, this);

		icon.classList.add('leaflet-marker-draggable');
	}

	removeHooks() {
		this._draggable.off({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		DomEvent.off(this._draggable._element, {keydown: this._onKeyDown, keyup: this._onKeyUp, blur: this._onKeyUp}, this);

		this._marker._icon?.classList.remove('leaflet-marker-draggable');
	}

	/** Returns `true` if the current or last drag moved the marker, e.g. to ignore the click that ends a drag. */
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

	// arrow keys move a focused marker; holding a key down is one drag, which ends on keyup or blur
	/** @param {KeyboardEvent} e */
	_onKeyDown(e) {
		const {left, right, up, down} = KeyboardHandler.keys,
		x = +right.includes(e.key) - +left.includes(e.key),
		y = +down.includes(e.key) - +up.includes(e.key),
		marker = this._marker,
		icon = this._draggable._element;

		if (!(x || y) || e.target !== icon || e.altKey || e.ctrlKey || e.metaKey) { return; }

		e.preventDefault(); // don't scroll the page

		const pos = DomUtil.getPosition(icon);
		if (!this._keyStartPos) {
			this._keyStartPos = pos;
			this._draggable.fire('dragstart');
		}

		DomUtil.setPosition(icon, pos.add(new Point(x, y).multiplyBy(e.shiftKey ? 30 : 10)));
		this._draggable.fire('drag', {originalEvent: e});

		if (marker.options.autoPan) {
			marker._map.panInside(marker.getLatLng(), {padding: marker.options.autoPanPadding, animate: false});
		}
	}

	_onKeyUp() {
		if (!this._keyStartPos) { return; }

		const distance = DomUtil.getPosition(this._draggable._element).distanceTo(this._keyStartPos);
		delete this._keyStartPos;
		this._draggable.fire('dragend', {distance});
	}
}
