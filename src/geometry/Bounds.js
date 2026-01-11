import {Point} from './Point.js';

/*
 * @class Bounds
 *
 * Represents a rectangular area in pixel coordinates.
 *
 * @example
 *
 * ```js
 * const p1 = new Point(10, 10),
 * p2 = new Point(40, 60),
 * bounds = new Bounds(p1, p2);
 * ```
 *
 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * otherBounds.intersects([[10, 10], [40, 60]]);
 * ```
 *
 * Note that `Bounds` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */


// @constructor Bounds(corner1: Point, corner2: Point)
// Creates a Bounds object from two corners coordinate pairs.
// @alternative
// @constructor Bounds(points: Point[])
// Creates a Bounds object from the given array of points.
export class Bounds {
	constructor(a, b) {
		if (!a) { return; }

		if (a instanceof Bounds) {
			// We can use the same object, no need to clone it
			// eslint-disable-next-line no-constructor-return
			return a;
		}

		const points = b ? [a, b] : a;
		for (const point of points) {
			this.extend(point);
		}
	}

	// @method extend(point: Point): this
	// Extends the bounds to contain the given point.

	// @alternative
	// @method extend(otherBounds: Bounds): this
	// Extend the bounds to contain the given bounds
	extend(obj) {
		let min2, max2;
		if (!obj) { return this; }

		if (obj instanceof Point || typeof obj[0] === 'number' || 'x' in obj) {
			min2 = max2 = new Point(obj);
		} else {
			obj = new Bounds(obj);
			min2 = obj.min;
			max2 = obj.max;

			if (!min2 || !max2) { return this; }
		}

		// @property min: Point
		// The top left corner of the rectangle.
		// @property max: Point
		// The bottom right corner of the rectangle.
		if (!this.min && !this.max) {
			this.min = min2.clone();
			this.max = max2.clone();
		} else {
			this.min.x = Math.min(min2.x, this.min.x);
			this.max.x = Math.max(max2.x, this.max.x);
			this.min.y = Math.min(min2.y, this.min.y);
			this.max.y = Math.max(max2.y, this.max.y);
		}
		return this;
	}

	// @method getCenter(round?: Boolean): Point
	// Returns the center point of the bounds.
	getCenter(round) {
		return new Point(
			(this.min.x + this.max.x) / 2,
			(this.min.y + this.max.y) / 2, round);
	}

	// @method getBottomLeft(): Point
	// Returns the bottom-left point of the bounds.
	getBottomLeft() {
		return new Point(this.min.x, this.max.y);
	}

	// @method getTopRight(): Point
	// Returns the top-right point of the bounds.
	getTopRight() { // -> Point
		return new Point(this.max.x, this.min.y);
	}

	// @method getTopLeft(): Point
	// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
	getTopLeft() {
		return this.min; // left, top
	}

	// @method getBottomRight(): Point
	// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
	getBottomRight() {
		return this.max; // right, bottom
	}

	// @method getSize(): Point
	// Returns the size of the given bounds
	getSize() {
		return this.max.subtract(this.min);
	}

	// @method contains(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle contains the given one.
	// @alternative
	// @method contains(point: Point): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains(obj) {
		let min, max;

		if (typeof obj[0] === 'number' || obj instanceof Point) {
			obj = new Point(obj);
		} else {
			obj = new Bounds(obj);
		}

		if (obj instanceof Bounds) {
			min = obj.min;
			max = obj.max;
		} else {
			min = max = obj;
		}

		return (min.x >= this.min.x) &&
		       (max.x <= this.max.x) &&
		       (min.y >= this.min.y) &&
		       (max.y <= this.max.y);
	}

	// @method intersects(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds
	// intersect if they have at least one point in common.
	intersects(bounds) { // (Bounds) -> Boolean
		bounds = new Bounds(bounds);

		const min = this.min,
		max = this.max,
		min2 = bounds.min,
		max2 = bounds.max,
		xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
		yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	}

	// @method overlaps(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds
	// overlap if their intersection is an area.
	overlaps(bounds) { // (Bounds) -> Boolean
		bounds = new Bounds(bounds);

		const min = this.min,
		max = this.max,
		min2 = bounds.min,
		max2 = bounds.max,
		xOverlaps = (max2.x > min.x) && (min2.x < max.x),
		yOverlaps = (max2.y > min.y) && (min2.y < max.y);

		return xOverlaps && yOverlaps;
	}

	// @method isValid(): Boolean
	// Returns `true` if the bounds are properly initialized.
	isValid() {
		return !!(this.min && this.max);
	}


	// @method pad(bufferRatio: Number): Bounds
	// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
	// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
	// Negative values will retract the bounds.
	pad(bufferRatio) {
		const min = this.min,
		max = this.max,
		heightBuffer = Math.abs(min.x - max.x) * bufferRatio,
		widthBuffer = Math.abs(min.y - max.y) * bufferRatio;


		return new Bounds(
			new Point(min.x - heightBuffer, min.y - widthBuffer),
			new Point(max.x + heightBuffer, max.y + widthBuffer));
	}


	// @method equals(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle is equivalent to the given bounds.
	equals(bounds) {
		if (!bounds) { return false; }

		bounds = new Bounds(bounds);

		return this.min.equals(bounds.getTopLeft()) &&
			this.max.equals(bounds.getBottomRight());
	}
}
