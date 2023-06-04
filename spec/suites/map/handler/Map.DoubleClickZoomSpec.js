import {Map} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Map.DoubleClickZoom', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container, {
			center: [0, 0],
			zoom: 3,
			zoomAnimation: false
		});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('zooms in while dblclick', (done) => {
		const zoom = map.getZoom();

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([17.308687886770034, -17.578125000000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});

		UIEventSimulator.fire('dblclick', container);
	});

	it('zooms out while dblclick and holding shift', (done) => {
		const zoom = map.getZoom();

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([-33.137551192346145, 35.15625000000001]);
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});

		UIEventSimulator.fire('dblclick', container, {shiftKey: true});
	});

	it('doubleClickZoom: \'center\'', (done) => {
		const doubleClickZoomBefore = map.options.doubleClickZoom;
		map.options.doubleClickZoom = 'center';
		const zoom = map.getZoom();

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.doubleClickZoom = doubleClickZoomBefore;
			done();
		});

		UIEventSimulator.fire('dblclick', container);
	});

});
