describe('LatLngBounds', function() {
	var a, c;

	beforeEach(function() {
		a = new L.LatLngBounds(
			new L.LatLng(14, 12),
			new L.LatLng(30, 40));
		c = new L.LatLngBounds();
	});

	function testConstructor(fn, factory) {
		return function () {
			it('constructs a LatLngBounds instance from the given LatLngs', function () {
				var sw = new L.LatLng(14, 12),
				    ne = new L.LatLng(30, 40),
				    b = fn(sw, ne);
				expect(b.getSouthWest()).toEqual(sw);
				expect(b.getNorthEast()).toEqual(ne);
			});

			it('constructs a LatLngBounds instance from the given array of LatLngs', function () {
				var sw = new L.LatLng(14, 12),
				    ne = new L.LatLng(30, 40),
				    b = fn([sw, ne]);
				expect(b.getSouthWest()).toEqual(sw);
				expect(b.getNorthEast()).toEqual(ne);
			});

			it('constructs a LatLngBounds instance from the given array of coordinates', function () {
				var sw = [14, 12],
				    ne = [30, 40],
				    b = fn([sw, ne]);
				expect(b.getSouthWest()).toEqual(new L.LatLng(sw));
				expect(b.getNorthEast()).toEqual(new L.LatLng(ne));
			});

			it('returns LatLngBounds instance as is', function () {
				expect(fn(a)).toBe(a);
			});

			if (factory) {
				it('returns null or undefined as is', function () {
					expect(fn(undefined)).toBe(undefined);
					expect(fn(null)).toBe(null);
				});
			}
		}
	}

	describe('constructed via new L.LatLngBounds', testConstructor(function(a, b) { return new L.LatLngBounds(a, b); }));
	describe('constructed via L.LatLngBounds', testConstructor(function(a, b) { return L.LatLngBounds(a, b); }, true));
	describe('constructed via L.latLngBounds', testConstructor(function(a, b) { return L.latLngBounds(a, b); }, true));

	describe('#extend', function () {
		it('extends the bounds by a given point', function () {
			a.extend(new L.LatLng(20, 50));
			expect(a.getNorthEast()).toEqual(new L.LatLng(30, 50));
		});

		it('extends the bounds by given bounds', function () {
			a.extend([[20, 50], [8, 40]]);

			expect(a.getSouthEast()).toEqual(new L.LatLng(8, 50));
		});
	});

	describe('#getCenter', function () {
		it('returns the bounds center', function () {
			expect(a.getCenter()).toEqual(new L.LatLng(22, 26));
		});
	});

	describe('#pad', function () {
		it('pads the bounds by a given ratio', function () {
			var b = a.pad(0.5);

			expect(b).toEqual(L.latLngBounds([[6, -2], [38, 54]]));
		});
	});

	describe('#equals', function () {
		it('returns true if bounds equal', function () {
			expect(a.equals([[14, 12], [30, 40]])).toBe(true);
			expect(a.equals([[14, 13], [30, 40]])).toBe(false);
			expect(a.equals(null)).toBe(false);
		});
	});

	describe('#isValid', function() {
		it('returns true if properly set up', function() {
			expect(a.isValid()).toBeTruthy();
		});
		it('returns false if is invalid', function() {
			expect(c.isValid()).toBeFalsy();
		});
		it('returns true if extended', function() {
			c.extend([0, 0]);
			expect(c.isValid()).toBeTruthy();
		});
	});

	describe('#getWest', function () {
		it('returns a proper bbox west value', function() {
			expect(a.getWest()).toEqual(12);
		});
	});

	describe('#getSouth', function () {
		it('returns a proper bbox south value', function() {
			expect(a.getSouth()).toEqual(14);
		});

	});

	describe('#getEast', function () {
		it('returns a proper bbox east value', function() {
			expect(a.getEast()).toEqual(40);
		});

	});

	describe('#getNorth', function () {
		it('returns a proper bbox north value', function() {
			expect(a.getNorth()).toEqual(30);
		});

	});

	describe('#toBBoxString', function () {
		it('returns a proper left,bottom,right,top bbox', function() {
			expect(a.toBBoxString()).toEqual("12,14,40,30");
		});

	});

	describe('#getNorthWest', function () {
		it('returns a proper north-west LatLng', function() {
			expect(a.getNorthWest()).toEqual(new L.LatLng(a.getNorth(), a.getWest()));
		});

	});

	describe('#getSouthEast', function () {
		it('returns a proper south-east LatLng', function() {
			expect(a.getSouthEast()).toEqual(new L.LatLng(a.getSouth(), a.getEast()));
		});
	});

	describe('#contains', function () {
		it('returns true if contains latlng point', function () {
			expect(a.contains([16, 20])).toBe(true);
			expect(L.latLngBounds(a).contains([5, 20])).toBe(false);
		});

		it('returns true if contains bounds', function () {
			expect(a.contains([[16, 20], [20, 40]])).toBe(true);
			expect(a.contains([[16, 50], [8, 40]])).toBe(false);
		});
	});

	describe('#intersects', function () {
		it('returns true if intersects the given bounds', function () {
			expect(a.intersects([[16, 20], [50, 60]])).toBe(true);
			expect(a.contains([[40, 50], [50, 60]])).toBe(false);
		});
	});

});
