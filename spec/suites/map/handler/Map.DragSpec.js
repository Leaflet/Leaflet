describe("Map.Drag", function () {
	describe("#addHook", function () {
		it("calls the map with dragging enabled", function () {
			var container = document.createElement('div');
			var map = new L.Map(container, {
				dragging: true
			});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});
		it("calls the map with dragging and worldCopyJump enabled", function () {
			var container = document.createElement('div');
			var map = new L.Map(container, {
				dragging: true,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});
		it("calls the map with dragging disabled and worldCopyJump enabled; " +
		"enables dragging after setting center and zoom", function () {
			var container = document.createElement('div');
			var map = new L.Map(container, {
				dragging: false,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be(false);
			map.setView([0, 0], 0);
			map.dragging.enable();
			expect(map.dragging.enabled()).to.be(true);
		});
	});


	describe("mouse events", function () {
		it("change the center of the map", function (done) {
			var container = document.createElement('div');
			container.style.width = container.style.height = '600px';
			container.style.top = container.style.left = 0;
			container.style.position = 'absolute';
// 			container.style.background = '#808080';

			document.body.appendChild(container);

			var map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			var hand = new Hand({timing: 'fastframe'});
			var mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.wait(100).moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();

			setTimeout(function () {
				var center = map.getCenter();
				var zoom = map.getZoom();
				document.body.removeChild(container);
				expect(center.lat).to.be.within(21.9430, 21.9431);
				expect(center.lng).to.be(-180);
				expect(zoom).to.be(1);

				done();
			}, 100);
		});
	});

	describe("touch events", function () {
		it.skipIfNotTouch("change the center of the map", function (done) {
			var container = document.createElement('div');
			container.style.width = container.style.height = '600px';
			container.style.top = container.style.left = 0;
			container.style.position = 'absolute';
// 			container.style.background = '#808080';

			document.body.appendChild(container);

			var map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			var hand = new Hand({timing: 'fastframe'});
			var toucher = hand.growFinger('touch');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			toucher.wait(100).moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();

			setTimeout(function () {
				var center = map.getCenter();
				var zoom = map.getZoom();
				document.body.removeChild(container);
				expect(center.lat).to.be.within(21.9430, 21.9431);
				expect(center.lng).to.be(-180);
				expect(zoom).to.be(1);

				done();
			}, 100);
		});
	});

});
