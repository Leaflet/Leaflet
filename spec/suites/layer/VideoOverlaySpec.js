import {expect} from 'chai';
import {LatLngBounds, LeafletMap, VideoOverlay} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';
import Hand from 'prosthetic-hand';

describe('VideoOverlay', () => {
	let container, map;
	const videoBounds = new LatLngBounds([[32, -130], [13, -100]]);

	beforeEach(() => {
		container = container = createContainer();
		map = new LeafletMap(container);
		map.setView([20, -115], 4);	// view needs to be set so when layer is added it is initialized
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('create VideoOverlay', () => {
		const videoUrls = [
			'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
			'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
		];

		const videoOverlay = new VideoOverlay(videoUrls, videoBounds).addTo(map);

		expect(map.hasLayer(videoOverlay)).to.be.true;
	});

	it('drags the map while mousemove on video', (done) => {

		const videoUrls = [
			'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
			'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
		];

		const videoOverlay = new VideoOverlay(videoUrls, videoBounds, {interactive: true}).addTo(map);
		(videoOverlay.getElement()).controls = true;
		expect(map.hasLayer(videoOverlay)).to.be.true;

		const hand = new Hand({
			timing: 'fastframe',
			onStop() {
				expect(map.getCenter()).nearLatLng([19.973348786110613, -114.96093750000001], 0.03);
				done();
			}});
		const mouse = hand.growFinger('mouse');
		mouse.moveTo(200, 200, 100)
			.down().moveBy(50, 50, 10).up();
	});

	it('don\'t drags the map if video has enabled controls', (done) => {

		const videoUrls = [
			'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
			'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
		];

		const videoOverlay = new VideoOverlay(videoUrls, videoBounds, {interactive: true}).addTo(map);
		(videoOverlay.getElement()).controls = true;
		expect(map.hasLayer(videoOverlay)).to.be.true;

		setTimeout(() => {
			const center = map.getCenter();

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(map.getCenter()).nearLatLng(center, 0.03);
					done();
				}});
			const mouse = hand.growFinger('mouse');
			mouse.moveTo(200, 200, 10)
				.down().moveBy(50, 50, 10).up();
		}, 100);
	});
});
