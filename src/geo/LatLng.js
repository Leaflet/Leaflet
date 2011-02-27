/*
	CM.LatLng represents a geographical point with latitude and longtitude coordinates.
*/

L.LatLng = function(/*Number*/ lat, /*Number*/ lng, /*Boolean*/ noWrap) {
	if (noWrap !== true) {
		lat = Math.max(Math.min(lat, 90), -90);					// clamp latitude into -90..90
		lng = (lng + 180) % 360 + (lng < -180 ? 180 : -180);	// wrap longtitude into -180..180
	}
	
	//TODO change to lat() & lng()
	this.lat = lat;
	this.lng = lng;
};
	
L.Util.extend(L.LatLng, {
	DEG_TO_RAD: Math.PI / 180,
	RAD_TO_DEG: 180 / Math.PI,
	MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

L.LatLng.prototype = {
	equals: function(/*LatLng*/ obj) {
		if (!(obj instanceof L.LatLng)) { return false; }
		
		var margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));
		return margin <= L.LatLng.MAX_MARGIN;
	},
	
	toString: function() {
		return 'LatLng(' + 
				L.Util.formatNum(this.lat) + ', ' + 
				L.Util.formatNum(this.lng) + ')';
	}
};