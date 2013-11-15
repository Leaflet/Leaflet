describe('L#noConflict', function () {
	it('restores the previous L value and returns Leaflet namespace', function () {

		expect(L.version).to.be.ok();

		var L2 = L.noConflict();

		expect(L).to.eql('test');
		expect(L2.version).to.be.ok();

		window.L = L2;
	});
});
