import {EPSG4326, LeafletMap, Point, WMSTileLayer} from 'leaflet';
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

	describe('#setParams', () => {
		let container, map;

		beforeEach(() => {
			container = createContainer();
			map = new LeafletMap(container).setView([0, 0], 0);
		});

		afterEach(() => {
			removeMapContainer(map, container);
		});

		it('updates the projection key when changing version to 1.3.0', () => {
			const layer = new WMSTileLayer('https://example.com/map', {layers: 'roads'}).addTo(map);

			layer.setParams({version: '1.3.0'}, true);

			expect(layer.wmsParams.version).to.equal('1.3.0');
			expect(layer.wmsParams.crs).to.equal(map.options.crs.code);
			expect(layer.wmsParams).not.to.have.property('srs');
		});

		it('updates the projection key when changing version to 1.1.1', () => {
			const layer = new WMSTileLayer('https://example.com/map', {layers: 'roads', version: '1.3.0'}).addTo(map);

			layer.setParams({version: '1.1.1'}, true);

			expect(layer.wmsParams.version).to.equal('1.1.1');
			expect(layer.wmsParams.srs).to.equal(map.options.crs.code);
			expect(layer.wmsParams).not.to.have.property('crs');
		});

		it('updates the version before the layer is added to a map', () => {
			const layer = new WMSTileLayer('https://example.com/map', {layers: 'roads'});

			layer.setParams({version: '1.3.0'}, true);

			expect(layer.wmsParams.version).to.equal('1.3.0');

			layer.addTo(map);

			expect(layer.wmsParams.crs).to.equal(map.options.crs.code);
			expect(layer.wmsParams).not.to.have.property('srs');
		});
	});

	describe('#getTileUrl', () => {
		let container, map;

		beforeEach(() => {
			container = createContainer();
			map = new LeafletMap(container, {crs: EPSG4326}).setView([0, 0], 0);
		});

		afterEach(() => {
			removeMapContainer(map, container);
		});

		it('updates BBOX when changing version to 1.3.0', () => {
			const layer = new WMSTileLayer('/wms', {layers: 'roads'}).addTo(map);

			const getBbox = () => new URL(
				layer.getTileUrl(new Point(0, 0)),
				location.origin
			).searchParams.get('bbox');

			const bbox111 = getBbox();

			layer.setParams({version: '1.3.0'});

			expect(getBbox()).not.to.equal(bbox111);
		});
	});
});
