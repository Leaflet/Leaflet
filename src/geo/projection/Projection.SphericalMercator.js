/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng, magnetPoint) { // (LatLng[, Point]) -> Point
		if (latlng._projectedPoint) {
			return latlng._projectedPoint.clone();
		}
		var d = L.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    x = latlng.lng * d,
		    y = lat * d,
		    point;

		y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

		if (magnetPoint) {
			var w = 2 * Math.PI,
				xPlus = x + w,
				xMinus = x - w,
				xToMagnet = Math.abs(magnetPoint.x - x);
			if (Math.abs(magnetPoint.x - xPlus) < xToMagnet) {
				x = xPlus;
			}
			else if (Math.abs(magnetPoint.x - xMinus) < xToMagnet) {
				x = xMinus;
			}
		}

		point = new L.Point(x, y);
		latlng._projectedPoint = point.clone();
		return point;
	},

	unproject: function (point) { // (Point) -> LatLng
		var d = L.LatLng.RAD_TO_DEG,
			lng = point.x * d,
			lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d,
			latlng = new L.LatLng(lat, lng);
		latlng._projectedPoint = point;
		return latlng;
	}
};
