describe('LatLng', function () {
	describe('constructor', function () {
		it("sets lat and lng", function () {
			var a = L.latLng(25, 74);
			expect(a.lat).to.be(25);
			expect(a.lng).to.be(74);

			var b = L.latLng(-25, -74);
			expect(b.lat).to.be(-25);
			expect(b.lng).to.be(-74);
		});
		it("converts lat/lng/alt from string", function () {
			var a = new L.LatLng("25", " 74", "0 ");
			expect(a.lat).to.be(25);
			expect(a.lng).to.be(74);
			expect(a.alt).to.be(0);

			var b = new L.LatLng("-25", "-74");
			expect(b.lat).to.be(-25);
			expect(b.lng).to.be(-74);

			var c = new L.LatLng("010", "0x10"); // better'd throw here..
			expect(c.lat).to.be(10);
			expect(c.lng).to.be(16);
		});

		it('throws an error if invalid lat/lng/alt', function () {
			expect(L.latLng).withArgs(0).to.throwError();
			expect(L.latLng).withArgs(NaN, 0).to.throwError();
			expect(L.latLng).withArgs(true, 0).to.throwError();
			expect(L.latLng).withArgs(false, 0).to.throwError();
			expect(L.latLng).withArgs(undefined, 0).to.throwError();
			expect(L.latLng).withArgs(null, 0).to.throwError();
			expect(L.latLng).withArgs('', 0).to.throwError();
			expect(L.latLng).withArgs('\n', 0).to.throwError();
			expect(L.latLng).withArgs('1px', 0).to.throwError();
			expect(L.latLng).withArgs('nonsense', 0).to.throwError();
			expect(L.latLng).withArgs([]).to.throwError();
			expect(L.latLng).withArgs([50]).to.throwError();
			// do not throw atm:
			// expect(L.latLng).withArgs(Infinity, 0).to.throwError();
			// expect(L.latLng).withArgs(-Infinity, 0).to.throwError();
			// expect(L.latLng).withArgs('0010', 0).to.throwError();
			// expect(L.latLng).withArgs('0x10', 0).to.throwError();
			// expect(L.latLng).withArgs('1e5', 0).to.throwError();
		});

		it('does not set altitude if not specified', function () {
			var a = new L.LatLng(25, 74);
			expect(a).to.not.have.key('alt');

			var b = new L.LatLng(25, 74, undefined);
			expect(b).to.not.have.key('alt');
			expect(typeof b.alt).to.be('undefined');
		});

		it('sets altitude', function () {
			var a = L.latLng(25, 74, 50);
			expect(a.alt).to.eql(50);

			var b = L.latLng(-25, -74, -50);
			expect(b.alt).to.eql(-50);
		});

		it('class and factory returns the same', function () {
			expect(new L.LatLng([0, 0])).to.eql(L.latLng([0, 0]));
		});
	});

	describe('#equals', function () {
		it("returns true if compared objects are equal within a certain margin", function () {
			var a = L.latLng(10, 20);
			var b = L.latLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).to.eql(true);
		});

		it("returns false if compared objects are not equal within a certain margin", function () {
			var a = L.latLng(10, 20);
			var b = L.latLng(10, 23.3);
			expect(a.equals(b)).to.eql(false);
		});

		it('returns false if passed non-valid object', function () {
			var a = L.latLng(10, 20);
			expect(a.equals(null)).to.eql(false);
		});
	});

	describe('#toString', function () {
		it('formats a string', function () {
			var a = L.latLng(10.333333333, 20.2222222);
			expect(a.toString(3)).to.eql('LatLng(10.333, 20.222)');
			expect(a.toString()).to.eql('LatLng(10.333333, 20.222222)');
		});
	});

	describe('#distanceTo', function () {
		it('calculates distance in meters', function () {
			var a = L.latLng(50.5, 30.5);
			var b = L.latLng(50, 1);

			expect(Math.abs(Math.round(a.distanceTo(b) / 1000) - 2084) < 5).to.eql(true);
		});
		it('does not return NaN if input points are equal', function () {
			var a = L.latLng(50.5, 30.5);
			var b = L.latLng(50.5, 30.5);

			expect(a.distanceTo(b)).to.eql(0);
		});
	});

	describe('L.latLng factory', function () {
		it('returns LatLng instance as is', function () {
			var a = L.latLng(50, 30);

			expect(L.latLng(a)).to.eql(a);
		});

		it('accepts an array of coordinates', function () {
			expect(L.latLng([50, 30])).to.eql(L.latLng(50, 30));
			expect(L.latLng([50, 30, 100])).to.eql(L.latLng(50, 30, 100));
		});

		it('creates a LatLng object from two coordinates', function () {
			expect(L.latLng(50, 30)).to.eql(L.latLng(50, 30));
		});

		it('accepts an object with lat/lng', function () {
			expect(L.latLng({lat: 50, lng: 30})).to.eql(L.latLng(50, 30));
		});

		it('accepts an object with lat/lon', function () {
			expect(L.latLng({lat: 50, lon: 30})).to.eql(L.latLng(50, 30));
		});

		it('accepts altitude as third parameter', function () {
			expect(L.latLng(50, 30, 100)).to.eql(L.latLng(50, 30, 100));
		});

		it('accepts an object with alt', function () {
			expect(L.latLng({lat: 50, lng: 30, alt: 100})).to.eql(L.latLng(50, 30, 100));
			expect(L.latLng({lat: 50, lon: 30, alt: 100})).to.eql(L.latLng(50, 30, 100));
		});
	});

	describe('#clone', function () {
		it('should clone attributes', function () {
			var a = L.latLng(50.5, 30.5, 100);
			var b = a.clone();

			expect(b.lat).to.equal(50.5);
			expect(b.lng).to.equal(30.5);
			expect(b.alt).to.equal(100);
		});

		it('should create another reference', function () {
			var a = L.latLng(50.5, 30.5, 100);
			var b = a.clone();

			expect(a === b).to.be(false);
		});
	});
});
