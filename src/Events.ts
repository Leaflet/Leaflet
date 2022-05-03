import { LeafletEvent } from "./core/Events";
import { Layer } from "./Layer/Layer";
import { LatLngBounds, LatLng } from "./geo/LatLng";
import { Point, Coords } from "./geometry/Point";
import { Popup, Tooltip } from "./Leaflet";


export interface LeafletMouseEvent extends LeafletEvent {
    latlng: LatLng;
    layerPoint: Point;
    containerPoint: Point;
    originalEvent: MouseEvent;
}

export interface LeafletKeyboardEvent extends LeafletEvent {
    originalEvent: KeyboardEvent;
}

export interface LocationEvent extends LeafletEvent {
    latlng: LatLng;
    bounds: LatLngBounds;
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    speed: number;
    timestamp: number;
}

export interface ErrorEvent extends LeafletEvent {
    message: string;
    code: number;
}

export interface LayerEvent extends LeafletEvent {
    layer: Layer;
}

export interface LayersControlEvent extends LayerEvent {
    name: string;
}

export interface TileEvent extends LeafletEvent {
    tile: HTMLImageElement;
    coords: Coords;
}

export interface TileErrorEvent extends TileEvent {
    error: Error;
}

export interface ResizeEvent extends LeafletEvent {
    oldSize: Point;
    newSize: Point;
}

export interface GeoJSONEvent extends LeafletEvent {
    layer: Layer;
    properties: any;
    geometryType: string;
    id: string;
}

export interface PopupEvent extends LeafletEvent {
    popup: Popup;
}

export interface TooltipEvent extends LeafletEvent {
    tooltip: Tooltip;
}

export interface DragEndEvent extends LeafletEvent {
    distance: number;
}

export interface ZoomAnimEvent extends LeafletEvent {
    center: LatLng;
    zoom: number;
    noUpdate: boolean;
}
