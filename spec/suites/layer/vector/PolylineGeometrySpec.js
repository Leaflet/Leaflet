describe('PolylineGeometry', function() {
	
	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);
	
	describe("#distanceTo", function() {
		it("should calculate correct distances to points", function() {
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
			
			expect(polyline.closestLayerPoint(p1)).toEqual(null);
			
			polyline.setLatLngs(latlngs);
			var point = polyline.closestLayerPoint(p1);
			expect(point).not.toEqual(null);
			expect(point.distance).not.toEqual(Infinity);
			expect(point.distance).not.toEqual(NaN);
			
			var point2 = polyline.closestLayerPoint(p2);
			
			expect(point.distance).toBeLessThan(point2.distance);
		});
	});

	describe("Polyline Intersection", function () {
		var latlngs = [
				L.latLng(-37.7760, 175.2687),
				L.latLng(-37.7664, 175.2786),
				L.latLng(-37.7768, 175.2897),
				L.latLng(-37.7736, 175.2797)
			],
			intersectlatLng1 = L.latLng(-37.7670, 175.2667),
			intersectlatLng2 = L.latLng(-37.7690, 175.2978),
			polyline = new L.Polyline([], {
				'noClip': true
			});
		map.addLayer(polyline);
		// Set up the map to work with above coords
		map.setView(new L.LatLng(-37.7872, 175.2797), 16);

		describe("#newLatLngIntersects", function () {
			it("should not intersect when only one line segment", function () {
				polyline.setLatLngs(latlngs.slice(0, 2));
				expect(polyline.newLatLngIntersects(latlngs[2])).toBe(false);
			});

			it("should intersect first line segment", function () {
				polyline.setLatLngs(latlngs.slice(0, 3));
				expect(polyline.newLatLngIntersects(intersectlatLng1)).toBe(true);
			});

			it("should not intersect when add non-intersecting latlng", function () {
				polyline.setLatLngs(latlngs.slice(0, 3));
				expect(polyline.newLatLngIntersects(latlngs[3])).toBe(false);
			});

			it("should intersect second line segment", function () {
				polyline.setLatLngs(latlngs.slice(0, 4));
				expect(polyline.newLatLngIntersects(intersectlatLng2)).toBe(true);
			});
		});
	});
});
