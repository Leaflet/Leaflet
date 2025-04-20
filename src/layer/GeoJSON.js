import {LayerGroup} from './LayerGroup.js';
import {FeatureGroup} from './FeatureGroup.js';
import * as Util from '../core/Util.js';
import {Marker} from './marker/Marker.js';
import {Circle} from './vector/Circle.js';
import {CircleMarker} from './vector/CircleMarker.js';
import {Polyline} from './vector/Polyline.js';
import {Polygon} from './vector/Polygon.js';
import {LatLng, toLatLng} from '../geo/LatLng.js';
import * as LineUtil from '../geometry/LineUtil.js';


/*
 * @class GeoJSON
 * @aka L.GeoJSON
 * @inherits FeatureGroup
 *
 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
 * GeoJSON data and display it on the map. Extends `FeatureGroup`.
 *
 * @example
 *
 * ```js
 * L.geoJSON(data, {
 * 	style: function (feature) {
 * 		return {color: feature.properties.color};
 * 	}
 * }).bindPopup(function (layer) {
 * 	return layer.feature.properties.description;
 * }).addTo(map);
 * ```
 */

export const GeoJSON = FeatureGroup.extend({

	/* @section
	 * @aka GeoJSON options
	 *
	 * @option pointToLayer: Function = *
	 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
	 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
	 * The default is to spawn a default `Marker`:
	 * ```js
	 * function(geoJsonPoint, latlng) {
	 * 	return L.marker(latlng);
	 * }
	 * ```
	 *
	 * @option style: Function = *
	 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
	 * called internally when data is added.
	 * The default value is to not override any defaults:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return {}
	 * }
	 * ```
	 *
	 * @option onEachFeature: Function = *
	 * A `Function` that will be called once for each created `Feature`, after it has
	 * been created and styled. Useful for attaching events and popups to features.
	 * The default is to do nothing with the newly created layers:
	 * ```js
	 * function (feature, layer) {}
	 * ```
	 *
	 * @option filter: Function = *
	 * A `Function` that will be used to decide whether to include a feature or not.
	 * The default is to include all features:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return true;
	 * }
	 * ```
	 * Note: dynamically changing the `filter` option will have effect only on newly
	 * added data. It will _not_ re-evaluate already included features.
	 *
	 * @option coordsToLatLng: Function = *
	 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
	 * The default is the `coordsToLatLng` static method.
	 *
	 * @option markersInheritOptions: Boolean = false
	 * Whether default Markers for "Point" type Features inherit from group options.
	 */

	initialize(geojson, options) {
		Util.setOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	// @method addData( <GeoJSON> data ): this
	// Adds a GeoJSON object to the layer.
	addData(geojson) {
		const features = Array.isArray(geojson) ? geojson : geojson.features;

		if (features) {
			for (const feature of features) {
				// only add this if geometry or geometries are set and not null
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(feature);
				}
			}
			return this;
		}

		const options = this.options;

		if (options.filter && !options.filter(geojson)) { return this; }

		const layer = geometryToLayer(geojson, options);
		if (!layer) {
			return this;
		}
		layer.feature = asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	// @method resetStyle( <Path> layer? ): this
	// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
	// If `layer` is omitted, the style of all features in the current layer is reset.
	resetStyle(layer) {
		if (layer === undefined) {
			return this.eachLayer(this.resetStyle, this);
		}
		// reset any custom styles
		layer.options = {...layer.defaultOptions};
		this._setLayerStyle(layer, this.options.style);
		return this;
	},

	// @method setStyle( <Function> style ): this
	// Changes styles of GeoJSON vector layers with the given style function.
	setStyle(style) {
		return this.eachLayer(layer => this._setLayerStyle(layer, style));
	},

	_setLayerStyle(layer, style) {
		if (layer.setStyle) {
			if (typeof style === 'function') {
				style = style(layer.feature);
			}
			layer.setStyle(style);
		}
	}
});

// @section
// There are several static functions which can be called without instantiating L.GeoJSON:

// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
// Creates a `Layer` from a given GeoJSON feature. Can use a custom
// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
// functions if provided as options.
export function geometryToLayer(geojson, options) {

	const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
	      coords = geometry?.coordinates,
	      layers = [],
	      pointToLayer = options?.pointToLayer,
	      _coordsToLatLng = options?.coordsToLatLng ?? coordsToLatLng;
	let latlng, latlngs;

	if (!coords && !geometry) {
		return null;
	}

	switch (geometry.type) {
	case 'Point':
		latlng = _coordsToLatLng(coords);
		return _pointToLayer(pointToLayer, geojson, latlng, options);

	case 'MultiPoint':
		for (const coord of coords) {
			latlng = _coordsToLatLng(coord);
			layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
		}
		return new FeatureGroup(layers);

	case 'LineString':
	case 'MultiLineString':
		latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
		return new Polyline(latlngs, options);

	case 'Polygon':
	case 'MultiPolygon':
		latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
		return new Polygon(latlngs, options);

	case 'GeometryCollection':
		for (const g of geometry.geometries) {
			const geoLayer = geometryToLayer({
				geometry: g,
				type: 'Feature',
				properties: geojson.properties
			}, options);

			if (geoLayer) {
				layers.push(geoLayer);
			}
		}
		return new FeatureGroup(layers);

	case 'FeatureCollection':
		for (const f of geometry.features) {
			const featureLayer = geometryToLayer(f, options);

			if (featureLayer) {
				layers.push(featureLayer);
			}
		}
		return new FeatureGroup(layers);

	default:
		throw new Error('Invalid GeoJSON object.');
	}
}

function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
	return pointToLayerFn ?
		pointToLayerFn(geojson, latlng) :
		new Marker(latlng, options?.markersInheritOptions && options);
}

// @function coordsToLatLng(coords: Array): LatLng
// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
export function coordsToLatLng(coords) {
	return new LatLng(coords[1], coords[0], coords[2]);
}

// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
export function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
	return coords.map(coord => (levelsDeep ?
		coordsToLatLngs(coord, levelsDeep - 1, _coordsToLatLng) :
		(_coordsToLatLng || coordsToLatLng)(coord)));
}

// @function latLngToCoords(latlng: LatLng, precision?: Number|false): Array
// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
// Coordinates values are rounded with [`formatNum`](#util-formatnum) function.
export function latLngToCoords(latlng, precision) {
	latlng = toLatLng(latlng);
	return latlng.alt !== undefined ?
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision), Util.formatNum(latlng.alt, precision)] :
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision)];
}

// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, close?: Boolean, precision?: Number|false): Array
// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
// `close` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
// Coordinates values are rounded with [`formatNum`](#util-formatnum) function.
export function latLngsToCoords(latlngs, levelsDeep, close, precision) {
	// Check for flat arrays required to ensure unbalanced arrays are correctly converted in recursion
	const coords = latlngs.map(latlng => (levelsDeep ?
		latLngsToCoords(latlng, LineUtil.isFlat(latlng) ? 0 : levelsDeep - 1, close, precision) :
		latLngToCoords(latlng, precision)));

	if (!levelsDeep && close && coords.length > 0) {
		coords.push(coords[0].slice());
	}

	return coords;
}

export function getFeature(layer, newGeometry) {
	return layer.feature ?
		{...layer.feature, geometry: newGeometry} :
		asFeature(newGeometry);
}

// @function asFeature(geojson: Object): Object
// Normalize GeoJSON geometries/features into GeoJSON features.
export function asFeature(geojson) {
	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
		return geojson;
	}

	return {
		type: 'Feature',
		properties: {},
		geometry: geojson
	};
}

const PointToGeoJSON = {
	toGeoJSON(precision) {
		return getFeature(this, {
			type: 'Point',
			coordinates: latLngToCoords(this.getLatLng(), precision)
		});
	}
};

// @namespace Marker
// @section Other methods
// @method toGeoJSON(precision?: Number|false): Object
// Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
// Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
Marker.include(PointToGeoJSON);

// @namespace CircleMarker
// @method toGeoJSON(precision?: Number|false): Object
// Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
// Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
Circle.include(PointToGeoJSON);
CircleMarker.include(PointToGeoJSON);


// @namespace Polyline
// @method toGeoJSON(precision?: Number|false): Object
// Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
// Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
Polyline.include({
	toGeoJSON(precision) {
		const multi = !LineUtil.isFlat(this._latlngs);

		const coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

		return getFeature(this, {
			type: `${multi ? 'Multi' : ''}LineString`,
			coordinates: coords
		});
	}
});

// @namespace Polygon
// @method toGeoJSON(precision?: Number|false): Object
// Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
// Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
Polygon.include({
	toGeoJSON(precision) {
		const holes = !LineUtil.isFlat(this._latlngs),
		    multi = holes && !LineUtil.isFlat(this._latlngs[0]);

		let coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

		if (!holes) {
			coords = [coords];
		}

		return getFeature(this, {
			type: `${multi ? 'Multi' : ''}Polygon`,
			coordinates: coords
		});
	}
});


// @namespace LayerGroup
LayerGroup.include({
	toMultiPoint(precision) {
		const coords = [];

		this.eachLayer((layer) => {
			coords.push(layer.toGeoJSON(precision).geometry.coordinates);
		});

		return getFeature(this, {
			type: 'MultiPoint',
			coordinates: coords
		});
	},

	// @method toGeoJSON(precision?: Number|false): Object
	// Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
	// Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
	toGeoJSON(precision) {

		const type = this.feature?.geometry?.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint(precision);
		}

		const isGeometryCollection = type === 'GeometryCollection',
		    jsons = [];

		this.eachLayer((layer) => {
			if (layer.toGeoJSON) {
				const json = layer.toGeoJSON(precision);
				if (isGeometryCollection) {
					jsons.push(json.geometry);
				} else {
					const feature = asFeature(json);
					// Squash nested feature collections
					if (feature.type === 'FeatureCollection') {
						jsons.push.apply(jsons, feature.features);
					} else {
						jsons.push(feature);
					}
				}
			}
		});

		if (isGeometryCollection) {
			return getFeature(this, {
				geometries: jsons,
				type: 'GeometryCollection'
			});
		}

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}
});

// @namespace GeoJSON
// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
// Creates a GeoJSON layer. Optionally accepts an object in
// [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
// (you can alternatively add it later with `addData` method) and an `options` object.
export function geoJSON(geojson, options) {
	return new GeoJSON(geojson, options);
}

// Backward compatibility.
export const geoJson = geoJSON;
