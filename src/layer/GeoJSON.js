
L.GeoJSON = L.FeatureGroup.extend({
	initialize: function (geojson, options) {
		L.Util.setOptions(this, options);

		this._geojson = geojson;
		this._layers = {};

		if (geojson) {
			this.addGeoJSON(geojson);
		}
	},

	addGeoJSON: function (geojson) {
		var features = geojson.features,
		    i, len;

		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				this.addGeoJSON(features[i]);
			}
			return;
		}

		var isFeature = (geojson.type === 'Feature'),
		    geometry = isFeature ? geojson.geometry : geojson,
		    layer = L.GeoJSON.geometryToLayer(geometry, this.options.pointToLayer);

		this.fire('featureparse', {
			layer: layer,
			properties: geojson.properties,
			geometryType: geometry.type,
			bbox: geojson.bbox,
			id: geojson.id
		});

		this.addLayer(layer);
	}
});

L.Util.extend(L.GeoJSON, {
	geometryToLayer: function (geometry, pointToLayer) {
		var coords = geometry.coordinates,
		    layers = [],
		    latlng, latlngs, i, len, layer;

		switch (geometry.type) {
		case 'Point':
			latlng = this.coordsToLatLng(coords);
			return pointToLayer ? pointToLayer(latlng) : new L.Marker(latlng);

		case 'MultiPoint':
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = this.coordsToLatLng(coords[i]);
				layer = pointToLayer ? pointToLayer(latlng) : new L.Marker(latlng);
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
