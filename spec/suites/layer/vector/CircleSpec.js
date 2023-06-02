import {Map, Circle} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Circle', () => {
	let map, container, circle;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);
		map.setView([0, 0], 4);
		circle = new Circle([50, 30], {radius: 200}).addTo(map);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#init', () => {
		it('uses default radius if not given', () => {
			const circle = new Circle([0, 0]);
			expect(circle.getRadius()).to.eql(10);
		});

		it('throws error if radius is NaN', () => {
			expect(() => {
				new Circle([0, 0], NaN);
			}).to.throw('Circle radius cannot be NaN');
		});

	});

	describe('#getBounds', () => {
		it('returns bounds', () => {
			const bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng([49.99820, 29.99720]);
			expect(bounds.getNorthEast()).nearLatLng([50.00179, 30.00279]);
		});
	});

	describe('Legacy factory', () => {
		it('returns same bounds as 1.0 factory', () => {
			const bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng([49.99820, 29.99720]);
			expect(bounds.getNorthEast()).nearLatLng([50.00179, 30.00279]);
		});
	});
});
