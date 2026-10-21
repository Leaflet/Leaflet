import {DefaultIcon, DivIcon, DomUtil, LeafletMap, Marker, Point} from 'leaflet';
import Hand from 'prosthetic-hand';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer, pointerEventType} from '../../SpecHelper.js';

describe('Marker.Drag', () => {
	let map,
	container;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);
		container.style.width = '600px';
		container.style.height = '600px';
		map.setView([0, 0], 0);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	class MyMarker extends Marker {
		_getPosition() {
			return DomUtil.getPosition(this.dragging._draggable._element);
		}
		getOffset() {
			return this._getPosition().subtract(this._initialPos);
		}
	}
	MyMarker.addInitHook('on', 'add', function () {
		this._initialPos = this._getPosition();
	});

	describe.each(['mouse', 'touch'])('drag with %s', (pointerType) => {
		it('drags a marker', (done) => {
			const marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

			const start = new Point(300, 280);
			const offset = new Point(56, 32);
			const finish = start.add(offset);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(marker.getOffset().equals(offset)).to.be.true;

					expect(map.getCenter()).to.be.nearLatLng([0, 0]);
					expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 78.75]);

					done();
				}
			});
			const finger = hand.growFinger('pointer', {pointerType});

			finger.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		describe('in CSS scaled container', () => {
			const scale = new Point(2, 1.5);

			beforeEach(() => {
				container.style.transformOrigin = 'top left';
				container.style.transform = `scale(${scale.x}, ${scale.y})`;
			});

			it('drags a marker, compensating for CSS scale', (done) => {
				const marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

				const start = new Point(300, 280);
				const offset = new Point(56, 32);
				const finish = start.add(offset);

				const hand = new Hand({
					timing: 'fastframe',
					onStop() {
						expect(marker.getOffset()).to.eql(offset);

						expect(map.getCenter()).to.be.nearLatLng([0, 0]);
						expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 78.75]);

						done();
					}
				});
				const finger = hand.growFinger('pointer', {pointerType});

				const startScaled = start.scaleBy(scale);
				const finishScaled = finish.scaleBy(scale);
				finger.wait(0).moveTo(startScaled.x, startScaled.y, 0)
					.down().moveBy(5, 0, 20).moveTo(finishScaled.x, finishScaled.y, 1000).up();
			});
		});

		it('pans map when autoPan is enabled', (done) => {
			const marker = new MyMarker([0, 0], {
				draggable: true,
				autoPan: true
			}).addTo(map);

			const start = new Point(300, 280);
			const offset = new Point(290, 32);
			const finish = start.add(offset);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(marker.getOffset()).to.eql(offset);

					// small margin of error allowed
					expect(map.getCenter()).to.be.nearLatLng([0, 11.25]);
					expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 419.0625]);

					done();
				}
			});
			const finger = hand.growFinger('pointer', {pointerType});

			finger.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});
	});

	describe('changing the icon', () => {
		const start = new Point(300, 280);
		const offset = new Point(56, 32);

		// large enough to be grabbed at the start point
		const divIcon = html => new DivIcon({html, iconSize: [40, 80]});

		function dragMarker(onStop) {
			const finish = start.add(offset);

			const hand = new Hand({timing: 'fastframe', onStop});
			const toucher = hand.growFinger(...pointerEventType);

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		}

		// https://github.com/Leaflet/Leaflet/issues/4484
		it('keeps dragging when the icon is changed in a drag listener', (done) => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const dragSpy = sinon.spy();
			const dragendSpy = sinon.spy();

			marker.once('drag', () => {
				marker.setIcon(divIcon('b'));
			});
			marker.on('drag', dragSpy);
			marker.on('dragend', dragendSpy);

			dragMarker(() => {
				expect(dragSpy.callCount).to.be.above(1);
				expect(dragendSpy.calledOnce).to.be.true;
				expect(marker.getOffset().equals(offset)).to.be.true;

				done();
			});
		});

		it('finishes the drag when the icon is changed in the dragstart and dragend listeners', (done) => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);

			marker.on('dragstart', () => {
				marker.setIcon(divIcon('b'));
			});
			marker.on('dragend', () => {
				marker.setIcon(divIcon('a'));
			});

			dragMarker(() => {
				expect(marker.getOffset().equals(offset)).to.be.true;
				expect(marker._icon.innerHTML).to.equal('a');
				expect(document.body.classList.contains('leaflet-dragging')).to.be.false;

				done();
			});
		});

		// https://github.com/Leaflet/Leaflet/issues/5067
		it('does not fire a click after dragend when the icon is changed in a dragend listener', (done) => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const clickSpy = sinon.spy();

			marker.on('click', clickSpy);
			marker.on('dragend', () => {
				marker.setIcon(divIcon('b'));
			});

			dragMarker(() => {
				// A real user scenario would trigger a click on pointerup.
				// We want to be sure it is cancelled after a drag.
				UIEventSimulator.fire('click', marker._icon);
				expect(clickSpy.called).to.be.false;

				done();
			});
		});

		it('drags a marker that is enabled again after its icon was changed', (done) => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);

			marker.dragging.disable();
			marker.setIcon(divIcon('b'));
			marker.dragging.enable();

			dragMarker(() => {
				expect(marker.getOffset().equals(offset)).to.be.true;

				done();
			});
		});

		it('drags a marker after its icon element was replaced', (done) => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const oldIcon = marker._icon;

			marker.setIcon(new DefaultIcon());
			expect(marker._icon).to.not.equal(oldIcon);

			dragMarker(() => {
				expect(marker.getOffset().equals(offset)).to.be.true;

				done();
			});
		});
	});
});
