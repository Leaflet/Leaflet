describe("Map.Drag", function () {
	describe("#addHook", function () {
		let container, map;

		before(function () {
			container = document.createElement('div');
		});

		afterEach(function () {
			map.remove();
		});

		it("calls the map with dragging enabled", function () {
			map = new L.Map(container, {
				dragging: true
			});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});

		it("calls the map with dragging and worldCopyJump enabled", function () {
			map = new L.Map(container, {
				dragging: true,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});

		it("calls the map with dragging disabled and worldCopyJump enabled; " +
			"enables dragging after setting center and zoom", function () {
			map = new L.Map(container, {
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
		let container, map;

		beforeEach(function () {
			container = document.createElement('div');
			container.style.width = container.style.height = '600px';
			container.style.top = container.style.left = 0;
			container.style.position = 'absolute';
			document.body.appendChild(container);
		});

		afterEach(function () {
			map.remove();
			document.body.removeChild(container);
		});

		it("change the center of the map", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					const center = map.getCenter();
					const zoom = map.getZoom();
					expect(center.lat).to.be.within(21.9430, 21.9431);
					expect(center.lng).to.be(-180);
					expect(zoom).to.be(1);

					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.wait(100).moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		});

		describe("in CSS scaled container", function () {
			const scaleX = 2;
			const scaleY = 1.5;

			beforeEach(function () {
				container.style.webkitTransformOrigin = 'top left';
				container.style.webkitTransform = 'scale(' + scaleX + ', ' + scaleY + ')';
			});

			it("change the center of the map, compensating for CSS scale", function (done) {
				map = new L.Map(container, {
				    dragging: true,
				    inertia: false
				});
				map.setView([0, 0], 1);

				const hand = new Hand({
					timing: 'fastframe',
					onStop: function () {
						const center = map.getCenter();
						const zoom = map.getZoom();
						expect(center.lat).to.be.within(21.9430, 21.9431);
						expect(center.lng).to.be(-180);
						expect(zoom).to.be(1);

						done();
					}
				});
				const mouse = hand.growFinger('mouse');

				// We move 5 pixels first to overcome the 3-pixel threshold of
				// L.Draggable.
				mouse.wait(100).moveTo(200, 200, 0)
					.down().moveBy(5, 0, 20).moveBy(scaleX * 256, scaleY * 32, 200).up();
			});
		});

		it("does not change the center of the map when mouse is moved less than the drag threshold", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});

			const originalCenter = L.latLng(0, 0);
			map.setView(originalCenter, 1);

			const spy = sinon.spy();
			map.on('drag', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					const center = map.getCenter();
					const zoom = map.getZoom();
					expect(center).to.be(originalCenter); // Expect center point to be the same as before the click
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.
					expect(zoom).to.be(1);

					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 2 pixels to stay below the default 3-pixel threshold of
			// L.Draggable. This should result in a click and not a drag.
			mouse.wait(100).moveTo(200, 200, 0)
				.down().moveBy(1, 0, 20).moveBy(1, 0, 200).up();
		});

		it("does not trigger preclick nor click", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			const dragSpy = sinon.spy();
			map.on('click', clickSpy);
			map.on('preclick', preclickSpy);
			map.on('drag', dragSpy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					// A real user scenario would trigger a click on mouseup.
					// We want to be sure we are cancelling it after a drag.
					happen.click(container);
					expect(dragSpy.called).to.be(true);
					expect(clickSpy.called).to.be(false);
					expect(preclickSpy.called).to.be(false);
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.wait(100).moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		});

		it("does not trigger preclick nor click when dragging on top of a static marker", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			const marker = L.marker(map.getCenter()).addTo(map);
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			const markerDragSpy = sinon.spy();
			const mapDragSpy = sinon.spy();
			map.on('click', clickSpy);
			map.on('preclick', preclickSpy);
			map.on('drag', mapDragSpy);
			marker.on('click', clickSpy);
			marker.on('preclick', preclickSpy);
			marker.on('drag', markerDragSpy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					// A real user scenario would trigger a click on mouseup.
					// We want to be sure we are cancelling it after a drag.
					happen.click(container);
					expect(mapDragSpy.called).to.be(true);
					expect(markerDragSpy.called).to.be(false);
					expect(clickSpy.called).to.be(false);
					expect(preclickSpy.called).to.be(false);
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(20, 20, 100).up();
		});

		it("does not trigger preclick nor click when dragging a marker", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			const marker = L.marker(map.getCenter(), {draggable: true}).addTo(map);
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			const markerDragSpy = sinon.spy();
			const mapDragSpy = sinon.spy();
			map.on('click', clickSpy);
			map.on('preclick', preclickSpy);
			map.on('drag', mapDragSpy);
			marker.on('click', clickSpy);
			marker.on('preclick', preclickSpy);
			marker.on('drag', markerDragSpy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					// A real user scenario would trigger a click on mouseup.
					// We want to be sure we are cancelling it after a drag.
					happen.click(marker._icon);
					expect(markerDragSpy.called).to.be(true);
					expect(mapDragSpy.called).to.be(false);
					expect(clickSpy.called).to.be(false);
					expect(preclickSpy.called).to.be(false);
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(50, 50, 100).up();
		});

		it("does not change the center of the map when drag is disabled on click", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			const originalCenter = L.latLng(0, 0);
			map.setView(originalCenter, 1);

			map.on('mousedown', function () {
				map.dragging.disable();
			});
			const spy = sinon.spy();
			map.on('drag', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					const center = map.getCenter();
					const zoom = map.getZoom();
					expect(center).to.be(originalCenter); // Expect center point to be the same as before the click
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.
					expect(zoom).to.be(1);

					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.wait(100).moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		});

	});

	describe("touch events", function () {
		let container, map;

		beforeEach(function () {
			container = document.createElement('div');
			container.style.width = container.style.height = '600px';
			container.style.top = container.style.left = 0;
			container.style.position = 'absolute';
			// 			container.style.background = '#808080';

			document.body.appendChild(container);
		});

		afterEach(function () {
			map.remove();
			document.body.removeChild(container);
		});

		it.skipIfNotTouch("change the center of the map", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					const center = map.getCenter();
					const zoom = map.getZoom();
					expect(center.lat).to.be.within(21.9430, 21.9431);
					expect(center.lng).to.be(-180);
					expect(zoom).to.be(1);

					done();
				}
			});
			const toucher = hand.growFinger(touchEventType);

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			toucher.wait(100).moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		});

		it.skipIfNotTouch("does not change the center of the map when finger is moved less than the drag threshold", function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false
			});

			const originalCenter = L.latLng(0, 0);
			map.setView(originalCenter, 1);

			const spy = sinon.spy();
			map.on('drag', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					const center = map.getCenter();
					const zoom = map.getZoom();
					expect(center.equals(originalCenter)).to.be(true); // Expect center point to be the same as before the click
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.
					expect(zoom).to.be(1);

					done();
				}
			});

			const toucher = hand.growFinger(touchEventType);

			// We move 2 pixels to stay below the default 3-pixel threshold of
			// L.Draggable. This should result in a click and not a drag.
			toucher.wait(100).moveTo(200, 200, 0)
				.down().moveBy(1, 0, 20).moveBy(1, 0, 200).up();
		});

		it.skipIfNotTouch('reset itself after touchend', function (done) {
			map = new L.Map(container, {
				dragging: true,
				inertia: false,
				zoomAnimation: false	// If true, the test has to wait extra 250msec
			});
			map.setView([0, 0], 1);

			// Change default events order to make the tap comming before the touchzoom.
			// See #4315
			map.dragging.disable();
			map.dragging.enable();

			let center = map.getCenter(),
			zoom = map.getZoom();


			const mouseHand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getCenter()).to.eql(center);
					expect(map.getZoom()).to.eql(zoom);

					done();
				}
			});
			const mouse = mouseHand.growFinger('mouse');
			const hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getCenter()).not.to.eql(center);
					expect(map.getZoom()).not.to.eql(zoom);
					center = map.getCenter();
					zoom = map.getZoom();
					mouse.moveTo(220, 220, 0).moveBy(200, 0, 2000);
				}
			});

			const f1 = hand.growFinger(touchEventType);
			const f2 = hand.growFinger(touchEventType);

			hand.sync(5);
			f1.wait(100).moveTo(275, 300, 0)
				.down().moveBy(-200, 0, 1000).up(200);
			// This finger should touch me map after the other one.
			f2.wait(110).moveTo(325, 300, 0)
				.down().moveBy(210, 0, 1000).up(200);
		});
	});
});
