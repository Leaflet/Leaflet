describe('PolygonGeometry', function() {
	
	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(-37.7872, 175.2797), 16);

	describe("Polygon Intersection", function () {
		var latlngs = [
				L.latLng(-37.7787, 175.2701),
				L.latLng(-37.7705, 175.2679),
				L.latLng(-37.7713, 175.2828),
				L.latLng(-37.7803, 175.2815)
			],
			intersectlatLng1 = L.latLng(-37.7753, 175.2603),
			intersectlatLng2 = L.latLng(-37.7753, 175.2603),
			polygon = new L.Polygon([], {
				'noClip': true
			});
		map.addLayer(polygon);

		describe("#intersects", function () {
            /* []--[]
               |  /
               | /
               [] */
			it("should not intersect when has 3 sides", function () {
				polygon.setLatLngs(latlngs.slice(0, 3));
				expect(polygon.intersects()).toBe(false);
			});

            /* []--[]
               |    |
               []--[] */
			it("should not intersect when has 4 sides", function () {
				polygon.setLatLngs(latlngs.slice(0, 4));
				expect(polygon.intersects()).toBe(false);
			});

            /* []--[]
               |  /
               | /
               |/
               /
              /|
             / |
            []-[] */
			it("should intersect when edge crosses", function () {
				var newLatlngs = latlngs.slice(0, 3);
				newLatlngs.push(intersectlatLng1);
				polygon.setLatLngs(newLatlngs);
				expect(polygon.intersects()).toBe(true);
			});

            /* []
               | \
               |  \
               |   \
               []---\--[]
                     \  |
                      \ |
                       [] */
			it("should intersect when last edge crosses", function () {
				var newLatlngs = latlngs.slice(0, 2);
				newLatlngs.push(intersectlatLng2);
				newLatlngs.push(latlngs[3]);
				polygon.setLatLngs(newLatlngs);
				expect(polygon.intersects()).toBe(true);
			});
		});
	});
});