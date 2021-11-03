import { Point, PointExpression, Bounds } from "../../Leaflet";
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
