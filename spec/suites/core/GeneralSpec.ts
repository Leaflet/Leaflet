describe('General', function () {
	describe('noConflict', function () {
		var leaflet = L;

		after(function () {
			L = leaflet;
		});

		expect(L.noConflict()).to.eql(leaflet);
	});

	describe('namespace extension', function () {
		L.Util.foo = 'bar';
		L.Foo = 'Bar';

		expect(L.Util.foo).to.eql('bar');
		expect(L.Foo).to.eql('Bar');
	});
});
