import {Map, rectangle, LineUtil, latLng, Canvas, Polygon} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Rectangle', () => {
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

			const rect = rectangle(latLngs);

			expect(LineUtil.isFlat(rect._latlngs)).to.be.false;
			expect(rect.getLatLngs()).to.eql(rect._latlngs);
		});

		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const rect = rectangle(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(rect._latlngs).to.not.eql(sourceLatLngs);
		});

		it('cannot be called with an empty array', () => {
			// Throws error due to undefined lat
			expect(() => {
				rectangle([]);
			}).to.throw();
		});

		it('can be initialized with extending bounds', () => {
			const originalLatLngs = [
				[0, 10], [20, 30],
				[40, 50], [60, 70] // extended bounds
			];

			const rect = rectangle(originalLatLngs);

			expect(rect._latlngs).to.eql([
				[latLng([0, 10]), latLng([60, 10]), latLng([60, 70]), latLng([0, 70])]
			]);
			expect(rect.getLatLngs()).to.eql(rect._latlngs);
		});
	});

	describe('#setBounds', () => {
		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const rect = rectangle(sourceLatLngs);

			rect.setBounds(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it('changes original bounds to new bounds', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];

			const newLatLngs = [
				[5, 6],
				[7, 8]
			];

			const rect = rectangle(originalLatLngs);
			rect.setBounds(newLatLngs);

			expect(rect._latlngs).to.eql([
				[latLng([5, 6]), latLng([7, 6]), latLng([7, 8]), latLng([5, 8])]
			]);

			expect(rect.getLatLngs()).to.eql(rect._latlngs);
		});

		it('can be set with extending bounds', () => {
			const originalLatLngs = [
				[[2, 3], [4, 5]]
			];

			const newLatLngs = [
				[0, 10], [20, 30],
				[40, 50], [60, 70] // extending bounds
			];

			const rect = rectangle(originalLatLngs);
			rect.setBounds(newLatLngs);

			expect(rect._latlngs).to.eql([
				[latLng([0, 10]), latLng([60, 10]), latLng([60, 70]), latLng([0, 70])]
			]);
			expect(rect.getLatLngs()).to.eql(rect._latlngs);
		});
	});

	describe('#Canvas', () => {
		it('doesn\'t apply `focus` listener if element is undefined', () => {
			map.remove();

			map = new Map(container, {renderer: new Canvas()});
			map.setView([0, 0], 6);
			expect(() => {
				new Polygon([[[2, 3], [4, 5]]]).addTo(map).bindTooltip('test');
			}).to.not.throw();
		});
	});
});
