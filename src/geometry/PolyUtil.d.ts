import { BoundsExpression } from "./Bounds";
import { Point } from "./Point";

export function clipPolygon(
  points: Point[],
  bounds: BoundsExpression,
  round?: boolean
): Point[];
