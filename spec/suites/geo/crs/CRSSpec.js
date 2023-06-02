import {CRS, latLng, point, latLngBounds, Util, extend} from 'leaflet';

describe('CRS.EPSG3857', () => {
	const crs = CRS.EPSG3857;

	describe('#latLngToPoint', () => {
		it('projects a center point', () => {
			expect(crs.latLngToPoint(latLng(0, 0), 0)).near([128, 128], 0.01);
		});

		it('projects the northeast corner of the world', () => {
			expect(crs.latLngToPoint(latLng(85.0511287798, 180), 0)).near([256, 0]);
		});
	});

	describe('#pointToLatLng', () => {
		it('reprojects a center point', () => {
			expect(crs.pointToLatLng(point(128, 128), 0)).nearLatLng([0, 0], 0.01);
		});

		it('reprojects the northeast corner of the world', () => {
			expect(crs.pointToLatLng(point(256, 0), 0)).nearLatLng([85.0511287798, 180]);
		});
	});

	describe('project', () => {
		it('projects geo coords into meter coords correctly', () => {
			expect(crs.project(latLng(50, 30))).near([3339584.7238, 6446275.84102]);
			expect(crs.project(latLng(85.0511287798, 180))).near([20037508.34279, 20037508.34278]);
			expect(crs.project(latLng(-85.0511287798, -180))).near([-20037508.34279, -20037508.34278]);
		});
	});

	describe('unproject', () => {
		it('unprojects meter coords into geo coords correctly', () => {
			expect(crs.unproject(point(3339584.7238, 6446275.84102))).nearLatLng([50, 30]);
			expect(crs.unproject(point(20037508.34279, 20037508.34278))).nearLatLng([85.051129, 180]);
			expect(crs.unproject(point(-20037508.34279, -20037508.34278))).nearLatLng([-85.051129, -180]);
		});
	});

	describe('#getProjectedBounds', () => {
		it('gives correct size', () => {
			let i,
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

	describe('#wrapLatLng', () => {
		it('wraps longitude to lie between -180 and 180 by default', () => {
			expect(crs.wrapLatLng(latLng(0, 190)).lng).to.eql(-170);
			expect(crs.wrapLatLng(latLng(0, 360)).lng).to.eql(0);
			expect(crs.wrapLatLng(latLng(0, 380)).lng).to.eql(20);
			expect(crs.wrapLatLng(latLng(0, -190)).lng).to.eql(170);
			expect(crs.wrapLatLng(latLng(0, -360)).lng).to.eql(0);
			expect(crs.wrapLatLng(latLng(0, -380)).lng).to.eql(-20);
			expect(crs.wrapLatLng(latLng(0, 90)).lng).to.eql(90);
			expect(crs.wrapLatLng(latLng(0, 180)).lng).to.eql(180);
		});

		it('does not drop altitude', () => {
			expect(crs.wrapLatLng(latLng(0, 190, 1234)).lng).to.eql(-170);
			expect(crs.wrapLatLng(latLng(0, 190, 1234)).alt).to.eql(1234);

			expect(crs.wrapLatLng(latLng(0, 380, 1234)).lng).to.eql(20);
			expect(crs.wrapLatLng(latLng(0, 380, 1234)).alt).to.eql(1234);
		});
	});

	describe('#wrapLatLngBounds', () => {
		it('does not wrap bounds between -180 and 180 longitude', () => {

			let bounds1 = latLngBounds([-10, -10], [10, 10]);
			let bounds2 = latLngBounds([-80, -180], [-70, -170]);
			let bounds3 = latLngBounds([70, 170], [80, 180]);

			bounds1 = crs.wrapLatLngBounds(bounds1);
			bounds2 = crs.wrapLatLngBounds(bounds2);
			bounds3 = crs.wrapLatLngBounds(bounds3);

			expect(bounds1.getSouth()).to.eql(-10);
			expect(bounds1.getWest()).to.eql(-10);
			expect(bounds1.getNorth()).to.eql(10);
			expect(bounds1.getEast()).to.eql(10);

			expect(bounds2.getSouth()).to.eql(-80);
			expect(bounds2.getWest()).to.eql(-180);
			expect(bounds2.getNorth()).to.eql(-70);
			expect(bounds2.getEast()).to.eql(-170);

			expect(bounds3.getSouth()).to.eql(70);
			expect(bounds3.getWest()).to.eql(170);
			expect(bounds3.getNorth()).to.eql(80);
			expect(bounds3.getEast()).to.eql(180);

		});

		it('wraps bounds when center longitude is less than -180', () => {
			let bounds1 = latLngBounds([0, -185], [10, -170]);
			let bounds2 = latLngBounds([0, -190], [10, -175]);

			bounds1 = crs.wrapLatLngBounds(bounds1);
			bounds2 = crs.wrapLatLngBounds(bounds2);

			expect(bounds1.getSouth()).to.eql(0);
			expect(bounds1.getWest()).to.eql(-185);
			expect(bounds1.getNorth()).to.eql(10);
			expect(bounds1.getEast()).to.eql(-170);

			expect(bounds2.getSouth()).to.eql(0);
			expect(bounds2.getWest()).to.eql(170);
			expect(bounds2.getNorth()).to.eql(10);
			expect(bounds2.getEast()).to.eql(185);
		});

		it('wraps bounds when center longitude is larger than +180', () => {
			let bounds1 = latLngBounds([0, 185], [10, 170]);
			let bounds2 = latLngBounds([0, 190], [10, 175]);

			bounds1 = crs.wrapLatLngBounds(bounds1);
			bounds2 = crs.wrapLatLngBounds(bounds2);

			expect(bounds1.getSouth()).to.eql(0);
			expect(bounds1.getWest()).to.eql(170);
			expect(bounds1.getNorth()).to.eql(10);
			expect(bounds1.getEast()).to.eql(185);

			expect(bounds2.getSouth()).to.eql(0);
			expect(bounds2.getWest()).to.eql(-185);
			expect(bounds2.getNorth()).to.eql(10);
			expect(bounds2.getEast()).to.eql(-170);
		});

	});

});

describe('CRS.EPSG4326', () => {
	const crs = CRS.EPSG4326;

	describe('#getSize', () => {
		it('gives correct size', () => {
			let i,
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

describe('CRS.EPSG3395', () => {
	const crs = CRS.EPSG3395;

	describe('#latLngToPoint', () => {
		it('projects a center point', () => {
			expect(crs.latLngToPoint(latLng(0, 0), 0)).near([128, 128], 0.01);
		});

		it('projects the northeast corner of the world', () => {
			expect(crs.latLngToPoint(latLng(85.0840591556, 180), 0)).near([256, 0]);
		});
	});

	describe('#pointToLatLng', () => {
		it('reprojects a center point', () => {
			expect(crs.pointToLatLng(point(128, 128), 0)).nearLatLng([0, 0], 0.01);
		});

		it('reprojects the northeast corner of the world', () => {
			expect(crs.pointToLatLng(point(256, 0), 0)).nearLatLng([85.0840591556, 180]);
		});
	});
});

describe('CRS.Simple', () => {
	const crs = CRS.Simple;

	describe('#latLngToPoint', () => {
		it('converts LatLng coords to pixels', () => {
			expect(crs.latLngToPoint(latLng(0, 0), 0)).near([0, 0]);
			expect(crs.latLngToPoint(latLng(700, 300), 0)).near([300, -700]);
			expect(crs.latLngToPoint(latLng(-200, 1000), 1)).near([2000, 400]);
		});
	});

	describe('#pointToLatLng', () => {
		it('converts pixels to LatLng coords', () => {
			expect(crs.pointToLatLng(point(0, 0), 0)).nearLatLng([0, 0]);
			expect(crs.pointToLatLng(point(300, -700), 0)).nearLatLng([700, 300]);
			expect(crs.pointToLatLng(point(2000, 400), 1)).nearLatLng([-200, 1000]);
		});
	});

	describe('getProjectedBounds', () => {
		it('returns nothing', () => {
			expect(crs.getProjectedBounds(5)).to.equal(null);
		});
	});

	describe('wrapLatLng', () => {
		it('returns coords as is', () => {
			expect(crs.wrapLatLng(latLng(270, 400)).equals(latLng(270, 400))).to.be.true;
		});

		it('wraps coords if configured', () => {
			const crs = extend({}, CRS.Simple, {
				wrapLng: [-200, 200],
				wrapLat: [-200, 200]
			});

			expect(crs.wrapLatLng(latLng(300, -250))).nearLatLng([-100, 150]);
		});
	});
});

describe('CRS', () => {
	const crs = CRS;

	describe('#zoom && #scale', () => {
		it('convert zoom to scale and viceversa and return the same values', () => {
			const zoom = 2.5;
			const scale = crs.scale(zoom);
			const zoom2 = crs.zoom(scale);
			expect(Util.formatNum(zoom2)).to.eql(zoom);
		});
	});
});

describe('CRS.ZoomNotPowerOfTwo', () => {
	const crs = extend({}, CRS, {
		scale(zoom) {
			return 256 * Math.pow(1.5, zoom);
		},
		zoom(scale) {
			return Math.log(scale / 256) / Math.log(1.5);
		}
	});

	describe('#scale', () => {
		it('of zoom levels are related by a power of 1.5', () => {
			const zoom = 5;
			const scale = crs.scale(zoom);
			expect(crs.scale(zoom + 1)).to.eql(1.5 * scale);
			expect(crs.zoom(1.5 * scale)).to.eql(zoom + 1);
		});
	});

	describe('#zoom && #scale', () => {
		it('convert zoom to scale and viceversa and return the same values', () => {
			const zoom = 2;
			const scale = crs.scale(zoom);
			expect(crs.zoom(scale)).to.eql(zoom);
		});
	});
});

describe('CRS.Earth', () => {
	describe('#distance', () => {
		// Test values from http://rosettacode.org/wiki/Haversine_formula,
		// we assume using mean earth radius (https://en.wikipedia.org/wiki/Earth_radius#Mean_radius)
		// is correct, since that's what International Union of Geodesy and Geophysics recommends,
		// and that sounds serious.
		const p1 = latLng(36.12, -86.67);
		const p2 = latLng(33.94, -118.40);
		expect(CRS.Earth.distance(p1, p2)).to.be.within(2886444.43, 2886444.45);
	});
});
