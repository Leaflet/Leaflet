describe('LatLng', function () {
	describe('constructor', function () {
		it("sets lat and lng", function () {
			var a = new L.LatLng(25, 74);
			expect(a.lat).to.eql(25);
			expect(a.lng).to.eql(74);

			var b = new L.LatLng(-25, -74);
			expect(b.lat).to.eql(-25);
			expect(b.lng).to.eql(-74);
		});

		it('throws an error if invalid lat or lng', function () {
			expect(function () {
				var a = new L.LatLng(NaN, NaN);
			}).to.throwError();
		});

		it('does not set altitude if undefined', function () {
			var a = new L.LatLng(25, 74);
			expect(typeof a.alt).to.eql('undefined');
		});

		it('sets altitude', function () {
			var a = new L.LatLng(25, 74, 50);
			expect(a.alt).to.eql(50);

			var b = new L.LatLng(-25, -74, -50);
			expect(b.alt).to.eql(-50);
		});

	});

	describe('#equals', function () {
		it("returns true if compared objects are equal within a certain margin", function () {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).to.eql(true);
		});

		it("returns false if compared objects are not equal within a certain margin", function () {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10, 23.3);
			expect(a.equals(b)).to.eql(false);
		});

		it('returns false if passed non-valid object', function () {
			var a = new L.LatLng(10, 20);
			expect(a.equals(null)).to.eql(false);
		});
	});

	describe('#toString', function () {
		it('formats a string', function () {
			var a = new L.LatLng(10.333333333, 20.2222222);
			expect(a.toString(3)).to.eql('LatLng(10.333, 20.222)');
			expect(a.toString()).to.eql('LatLng(10.333333, 20.222222)');
		});
	});

	describe('#distanceTo', function () {
		it('calculates distance in meters', function () {
			var a = new L.LatLng(50.5, 30.5);
			var b = new L.LatLng(50, 1);

			expect(Math.abs(Math.round(a.distanceTo(b) / 1000) - 2084) < 5).to.eql(true);
		});
		it('does not return NaN if input points are equal', function () {
			var a = new L.LatLng(50.5, 30.5);
			var b = new L.LatLng(50.5, 30.5);

			expect(a.distanceTo(b)).to.eql(0);
		});
	});

	describe('L.latLng factory', function () {
		it('returns LatLng instance as is', function () {
			var a = new L.LatLng(50, 30);

			expect(L.latLng(a)).to.eql(a);
		});

		it('accepts an array of coordinates', function () {
			expect(L.latLng([])).to.eql(null);
			expect(L.latLng([50])).to.eql(null);
			expect(L.latLng([50, 30])).to.eql(new L.LatLng(50, 30));
			expect(L.latLng([50, 30, 100])).to.eql(new L.LatLng(50, 30, 100));
		});

		it('passes null or undefined as is', function () {
			expect(L.latLng(undefined)).to.eql(undefined);
			expect(L.latLng(null)).to.eql(null);
		});

		it('creates a LatLng object from two coordinates', function () {
			expect(L.latLng(50, 30)).to.eql(new L.LatLng(50, 30));
		});

		it('accepts an object with lat/lng', function () {
			expect(L.latLng({lat: 50, lng: 30})).to.eql(new L.LatLng(50, 30));
		});

		it('accepts an object with lat/lon', function () {
			expect(L.latLng({lat: 50, lon: 30})).to.eql(new L.LatLng(50, 30));
		});

		it('returns null if lng not specified', function () {
			expect(L.latLng(50)).to.be(null);
		});

		it('accepts altitude as third parameter', function () {
			expect(L.latLng(50, 30, 100)).to.eql(new L.LatLng(50, 30, 100));
		});

		it('accepts an object with alt', function () {
			expect(L.latLng({lat: 50, lng: 30, alt: 100})).to.eql(new L.LatLng(50, 30, 100));
			expect(L.latLng({lat: 50, lon: 30, alt: 100})).to.eql(new L.LatLng(50, 30, 100));
		});
	});

	describe('#clone', function () {

		it('should clone attributes', function () {
			var a = new L.LatLng(50.5, 30.5, 100);
			var b = a.clone();

			expect(b.lat).to.equal(50.5);
			expect(b.lng).to.equal(30.5);
			expect(b.alt).to.equal(100);
		});

		it('should create another reference', function () {
			var a = new L.LatLng(50.5, 30.5, 100);
			var b = a.clone();

			expect(a === b).to.be(false);
		});

	});

});
