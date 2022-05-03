import { Point } from "./Point";


export class Transformation {
    constructor(a: number, b: number, c: number, d: number);
    transform(point: Point, scale?: number): Point;
    untransform(point: Point, scale?: number): Point;
}
/** Instantiates a Transformation object with the given coefficients. */

export function transformation(
    a: number,
    b: number,
    c: number,
    d: number
): Transformation;
/** Expects an coefficients array of the form `[a: Number, b: Number, c: Number, d: Number]`. */

export function toTransformation(
  coefficients: [number, number, number, number]
): Transformation;
