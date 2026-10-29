// @ts-check
import {Point} from './Point.js';

/**
 * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d` for transforming a point of a
 * form `(x, y)` into `(a*x + b, c*y + d)` and doing the reverse. Used by Leaflet in its projections code.
 *
 * @example
 * ```js
 * const transformation = new Transformation(2, 5, -1, 10),
 * 	p = new Point(1, 2),
 * 	p2 = transformation.transform(p), //  new Point(7, 8)
 * 	p3 = transformation.untransform(p2); //  new Point(1, 2)
 * ```
 */
export class Transformation {
	/**
	 * Instantiates a Transformation object with the given coefficients.
	 * @overload
	 * @param {number} a
	 * @param {number} b
	 * @param {number} c
	 * @param {number} d
	 */
	/**
	 * Expects an coefficients array of the form `[a: Number, b: Number, c: Number, d: Number]`.
	 * @overload
	 * @param {[number, number, number, number]} coefficients
	 */
	/**
	 * @param {number | [number, number, number, number]} a
	 * @param {number} [b]
	 * @param {number} [c]
	 * @param {number} [d]
	 */
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
		this._b = /** @type {number} */ (b);
		this._c = /** @type {number} */ (c);
		this._d = /** @type {number} */ (d);
	}

	/**
	 * Returns a transformed point, optionally multiplied by the given
	 * scale. Only accepts actual `Point` instances, not arrays.
	 * @param {Point} point
	 * @param {number} [scale]
	 * @returns {Point}
	 */
	transform(point, scale) {
		return this._transform(point.clone(), scale);
	}

	// destructive transform (faster)
	/**
	 * @param {Point} point
	 * @param {number} [scale]
	 */
	_transform(point, scale) {
		scale ||= 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	}

	/**
	 * Returns the reverse transformation of the given point, optionally divided
	 * by the given scale. Only accepts actual `Point` instances, not arrays.
	 * @param {Point} point
	 * @param {number} [scale]
	 * @returns {Point}
	 */
	untransform(point, scale) {
		scale ||= 1;
		return new Point(
			(point.x / scale - this._b) / this._a,
			(point.y / scale - this._d) / this._c);
	}
}
