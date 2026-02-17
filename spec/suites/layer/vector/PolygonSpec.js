import {expect} from 'chai';
import {LineUtil, LeafletMap, LatLng, Polygon} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Polygon', () => {
	let map, container;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#initialize', () => {
		it('should never be flat', () => {
			const latLngs = [[1, 2], [3, 4]];

			const poly = new Polygon(latLngs);

			expect(LineUtil.isFlat(poly._latlngs)).to.be.false;
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const poly = new Polygon(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(poly._latlngs).to.not.eql(sourceLatLngs);
		});

		it('can be called with an empty array', () => {
			const poly = new Polygon([]);
			expect(poly._latlngs).to.eql([[]]);
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('can be initialized with holes', () => {
			const originalLatLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			const poly = new Polygon(originalLatLngs);

			expect(poly._latlngs).to.eql([
				[new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0])],
				[new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4])]
			]);
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('can be initialized with multi including hole', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			const poly = new Polygon(latLngs);

			expect(poly._latlngs).to.eql([
				[[new LatLng([10, 20]), new LatLng([30, 40]), new LatLng([50, 60])]],
				[[new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0])], [new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4])]]
			]);
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('can be added to the map when empty', () => {
			const poly = new Polygon([]).addTo(map);
			const isAdded = map.hasLayer(poly);
			expect(isAdded).to.be.true;
		});

	});

	describe('#isEmpty', () => {

		it('should return true for a polygon with no latlngs', () => {
			const layer = new Polygon([]);
			expect(layer.isEmpty()).to.be.true;
		});

		it('should return false for simple polygon', () => {
			const latLngs = [[1, 2], [3, 4], [5, 6]];
			const layer = new Polygon(latLngs);
			expect(layer.isEmpty()).to.be.false;
		});

		it('should return false for a multi-polygon', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];
			const layer = new Polygon(latLngs);
			expect(layer.isEmpty()).to.be.false;
		});

	});

	describe('#setLatLngs', () => {
		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const poly = new Polygon(sourceLatLngs);

			poly.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it('can be set external ring and holes', () => {
			const latLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			const poly = new Polygon([]);
			poly.setLatLngs(latLngs);

			expect(poly.getLatLngs()).to.eql([
				[new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0])],
				[new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4])]
			]);
		});

		it('can be set multi including hole', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			const poly = new Polygon([]);
			poly.setLatLngs(latLngs);

			expect(poly.getLatLngs()).to.eql([
				[[new LatLng([10, 20]), new LatLng([30, 40]), new LatLng([50, 60])]],
				[[new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0])], [new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4])]]
			]);
		});

	});

	describe('#getCenter', () => {
		it('should compute center of a big simple polygon around equator', () => {
			const latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			const layer = new Polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('should compute center of a small simple polygon', () => {
			const latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			const layer = new Polygon(latlngs).addTo(map);
			map.setZoom(0);  // Make the polygon disappear in screen.
			expect(layer.getCenter()).to.be.nearLatLng([0.005, 0.005]);
		});

		it('throws error if not yet added to map', () => {
			expect(() => {
				const latlngs = [
					[[0, 0], [10, 0], [10, 10], [0, 10]]
				];
				const layer = new Polygon(latlngs);
				layer.getCenter();
			}).to.throw('Must add layer to map before using getCenter()');
		});

		it('should compute same center for low and high zoom', () => {
			const latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			const layer = new Polygon(latlngs).addTo(map);
			map.setZoom(0);
			const center = layer.getCenter();
			map.setZoom(18);
			expect(layer.getCenter()).to.be.nearLatLng(center);
		});

		it('should compute center for multi-polygon including hole', () => {
			const latlngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];
			const layer = new Polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([31.436532296911807, 39.99999999999979]);
		});
	});

	describe('#_defaultShape', () => {
		it('should return latlngs on a simple polygon', () => {
			const latlngs = [
				new LatLng([1, 2]),
				new LatLng([3, 4])
			];

			const poly = new Polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs);
		});

		it('should return first latlngs on a polygon with hole', () => {
			const latlngs = [
				[new LatLng([0, 12]), new LatLng([13, 14]), new LatLng([15, 16])],
				[new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6])]
			];

			const poly = new Polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs[0]);
		});

		it('should return first latlngs on a multipolygon', () => {
			const latlngs = [
				[[new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6])]],
				[[new LatLng([11, 12]), new LatLng([13, 14]), new LatLng([15, 16])]]
			];

			const poly = new Polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs[0][0]);
		});

		it('should return first latlngs on a multipolygon with hole', () => {
			const latlngs = [
				[[new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0])],
					[new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4])]],
				[[new LatLng([10, 20]), new LatLng([30, 40]), new LatLng([50, 60])]]
			];

			const poly = new Polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs[0][0]);
		});
	});

	describe('#addLatLng', () => {
		it('should add latlng to latlngs', () => {
			const latLngs = [
				[1, 2],
				[3, 4]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([5, 6]);

			expect(poly._latlngs).to.eql([[new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6])]]);
		});

		it('should add latlng to first latlngs on a polygon with hole', () => {
			const latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([17, 0]);

			expect(poly._latlngs[0]).to.eql([new LatLng([0, 12]), new LatLng([13, 14]), new LatLng([15, 16]), new LatLng([17, 0])]);
			expect(poly._latlngs[1]).to.eql([new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6])]);
		});

		it('should add latlng by reference on a polygon with hole', () => {
			const latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([7, 8], poly._latlngs[1]);

			expect(poly._latlngs[0]).to.eql([new LatLng([0, 12]), new LatLng([13, 14]), new LatLng([15, 16])]);
			expect(poly._latlngs[1]).to.eql([new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6]), new LatLng([7, 8])]);
		});

		it('should add latlng to first latlngs on a multi', () => {
			const latLngs = [
				[[[1, 2], [3, 4]]],
				[[[11, 12], [13, 14], [15, 16]]]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([5, 6]);

			expect(poly._latlngs[0]).to.eql([[new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6])]]);
			expect(poly._latlngs[1]).to.eql([[new LatLng([11, 12]), new LatLng([13, 14]), new LatLng([15, 16])]]);
		});

		it('should add latlng to latlngs by reference on a multi', () => {
			const latLngs = [
				[[[11, 12], [13, 14], [15, 16]]],
				[[[1, 2], [3, 4]]]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([5, 6], poly._latlngs[1][0]);

			expect(poly._latlngs[1]).to.eql([[new LatLng([1, 2]), new LatLng([3, 4]), new LatLng([5, 6])]]);
			expect(poly._latlngs[0]).to.eql([[new LatLng([11, 12]), new LatLng([13, 14]), new LatLng([15, 16])]]);
		});

		it('should add latlng on first latlngs by default on a multipolygon with hole', () => {
			const latLngs = [
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]],
				[[[10, 20], [30, 40], [50, 60]]]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([-10, -10]);

			expect(poly._latlngs[0][0]).to.eql([new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0]), new LatLng([-10, -10])]);
			expect(poly._latlngs[0][1]).to.eql([new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4])]);
			expect(poly._latlngs[1][0]).to.eql([new LatLng([10, 20]), new LatLng([30, 40]), new LatLng([50, 60])]);
		});

		it('should add latlng by reference on a multipolygon with hole', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			const poly = new Polygon(latLngs);

			poly.addLatLng([2, 2], poly._latlngs[1][1]);

			expect(poly._latlngs[0][0]).to.eql([new LatLng([10, 20]), new LatLng([30, 40]), new LatLng([50, 60])]);
			expect(poly._latlngs[1][0]).to.eql([new LatLng([0, 10]), new LatLng([10, 10]), new LatLng([10, 0])]);
			expect(poly._latlngs[1][1]).to.eql([new LatLng([2, 3]), new LatLng([2, 4]), new LatLng([3, 4]), new LatLng([2, 2])]);
		});
	});

	describe('#setStyle', () => {
		it('succeeds for empty Polygon already added to the map', () => {
			const style = {
				weight: 3
			};
			const poly = new Polygon([]);

			poly.addTo(map);
			poly.setStyle(style);

			for (const [prop, expectedValue] of Object.entries(style)) {
				expect(poly.options[prop]).to.equal(expectedValue);
			}
		});
	});

	describe("#_containsPoint", () => {
		it("returns true or false if polygon contains the point", () => {
			map.setZoom(0);
			const latlngs = [[37, -109.05], [41, -109.03], [41, -102.05], [37, -102.04]];
			const polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

			const latLngTest1 = {lat: 39, lng: -104};
			const latLngTest2 = {lat: 50, lng: -110};
			const latLngTest3 = {lat: 37, lng: -102};
			const latLngTest4 = {lat: 30, lng: -102};

			expect(polygon._containsPoint((map.latLngToLayerPoint(latLngTest1)))).to.be(true);
			expect(polygon._containsPoint((map.latLngToLayerPoint(latLngTest2)))).to.be(false);
			expect(polygon._containsPoint((map.latLngToLayerPoint(latLngTest3)))).to.be(true);
			expect(polygon._containsPoint((map.latLngToLayerPoint(latLngTest4)))).to.be(false);
		});
	});
});
