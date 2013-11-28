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

	describe("#getProjectedBounds", function () {
		it("gives correct size", function () {
			var i,
			    worldSize = 256,
			    crsSize;
			for (i = 0; i <= 22; i++) {
				crsSize = crs.getProjectedBounds(i).getSize();
				expect(crsSize.x).equal(worldSize);
				expect(crsSize.y).equal(worldSize);
				worldSize *= 2;
			}
		});
	});
});

describe("CRS.EPSG4326", function () {
	var crs = L.CRS.EPSG4326;

	describe("#getSize", function () {
		it("gives correct size", function () {
			var i,
			    worldSize = 256,
			    crsSize;
			for (i = 0; i <= 22; i++) {
				crsSize = crs.getProjectedBounds(i).getSize();
				expect(crsSize.x).equal(worldSize * 2);
				// Lat bounds are half as high (-90/+90 compared to -180/+180)
				expect(crsSize.y).equal(worldSize);
				worldSize *= 2;
			}
		});
	});
});
