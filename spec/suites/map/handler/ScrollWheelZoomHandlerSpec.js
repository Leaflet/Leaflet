import {DomEvent, LeafletMap} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('ScrollWheelZoomHandler', () => {
	let container, map, clock;
	const wheel = 'onwheel' in window ? 'wheel' : 'mousewheel';
	const scrollIn = {
		deltaY: -120,
		deltaMode: 0
	};
	const scrollOut = {
		deltaY: 120,
		deltaMode: 0
	};

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			center: [0, 0],
			zoom: 3,
			zoomAnimation: false
		});
	});

	afterEach(() => {
		clock?.restore();
		clock = null;
		removeMapContainer(map, container);
	});

	it('zooms out while firing \'wheel\' event', (done) => {
		const zoom = map.getZoom();

		UIEventSimulator.fire(wheel, container, scrollOut);

		map.on('zoomend', () => {
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([-33.137551192346145, 35.15625000000001]);
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});
	});

	it('zooms in while firing \'wheel\' event', (done) => {
		const zoom = map.getZoom();
		UIEventSimulator.fire(wheel, container, scrollIn);

		map.on('zoomend', () => {
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([17.308687886770034, -17.578125000000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it('scrollWheelZoom: \'center\'', (done) => {
		const scrollWheelZoomBefore = map.options.scrollWheelZoom;
		map.options.scrollWheelZoom = 'center';
		const zoom = map.getZoom();
		UIEventSimulator.fire(wheel, container, scrollIn);

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.scrollWheelZoom = scrollWheelZoomBefore;
			done();
		});
	});

	it('changes the option \'wheelDebounceTime\'', (done) => {
		const wheelDebounceTimeBefore = map.options.wheelDebounceTime;
		map.options.wheelDebounceTime = 100;
		const zoom = map.getZoom();

		const spy = sinon.spy();
		map.on('zoomend', spy);

		UIEventSimulator.fire(wheel, container, scrollIn);
		setTimeout(() => {
			UIEventSimulator.fire(wheel, container, scrollIn);

			expect(spy.notCalled).to.be.true;
		}, 50);

		map.on('zoomend', () => {
			expect(spy.calledOnce).to.be.true;
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([25.48295117535531, -26.367187500000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.wheelDebounceTime = wheelDebounceTimeBefore;
			done();
		});
	});

	it('changes the option \'wheelPxPerZoomLevel\'', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
		const wheelPxPerZoomLevelBefore = map.options.wheelPxPerZoomLevel;
		map.setZoom(15, {animate: false});
		clock.tick(300);

		const zoom = map.getZoom();
		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(100);

		expect(map.getZoom()).to.be.greaterThan(zoom);
		const zoomDiff = map.getZoom() - zoom;

		map.setZoom(zoom, {animate: false});
		expect(map.getZoom()).to.equal(zoom);

		map.options.wheelPxPerZoomLevel = 30 / DomEvent.getWheelPxFactor();
		clock.tick(300);
		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(100);

		expect(map.getZoom() - zoom).to.be.greaterThan(zoomDiff);
		map.options.wheelPxPerZoomLevel = wheelPxPerZoomLevelBefore;
	});

	it('ignores wheel zooms right after a zoom without animation, like an animated zoom does', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
		const zoom = map.getZoom();
		const zoomend = sinon.spy();
		map.on('zoomend', zoomend);

		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(100);
		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(100);

		expect(zoomend.calledOnce).to.be.true;
		const zoom2 = map.getZoom();
		expect(zoom2).to.be.greaterThan(zoom);

		clock.tick(200);
		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(100);
		expect(map.getZoom()).to.be.greaterThan(zoom2);
	});
});
