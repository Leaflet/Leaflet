describe('LatLngBounds', function() {
	var a, c;
	
	beforeEach(function() {
		a = new L.LatLngBounds(
			new L.LatLng(14, 12),
			new L.LatLng(30, 40));
		c = new L.LatLngBounds();
	});
	
	describe('#isValid', function() {
		it('should return true if properly set up', function() {
			expect(a.isValid()).toBeTruthy();
		});
		it('should return false if is invalid', function() {
			expect(c.isValid()).toBeFalsy();
		});
		it('should be valid if extended', function() {
			c.extend([0, 0]);
			expect(c.isValid()).toBeTruthy();
		});
	});
});