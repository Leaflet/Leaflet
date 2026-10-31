import {Point} from './Point.js';

/** @import {PointExpression, PointTuple} from './Point.js' */

/** @typedef {PointTuple[]} BoundsLiteral */

/**
 * A `Bounds`, or an array of the points it should contain (usually two opposite corners).
 * @typedef {Bounds | PointExpression[]} BoundsExpression
 */

/**
 * Represents a rectangular area in pixel coordinates.
 *
 * @example
 * ```js
 * const p1 = new Point(10, 10),
 * p2 = new Point(40, 60),
 * bounds = new Bounds(p1, p2);
 * ```
 *
 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted
 * otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * otherBounds.intersects([[10, 10], [40, 60]]);
 * ```
 *
 * Note that `Bounds` does not inherit from Leaflet's `Class` object, which means new classes can't inherit from it,
 * and new methods can't be added to it with the `include` function.
 */
export class Bounds {
	/**
	 * Creates a Bounds object from two corners coordinate pairs.
	 * @overload
	 * @param {PointExpression} corner1
	 * @param {PointExpression} corner2
	 */
	/**
	 * Creates a Bounds object from the given array of points.
	 * @overload
	 * @param {BoundsExpression} points
	 */
	/**
	 * Creates an empty Bounds object, to be filled with [`extend`](#bounds-extend).
	 * @overload
	 */
	/**
	 * @param {any} [a]
	 * @param {PointExpression} [b]
	 */
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

	/**
	 * Extends the bounds to contain the given point or bounds.
	 * @param {PointExpression | BoundsExpression} obj
	 */
	extend(obj) {
		let min2, max2;
		if (!obj) { return this; }

		if (isPointExpression(obj)) {
			min2 = max2 = new Point(obj);
		} else {
			({min: min2, max: max2} = new Bounds(obj));
			if (!min2) { return this; }
		}

		if (!this.min) {
			/**
			 * The top left corner of the rectangle.
			 * @type {Point}
			 */
			this.min = min2.clone();
			/**
			 * The bottom right corner of the rectangle.
			 * @type {Point}
			 */
			this.max = max2.clone();
		} else {
			this.min.x = Math.min(min2.x, this.min.x);
			this.max.x = Math.max(max2.x, this.max.x);
			this.min.y = Math.min(min2.y, this.min.y);
			this.max.y = Math.max(max2.y, this.max.y);
		}
		return this;
	}

	/**
	 * Returns the center point of the bounds.
	 * @param {boolean} [round]
	 */
	getCenter(round) {
		return new Point(
			(this.min.x + this.max.x) / 2,
			(this.min.y + this.max.y) / 2, round);
	}

	/** Returns the bottom-left point of the bounds. */
	getBottomLeft() {
		return new Point(this.min.x, this.max.y);
	}

	/** Returns the top-right point of the bounds. */
	getTopRight() {
		return new Point(this.max.x, this.min.y);
	}

	/** Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)). */
	getTopLeft() {
		return this.min; // left, top
	}

	/** Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)). */
	getBottomRight() {
		return this.max; // right, bottom
	}

	/** Returns the size of the given bounds */
	getSize() {
		return this.max.subtract(this.min);
	}

	/**
	 * Returns `true` if the rectangle contains the given point or bounds.
	 * @param {PointExpression | BoundsExpression} obj
	 */
	contains(obj) {
		let min, max;

		if (isPointExpression(obj)) {
			min = max = new Point(obj);
		} else {
			({min, max} = new Bounds(obj));
		}

		return (min.x >= this.min.x) &&
		       (max.x <= this.max.x) &&
		       (min.y >= this.min.y) &&
		       (max.y <= this.max.y);
	}

	/**
	 * Returns `true` if the rectangle intersects the given bounds. Two
	 * bounds intersect if they have at least one point in common.
	 * @param {BoundsExpression} bounds
	 */
	intersects(bounds) {
		bounds = new Bounds(bounds);

		const min = this.min,
		max = this.max,
		min2 = bounds.min,
		max2 = bounds.max,
		xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
		yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	}

	/**
	 * Returns `true` if the rectangle overlaps the given bounds.
	 * Two bounds overlap if their intersection is an area.
	 * @param {BoundsExpression} bounds
	 */
	overlaps(bounds) {
		bounds = new Bounds(bounds);

		const min = this.min,
		max = this.max,
		min2 = bounds.min,
		max2 = bounds.max,
		xOverlaps = (max2.x > min.x) && (min2.x < max.x),
		yOverlaps = (max2.y > min.y) && (min2.y < max.y);

		return xOverlaps && yOverlaps;
	}

	/** Returns `true` if the bounds are properly initialized. */
	isValid() {
		return !!(this.min && this.max);
	}


	/**
	 * Returns bounds created by extending or retracting the current bounds by a given ratio in each direction. For
	 * example, a ratio of 0.5 extends the bounds by 50% in each direction. Negative values will retract the bounds.
	 * @param {number} bufferRatio
	 */
	pad(bufferRatio) {
		const min = this.min,
		max = this.max,
		heightBuffer = Math.abs(min.x - max.x) * bufferRatio,
		widthBuffer = Math.abs(min.y - max.y) * bufferRatio;


		return new Bounds(
			new Point(min.x - heightBuffer, min.y - widthBuffer),
			new Point(max.x + heightBuffer, max.y + widthBuffer));
	}


	/**
	 * Returns `true` if the rectangle is equivalent to the given bounds.
	 * @param {BoundsExpression} [bounds]
	 */
	equals(bounds) {
		if (!bounds) { return false; }

		bounds = new Bounds(bounds);

		return this.min.equals(bounds.getTopLeft()) &&
			this.max.equals(bounds.getBottomRight());
	}
}

/**
 * @param {PointExpression | BoundsExpression} obj
 * @returns {obj is PointExpression}
 */
function isPointExpression(obj) {
	return obj instanceof Point || (Array.isArray(obj) ? typeof obj[0] === 'number' : 'x' in obj);
}
