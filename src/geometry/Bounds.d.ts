import { PointTuple, PointExpression, Point } from "./Point";

export type BoundsLiteral = [PointTuple, PointTuple];

export class Bounds {
  constructor(topLeft: PointExpression, bottomRight: PointExpression);
  constructor(points?: Point[] | BoundsLiteral);
  extend(point: PointExpression): this;
  getCenter(round?: boolean): Point;
  getBottomLeft(): Point;
  getBottomRight(): Point;
  getTopLeft(): Point;
  getTopRight(): Point;
  getSize(): Point;
  contains(pointOrBounds: BoundsExpression | PointExpression): boolean;
  intersects(otherBounds: BoundsExpression): boolean;
  overlaps(otherBounds: BoundsExpression): boolean;
  isValid(): boolean;

  min?: Point | undefined;
  max?: Point | undefined;
}

export type BoundsExpression = Bounds | BoundsLiteral;

export function toBounds(
  topLeft: PointExpression,
  bottomRight: PointExpression
): Bounds;

export function toBounds(points: Point[] | BoundsLiteral): Bounds;
