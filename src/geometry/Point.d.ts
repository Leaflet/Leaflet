export type PointTuple = [number, number];

export class Point {
  constructor(x: number, y: number, round?: boolean);
  clone(): Point;
  add(otherPoint: PointExpression): Point; // non-destructive, returns a new point
  subtract(otherPoint: PointExpression): Point;
  divideBy(num: number): Point;
  multiplyBy(num: number): Point;
  scaleBy(scale: PointExpression): Point;
  unscaleBy(scale: PointExpression): Point;
  round(): Point;
  floor(): Point;
  ceil(): Point;
  distanceTo(otherPoint: PointExpression): number;
  equals(otherPoint: PointExpression): boolean;
  contains(otherPoint: PointExpression): boolean;
  toString(): string;
  x: number;
  y: number;
}

export interface Coords extends Point {
  z: number;
}

export type PointExpression = Point | PointTuple;

export function toPoint(x: number, y: number, round?: boolean): Point;

export function toPoint(coords: PointTuple | { x: number; y: number }): Point;
