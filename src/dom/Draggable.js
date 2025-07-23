import {Evented} from '../core/Events.js';
import * as DomEvent from './DomEvent.js';
import * as DomUtil from './DomUtil.js';
import * as Util from '../core/Util.js';
import {Point} from '../geometry/Point.js';
import * as PointerEvents from './DomEvent.PointerEvents.js';

/*
 * @class Draggable
 * @inherits Evented
 *
 * A class for making DOM elements draggable.
 * Used internally for map and marker dragging. Works on any DOM element
 *
 * @example
 * ```js
 * const draggable = new Draggable(elementToDrag);
 * draggable.enable();
 * ```
 */

export class Draggable extends Evented {

	static {
		this.setDefaultOptions({
			// @section
			// @aka Draggable options
			// @option clickTolerance: Number = 3
			// The max number of pixels a user can shift the pointer during a click
			// for it to be considered a valid click (as opposed to a pointer drag).
			clickTolerance: 3
		});
	}

	// @constructor Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
	// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
	initialize(element, dragStartTarget, preventOutline, options) {
		Util.setOptions(this, options);

		this._element = element;
		this._dragStartTarget = dragStartTarget ?? element;
		this._preventOutline = preventOutline;
	}

	// @method enable()
	// Enables the dragging ability
	enable() {
		if (this._enabled) { return; }

		DomEvent.on(this._dragStartTarget, 'pointerdown', this._onDown, this);

		this._enabled = true;
	}

	// @method disable()
	// Disables the dragging ability
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

	_onDown(e) {
		// Ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (!this._enabled) { return; }

		this._moved = false;

		if (this._element.classList.contains('leaflet-zoom-anim')) { return; }

		if (PointerEvents.getPointers().length !== 1) {
			// Finish dragging to avoid conflict with touchZoom
			if (Draggable._dragging === this) {
				this.finishDrag();
			}
			return;
		}

		if (Draggable._dragging || e.shiftKey || (e.button !== 0 && e.pointerType !== 'touch')) { return; }
		Draggable._dragging = this;  // Prevent dragging multiple objects at once.

		if (this._preventOutline) {
			DomUtil.preventOutline(this._element);
		}

		DomUtil.disableImageDrag();
		DomUtil.disableTextSelection();

		if (this._moving) { return; }

		// @event down: Event
		// Fired when a drag is about to start.
		this.fire('down');

		const sizedParent = DomUtil.getSizedParentNode(this._element);

		this._startPoint = new Point(e.clientX, e.clientY);
		this._startPos = DomUtil.getPosition(this._element);

		// Cache the scale, so that we can continuously compensate for it during drag (_onMove).
		this._parentScale = DomUtil.getScale(sizedParent);

		DomEvent.on(document, 'pointermove', this._onMove, this);
		DomEvent.on(document, 'pointerup pointercancel', this._onUp, this);
	}

	_onMove(e) {
		// Ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (!this._enabled) { return; }

		if (PointerEvents.getPointers().length > 1) {
			this._moved = true;
			return;
		}

		const offset = new Point(e.clientX, e.clientY)._subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

		// We assume that the parent container's position, border and scale do not change for the duration of the drag.
		// Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
		// and we can use the cached value for the scale.
		offset.x /= this._parentScale.x;
		offset.y /= this._parentScale.y;

		if (e.cancelable) {
			DomEvent.preventDefault(e);
		}

		if (!this._moved) {
			// @event dragstart: Event
			// Fired when a drag starts
			this.fire('dragstart');

			this._moved = true;

			document.body.classList.add('leaflet-dragging');

			this._lastTarget = e.target ?? e.srcElement;
			this._lastTarget.classList.add('leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		this._lastEvent = e;
		this._updatePosition();
	}

	_updatePosition() {
		const e = {originalEvent: this._lastEvent};

		// @event predrag: Event
		// Fired continuously during dragging *before* each corresponding
		// update of the element's position.
		this.fire('predrag', e);
		DomUtil.setPosition(this._element, this._newPos);

		// @event drag: Event
		// Fired continuously during dragging.
		this.fire('drag', e);
	}

	_onUp() {
		// Ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (!this._enabled) { return; }
		this.finishDrag();
	}

	finishDrag(noInertia) {
		document.body.classList.remove('leaflet-dragging');

		if (this._lastTarget) {
			this._lastTarget.classList.remove('leaflet-drag-target');
			this._lastTarget = null;
		}

		DomEvent.off(document, 'pointermove', this._onMove, this);
		DomEvent.off(document, 'pointerup pointercancel', this._onUp, this);

		DomUtil.enableImageDrag();
		DomUtil.enableTextSelection();

		const fireDragend = this._moved && this._moving;

		this._moving = false;
		Draggable._dragging = false;

		if (fireDragend) {
			// @event dragend: DragEndEvent
			// Fired when the drag ends.
			this.fire('dragend', {
				noInertia,
				distance: this._newPos.distanceTo(this._startPos)
			});
		}
	}

}
