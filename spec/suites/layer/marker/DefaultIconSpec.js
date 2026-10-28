import {DefaultIcon, LeafletMap, Marker} from 'leaflet';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('DefaultIcon', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);

		map.setView([0, 0], 0);
		new Marker([0, 0]).addTo(map);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('icon measures 25x41px', () => {
		const img = map.getPane('markerPane').querySelector('img');
		expect(img.clientHeight).to.equal(41);
		expect(img.clientWidth).to.equal(25);
	});

	it('shadow measures 41x41px', () => {
		const img = map.getPane('shadowPane').querySelector('img');
		expect(img.clientHeight).to.equal(41);
		expect(img.clientWidth).to.equal(41);
	});

	it('don\'t set shadow icon if null', () => {
		const oldShadowUrl = DefaultIcon.defaultOptions.shadowUrl;
		DefaultIcon.defaultOptions.shadowUrl = null;
		const marker = new Marker([0, 0]).addTo(map);

		expect(marker._shadow).to.be.null;

		// This is needed because else other tests will fail
		DefaultIcon.defaultOptions.shadowUrl = oldShadowUrl;
	});

	it('don\'t set retina shadow icon if null', () => {
		const oldShadowRetinaUrl = DefaultIcon.defaultOptions.shadowRetinaUrl;
		const oldShadowUrl = DefaultIcon.defaultOptions.shadowUrl;
		const dpr = sinon.stub(window, 'devicePixelRatio').value(2);
		DefaultIcon.defaultOptions.shadowRetinaUrl = null;
		DefaultIcon.defaultOptions.shadowUrl = null;
		const marker = new Marker([0, 0]).addTo(map);

		expect(marker._shadow).to.be.null;

		// This is needed because else other tests will fail
		DefaultIcon.defaultOptions.shadowRetinaUrl = oldShadowRetinaUrl;
		DefaultIcon.defaultOptions.shadowUrl = oldShadowUrl;
		dpr.restore();
	});
});
