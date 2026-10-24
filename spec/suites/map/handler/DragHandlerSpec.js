import {DomUtil, LatLng, LeafletMap, Marker, Point} from 'leaflet';
import Finger from '../../../helpers/Finger.js';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('DragHandler', () => {
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
			map = new LeafletMap(container, {
				dragging: true
			});

			expect(map.dragging.enabled()).to.be.true;
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be.true;
		});

		it('calls the map with dragging and worldCopyJump enabled', () => {
			map = new LeafletMap(container, {
				dragging: true,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be.true;
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be.true;
		});

		it('calls the map with dragging disabled and worldCopyJump enabled; ' +
			'enables dragging after setting center and zoom', () => {
			map = new LeafletMap(container, {
				dragging: false,
				worldCopyJump: true
			});

			expect(map.dragging.enabled()).to.be.false;
			map.setView([0, 0], 0);
			map.dragging.enable();
			expect(map.dragging.enabled()).to.be.true;
		});
	});

	class MyMap extends LeafletMap {
		_getPosition() {
			return DomUtil.getPosition(this.dragging._draggable._element);
		}
		getOffset() {
			return this._getPosition().subtract(this._initialPos);
		}
	}
	MyMap.addInitHook('on', 'load', function () {
		this._initialPos = this._getPosition();
	});

	describe('pointer events', () => {
		it('change the center of the map', async () => {
			map = new MyMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const start = new Point(200, 200);
			const offset = new Point(256, 32);
			const finish = start.add(offset);


			await new Finger().moveTo(start.x, start.y)
				.down().moveBy(5, 0).moveTo(finish.x, finish.y).up();

			expect(map.getOffset()).to.eql(offset);
			expect(map.getZoom()).to.equal(1);
			expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);
		});

		describe('with fractional pointer coordinates', () => {
			const dprDescriptor = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');

			afterEach(() => {
				if (dprDescriptor) {
					Object.defineProperty(window, 'devicePixelRatio', dprDescriptor);
				} else {
					delete window.devicePixelRatio;
				}
			});

			async function dragPositions(dpr, check) {
				Object.defineProperty(window, 'devicePixelRatio', {value: dpr, configurable: true});

				map = new LeafletMap(container, {
					dragging: true,
					inertia: false
				});
				map.setView([0, 0], 1);

				const positions = [];
				map.on('drag', () => positions.push(DomUtil.getPosition(map.getPane('mapPane'))));

				await new Finger().moveTo(200.3, 200.6).down().moveBy(5.4, 0.2).moveBy(100.3, 30.7).up();

				expect(positions.length).to.be.greaterThan(0);
				check(positions);
			}

			it('keeps the map pane at whole pixels', async () => {
				await dragPositions(1, (positions) => {
					for (const pos of positions) {
						expect(pos).to.eql(pos.round());
					}
				});
			});

			it('keeps the map pane at device pixels on a high-DPI screen', async () => {
				await dragPositions(2, (positions) => {
					for (const pos of positions) {
						expect(pos).to.eql(pos.multiplyBy(2).round().divideBy(2));
					}
					expect(positions.some(pos => !pos.equals(pos.round()))).to.be.true;
				});
			});
		});

		describe('in CSS scaled container', () => {
			const scale = new Point(2, 1.5);

			beforeEach(() => {
				container.style.webkitTransformOrigin = 'top left';
				container.style.webkitTransform = `scale(${scale.x}, ${scale.y})`;
			});

			it('change the center of the map, compensating for CSS scale', async () => {
				map = new MyMap(container, {
					dragging: true,
					inertia: false
				});
				map.setView([0, 0], 1);

				const start = new Point(200, 200);
				const offset = new Point(56, 32);
				const finish = start.add(offset);


				const startScaled = start.scaleBy(scale);
				const finishScaled = finish.scaleBy(scale);
				await new Finger().moveTo(startScaled.x, startScaled.y)
					.down().moveBy(5, 0).moveTo(finishScaled.x, finishScaled.y).up();

				expect(map.getOffset()).to.eql(offset);
				expect(map.getZoom()).to.equal(1);
				expect(map.getCenter()).to.be.nearLatLng([21.943045533, -39.375]);
			});
		});

		it('does not change the center of the map when pointer is moved less than the drag threshold', async () => {
			map = new LeafletMap(container, {
				dragging: true,
				inertia: false
			});

			const originalCenter = new LatLng(0, 0);
			map.setView(originalCenter.clone(), 1);

			const spy = sinon.spy();
			map.on('drag', spy);


			// We move 2 pixels to stay below the default 3-pixel threshold of
			// Draggable. This should result in a click and not a drag.
			await new Finger().moveTo(200, 200)
				.down().moveBy(1, 0).moveBy(1, 0).up();

			expect(map.getZoom()).to.equal(1);
			// Expect center point to be the same as before the click
			expect(map.getCenter()).to.eql(originalCenter);
			expect(spy.callCount).to.eql(0); // No drag event should have been fired.
		});

		it('does not trigger preclick nor click', async () => {
			map = new LeafletMap(container, {
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


			await new Finger().moveTo(200, 200)
				.down().moveBy(5, 0).moveTo(456, 232).up();

			// A real user scenario would trigger a click on pointerup.
			// We want to be sure we are cancelling it after a drag.
			UIEventSimulator.fire('click', container);
			expect(dragSpy.called).to.be.true;
			expect(clickSpy.called).to.be.false;
			expect(preclickSpy.called).to.be.false;
		});

		it('does not trigger preclick nor click when dragging on top of a static marker', async () => {
			container.style.width = container.style.height = '600px';
			map = new LeafletMap(container, {
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


			// We move 5 pixels first to overcome the 3-pixel threshold of
			// Draggable.
			await new Finger().moveTo(300, 280)
				.down().moveBy(5, 0).moveBy(20, 20).up();

			// A real user scenario would trigger a click on pointerup.
			// We want to be sure we are cancelling it after a drag.
			UIEventSimulator.fire('click', container);
			expect(mapDragSpy.called).to.be.true;
			expect(markerDragSpy.called).to.be.false;
			expect(clickSpy.called).to.be.false;
			expect(preclickSpy.called).to.be.false;
		});

		it('does not trigger preclick nor click when dragging a marker', async () => {
			container.style.width = container.style.height = '600px';
			map = new LeafletMap(container, {
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


			// We move 5 pixels first to overcome the 3-pixel threshold of
			// Draggable.
			await new Finger().moveTo(300, 280)
				.down().moveBy(5, 0).moveBy(50, 50).up();

			// A real user scenario would trigger a click on pointerup.
			// We want to be sure we are cancelling it after a drag.
			UIEventSimulator.fire('click', marker._icon);
			expect(markerDragSpy.called).to.be.true;
			expect(mapDragSpy.called).to.be.false;
			expect(clickSpy.called).to.be.false;
			expect(preclickSpy.called).to.be.false;
		});

		it('follows the pointer back to the start point within the drag threshold', async () => {
			map = new LeafletMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const startPos = map._getMapPanePos();
			const finger = new Finger();

			await finger.moveTo(200, 200).down().moveBy(40, 20);
			expect(map._getMapPanePos().subtract(startPos)).to.be.near(new Point(40, 20));

			await finger.moveBy(-39, -20);
			expect(map._getMapPanePos().subtract(startPos)).to.be.near(new Point(1, 0));

			await finger.moveBy(-1, 0).up();
			expect(map._getMapPanePos()).to.be.near(startPos);
		});

		// #10376: pointerdown during inertia captured a stale pane position;
		// after inertia finished, the first move jumped back to that press point.
		it('does not jump when dragging after pointerdown during inertia panning', async () => {
			map = new MyMap(container, {
				dragging: true,
				inertia: true
			});
			map.setView([0, 0], 1);

			// Same animation path as DragHandler inertia (`panBy` after dragend).
			map.panBy([200, 0], {
				duration: 0.5,
				easeLinearity: 0.2,
				noMoveStart: true,
				animate: true
			});

			// Check at press time rather than after a frame, which can outlast the whole animation on slow CI runners.
			let inProgressOnDown;
			map.once('pointerdown', () => { inProgressOnDown = map._panAnim?._inProgress; });

			const inertiaEnded = new Promise((resolve) => {
				map.once('moveend', resolve);
			});

			const finger = new Finger();
			const start = new Point(200, 200);
			const drag = new Point(40, 0);

			// Press and hold without moving while inertia is still running.
			await finger.moveTo(start.x, start.y).down();
			expect(inProgressOnDown).to.be.true;

			await inertiaEnded;

			const posBeforeMove = map._getPosition().clone();

			await finger.moveBy(drag.x, drag.y);

			// Place under the cursor should follow the pointer, not jump
			// back to the pane position captured at pointerdown.
			expect(map._getPosition().subtract(posBeforeMove)).to.be.near(drag);
		});

		it('does not change the center of the map when drag is disabled on click', async () => {
			map = new LeafletMap(container, {
				dragging: true,
				inertia: false
			});
			const originalCenter = new LatLng(0, 0);
			map.setView(originalCenter.clone(), 1);

			map.on('pointerdown', () => {
				map.dragging.disable();
			});
			const spy = sinon.spy();
			map.on('drag', spy);


			// We move 5 pixels first to overcome the 3-pixel threshold of
			// Draggable.
			await new Finger().moveTo(200, 200)
				.down().moveBy(5, 0).moveBy(256, 32).up();

			expect(map.getZoom()).to.equal(1);
			// Expect center point to be the same as before the click
			expect(map.getCenter()).to.eql(originalCenter);
			expect(spy.callCount).to.eql(0); // No drag event should have been fired.
		});
	});

	describe('touch events', () => {
		it('change the center of the map', async () => {
			map = new MyMap(container, {
				dragging: true,
				inertia: false
			});
			map.setView([0, 0], 1);

			const start = new Point(200, 200);
			const offset = new Point(256, 32);
			const finish = start.add(offset);


			await new Finger('touch').moveTo(start.x, start.y)
				.down().moveBy(5, 0).moveTo(finish.x, finish.y).up();

			expect(map.getOffset()).to.eql(offset);
			expect(map.getZoom()).to.equal(1);
			expect(map.getCenter()).to.be.nearLatLng([21.943045533, -180]);
		});

		it('does not change the center of the map when finger is moved less than the drag threshold', async () => {
			map = new LeafletMap(container, {
				dragging: true,
				inertia: false
			});

			const originalCenter = new LatLng(0, 0);
			map.setView(originalCenter, 1);

			const spy = sinon.spy();
			map.on('drag', spy);


			// We move 2 pixels to stay below the default 3-pixel threshold of
			// Draggable. This should result in a click and not a drag.
			await new Finger('touch').moveTo(200, 200)
				.down().moveBy(1, 0).moveBy(1, 0).up();

			expect(map.getZoom()).to.equal(1);
			// Expect center point to be the same as before the click
			expect(map.getCenter().equals(originalCenter)).to.be.true; // small margin of error allowed
			expect(spy.callCount).to.eql(0); // No drag event should have been fired.
		});

		it('reset itself after pointerup', async () => {
			map = new LeafletMap(container, {
				dragging: true,
				inertia: false,
				zoomAnimation: false	// If true, the test has to wait extra 250msec
			});
			map.setView([0, 0], 1);

			// Change default events order to make the tap coming before the pinchZoom.
			// See #4315
			map.dragging.disable();
			map.dragging.enable();

			let center, zoom;
			function savePos() {
				center = map.getCenter();
				zoom = map.getZoom();
			}

			savePos();
			await Promise.all([
				new Finger('touch').moveTo(275, 300).down().moveBy(-200, 0).up(),
				// This finger should touch the map after the other one.
				new Finger('touch').moveTo(325, 300).down().moveBy(210, 0).up()
			]);
			expect(map.getCenter()).not.to.eql(center);
			expect(map.getZoom()).not.to.eql(zoom);

			savePos();
			await new Finger('touch').moveTo(220, 220).moveBy(200, 0);
			expect(map.getCenter()).to.eql(center);
			expect(map.getZoom()).to.eql(zoom);
		});
	});
});
