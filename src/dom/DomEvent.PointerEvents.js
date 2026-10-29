// @ts-check

/**
 * Detects the pointers that are currently active on the document. Available as `DomEvent.PointerEvents`.
 * @module PointerEvents
 */

/** @type {Map<number, PointerEvent>} */
const activePointers = new Map();

/**
 * Enables pointer detection and capture for the document.
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
 * @param {HTMLElement} el
 */
function disablePointerDetection(el) {
	el.removeEventListener('pointerdown', _onSet, {capture: true});
	el.removeEventListener('pointermove', _onUpdate, {capture: true});
	el.removeEventListener('pointerup', _onDelete, {capture: true});
	el.removeEventListener('pointercancel', _onDelete, {capture: true});
}

// capturing throws for synthetic pointers the browser doesn't know about, so only capture real ones
/** @param {PointerEvent} e */
function _onSet(e) {
	if (e.isTrusted) { /** @type {Element} */ (e.target).setPointerCapture(e.pointerId); }
	activePointers.set(e.pointerId, e);
}

/** @param {PointerEvent} e */
function _onUpdate(e) {
	if (activePointers.has(e.pointerId)) {
		activePointers.set(e.pointerId, e);
	}
}

/** @param {PointerEvent} e */
function _onDelete(e) {
	if (e.isTrusted) { /** @type {Element} */ (e.target).releasePointerCapture(e.pointerId); }
	activePointers.delete(e.pointerId);
}

/**
 * Returns the active pointers on the document.
 * @returns {PointerEvent[]}
 */
function getPointers() {
	return [...activePointers.values()];
}

export {
	enablePointerDetection,
	disablePointerDetection,
	getPointers
};

