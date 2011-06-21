
L.Polygon.include(L.Path.SVG || !L.Path.CANVAS ? {} : {
	_initEvents: function() {
		// TODO polygon events (through http://en.wikipedia.org/wiki/Point_in_polygon)
	}
});