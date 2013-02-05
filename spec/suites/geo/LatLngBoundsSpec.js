describe('LatLngBounds', function() {
	var a, c;

	beforeEach(function() {
		a = new L.LatLngBounds(
			new L.LatLng(14, 12),
			new L.LatLng(30, 40));
		c = new L.LatLngBounds();
	});

	describe('constructor', function () {
		it('should instantiate properly either passing two latlngs or an array of latlngs', function () {
			var b = new L.LatLngBounds([
				new L.LatLng(14, 12),
				new L.LatLng(30, 40)
			]);
			expect(b).toEqual(a);
			expect(b.getNorthWest()).toEqual(new L.LatLng(30, 12));
		});
	});

	describe('#extend', function () {
		it('should extend the bounds by a given point', function () {
			a.extend(new L.LatLng(20, 50));
			expect(a.getNorthEast()).toEqual(new L.LatLng(30, 50));
		});

		it('should extend the bounds by given bounds', function () {
			a.extend([[20, 50], [8, 40]]);

			expect(a.getSouthEast()).toEqual(new L.LatLng(8, 50));
		});
	});

	describe('#getCenter', function () {
		it('should return the bounds center', function () {
			expect(a.getCenter()).toEqual(new L.LatLng(22, 26));
		});
	});

	describe('#pad', function () {
		it('should pad the bounds by a given ratio', function () {
			var b = a.pad(0.5);

			expect(b).toEqual(L.latLngBounds([[6, -2], [38, 54]]));
		});
	});

	describe('#equals', function () {
		it('should return true if bounds equal', function () {
			expect(a.equals([[14, 12], [30, 40]])).toBe(true);
			expect(a.equals([[14, 13], [30, 40]])).toBe(false);
			expect(a.equals(null)).toBe(false);
		});
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

	describe('#contains', function () {
		it('should return true if contains latlng point', function () {
			expect(a.contains([16, 20])).toBe(true);
			expect(L.latLngBounds(a).contains([5, 20])).toBe(false);
		});

		it('should accept bounds', function () {
			expect(a.contains([[16, 20], [20, 40]])).toBe(true);
			expect(a.contains([[16, 50], [8, 40]])).toBe(false);
		});
	});

	describe('#intersects', function () {
		it('should return true if intersects the given bounds', function () {
			expect(a.intersects([[16, 20], [50, 60]])).toBe(true);
			expect(a.contains([[40, 50], [50, 60]])).toBe(false);
		});
	});

});
