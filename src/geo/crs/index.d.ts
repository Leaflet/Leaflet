import { Bounds } from "../../geometry/Bounds";
import { Point, PointExpression } from "../../geometry/Point";
import { LatLngExpression, LatLng, LatLngLiteral } from "../LatLng";


export interface CRS {
    latLngToPoint(latlng: LatLngExpression, zoom: number): Point;
    pointToLatLng(point: PointExpression, zoom: number): LatLng;
    project(latlng: LatLng | LatLngLiteral): Point;
    unproject(point: PointExpression): LatLng;
    scale(zoom: number): number;
    zoom(scale: number): number;
    getProjectedBounds(zoom: number): Bounds;
    distance(latlng1: LatLngExpression, latlng2: LatLngExpression): number;
    wrapLatLng(latlng: LatLng | LatLngLiteral): LatLng;

    code?: string | undefined;
    wrapLng?: [number, number] | undefined;
    wrapLat?: [number, number] | undefined;
    infinite: boolean;
}

export namespace CRS {
    const EPSG3395: CRS;
    const EPSG3857: CRS;
    const EPSG4326: CRS;
    const EPSG900913: CRS;
    const Earth: CRS;
    const Simple: CRS;
}
