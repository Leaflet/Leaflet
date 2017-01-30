/*
 * @namespace Projection
 * @section
 * Leaflet comes with a set of already defined Projections out of the box:
 *
 * @projection L.Projection.LonLat
 *
 * Equirectangular, or Plate Carree projection — the most simple projection,
 * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
 * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
 * `EPSG:3395` and `Simple` CRS.
 */

L.Projection = {};

L.Projection.LonLat = {
	project: function (latlng) {
		var _latlng = L.latLng(latlng);

		return new L.Point(_latlng.lng, _latlng.lat);
	},

	unproject: function (point) {
		var _point = L.point(point);

		return new L.LatLng(_point.y, _point.x);
	},

	bounds: L.bounds([-180, -90], [180, 90])
};
