import {expect} from 'chai';
import {Circle, Map, CRS, Transformation} from 'leaflet';
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

	describe('CRS Simple', () => {
		it('returns a positive radius if the x axis of L.CRS.Simple is inverted', () => {
			map.remove();

			class crs extends CRS.Simple {
				static transformation = new Transformation(-1, 0, -1, 0);
			}
			map = new Map(container, {
				crs
			});
			map.setView([0, 0], 4);

			const circle = new Circle([0, 0], {radius: 200}).addTo(map);

			expect(circle._radius).to.eql(3200);
		});
	});
});
