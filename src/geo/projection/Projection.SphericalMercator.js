/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {

	MAX_LATITUDE: 85.0511287798,

	R: 6378137,

	project: function (latlng) {
		var d = L.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    x = this.R * latlng.lng * d,
		    y = Math.max(Math.min(max, latlng.lat), -max) * d;

		y = this.R * Math.log(Math.tan((Math.PI / 4) + (y / 2)));

		return new L.Point(x, y);
	},

	unproject: function (point) {
		var d = L.LatLng.RAD_TO_DEG,
		    lng = point.x * d / this.R,
		    lat = (2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d;

		return new L.LatLng(lat, lng);
	},

	bounds: (function () {
		var d = 6378137 * Math.PI;
		return L.bounds([-d, -d], [d, d]);
	})()
};
