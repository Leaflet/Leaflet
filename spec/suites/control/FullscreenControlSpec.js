import {FullscreenControl, LeafletMap} from 'leaflet';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('FullscreenControl', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container).setView([0, 0], 1);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('toggles pseudo-fullscreen and fires map events', () => {
		const control = new FullscreenControl({pseudo: true}).addTo(map),
		enter = sinon.spy(), exit = sinon.spy();
		map.on({enterfullscreen: enter, exitfullscreen: exit});

		control.toggle();
		expect(control.isFullscreen()).to.equal(true);
		expect(container.classList.contains('leaflet-pseudo-fullscreen')).to.equal(true);
		expect(container.classList.contains('leaflet-fullscreen-on')).to.equal(true);
		expect(control.getContainer().querySelector('a').title).to.equal('Exit fullscreen');
		expect(enter.calledOnce).to.equal(true);

		control.toggle();
		expect(control.isFullscreen()).to.equal(false);
		expect(container.classList.contains('leaflet-pseudo-fullscreen')).to.equal(false);
		expect(exit.calledOnce).to.equal(true);
	});

	it('exits pseudo-fullscreen on Escape unless something else handled it', () => {
		const control = new FullscreenControl({pseudo: true}).addTo(map).toggle(),
		prevented = new KeyboardEvent('keydown', {key: 'Escape', cancelable: true});
		prevented.preventDefault();

		document.dispatchEvent(prevented);
		expect(control.isFullscreen()).to.equal(true);

		document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
		expect(control.isFullscreen()).to.equal(false);
	});

	it('exits fullscreen when removed', () => {
		const control = new FullscreenControl({pseudo: true}).addTo(map).toggle();
		control.remove();
		expect(container.classList.contains('leaflet-pseudo-fullscreen')).to.equal(false);
		expect(container.classList.contains('leaflet-fullscreen-on')).to.equal(false);
	});

	it('fullscreens a given container', () => {
		const parent = document.createElement('div'),
		control = new FullscreenControl({container: parent, pseudo: true}).addTo(map).toggle();
		expect(parent.classList.contains('leaflet-pseudo-fullscreen')).to.equal(true);
		control.toggle();
	});
});
