import {EPSG4326, LeafletMap, Point, WMSTileLayer} from 'leaflet';
import sinon from 'sinon';
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

		it('keeps the image size in sync with the detectRetina tile size', () => {
			const dpr = sinon.stub(window, 'devicePixelRatio').value(1.25);
			expect(new WMSTileLayer('/wms', {detectRetina: true}).wmsParams.width).to.equal(256);
			dpr.value(2);
			expect(new WMSTileLayer('/wms', {detectRetina: true}).wmsParams.width).to.equal(256);
			dpr.restore();
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

		it('updates the projection param and BBOX axis order on version change', () => {
			const layer = new WMSTileLayer('/wms', {layers: 'roads', crs: EPSG4326}).addTo(map);
			const getParams = () => new URL(layer.getTileUrl(new Point(0, 0))).searchParams;

			const [minX, minY, maxX, maxY] = getParams().get('bbox').split(',');
			expect(getParams().get('srs')).to.equal('EPSG:4326');

			layer.setParams({version: '1.3.0'});
			expect(getParams().get('crs')).to.equal('EPSG:4326');
			expect(getParams().has('srs')).to.be.false;
			expect(getParams().get('bbox')).to.equal([minY, minX, maxY, maxX].join(','));

			layer.setParams({version: '1.1.1'});
			expect(getParams().get('srs')).to.equal('EPSG:4326');
			expect(getParams().has('crs')).to.be.false;
			expect(getParams().get('bbox')).to.equal([minX, minY, maxX, maxY].join(','));
		});
	});
});
