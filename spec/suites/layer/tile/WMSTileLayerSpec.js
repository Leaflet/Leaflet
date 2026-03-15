import {expect} from 'chai';
import {WMSTileLayer} from 'leaflet';

describe('WMSTileLayer', () => {
	describe('constructor', () => {
		it('sets wmsParams', () => {
			const layer = new WMSTileLayer('https://example.com/map', {opacity: 0.5, attribution: 'foo'});
			expect(layer.wmsParams).to.eql({
				...layer.defaultWmsParams,
				width: 256,
				height: 256
			});
		});
	});
});
