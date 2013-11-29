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

	unproject: function (point) {
		return this.projection.unproject(point);
	},

	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},

	getProjectedBounds: function (zoom) {
		if (this.infinite) { return null; }

		var b = this.projection.bounds,
		    s = this.scale(zoom),
		    min = this.transformation.transform(b.min, s),
		    max = this.transformation.transform(b.max, s);

		return L.bounds(min, max);
	},

	wrapLatLng: function (latlng) {
		var lng = this.wrapLng ? L.Util.wrapNum(latlng.lng, this.wrapLng[0], this.wrapLng[1], true) : latlng.lng,
		    lat = this.wrapLat ? L.Util.wrapNum(latlng.lat, this.wrapLat[0], this.wrapLat[1], true) : latlng.lat;

		return L.latLng(lat, lng);
	}
};
