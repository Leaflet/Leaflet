import {Evented} from '../core/Events.js';
import * as DomEvent from './DomEvent.js';
import {getPointers} from './DomEventUtil.js';
import * as DomUtil from './DomUtil.js';
import * as Util from '../core/Util.js';
import {Point} from '../geometry/Point.js';

/** @import {Defaults, DragEndEvent, DraggableDefaults, DraggableEventMap, DraggableOptions, LeafletEvent} from '../types.js' */

const defaultOptions = {
	/**
	 * The max number of pixels a user can shift the pointer during a click for
	 * it to be considered a valid click (as opposed to a pointer drag).
	 */
	clickTolerance: 3
};

/** @typedef {typeof defaultOptions} DraggableDefaultsValues */

/**
 * @typedef {Object} DraggableEvents
 * @property {LeafletEvent} down Fired when a drag is about to start.
 * @property {LeafletEvent} dragstart Fired when a drag starts
 * @property {LeafletEvent} predrag Fired continuously during dragging *before* each corresponding update of the
 *   element's position.
 * @property {LeafletEvent} drag Fired continuously during dragging.
 * @property {DragEndEvent} dragend Fired when the drag ends.
 */

/**
 * @typedef {Object} DragEndEventProps
 * @property {number} distance The distance in pixels the draggable element was moved by.
 * @property {boolean} [noInertia] Whether the drag should end without inertia (set when the
 *   draggable is disabled mid-drag).
 */

/**
 * A class for making DOM elements draggable. Used internally
 * for map and marker dragging. Works on any DOM element
 * @example
 * ```js
 * const draggable = new Draggable(elementToDrag);
 * draggable.enable();
 * ```
 *
 * @extends {Evented<DraggableOptions & DraggableDefaults, DraggableEventMap>}
 */
export class Draggable extends Evented {

	static initHooks = true;

	/** @type {Defaults<DraggableOptions>} */
	static defaultOptions = defaultOptions;

	// the draggable being dragged, so that only one is dragged at a time
	/** @type {Draggable | false} */
	static _dragging = false;

	/**
	 * Creates a `Draggable` object for moving `element` when you start dragging
	 * the `dragStartTarget` element (equals `element` itself by default).
	 * @param {HTMLElement} element
	 * @param {HTMLElement} [dragStartTarget]
	 * @param {Partial<DraggableOptions>} [options]
	 */
	constructor(element, dragStartTarget, options) {
		if (typeof options === 'boolean') {
			throw new Error('Draggable: the preventOutline argument is removed in Leaflet 2. Pass options as the third argument.');
		}
		super();

		Util.setOptions(this, options);

		this._element = element;
		this._dragStartTarget = dragStartTarget ?? element;

		this.callInitHooks();
	}

	/** Enables the dragging ability */
	enable() {
		if (this._enabled) { return; }

		DomEvent.on(this._dragStartTarget, 'pointerdown', this._onDown, this);

		this._enabled = true;
	}

	/** Disables the dragging ability */
	disable() {
		if (!this._enabled) { return; }

		// If we're currently dragging this draggable,
		// disabling it counts as first ending the drag.
		if (Draggable._dragging === this) {
			this.finishDrag(true);
		}

		DomEvent.off(this._dragStartTarget, 'pointerdown', this._onDown, this);

		this._enabled = false;
		this._moved = false;
	}

	/** @param {PointerEvent} e */
	_onDown(e) {
		this._moved = false;

		if (this._element.classList.contains('leaflet-zoom-anim')) { return; }

		const pointers = getPointers().length;
		if (pointers > 1) {
			// Finish dragging to avoid conflict with touchZoom
			if (Draggable._dragging === this) {
				this.finishDrag();
			}
			return;
		}

		if (Draggable._dragging || e.shiftKey || (e.button !== 0 && e.pointerType !== 'touch')) { return; }
		Draggable._dragging = this;  // Prevent dragging multiple objects at once.

		DomUtil.disableImageDrag();

		if (this._moving) { return; }

		// outside a map, nothing tracks pointers or captures them, so capture this one to keep its moves coming
		if (!pointers && e.isTrusted) { /** @type {Element} */ (e.target).setPointerCapture(e.pointerId); }

		this.fire('down');

		const sizedParent = DomUtil.getSizedParentNode(this._element);

		/** @type {Point} */
		this._startPoint = new Point(e.clientX, e.clientY);
		/** @type {Point} */
		this._startPos = DomUtil.getPosition(this._element);

		// Cache the scale, so that we can continuously compensate for it during drag (_onMove).
		/** @type {{x: number, y: number}} */
		this._parentScale = DomUtil.getScale(sizedParent);

		DomEvent.on(this._dragStartTarget, 'pointermove', this._onMove, this);
		DomEvent.on(this._dragStartTarget, 'pointerup pointercancel lostpointercapture', this._onUp, this);
	}

	/** @param {PointerEvent} e */
	_onMove(e) {
		if (getPointers().length > 1) {
			this._moved = true;
			return;
		}

		const offset = new Point(e.clientX, e.clientY)._subtract(this._startPoint);

		// once the drag has started, the pointer must be followed even when it comes back near the start point
		const dist = Math.abs(offset.x) + Math.abs(offset.y);
		if (!this._moved && (!dist || dist < this.options.clickTolerance)) { return; }

		// We assume that the parent container's position, border and scale do not change for the duration of the drag.
		// Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
		// and we can use the cached value for the scale.
		offset.x /= this._parentScale.x;
		offset.y /= this._parentScale.y;

		if (e.cancelable) {
			e.preventDefault();
		}

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;

			// on the map container rather than the body, so that toggling it doesn't restyle the whole page
			this._draggingContainer = this._element.closest('.leaflet-container') ?? this._element;
			this._draggingContainer.classList.add('leaflet-dragging');

			/** @type {Element | null} */
			this._lastTarget = /** @type {Element} */ (e.target);
			this._lastTarget.classList.add('leaflet-drag-target');
		}

		/** @type {Point} */
		this._newPos = this._startPos.add(offset);
		this._moving = true;

		this._lastEvent = e;
		this._updatePosition();
	}

	_updatePosition() {
		const e = {originalEvent: this._lastEvent};

		this.fire('predrag', e);

		// pointer events can have fractional coordinates; snap them to device pixels, since an edge in the middle of
		// one is drawn partly transparent on both sides and shows a seam between tiles
		const dpr = window.devicePixelRatio;
		this._newPos = this._newPos.multiplyBy(dpr)._round()._divideBy(dpr);
		DomUtil.setPosition(this._element, this._newPos);

		this.fire('drag', e);
	}

	/** @param {PointerEvent} e */
	_onUp(e) {
		// releasing the button outside the window may fire no pointerup, only a lostpointercapture with no buttons;
		// capture lost while the button is still held (e.g. the pressed element was removed) shouldn't end the drag
		if (e.type === 'lostpointercapture' && e.buttons) { return; }
		this.finishDrag();
	}

	/**
	 * Ends the current drag, firing `dragend` if the element was moved. `noInertia` is passed on in the event, so
	 * that the map doesn't keep panning after a drag ended this way.
	 * @param {boolean} [noInertia]
	 */
	finishDrag(noInertia) {
		this._draggingContainer?.classList.remove('leaflet-dragging');
		this._draggingContainer = null;

		if (this._lastTarget) {
			this._lastTarget.classList.remove('leaflet-drag-target');
			this._lastTarget = null;
		}

		DomEvent.off(this._dragStartTarget, 'pointermove', this._onMove, this);
		DomEvent.off(this._dragStartTarget, 'pointerup pointercancel lostpointercapture', this._onUp, this);

		DomUtil.enableImageDrag();

		const fireDragend = this._moved && this._moving;

		this._moving = false;
		Draggable._dragging = false;

		if (fireDragend) {
			this.fire('dragend', {
				noInertia,
				distance: this._newPos.distanceTo(this._startPos)
			});
		}
	}

}
