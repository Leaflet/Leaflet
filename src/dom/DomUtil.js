// @ts-check
import * as DomEvent from './DomEvent.js';
import {Point} from '../geometry/Point.js';

/**
 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
 * tree, used by Leaflet internally.
 *
 * Most functions expecting or returning a `HTMLElement` also work for SVG elements. The only
 * difference is that classes refer to CSS classes in HTML and SVG classes in SVG.
 * @module DomUtil
 */

/**
 * Returns an element given its DOM id, or returns the element itself if it was passed directly.
 * @param {string | HTMLElement} id
 * @returns {HTMLElement | null}
 */
export function get(id) {
	return typeof id === 'string' ? document.getElementById(id) : id;
}

/**
 * Creates an HTML element with `tagName`, sets its class to `className`,
 * and optionally appends it to `container` element.
 * @template {keyof HTMLElementTagNameMap} K
 * @overload
 * @param {K} tagName
 * @param {string} [className]
 * @param {HTMLElement} [container]
 * @returns {HTMLElementTagNameMap[K]}
 */
/**
 * @overload
 * @param {string} tagName
 * @param {string} [className]
 * @param {HTMLElement} [container]
 * @returns {HTMLElement}
 */
/**
 * @param {string} tagName
 * @param {string} [className]
 * @param {HTMLElement} [container]
 */
export function create(tagName, className, container) {
	const el = document.createElement(tagName);
	el.className = className ?? '';

	container?.appendChild(el);
	return el;
}

/**
 * Makes `el` the last child of its parent, so it renders in front of the other children.
 * @param {HTMLElement | SVGElement} el
 */
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

/**
 * Makes `el` the first child of its parent, so it renders behind the other children.
 * @param {HTMLElement | SVGElement} el
 */
export function toBack(el) {
	const parent = el.parentNode;
	if (!parent || parent.firstChild === el) { return; }

	if (el.matches(':hover')) { // see toFront
		while (el.previousSibling) { parent.insertBefore(el.previousSibling, el.nextSibling); }
	} else {
		parent.insertBefore(el, parent.firstChild);
	}
}

/**
 * Resets the 3D CSS transform of `el` so it is translated by `offset` pixels and optionally scaled
 * by `scale`. Does not have an effect if the browser doesn't support 3D CSS transforms.
 * @param {HTMLElement | SVGElement} el
 * @param {Point} offset
 * @param {number} [scale]
 */
export function setTransform(el, offset, scale) {
	const pos = offset ?? new Point(0, 0);

	el.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)${scale ? ` scale(${scale})` : ''}`;
}

/** @type {WeakMap<HTMLElement | SVGElement, Point>} */
const positions = new WeakMap();

/**
 * Sets the position of `el` to coordinates specified by `point` using a CSS translate (used
 * by Leaflet internally to position its layers). With `flat`, the translate is 2D, so `el` is
 * painted into its parent's compositor layer instead of getting a layer of its own.
 * @param {HTMLElement | SVGElement} el
 * @param {Point} point
 * @param {boolean} [flat]
 */
export function setPosition(el, point, flat) {
	positions.set(el, point);
	if (flat) {
		el.style.transform = `translate(${point.x}px,${point.y}px)`;
	} else {
		setTransform(el, point);
	}
}

/**
 * Returns the coordinates of an element previously positioned with setPosition.
 * @param {HTMLElement | SVGElement} el
 * @returns {Point}
 */
export function getPosition(el) {
	// this method is only used for elements previously positioned using setPosition,
	// so it's safe to cache the position for performance
	return positions.get(el) ?? new Point(0, 0);
}

/** Prevents the user from generating `dragstart` DOM events, usually generated when the user drags an image. */
export function disableImageDrag() {
	DomEvent.on(window, 'dragstart', DomEvent.preventDefault);
}

/** Cancels the effects of a previous [`DomUtil.disableImageDrag`](#domutil-disableimagedrag). */
export function enableImageDrag() {
	DomEvent.off(window, 'dragstart', DomEvent.preventDefault);
}

/**
 * Finds the closest parent node which size (width and height) is not null.
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function getSizedParentNode(element) {
	do {
		element = /** @type {HTMLElement} */ (element.parentNode);
	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
	return element;
}

/**
 * Computes the CSS scale currently applied on the element. Returns an object with `x` and `y` members as
 * horizontal and vertical scales respectively, and `boundingClientRect` as the result of
 * [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
 * @param {HTMLElement} element
 * @returns {{x: number, y: number, boundingClientRect: DOMRect}}
 */
export function getScale(element) {
	const rect = element.getBoundingClientRect();

	return {
		x: rect.width / element.offsetWidth || 1,
		y: rect.height / element.offsetHeight || 1,
		boundingClientRect: rect
	};
}
