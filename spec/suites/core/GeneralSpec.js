describe('General', function () {
	it('noConflict', function () {
		var leaflet = L;
		expect(L.noConflict()).to.eql(leaflet);
		expect(L).to.eql(undefined);
		L = leaflet;
	});

	it('namespace extension', function () {
		L.Util.foo = 'bar';
		L.Foo = 'Bar';

		expect(L.Util.foo).to.eql('bar');
		expect(L.Foo).to.eql('Bar');
	});
});
