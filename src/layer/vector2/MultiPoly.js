
L.MultiPolyline = L.Polyline.extend();
L.MultiPolygon = L.Polygon.extend();

L.multiPolyline = function (latlngs, options) {
	return new L.MultiPolyline(latlngs, options);
};

L.multiPolygon = function (latlngs, options) {
	return new L.MultiPolygon(latlngs, options);
};
