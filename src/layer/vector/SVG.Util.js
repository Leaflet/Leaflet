
// @namespace SVG; @section
// There are several static functions which can be called without instantiating SVG:

// @function create(name: String): SVGElement
// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
// corresponding to the class name passed. For example, using 'line' will return
// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
export function svgCreate(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

// @function pointsToPath(rings: Point[], closed: Boolean): String
// Generates a SVG path string for multiple rings, with each ring turning
// into "M..L..L.." instructions
export function pointsToPath(rings, closed) {
	const str = rings.flatMap(points => [
		...points.map((p, j) => `${(j ? 'L' : 'M') + p.x} ${p.y}`),
		// closes the ring for polygons
		closed ? 'z' : ''
	]).join('');

	// SVG complains about empty path strings
	return str || 'M0 0';
}
