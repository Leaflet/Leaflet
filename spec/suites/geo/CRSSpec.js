describe("CRS.EPSG3857", function () {
	var crs = L.CRS.EPSG3857;

	describe("#latLngToPoint", function () {
		it("projects a center point", function () {
			expect(crs.latLngToPoint(L.latLng(0, 0), 0)).near(new L.Point(128, 128), 0.01);
		});

		it("projects the northeast corner of the world", function () {
			expect(crs.latLngToPoint(L.latLng(85.0511287798, 180), 0)).near(new L.Point(256, 0));
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(crs.latLngToPoint([0, 0], 0)).near(new L.Point(128, 128), 0.01);
			expect(crs.latLngToPoint({lat: 0, lng: 0}, 0)).near(new L.Point(128, 128), 0.01);
		});
	});

	describe("#pointToLatLng", function () {
		it("reprojects a center point", function () {
			expect(crs.pointToLatLng(new L.Point(128, 128), 0)).nearLatLng(L.latLng(0, 0), 0.01);
		});

		it("reprojects the northeast corner of the world", function () {
			expect(crs.pointToLatLng(new L.Point(256, 0), 0)).nearLatLng(L.latLng(85.0511287798, 180));
		});

		it("accepts L.Point and L.Point expressions", function () {
			expect(crs.pointToLatLng([128, 128], 0)).nearLatLng(L.latLng(0, 0), 0.01);
		});
	});

	describe("project", function () {
		it('projects geo coords into meter coords correctly', function () {
			expect(crs.project(new L.LatLng(50, 30))).near(new L.Point(3339584.7238, 6446275.84102));
			expect(crs.project(new L.LatLng(85.0511287798, 180))).near(new L.Point(20037508.34279, 20037508.34278));
			expect(crs.project(new L.LatLng(-85.0511287798, -180))).near(new L.Point(-20037508.34279, -20037508.34278));
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(crs.project([50, 30])).near(new L.Point(3339584.7238, 6446275.84102));
			expect(crs.project({lat: 50, lng: 30})).near(new L.Point(3339584.7238, 6446275.84102));
		});
	});

	describe("unproject", function () {
		it('unprojects meter coords into geo coords correctly', function () {
			expect(crs.unproject(new L.Point(3339584.7238, 6446275.84102))).nearLatLng(new L.LatLng(50, 30));
			expect(crs.unproject(new L.Point(20037508.34279, 20037508.34278))).nearLatLng(new L.LatLng(85.051129, 180));
			expect(crs.unproject(new L.Point(-20037508.34279, -20037508.34278))).nearLatLng(new L.LatLng(-85.051129, -180));
		});

		it("accepts L.Point and L.Point expressions", function () {
			expect(crs.unproject([3339584.7238, 6446275.84102])).nearLatLng(new L.LatLng(50, 30));
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

	describe('#wrapLatLng', function () {
		it("wraps longitude to lie between -180 and 180 by default", function () {
			expect(crs.wrapLatLng(new L.LatLng(0, 190)).lng).to.eql(-170);
			expect(crs.wrapLatLng(new L.LatLng(0, 360)).lng).to.eql(0);
			expect(crs.wrapLatLng(new L.LatLng(0, 380)).lng).to.eql(20);
			expect(crs.wrapLatLng(new L.LatLng(0, -190)).lng).to.eql(170);
			expect(crs.wrapLatLng(new L.LatLng(0, -360)).lng).to.eql(0);
			expect(crs.wrapLatLng(new L.LatLng(0, -380)).lng).to.eql(-20);
			expect(crs.wrapLatLng(new L.LatLng(0, 90)).lng).to.eql(90);
			expect(crs.wrapLatLng(new L.LatLng(0, 180)).lng).to.eql(180);
		});

		it("does not drop altitude", function () {
			expect(crs.wrapLatLng(new L.LatLng(0, 190, 1234)).lng).to.eql(-170);
			expect(crs.wrapLatLng(new L.LatLng(0, 190, 1234)).alt).to.eql(1234);

			expect(crs.wrapLatLng(new L.LatLng(0, 380, 1234)).lng).to.eql(20);
			expect(crs.wrapLatLng(new L.LatLng(0, 380, 1234)).alt).to.eql(1234);
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(crs.wrapLatLng([0, 190]).lng).to.eql(-170);
			expect(crs.wrapLatLng({lat: 0, lng: 190}).lng).to.eql(-170);
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

describe("CRS.EPSG3395", function () {
	var crs = L.CRS.EPSG3395;

	describe("#latLngToPoint", function () {
		it("projects a center point", function () {
			expect(crs.latLngToPoint(L.latLng(0, 0), 0)).near(new L.Point(128, 128), 0.01);
		});

		it("projects the northeast corner of the world", function () {
			expect(crs.latLngToPoint(L.latLng(85.0840591556, 180), 0)).near(new L.Point(256, 0));
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(crs.latLngToPoint([0, 0], 0)).near(new L.Point(128, 128), 0.01);
			expect(crs.latLngToPoint({lat: 0, lng: 0}, 0)).near(new L.Point(128, 128), 0.01);
		});
	});

	describe("#pointToLatLng", function () {
		it("reprojects a center point", function () {
			expect(crs.pointToLatLng(new L.Point(128, 128), 0)).nearLatLng(L.latLng(0, 0), 0.01);
		});

		it("reprojects the northeast corner of the world", function () {
			expect(crs.pointToLatLng(new L.Point(256, 0), 0)).nearLatLng(L.latLng(85.0840591556, 180));
		});

		it("accepts L.Point and L.Point expressions", function () {
			expect(crs.pointToLatLng([128, 128], 0)).nearLatLng(L.latLng(0, 0), 0.01);
		});
	});
});

describe("CRS.Simple", function () {
	var crs = L.CRS.Simple;

	describe("#latLngToPoint", function () {
		it("converts LatLng coords to pixels", function () {
			expect(crs.latLngToPoint(L.latLng(0, 0), 0)).near(new L.Point(0, 0));
			expect(crs.latLngToPoint(L.latLng(700, 300), 0)).near(new L.Point(300, -700));
			expect(crs.latLngToPoint(L.latLng(-200, 1000), 1)).near(new L.Point(2000, 400));
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(crs.latLngToPoint([0, 0], 0)).near(new L.Point(0, 0));
			expect(crs.latLngToPoint({lat: 0, lng: 0}, 0)).near(new L.Point(0, 0));
		});
	});

	describe("#pointToLatLng", function () {
		it("converts pixels to LatLng coords", function () {
			expect(crs.pointToLatLng(L.point(0, 0), 0)).nearLatLng(new L.LatLng(0, 0));
			expect(crs.pointToLatLng(L.point(300, -700), 0)).nearLatLng(new L.LatLng(700, 300));
			expect(crs.pointToLatLng(L.point(2000, 400), 1)).nearLatLng(new L.LatLng(-200, 1000));
		});

		it("accepts L.Point and L.Point expressions", function () {
			expect(crs.pointToLatLng([0, 0], 0)).nearLatLng(new L.LatLng(0, 0));
		});
	});

	describe("getProjectedBounds", function () {
		it("returns nothing", function () {
			expect(crs.getProjectedBounds(5)).to.be(null);
		});
	});

	describe("wrapLatLng", function () {
		it("returns coords as is", function () {
			expect(crs.wrapLatLng(new L.LatLng(270, 400)).equals(new L.LatLng(270, 400))).to.be(true);
		});

		it("wraps coords if configured", function () {
			var crs = L.extend({}, L.CRS.Simple, {
				wrapLng: [-200, 200],
				wrapLat: [-200, 200]
			});

			expect(crs.wrapLatLng(new L.LatLng(300, -250))).nearLatLng(new L.LatLng(-100, 150));
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(crs.wrapLatLng([270, 400]).equals(new L.LatLng(270, 400))).to.be(true);
			expect(crs.wrapLatLng({lat: 270, lng: 400}).equals(new L.LatLng(270, 400))).to.be(true);
		});
	});
});

describe("CRS", function () {
	var crs = L.CRS;

	describe("#zoom && #scale", function () {
		it("convert zoom to scale and viceversa and return the same values", function () {
			var zoom = 2.5;
			var scale = crs.scale(zoom);
			expect(crs.zoom(scale)).to.eql(zoom);
		});
	});
});

describe("CRS.ZoomNotPowerOfTwo", function () {
	var crs = L.extend({}, L.CRS, {
		scale: function (zoom) {
			return 256 * Math.pow(1.5, zoom);
		},
		zoom: function (scale) {
			return Math.log(scale / 256) / Math.log(1.5);
		}
	});

	describe("#scale", function () {
		it("of zoom levels are related by a power of 1.5", function () {
			var zoom = 5;
			var scale = crs.scale(zoom);
			expect(crs.scale(zoom + 1)).to.eql(1.5 * scale);
			expect(crs.zoom(1.5 * scale)).to.eql(zoom + 1);
		});
	});

	describe("#zoom && #scale", function () {
		it("convert zoom to scale and viceversa and return the same values", function () {
			var zoom = 2;
			var scale = crs.scale(zoom);
			expect(crs.zoom(scale)).to.eql(zoom);
		});
	});
});

describe("CRS.Earth", function () {
	describe("#distance", function () {
		// Test values from http://rosettacode.org/wiki/Haversine_formula,
		// we assume using mean earth radius (https://en.wikipedia.org/wiki/Earth_radius#Mean_radius)
		// is correct, since that's what International Union of Geodesy and Geophysics recommends,
		// and that sounds serious.

		it("calculates the distance between to latlng's", function () {
			var p1 = L.latLng(36.12, -86.67);
			var p2 = L.latLng(33.94, -118.40);
			expect(L.CRS.Earth.distance(p1, p2)).to.be.within(2886444.43, 2886444.45);
		});

		it("accepts L.LatLng and L.LatLng expressions", function () {
			expect(L.CRS.Earth.distance([36.12, -86.67], [33.94, -118.40])).to.be.within(2886444.43, 2886444.45);
			expect(L.CRS.Earth.distance({lat: 36.12, lng: -86.67}, {lat: 33.94, lng: -118.40})).to.be.within(2886444.43, 2886444.45);
		});
	});
});
