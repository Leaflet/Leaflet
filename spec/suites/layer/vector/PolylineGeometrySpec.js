describe('PolylineGeometry', function() {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#distanceTo", function() {
		it("calculates distances to points", function() {
			var p1 = map.latLngToLayerPoint(new L.LatLng(55.8, 37.6));
			var p2 = map.latLngToLayerPoint(new L.LatLng(57.123076977278, 44.861962891635));
			var latlngs = [[56.485503424111, 35.545556640339], [55.972522915346, 36.116845702918], [55.502459116923, 34.930322265253], [55.31534617509, 38.973291015816]]
			.map(function(ll) {
				return new L.LatLng(ll[0], ll[1]);
			});
			var polyline = new L.Polyline([], {
				'noClip': true
			});
			map.addLayer(polyline);

			expect(polyline.closestLayerPoint(p1)).to.be(null);

			polyline.setLatLngs(latlngs);
			var point = polyline.closestLayerPoint(p1);
			expect(point).not.to.be(null);
			expect(point.distance).to.not.be(Infinity);
			expect(point.distance).to.not.be(NaN);

			var point2 = polyline.closestLayerPoint(p2);

			expect(point.distance).to.be.lessThan(point2.distance);
		});
	});
});
