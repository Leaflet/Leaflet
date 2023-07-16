import {Map, polygon, LineUtil, latLng} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Polygon', () => {
	let map, container;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#initialize', () => {
		it('should never be flat', () => {
			const latLngs = [[1, 2], [3, 4]];

			const poly = polygon(latLngs);

			expect(LineUtil.isFlat(poly._latlngs)).to.be.false;
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const poly = polygon(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(poly._latlngs).to.not.eql(sourceLatLngs);
		});

		it('can be called with an empty array', () => {
			const poly = polygon([]);
			expect(poly._latlngs).to.eql([[]]);
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('can be initialized with holes', () => {
			const originalLatLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			const poly = polygon(originalLatLngs);

			expect(poly._latlngs).to.eql([
				[latLng([0, 10]), latLng([10, 10]), latLng([10, 0])],
				[latLng([2, 3]), latLng([2, 4]), latLng([3, 4])]
			]);
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('can be initialized with multi including hole', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			const poly = polygon(latLngs);

			expect(poly._latlngs).to.eql([
				[[latLng([10, 20]), latLng([30, 40]), latLng([50, 60])]],
				[[latLng([0, 10]), latLng([10, 10]), latLng([10, 0])], [latLng([2, 3]), latLng([2, 4]), latLng([3, 4])]]
			]);
			expect(poly.getLatLngs()).to.eql(poly._latlngs);
		});

		it('can be added to the map when empty', () => {
			const poly = polygon([]).addTo(map);
			const isAdded = map.hasLayer(poly);
			expect(isAdded).to.be.true;
		});

	});

	describe('#isEmpty', () => {

		it('should return true for a polygon with no latlngs', () => {
			const layer = polygon([]);
			expect(layer.isEmpty()).to.be.true;
		});

		it('should return false for simple polygon', () => {
			const latLngs = [[1, 2], [3, 4], [5, 6]];
			const layer = polygon(latLngs);
			expect(layer.isEmpty()).to.be.false;
		});

		it('should return false for a multi-polygon', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];
			const layer = polygon(latLngs);
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

			const poly = polygon(sourceLatLngs);

			poly.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it('can be set external ring and holes', () => {
			const latLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			const poly = polygon([]);
			poly.setLatLngs(latLngs);

			expect(poly.getLatLngs()).to.eql([
				[latLng([0, 10]), latLng([10, 10]), latLng([10, 0])],
				[latLng([2, 3]), latLng([2, 4]), latLng([3, 4])]
			]);
		});

		it('can be set multi including hole', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			const poly = polygon([]);
			poly.setLatLngs(latLngs);

			expect(poly.getLatLngs()).to.eql([
				[[latLng([10, 20]), latLng([30, 40]), latLng([50, 60])]],
				[[latLng([0, 10]), latLng([10, 10]), latLng([10, 0])], [latLng([2, 3]), latLng([2, 4]), latLng([3, 4])]]
			]);
		});

	});

	describe('#getCenter', () => {
		it('should compute center of a big simple polygon around equator', () => {
			const latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			const layer = polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('should compute center of a small simple polygon', () => {
			const latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			const layer = polygon(latlngs).addTo(map);
			map.setZoom(0);  // Make the polygon disappear in screen.
			expect(layer.getCenter()).to.be.nearLatLng([0.005, 0.005]);
		});

		it('throws error if not yet added to map', () => {
			expect(() => {
				const latlngs = [
					[[0, 0], [10, 0], [10, 10], [0, 10]]
				];
				const layer = polygon(latlngs);
				layer.getCenter();
			}).to.throw('Must add layer to map before using getCenter()');
		});

		it('should compute same center for low and high zoom', () => {
			const latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			const layer = polygon(latlngs).addTo(map);
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
			const layer = polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([31.436532296911807, 39.99999999999979]);
		});
	});

	describe('#_defaultShape', () => {
		it('should return latlngs on a simple polygon', () => {
			const latlngs = [
				latLng([1, 2]),
				latLng([3, 4])
			];

			const poly = polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs);
		});

		it('should return first latlngs on a polygon with hole', () => {
			const latlngs = [
				[latLng([0, 12]), latLng([13, 14]), latLng([15, 16])],
				[latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]
			];

			const poly = polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs[0]);
		});

		it('should return first latlngs on a multipolygon', () => {
			const latlngs = [
				[[latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]],
				[[latLng([11, 12]), latLng([13, 14]), latLng([15, 16])]]
			];

			const poly = polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs[0][0]);
		});

		it('should return first latlngs on a multipolygon with hole', () => {
			const latlngs = [
				[[latLng([0, 10]), latLng([10, 10]), latLng([10, 0])],
				 [latLng([2, 3]), latLng([2, 4]), latLng([3, 4])]],
				[[latLng([10, 20]), latLng([30, 40]), latLng([50, 60])]]
			];

			const poly = polygon(latlngs);

			expect(poly._defaultShape()).to.eql(latlngs[0][0]);
		});
	});

	describe('#addLatLng', () => {
		it('should add latlng to latlngs', () => {
			const latLngs = [
				[1, 2],
				[3, 4]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([5, 6]);

			expect(poly._latlngs).to.eql([[latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]]);
		});

		it('should add latlng to first latlngs on a polygon with hole', () => {
			const latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([17, 0]);

			expect(poly._latlngs[0]).to.eql([latLng([0, 12]), latLng([13, 14]), latLng([15, 16]), latLng([17, 0])]);
			expect(poly._latlngs[1]).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]);
		});

		it('should add latlng by reference on a polygon with hole', () => {
			const latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([7, 8], poly._latlngs[1]);

			expect(poly._latlngs[0]).to.eql([latLng([0, 12]), latLng([13, 14]), latLng([15, 16])]);
			expect(poly._latlngs[1]).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6]), latLng([7, 8])]);
		});

		it('should add latlng to first latlngs on a multi', () => {
			const latLngs = [
				[[[1, 2], [3, 4]]],
				[[[11, 12], [13, 14], [15, 16]]]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([5, 6]);

			expect(poly._latlngs[0]).to.eql([[latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]]);
			expect(poly._latlngs[1]).to.eql([[latLng([11, 12]), latLng([13, 14]), latLng([15, 16])]]);
		});

		it('should add latlng to latlngs by reference on a multi', () => {
			const latLngs = [
				[[[11, 12], [13, 14], [15, 16]]],
				[[[1, 2], [3, 4]]]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([5, 6], poly._latlngs[1][0]);

			expect(poly._latlngs[1]).to.eql([[latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]]);
			expect(poly._latlngs[0]).to.eql([[latLng([11, 12]), latLng([13, 14]), latLng([15, 16])]]);
		});

		it('should add latlng on first latlngs by default on a multipolygon with hole', () => {
			const latLngs = [
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]],
				[[[10, 20], [30, 40], [50, 60]]]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([-10, -10]);

			expect(poly._latlngs[0][0]).to.eql([latLng([0, 10]), latLng([10, 10]), latLng([10, 0]), latLng([-10, -10])]);
			expect(poly._latlngs[0][1]).to.eql([latLng([2, 3]), latLng([2, 4]), latLng([3, 4])]);
			expect(poly._latlngs[1][0]).to.eql([latLng([10, 20]), latLng([30, 40]), latLng([50, 60])]);
		});

		it('should add latlng by reference on a multipolygon with hole', () => {
			const latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			const poly = polygon(latLngs);

			poly.addLatLng([2, 2], poly._latlngs[1][1]);

			expect(poly._latlngs[0][0]).to.eql([latLng([10, 20]), latLng([30, 40]), latLng([50, 60])]);
			expect(poly._latlngs[1][0]).to.eql([latLng([0, 10]), latLng([10, 10]), latLng([10, 0])]);
			expect(poly._latlngs[1][1]).to.eql([latLng([2, 3]), latLng([2, 4]), latLng([3, 4]), latLng([2, 2])]);
		});
	});

	describe('#setStyle', () => {
		it('succeeds for empty Polygon already added to the map', () => {
			const style = {
				weight: 3
			};
			const poly = polygon([]);

			poly.addTo(map);
			poly.setStyle(style);

			for (const [prop, expectedValue] of Object.entries(style)) {
				expect(poly.options[prop]).to.equal(expectedValue);
			}
		});
	});
});
