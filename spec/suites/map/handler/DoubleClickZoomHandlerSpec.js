import {LeafletMap} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('DoubleClickZoomHandler', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
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

	it('can be disabled using doubleClickZoom: false', (done) => {
		map.remove();
		map = new LeafletMap(container, {
			center: [0, 0],
			zoom: 3,
			doubleClickZoom: false,
			zoomAnimation: false
		});

		UIEventSimulator.fire('dblclick', container);

		expect(map.getZoom()).to.eql(3);

		done();
	});


	it('sets originalEvent to the dblclick event in move and zoom events', () => {
		const log = [];
		map.on('movestart move moveend zoomstart zoom zoomend', e => log.push(e.originalEvent));
		UIEventSimulator.fire('dblclick', container);

		expect(log.length).to.be.greaterThan(2);
		expect(log.every(ev => ev?.type === 'dblclick')).to.be.true;
	});
});
