// @namespace DomUtil
// @function preventDefault(ev: DOMEvent): this
// Prevents the default action of the DOM Event `ev` from happening (such as
// following a link in the href of the a element, or doing a POST request
// with page reload when a `<form>` is submitted).
// Use it inside listener functions.
/**
 * @param {any} e
 */
export function preventDefault(e) {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
	return this;
}
