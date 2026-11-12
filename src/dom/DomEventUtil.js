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

/** @type {Map<number, PointerEvent>} */
const activePointers = new Map();

/** @type {string} */
let lastPointerType;

/**
 * Enables pointer detection and capture for the document.
 * @param {HTMLElement} el
 */
export function enablePointerDetection(el) {
	el.addEventListener('pointerdown', _onSet, true);
	el.addEventListener('pointermove', _onUpdate, true);
	el.addEventListener('pointerup', _onDelete, true);
	el.addEventListener('pointercancel', _onDelete, true);
	activePointers.clear();
}

/**
 * Disables pointer detection and capture for the document.
 * @param {HTMLElement} el
 */
export function disablePointerDetection(el) {
	el.removeEventListener('pointerdown', _onSet, true);
	el.removeEventListener('pointermove', _onUpdate, true);
	el.removeEventListener('pointerup', _onDelete, true);
	el.removeEventListener('pointercancel', _onDelete, true);
}

/** @param {PointerEvent} e */
function _onSet(e) {
	lastPointerType = e.pointerType;
	const target = /** @type {Element} */ (e.composedPath()[0]);
	// leave pointers on form fields and editable content to the browser, so their native behavior keeps working
	if (target.matches?.('input, textarea, select') || /** @type {HTMLElement} */ (target).isContentEditable) { return; }
	// capturing throws for synthetic pointers the browser doesn't know about, so only capture real ones
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

/** Returns the pointers that are currently active on the document. */
export function getPointers() {
	return [...activePointers.values()];
}

const dblclickProps = ['bubbles', 'cancelable', 'composed', 'view', 'screenX', 'screenY', 'clientX', 'clientY',
	'ctrlKey', 'shiftKey', 'altKey', 'metaKey', 'button', 'buttons', 'relatedTarget'];

let lastClickTime = 0,
clickCount = 0;

/**
 * Fires a `dblclick` on double tap where the browser doesn't (like iOS Safari), which is where it always reports
 * `detail: 1` on clicks (see #7012). The pointer type comes from `pointerdown`, because iOS Safari reports `mouse`
 * on clicks from touch (WebKit bug 282988).
 * @param {MouseEvent} e
 */
export function simulateDblclick(e) {
	const target = /** @type {Element} */ (e.target);

	// a click on a label is followed by a click on its input, so it would count as a double tap
	if (e.detail !== 1 || lastPointerType === 'mouse' || target.closest('label')) {
		clickCount = 0;
		return;
	}
	const now = Date.now();
	clickCount = now - lastClickTime <= 200 ? clickCount + 1 : 1;
	lastClickTime = now;

	if (clickCount === 2) {
		/** @type {Record<string, any>} */
		const init = {detail: 2};
		for (const prop of dblclickProps) { init[prop] = e[/** @type {keyof MouseEvent} */ (prop)]; }
		target.dispatchEvent(new MouseEvent('dblclick', init));
	}
}

/**
 * Makes Space click a `role="button"` link like it clicks a native button (Enter already clicks links natively).
 * @param {HTMLElement} el
 */
export function clickOnSpace(el) {
	el.addEventListener('keydown', _onSpaceKeyDown);
}

/**
 * @this {HTMLElement}
 * @param {KeyboardEvent} e
 */
function _onSpaceKeyDown(e) {
	if (e.key === ' ' && !e.repeat) {
		e.preventDefault(); // stop the page from scrolling
		this.click();
	}
}
