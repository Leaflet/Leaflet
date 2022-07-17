describe('CircleMarker', function () {
	var map, container;

	beforeEach(function () {
		container = container = createContainer();
		map = L.map(container);
		map.setView([0, 0], 1);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	describe("#_radius", function () {
		describe("when a CircleMarker is added to the map ", function () {
			describe("with a radius set as an option", function () {
				it("takes that radius", function () {
					var marker = L.circleMarker([0, 0], {radius: 20}).addTo(map);

					expect(marker._radius).to.be(20);
				});
			});

			describe("and radius is set before adding it", function () {
				it("takes that radius", function () {
					var marker = L.circleMarker([0, 0], {radius: 20});
					marker.setRadius(15);
					marker.addTo(map);
					expect(marker._radius).to.be(15);
				});
			});

			describe("and radius is set after adding it", function () {
				it("takes that radius", function () {
					var marker = L.circleMarker([0, 0], {radius: 20});
					marker.addTo(map);
					marker.setRadius(15);
					expect(marker._radius).to.be(15);
				});
			});

			describe("and setStyle is used to change the radius after adding", function () {
				it("takes the given radius", function () {
					var marker = L.circleMarker([0, 0], {radius: 20});
					marker.addTo(map);
					marker.setStyle({radius: 15});
					expect(marker._radius).to.be(15);
				});
			});

			describe("and setStyle is used to change the radius before adding", function () {
				it("takes the given radius", function () {
					var marker = L.circleMarker([0, 0], {radius: 20});
					marker.setStyle({radius: 15});
					marker.addTo(map);
					expect(marker._radius).to.be(15);
				});
			});
		});
	});

	describe("#setLatLng", function () {
		it("fires a move event", function () {
			var marker = L.circleMarker([0, 0]);
			map.addLayer(marker);

			var beforeLatLng = marker._latlng;
			var afterLatLng = L.latLng(1, 2);

			var eventArgs = null;
			marker.on('move', function (e) {
				eventArgs = e;
			});

			marker.setLatLng(afterLatLng);

			expect(eventArgs).to.not.be(null);
			expect(eventArgs.oldLatLng).to.be(beforeLatLng);
			expect(eventArgs.latlng).to.be(afterLatLng);
			expect(marker.getLatLng()).to.be(afterLatLng);
		});
	});

	describe("#_containsPoint", function () {
		it("checks if a point is contained", function () {
			var point1 = L.point(200, 200);
			var point2 = L.point(10, 10);
			var circlemarker = L.circleMarker([10, 10], {radius: 20});

			circlemarker.addTo(map);

			expect(circlemarker._containsPoint(point1)).to.be(true);
			expect(circlemarker._containsPoint(point2)).to.be(false);
		});
	});
});
