import {expect} from 'chai';
import {LatLng} from 'leaflet';

describe('LatLng', () => {
	describe('constructor', () => {
		it('sets lat and lng', () => {
			const a = new LatLng(25, 74);
			expect(a.lat).to.eql(25);
			expect(a.lng).to.eql(74);

			const b = new LatLng(-25, -74);
			expect(b.lat).to.eql(-25);
			expect(b.lng).to.eql(-74);
		});

		it('throws an error if invalid lat or lng', () => {
			expect(() => {
				new LatLng(NaN, NaN);
			}).to.throw();
		});

		it('does not set altitude if undefined', () => {
			const a = new LatLng(25, 74);
			expect(typeof a.alt).to.eql('undefined');
		});

		it('sets altitude', () => {
			const a = new LatLng(25, 74, 50);
			expect(a.alt).to.eql(50);

			const b = new LatLng(-25, -74, -50);
			expect(b.alt).to.eql(-50);
		});
	});

	describe('#equals', () => {
		it('returns true if compared objects are equal within a certain margin', () => {
			const a = new LatLng(10, 20);
			const b = new LatLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).to.eql(true);
		});

		it('returns false if compared objects are not equal within a certain margin', () => {
			const a = new LatLng(10, 20);
			const b = new LatLng(10, 23.3);
			expect(a.equals(b)).to.eql(false);
		});

		it('returns false if passed non-valid object', () => {
			const a = new LatLng(10, 20);
			expect(a.equals(null)).to.eql(false);
		});
	});

	describe('#toString', () => {
		it('formats a string', () => {
			const a = new LatLng(10.333333333, 20.2222222);
			expect(a.toString(3)).to.eql('LatLng(10.333, 20.222)');
			expect(a.toString()).to.eql('LatLng(10.333333, 20.222222)');
		});
	});

	describe('#distanceTo', () => {
		it('calculates distance in meters', () => {
			const a = new LatLng(50.5, 30.5);
			const b = new LatLng(50, 1);

			expect(Math.abs(Math.round(a.distanceTo(b) / 1000) - 2084) < 5).to.eql(true);
		});
		it('does not return NaN if input points are equal', () => {
			const a = new LatLng(50.5, 30.5);
			const b = new LatLng(50.5, 30.5);

			expect(a.distanceTo(b)).to.eql(0);
		});
	});

	describe('latLng factory', () => {
		it('returns LatLng instance as is', () => {
			const a = new LatLng(50, 30);

			expect(new LatLng(a)).to.eql(a);
		});

		it('accepts an array of coordinates', () => {
			expect(new LatLng([])).to.eql(null);
			expect(new LatLng([50])).to.eql(null);
			expect(new LatLng([50, 30])).to.eql(new LatLng(50, 30));
			expect(new LatLng([50, 30, 100])).to.eql(new LatLng(50, 30, 100));
		});

		it('passes null or undefined as is', () => {
			expect(new LatLng(undefined)).to.eql(undefined);
			expect(new LatLng(null)).to.eql(null);
		});

		it('creates a LatLng object from two coordinates', () => {
			expect(new LatLng(50, 30)).to.eql(new LatLng(50, 30));
		});

		it('accepts an object with lat/lng', () => {
			expect(new LatLng({lat: 50, lng: 30})).to.eql(new LatLng(50, 30));
		});

		it('accepts an object with lat/lon', () => {
			expect(new LatLng({lat: 50, lon: 30})).to.eql(new LatLng(50, 30));
		});

		it('returns null if lng not specified', () => {
			expect(new LatLng(50)).to.equal(null);
		});

		it('accepts altitude as third parameter', () => {
			expect(new LatLng(50, 30, 100)).to.eql(new LatLng(50, 30, 100));
		});

		it('accepts an object with alt', () => {
			expect(new LatLng({lat: 50, lng: 30, alt: 100})).to.eql(new LatLng(50, 30, 100));
			expect(new LatLng({lat: 50, lon: 30, alt: 100})).to.eql(new LatLng(50, 30, 100));
		});
	});

	describe('#clone', () => {
		it('should clone attributes', () => {
			const a = new LatLng(50.5, 30.5, 100);
			const b = a.clone();

			expect(b.lat).to.equal(50.5);
			expect(b.lng).to.equal(30.5);
			expect(b.alt).to.equal(100);
		});

		it('should create another reference', () => {
			const a = new LatLng(50.5, 30.5, 100);
			const b = a.clone();

			expect(a === b).to.be.false;
		});
	});
});
