describe('Map.BoxZoom', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = L.map(container, {
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
		happen.click(map._container);
		expect(mapClick).to.be(true);

		// fire mousedown event with shiftKey = true, to start drawing the boxZoom
		let clientX = 100;
		let clientY = 100;
		let event = new CustomEvent('mousedown');
		event.shiftKey = true;
		event.clientX = clientX;
		event.clientY = clientY;
		event.button = 1;
		map._container.dispatchEvent(event);

		// fire mousemove event with shiftKey = true, to draw the boxZoom
		clientX += 100;
		clientY += 100;
		event = new CustomEvent('mousemove');
		event.shiftKey = true;
		event.clientX = clientX;
		event.clientY = clientY;
		event.button = 1;
		document.dispatchEvent(event);

		// fire keydown event with keyCode = 27 (ESC) to cancel boxZoom
		event = new CustomEvent('keydown');
		event.keyCode = 27;
		document.dispatchEvent(event);

		// check if click event on the map is fired
		mapClick = false;
		happen.click(map._container);
		expect(mapClick).to.be(true);
	});

});
