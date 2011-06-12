
L.GeoJSON = L.LayerGroup.extend({
	includes: L.Mixin.Events,
	
	initialize: function(geojson, options) {
		L.Util.setOptions(this, options);
		this._geojson = geojson;
		this._layers = {};
		
		if (geojson) {
			this.addGeoJSON(geojson);
		}
	},
	
	addGeoJSON: function(geojson) {
		if (geojson.features) {
			for (var i = 0, len = geojson.features.length; i < len; i++) {
				this.addGeoJSON(geojson.features[i]);
			}
			return;
		}
				
		var isFeature = (geojson.type == 'Feature'),
			geometry = (isFeature ? geojson.geometry : geojson),
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
	geometryToLayer: function(geometry, pointToLayer) {
		var coords = geometry.coordinates, 
			latlng, latlngs, 
			i, len, 
			layer, 
			layers = [];

		switch (geometry.type) {
			case 'Point':
				latlng = this.coordsToLatlng(coords);
				return pointToLayer ? pointToLayer(latlng) : new L.Marker(latlng);
				
			case 'MultiPoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = this.coordsToLatlng(coords[i]);
					layer = pointToLayer ? pointToLayer(latlng) : new L.Marker(latlng);
					layers.push(layer);
				}
				return new L.FeatureGroup(layers);
				
			case 'LineString':
				latlngs = this.coordsToLatlngs(coords);
				return new L.Polyline(latlngs);
				
			case 'Polygon':
				latlngs = this.coordsToLatlngs(coords, 1);
				return new L.Polygon(latlngs);
				
			case 'MultiLineString':
				latlngs = this.coordsToLatlngs(coords, 1);
				return new L.MultiPolyline(latlngs);
				
			case "MultiPolygon":
				latlngs = this.coordsToLatlngs(coords, 2);
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

	coordsToLatlng: function(coords) {
		return new L.LatLng(coords[1], coords[0]);
	},

	coordsToLatlngs: function(coords, levelsDeep) {
		var latlng, latlngs = [],
			i, len = coords.length;
		
		for (i = 0; i < len; i++) {
			latlng = levelsDeep ? 
					this.coordsToLatlngs(coords[i], levelsDeep - 1) : 
					this.coordsToLatlng(coords[i]);
			latlngs.push(latlng);
		}
		return latlngs;
	}
});