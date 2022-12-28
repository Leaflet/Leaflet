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

		let clientX = 100;
		let clientY = 100;

		// fire mousedown event with shiftKey = true, to start drawing the boxZoom
		happen.once(map._container, {
			type: 'mousedown',
			shiftKey: true,
			clientX,
			clientY,
		});

		clientX += 100;
		clientY += 100;

		// fire mousemove event with shiftKey = true, to draw the boxZoom
		happen.once(map._container, {
			type: 'mousemove',
			shiftKey: true,
			clientX,
			clientY,
		});

		// fire keydown event ESC to cancel boxZoom
		happen.once(document, {
			type: 'keydown',
			code: 'Escape'
		});

		// check if click event on the map is fired
		mapClick = false;
		happen.click(map._container);
		expect(mapClick).to.be(true);
	});

});
