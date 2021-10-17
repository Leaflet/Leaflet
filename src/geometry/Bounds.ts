// import {Point, toPoint} from './Point';
// import {Point, toPoint} from './PointImp';
import {PointReturn} from './PointReturn';

/*
 * @class Bounds
 * @aka L.Bounds
 *
 * Represents a rectangular area in pixel coordinates.
 *
 * @example
 *
 * ```tsc
 * const p1 = L.point(10, 10),
 * p2 = L.point(40, 60),
 * bounds = L.bounds(p1, p2);
 * ```
 *
 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```tsc
 * otherBounds.intersects([[10, 10], [40, 60]]);
 * ```
 *
 * Note that `Bounds` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

// import {Number} from 'typescript';

// import {Point} from './Point';
// import {Object, ReturnType} from "typescript";

// @ts-ignore
import {Object, ReturnType} from 'typescript';

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html

type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type PointReturnType = ReturnType<typeof Point> | ReturnType<typeof PointImpl>;

type BoundsReturnType = ReturnType<typeof Bounds | typeof Array | typeof Point | typeof Point[]>;

// type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Bounds(a:NumberReturnType, b:NumberReturnType): BoundsReturnType {

	if (!a) { return; }

	const points = b ? [a, b] : a;

	for (const i in points) {
		this.extend(points[i]);
	}
	return this;
}

Bounds.prototype = {
	// @method extend(point: Point): this
	// Extends the bounds to contain the given point.
	extend: function (point:PointReturnType):BoundsReturnType { // (Point)
		point = toPoint(point);

		// @property min: Point
		// The top left corner of the rectangle.
		// @property max: Point
		// The bottom right corner of the rectangle.
		if (!this.min && !this.max) {
			this.min = point.clone();
			this.max = point.clone();
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
		return this;
	},

	// @method getCenter(round?: Boolean): Point
	// Returns the center point of the bounds.
	getCenter: function (round:boolean):PointReturnType {
		return new Point(
		        (this.min.x + this.max.x) / 2,
		        (this.min.y + this.max.y) / 2, round);
	},

	// @method getBottomLeft(): Point
	// Returns the bottom-left point of the bounds.
	getBottomLeft: function ():PointReturnType {
		return new Point(this.min.x, this.max.y);
	},

	// @method getTopRight(): Point
	// Returns the top-right point of the bounds.
	getTopRight: function ():PointReturnType { // -> Point
		return new Point(this.max.x, this.min.y);
	},

	// @method getTopLeft(): Point
	// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
	getTopLeft: function ():PointReturnType {
		return this.min; // left, top
	},

	// @method getBottomRight(): Point
	// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
	getBottomRight: function ():PointReturnType {
		return this.max; // right, bottom
	},

	// @method getSize(): Point
	// Returns the size of the given bounds
	getSize: function ():PointReturnType {
		return this.max.subtract(this.min);
	},

	// @method contains(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle contains the given one.
	// @alternative
	// @method contains(point: Point): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains: function (obj:PointReturnType):boolean {
		const min;
		const max;

		if (typeof obj[0] === 'number' || obj instanceof Point) {
			obj = toPoint(obj);
		} else {
			obj = toBounds(obj);
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
	},

	// @method intersects(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds
	// intersect if they have at least one point in common.
	intersects: function (bounds:BoundsReturnType):boolean { // (Bounds) -> Boolean
		bounds = toBounds(bounds);

		const min = this.min;
		const max = this.max;
		const min2 = bounds.min;
		const max2 = bounds.max;
		const xIntersects = (max2.x >= min.x) && (min2.x <= max.x);
		const yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	},

	// @method overlaps(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds
	// overlap if their intersection is an area.
	overlaps: function (bounds:BoundsReturnType):boolean { // (Bounds) -> Boolean
		bounds = toBounds(bounds);

		const min = this.min;
		const max = this.max;
		const min2 = bounds.min;
		const max2 = bounds.max;
		const xOverlaps = (max2.x > min.x) && (min2.x < max.x);
		const yOverlaps = (max2.y > min.y) && (min2.y < max.y);

		return xOverlaps && yOverlaps;
	},

	isValid: function ():boolean {
		return !!(this.min && this.max);
	}
};


// @factory L.bounds(corner1: Point, corner2: Point)
// Creates a Bounds object from two corners coordinate pairs.
// @alternative
// @factory L.bounds(points: Point[])
// Creates a Bounds object from the given array of points.
export function toBounds(a:PointReturnType|PointReturnType[], b:PointReturnType|PointReturnType[]):BoundsReturnType {
	if (!a || a instanceof Bounds) {
		return a;
	}
	return new Bounds(a, b);
}
