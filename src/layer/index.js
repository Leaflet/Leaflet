export {Layer} from './Layer.js';
export {LayerGroup} from './LayerGroup.js';
export {FeatureGroup} from './FeatureGroup.js';
import {GeoJSON, geometryToLayer, coordsToLatLng, coordsToLatLngs, latLngToCoords, latLngsToCoords, getFeature, asFeature} from './GeoJSON.js';

// TODO: can they be static functions in the GeoJSON Class?
GeoJSON.geometryToLayer = geometryToLayer;
GeoJSON.coordsToLatLng = coordsToLatLng;
GeoJSON.coordsToLatLngs = coordsToLatLngs;
GeoJSON.latLngToCoords = latLngToCoords;
GeoJSON.latLngsToCoords = latLngsToCoords;
GeoJSON.getFeature = getFeature;
GeoJSON.asFeature = asFeature;
export {GeoJSON};

export {BlanketOverlay} from './BlanketOverlay.js';

export {ImageOverlay} from './ImageOverlay.js';
export {VideoOverlay} from './VideoOverlay.js';
export {SVGOverlay} from './SVGOverlay.js';

export {DivOverlay} from './DivOverlay.js';
export {Popup} from './Popup.js';
export {Tooltip} from './Tooltip.js';

export * from './marker/index.js';
export * from './tile/index.js';
export * from './vector/index.js';
