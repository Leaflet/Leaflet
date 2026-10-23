import {DomEvent, Draggable, LeafletMap} from 'leaflet';
import Hand from 'prosthetic-hand';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Draggable', () => {
	it('throws on the removed preventOutline argument', () => {
		const el = document.createElement('div');
		expect(() => new Draggable(el, el, true)).to.throw('the preventOutline argument is removed');
		expect(() => new Draggable(el, el, {clickTolerance: 5})).not.to.throw();
	});

	// synthetic events with a made-up pointerId make setPointerCapture throw in Firefox, so use real pointers
	async function drag(el, onMove) {
		el.style.cssText = 'position: absolute; width: 100px; height: 100px';
		const {left, top} = el.getBoundingClientRect();
		const hand = new Hand({timing: 'fastframe'});
		const finger = hand.growFinger('pointer', {pointerType: 'mouse'});
		finger.moveTo(left + 10, top + 10).down().moveBy(20, 20);
		await hand.run();
		onMove();
		finger.up();
		await hand.run();
	}

	it('sets the leaflet-dragging class on the map container while dragging, leaving the page alone', async () => {
		const container = createContainer();
		const map = new LeafletMap(container).setView([0, 0], 1);
		const el = document.createElement('div');
		map.getPanes().overlayPane.appendChild(el);
		new Draggable(el).enable();

		await drag(el, () => {
			expect(container.classList.contains('leaflet-dragging')).to.be.true;
			expect(document.body.classList.contains('leaflet-dragging')).to.be.false;
			expect(document.documentElement.style.userSelect).to.equal('');
		});
		expect(container.classList.contains('leaflet-dragging')).to.be.false;

		removeMapContainer(map, container);
	});

	it('sets the leaflet-dragging class on the element itself outside a map', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		DomEvent.PointerEvents.enablePointerDetection(el);
		new Draggable(el).enable();

		await drag(el, () => {
			expect(el.classList.contains('leaflet-dragging')).to.be.true;
			expect(document.body.classList.contains('leaflet-dragging')).to.be.false;
		});
		expect(el.classList.contains('leaflet-dragging')).to.be.false;

		DomEvent.PointerEvents.disablePointerDetection(el);
		el.remove();
	});
});
