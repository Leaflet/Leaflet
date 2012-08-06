L.GeoJSON = L.FeatureGroup.extend({
	statics: {
		FeatureLayer: {
			_properties: null,
			getProperties: function () {
				return this._properties ? this._properties : null;
			},
			getId: function () {
				return L.Util.stamp(this);
			},
			_injectProps: function (properties) {
				this._properties = properties instanceof Object ? L.Util.clone(properties) : null;
			}
		}
	},
	initialize: function (geojson, options) {
		L.Util.setOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	getLayerById: function (id) {
		var ret = this._layers[id];
		return ret !== undefined ? ret : null;
	},

	addData: function (geojson) {
		var features = geojson instanceof Array ? geojson : geojson.type === "FeatureCollection" && geojson.features,
		    i, len;

		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				this.addData(features[i]);
			}
			return this;
		}

		var options = this.options,
		    style = options.style;

		if (options.filter && !options.filter(geojson)) { return; }

		var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer);

		L.Util.extend(layer, this.constructor.FeatureLayer);

		if (style) {
			if (typeof style === 'function') {
				style = style(geojson);
			}
			if (layer.setStyle) {
				layer.setStyle(style);
			}
		}
		
		if (geojson.type === 'Feature') {
			i = options.preserveId && undefined !== geojson.id ? geojson.id : undefined;
			// if id is contained in feature and we should keep it, stamp it forced or else stamp as usual
			L.Util.stamp(layer, i);

			if (options.storeProps) {
				layer._injectProps(geojson.properties);
			}

			if (options.onEachFeature) {
				options.onEachFeature(geojson, layer);
			}
		}

		return this.addLayer(layer);
	}
});

L.Util.extend(L.GeoJSON, {
	geometryToLayer: function (geojson, pointToLayer) {
		var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		    coords = geometry.coordinates,
		    layers = [],
		    latlng, latlngs, i, len, layer;

		switch (geometry.type) {
		case 'Point':
			latlng = this.coordsToLatLng(coords);
			return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);

		case 'MultiPoint':
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = this.coordsToLatLng(coords[i]);
				layer = pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
				layers.push(layer);
			}
			return new L.FeatureGroup(layers);

		case 'LineString':
			latlngs = this.coordsToLatLngs(coords);
			return new L.Polyline(latlngs);

		case 'Polygon':
			latlngs = this.coordsToLatLngs(coords, 1);
			return new L.Polygon(latlngs);

		case 'MultiLineString':
			latlngs = this.coordsToLatLngs(coords, 1);
			return new L.MultiPolyline(latlngs);

		case "MultiPolygon":
			latlngs = this.coordsToLatLngs(coords, 2);
			return new L.MultiPolygon(latlngs);

		case "GeometryCollection":
			for (i = 0, len = geometry.geometries.length; i < len; i++) {
				layer = this.geometryToLayer(geometry.geometries[i], pointToLayer);
				layers.push(layer);
			}
			return new L.FeatureGroup(layers);

		default:
			throw new Error('Invalid GeoJSON object.');
		}
	},

	coordsToLatLng: function (coords, reverse) { // (Array, Boolean) -> LatLng
		var lat = parseFloat(coords[reverse ? 0 : 1]),
		    lng = parseFloat(coords[reverse ? 1 : 0]);

		return new L.LatLng(lat, lng, true);
	},

	coordsToLatLngs: function (coords, levelsDeep, reverse) { // (Array, Number, Boolean) -> Array
		var latlng,
		    latlngs = [],
		    i, len;

		for (i = 0, len = coords.length; i < len; i++) {
			latlng = levelsDeep ?
					this.coordsToLatLngs(coords[i], levelsDeep - 1, reverse) :
					this.coordsToLatLng(coords[i], reverse);

			latlngs.push(latlng);
		}

		return latlngs;
	}
});

L.geoJson = function (geojson, options) {
	return new L.GeoJSON(geojson, options);
};
