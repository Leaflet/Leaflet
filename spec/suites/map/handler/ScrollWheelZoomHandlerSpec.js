import {DomUtil, LeafletMap, Marker} from 'leaflet';
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

		map.options.wheelPxPerZoomLevel = 15 / window.devicePixelRatio;
		clock.tick(300);
		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(100);

		expect(map.getZoom() - zoom).to.be.greaterThan(zoomDiff);
		map.options.wheelPxPerZoomLevel = wheelPxPerZoomLevelBefore;
	});

	it('zooms by at most one level per hard scroll with reduced motion', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
		const zoom = map.getZoom();
		const hardScrollIn = {deltaY: -3000, deltaMode: 0};

		UIEventSimulator.fire(wheel, container, hardScrollIn);
		clock.tick(100);
		expect(map.getZoom() - zoom).to.be.greaterThan(1);

		map.setZoom(zoom, {animate: false});
		clock.tick(300);

		const matchMedia = window.matchMedia.bind(window);
		const reduced = query => (query === '(prefers-reduced-motion: reduce)' ? {matches: true} : matchMedia(query));
		sinon.stub(window, 'matchMedia').callsFake(reduced);

		UIEventSimulator.fire(wheel, container, hardScrollIn);
		clock.tick(100);
		expect(map.getZoom() - zoom).to.equal(1);

		window.matchMedia.restore();
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

	it('sets originalEvent to the wheel event in move and zoom events', (done) => {
		const log = [];
		map.on('movestart move moveend zoomstart zoom zoomend', e => log.push(e.originalEvent));
		map.on('moveend', () => {
			expect(log.length).to.be.greaterThan(2);
			expect(log.every(ev => ev?.type === wheel)).to.be.true;
			done();
		});
		UIEventSimulator.fire(wheel, container, scrollIn);
	});

	it('adds up notches that come during the zoom animation into one motion', () => {
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date', 'requestAnimationFrame',
			'cancelAnimationFrame']});
		map.remove();
		map = new LeafletMap(container, {center: [0, 0], zoom: 3});
		const zoomend = sinon.spy(), zooms = [];
		map.on('zoomend', zoomend);
		map.on('zoom', () => zooms.push(map.getZoom()));

		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(150);
		expect(map._animatingZoom).to.be.true;
		UIEventSimulator.fire(wheel, container, scrollIn);
		clock.tick(1000);

		expect(map.getZoom()).to.equal(5);
		expect(zoomend.calledOnce).to.be.true;
		for (let i = 1; i < zooms.length; i++) { expect(zooms[i]).to.be.at.least(zooms[i - 1]); }
	});

	describe('trackpad scroll', () => {
		const fakes = ['setTimeout', 'clearTimeout', 'Date', 'requestAnimationFrame', 'cancelAnimationFrame'];

		// a scroll that zooms out by `levels` at half the pinch rate, every 16 ms like a trackpad
		function scroll(levels, steps = 10) {
			const deltaY = 200 * Math.LN2 * levels / steps;
			for (let i = 0; i < steps; i++) {
				UIEventSimulator.fire(wheel, container, {deltaY, deltaMode: 0});
				clock.tick(16);
			}
		}

		it('follows the fingers and snaps when the scroll ends', () => {
			clock = sinon.useFakeTimers({toFake: fakes});
			const zoom = map.getZoom();
			const zoomend = sinon.spy();
			map.on('zoomend', zoomend);

			scroll(-0.6, 30);
			expect(map.getZoom()).to.be.closeTo(zoom + 0.6, 1e-9);
			expect(zoomend.notCalled).to.be.true;

			clock.tick(300);
			expect(map.getZoom()).to.equal(zoom + 1);
			expect(zoomend.calledOnce).to.be.true;
		});

		it('counts the first event once it knows the scroll comes from a trackpad', () => {
			clock = sinon.useFakeTimers({toFake: fakes});
			const zoom = map.getZoom();
			scroll(0.5, 8);
			expect(map.getZoom()).to.be.closeTo(zoom - 0.5, 1e-9);
		});

		it('stops at the zoom limits and turns back at once', () => {
			clock = sinon.useFakeTimers({toFake: fakes});
			map.setMinZoom(2).setMaxZoom(4);

			scroll(-2, 40);
			expect(map.getZoom()).to.equal(4);
			scroll(0.3, 10);
			expect(map.getZoom()).to.be.closeTo(3.7, 1e-9);

			clock.tick(500);
			scroll(2, 40);
			expect(map.getZoom()).to.equal(2);
			scroll(-0.3, 10);
			expect(map.getZoom()).to.be.closeTo(2.3, 1e-9);
		});

		it('lets a mouse wheel spin wait for a running zoom to end, but adds up separate notches', () => {
			clock = sinon.useFakeTimers({toFake: fakes});
			map.remove();
			map = new LeafletMap(container, {center: [0, 0], zoom: 3});

			UIEventSimulator.fire(wheel, container, scrollIn);
			clock.tick(50);
			const target = map._targetZoom();
			expect(target).to.be.greaterThan(3);

			UIEventSimulator.fire(wheel, container, scrollIn);
			clock.tick(50);
			expect(map._targetZoom()).to.equal(target);

			clock.tick(100);
			UIEventSimulator.fire(wheel, container, scrollIn);
			clock.tick(50);
			expect(map._targetZoom()).to.be.greaterThan(target);
		});

		it('zooms by notches when a mouse wheel spins fast', () => {
			clock = sinon.useFakeTimers({toFake: fakes});
			const zoom = map.getZoom();
			for (let i = 0; i < 3; i++) {
				UIEventSimulator.fire(wheel, container, scrollIn);
				clock.tick(30);
			}
			clock.tick(300);
			expect(Number.isInteger(map.getZoom())).to.be.true;
			expect(map.getZoom()).to.be.greaterThan(zoom);
		});
	});

	describe('trackpad pinch', () => {
		const pinchFakes = ['setTimeout', 'clearTimeout', 'Date', 'requestAnimationFrame', 'cancelAnimationFrame'];

		// splits a pinch by `scale` into events the way browsers report it: deltaY is -100 * ln(scale step)
		function pinch(scale, options = {}, steps = 10) {
			const deltaY = -100 * Math.log(scale) / steps;
			for (let i = 0; i < steps; i++) {
				UIEventSimulator.fire(wheel, container, {deltaY, deltaMode: 0, ctrlKey: true, ...options});
				clock.tick(16);
			}
		}

		it('zooms continuously by the pinch scale and snaps when the pinch ends', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});
			const zoom = map.getZoom();
			const zoomend = sinon.spy();
			map.on('zoomend', zoomend);

			pinch(2 ** 1.2);
			expect(map.getZoom()).to.be.closeTo(zoom + 1.2, 1e-9);
			expect(zoomend.notCalled).to.be.true;

			clock.tick(300);
			expect(map.getZoom()).to.equal(zoom + 1);
			expect(zoomend.calledOnce).to.be.true;
		});

		it('positions layers between pixels while pinching and on whole pixels after', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});
			const marker = new Marker(map.containerPointToLatLng([123, 45])).addTo(map);

			pinch(1.3);
			const pos = DomUtil.getPosition(marker.getElement());
			expect(Number.isInteger(pos.x) && Number.isInteger(pos.y)).to.be.false;

			clock.tick(300);
			const end = DomUtil.getPosition(marker.getElement());
			expect(Number.isInteger(end.x) && Number.isInteger(end.y)).to.be.true;
		});

		it('snaps with an animation that a resumed pinch takes over', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});
			map.remove();
			map = new LeafletMap(container, {center: [0, 0], zoom: 3});
			const zoomstart = sinon.spy(), zoomend = sinon.spy();
			map.on('zoomstart', zoomstart);
			map.on('zoomend', zoomend);

			pinch(2 ** 0.6);
			clock.tick(250);
			expect(map._animatingZoom).to.be.true;
			const zoom = map.getZoom();
			expect(zoom).to.be.within(3.6, 3.99);

			pinch(2 ** 0.9);
			expect(map._animatingZoom).to.be.false;
			expect(map.getZoom()).to.be.closeTo(zoom + 0.9, 1e-9);

			clock.tick(1000);
			expect(map.getZoom()).to.equal(5);
			expect(zoomstart.callCount).to.equal(1);
			expect(zoomend.callCount).to.equal(1);
		});

		it('snaps a slight pinch back instead of zooming by a whole level', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});
			const zoom = map.getZoom();

			pinch(1.1);
			clock.tick(500);
			expect(map.getZoom()).to.equal(zoom);

			pinch(0.9);
			clock.tick(300);
			expect(map.getZoom()).to.equal(zoom);
		});

		it('keeps the location under the pointer in place', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});
			map.options.zoomSnap = 0;
			const {left, top} = container.getBoundingClientRect();
			const point = map.containerPointToLatLng([50, 60]);

			pinch(3, {clientX: left + 50, clientY: top + 60});
			clock.tick(300);

			expect(map.getZoom()).to.be.closeTo(3 + Math.log2(3), 1e-9);
			expect(map.containerPointToLatLng([50, 60])).to.be.nearLatLng(point);
		});

		it('keeps the location under the pointer in place when snapping', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});
			const {left, top} = container.getBoundingClientRect();
			const point = map.containerPointToLatLng([50, 60]);

			pinch(2 ** 1.3, {clientX: left + 50, clientY: top + 60});
			clock.tick(300);

			expect(map.getZoom()).to.equal(5);
			expect(map.containerPointToLatLng([50, 60])).to.be.nearLatLng(point);
		});

		it('snaps to the next level in the direction the pinch was heading', () => {
			clock = sinon.useFakeTimers({toFake: pinchFakes});

			// 3 -> 3.3 goes on to 4
			pinch(2 ** 0.3);
			clock.tick(500); // past the snap and the zoom input block after it
			expect(map.getZoom()).to.equal(4);

			// 4 -> 3.7 goes on to 3
			pinch(2 ** -0.3);
			clock.tick(500);
			expect(map.getZoom()).to.equal(3);

			// 3 -> 3.7 -> 3.6 was last heading out, so it doesn't go on to 4
			pinch(2 ** 0.7);
			clock.tick(100);
			pinch(2 ** -0.1, {}, 5);
			clock.tick(500);
			expect(map.getZoom()).to.equal(3);
		});

		it('zooms by whole levels on ctrl+wheel from a mouse', () => {
			clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
			const zoom = map.getZoom();

			UIEventSimulator.fire(wheel, container, {deltaY: -100, deltaMode: 0, ctrlKey: true});
			clock.tick(100);
			expect(map.getZoom()).to.equal(zoom + 1);
		});
	});
});
