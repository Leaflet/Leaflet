import {LatLngBounds, LeafletMap, VideoOverlay} from 'leaflet';
import {createContainer, removeMapContainer, Finger} from '../SpecHelper.js';

describe('VideoOverlay', () => {
	let container, map;
	const videoBounds = new LatLngBounds([[32, -130], [13, -100]]);

	// empty data URIs so no test has to fetch a real video over the network
	const videoUrl = 'data:video/webm;base64,';
	const videoUrls = [videoUrl, 'data:video/mp4;base64,'];

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);
		map.setView([20, -115], 4);	// view needs to be set so when layer is added it is initialized
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('keeps its size despite a max-width on videos in the page (#4600)', () => {
		const style = document.createElement('style');
		style.textContent = 'video { max-width: 10px; max-height: 10px; }';
		document.head.append(style);

		const videoOverlay = new VideoOverlay(videoUrls, videoBounds).addTo(map);
		const {maxWidth, maxHeight} = getComputedStyle(videoOverlay.getElement());
		style.remove();

		expect([maxWidth, maxHeight]).to.eql(['none', 'none']);
	});

	it('create VideoOverlay', () => {
		const videoOverlay = new VideoOverlay(videoUrls, videoBounds).addTo(map);

		expect(map.hasLayer(videoOverlay)).to.be.true;
	});

	it('create VideoOverlay from a video element with source elements', () => {
		const video = document.createElement('video');
		for (const url of videoUrls) {
			const source = document.createElement('source');
			source.src = url;
			video.appendChild(source);
		}

		const videoOverlay = new VideoOverlay(video, videoBounds).addTo(map);

		expect(map.hasLayer(videoOverlay)).to.be.true;
		expect(videoOverlay.getElement()).to.equal(video);
		expect(video.parentNode).to.equal(map.getPane('overlayPane'));
		expect(video.getElementsByTagName('source').length).to.equal(2);
		expect(videoOverlay._url).to.eql(videoUrls);
	});

	it('create VideoOverlay from a video element with a src attribute', () => {
		const video = document.createElement('video');
		video.src = videoUrl;

		const videoOverlay = new VideoOverlay(video, videoBounds).addTo(map);

		expect(map.hasLayer(videoOverlay)).to.be.true;
		expect(videoOverlay.getElement()).to.equal(video);
		expect(videoOverlay._url).to.eql([videoUrl]);
	});

	it('stretches the video to its bounds with keepAspectRatio: false', () => {
		const keptOverlay = new VideoOverlay(videoUrl, videoBounds).addTo(map);
		const stretchedOverlay = new VideoOverlay(videoUrl, videoBounds, {keepAspectRatio: false}).addTo(map);

		expect(getComputedStyle(keptOverlay.getElement()).objectFit).to.equal('contain');
		expect(getComputedStyle(stretchedOverlay.getElement()).objectFit).to.equal('fill');
	});

	it('uses the z-index specified in options', () => {
		const overlay = new VideoOverlay(videoUrl, videoBounds, {zIndex: 20}).addTo(map);
		expect(overlay.getElement().style.zIndex).to.equal('20');
	});

	it('sets the z-index when added to the map, e.g. by the layers control', () => {
		const overlay = new VideoOverlay(videoUrl, videoBounds).setZIndex(10).addTo(map);
		expect(overlay.getElement().style.zIndex).to.equal('10');
	});

	async function dragOverVideo(controls) {
		const videoOverlay = new VideoOverlay(videoUrls, videoBounds, {interactive: true, controls}).addTo(map);
		expect(map.hasLayer(videoOverlay)).to.be.true;

		map.options.inertia = false;
		const center = map.getCenter();

		await new Finger().moveTo(200, 200).down().moveBy(50, 50).up();
		return map.latLngToContainerPoint(center);
	}

	it('drags the map while dragging on video', async () => {
		expect(await dragOverVideo(false)).to.be.near([250, 250]);
	});

	it('does not drag the map if video has enabled controls', async () => {
		expect(await dragOverVideo(true)).to.be.near([200, 200]);
	});
});
