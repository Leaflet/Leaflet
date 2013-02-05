describe('LatLng', function() {
	describe('constructor', function() {
		it("should set lat and lng", function() {
			var a = new L.LatLng(25, 74);
			expect(a.lat).toEqual(25);
			expect(a.lng).toEqual(74);

			var a = new L.LatLng(-25, -74);
			expect(a.lat).toEqual(-25);
			expect(a.lng).toEqual(-74);
		});

		it('should throw error if invalid lat or lng', function () {
			expect(function () {
				var a = new L.LatLng(NaN, NaN);
			}).toThrow();
		});
	});

	describe('#equals', function() {
		it("should return true if compared objects are equal within a certain margin", function() {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).toBe(true);
		});

		it("should return false if compared objects are not equal within a certain margin", function() {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10, 23.3);
			expect(a.equals(b)).toBe(false);
		});

		it('should return false if passed non-valid object', function () {
			var a = new L.LatLng(10, 20);
			expect(a.equals(null)).toBe(false);
		});
	});

	describe('#wrap', function () {
		it("#wrap should wrap longitude to lie between -180 and 180 by default", function() {
			var a = new L.LatLng(0, 190).wrap().lng;
			expect(a).toEqual(-170);

			var b = new L.LatLng(0, 360).wrap().lng;
			expect(b).toEqual(0);

			var c = new L.LatLng(0, 380).wrap().lng;
			expect(c).toEqual(20);

			var d = new L.LatLng(0, -190).wrap().lng;
			expect(d).toEqual(170);

			var e = new L.LatLng(0, -360).wrap().lng;
			expect(e).toEqual(0);

			var f = new L.LatLng(0, -380).wrap().lng;
			expect(f).toEqual(-20);

			var g = new L.LatLng(0, 90).wrap().lng;
			expect(g).toEqual(90);

			var h = new L.LatLng(0, 180).wrap().lng;
			expect(h).toEqual(180);
		});

		it("#wrap should wrap longitude within the given range", function() {
			var a = new L.LatLng(0, 190).wrap(-100, 100).lng;
			expect(a).toEqual(-10);
		});

	});

	describe('#toString', function () {
		it('should format to string', function () {
			var a = new L.LatLng(10.333333333, 20.2222222);
			expect(a.toString(3)).toEqual('LatLng(10.333, 20.222)');
		});
	});

	describe('#distanceTo', function () {
		it('should calculate distance in meters', function () {
			var a = new L.LatLng(50.5, 30.5);
			var b = new L.LatLng(50, 1);

			expect(Math.abs(Math.round(a.distanceTo(b) / 1000) - 2084) < 5).toBe(true);
		});
	});

	describe('L.latLng factory', function () {
		it('should return LatLng instance as is', function () {
			var a = new L.LatLng(50, 30);

			expect(L.latLng(a)).toBe(a);
		});

		it('should accept an array of coordinates', function () {
			expect(L.latLng([50, 30])).toEqual(new L.LatLng(50, 30));
		});

		it('should pass null or undefined as is', function () {
			expect(L.latLng(undefined)).toBe(undefined);
			expect(L.latLng(null)).toBe(null);
		});

		it('should create a LatLng object from two coordinates', function () {
			expect(L.latLng(50, 30)).toEqual(new L.LatLng(50, 30));
		});
	});
});

