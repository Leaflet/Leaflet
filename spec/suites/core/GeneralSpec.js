describe('General', function () {
	describe('noConflict', function () {
		var leaflet = L;

		after(function () {
			L = leaflet;
		});

		var LL = L.noConflict();

		expect(LL).to.eql(leaflet);

		L = LL;
	});

	describe('namespace extension', function () {
		// console.log(L)
		L.Util.foo = 'bar';
		L.Foo = 'Bar';

		expect(L.Util.foo).to.eql('bar');
		expect(L.Foo).to.eql('Bar');
	});
});
