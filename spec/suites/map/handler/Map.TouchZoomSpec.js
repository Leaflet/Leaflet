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

	it.skipIfNotTouch("fires zoom event while pinch zoom", function (done) {
		map.setView([0, 0], 4);

		var spy = sinon.spy();
		map.on('zoom', spy);

		var pinchZoomEvent = false;
		map.on('zoom', function (e) {
			pinchZoomEvent = e.pinch || pinchZoomEvent;
		});
		map.once('zoomend', function () {
			expect(spy.callCount > 1).to.be.ok();
			expect(pinchZoomEvent).to.be.ok();

			expect(map.getCenter()).to.eql({lat:0, lng:0});
			// Initial zoom 4, initial distance 450px, final distance 50px
			expect(map.getZoom()).to.be(1);

			done();
		});

		L.rectangle(map.getBounds().pad(-0.2)).addTo(map);

		var hand = new Hand({timing: 'fastframe'});
		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(75, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);
	});

	it.skipIfNotTouch("Dragging is possible after pinch zoom", function (done) {
		map.setView([0, 0], 8);

		L.polygon([
			[0, 0],
			[0, 1],
			[1, 1],
			[1, 0]
		]).addTo(map);

		var hand = new Hand({
			timing: 'fastframe',
			onStop() {
				expect(map.getCenter().lat).to.be(0);
				expect(map.getCenter().lng > 5).to.be(true);
				done();
			}
		});

		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(75, 300, 0).down()
			.moveBy(200, 0, 500).up();

		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);

		f1.wait(100).moveTo(200, 300, 0).down()
			.moveBy(5, 0, 20) // We move 5 pixels first to overcome the 3-pixel threshold of L.Draggable (fastframe)
			.moveBy(-150, 0, 200) // Dragging
			.up();

	});

	it.skipIfNotTouch("TouchZoom works with disabled map dragging", function (done) {
		map.remove();

		map = new L.Map(container, {
			touchZoom: true,
			inertia: false,
			zoomAnimation: false,	// If true, the test has to wait extra 250msec,
			dragging: false
		});

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

	it.skipIfNotTouch("Layer is rendered correctly while pinch zoom when zoomAnim is true", function (done) {
		map.remove();

		map = new L.Map(container, {
			touchZoom: true,
			inertia: false,
			zoomAnimation: true
		});

		map.setView([0, 0], 8);

		var polygon = L.polygon([
			[0, 0],
			[0, 1],
			[1, 1],
			[1, 0]
		]).addTo(map);

		var f1, f2;
		var alreadyCalled = false;
		var hand = new Hand({
			timing: 'fastframe',
			onStop() {
				if (alreadyCalled) {
					// because of f1/f2.up() onStop will called again
					return;
				}
				alreadyCalled = true;
				setTimeout(function () {
					var width = polygon._path.getBoundingClientRect().width;
					var height = polygon._path.getBoundingClientRect().height;

					expect(height < 50).to.be(true);
					expect(width < 50).to.be(true);
					expect(height + width > 0).to.be(true);

					f1.up();
					f2.up();
					setTimeout(function () {
						done();
					}, 100);
				}, 100);
			}
		});
		f1 = hand.growFinger(touchEventType);
		f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(75, 300, 0)
			.down().moveBy(200, 0, 500);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500);
	});
});
