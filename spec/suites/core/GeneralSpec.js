describe('General', function () {
	describe('noConflict', function () {
		var leaflet = L;

		after(function () {
			L = leaflet;
		});

		expect(L.noConflict()).to.eql(leaflet);
	});
});
