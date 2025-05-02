import {expect} from 'chai';
import {TileLayer} from 'leaflet';

describe('TileLayer.WMS', () => {
	describe('constructor', () => {
		it('sets wmsParams', () => {
			const layer = new TileLayer.WMS('https://example.com/map', {opacity: 0.5, attribution: 'foo'});
			expect(layer.wmsParams).to.eql({
				...layer.defaultWmsParams,
				width: 256,
				height: 256
			});
		});
	});
});
