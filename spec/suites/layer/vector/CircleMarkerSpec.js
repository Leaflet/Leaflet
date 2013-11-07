describe('CircleMarker', function () {
	describe("#_radius", function () {
		var map;
		beforeEach(function () {
			map = L.map(document.createElement('div'));
			map.setView([0, 0], 1);
		});
		describe("when a CircleMarker is added to the map ", function () {
			describe("with a radius set as an option", function () {
				it("takes that radius", function () {
					var marker = L.circleMarker([0, 0], { radius: 20 }).addTo(map);

					expect(marker._radius).to.be(20);
				});
			});

			describe("and radius is set before adding it", function () {
				it("takes that radius", function () {
					var marker = L.circleMarker([0, 0], { radius: 20 });
					marker.setRadius(15);
					marker.addTo(map);
					expect(marker._radius).to.be(15);
				});
			});

			describe("and radius is set after adding it", function () {
				it("takes that radius", function () {
					var marker = L.circleMarker([0, 0], { radius: 20 });
					marker.addTo(map);
					marker.setRadius(15);
					expect(marker._radius).to.be(15);
				});
			});

			describe("and setStyle is used to change the radius after adding", function () {
				it("takes the given radius", function () {
					var marker = L.circleMarker([0, 0], { radius: 20 });
					marker.addTo(map);
					marker.setStyle({ radius: 15 });
					expect(marker._radius).to.be(15);
				});
			});
			describe("and setStyle is used to change the radius before adding", function () {
				it("takes the given radius", function () {
					var marker = L.circleMarker([0, 0], { radius: 20 });
					marker.setStyle({ radius: 15 });
					marker.addTo(map);
					expect(marker._radius).to.be(15);
				});
			});
		});
	});
});
