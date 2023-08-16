import {Map} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Map.BoxZoom', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container, {
			center: [0, 0],
			zoom: 3
		});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});


	it('cancel boxZoom by pressing ESC and re-enable click event on the map', () => {
		let mapClick = false;
		map.on('click', () => {
			mapClick = true;
		});

		// check if click event on the map is fired
		UIEventSimulator.fire('click', map._container);
		expect(mapClick).to.be.true;

		let clientX = 100;
		let clientY = 100;

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		UIEventSimulator.fire('pointerdown', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		clientX += 100;
		clientY += 100;

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		UIEventSimulator.fire('pointermove', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		// fire keydown event ESC to cancel boxZoom
		UIEventSimulator.fire('keydown', document, {
			code: 'Escape'
		});

		// check if click event on the map is fired
		mapClick = false;
		UIEventSimulator.fire('click', map._container);
		expect(mapClick).to.be.true;
	});

	it('create zoom box pointer', (done) => {
		expect(map.getZoom()).to.eql(3);

		map.once('zoomend', () => {
			expect(map.getZoom()).to.eql(5);
			done();
		});

		let clientX = 100;
		let clientY = 100;

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		UIEventSimulator.fire('pointerdown', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		clientX += 100;
		clientY += 100;

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		UIEventSimulator.fire('pointermove', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		// fire pointerup event with shiftKey = true, to finish drawing the boxZoom
		UIEventSimulator.fire('pointerup', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});
	});

	it('don\'t start zoom box if not shift pressed', (done) => {
		expect(map.getZoom()).to.eql(3);

		let zoomstarted = false;
		map.on('zoomstart', () => {
			zoomstarted = true;
		});

		let clientX = 100;
		let clientY = 100;

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		UIEventSimulator.fire('pointerdown', map._container, {
			clientX,
			clientY,
		});

		clientX += 100;
		clientY += 100;

		// fire pointermove event with shiftKey = true, to draw the boxZoom
		UIEventSimulator.fire('pointermove', map._container, {
			clientX,
			clientY,
		});

		// fire pointerup event with shiftKey = true, to finish drawing the boxZoom
		UIEventSimulator.fire('pointerup', map._container, {
			clientX,
			clientY,
		});

		setTimeout(() => {
			// timeout to make sure zooming is not started
			expect(zoomstarted).to.be.false;
			expect(map.getZoom()).to.eql(3);
			done();
		}, 10);
	});

	it('_clearDeferredResetState', () => {
		let resetTimeout = false;

		const stub = sinon.stub(map.boxZoom, '_clearDeferredResetState');
		stub.callsFake(() => {
			resetTimeout = map.boxZoom._resetStateTimeout !== 0;
			Map.BoxZoom.prototype._clearDeferredResetState.call(map.boxZoom);
		});

		let clientX = 100;
		let clientY = 100;

		// fire pointerdown event with shiftKey = true, to start drawing the boxZoom
		UIEventSimulator.fire('pointerdown', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		clientX += 100;
		clientY += 100;


		// fire pointermove event with shiftKey = true, to draw the boxZoom
		UIEventSimulator.fire('pointermove', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});


		// fire pointerup event with shiftKey = true, to finish drawing the boxZoom
		UIEventSimulator.fire('pointerup', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		UIEventSimulator.fire('pointerdown', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		expect(resetTimeout).to.be.true;

		// cleanup pointerdown - because it breaks other tests
		UIEventSimulator.fire('pointerup', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});
	});
});
