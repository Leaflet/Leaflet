import {formatNum} from '../core/Util.js';

/*
 * @class Point
 *
 * Represents a point with `x` and `y` coordinates in pixels.
 *
 * @example
 *
 * ```js
 * const point = new Point(200, 300);
 * ```
 *
 * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
 *
 * ```js
 * map.panBy([200, 300]);
 * map.panBy(new Point(200, 300));
 * ```
 *
 * Note that `Point` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

// @constructor Point(x: Number, y: Number, round?: Boolean)
// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

// @alternative
// @constructor Point(coords: Number[])
// Expects an array of the form `[x, y]` instead.

// @alternative
// @constructor Point(coords: Object)
// Expects a plain object of the form `{x: Number, y: Number}` instead.
export class Point {
	constructor(x, y, round) {

		const valid = Point.validate(x, y);
		if (!valid) {
			throw new Error(`Invalid Point object: (${x}, ${y})`);
		}

		let _x, _y;
		if (x instanceof Point) {
			// We can use the same object, no need to clone it
			// eslint-disable-next-line no-constructor-return
			return x;
		} else if (Array.isArray(x)) {
			_x = x[0];
			_y = x[1];
		} else if (typeof x === 'object' && 'x' in x && 'y' in x) {
			_x = x.x;
			_y = x.y;
		} else {
			_x = x;
			_y = y;
		}

		// @property x: Number; The `x` coordinate of the point
		this.x = (round ? Math.round(_x) : _x);
		// @property y: Number; The `y` coordinate of the point
		this.y = (round ? Math.round(_y) : _y);
	}

	// @section
	// There are several static functions which can be called without instantiating Point:

	// @function validate(x: Number, y: Number): Boolean
	// Returns `true` if the Point object can be properly initialized.

	// @alternative
	// @function validate(coords: Number[]): Boolean
	// Expects an array of the form `[x, y]`. Returns `true` if the Point object can be properly initialized.

	// @alternative
	// @function validate(coords: Object): Boolean
	// Returns `true` if the Point object can be properly initialized.
	static validate(x, y) {
		if (x instanceof Point || Array.isArray(x)) {
			return true;
		} else if (x && typeof x === 'object' && 'x' in x && 'y' in x) {
			return true;
		} else if ((x || x === 0) && (y || y === 0)) {
			return true;
		}
		return false;
	}

	// @method clone(): Point
	// Returns a copy of the current point.
	clone() {
		// to skip the validation in the constructor we need to initialize with 0 and then set the values later
		const p = new Point(0, 0);
		p.x = this.x;
		p.y = this.y;
		return p;
	}

	// @method add(otherPoint: Point): Point
	// Returns the result of addition of the current and the given points.
	add(point) {
		// non-destructive, returns a new point
		return this.clone()._add(new Point(point));
	}

	_add(point) {
		// destructive, used directly for performance in situations where it's safe to modify existing point
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	// @method subtract(otherPoint: Point): Point
	// Returns the result of subtraction of the given point from the current.
	subtract(point) {
		return this.clone()._subtract(new Point(point));
	}

	_subtract(point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}

	// @method divideBy(num: Number): Point
	// Returns the result of division of the current point by the given number.
	divideBy(num) {
		return this.clone()._divideBy(num);
	}

	_divideBy(num) {
		this.x /= num;
		this.y /= num;
		return this;
	}

	// @method multiplyBy(num: Number): Point
	// Returns the result of multiplication of the current point by the given number.
	multiplyBy(num) {
		return this.clone()._multiplyBy(num);
	}

	_multiplyBy(num) {
		this.x *= num;
		this.y *= num;
		return this;
	}

	// @method scaleBy(scale: Point): Point
	// Multiply each coordinate of the current point by each coordinate of
	// `scale`. In linear algebra terms, multiply the point by the
	// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
	// defined by `scale`.
	scaleBy(point) {
		return new Point(this.x * point.x, this.y * point.y);
	}

	// @method unscaleBy(scale: Point): Point
	// Inverse of `scaleBy`. Divide each coordinate of the current point by
	// each coordinate of `scale`.
	unscaleBy(point) {
		return new Point(this.x / point.x, this.y / point.y);
	}

	// Returns a copy of the current point with rounded coordinates.
	round() {
		return this.clone()._round();
	}

	_round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}

	// @method floor(): Point
	// Returns a copy of the current point with floored coordinates (rounded down).
	floor() {
		return this.clone()._floor();
	}

	_floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	// @method ceil(): Point
	// Returns a copy of the current point with ceiled coordinates (rounded up).
	ceil() {
		return this.clone()._ceil();
	}

	_ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}

	// Returns a copy of the current point with truncated coordinates (rounded towards zero).
	trunc() {
		return this.clone()._trunc();
	}

	_trunc() {
		this.x = Math.trunc(this.x);
		this.y = Math.trunc(this.y);
		return this;
	}

	// @method distanceTo(otherPoint: Point): Number
	// Returns the cartesian distance between the current and the given points.
	distanceTo(point) {
		point = new Point(point);

		const x = point.x - this.x,
		y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	}

	// @method equals(otherPoint: Point): Boolean
	// Returns `true` if the given point has the same coordinates.
	equals(point) {
		point = new Point(point);

		return point.x === this.x &&
		       point.y === this.y;
	}

	// @method contains(otherPoint: Point): Boolean
	// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
	contains(point) {
		point = new Point(point);

		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	}

	// @method toString(): String
	// Returns a string representation of the point for debugging purposes.
	toString() {
		return `Point(${formatNum(this.x)}, ${formatNum(this.y)})`;
	}
}
