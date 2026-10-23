import {LeafletMap, WMSTileLayer} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('WMSTileLayer', () => {
	describe('constructor', () => {
		it('sets wmsParams', () => {
			const layer = new WMSTileLayer('https://example.com/map', {opacity: 0.5, attribution: 'foo'});
			expect(layer.wmsParams).to.eql({
				...WMSTileLayer.defaultWmsParams,
				width: 256,
				height: 256
			});
		});
	});

	describe('#getTileUrl', () => {
		let container, map;

		beforeEach(() => {
			container = createContainer();
			map = new LeafletMap(container).setView([0, 0], 0);
		});

		afterEach(() => {
			removeMapContainer(map, container);
		});

		it('accepts a relative service URL', () => {
			const layer = new WMSTileLayer('/wms?map=foo', {layers: 'roads'}).addTo(map);
			const url = new URL(layer.getContainer().querySelector('img').src);

			expect(url.origin).to.equal(location.origin);
			expect(url.pathname).to.equal('/wms');
			expect(url.searchParams.get('map')).to.equal('foo');
			expect(url.searchParams.get('layers')).to.equal('roads');
		});
	});
});
