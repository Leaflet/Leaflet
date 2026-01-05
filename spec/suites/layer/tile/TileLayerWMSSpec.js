import {expect} from 'chai';
import {TileLayerWMS} from 'leaflet';

describe('TileLayerWMS', () => {
	describe('constructor', () => {
		it('sets wmsParams', () => {
			const layer = new TileLayerWMS('https://example.com/map', {opacity: 0.5, attribution: 'foo'});
			expect(layer.wmsParams).to.eql({
				...layer.defaultWmsParams,
				width: 256,
				height: 256
			});
		});
	});
});
