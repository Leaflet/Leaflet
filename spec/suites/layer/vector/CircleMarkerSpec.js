import {Map, CircleMarker, LatLng, Point} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('CircleMarker', () => {
	let map, container;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);
		map.setView([0, 0], 1);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#_radius', () => {
		describe('when a CircleMarker is added to the map ', () => {
			describe('with a radius set as an option', () => {
				it('takes that radius', () => {
					const marker = new CircleMarker([0, 0], {radius: 20}).addTo(map);

					expect(marker._radius).to.equal(20);
				});
			});

			describe('and radius is set before adding it', () => {
				it('takes that radius', () => {
					const marker = new CircleMarker([0, 0], {radius: 20});
					marker.setRadius(15);
					marker.addTo(map);
					expect(marker._radius).to.equal(15);
				});
			});

			describe('and radius is set after adding it', () => {
				it('takes that radius', () => {
					const marker = new CircleMarker([0, 0], {radius: 20});
					marker.addTo(map);
					marker.setRadius(15);
					expect(marker._radius).to.equal(15);
				});
			});

			describe('and setStyle is used to change the radius after adding', () => {
				it('takes the given radius', () => {
					const marker = new CircleMarker([0, 0], {radius: 20});
					marker.addTo(map);
					marker.setStyle({radius: 15});
					expect(marker._radius).to.equal(15);
				});
			});

			describe('and setStyle is used to change the radius before adding', () => {
				it('takes the given radius', () => {
					const marker = new CircleMarker([0, 0], {radius: 20});
					marker.setStyle({radius: 15});
					marker.addTo(map);
					expect(marker._radius).to.equal(15);
				});
			});
		});
	});

	describe('#setLatLng', () => {
		it('fires a move event', () => {
			const marker = new CircleMarker([0, 0]);
			map.addLayer(marker);

			const beforeLatLng = marker._latlng;
			const afterLatLng = new LatLng(1, 2);

			let eventArgs = null;
			marker.on('move', (e) => {
				eventArgs = e;
			});

			marker.setLatLng(afterLatLng);

			expect(eventArgs).to.not.equal(null);
			expect(eventArgs.oldLatLng).to.equal(beforeLatLng);
			expect(eventArgs.latlng).to.equal(afterLatLng);
			expect(marker.getLatLng()).to.equal(afterLatLng);
		});
	});

	describe('#_containsPoint', () => {
		it('checks if a point is contained', () => {
			const point1 = new Point(200, 200);
			const point2 = new Point(10, 10);
			const circlemarker = new CircleMarker([10, 10], {radius: 20});

			circlemarker.addTo(map);

			expect(circlemarker._containsPoint(point1)).to.be.true;
			expect(circlemarker._containsPoint(point2)).to.be.false;
		});
	});
});
