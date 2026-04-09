import {expect} from 'chai';
import {DefaultIcon, LeafletMap, Marker, Browser} from 'leaflet';
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

	it('detect icon images path', () => {
		const origPath = DefaultIcon.imagePath; // set in after.js
		expect(origPath).to.be.ok;
		delete DefaultIcon.imagePath;
		const marker = new Marker([0, 0]);

		expect(DefaultIcon.imagePath).to.be.undefined;
		marker.addTo(map);

		expect(DefaultIcon.imagePath).to.equal(location.origin + origPath);

		const stripUrl = DefaultIcon.prototype._stripUrl;
		const properPath = 'http://localhost:8000/base/dist/images/';
		[ // valid
			'url("http://localhost:8000/base/dist/images/marker-icon.svg")',  // Firefox
			'url(\'http://localhost:8000/base/dist/images/marker-icon.svg\')',
			'url(http://localhost:8000/base/dist/images/marker-icon.svg)'
		].map(stripUrl).forEach((str) => { expect(str).to.equal(properPath); });

		[ // invalid
			'url("http://localhost:8000/base/dist/images/marker-icon.svg?2x)"',
			'url("data:image/png;base64,iVBORw...")',                         // inline image (bundlers)
		].map(stripUrl).forEach((str) => { expect(str).not.to.be.true; });
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
		const oldRetinaValue = Browser.retina;
		Browser.retina = true;
		DefaultIcon.defaultOptions.shadowRetinaUrl = null;
		DefaultIcon.defaultOptions.shadowUrl = null;
		const marker = new Marker([0, 0]).addTo(map);

		expect(marker._shadow).to.be.null;

		// This is needed because else other tests will fail
		DefaultIcon.defaultOptions.shadowRetinaUrl = oldShadowRetinaUrl;
		DefaultIcon.defaultOptions.shadowUrl = oldShadowUrl;
		Browser.retina = oldRetinaValue;
	});
});
