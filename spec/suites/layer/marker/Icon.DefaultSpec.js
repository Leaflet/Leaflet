import {Map, Marker, Icon} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Icon.Default', () => {
	let container, map;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);

		map.setView([0, 0], 0);
		new Marker([0, 0]).addTo(map);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('detect icon images path', () => {
		const origPath = Icon.Default.imagePath; // set in after.js
		expect(origPath).to.be.ok;
		delete Icon.Default.imagePath;
		const marker = new Marker([0, 0]);

		expect(Icon.Default.imagePath).to.be.undefined;
		marker.addTo(map);

		expect(Icon.Default.imagePath).to.equal(location.origin + origPath);

		const stripUrl = Icon.Default.prototype._stripUrl;
		const properPath = 'http://localhost:8000/base/dist/images/';
		[ // valid
			'url("http://localhost:8000/base/dist/images/marker-icon.png")',  // Firefox
			'url(\'http://localhost:8000/base/dist/images/marker-icon.png\')',
			'url(http://localhost:8000/base/dist/images/marker-icon.png)',    // IE, Edge
		].map(stripUrl).forEach((str) => { expect(str).to.equal(properPath); });

		[ // invalid
			'url("http://localhost:8000/base/dist/images/marker-icon.png?2x)"',
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
});
