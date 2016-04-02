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
		var f1 = hand.growFinger('touch');
		var f2 = hand.growFinger('touch');

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
		var f1 = hand.growFinger('touch');
		var f2 = hand.growFinger('touch');

		hand.sync(5);
		f1.wait(100).moveTo(75, 300, 0)
			.down().moveBy(200, 0, 500).up(100);
		f2.wait(100).moveTo(525, 300, 0)
			.down().moveBy(-200, 0, 500).up(100);
	});



});
