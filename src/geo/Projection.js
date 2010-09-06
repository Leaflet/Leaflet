/*
 * L.Projection contains various geographical projections.
 */

L.Projection = {};

// Mercator Projection - see http://en.wikipedia.org/wiki/Mercator_projection
L.Projection.Mercator = {
	statics: {
		MAX_LATITUDE: (function() {
			var a = Math.exp(2 * Math.PI);
			return Math.asin((a - 1)/(a + 1)) * L.LatLng.RAD_TO_DEG;	
		})()
	},		
		
	project: function(/*LatLng*/ latlng) /*-> Point*/ {
		var d = L.LatLng.DEG_TO_RAD,
			max = L.Projection.Mercator.MAX_LATITUDE,
			lat = Math.max(Math.min(max, latlng.lat), -max),
			x = latlng.lng * d,
			y = lat * d;
		
		y = Math.log(Math.tan(Math.PI/4 + y/2));
		
		return new CM.Point(x, y);
	},
	
	unproject: function(/*Point*/ point) /*-> LatLng*/ {	
		var d = L.LatLng.DEG_TO_RAD,
			lng = point.x / d,
			lat = (2 * Math.atan(Math.exp(point.y)) - Math.PI/2) / d;
			
		return new L.LatLng(lat, lng);
	}
};