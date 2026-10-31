import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Draggable} from '../../dom/Draggable.js';
import {Bounds} from '../../geometry/Bounds.js';
import {Point} from '../../geometry/Point.js';

/** @import {DragEndEvent, LeafletEvent, MarkerMoveEvent} from '../../types.js' */
/** @import {Marker} from './Marker.js' */

/** @type {Record<string, Point>} */
const arrows = {
	ArrowLeft: new Point(-1, 0),
	ArrowRight: new Point(1, 0),
	ArrowUp: new Point(0, -1),
	ArrowDown: new Point(0, 1)
};

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

		DomEvent.on(icon, 'keydown keyup blur', this._onKey, this);

		icon.classList.add('leaflet-marker-draggable');
	}

	removeHooks() {
		this._keyDrag = false; // disabling the Draggable below ends a keyboard drag in progress, as it does a pointer drag

		this._draggable.off({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		DomEvent.off(this._draggable._element, 'keydown keyup blur', this._onKey, this);

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

	// Arrow keys move a focused marker. Holding a key down is one drag, driven through the Draggable like a pointer
	// drag (so the two can't overlap), and ends on keyup or blur.
	/** @param {KeyboardEvent | FocusEvent} e */
	_onKey(e) {
		const k = /** @type {KeyboardEvent} */ (e), // all but blur
		dir = arrows[k.key],
		draggable = this._draggable,
		{options, _map: map} = this._marker;

		if (e.type !== 'keydown') {
			if (this._keyDrag) {
				this._keyDrag = false;
				draggable.finishDrag();
			}

		} else if (dir && k.target === draggable._element && !(k.altKey || k.ctrlKey || k.metaKey)) {
			e.preventDefault(); // don't scroll the page

			if (!this._keyDrag) {
				if (Draggable._dragging) { return; }
				Draggable._dragging = draggable;
				draggable._startPos = draggable._newPos = DomUtil.getPosition(draggable._element);
				draggable._moved = draggable._moving = this._keyDrag = true;
				draggable.fire('dragstart');
			}

			draggable._newPos = draggable._newPos.add(dir.multiplyBy(k.shiftKey ? 30 : 10));
			draggable._lastEvent = k;
			draggable._updatePosition();

			if (options.autoPan) {
				map.panInside(this._marker._latlng, {padding: options.autoPanPadding, animate: false});
			}
		}
	}
}
