import {DomUtil, LatLng, Map, Marker, Point} from 'leaflet';
import Hand from 'prosthetic-hand';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer, touchEventType} from '../../SpecHelper.js';

describe('Map.Drag', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = undefined;
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#addHook', () => {
		it('calls the map with dragging enabled', () => {
			map = new Map(container, {
				dragging: true
			});

			expect(map.dragging.enabled()).to.be.true;
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be.true;
		});

		it('calls the map with dragging and worldCopyJump enabled', () => {
			map = new Map(container, {
				dragging: true,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be.true;
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be.true;
		});

		it('calls the map with dragging disabled and worldCopyJump enabled; ' +
			'enables dragging after setting center and zoom', () => {
			map = new Map(container, {
				dragging: false,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be.false;
			map.setView([0, 0], 0);
			map.dragging.enable();
			expect(map.dragging.enabled()).to.be.true;
		});
	});

	const MyMap = Map.extend({
		_getPosition() {
			return DomUtil.getPosition(this.dragging._draggable._element);
		},
		getOffset() {
			return this._getPosition().subtract(this._initialPos);
		}
	}).addInitHook('on', 'load', function () {
		this._initialPos = this._getPosition();
	});

	describe('mouse events', () => {
		it('change the center of the map', (done) => {
			map = new MyMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const start = new Point(200, 200);
			const offset = new Point(256, 32);
			const finish = start.add(offset);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(map.getOffset()).to.eql(offset);

					expect(map.getZoom()).to.equal(1);
					expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);

					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			mouse.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		describe('in CSS scaled container', () => {
			const scale = new Point(2, 1.5);

			beforeEach(() => {
				container.style.webkitTransformOrigin = 'top left';
				container.style.webkitTransform = `scale(${scale.x}, ${scale.y})`;
			});

			it('change the center of the map, compensating for CSS scale', (done) => {
				map = new MyMap(container, {
				    dragging: true,
				    inertia: false
				});
				map.setView([0, 0], 1);

				const start = new Point(200, 200);
				const offset = new Point(256, 32);
				const finish = start.add(offset);

				const hand = new Hand({
					timing: 'fastframe',
					onStop() {
						expect(map.getOffset()).to.eql(offset);

						expect(map.getZoom()).to.equal(1);
						expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);

						done();
					}
				});
				const mouse = hand.growFinger('mouse');

				const startScaled = start.scaleBy(scale);
				const finishScaled = finish.scaleBy(scale);
				mouse.moveTo(startScaled.x, startScaled.y, 0)
					.down().moveBy(5, 0, 20).moveTo(finishScaled.x, finishScaled.y, 1000).up();
			});
		});

		it('does not change the center of the map when mouse is moved less than the drag threshold', (done) => {
			map = new Map(container, {
				dragging: true,
				inertia: false
			});

			const originalCenter = new LatLng(0, 0);
			map.setView(originalCenter.clone(), 1);

			const spy = sinon.spy();
			map.on('drag', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(map.getZoom()).to.equal(1);
					// Expect center point to be the same as before the click
					expect(map.getCenter()).to.eql(originalCenter);
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.

					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 2 pixels to stay below the default 3-pixel threshold of
			// Draggable. This should result in a click and not a drag.
			mouse.moveTo(200, 200, 0)
				.down().moveBy(1, 0, 20).moveBy(1, 0, 200).up();
		});

		it('does not trigger preclick nor click', (done) => {
			map = new Map(container, {
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
				onStop() {
					// A real user scenario would trigger a click on mouseup.
					// We want to be sure we are cancelling it after a drag.
					UIEventSimulator.fire('click', container);
					expect(dragSpy.called).to.be.true;
					expect(clickSpy.called).to.be.false;
					expect(preclickSpy.called).to.be.false;
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			mouse.moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveTo(456, 232, 200).up();
		});

		it('does not trigger preclick nor click when dragging on top of a static marker', (done) => {
			container.style.width = container.style.height = '600px';
			map = new Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			const marker = new Marker(map.getCenter()).addTo(map);
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
				onStop() {
					// A real user scenario would trigger a click on mouseup.
					// We want to be sure we are cancelling it after a drag.
					UIEventSimulator.fire('click', container);
					expect(mapDragSpy.called).to.be.true;
					expect(markerDragSpy.called).to.be.false;
					expect(clickSpy.called).to.be.false;
					expect(preclickSpy.called).to.be.false;
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// Draggable.
			mouse.moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(20, 20, 100).up();
		});

		it('does not trigger preclick nor click when dragging a marker', (done) => {
			container.style.width = container.style.height = '600px';
			map = new Map(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);
			const marker = new Marker(map.getCenter(), {draggable: true}).addTo(map);
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
				onStop() {
					// A real user scenario would trigger a click on mouseup.
					// We want to be sure we are cancelling it after a drag.
					UIEventSimulator.fire('click', marker._icon);
					expect(markerDragSpy.called).to.be.true;
					expect(mapDragSpy.called).to.be.false;
					expect(clickSpy.called).to.be.false;
					expect(preclickSpy.called).to.be.false;
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// Draggable.
			mouse.moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(50, 50, 100).up();
		});

		it('does not change the center of the map when drag is disabled on click', (done) => {
			map = new Map(container, {
				dragging: true,
				inertia: false
			});
			const originalCenter = new LatLng(0, 0);
			map.setView(originalCenter.clone(), 1);

			map.on('mousedown', () => {
				map.dragging.disable();
			});
			const spy = sinon.spy();
			map.on('drag', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(map.getZoom()).to.equal(1);
					// Expect center point to be the same as before the click
					expect(map.getCenter()).to.eql(originalCenter);
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.

					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// Draggable.
			mouse.moveTo(200, 200, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 200).up();
		});
	});

	describe('touch events', () => {
		it.skipIfNotTouch('change the center of the map', (done) => {
			map = new MyMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const start = new Point(200, 200);
			const offset = new Point(256, 32);
			const finish = start.add(offset);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(map.getOffset()).to.eql(offset);

					expect(map.getZoom()).to.equal(1);
					expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);

					done();
				}
			});
			const toucher = hand.growFinger(touchEventType);

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		it.skipIfNotTouch('does not change the center of the map when finger is moved less than the drag threshold', (done) => {
			map = new Map(container, {
				dragging: true,
				inertia: false
			});

			const originalCenter = new LatLng(0, 0);
			map.setView(originalCenter, 1);

			const spy = sinon.spy();
			map.on('drag', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(map.getZoom()).to.equal(1);
					// Expect center point to be the same as before the click
					expect(map.getCenter().equals(originalCenter)).to.be.true; // small margin of error allowed
					expect(spy.callCount).to.eql(0); // No drag event should have been fired.

					done();
				}
			});

			const toucher = hand.growFinger(touchEventType);

			// We move 2 pixels to stay below the default 3-pixel threshold of
			// Draggable. This should result in a click and not a drag.
			toucher.moveTo(200, 200, 0)
				.down().moveBy(1, 0, 20).moveBy(1, 0, 200).up();
		});

		it.skipIfNotTouch('reset itself after touchend', (done) => {
			map = new Map(container, {
				dragging: true,
				inertia: false,
				zoomAnimation: false	// If true, the test has to wait extra 250msec
			});
			map.setView([0, 0], 1);

			// Change default events order to make the tap comming before the touchzoom.
			// See #4315
			map.dragging.disable();
			map.dragging.enable();

			let center, zoom;
			function savePos() {
				center = map.getCenter();
				zoom = map.getZoom();
			}

			const mouseHand = new Hand({
				timing: 'fastframe',
				onStart: savePos,
				onStop() {
					expect(map.getCenter()).to.eql(center);
					expect(map.getZoom()).to.eql(zoom);

					done();
				}
			});
			const mouse = mouseHand.growFinger('mouse');
			const hand = new Hand({
				timing: 'fastframe',
				onStart: savePos,
				onStop() {
					expect(map.getCenter()).not.to.eql(center);
					expect(map.getZoom()).not.to.eql(zoom);

					mouse.moveTo(220, 220, 0).moveBy(200, 0, 2000);
				}
			});

			const f1 = hand.growFinger(touchEventType);
			const f2 = hand.growFinger(touchEventType);

			hand.sync(5);
			f1.moveTo(275, 300, 0)
				.down().moveBy(-200, 0, 1000).up();
			// This finger should touch me map after the other one.
			f2.wait(10).moveTo(325, 300, 0)
				.down().moveBy(210, 0, 1000).up();
		});
	});
});
