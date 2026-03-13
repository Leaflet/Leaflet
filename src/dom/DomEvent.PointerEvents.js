/*
/* @namespace DomEvent
 * @section Pointer detection
 * Detects the pointers that are currently active on the document.
 */

// NOTE: There is an uncovered rare edge case: creating a new instance of a
// Leaflet map while a drag or pinch-zoom operation is happening on a different
// instance of another Leaflet map in the same HTML document.

const activePointers = new Map();
let initialized = false;

// @function enablePointerDetection(el: HTMLElement)
// Enables pointer detection and capture for the document.
function enablePointerDetection(el) {
	if (initialized) {
		return;
	}
	initialized = true;
	el.addEventListener('pointerdown', _onSet, {capture: true});
	el.addEventListener('pointermove', _onUpdate, {capture: true});
	el.addEventListener('pointerup', _onDelete, {capture: true});
	el.addEventListener('pointercancel', _onDelete, {capture: true});
	activePointers.clear();
}

// @function disablePointerDetection(el: HTMLElement)
// Disables pointer detection and capture for the document.
function disablePointerDetection(el) {
	el.removeEventListener('pointerdown', _onSet, {capture: true});
	el.removeEventListener('pointermove', _onUpdate, {capture: true});
	el.removeEventListener('pointerup', _onDelete, {capture: true});
	el.removeEventListener('pointercancel', _onDelete, {capture: true});
	initialized = false;
}

function _onSet(e) {
	e.target.setPointerCapture(e.pointerId);
	activePointers.set(e.pointerId, e);
}

function _onUpdate(e) {
	if (activePointers.has(e.pointerId)) {
		activePointers.set(e.pointerId, e);
	}
}

function _onDelete(e) {
	e.target.releasePointerCapture(e.pointerId);
	activePointers.delete(e.pointerId);
}

// @function getPointers(): PointerEvent[]
// Returns the active pointers on the document.
function getPointers() {
	return [...activePointers.values()];
}

// @function cleanupPointers()
// Clears the detected pointers on the document.
// Note: This function should be not necessary to call, as the pointers are automatically cleared with `pointerup`, `pointercancel` and `pointerout` events.
function cleanupPointers() {
	activePointers.clear();
}

export {
	enablePointerDetection,
	disablePointerDetection,
	getPointers,
	cleanupPointers
};

