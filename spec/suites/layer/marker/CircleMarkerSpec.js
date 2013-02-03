describe('CircleMarker', function() {
	describe("#_radius", function() {
		var map;
		beforeEach(function() {
			map = L.map(document.createElement('div'));
		});
		describe("when a CircleMarker is added to the map ", function() {
			describe("with a radius set as an option", function() {
				it("should take that radius", function() {
					map.setView([0, 0], 1);

					var marker = L.circleMarker([0, 0], { radius: 20 }).addTo(map);

					expect(marker._radius).toBe(20);
				});
			});

			describe("and radius is set before adding it", function () {
				it("should take that radius", function () {
					map.setView([0, 0], 1);

					var marker = L.circleMarker([0, 0], { radius: 20 });
					marker.setRadius(15);
					marker.addTo(map);
					expect(marker._radius).toBe(15);
				});
			});

			describe("and radius is set after adding it", function () {
				it("should take that radius", function () {
					map.setView([0, 0], 1);

					var marker = L.circleMarker([0, 0], { radius: 20 });
					marker.addTo(map);
					marker.setRadius(15);
					expect(marker._radius).toBe(15);
				});
			});
		});
	});
});