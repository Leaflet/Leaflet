import * as DomEvent from './DomEvent.js';
import {Point} from '../geometry/Point.js';

/*
 * @namespace DomUtil
 *
 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
 * tree, used by Leaflet internally.
 *
 * Most functions expecting or returning a `HTMLElement` also work for
 * SVG elements. The only difference is that classes refer to CSS classes
 * in HTML and SVG classes in SVG.
 */

// @function get(id: String|HTMLElement): HTMLElement
// Returns an element given its DOM id, or returns the element itself
// if it was passed directly.
export function get(id) {
	return typeof id === 'string' ? document.getElementById(id) : id;
}

// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
export function create(tagName, className, container) {
	const el = document.createElement(tagName);
	el.className = className ?? '';

	container?.appendChild(el);
	return el;
}

// @function toFront(el: HTMLElement)
// Makes `el` the last child of its parent, so it renders in front of the other children.
export function toFront(el) {
	const parent = el.parentNode;
	if (!parent || parent.lastChild === el) { return; }

	// re-inserting a hovered node (e.g. bringToFront in a pointerover handler) makes Chromium 144+ fire a repeated
	// pointerover and lose the next pointerout (#10129), so move the nodes after it instead
	if (el.matches(':hover')) {
		while (el.nextSibling) { parent.insertBefore(el.nextSibling, el); }
	} else {
		parent.appendChild(el);
	}
}

// @function toBack(el: HTMLElement)
// Makes `el` the first child of its parent, so it renders behind the other children.
export function toBack(el) {
	const parent = el.parentNode;
	if (!parent || parent.firstChild === el) { return; }

	if (el.matches(':hover')) { // see toFront
		while (el.previousSibling) { parent.insertBefore(el.previousSibling, el.nextSibling); }
	} else {
		parent.insertBefore(el, parent.firstChild);
	}
}

// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
// and optionally scaled by `scale`. Does not have an effect if the
// browser doesn't support 3D CSS transforms.
export function setTransform(el, offset, scale) {
	const pos = offset ?? new Point(0, 0);

	el.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)${scale ? ` scale(${scale})` : ''}`;
}

const positions = new WeakMap();

// @function setPosition(el: HTMLElement, position: Point)
// Sets the position of `el` to coordinates specified by `position`,
// using CSS translate or top/left positioning depending on the browser
// (used by Leaflet internally to position its layers).
export function setPosition(el, point) {
	positions.set(el, point);
	setTransform(el, point);
}

// @function getPosition(el: HTMLElement): Point
// Returns the coordinates of an element previously positioned with setPosition.
export function getPosition(el) {
	// this method is only used for elements previously positioned using setPosition,
	// so it's safe to cache the position for performance
	return positions.get(el) ?? new Point(0, 0);
}

const documentStyle = /* @__PURE__ */ (() => (typeof document === 'undefined' ? {} : document.documentElement.style))();
// Safari still needs a vendor prefix, we need to detect with property name is supported.
const userSelectProp = /* @__PURE__ */ ['userSelect', 'WebkitUserSelect'].find(prop => prop in documentStyle);
let prevUserSelect;

// @function disableTextSelection()
// Prevents the user from selecting text in the document. Used internally
// by Leaflet to override the behaviour of any click-and-drag interaction on
// the map. Affects drag interactions on the whole document.
export function disableTextSelection() {
	const value = documentStyle[userSelectProp];

	if (value === 'none') {
		return;
	}

	prevUserSelect = value;
	documentStyle[userSelectProp] = 'none';
}

// @function enableTextSelection()
// Cancels the effects of a previous [`DomUtil.disableTextSelection`](#domutil-disabletextselection).
export function enableTextSelection() {
	if (typeof prevUserSelect === 'undefined') {
		return;
	}

	documentStyle[userSelectProp] = prevUserSelect;
	prevUserSelect = undefined;
}

// @function disableImageDrag()
// Prevents the user from generating `dragstart` DOM events, usually generated when the user drags an image.
export function disableImageDrag() {
	DomEvent.on(window, 'dragstart', DomEvent.preventDefault);
}

// @function enableImageDrag()
// Cancels the effects of a previous [`DomUtil.disableImageDrag`](#domutil-disableimagedrag).
export function enableImageDrag() {
	DomEvent.off(window, 'dragstart', DomEvent.preventDefault);
}

// @function getSizedParentNode(el: HTMLElement): HTMLElement
// Finds the closest parent node which size (width and height) is not null.
export function getSizedParentNode(element) {
	do {
		element = element.parentNode;
	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
	return element;
}

// @function getScale(el: HTMLElement): Object
// Computes the CSS scale currently applied on the element.
// Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
// and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
export function getScale(element) {
	const rect = element.getBoundingClientRect();

	return {
		x: rect.width / element.offsetWidth || 1,
		y: rect.height / element.offsetHeight || 1,
		boundingClientRect: rect
	};
}

// @property reducedMotion: Boolean
// `true` if the user prefers reduced motion, as set when Leaflet loads (`true` outside a browser).
export const reducedMotion =
	typeof window === 'undefined' || /* @__PURE__ */ window.matchMedia('(prefers-reduced-motion: reduce)').matches;
