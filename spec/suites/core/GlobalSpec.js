import {expect} from 'chai';
import {loadScript, removeScript} from '../SpecHelper.js';

describe('Global', () => {
	const scriptSrc = '/base/dist/leaflet-global-src.js';

	before(async () => {
		await loadScript(scriptSrc);
	});

	after(() => {
		removeScript(scriptSrc);
		delete globalThis.L;
	});

	it('exposes the global L variable', () => {
		expect(globalThis.L).to.exist;
	});

	it('allows extending the L global and its namespaces', () => {
		globalThis.L.Util.foo = 'bar';
		globalThis.L.Foo = 'Bar';

		expect(globalThis.L.Util.foo).to.eql('bar');
		expect(globalThis.L.Foo).to.eql('Bar');
	});
});
