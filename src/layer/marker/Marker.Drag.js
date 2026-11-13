import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Draggable} from '../../dom/Draggable.js';
import {Point} from '../../geometry/Point.js';

/** @import {DragEndEvent, DragStartEvent, LeafletEvent, MarkerMoveEvent} from '../../types.js' */
/** @import {LatLng} from '../../geo/LatLng.js' */
/** @import {Marker} from './Marker.js' */

/** @type {Record<string, [number, number]>} */
const arrows = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]};

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
		padding = new Point(this._marker.options.autoPanPadding),
		icon = /** @type {HTMLElement} */ (marker._icon),
		iconPos = DomUtil.getPosition(icon),
		bounds = map.getPixelBounds(),
		origin = map.getPixelOrigin(),
		min = bounds.min._subtract(origin)._add(padding),
		max = bounds.max._subtract(origin)._subtract(padding),
		// how far the icon is past the padded bounds on each axis (0 if within)
		dx = Math.max(iconPos.x - max.x, 0) + Math.min(iconPos.x - min.x, 0),
		dy = Math.max(iconPos.y - max.y, 0) + Math.min(iconPos.y - min.y, 0);

		if (dx || dy) {
			// pan faster the deeper the icon goes into the padding, but not past maxBounds
			const movement = map._limitOffset(new Point(dx / padding.x * speed, dy / padding.y * speed),
				map.options.maxBounds)._round();

			if (!movement.x && !movement.y) { return; }

			map.panBy(movement, {animate: false});

			this._draggable._newPos._add(movement);
			this._draggable._startPos._add(movement);

			DomUtil.setPosition(icon, this._draggable._newPos);
			this._onDrag(e);

			/** @type {number} */
			this._panRequest = requestAnimationFrame(this._adjustPan.bind(this, e));
		}
	}

	/** @param {DragStartEvent} e */
	_onDragStart(e) {
		/** @type {LatLng} */
		this._oldLatLng = this._marker.getLatLng();

		// When using ES6 imports it could not be set when `Popup` was not imported as well
		this._marker.closePopup?.();

		const {originalEvent} = e;
		this._marker
			.fire('movestart', {originalEvent})
			.fire('dragstart', {originalEvent});
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
		latlng = marker._map.layerPointToLatLng(iconPos),
		{alt} = this._oldLatLng;

		if (alt !== undefined) { latlng.alt = alt; }

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
				draggable.fire('dragstart', {originalEvent: k});
			}

			// not through _updatePosition, whose predrag would start the pointer autoPan loop
			draggable._newPos = draggable._newPos.add(new Point(...dir).multiplyBy(k.shiftKey ? 30 : 10));
			DomUtil.setPosition(draggable._element, draggable._newPos);
			draggable.fire('drag', {originalEvent: k});

			if (options.autoPan) {
				map.panInside(this._marker._latlng, {padding: options.autoPanPadding, animate: false});
			}
		}
	}
}
