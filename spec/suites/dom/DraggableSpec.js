import {DomEvent, Draggable, LeafletMap} from 'leaflet';
import {createContainer, removeMapContainer, Finger} from '../SpecHelper.js';

describe('Draggable', () => {
	it('throws on the removed preventOutline argument', () => {
		const el = document.createElement('div');
		expect(() => new Draggable(el, el, true)).to.throw('the preventOutline argument is removed');
		expect(() => new Draggable(el, el, {clickTolerance: 5})).not.to.throw();
	});

	async function drag(el, onMove) {
		el.style.cssText = 'position: absolute; width: 100px; height: 100px';
		const {left, top} = el.getBoundingClientRect();
		const finger = new Finger();
		await finger.moveTo(left + 10, top + 10).down().moveBy(20, 20);
		onMove();
		await finger.up();
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

	it('ends a drag on losing pointer capture with no buttons pressed', async () => {
		const el = document.createElement('div');
		el.style.cssText = 'position: absolute; width: 100px; height: 100px';
		document.body.appendChild(el);
		DomEvent.PointerEvents.enablePointerDetection(el);
		const draggable = new Draggable(el);
		draggable.enable();
		let dragend;
		draggable.on('dragend', (e) => { dragend = e; });

		const {left, top} = el.getBoundingClientRect();
		const finger = new Finger();
		await finger.moveTo(left + 10, top + 10).down().moveBy(20, 20);

		const lose = buttons => el.dispatchEvent(new PointerEvent('lostpointercapture', {
			bubbles: true, pointerId: finger.id, pointerType: 'mouse', buttons
		}));

		// capture lost while the button is still held, e.g. the pressed element was removed
		lose(1);
		expect(dragend).to.be.undefined;

		// released outside the window, which may fire no pointerup
		lose(0);
		expect(dragend).to.be.ok;
		expect(el.classList.contains('leaflet-dragging')).to.be.false;

		await finger.up();
		DomEvent.PointerEvents.disablePointerDetection(el);
		el.remove();
	});
});
