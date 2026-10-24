import {LeafletMap, BoxZoomHandler} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';
import Finger from '../../../helpers/Finger.js';

describe('BoxZoomHandler', () => {
	let container, map;
	const shift = {shiftKey: true};
	let finger;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			center: [0, 0],
			zoom: 3,
			zoomAnimation: false
		});
		finger = new Finger();
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});


	it('cancel boxZoom by pressing ESC and re-enable click event on the map', async () => {
		// let mapClick = false;
		let clickSpy = sinon.spy();
		map.once('click', clickSpy);

		finger.moveTo(100, 100).down().up();
		await finger;

		// check if click event on the map is fired
		expect(clickSpy.calledOnce).to.be.true;


		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		finger.moveTo(100, 100).down(shift);

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		finger.moveBy(100, 100, shift);

		const boxStartSpy = sinon.spy();
		map.once('boxzoomstart', boxStartSpy);
		const boxEndSpy = sinon.spy();
		map.once('boxzoomend', boxEndSpy);

		await finger;

		expect(boxStartSpy.calledOnce).to.be.true;
		expect(boxEndSpy.called).to.be.false;
		expect(map.getContainer().classList.contains('leaflet-crosshair')).to.be.true;
		expect(map.getContainer().querySelectorAll('.leaflet-zoom-box').length).to.equal(1);

		// fire keydown event ESC to cancel boxZoom
		UIEventSimulator.fire('keydown', document, {
			code: 'Escape'
		});

		await (new Promise((res) => { setTimeout(res, 1); }));

		expect(map.getContainer().classList.contains('leaflet-crosshair')).to.be.false;
		expect(map.getContainer().querySelectorAll('.leaflet-zoom-box').length).to.equal(0);

		finger.up();
		await finger;

		// check if click event on the map is fired
		finger.down().up();

		clickSpy = sinon.spy();
		map.once('click', clickSpy);

		await finger;
		expect(clickSpy.calledOnce).to.be.true;
		expect(boxEndSpy.called).to.be.false;
	});

	it('zooms from level 3 to level 5', async () => {
		expect(map.getZoom()).to.eql(3);
		const boxStartSpy = sinon.spy();
		const boxEndSpy = sinon.spy();
		const zoomSpy = sinon.spy();
		map.on('boxzoomstart', boxStartSpy);
		map.on('boxzoomend', boxEndSpy);
		map.on('zoom', zoomSpy);

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		finger.moveTo(100, 100).down(shift);

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		// fire pointerup event with shiftKey = true, to finish drawing the boxZoom
		finger.moveBy(100, 100, shift).up();

		await finger;

		expect(boxStartSpy.called).to.be.true;
		expect(boxEndSpy.called).to.be.true;
		expect(zoomSpy.called).to.be.true;

		expect(map.getZoom()).to.eql(5);
	});

	it('prevents the default action of the shift-press instead of disabling selection on the page', async () => {
		const prevented = [];
		container.addEventListener('pointerdown', e => prevented.push(e.defaultPrevented));

		finger.moveTo(100, 100).down(shift);
		finger.moveBy(100, 100, shift);
		await finger;

		expect(document.documentElement.style.userSelect).to.equal('');

		finger.up();
		finger.moveTo(100, 100).down().up();
		await finger;

		expect(prevented).to.eql([true, false]);
	});

	it('doesn\'t start box zoom if shift key is not pressed', async () => {
		expect(map.getZoom()).to.eql(3);
		const zoomSpy = sinon.spy();
		map.on('boxzoomstart', zoomSpy);

		finger.moveTo(100, 100).down();
		finger.moveBy(100, 100).up();

		await finger;

		expect(zoomSpy.called).to.be.false;
		expect(map.getZoom()).to.eql(3);
	});

	it('_clearDeferredResetState', async () => {
		let resetTimeout = false;

		const stub = sinon.stub(map.boxZoom, '_clearDeferredResetState');
		stub.callsFake(() => {
			resetTimeout = map.boxZoom._resetStateTimeout !== 0;
			BoxZoomHandler.prototype._clearDeferredResetState.call(map.boxZoom);
		});

		const clientX = 100;
		const clientY = 100;

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		finger.moveTo(100, 100).down(shift);

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		finger.moveBy(100, 100, shift);
		await finger;

		// manually fire pointerup event with shiftKey = true and zero async delay,
		// to finish drawing the boxZoom
		// Triggers scheduling a deferredResetState
		UIEventSimulator.fire('pointerup', map._container, {
			pointerId: finger.id,
			shiftKey: true,
			clientX,
			clientY,
		});

		// firing a pointerdown with zero delay triggers the _clearDeferredResetState
		UIEventSimulator.fire('pointerdown', map._container, {
			pointerId: finger.id,
			shiftKey: true,
			clientX,
			clientY,
		});

		expect(resetTimeout).to.be.true;

		// cleanup pointerdown - because it breaks other tests
		finger.down().up();
		await finger;
	});

	it('zooms out when dragged box is larger than map', async () => {

		const smallMap = new LeafletMap(createContainer('75px', '75px'), {
			center: [0, 0],
			zoom: 10,
			zoomAnimation: false
		});

		finger.moveTo(50, 50).down(shift);
		finger.moveBy(150, 150, shift).up();

		await finger;

		expect(smallMap.getZoom()).to.eql(9);

		finger.moveTo(50, 50).down(shift);
		finger.moveBy(300, 300, shift).up();

		await finger;

		expect(smallMap.getZoom()).to.eql(7);

		removeMapContainer(smallMap, smallMap.getContainer());
	});

	it('doesn\'t break the map when a tiny box collapses to a point at very high zoom (#6709)', async () => {
		map.setView([50, 100], 50);

		finger.moveTo(100, 100).down(shift);
		finger.moveBy(1, 1, shift).up();
		await finger;

		expect(map.getZoom()).to.eql(50);
		expect(map.getCenter()).to.be.nearLatLng([50, 100]);
	});

});
