describe('L#noConflict', function() {
	it('restores the previous L value and returns Leaflet namespace', function(){

		expect(L.version).toBeDefined();

		var L2 = L.noConflict();

		expect(L).toEqual('test');
		expect(L2.version).toBeDefined();

		window.L = L2;
	});
});
