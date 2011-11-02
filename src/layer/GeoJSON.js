
L.GeoJSON = L.FeatureGroup.extend({
	initialize: function(geojson, options) {
		L.Util.setOptions(this, options);
		this._geojson = geojson;
		this._layers = {};
		
		if (geojson) {
			this.addGeoJSON(geojson);
		}
	},

	addGeoJSON: function(geojson) {
		var onFeatureParse = function(x) { return function(e) { x.fire('featureparse', e); } }(this),
			layer = L.GeoJSON.geoJSONToLayer(geojson, this.options.pointToLayer, onFeatureParse);
		this.addLayer(layer);
	}
});

L.Util.extend(L.GeoJSON, {
	geoJSONToLayer: function(geojson, pointToLayer, onFeatureParse) {
		var i, len, layer, geometry,
			layers = [],
			isFeature = (geojson.type == 'Feature');

		if (geojson.features) {
			for (i = 0, len = geojson.features.length; i < len; i++) {
				layers.push(L.GeoJSON.geoJSONToLayer(geojson.features[i], pointToLayer));
			}
			return new L.FeatureGroup(layers);
		}
		
		geometry = isFeature ? geojson.geometry	: geojson;
		layer = L.GeoJSON.geometryToLayer(geometry, pointToLayer);

		onFeatureParse && onFeatureParse({
			layer: layer,
			properties: geojson.properties,
			geometryType: geometry.type,
			bbox: geojson.bbox,
			id: geojson.id
		});

		return layer;
	},			
	
	geometryToLayer: function(geometry, pointToLayer) {
		var coords = geometry.coordinates, 
			latlng, latlngs, 
			i, len, 
			layer, 
			layers = [];

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
					layer = this.geometryToLayer(geometry.geometries[i]);
					layers.push(layer);
				}
				return new L.FeatureGroup(layers);
				
			default:
				throw new Error('Invalid GeoJSON object.');
		}
	},

	coordsToLatLng: function(/*Array*/ coords, /*Boolean*/ reverse)/*: LatLng*/ {
		var lat = parseFloat(coords[reverse ? 0 : 1]),
			lng = parseFloat(coords[reverse ? 1 : 0]);
		return new L.LatLng(lat, lng);
	},

	coordsToLatLngs: function(/*Array*/ coords, /*Number*/ levelsDeep, /*Boolean*/ reverse)/*: Array*/ {
		var latlng, latlngs = [],
			i, len = coords.length;
		
		for (i = 0; i < len; i++) {
			latlng = levelsDeep ? 
					this.coordsToLatLngs(coords[i], levelsDeep - 1, reverse) : 
					this.coordsToLatLng(coords[i], reverse);
			latlngs.push(latlng);
		}
		return latlngs;
	}
});
