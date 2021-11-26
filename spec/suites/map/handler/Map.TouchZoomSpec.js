describe("Map.TouchZoom", function () {
	it.skipIfNotTouch("Increases zoom when pinching out", function (done) {
		var container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);

		var map = new L.Map(container, {
			touchZoom: true,
			inertia: false,
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});
		map.setView([0, 0], 1);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				map.once('zoomend', function () {
					var center = map.getCenter();
					var zoom = map.getZoom();
					document.body.removeChild(container);
					expect(center.lat).to.be(0);
					expect(center.lng).to.be(0);

					// Initial zoom 1, initial distance 50px, final distance 450px
					expect(zoom).to.be(4);

					done();
				});
			}
		});
		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(275, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);
		f2.wait(100).moveTo(325, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
	});

	it.skipIfNotTouch("Decreases zoom when pinching in", function (done) {
		var container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);

		var map = new L.Map(container, {
			touchZoom: true,
			inertia: false,
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});
		map.setView([0, 0], 4);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				map.once('zoomend', function () {
					var center = map.getCenter();
					var zoom = map.getZoom();
					document.body.removeChild(container);
					expect(center.lat).to.be(0);
					expect(center.lng).to.be(0);

					// Initial zoom 4, initial distance 450px, final distance 50px
					expect(zoom).to.be(1);

					done();
				});
			}
		});
		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		hand.sync(5);
		f1.wait(100).moveTo(75, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);
	});

	it.skipIfNotTouch("After dragging, touching with the other finger " +
	"and pinching out should increase zoom", function (done) {
		var container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);

		var originalZoom = 1;

		var map = new L.Map(container, {
			dragging: true,
			touchZoom: true,
			inertia: false,
			zoomAnimation: false
		});
		map.setView([0, 0], originalZoom);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				expect(map.getCenter()).not.to.eql(L.latLng(0, 0));
				expect(map.getZoom()).to.be.above(originalZoom);

				done();
			}
		});

		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		// First we drag
		// We move 5 pixels first to overcome the 3-pixel threshold of
		// L.Draggable.
		f1.wait(100).moveTo(200, 200, 0)
			.down().moveBy(5, 0, 20)
			.moveBy(256, 32, 200);

		// Next, we pinch out
		f1.wait(100).moveTo(275, 300, 0)
			.moveBy(-200, 0, 500).up(100);
		f2.wait(100).moveTo(325, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
	});

	it.skipIfNotTouch("After dragging, touching with the other finger " +
	"and pinching in should decrease zoom", function (done) {
		var container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);

		var originalZoom = 4;

		var map = new L.Map(container, {
			dragging: true,
			touchZoom: true,
			inertia: false,
			zoomAnimation: false
		});
		map.setView([0, 0], originalZoom);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				expect(map.getCenter()).not.to.eql(L.latLng(0, 0));
				expect(map.getZoom()).to.be.below(originalZoom);

				done();
			}
		});

		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		// First we drag
		// We move 5 pixels first to overcome the 3-pixel threshold of
		// L.Draggable.
		f1.wait(100).moveTo(200, 200, 0)
			.down().moveBy(5, 0, 20)
			.moveBy(256, 32, 200);

		// Then we pinch in
		f1.wait(100).moveTo(75, 300, 0)
			.moveBy(200, 0, 500).up(100);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);

	});

	it.skipIfNotTouch("After increasing zoom, raise one finger and it " +
	"should drag with the other", function (done) {
		var container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);

		var originalZoom = 1;

		var map = new L.Map(container, {
			dragging: true,
			touchZoom: true,
			inertia: false,
			zoomAnimation: false
		});
		map.setView([0, 0], originalZoom);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				expect(map.getZoom()).to.be.above(originalZoom);
				expect(map.getCenter()).not.to.eql(L.latLng(0, 0));

				done();
			}
		});

		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		// First we pinch out
		f1.wait(100).moveTo(275, 300, 0)
			.down().moveBy(-200, 0, 500);
		f2.wait(100).moveTo(325, 300, 0)
			.down().moveBy(200, 0, 500);

		// Then we lift one finger and drag
		f1.wait(100).moveTo(200, 200, 0)
			.moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		f2.up();
	});

	it.skipIfNotTouch("After decreasing zoom, raise one finger and it " +
	"should drag with the other", function (done) {
		var container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);

		var originalZoom = 4;

		var map = new L.Map(container, {
			dragging: true,
			touchZoom: true,
			inertia: false,
			zoomAnimation: false
		});
		map.setView([0, 0], originalZoom);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				expect(map.getZoom()).to.be.below(originalZoom);
				expect(map.getCenter()).not.to.eql(L.latLng(0, 0));

				done();
			}
		});

		var f1 = hand.growFinger(touchEventType);
		var f2 = hand.growFinger(touchEventType);

		// First we pinch in
		f1.wait(100).moveTo(75, 300, 0)
			.down().moveBy(200, 0, 500);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500);

		// Then we lift one finger and drag
		f1.wait(100).moveTo(200, 200, 0)
			.moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		f2.up();
	});
});
