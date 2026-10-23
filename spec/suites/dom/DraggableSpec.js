import {DomEvent, Draggable, LeafletMap} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Draggable', () => {
	it('throws on the removed preventOutline argument', () => {
		const el = document.createElement('div');
		expect(() => new Draggable(el, el, true)).to.throw('the preventOutline argument is removed');
		expect(() => new Draggable(el, el, {clickTolerance: 5})).not.to.throw();
	});

	function drag(el, onMove) {
		UIEventSimulator.fire('pointerdown', el, {clientX: 10, clientY: 10, pointerId: 1});
		UIEventSimulator.fire('pointermove', el, {clientX: 30, clientY: 30, pointerId: 1});
		onMove();
		UIEventSimulator.fire('pointerup', el, {clientX: 30, clientY: 30, pointerId: 1});
	}

	it('sets the leaflet-dragging class on the map container while dragging, leaving the page alone', () => {
		const container = createContainer();
		const map = new LeafletMap(container).setView([0, 0], 1);
		const el = document.createElement('div');
		map.getPanes().overlayPane.appendChild(el);
		new Draggable(el).enable();

		drag(el, () => {
			expect(container.classList.contains('leaflet-dragging')).to.be.true;
			expect(document.body.classList.contains('leaflet-dragging')).to.be.false;
			expect(document.documentElement.style.userSelect).to.equal('');
		});
		expect(container.classList.contains('leaflet-dragging')).to.be.false;

		removeMapContainer(map, container);
	});

	it('sets the leaflet-dragging class on the element itself outside a map', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		DomEvent.PointerEvents.enablePointerDetection(el);
		new Draggable(el).enable();

		drag(el, () => {
			expect(el.classList.contains('leaflet-dragging')).to.be.true;
			expect(document.body.classList.contains('leaflet-dragging')).to.be.false;
		});
		expect(el.classList.contains('leaflet-dragging')).to.be.false;

		DomEvent.PointerEvents.disablePointerDetection(el);
		el.remove();
	});
});
