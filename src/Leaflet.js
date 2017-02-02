
import {version} from '../package.json';
export {version};

// control
export * from './control/index';

// core
export * from './core/index';

// dom
export * from './dom/index';

// geometry
export * from './geometry/index';

// geo
export * from './geo/index';

// layer
export * from './layer/index';

export {Layer} from './layer/Layer';
export {LayerGroup, layerGroup} from './layer/LayerGroup';
export {FeatureGroup, featureGroup} from './layer/FeatureGroup';
import {GeoJSON, geoJSON, geoJson, geometryToLayer, coordsToLatLng, coordsToLatLngs, latLngToCoords, latLngsToCoords, getFeature, asFeature} from './layer/GeoJSON';
GeoJSON.geometryToLayer = geometryToLayer;
GeoJSON.coordsToLatLng = coordsToLatLng;
GeoJSON.coordsToLatLngs = coordsToLatLngs;
GeoJSON.latLngToCoords = latLngToCoords;
GeoJSON.latLngsToCoords = latLngsToCoords;
GeoJSON.getFeature = getFeature;
GeoJSON.asFeature = asFeature;
export {GeoJSON, geoJSON, geoJson};

export {ImageOverlay, imageOverlay} from './layer/ImageOverlay';
export {VideoOverlay, videoOverlay} from './layer/VideoOverlay';

export {DivOverlay} from './layer/DivOverlay';
export {Popup, popup} from './layer/Popup';
export {Tooltip, tooltip} from './layer/Tooltip';

import {Icon} from './layer/marker/Icon';
export {icon} from './layer/marker/Icon';
import {IconDefault} from './layer/marker/Icon.Default';
Icon.Default = IconDefault;
export {Icon};

export {DivIcon, divIcon} from './layer/marker/DivIcon';
export {Marker, marker} from './layer/marker/Marker';

// layer, tile
export {GridLayer, gridLayer} from './layer/tile/GridLayer';
import {TileLayer, tileLayer} from './layer/tile/TileLayer';
import {TileLayerWMS, tileLayerWMS} from './layer/tile/TileLayer.WMS';
TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;
export {TileLayer, tileLayer};

// layer, vector
export {Renderer} from './layer/vector/Renderer';
export {Canvas, canvas} from './layer/vector/Canvas';
export {SVG, svg} from './layer/vector/SVG';
import './layer/vector/Renderer.getRenderer';	// This is a bit of a hack, but needed because circular dependencies

export {Path} from './layer/vector/Path';
export {CircleMarker, circleMarker} from './layer/vector/CircleMarker';
export {Circle, circle} from './layer/vector/Circle';
export {Polyline, polyline} from './layer/vector/Polyline';
export {Polygon, polygon} from './layer/vector/Polygon';
export {Rectangle, rectangle} from './layer/vector/Rectangle';

import * as LineUtil from './geometry/LineUtil';
export {LineUtil};
import * as PolyUtil from './geometry/PolyUtil';
export {PolyUtil};
>>>>>>> Add VideoOverlay class based on ImageOverlay

// map
export * from './map/index';

// misc

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}
