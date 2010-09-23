describe('L#noConflict', function() {
	it('should restore the previous L value and return Leaflet namespace', function(){
		
		expect(L.VERSION).toBeDefined();
		
		var L2 = L.noConflict();
		
		expect(L).toEqual('test');
		expect(L2.VERSION).toBeDefined();
		
		this.after(function() {
			window.L = L2;
		});
	});
});