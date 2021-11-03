import { LatLngExpression, LatLng, LatLngTuple } from "./LatLng";


export class LatLngBounds {
    constructor(southWest: LatLngExpression, northEast: LatLngExpression);
    constructor(latlngs: LatLngBoundsLiteral);
    extend(latlngOrBounds: LatLngExpression | LatLngBoundsExpression): this;
    pad(bufferRatio: number): LatLngBounds; // does this modify the current instance or does it return a new one?
    getCenter(): LatLng;
    getSouthWest(): LatLng;
    getNorthEast(): LatLng;
    getNorthWest(): LatLng;
    getSouthEast(): LatLng;
    getWest(): number;
    getSouth(): number;
    getEast(): number;
    getNorth(): number;
    contains(
        otherBoundsOrLatLng: LatLngBoundsExpression | LatLngExpression
    ): boolean;
    intersects(otherBounds: LatLngBoundsExpression): boolean;
    overlaps(otherBounds: LatLngBoundsExpression): boolean;
    toBBoxString(): string;
    equals(otherBounds: LatLngBoundsExpression): boolean;
    isValid(): boolean;
}

export type LatLngBoundsLiteral = LatLngTuple[]; // Must be [LatLngTuple, LatLngTuple], cant't change because Map.setMaxBounds



export type LatLngBoundsExpression = LatLngBounds | LatLngBoundsLiteral;

export function toLatLngBounds(
  southWest: LatLngExpression,
  northEast: LatLngExpression
): LatLngBounds;

export function toLatLngBounds(latlngs: LatLngExpression[]): LatLngBounds;
