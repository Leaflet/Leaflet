/* global L */
import 'leaflet';

describe('General', () => {
	it('namespace extension', () => {
		L.Util.foo = 'bar';
		L.Foo = 'Bar';

		expect(L.Util.foo).to.eql('bar');
		expect(L.Foo).to.eql('Bar');
	});
});
