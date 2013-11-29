/*
 * L.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
 */

L.CRS = {
	latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
		var scale = this.scale(zoom),
		    untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	},

	project: function (latlng) {
		return this.projection.project(latlng);
	},

	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},

	getProjectedBounds: function (zoom) {
		var b = this.projection.bounds,
		    s = this.scale(zoom),
		    min = this.transformation.transform(b.min, s),
		    max = this.transformation.transform(b.max, s);

		return L.bounds(min, max);
	},

	bounds: L.latLngBounds([-90, -180], [90, 180]),

	wrapLatLng: function (latlng) {
		var bounds = this.bounds,
		    lng = this.wrapLng ? L.Util.wrapNum(latlng.lng, bounds.getWest(),  bounds.getEast(),  true) : latlng.lng,
		    lat = this.wrapLat ? L.Util.wrapNum(latlng.lat, bounds.getSouth(), bounds.getNorth(), true) : latlng.lat;

		return L.latLng(lat, lng);
	}
};
