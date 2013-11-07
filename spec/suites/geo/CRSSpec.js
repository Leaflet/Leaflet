describe("CRS.EPSG3395", function () {
	var crs = L.CRS.EPSG3395;

	describe("#latLngToPoint", function () {
		it("projects a center point", function () {
			expect(crs.latLngToPoint(L.latLng(0, 0), 0)).near(new L.Point(128, 128), 0.01);
		});

		it("projects the northeast corner of the world", function () {
			expect(crs.latLngToPoint(L.latLng(85.0840591556, 180), 0)).near(new L.Point(256, 0));
		});
	});

	describe("#pointToLatLng", function () {
		it("reprojects a center point", function () {
			expect(crs.pointToLatLng(new L.Point(128, 128), 0)).nearLatLng(L.latLng(0, 0), 0.01);
		});

		it("reprojects the northeast corner of the world", function () {
			expect(crs.pointToLatLng(new L.Point(256, 0), 0)).nearLatLng(L.latLng(85.0840591556, 180));
		});
	});
});

describe("CRS.EPSG3857", function () {
	var crs = L.CRS.EPSG3857;

	describe("#latLngToPoint", function () {
		it("projects a center point", function () {
			expect(crs.latLngToPoint(L.latLng(0, 0), 0)).near(new L.Point(128, 128), 0.01);
		});

		it("projects the northeast corner of the world", function () {
			expect(crs.latLngToPoint(L.latLng(85.0511287798, 180), 0)).near(new L.Point(256, 0));
		});
	});

	describe("#pointToLatLng", function () {
		it("reprojects a center point", function () {
			expect(crs.pointToLatLng(new L.Point(128, 128), 0)).nearLatLng(L.latLng(0, 0), 0.01);
		});

		it("reprojects the northeast corner of the world", function () {
			expect(crs.pointToLatLng(new L.Point(256, 0), 0)).nearLatLng(L.latLng(85.0511287798, 180));
		});
	});
});
