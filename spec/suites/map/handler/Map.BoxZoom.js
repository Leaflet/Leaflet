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

		// fire mousedown event with shiftKey = true, to start drawing the boxZoom
		UIEventSimulator.fire('mousedown', map._container, {
			shiftKey: true,
			clientX,
			clientY,
		});

		clientX += 100;
		clientY += 100;

		// fire mousemove event with shiftKey = true, to draw the boxZoom
		UIEventSimulator.fire('mousemove', map._container, {
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

});
