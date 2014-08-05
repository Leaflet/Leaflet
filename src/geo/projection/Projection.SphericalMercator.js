/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {

	R: 6378137,


	project: function (latlng, magnetPoint) {
		if (latlng._projectedPoint) {
			return latlng._projectedPoint.clone();
		}
		var d = Math.PI / 180,
			max = 1 - 1E-15,
			sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max),
			y = this.R * Math.log((1 + sin) / (1 - sin)) / 2,
			x = this.R * latlng.lng * d;

		if (magnetPoint) {
			var w = 2 * Math.PI * this.R,
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

		var point = new L.Point(x, y);
		latlng._projectedPoint = point.clone();
		return point;
	},

	unproject: function (point) {
		var d = 180 / Math.PI,
			latlng = new L.LatLng(
			(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
			point.x * d / this.R);
		latlng._projectedPoint = point;
		return latlng;
	},


	bounds: (function () {
		var d = 6378137 * Math.PI;
		return L.bounds([-d, -d], [d, d]);
	})()

};
