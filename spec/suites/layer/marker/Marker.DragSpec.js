import {DefaultIcon, DivIcon, DomUtil, LeafletMap, Marker, Point} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer, Finger} from '../../SpecHelper.js';

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
		it('drags a marker', async () => {
			const marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

			const start = new Point(300, 280);
			const offset = new Point(56, 32);
			const finish = start.add(offset);

			await new Finger(pointerType).moveTo(start.x, start.y).down().moveBy(5, 0).moveTo(finish.x, finish.y).up();

			expect(marker.getOffset().equals(offset)).to.be.true;
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 78.75]);
		});

		it('keeps the rotation while dragging', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, rotation: 30}).addTo(map);
			const transforms = [];
			marker.on('drag', () => transforms.push(marker._icon.style.transform));

			await new Finger(pointerType).moveTo(300, 280).down().moveBy(5, 0).moveTo(356, 312).up();

			expect(transforms.length).to.be.above(0);
			for (const t of transforms) { expect(t).to.contain('rotate(30deg)'); }
			expect(marker._icon.style.transform).to.contain('rotate(30deg)');
			expect(marker.getOffset().equals(new Point(56, 32))).to.be.true;
		});

		describe('in CSS scaled container', () => {
			const scale = new Point(2, 1.5);

			beforeEach(() => {
				container.style.transformOrigin = 'top left';
				container.style.transform = `scale(${scale.x}, ${scale.y})`;
			});

			it('drags a marker, compensating for CSS scale', async () => {
				const marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

				const start = new Point(300, 280);
				const offset = new Point(56, 32);
				const finish = start.add(offset);

				const startScaled = start.scaleBy(scale);
				const finishScaled = finish.scaleBy(scale);
				await new Finger(pointerType).moveTo(startScaled.x, startScaled.y)
					.down().moveBy(5, 0).moveTo(finishScaled.x, finishScaled.y).up();

				expect(marker.getOffset()).to.eql(offset);
				expect(map.getCenter()).to.be.nearLatLng([0, 0]);
				expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 78.75]);
			});
		});

		it('pans map when autoPan is enabled', async () => {
			const marker = new MyMarker([0, 0], {
				draggable: true,
				autoPan: true
			}).addTo(map);

			const start = new Point(300, 280);
			const offset = new Point(290, 32);
			const finish = start.add(offset);

			await new Finger(pointerType).moveTo(start.x, start.y).down().moveBy(5, 0).moveTo(finish.x, finish.y).up();

			expect(marker.getOffset()).to.eql(offset);
			// small margin of error allowed
			expect(map.getCenter()).to.be.nearLatLng([0, 11.25]);
			expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 419.0625]);
		});
	});

	describe.each(['mouse', 'touch'])('changing the icon with %s', (pointerType) => {
		const start = new Point(300, 280);
		const offset = new Point(56, 32);

		// large enough to be grabbed at the start point
		const divIcon = html => new DivIcon({html, iconSize: [40, 80]});

		function dragMarker() {
			const finish = start.add(offset);
			return new Finger(pointerType).moveTo(start.x, start.y).down().moveBy(5, 0).moveTo(finish.x, finish.y).up();
		}

		// https://github.com/Leaflet/Leaflet/issues/4484
		it('keeps dragging when the icon is changed in a drag listener', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const dragSpy = sinon.spy();
			const dragendSpy = sinon.spy();

			marker.once('drag', () => {
				marker.setIcon(divIcon('b'));
			});
			marker.on('drag', dragSpy);
			marker.on('dragend', dragendSpy);

			await dragMarker();
			expect(dragSpy.callCount).to.be.above(1);
			expect(dragendSpy.calledOnce).to.be.true;
			expect(marker.getOffset().equals(offset)).to.be.true;
		});

		it('finishes the drag when the icon is changed in the dragstart and dragend listeners', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);

			marker.on('dragstart', () => {
				marker.setIcon(divIcon('b'));
			});
			marker.on('dragend', () => {
				marker.setIcon(divIcon('a'));
			});

			await dragMarker();
			expect(marker.getOffset().equals(offset)).to.be.true;
			expect(marker._icon.innerHTML).to.equal('a');
			expect(map.getContainer().classList.contains('leaflet-dragging')).to.be.false;
		});

		// https://github.com/Leaflet/Leaflet/issues/5067
		it('does not fire a click after dragend when the icon is changed in a dragend listener', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const clickSpy = sinon.spy();

			marker.on('click', clickSpy);
			marker.on('dragend', () => {
				marker.setIcon(divIcon('b'));
			});

			await dragMarker();
			// A real user scenario would trigger a click on pointerup.
			// We want to be sure it is cancelled after a drag.
			UIEventSimulator.fire('click', marker._icon);
			expect(clickSpy.called).to.be.false;
		});

		it('drags a marker that is enabled again after its icon was changed', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);

			marker.dragging.disable();
			marker.setIcon(divIcon('b'));
			marker.dragging.enable();

			await dragMarker();
			expect(marker.getOffset().equals(offset)).to.be.true;
		});

		it('ends the drag when the icon element is replaced in a dragstart listener', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const oldIcon = marker._icon;

			marker.once('dragstart', () => {
				marker.setIcon(new DefaultIcon());
			});

			await dragMarker();
			expect(marker._icon).to.not.equal(oldIcon);
			expect(map.getContainer().classList.contains('leaflet-dragging')).to.be.false;
		});

		it('drags a marker after its icon element was replaced', async () => {
			const marker = new MyMarker([0, 0], {draggable: true, icon: divIcon('a')}).addTo(map);
			const oldIcon = marker._icon;

			marker.setIcon(new DefaultIcon());
			expect(marker._icon).to.not.equal(oldIcon);

			await dragMarker();
			expect(marker.getOffset().equals(offset)).to.be.true;
		});
	});

	describe('drag with keyboard', () => {
		// returns false if the default action (scrolling the page) was prevented
		function key(marker, type, key, options) {
			return marker._icon.dispatchEvent(new KeyboardEvent(type, {key, bubbles: true, cancelable: true, ...options}));
		}

		it('moves a focused marker with the arrow keys', () => {
			const marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

			expect(key(marker, 'keydown', 'ArrowRight')).to.be.false;
			key(marker, 'keydown', 'ArrowDown', {shiftKey: true});

			expect(marker.getOffset()).to.eql(new Point(10, 30));
			expect(marker.getLatLng()).to.be.nearLatLng(map.layerPointToLatLng(marker._getPosition()));
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
		});

		it('ends the drag when the key is released or the marker loses focus', () => {
			const marker = new Marker([0, 0], {draggable: true}).addTo(map);
			const events = [];
			const dragend = sinon.spy();
			marker.on('movestart dragstart move drag moveend dragend', e => events.push(e.type));
			marker.on('dragend', dragend);

			key(marker, 'keydown', 'ArrowRight');
			key(marker, 'keydown', 'ArrowRight', {repeat: true});
			key(marker, 'keyup', 'ArrowRight');
			expect(events).to.eql(['movestart', 'dragstart', 'move', 'drag', 'move', 'drag', 'moveend', 'dragend']);
			expect(dragend.lastCall.args[0].distance).to.equal(20);

			key(marker, 'keydown', 'ArrowLeft');
			marker._icon.dispatchEvent(new FocusEvent('blur'));
			expect(events.slice(8)).to.eql(['movestart', 'dragstart', 'move', 'drag', 'moveend', 'dragend']);
		});

		it('ends the drag when dragging is disabled while a key is held', () => {
			const marker = new Marker([0, 0], {draggable: true}).addTo(map);
			const dragstart = sinon.spy();
			marker.on('dragstart', dragstart);

			key(marker, 'keydown', 'ArrowRight');
			marker.dragging.disable();
			marker.dragging.enable();
			key(marker, 'keydown', 'ArrowRight');

			expect(dragstart.calledTwice).to.be.true;
		});

		it('ignores other keys, keys with modifiers, keys pressed inside a DivIcon and disabled dragging', () => {
			const marker = new Marker([0, 0], {draggable: true, icon: new DivIcon({html: '<input>'})}).addTo(map);
			const spy = sinon.spy();
			marker.on('dragstart dragend', spy);

			key(marker, 'keyup', 'Tab');
			key(marker, 'keydown', 'a');
			for (const modifier of ['altKey', 'ctrlKey', 'metaKey']) {
				key(marker, 'keydown', 'ArrowRight', {[modifier]: true});
			}
			marker._icon.querySelector('input').dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
			marker.dragging.disable();
			expect(key(marker, 'keydown', 'ArrowRight')).to.be.true;

			expect(spy.called).to.be.false;
		});

		it('pans the map to keep the marker in view with autoPan', () => {
			const marker = new Marker(map.containerPointToLatLng([545, 300]), {draggable: true, autoPan: true}).addTo(map);

			key(marker, 'keydown', 'ArrowRight');

			expect(map.latLngToContainerPoint(marker.getLatLng())).to.be.near([550, 300]);
			expect(map.getCenter().lng).to.be.above(0);
		});
	});
});
