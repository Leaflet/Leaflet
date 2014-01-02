/*
 * L.CRS.Earth is the base class for all CRS representing Earth.
 */

L.CRS.Earth = L.extend({}, L.CRS, {
	wrapLng: [-180, 180],

	R: 6378137,

	// distane between two geographic points using Harvesine formula
	distance: function (latlng1, latlng2) {
		var rad = Math.PI / 180,
		    lat1 = latlng1.lat * rad,
		    lat2 = latlng2.lat * rad,
		    sin1 = Math.sin((lat2 - lat1) / 2),
		    sin2 = Math.sin((latlng2.lng - latlng1.lng) * rad / 2);

		var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

		return this.R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	}
});
