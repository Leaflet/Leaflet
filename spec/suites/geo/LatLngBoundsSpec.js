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

	describe('#getWest', function () {
		it('should return a proper bbox west value', function() {
			expect(a.getWest()).toEqual(12);
		});

	});

	describe('#getSouth', function () {
		it('should return a proper bbox south value', function() {
			expect(a.getSouth()).toEqual(14);
		});

	});

	describe('#getEast', function () {
		it('should return a proper bbox east value', function() {
			expect(a.getEast()).toEqual(40);
		});

	});

	describe('#getNorth', function () {
		it('should return a proper bbox north value', function() {
			expect(a.getNorth()).toEqual(30);
		});

	});

	describe('#toBBoxString', function () {
		it('should return a proper left,bottom,right,top bbox', function() {
			expect(a.toBBoxString()).toEqual("12,14,40,30");
		});

	});

	describe('#getNorthWest', function () {
		it('should return a proper north-west LatLng', function() {
			expect(a.getNorthWest()).toEqual(new L.LatLng(a.getNorth(), a.getWest()));
		});

	});

	describe('#getSouthEast', function () {
		it('should return a proper south-east LatLng', function() {
			expect(a.getSouthEast()).toEqual(new L.LatLng(a.getSouth(), a.getEast()));
		});

	});

});