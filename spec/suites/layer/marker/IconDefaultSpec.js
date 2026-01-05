import {expect} from 'chai';
import {IconDefault, LeafletMap, Marker, Browser} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('IconDefault', () => {
	let container, map;

	beforeEach(() => {
		container = container = createContainer();
		map = new LeafletMap(container);

		map.setView([0, 0], 0);
		new Marker([0, 0]).addTo(map);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('detect icon images path', () => {
		const origPath = IconDefault.imagePath; // set in after.js
		expect(origPath).to.be.ok;
		delete IconDefault.imagePath;
		const marker = new Marker([0, 0]);

		expect(IconDefault.imagePath).to.be.undefined;
		marker.addTo(map);

		expect(IconDefault.imagePath).to.equal(location.origin + origPath);

		const stripUrl = IconDefault.prototype._stripUrl;
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
		const oldShadowUrl = IconDefault.prototype.options.shadowUrl;
		IconDefault.prototype.options.shadowUrl = null;
		const marker = new Marker([0, 0]).addTo(map);

		expect(marker._shadow).to.be.null;

		// This is needed because else other tests will fail
		IconDefault.prototype.options.shadowUrl = oldShadowUrl;
	});

	it('don\'t set retina shadow icon if null', () => {
		const oldShadowRetinaUrl = IconDefault.prototype.options.shadowRetinaUrl;
		const oldShadowUrl = IconDefault.prototype.options.shadowUrl;
		const oldRetinaValue = Browser.retina;
		Browser.retina = true;
		IconDefault.prototype.options.shadowRetinaUrl = null;
		IconDefault.prototype.options.shadowUrl = null;
		const marker = new Marker([0, 0]).addTo(map);

		expect(marker._shadow).to.be.null;

		// This is needed because else other tests will fail
		IconDefault.prototype.options.shadowRetinaUrl = oldShadowRetinaUrl;
		IconDefault.prototype.options.shadowUrl = oldShadowUrl;
		Browser.retina = oldRetinaValue;
	});
});
