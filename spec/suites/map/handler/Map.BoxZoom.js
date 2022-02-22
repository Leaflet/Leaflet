describe("Map.BoxZoom", function () {
	var container, map;

	beforeEach(function () {
		container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.top = container.style.top = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(container);
	});


	it("cancel boxZoom by pressing ESC and re-enable click event on the map", function () {
		map = new L.Map(container, {
			center: [0, 0],
			zoom: 3
		});

		var mapClick = false;
		map.on('click', function () {
			mapClick = true;
		});

		// check if click event on the map is fired
		happen.click(map._container);
		expect(mapClick).to.be(true);

		// fire mousedown event with shiftKey = true, to start drawing the boxZoom
		var clientX = 100;
		var clientY = 100;
		var event = new CustomEvent("mousedown");
		event.shiftKey = true;
		event.clientX = clientX;
		event.clientY = clientY;
		event.button = 1;
		map._container.dispatchEvent(event);

		// fire mousemove event with shiftKey = true, to draw the boxZoom
		clientX += 100;
		clientY += 100;
		event = new CustomEvent("mousemove");
		event.shiftKey = true;
		event.clientX = clientX;
		event.clientY = clientY;
		event.button = 1;
		document.dispatchEvent(event);

		// fire keydown event with keyCode = 27 (ESC) to cancel boxZoom
		event = new CustomEvent("keydown");
		event.keyCode = 27;
		document.dispatchEvent(event);

		// check if click event on the map is fired
		mapClick = false;
		happen.click(map._container);
		expect(mapClick).to.be(true);
	});

});
