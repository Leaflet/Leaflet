/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @ts-ignore
// @ts-ignore

import {isArray, formatNum} from '../core/Util';

/*
 * @class Point
 * @aka L.Point
 *
 * Represents a point with `x` and `y` coordinates in pixels.
 *
 * @example
 *
 * ```tsc
 * const point = L.point(200, 300);
 * ```
 *
 * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
 *
 * ```tsc
 * map.panBy([200, 300]);
 * map.panBy(L.point(200, 300));
 * ```
 *
 * Note that `Point` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

// @ts-ignore
import {Object, ReturnType} from 'typescript';

interface PointReturn{
	x: number | ReturnType<typeof Object.Number>;
	y: number | ReturnType<typeof Object.Number>;
}

class PointReturnImpl implements PointReturn{

	x: 0.0;
	y: 0.0;

	constructor(x:number, y:number, round:number) {
		this.x = Object.create((round ? Math.round(x) : x));
		this.y = Object.create((round ? Math.round(y) : y));
	}



	public getX(): number{
		return this.x;
	}
	public getY(): number{
		return this.y;
	}

}

export function Point(x:NumberReturnType,y:NumberReturnType): PointReturnImpl{
	// @ts-ignore
	return new PointReturnImpl(x,y);
};

// @ts-ignore
export function Point(x:NumberReturnType, y:NumberReturnType, round:NumberReturnType): PointReturnImpl {
	// @property x: Number; The `x` coordinate of the point
	const x = Object.create((round ? Math.round(x) : x));
	// @property y: Number; The `y` coordinate of the point
	const y = Object.create((round ? Math.round(y) : y));
	return new PointReturnImpl(x,y);
}

// Point(0,0,0);

const trunc = Math.trunc || function (v) {
	return v > 0 ? Math.floor(v) : Math.ceil(v);
};
// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type PointReturnType = ReturnType<typeof Point>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
type roundReturnType = ReturnType<typeof Point> | ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

type numberAuxX = ReturnType<typeof Object.Number>;

type numberAuxY = ReturnType<typeof Object.Number>;

Point.prototype = {

//	type P = ReturnType<typeof  clone>;

	// @method clone(): Point
	// Returns a copy of the current point.
	// fail type self.Point
	// @ts-ignore
	clone: function ():NumberReturnType {
	try{
		if(typeof Point.x === typeof numberAuxX){
			if(typeof this.y === typeof numberAuxY) {
				return new Point(this.x, this.y);
			}
		}
	}finally {
		return -1;// not a number
	}

	},

	// @method add(otherPoint: Point): Point
	// Returns the result of addition of the current and the given points.
	add: function (point:PointReturnType) {
		// non-destructive, returns a new point
		return this.clone()._add(toPoint(point));
	},

	_add: function (point: PointReturnType): PointReturnType {
		// destructive, used directly for performance in situations where it's safe to modify existing point
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	// @method subtract(otherPoint: Point): Point
	// Returns the result of subtraction of the given point from the current.
	subtract: function (point: PointReturnType): PointReturnType {
		return this.clone()._subtract(toPoint(point));
	},

	_subtract: function (point: PointReturnType): PointReturnType {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	// @method divideBy(num: Number): Point
	// Returns the result of division of the current point by the given number.
	divideBy: function (num: number) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num: number) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	// @method multiplyBy(num: Number): Point
	// Returns the result of multiplication of the current point by the given number.
	multiplyBy: function (num:number) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num:number) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	// @method scaleBy(scale: Point): Point
	// Multiply each coordinate of the current point by each coordinate of
	// `scale`. In linear algebra terms, multiply the point by the
	// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
	// defined by `scale`.
	scaleBy: function (point:PointReturnType):PointReturnType {
		// @ts-ignore
		return new Point(this.x * point.x, this.y * point.y);
	},

	// @method unscaleBy(scale: Point): Point
	// Inverse of `scaleBy`. Divide each coordinate of the current point by
	// each coordinate of `scale`.
	unscaleBy: function (point:PointReturnType):PointReturnType {
		return new Point(this.x / point.x, this.y / point.y);
	},

	// @method round(): Point
	// Returns a copy of the current point with rounded coordinates.
	round: function (): roundReturnType {
		return this.clone()._round();
	},

	_round: function (): _roundReturnType {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	// @method floor(): Point
	// Returns a copy of the current point with floored coordinates (rounded down).
	floor: function (): roundReturnType {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	// @method ceil(): Point
	// Returns a copy of the current point with ceiled coordinates (rounded up).
	ceil: function () {
		return this.clone()._ceil();
	},

	_ceil: function () {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	},

	// @method trunc(): Point
	// Returns a copy of the current point with truncated coordinates (rounded towards zero).
	trunc: function () {
		return this.clone()._trunc();
	},

	_trunc: function () {
		this.x = trunc(this.x);
		this.y = trunc(this.y);
		return this;
	},

	// @method distanceTo(otherPoint: Point): Number
	// Returns the cartesian distance between the current and the given points.
	distanceTo: function (point:PointReturnType) : PointReturnType {
		point = toPoint(point);

		const x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	// @method equals(otherPoint: Point): Boolean
	// Returns `true` if the given point has the same coordinates.
	equals: function (point:NumberReturnType[]):NumberReturnType[] {
		point = toPoint(point[0]);

		return point[0].x === this.x &&
		       point[0].y === this.y;
	},

	// @method contains(otherPoint: Point): Boolean
	// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
	contains: function (point:NumberReturnType[]): NumberReturnType[] {
		point = toPoint(point[0],point[1],point[2]);

		return Math.abs(point[0].x) <= Math.abs(this.x) &&
		       Math.abs(point[1].y) <= Math.abs(this.y);
	},

	// @method toString(): String
	// Returns a string representation of the point for debugging purposes.
	toString: function (): StringReturnType | StringReturnType[] {
		return 'Point(' +
		        formatNum(this.x) + ', ' +
		        formatNum(this.y) + ')';
	}
};

// @factory L.point(x: Number, y: Number, round?: Boolean)
// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

// @alternative
// @factory L.point(coords: Number[])
// Expects an array of the form `[x, y]` instead.

// @alternative
// @factory L.point(coords: Object)
// Expects a plain object of the form `{x: Number, y: Number}` instead.
export function toPoint(x:PointReturnType[], y:NumberReturnType[], round:NumberReturnType[]): PointReturnType {
	if (x[0] instanceof Point) {
		return x;
	}
	if (isArray(x)) {
		return new Point(x[0], x[1], round);
	}
	if (x === undefined || x === null) {
		return x;
	}
	if (typeof x === 'object' && 'x' in x && 'y' in x) {
		return new Point(x.x, x.y, round);
	}
	return new Point(x, y, round);
}
