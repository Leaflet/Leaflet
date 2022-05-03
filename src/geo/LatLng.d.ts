import { LatLngBounds } from "./LatLngBounds";


export class LatLng {
    constructor(latitude: number, longitude: number, altitude?: number);
    equals(otherLatLng: LatLngExpression, maxMargin?: number): boolean;
    toString(): string;
    distanceTo(otherLatLng: LatLngExpression): number;
    wrap(): LatLng;
    toBounds(sizeInMeters: number): LatLngBounds;
    clone(): LatLng;

    lat: number;
    lng: number;
    alt?: number | undefined;
}

export interface LatLngLiteral {
    lat: number;
    lng: number;
}

export type LatLngTuple = [number, number];

export type LatLngExpression = LatLng | LatLngLiteral | LatLngTuple;

export function toLatLng(
    latitude: number,
    longitude: number,
    altitude?: number
): LatLng;

export function toLatLng(
    coords: LatLngTuple |
    [number, number, number] |
        LatLngLiteral |
    { lat: number; lng: number; alt?: number | undefined; }
): LatLng;
