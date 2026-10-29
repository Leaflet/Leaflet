const activePointers = new Map();

/**
 * Enables pointer detection and capture for the document.
 * @category Pointer detection
 * @param {HTMLElement} el
 */
function enablePointerDetection(el) {
	el.addEventListener('pointerdown', _onSet, {capture: true});
	el.addEventListener('pointermove', _onUpdate, {capture: true});
	el.addEventListener('pointerup', _onDelete, {capture: true});
	el.addEventListener('pointercancel', _onDelete, {capture: true});
	activePointers.clear();
}

/**
 * Disables pointer detection and capture for the document.
 * @category Pointer detection
 * @param {HTMLElement} el
 */
function disablePointerDetection(el) {
	el.removeEventListener('pointerdown', _onSet, {capture: true});
	el.removeEventListener('pointermove', _onUpdate, {capture: true});
	el.removeEventListener('pointerup', _onDelete, {capture: true});
	el.removeEventListener('pointercancel', _onDelete, {capture: true});
}

// capturing throws for synthetic pointers the browser doesn't know about, so only capture real ones
function _onSet(e) {
	if (e.isTrusted) { e.target.setPointerCapture(e.pointerId); }
	activePointers.set(e.pointerId, e);
}

function _onUpdate(e) {
	if (activePointers.has(e.pointerId)) {
		activePointers.set(e.pointerId, e);
	}
}

function _onDelete(e) {
	if (e.isTrusted) { e.target.releasePointerCapture(e.pointerId); }
	activePointers.delete(e.pointerId);
}

/**
 * Returns the active pointers on the document.
 * @category Pointer detection
 * @returns {LeafletPointerEvent[]}
 */
function getPointers() {
	return [...activePointers.values()];
}

export {
	enablePointerDetection,
	disablePointerDetection,
	getPointers
};

