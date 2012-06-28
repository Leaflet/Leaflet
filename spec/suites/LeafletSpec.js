describe('L#noConflict', function() {
	it('should restore the previous L value and return Leaflet namespace', function(){
		
		expect(L.version).toBeDefined();
		
		var L2 = L.noConflict();
		this.after(function () {
			window.L = L2;
		});

		expect(L).toEqual('test');
		expect(L2.version).toBeDefined();
	});
});