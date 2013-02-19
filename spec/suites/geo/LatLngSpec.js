describe('LatLng', function() {
	function testConstructor(fn) {
		return function () {
			it("constructs the origin", function () {
				var a = fn(0, 0);
				expect(a.lat).toEqual(0);
				expect(a.lng).toEqual(0);
			});

			it("constructs a LatLng with the given lat and lng", function () {
				var a = fn(25, 74);
				expect(a.lat).toEqual(25);
				expect(a.lng).toEqual(74);
			});

			it('constructs a LatLng from array of coordinates', function () {
				var a = fn([50, 30]);
				expect(a.lat).toEqual(50);
				expect(a.lng).toEqual(30);
			});

			it('throws an error if invalid lat or lng', function () {
				expect(function () {
					fn(NaN, NaN);
				}).toThrow();
			});

			it('returns LatLng instances as is', function () {
				var a = fn(50, 30);
				expect(fn(a)).toBe(a);
			});

			it('returns null or undefined as is', function () {
				expect(fn(undefined)).toBe(undefined);
				expect(fn(null)).toBe(null);
			});

			it('accepts an object with lat/lng', function () {
				expect(fn({lat: 50, lng: 30})).toEqual(fn(50, 30));
			});

			it('accepts an object with lat/lon', function () {
				expect(fn({lat: 50, lon: 30})).toEqual(fn(50, 30));
			});
		}
	}

	describe('constructed via new L.LatLng', testConstructor(function(a, b) { return new L.LatLng(a, b); }));
	describe('constructed via L.LatLng', testConstructor(function(a, b) { return L.LatLng(a, b); }));
	describe('constructed via L.latLng', testConstructor(function(a, b) { return L.latLng(a, b); }));

	describe('#equals', function() {
		it("returns true if compared objects are equal within a certain margin", function() {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).toBe(true);
		});

		it("returns false if compared objects are not equal within a certain margin", function() {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10, 23.3);
			expect(a.equals(b)).toBe(false);
		});

		it('returns false if passed non-valid object', function () {
			var a = new L.LatLng(10, 20);
			expect(a.equals(null)).toBe(false);
		});
	});

	describe('#wrap', function () {
		it("wraps longitude to lie between -180 and 180 by default", function() {
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

		it("wraps longitude within the given range", function() {
			var a = new L.LatLng(0, 190).wrap(-100, 100).lng;
			expect(a).toEqual(-10);
		});

	});

	describe('#toString', function () {
		it('formats a string', function () {
			var a = new L.LatLng(10.333333333, 20.2222222);
			expect(a.toString(3)).toEqual('LatLng(10.333, 20.222)');
		});
	});

	describe('#distanceTo', function () {
		it('calculates distance in meters', function () {
			var a = new L.LatLng(50.5, 30.5);
			var b = new L.LatLng(50, 1);

			expect(Math.abs(Math.round(a.distanceTo(b) / 1000) - 2084) < 5).toBe(true);
		});
	});
});
