import {expect} from 'chai';
import {DomUtil, Map, Marker, Point} from 'leaflet';
import Hand from 'prosthetic-hand';
import {createContainer, removeMapContainer, pointerEventType} from '../../SpecHelper.js';

describe('Marker.Drag', () => {
	let map,
	container;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container);
		container.style.width = '600px';
		container.style.height = '600px';
		map.setView([0, 0], 0);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	const MyMarker = Marker.extend({
		_getPosition() {
			return DomUtil.getPosition(this.dragging._draggable._element);
		},
		getOffset() {
			return this._getPosition().subtract(this._initialPos);
		}
	}).addInitHook('on', 'add', function () {
		this._initialPos = this._getPosition();
	});

	describe('drag', () => {
		it('drags a marker with mouse', (done) => {
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
			const toucher = hand.growFinger(...pointerEventType);

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		describe('in CSS scaled container', () => {
			const scale = new Point(2, 1.5);

			beforeEach(() => {
				container.style.webkitTransformOrigin = 'top left';
				container.style.webkitTransform = `scale(${scale.x}, ${scale.y})`;
			});

			it.skip('drags a marker with mouse, compensating for CSS scale', (done) => {
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
				const toucher = hand.growFinger(...pointerEventType);

				const startScaled = start.scaleBy(scale);
				const finishScaled = finish.scaleBy(scale);
				toucher.wait(0).moveTo(startScaled.x, startScaled.y, 0)
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
			const toucher = hand.growFinger(...pointerEventType);

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});
	});

	describe('regression #9689: preserve altitude after drag', () => {
		it('keeps LatLng.alt after internal move', () => {
			const marker = new Marker([10, 20, 123], {draggable: true}).addTo(map);

			// Verify initial alt
			expect(marker.getLatLng().alt).to.be(123);

			// Simulate an internal drag step by calling _move with new pixel position
			const newPixelPos = map.latLngToLayerPoint([11, 21]);
			marker._newPos = newPixelPos;
			marker._move(newPixelPos);

			// After move, altitude should still be preserved
			const movedLatLng = marker.getLatLng();
			expect(movedLatLng).to.ok;
			expect(movedLatLng.alt).to.be(123);
		});
	});
});
