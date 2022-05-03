import { Bounds } from "../../geometry/Bounds";
import { Point, PointExpression } from "../../geometry/Point";
import { LatLng, LatLngLiteral } from "../LatLng";


export interface Projection {
    project(latlng: LatLng | LatLngLiteral): Point;
    unproject(point: PointExpression): LatLng;

    bounds: Bounds;
}

export namespace Projection {
    const LonLat: Projection;
    const Mercator: Projection;
    const SphericalMercator: Projection;
}
