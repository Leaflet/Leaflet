describe('LatLng', () => {
	describe('constructor', () => {
		it('sets lat and lng', () => {
			const a = L.latLng(25, 74);
			expect(a.lat).to.eql(25);
			expect(a.lng).to.eql(74);

			const b = L.latLng(-25, -74);
			expect(b.lat).to.eql(-25);
			expect(b.lng).to.eql(-74);
		});

		it('throws an error if invalid lat or lng', () => {
			expect(() => {
				L.latLng(NaN, NaN);
			}).to.throwError();
		});

		it('does not set altitude if undefined', () => {
			const a = L.latLng(25, 74);
			expect(typeof a.alt).to.eql('undefined');
		});

		it('sets altitude', () => {
			const a = L.latLng(25, 74, 50);
			expect(a.alt).to.eql(50);

			const b = L.latLng(-25, -74, -50);
			expect(b.alt).to.eql(-50);
		});
	});

	describe('#equals', () => {
		it('returns true if compared objects are equal within a certain margin', () => {
			const a = L.latLng(10, 20);
			const b = L.latLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).to.eql(true);
		});

		it('returns false if compared objects are not equal within a certain margin', () => {
			const a = L.latLng(10, 20);
			const b = L.latLng(10, 23.3);
			expect(a.equals(b)).to.eql(false);
		});

		it('returns false if passed non-valid object', () => {
			const a = L.latLng(10, 20);
			expect(a.equals(null)).to.eql(false);
		});
	});

	describe('#toString', () => {
		it('formats a string', () => {
			const a = L.latLng(10.333333333, 20.2222222);
			expect(a.toString(3)).to.eql('LatLng(10.333, 20.222)');
			expect(a.toString()).to.eql('LatLng(10.333333, 20.222222)');
		});
	});

	describe('#distanceTo', () => {
		it('calculates distance in meters', () => {
			const a = L.latLng(50.5, 30.5);
			const b = L.latLng(50, 1);

			expect(Math.abs(Math.round(a.distanceTo(b) / 1000) - 2084) < 5).to.eql(true);
		});
		it('does not return NaN if input points are equal', () => {
			const a = L.latLng(50.5, 30.5);
			const b = L.latLng(50.5, 30.5);

			expect(a.distanceTo(b)).to.eql(0);
		});
	});

	describe('L.latLng factory', () => {
		it('returns LatLng instance as is', () => {
			const a = L.latLng(50, 30);

			expect(L.latLng(a)).to.eql(a);
		});

		it('accepts an array of coordinates', () => {
			expect(L.latLng([])).to.eql(null);
			expect(L.latLng([50])).to.eql(null);
			expect(L.latLng([50, 30])).to.eql(L.latLng(50, 30));
			expect(L.latLng([50, 30, 100])).to.eql(L.latLng(50, 30, 100));
		});

		it('passes null or undefined as is', () => {
			expect(L.latLng(undefined)).to.eql(undefined);
			expect(L.latLng(null)).to.eql(null);
		});

		it('creates a LatLng object from two coordinates', () => {
			expect(L.latLng(50, 30)).to.eql(L.latLng(50, 30));
		});

		it('accepts an object with lat/lng', () => {
			expect(L.latLng({lat: 50, lng: 30})).to.eql(L.latLng(50, 30));
		});

		it('accepts an object with lat/lon', () => {
			expect(L.latLng({lat: 50, lon: 30})).to.eql(L.latLng(50, 30));
		});

		it('returns null if lng not specified', () => {
			expect(L.latLng(50)).to.be(null);
		});

		it('accepts altitude as third parameter', () => {
			expect(L.latLng(50, 30, 100)).to.eql(L.latLng(50, 30, 100));
		});

		it('accepts an object with alt', () => {
			expect(L.latLng({lat: 50, lng: 30, alt: 100})).to.eql(L.latLng(50, 30, 100));
			expect(L.latLng({lat: 50, lon: 30, alt: 100})).to.eql(L.latLng(50, 30, 100));
		});
	});

	describe('#clone', () => {
		it('should clone attributes', () => {
			const a = L.latLng(50.5, 30.5, 100);
			const b = a.clone();

			expect(b.lat).to.equal(50.5);
			expect(b.lng).to.equal(30.5);
			expect(b.alt).to.equal(100);
		});

		it('should create another reference', () => {
			const a = L.latLng(50.5, 30.5, 100);
			const b = a.clone();

			expect(a === b).to.be(false);
		});
	});
});
