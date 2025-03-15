/* global L */
import * as L from 'leaflet';
import {expect} from 'chai';

describe('General', () => {
	it('namespace extension', () => {
		L.Util.foo = 'bar';
		L.Foo = 'Bar';

		expect(L.Util.foo).to.eql('bar');
		expect(L.Foo).to.eql('Bar');
	});
});
