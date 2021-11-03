import { LatLngExpression } from "../geo/LatLng";
import { Bounds } from "./Bounds";
import { Point } from "./Point";

export function simplify(points: Point[], tolerance: number): Point[];
export function pointToSegmentDistance(p: Point, p1: Point, p2: Point): number;
export function closestPointOnSegment(p: Point, p1: Point, p2: Point): Point;
export function isFlat(latlngs: LatLngExpression[]): boolean;
export function clipSegment(
  a: Point,
  b: Point,
  bounds: Bounds,
  useLastCode?: boolean,
  round?: boolean
): [Point, Point] | false;
