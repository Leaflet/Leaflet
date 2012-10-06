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

	describe('#getSouthLat', function() {
		it('returns the latitude of the southern bound', function() {
			expect(a.getSouthLat()).toBe(14);
		});
	});

	describe('#getWestLng', function() {
		it('returns the longitude of the western bound', function() {
			expect(a.getWestLng()).toBe(12);
		});
	});

	describe('#getNorthLat', function() {
		it('returns the latitude of the northern bound', function() {
			expect(a.getNorthLat()).toBe(30);
		});
	});

	describe('#getEastLng', function() {
		it('returns the longitude of the eastern bound', function() {
			expect(a.getEastLng()).toBe(40);
		});
	});
});