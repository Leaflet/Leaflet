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

	describe('#getLeft', function () {
		it('should return a proper bbox left value', function() {
			expect(a.getLeft()).toEqual(12);
		});

	});

	describe('#getBottom', function () {
		it('should return a proper bbox bottom value', function() {
			expect(a.getBottom()).toEqual(14);
		});

	});

	describe('#getRight', function () {
		it('should return a proper bbox right value', function() {
			expect(a.getRight()).toEqual(40);
		});

	});

	describe('#getTop', function () {
		it('should return a proper bbox top value', function() {
			expect(a.getTop()).toEqual(30);
		});

	});

	describe('#toBBoxString', function () {
		it('should return a proper left,bottom,right,top bbox', function() {
			expect(a.toBBoxString()).toEqual("12,14,40,30");
		});

	});
});