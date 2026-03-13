/*
/* @namespace DomEvent
 * @section Pointer detection
 * Detects the pointers that are currently active on the document.
 */

const activePointers = new Map();

// @function enablePointerDetection(el: HTMLElement)
// Enables pointer detection and capture for the document.
function enablePointerDetection(el) {
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
}

function _onSet(e) {
	e.isTrusted && e.target.setPointerCapture(e.pointerId);
	activePointers.set(e.pointerId, e);
}

function _onUpdate(e) {
	if (activePointers.has(e.pointerId)) {
		activePointers.set(e.pointerId, e);
	}
}

function _onDelete(e) {
	e.isTrusted && e.target.releasePointerCapture(e.pointerId);
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

