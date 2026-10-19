import {expect} from 'chai';
import {GridLayer, LeafletMap} from 'leaflet';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('removing a map during zoom', () => {
	let container, map, clock;

	beforeEach(() => {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {zoomAnimation: true}).setView([0, 0], 11);
		new GridLayer().addTo(map);
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
	});

	afterEach(() => {
		clock.restore();
		removeMapContainer(map, container);
	});

	it('cancels the completion timer and ignores late transition callbacks', () => {
		let ended = 0;
		const completed = sinon.spy(map, '_onZoomTransitionEnd');
		map.on('zoomend', () => { ended++; });
		map._animateZoom(map.getCenter(), 14, true);
		const removed = map;
		map.remove();
		map = null;
		clock.tick(300);
		expect(completed.callCount).to.equal(0);
		removed._onZoomTransitionEnd();
		expect(ended).to.equal(0);
	});

	it('cancels a zoom scheduled for the next frame', (done) => {
		let started = 0;
		map.on('zoomstart', () => { started++; });
		map.setZoom(14, {animate: true});
		map.remove();
		map = null;
		started = 0;
		requestAnimationFrame(() => {
			expect(started).to.equal(0);
			done();
		});
	});
});
