import {LeafletMap} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('ScrollWheelZoomHandler', () => {
	let container, map, clock;
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
		sinon.restore();
		removeMapContainer(map, container);
	});

	it('zooms out while firing \'wheel\' event', (done) => {
		const zoom = map.getZoom();

		UIEventSimulator.fire('wheel', container, scrollOut);

		map.on('zoomend', () => {
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});
	});

	it('zooms in while firing \'wheel\' event', (done) => {
		const zoom = map.getZoom();
		UIEventSimulator.fire('wheel', container, scrollIn);

		map.on('zoomend', () => {
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it('scrollWheelZoom: \'center\'', (done) => {
		map.options.scrollWheelZoom = 'center';
		const zoom = map.getZoom();
		UIEventSimulator.fire('wheel', container, scrollIn);

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it('changes the option \'wheelDebounceTime\'', (done) => {
		map.options.wheelDebounceTime = 100;
		const zoom = map.getZoom();

		const spy = sinon.spy();
		map.on('zoomend', spy);

		UIEventSimulator.fire('wheel', container, scrollIn);
		setTimeout(() => {
			UIEventSimulator.fire('wheel', container, scrollIn);

			expect(spy.notCalled).to.be.true;
		}, 50);

		map.on('zoomend', () => {
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it('changes the option \'wheelPxPerZoomLevel\'', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
		map.setZoom(15, {animate: false});
		clock.tick(300);

		const zoom = map.getZoom();
		UIEventSimulator.fire('wheel', container, scrollIn);
		clock.tick(100);

		expect(map.getZoom()).to.be.greaterThan(zoom);
		const zoomDiff = map.getZoom() - zoom;

		map.setZoom(zoom, {animate: false});
		expect(map.getZoom()).to.equal(zoom);

		map.options.wheelPxPerZoomLevel = 15 / window.devicePixelRatio;
		clock.tick(300);
		UIEventSimulator.fire('wheel', container, scrollIn);
		clock.tick(100);

		expect(map.getZoom() - zoom).to.be.greaterThan(zoomDiff);
	});

	it('zooms by at most one level per hard scroll with reduced motion', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
		const zoom = map.getZoom();
		const hardScrollIn = {deltaY: -3000, deltaMode: 0};

		UIEventSimulator.fire('wheel', container, hardScrollIn);
		clock.tick(100);
		expect(map.getZoom() - zoom).to.be.greaterThan(1);

		map.setZoom(zoom, {animate: false});
		clock.tick(300);

		const matchMedia = window.matchMedia.bind(window);
		const reduced = query => (query === '(prefers-reduced-motion: reduce)' ? {matches: true} : matchMedia(query));
		sinon.stub(window, 'matchMedia').callsFake(reduced);

		UIEventSimulator.fire('wheel', container, hardScrollIn);
		clock.tick(100);
		expect(map.getZoom() - zoom).to.equal(1);
	});

	it('ignores wheel zooms right after a zoom without animation, like an animated zoom does', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
		const zoom = map.getZoom();
		const zoomend = sinon.spy();
		map.on('zoomend', zoomend);

		UIEventSimulator.fire('wheel', container, scrollIn);
		clock.tick(100);
		UIEventSimulator.fire('wheel', container, scrollIn);
		clock.tick(100);

		expect(zoomend.calledOnce).to.be.true;
		const zoom2 = map.getZoom();
		expect(zoom2).to.be.greaterThan(zoom);

		clock.tick(200);
		UIEventSimulator.fire('wheel', container, scrollIn);
		clock.tick(100);
		expect(map.getZoom()).to.be.greaterThan(zoom2);
	});

	it('sets originalEvent to the wheel event in move and zoom events', (done) => {
		const log = [];
		map.on('movestart move moveend zoomstart zoom zoomend', e => log.push(e.originalEvent));
		map.on('moveend', () => {
			expect(log.length).to.be.greaterThan(2);
			expect(log.every(ev => ev?.type === 'wheel')).to.be.true;
			done();
		});
		UIEventSimulator.fire('wheel', container, scrollIn);
	});
});
