import {Map, polyline, latLng} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Polyline', () => {
	let map, container;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#initialize', () => {
		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const polyln = polyline(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(polyln._latlngs).to.not.eql(sourceLatLngs);
			expect(polyln.getLatLngs()).to.eql(polyln._latlngs);
		});

		it('should accept a multi', () => {
			const latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			const polyln = polyline(latLngs);

			expect(polyln._latlngs[0]).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]);
			expect(polyln._latlngs[1]).to.eql([latLng([11, 12]), latLng([13, 14]), latLng([15, 16])]);
			expect(polyln.getLatLngs()).to.eql(polyln._latlngs);
		});

		it('should accept an empty array', () => {
			const polyln = polyline([]);

			expect(polyln._latlngs).to.eql([]);
			expect(polyln.getLatLngs()).to.eql(polyln._latlngs);
		});

		it('can be added to the map when empty', () => {
			const polyln = polyline([]).addTo(map);
			expect(map.hasLayer(polyln)).to.be.true;
		});

	});

	describe('#isEmpty', () => {
		it('should return true for a polyline with no latlngs', () => {
			const polyln = polyline([]);
			expect(polyln.isEmpty()).to.be.true;
		});

		it('should return false for simple polyline', () => {
			const latLngs = [[1, 2], [3, 4]];
			const polyln = polyline(latLngs);
			expect(polyln.isEmpty()).to.be.false;
		});

		it('should return false for multi-polyline', () => {
			const latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];
			const polyln = polyline(latLngs);
			expect(polyln.isEmpty()).to.be.false;
		});

	});

	describe('#setLatLngs', () => {
		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const polyln = polyline(sourceLatLngs);

			polyln.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it('can be set a multi', () => {
			const latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			const polyln = polyline([]);
			polyln.setLatLngs(latLngs);

			expect(polyln._latlngs[0]).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]);
			expect(polyln._latlngs[1]).to.eql([latLng([11, 12]), latLng([13, 14]), latLng([15, 16])]);
		});
	});

	describe('#getCenter', () => {
		it('should compute center of a big flat line on equator', () => {
			const polyln = polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyln.getCenter()).to.eql(latLng([0, 45]));
		});

		it('should compute center of a big flat line on equator with maxZoom', () => {
			map.setMaxZoom(18);
			const polyln = polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyln.getCenter()).to.be.nearLatLng([0, 45]);
		});

		it('should compute center of a big flat line close to the pole', () => {
			const polyln = polyline([[80, 0], [80, 90]]).addTo(map);
			expect(polyln.getCenter()).to.be.nearLatLng([80, 45], 1e-2);
		});

		it('should compute center of a big diagonal line', () => {
			const polyln = polyline([[0, 0], [80, 80]]).addTo(map);
			expect(polyln.getCenter()).to.be.nearLatLng([57.04516467328689, 40], 1);
		});

		it('should compute center of a diagonal line close to the pole', () => {
			const polyln = polyline([[70, 70], [84, 84]]).addTo(map);
			expect(polyln.getCenter()).to.be.nearLatLng([79.01810060159328, 77], 1);
		});

		it('should compute center of a big multiline', () => {
			const polyln = polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			expect(polyln.getCenter()).to.be.nearLatLng([0, 5], 1);
		});

		it('should compute center of a small flat line', () => {
			const polyln = polyline([[0, 0], [0, 0.090]]).addTo(map);
			map.setZoom(0);  // Make the line disappear in screen;
			expect(polyln.getCenter()).to.be.nearLatLng([0, 0.045]);
		});

		it('throws error if not yet added to map', () => {
			expect(() => {
				const poly = polyline([[0, 0], [0, 0.090]]);
				poly.getCenter();
			}).to.throw('Must add layer to map before using getCenter()');
		});

		it('should compute same center for low and high zoom', () => {
			const layer = polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			map.setZoom(0);
			const center = layer.getCenter();
			map.setZoom(18);
			expect(layer.getCenter()).to.be.nearLatLng(center);
		});

		it('should compute center of a zick-zack line', () => {
			const polyln = polyline([[0, 0], [50, 50], [30, 30], [35, 35]]).addTo(map);
			expect(polyln.getCenter()).to.be.nearLatLng([40.551864181628666, 38.36684065813897]);
		});

	});

	describe('#_defaultShape', () => {
		it('should return latlngs when flat', () => {
			const latLngs = [latLng([1, 2]), latLng([3, 4])];

			const polyln = polyline(latLngs);

			expect(polyln._defaultShape()).to.eql(latLngs);
		});

		it('should return first latlngs on a multi', () => {
			const latLngs = [
				[latLng([1, 2]), latLng([3, 4])],
				[latLng([11, 12]), latLng([13, 14])]
			];

			const polyln = polyline(latLngs);

			expect(polyln._defaultShape()).to.eql(latLngs[0]);
		});

	});

	describe('#addLatLng', () => {
		it('should add latlng to latlngs', () => {
			const latLngs = [
				[1, 2],
				[3, 4]
			];

			const polyln = polyline(latLngs);

			polyln.addLatLng([5, 6]);

			expect(polyln._latlngs).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]);
		});

		it('should add latlng to first latlngs on a multi', () => {
			const latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];

			const polyln = polyline(latLngs);

			polyln.addLatLng([5, 6]);

			expect(polyln._latlngs[0]).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]);
			expect(polyln._latlngs[1]).to.eql([latLng([11, 12]), latLng([13, 14])]);
		});

		it('should add latlng to latlngs by reference', () => {
			const latLngs = [
				[[11, 12], [13, 14]],
				[[1, 2], [3, 4]]
			];

			const polyln = polyline(latLngs);

			polyln.addLatLng([5, 6], polyln._latlngs[1]);

			expect(polyln._latlngs[1]).to.eql([latLng([1, 2]), latLng([3, 4]), latLng([5, 6])]);
			expect(polyln._latlngs[0]).to.eql([latLng([11, 12]), latLng([13, 14])]);
		});

		it('should add latlng on empty polyline', () => {
			const polyln = polyline([]);

			polyln.addLatLng([1, 2]);

			expect(polyln._latlngs).to.eql([latLng([1, 2])]);
		});
	});

	describe('#setStyle', () => {
		it('succeeds for empty Polyline already added to the map', () => {
			const style = {
				weight: 3
			};
			const polyln = polyline([]);

			polyln.addTo(map);
			polyln.setStyle(style);

			for (const [prop, expectedValue] of Object.entries(style)) {
				expect(polyln.options[prop]).to.equal(expectedValue);
			}
		});
	});

	describe('#setStyle', () => {
		it('succeeds for empty Polyline already added to the map', () => {
			const style = {
				weight: 3
			};
			const polyln = polyline([]);

			polyln.addTo(map);
			polyln.setStyle(style);

			for (const [prop, expectedValue] of Object.entries(style)) {
				expect(polyln.options[prop]).to.equal(expectedValue);
			}
		});
	});

	describe('#distance', () => {
		it('calculates closestLayerPoint', () => {
			const p1 = map.latLngToLayerPoint([55.8, 37.6]);
			const p2 = map.latLngToLayerPoint([57.123076977278, 44.861962891635]);
			const latlngs = [[56.485503424111, 35.545556640339], [55.972522915346, 36.116845702918], [55.502459116923, 34.930322265253], [55.31534617509, 38.973291015816]]
				.map(ll => latLng(ll[0], ll[1]));
			const polyln = polyline([], {
				'noClip': true
			});
			map.addLayer(polyln);

			expect(polyln.closestLayerPoint(p1)).to.equal(null);

			polyln.setLatLngs(latlngs);
			const point = polyln.closestLayerPoint(p1);
			expect(point).not.to.equal(null);
			expect(point.distance).to.not.equal(Infinity);
			expect(point.distance).to.not.equal(NaN);

			const point2 = polyln.closestLayerPoint(p2);

			expect(point.distance).to.be.lessThan(point2.distance);
		});
	});
});
