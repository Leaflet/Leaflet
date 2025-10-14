/*
/* @namespace DomEvent
 * @section Pointer detection
 * Detects the pointers that are currently active on the document.
 */

let activePointers = new Map();
let initialized = false;

// @function enablePointerDetection()
// Enables pointer detection for the document.
function enablePointerDetection(ownerDocument = window.document) {
	if (initialized) {
		return;
	}
	initialized = true;
	ownerDocument.addEventListener('pointerdown', _onSet, {capture: true});
	ownerDocument.addEventListener('pointermove', _onUpdate, {capture: true});
	ownerDocument.addEventListener('pointerup', _onDelete, {capture: true});
	ownerDocument.addEventListener('pointercancel', _onDelete, {capture: true});
	activePointers = new Map();
}

// @function disablePointerDetection()
// Disables pointer detection for the document.
function disablePointerDetection(ownerDocument = window.document) {
	ownerDocument.removeEventListener('pointerdown', _onSet, {capture: true});
	ownerDocument.removeEventListener('pointermove', _onUpdate, {capture: true});
	ownerDocument.removeEventListener('pointerup', _onDelete, {capture: true});
	ownerDocument.removeEventListener('pointercancel', _onDelete, {capture: true});
	initialized = false;
}

function _onSet(e) {
	activePointers.set(e.pointerId, e);
}

function _onUpdate(e) {
	if (activePointers.has(e.pointerId)) {
		activePointers.set(e.pointerId, e);
	}
}

function _onDelete(e) {
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

