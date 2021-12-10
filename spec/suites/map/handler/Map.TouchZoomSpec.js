describe("Map.TouchZoom", function () {
	var container, map;

	beforeEach(function () {
		container = createContainer();
		map = L.map(container, {
			touchZoom: true,
			inertia: false,
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});
		container.style.width = container.style.height = '600px';
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	it.skipIfNotTouch("Increases zoom when pinching out", function (done) {
		map.setView([0, 0], 1);
		map.once('zoomend', function () {
			expect(map.getCenter()).to.eql({lat:0, lng:0});
			// Initial zoom 1, initial distance 50px, final distance 450px
			expect(map.getZoom()).to.be(4);

			done();
		});

		var hand = new Hand({timing: 'fastframe'});
		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(275, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);
		f2.wait(100).moveTo(325, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
	});

	it.skipIfNotTouch("Decreases zoom when pinching in", function (done) {
		map.setView([0, 0], 4);
		map.once('zoomend', function () {
			expect(map.getCenter()).to.eql({lat:0, lng:0});
			// Initial zoom 4, initial distance 450px, final distance 50px
			expect(map.getZoom()).to.be(1);

			done();
		});

		var hand = new Hand({timing: 'fastframe'});
		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(75, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);
	});
});
