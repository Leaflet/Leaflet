/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {
	MAX_LATITUDE: 85.0511287798,
	R_MAJOR: 6378137,
	project: function (latlng) { // (LatLng) -> Point
		var d = L.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    x = latlng.lng * d * this.R_MAJOR,
		    y = lat * d;

		y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));
		y *= this.R_MAJOR;
		return new L.Point(x, y);
	},

	unproject: function (point) { // (Point, Boolean) -> LatLng
		var d = L.LatLng.RAD_TO_DEG,
		    lng = point.x * d / this.R_MAJOR,
		    lat = (2 * Math.atan(Math.exp(point.y / this.R_MAJOR)) - (Math.PI / 2)) * d;

		return new L.LatLng(lat, lng);
	}
};
