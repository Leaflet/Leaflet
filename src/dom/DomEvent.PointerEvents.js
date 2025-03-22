/*
 * Detects the pointers that are currently active on the document.
 */

let activePointers = new Map();
let initialized = false;

// @method enablePointerDetection()
// Enables pointer detection for the document.
function enablePointerDetection() {
	if (initialized) {
		return;
	}
	initialized = true;
	document.addEventListener('pointerdown', _onSet, {capture: true});
	document.addEventListener('pointermove', _onSet, {capture: true});
	document.addEventListener('pointerover', _onSet, {capture: true});
	document.addEventListener('pointerup', _onDelete, {capture: true});
	document.addEventListener('pointercancel', _onDelete, {capture: true});
	document.addEventListener('pointerout', _onDelete, {capture: true});
	activePointers = new Map();
}

// @method disablePointerDetection()
// Disables pointer detection for the document.
function disablePointerDetection() {
	document.removeEventListener('pointerdown', _onSet, {capture: true});
	document.removeEventListener('pointermove', _onSet, {capture: true});
	document.removeEventListener('pointerover', _onSet, {capture: true});
	document.removeEventListener('pointerup', _onDelete, {capture: true});
	document.removeEventListener('pointercancel', _onDelete, {capture: true});
	document.removeEventListener('pointerout', _onDelete, {capture: true});
	initialized = false;
}

function _onSet(e) {
	activePointers.set(e.pointerId, e);
}

function _onDelete(e) {
	activePointers.delete(e.pointerId);
}

// @method getPointers(): PointerEvents[]
// Returns the active pointers on the document.
function getPointers() {
	return [...activePointers.values()];
}

// @method cleanupPointers()
// Clears the detected pointers on the document.
// Note: This method should be not necessary to call, as the pointers are automatically cleared with `pointerup`, `pointercancel`, `pointerout` events.
function cleanupPointers() {
	activePointers.clear();
}

export {
	enablePointerDetection,
	disablePointerDetection,
	getPointers,
	cleanupPointers
};

