import {Point} from './Point.js';

/*
 * @class Transformation
 *
 * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
 * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
 * the reverse. Used by Leaflet in its projections code.
 *
 * @example
 *
 * ```js
 * const transformation = new Transformation(2, 5, -1, 10),
 * 	p = new Point(1, 2),
 * 	p2 = transformation.transform(p), //  new Point(7, 8)
 * 	p3 = transformation.untransform(p2); //  new Point(1, 2)
 * ```
 */

// @constructor Transformation(a: Number, b: Number, c: Number, d: Number)
// Instantiates a Transformation object with the given coefficients.

// @alternative
// @constructor Transformation(coefficients: Array): Transformation
// Expects an coefficients array of the form
// `[a: Number, b: Number, c: Number, d: Number]`.
export class Transformation {
	constructor(a, b, c, d) {
		if (Array.isArray(a)) {
			// use array properties
			this._a = a[0];
			this._b = a[1];
			this._c = a[2];
			this._d = a[3];
			return;
		}
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	}

	// @method transform(point: Point, scale?: Number): Point
	// Returns a transformed point, optionally multiplied by the given scale.
	// Only accepts actual `Point` instances, not arrays.
	transform(point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	}

	// destructive transform (faster)
	_transform(point, scale) {
		scale ||= 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	}

	// @method untransform(point: Point, scale?: Number): Point
	// Returns the reverse transformation of the given point, optionally divided
	// by the given scale. Only accepts actual `Point` instances, not arrays.
	untransform(point, scale) {
		scale ||= 1;
		return new Point(
			(point.x / scale - this._b) / this._a,
			(point.y / scale - this._d) / this._c);
	}
}
