// @ts-check

// Internal DOM event helpers, kept out of the public `DomEvent` namespace.

// native events of Leaflet events that `DomEvent.stopPropagation` was called on, so the map stops firing them on
// more targets
/** @type {WeakSet<Event>} */
export const stoppedEvents = new WeakSet();

// elements that `DomEvent.disableClickPropagation` was called on
/** @type {WeakSet<Node>} */
export const clickDisabledElements = new WeakSet();

// elements whose DOM events the map ignores, because they fire them on the map's layers themselves (like `Canvas`)
/** @type {WeakSet<EventTarget>} */
export const mapHandlingDisabled = new WeakSet();

/**
 * Gets the wheel pixel factor based on the devicePixelRatio
 * @returns {number}
 */
export function getWheelPxFactor() {
	// a wheel notch gives 100-120px in most browsers, so halving it fits the default 60px per zoom level (see #7403)
	return window.devicePixelRatio * 2;
}

// check if element really left/entered the event target (for pointerover/pointerout)
/**
 * @param {Node} el
 * @param {MouseEvent} e
 */
export function isExternalTarget(el, e) {
	return !el.contains(/** @type {Node | null} */ (e.relatedTarget));
}

/** @type {Map<number, PointerEvent>} */
const activePointers = new Map();

/**
 * Enables pointer detection and capture for the document.
 * @param {HTMLElement} el
 */
export function enablePointerDetection(el) {
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
export function disablePointerDetection(el) {
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
 * Returns the pointers that are currently active on the document.
 * @returns {PointerEvent[]}
 */
export function getPointers() {
	return [...activePointers.values()];
}
