describe("Map.Drag", function () {
	var container, map;

	beforeEach(function () {
		container = createContainer();
		map = undefined;
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	describe("#addHook", function () {
		it("calls the map with dragging enabled", function () {
			map = L.map(container, {
				dragging: true
			});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});

		it("calls the map with dragging and worldCopyJump enabled", function () {
			map = L.map(container, {
				dragging: true,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});

		it("calls the map with dragging disabled and worldCopyJump enabled; " +
			"enables dragging after setting center and zoom", function () {
			map = L.map(container, {
				dragging: false,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be(false);
			map.setView([0, 0], 0);
			map.dragging.enable();
			expect(map.dragging.enabled()).to.be(true);
		});
	});

	var MyMap = L.Map.extend({
		_getPosition: function () {
			return L.DomUtil.getPosition(this.dragging._draggable._element);
		},
		getOffset: function () {
			return this._getPosition().subtract(this._initialPos);
		}
	}).addInitHook('on', 'load', function () {
		this._initialPos = this._getPosition();
	});

	describe("mouse events", function () {
		it("change the center of the map", function (done) {
			map = new MyMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			var start = L.point(200, 200);
			var offset = L.point(256, 32);
			var finish = start.add(offset);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getOffset()).to.eql(offset);

					expect(map.getZoom()).to.be(1);
					expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);

					done();
				}
			});
			var mouse = hand.growFinger('mouse');

			mouse.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		describe("in CSS scaled container", function () {
			var scale = L.point(2, 1.5);

			beforeEach(function () {
				container.style.webkitTransformOrigin = 'top left';
				container.style.webkitTransform = 'scale(' + scale.x + ', ' + scale.y + ')';
			});

			(L.Browser.ie ? it.skip : it)("change the center of the map, compensating for CSS scale", function (done) {
				map = new MyMap(container, {
				    dragging: true,
				    inertia: false
				});
				map.setView([0, 0], 1);

				var start = L.point(200, 200);
				var offset = L.point(256, 32);
				var finish = start.add(offset);

				var hand = new Hand({
					timing: 'fastframe',
					onStop: function () {
						expect(map.getOffset()).to.eql(offset);

						expect(map.getZoom()).to.be(1);
						expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);

						done();
					}
				});
				var mouse = hand.growFinger('mouse');

				var startScaled = start.scaleBy(scale);
				var finishScaled = finish.scaleBy(scale);
				mouse.moveTo(startScaled.x, startScaled.y, 0)
					.down().moveBy(5, 0, 20).moveTo(finishScaled.x, finishScaled.y, 1000).up();
			});
		});

		it("does not change the center of the map when mouse is moved less than the drag threshold", function (done) {
			map = L.map(container, {
				dragging: true,
				inertia: false
			});

			var originalCenter = L.latLng(0, 0);
			map.setView(originalCenter.clone(), 1);

			var spy = sinon.spy();
			map.on('drag', spy);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getZoom()).to.be(1);
					// Expect center point to be the same as before the click
					expect(map.getCenter()).to.eql(originalCenter);
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.

					done();
				}
			});
			var mouse = hand.growFinger('mouse');

			// We move 2 pixels to stay below the default 3-pixel threshold of
			// L.Draggable. This should result in a click and not a drag.
			mouse.moveTo(200, 200, 0)
				.down().moveBy(1, 0, 20).moveBy(1, 0, 200).up();
		});

		it("does not trigger preclick nor click", function (done) {
			map = L.map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			var clickSpy = sinon.spy();
			var preclickSpy = sinon.spy();
			var dragSpy = sinon.spy();
			map.on('click', clickSpy);
			map.on('preclick', preclickSpy);
			map.on('drag', dragSpy);

			var hand = new Hand({
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
			var mouse = hand.growFinger('mouse');

			mouse.moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveTo(456, 232, 200).up();
		});

		it("does not trigger preclick nor click when dragging on top of a static marker", function (done) {
			container.style.width = container.style.height = '600px';
			map = L.map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			var marker = L.marker(map.getCenter()).addTo(map);
			var clickSpy = sinon.spy();
			var preclickSpy = sinon.spy();
			var markerDragSpy = sinon.spy();
			var mapDragSpy = sinon.spy();
			map.on('click', clickSpy);
			map.on('preclick', preclickSpy);
			map.on('drag', mapDragSpy);
			marker.on('click', clickSpy);
			marker.on('preclick', preclickSpy);
			marker.on('drag', markerDragSpy);

			var hand = new Hand({
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
			var mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(20, 20, 100).up();
		});

		it("does not trigger preclick nor click when dragging a marker", function (done) {
			container.style.width = container.style.height = '600px';
			map = L.map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			var marker = L.marker(map.getCenter(), {draggable: true}).addTo(map);
			var clickSpy = sinon.spy();
			var preclickSpy = sinon.spy();
			var markerDragSpy = sinon.spy();
			var mapDragSpy = sinon.spy();
			map.on('click', clickSpy);
			map.on('preclick', preclickSpy);
			map.on('drag', mapDragSpy);
			marker.on('click', clickSpy);
			marker.on('preclick', preclickSpy);
			marker.on('drag', markerDragSpy);

			var hand = new Hand({
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
			var mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(50, 50, 100).up();
		});

		it("does not change the center of the map when drag is disabled on click", function (done) {
			map = L.map(container, {
				dragging: true,
				inertia: false
			});
			var originalCenter = L.latLng(0, 0);
			map.setView(originalCenter.clone(), 1);

			map.on('mousedown', function () {
				map.dragging.disable();
			});
			var spy = sinon.spy();
			map.on('drag', spy);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getZoom()).to.be(1);
					// Expect center point to be the same as before the click
					expect(map.getCenter()).to.eql(originalCenter);
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.

					done();
				}
			});
			var mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		});
	});

	describe("touch events", function () {
		it.skipIfNotTouch("change the center of the map", function (done) {
			map = new MyMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			var start = L.point(200, 200);
			var offset = L.point(256, 32);
			var finish = start.add(offset);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getOffset()).to.eql(offset);

					expect(map.getZoom()).to.be(1);
					expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);

					done();
				}
			});
			var toucher = hand.growFinger(touchEventType);

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		it.skipIfNotTouch("does not change the center of the map when finger is moved less than the drag threshold", function (done) {
			map = L.map(container, {
				dragging: true,
				inertia: false
			});

			var originalCenter = L.latLng(0, 0);
			map.setView(originalCenter, 1);

			var spy = sinon.spy();
			map.on('drag', spy);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(map.getZoom()).to.be(1);
					// Expect center point to be the same as before the click
					expect(map.getCenter().equals(originalCenter)).to.be.ok(); // small margin of error allowed
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.

					done();
				}
			});

			var toucher = hand.growFinger(touchEventType);

			// We move 2 pixels to stay below the default 3-pixel threshold of
			// L.Draggable. This should result in a click and not a drag.
			toucher.moveTo(200, 200, 0)
				.down().moveBy(1, 0, 20).moveBy(1, 0, 200).up();
		});

		it.skipIfNotTouch('reset itself after touchend', function (done) {
			map = L.map(container, {
				dragging: true,
				inertia: false,
				zoomAnimation: false	// If true, the test has to wait extra 250msec
			});
			map.setView([0, 0], 1);

			// Change default events order to make the tap comming before the touchzoom.
			// See #4315
			map.dragging.disable();
			map.dragging.enable();

			var center, zoom;
			function savePos() {
				center = map.getCenter();
				zoom = map.getZoom();
			}

			var mouseHand = new Hand({
				timing: 'fastframe',
				onStart: savePos,
				onStop: function () {
					expect(map.getCenter()).to.eql(center);
					expect(map.getZoom()).to.eql(zoom);

					done();
				}
			});
			var mouse = mouseHand.growFinger('mouse');
			var hand = new Hand({
				timing: 'fastframe',
				onStart: savePos,
				onStop: function () {
					expect(map.getCenter()).not.to.eql(center);
					expect(map.getZoom()).not.to.eql(zoom);

					mouse.moveTo(220, 220, 0).moveBy(200, 0, 2000);
				}
			});

			var f1 = hand.growFinger(touchEventType);
			var f2 = hand.growFinger(touchEventType);

			hand.sync(5);
			f1.moveTo(275, 300, 0)
				.down().moveBy(-200, 0, 1000).up();
			// This finger should touch me map after the other one.
			f2.wait(10).moveTo(325, 300, 0)
				.down().moveBy(210, 0, 1000).up();
		});
	});
});
