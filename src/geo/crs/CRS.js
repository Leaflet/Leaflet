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

	getBounds: function () {
		var proj = this.projection,
		    min = proj.unproject(proj.bounds.min),
		    max = proj.unproject(proj.bounds.max);

		return L.latLngBounds(min, max);
	},

	wrapLatLng: function (latlng) {
		var bounds = this.getBounds(),
		    lng = this.wrapLng ? this._wrap(latlng.lng, bounds.getWest(),  bounds.getEast())  : latlng.lng,
		    lat = this.wrapLat ? this._wrap(latlng.lat, bounds.getSouth(), bounds.getNorth()) : latlng.lat;

		return L.latLng(lat, lng);
	},

	_wrap: function (value, min, max) {
		return (value + max) % (max - min) + (value < min || value === max ? max : min);
	}
};
