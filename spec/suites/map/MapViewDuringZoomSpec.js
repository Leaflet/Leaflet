import {expect} from 'chai';
import {DivIcon, LatLng, LeafletMap, Marker} from 'leaflet';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('view changes during zoom', () => {
	let container, map, clock;

	beforeEach(() => {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {zoomAnimation: true}).setView([0, 0], 13);
		new Marker([0, 0], {icon: new DivIcon()}).addTo(map);
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
	});

	afterEach(() => {
		removeMapContainer(map, container);
		if (clock) { clock.restore(); }
	});

	function startZoom() {
		map._animateZoom(new LatLng(0.0005, 0.0005), 14, true);
	}

	it('applies only the latest center and zoom after the transition', () => {
		startZoom();
		expect(map.setView([0.001, 0.001], 15, {animate: false})).to.equal(map);
		map.setView([0.002, 0.002], 16, {animate: false});
		clock.tick(250);
		expect(map.getZoom()).to.equal(16);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.002, 0.002));
	});

	it('preserves pan options for a center-only change', () => {
		startZoom();
		const started = sinon.spy();
		map.on('movestart', started);
		map.setView([0.001, 0.001], undefined, {pan: {animate: false, noMoveStart: true}});
		clock.tick(250);
		expect(map.getZoom()).to.equal(14);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.001, 0.001));
		expect(started.called).to.equal(false);
	});

	it('can return to the zoom level before the active transition', () => {
		startZoom();
		map.setView([0.001, 0.001], 13, {animate: false});
		clock.tick(250);
		expect(map.getZoom()).to.equal(13);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.001, 0.001));
	});

	['zoomend', 'moveend'].forEach((event) => {
		it(`keeps a newer view requested by a ${event} listener`, () => {
			startZoom();
			map.setView([0.001, 0.001], 15, {animate: false});
			map.once(event, () => map.setView([0.002, 0.002], 16, {animate: false}));
			clock.tick(250);
			expect(map.getZoom()).to.equal(16);
			expect(map.getCenter()).to.nearLatLng(new LatLng(0.002, 0.002));
		});
	});

	it('discards the waiting view when stopped', () => {
		startZoom();
		map.setView([0.001, 0.001], 15, {animate: false});
		map.stop();
		clock.tick(250);
		expect(map.getZoom()).to.equal(14);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.0005, 0.0005));
	});

	[false, true].forEach((animate) => {
		it(`handles a request during a real zoom transition with animate=${animate}`, (done) => {
			clock.restore();
			clock = null;
			let ended = 0;
			map.once('zoomanim', () => {
				setTimeout(() => {
					expect(map._animatingZoom).to.equal(true);
					map.setView([0.001, 0.001], 15, {animate});
				}, 10);
			});
			map.on('moveend', () => {
				if (++ended !== 2) { return; }
				expect(map.getZoom()).to.equal(15);
				expect(map.getCenter()).to.nearLatLng(new LatLng(0.001, 0.001));
				done();
			});
			map.setView([0.0005, 0.0005], 14, {animate: true});
		});
	});
});
