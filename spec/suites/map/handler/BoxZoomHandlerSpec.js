import {expect} from 'chai';
import {LeafletMap, BoxZoomHandler} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';
import Hand from 'prosthetic-hand';

describe('BoxZoomHandler', () => {
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


	it('cancel boxZoom by pressing ESC and re-enable click event on the map', async () => {
		const hand = new Hand({timing: 'fastframe'});
		const mouseFinger = hand.growFinger('pointer', {pointerType: 'mouse'});

		// let mapClick = false;
		let clickSpy = sinon.spy();
		map.once('click', clickSpy);

		mouseFinger.moveTo(100, 100).down().up();
		await hand.run();

		// check if click event on the map is fired
		expect(clickSpy.calledOnce).to.be.true;


		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		mouseFinger.moveTo(100, 100).shift().down();

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		mouseFinger.moveBy(100, 100);

		const boxStartSpy = sinon.spy();
		map.once('boxzoomstart', boxStartSpy);
		const boxEndSpy = sinon.spy();
		map.once('boxzoomend', boxEndSpy);

		await hand.run();

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

		mouseFinger.unshift().up();
		await hand.run();

		// check if click event on the map is fired
		mouseFinger.down().up();

		clickSpy = sinon.spy();
		map.once('click', clickSpy);

		await hand.run();
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

		const hand = new Hand({timing: 'fastframe'});
		const mouseFinger = hand.growFinger('pointer', {pointerType: 'mouse'});

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		mouseFinger.shift().moveTo(100, 100).down();

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		// fire pointerup event with shiftKey = true, to finish drawing the boxZoom
		mouseFinger.moveBy(100, 100).unshift().up();

		await hand.run();

		expect(boxStartSpy.called).to.be.true;
		expect(boxEndSpy.called).to.be.true;
		expect(zoomSpy.called).to.be.true;

		expect(map.getZoom()).to.eql(5);
	});

	it('doesn\'t start box zoom if shift key is not pressed', async () => {
		expect(map.getZoom()).to.eql(3);
		const zoomSpy = sinon.spy();
		map.on('boxzoomstart', zoomSpy);

		const hand = new Hand({timing: 'fastframe'});
		const mouseFinger = hand.growFinger('pointer', {pointerType: 'mouse'});

		mouseFinger.unshift().moveTo(100, 100).down();
		mouseFinger.moveBy(100, 100).unshift().up().wait(200);

		await hand.run();

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

		const hand = new Hand({timing: 'fastframe'});
		const mouseFinger = hand.growFinger('pointer', {pointerType: 'mouse'});

		const clientX = 100;
		const clientY = 100;

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		mouseFinger.shift().moveTo(100, 100).down();

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		mouseFinger.moveBy(100, 100);
		await hand.run();

		// manually fire pointerup event with shiftKey = true and zero async delay,
		// to finish drawing the boxZoom
		// Triggers scheduling a deferredResetState
		UIEventSimulator.fire('pointerup', map._container, {
			pointerId: mouseFinger._id,
			shiftKey: true,
			clientX,
			clientY,
		});

		// firing a pointerdown with zero delay triggers the _clearDeferredResetState
		UIEventSimulator.fire('pointerdown', map._container, {
			pointerId: mouseFinger._id,
			shiftKey: true,
			clientX,
			clientY,
		});

		expect(resetTimeout).to.be.true;

		// cleanup pointerdown - because it breaks other tests
		mouseFinger.down().up().unshift();
		await hand.run();
	});

	it('zooms out when dragged box is larger than map', async () => {

		const smallMap = new LeafletMap(createContainer('75px', '75px'), {
			center: [0, 0],
			zoom: 10,
			zoomAnimation: false
		});

		const hand = new Hand({timing: 'fastframe'});
		const mouseFinger = hand.growFinger('pointer', {pointerType: 'mouse'});

		mouseFinger.moveTo(50, 50).shift().down();
		mouseFinger.moveBy(150, 150).unshift().up().wait(200);

		await hand.run();

		expect(smallMap.getZoom()).to.eql(9);

		mouseFinger.moveTo(50, 50).shift().down();
		mouseFinger.moveBy(300, 300).unshift().up().wait(200);

		await hand.run();

		expect(smallMap.getZoom()).to.eql(7);

		removeMapContainer(smallMap, smallMap.getContainer());
	});

});
