
export var version = '1.0.1';

// control

import {Control, control} from './control/Control';
import {Layers, layers} from './control/Control.Layers';
import {Zoom, zoom} from './control/Control.Zoom';
import {Scale, scale} from './control/Control.Scale';
import {Attribution, attribution} from './control/Control.Attribution.js';

Control.Layers = Layers;
Control.Zoom = Zoom;
Control.Scale = Scale;
Control.Attribution = Attribution;

control.layers = layers;
control.zoom = zoom;
control.scale = scale;
control.attribution = attribution;

export {Control, control};

// core

import * as Browser from './core/Browser';
export {Browser};

export {Class} from './core/Class';

import {Evented} from './core/Events';
export {Evented};
export var Mixin = {Events: Evented.prototype};

export {Handler} from './core/Handler';

import * as Util from './core/Util';
export {Util};
export {extend, bind, stamp, setOptions} from './core/Util';
import {extend} from './core/Util';

// dom

export {PosAnimation} from './dom/PosAnimation';

import * as DomEvent from './dom/DomEvent';
export {DomEvent};

import * as DomUtil from './dom/DomUtil';
export {DomUtil};

export {Draggable} from './dom/Draggable';

// geometry

export {Point, toPoint as point} from './geometry/Point';
export {Bounds, toBounds as bounds} from './geometry/Bounds';
export {Transformation} from './geometry/Transformation';

// geo

export {LatLng, toLatLng as latLng} from './geo/LatLng';
export {LatLngBounds, toLatLngBounds as latLngBounds} from './geo/LatLngBounds';

// geo/projection

import * as Projection from './geo/projection/Projection';
export {Projection};

// geo/crs

import {CRS} from './geo/crs/CRS';
import {Earth} from './geo/crs/CRS.Earth';
import {EPSG3395} from './geo/crs/CRS.EPSG3395';
import {EPSG3857, EPSG900913} from './geo/crs/CRS.EPSG3857';
import {EPSG4326} from './geo/crs/CRS.EPSG4326';
import {Simple} from './geo/crs/CRS.Simple';

CRS.Earth = Earth;
CRS.EPSG3395 = EPSG3395;
CRS.EPSG3857 = EPSG3857;
CRS.EPSG900913 = EPSG900913;
CRS.EPSG4326 = EPSG4326;
CRS.Simple = Simple;

export {CRS};

// layer

export {Layer} from './layer/Layer';
export {DivOverlay} from './layer/DivOverlay';
export {LayerGroup, layerGroup} from './layer/LayerGroup';
export {FeatureGroup, featureGroup} from './layer/FeatureGroup';
export {ImageOverlay, imageOverlay} from './layer/ImageOverlay';
export {Popup, popup} from './layer/Popup';
export {Tooltip, tooltip} from './layer/Tooltip';

import {Icon} from './layer/marker/Icon';
export {icon} from './layer/marker/Icon';
import {IconDefault} from './layer/marker/Icon.Default';
Icon.Default = IconDefault;
export {Icon};

export {DivIcon, divIcon} from './layer/marker/DivIcon';
export {Marker, marker} from './layer/marker/Marker';

export {GridLayer, gridLayer} from './layer/tile/GridLayer';
import {TileLayer, tileLayer} from './layer/tile/TileLayer';
import {TileLayerWMS, tileLayerWMS} from './layer/tile/TileLayer.WMS';
TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;
export {TileLayer, tileLayer};


// map

export {Map, createMap as map} from './map/Map';

// misc

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}
