import {LatLng, LeafletMap, Polygon, Rectangle} from 'leaflet';
import Finger from '../../../helpers/Finger.js';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('PinchZoomHandler', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			pinchZoom: true,
			inertia: false,
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});
		container.style.width = container.style.height = '600px';
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('Increases zoom when pinching out', (done) => {
		map.setView([0, 0], 1);
		map.once('zoomend', () => {
			expect(map.getCenter().equals(new LatLng(0, 0))).to.be.true;
			// Initial zoom 1, initial distance 50px, final distance 450px
			expect(map.getZoom()).to.equal(4);

			done();
		});

		new Finger('touch').moveTo(275, 300).down().moveBy(-200, 0).up();
		new Finger('touch').moveTo(325, 300).down().moveBy(200, 0).up();
	});

	it('Decreases zoom when pinching in', (done) => {
		map.setView([0, 0], 4);
		map.once('zoomend', () => {
			expect(map.getCenter().equals(new LatLng(0, 0))).to.be.true;
			// Initial zoom 4, initial distance 450px, final distance 50px
			expect(map.getZoom()).to.equal(1);

			done();
		});

		new Finger('touch').moveTo(75, 300).down().moveBy(200, 0).up();
		new Finger('touch').moveTo(525, 300).down().moveBy(-200, 0).up();
	});

	it('fires zoom event while pinch zoom', (done) => {
		map.setView([0, 0], 4);

		const spy = sinon.spy();
		map.on('zoom', spy);

		let pinchZoomEvent = false;
		map.on('zoom', (e) => {
			pinchZoomEvent = e.pinch ?? pinchZoomEvent;
		});
		map.once('zoomend', () => {
			expect(spy.callCount > 1).to.be.true;
			expect(pinchZoomEvent).to.be.true;

			expect(map.getCenter().equals(new LatLng(0, 0))).to.be.true;
			// Initial zoom 4, initial distance 450px, final distance 50px
			expect(map.getZoom()).to.equal(1);

			done();
		});

		new Rectangle(map.getBounds().pad(-0.2)).addTo(map);

		new Finger('touch').moveTo(75, 300).down().moveBy(200, 0).up();
		new Finger('touch').moveTo(525, 300).down().moveBy(-200, 0).up();
	});

	it('Dragging is possible after pinch zoom', async () => {
		map.setView([0, 0], 8);

		new Polygon([
			[0, 0],
			[0, 1],
			[1, 1],
			[1, 0]
		]).addTo(map);

		await Promise.all([
			new Finger('touch').moveTo(75, 300).down().moveBy(200, 0).up()
				.moveTo(200, 300).down()
				.moveBy(5, 0) // We move 5 pixels first to overcome the 3-pixel threshold of Draggable
				.moveBy(-150, 0) // Dragging
				.up(),
			new Finger('touch').moveTo(525, 300).down().moveBy(-200, 0).up()
		]);

		expect(map.getCenter().lat).to.equal(0);
		expect(map.getCenter().lng > 5).to.be.true;
	});

	it('PinchZoom works with disabled map dragging', (done) => {
		map.remove();

		map = new LeafletMap(container, {
			pinchZoom: true,
			inertia: false,
			zoomAnimation: false,	// If true, the test has to wait extra 250msec,
			dragging: false
		});

		map.setView([0, 0], 4);
		map.once('zoomend', () => {
			expect(map.getCenter().equals(new LatLng(0, 0))).to.be.true;
			// Initial zoom 4, initial distance 450px, final distance 50px
			expect(map.getZoom()).to.equal(1);

			done();
		});

		new Finger('touch').moveTo(75, 300).down().moveBy(200, 0).up();
		new Finger('touch').moveTo(525, 300).down().moveBy(-200, 0).up();
	});

	it('Layer is rendered correctly while pinch zoom when zoomAnim is true', async () => {
		map.remove();

		map = new LeafletMap(container, {
			pinchZoom: true,
			inertia: false,
			zoomAnimation: true
		});

		map.setView([0, 0], 8);

		const polygon = new Polygon([
			[0, 0],
			[0, 1],
			[1, 1],
			[1, 0]
		]).addTo(map);

		const f1 = new Finger('touch').moveTo(75, 300).down().moveBy(200, 0).up();
		const f2 = new Finger('touch').moveTo(525, 300).down().moveBy(-200, 0).up();

		const zoomEnded = new Promise((res) => { map.once('zoomend', res); });
		await Promise.all([f1, f2]);

		// Wait for the zoom-snap animation triggered by pinch end to finish,
		// then one frame for the renderer to redraw the path. A fixed timeout
		// here flakes on slower CI (webkit/macOS) when the animation hasn't
		// settled yet and the polygon's `<path>` has an empty `d` attribute.
		await zoomEnded;
		await new Promise((res) => { requestAnimationFrame(res); });

		const renderedRect = polygon._path.getBoundingClientRect();

		const width = renderedRect.width;
		const height = renderedRect.height;

		expect(height < 50).to.be.true;
		expect(width < 50).to.be.true;
		expect(height + width > 0).to.be.true;

		const x = renderedRect.x;
		const y = renderedRect.y;

		expect(x).to.be.within(297, 301);
		expect(y).to.be.within(270, 280);

		// Give webkit one extra frame to flush any late transitionend before
		// the next test's fingers start in the same iframe.
		await new Promise((res) => { requestAnimationFrame(res); });
	});

	it('Layer is rendered correctly while pinch zoom when zoomAnim is false', async () => {
		map.remove();

		map = new LeafletMap(container, {
			pinchZoom: true,
			inertia: false,
			zoomAnimation: false
		});

		map.setView([0, 0], 8);

		const polygon = new Polygon([
			[0, 0],
			[0, 1],
			[1, 1],
			[1, 0]
		]).addTo(map);

		const f1 = new Finger('touch').moveTo(75, 300).down().moveBy(200, 0).up();
		const f2 = new Finger('touch').moveTo(525, 300).down().moveBy(-200, 0).up();

		await Promise.all([f1, f2]);

		map.pinchZoom._onPointerEnd();

		const renderedRect = polygon._path.getBoundingClientRect();

		const width = renderedRect.width;
		const height = renderedRect.height;

		expect(height < 50).to.be.true;
		expect(width < 50).to.be.true;
		expect(height + width > 0).to.be.true;

		const x = renderedRect.x;
		const y = renderedRect.y;

		expect(x).to.be.within(297, 300);
		expect(y).to.be.within(270, 280);

	});

	it('disables pinchZoom when touchZoom is false (backward compatibility)', () => {
		const warnSpy = sinon.spy(console, 'warn');

		const localContainer = createContainer();
		const localMap = new LeafletMap(localContainer, {
			touchZoom: false
		});

		expect(localMap.pinchZoom.enabled()).to.be.false;
		expect(warnSpy.calledOnce).to.be.true;
		expect(warnSpy.firstCall.args[0]).to.eq('Map: touchZoom option is deprecated and will be removed in future versions. Use pinchZoom instead.');

		warnSpy.restore();
		removeMapContainer(localMap, localContainer);
	});


	it('enables pinchZoom when touchZoom is true and pinchZoom is false (touchZoom takes precedence)', () => {
		const warnSpy = sinon.spy(console, 'warn');

		const localContainer = createContainer();
		const localMap = new LeafletMap(localContainer, {
			touchZoom: true,
			pinchZoom: false
		});

		expect(localMap.pinchZoom.enabled()).to.be.true;
		expect(warnSpy.calledOnce).to.be.true;
		expect(warnSpy.firstCall.args[0]).to.eq('Map: touchZoom option is deprecated and will be removed in future versions. Use pinchZoom instead.');

		warnSpy.restore();
		removeMapContainer(localMap, localContainer);
	});

});
