import {DefaultIcon, LeafletMap, Marker} from 'leaflet';
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

	it('icon measures 25x46px', () => {
		const img = map.getPane('markerPane').querySelector('img');
		expect(img.clientHeight).to.equal(46);
		expect(img.clientWidth).to.equal(25);
	});

	it('has the shadow baked into the icon', () => {
		expect(map.getPane('shadowPane').childElementCount).to.equal(0);
	});

	it('paints the pin in the given color', () => {
		const src = new DefaultIcon({iconUrl: 'blue.png', color: '#c00'})._getIconUrl('icon');
		expect(src).to.contain('stop-color="%23c00"');
	});
});
