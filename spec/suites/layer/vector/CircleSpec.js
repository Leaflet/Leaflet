import {expect} from 'chai';
import {Circle, LeafletMap, SimpleCRS, Transformation} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Circle', () => {
	let map, container, circle;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);
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
		it('returns a positive radius if the x axis of SimpleCRS is inverted', () => {
			map.remove();

			class crs extends SimpleCRS {
				static transformation = new Transformation(-1, 0, -1, 0);
			}
			map = new LeafletMap(container, {
				crs
			});
			map.setView([0, 0], 4);

			const circle = new Circle([0, 0], {radius: 200}).addTo(map);

			expect(circle._radius).to.eql(200);
			expect(circle._pxRadius).to.eql(3200);
		});
	});

	describe('#_radius', () => {

		beforeEach(() => {
			container = createContainer();

			map = new LeafletMap(container, {
				crs: SimpleCRS
			});
			map.setView([0, 0], 4);
		});

		describe('when a Circle is added to the map ', () => {
			describe('with a radius set as an option', () => {
				it('takes that radius', () => {
					const circle = new Circle([0, 0], {radius: 20}).addTo(map);

					expect(circle._radius).to.equal(20);
				});
			});

			describe('and radius is set before adding it', () => {
				it('takes that radius', () => {
					const circle = new Circle([0, 0], {radius: 20});
					circle.setRadius(15);
					circle.addTo(map);
					expect(circle._radius).to.equal(15);
					expect(circle._pxRadius).to.equal(240);
				});
			});

			describe('and radius is set after adding it', () => {
				it('takes that radius', () => {
					const circle = new Circle([0, 0], {radius: 20});
					circle.addTo(map);
					circle.setRadius(15);
					expect(circle._radius).to.equal(15);
					expect(circle._pxRadius).to.equal(240);
				});
			});

			describe('and setStyle is used to change the radius after adding', () => {
				it('takes the given radius', () => {
					const circle = new Circle([0, 0], {radius: 20});
					circle.addTo(map);
					circle.setStyle({radius: 15});
					expect(circle._radius).to.equal(15);
					expect(circle._pxRadius).to.equal(240);
				});
			});

			describe('and setStyle is used to change the radius before adding', () => {
				it('takes the given radius', () => {
					const circle = new Circle([0, 0], {radius: 20});
					circle.setStyle({radius: 15});
					circle.addTo(map);
					expect(circle._radius).to.equal(15);
					expect(circle._pxRadius).to.equal(240);
				});
			});
		});
	});
});

describe('Circle#setStyle', () => {
	it('updates radius when style includes radius', () => {
		const circle = new Circle([0, 0], {radius: 10});

		circle.setStyle({radius: 20});
		expect(circle.getRadius()).to.equal(20);
	});

	it('does not change radius if radius not provided', () => {
		const circle = new Circle([0, 0], {radius: 10});

		circle.setStyle({color: 'red'});
		expect(circle.options.color).to.equal('red');
		expect(circle.getRadius()).to.equal(10);
	});
});
