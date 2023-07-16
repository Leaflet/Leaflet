import {LatLngBounds, latLngBounds, latLng} from 'leaflet';

describe('LatLngBounds', () => {
	let a, c;

	beforeEach(() => {
		a = latLngBounds(
			latLng(14, 12),
			latLng(30, 40)
		);
		c = latLngBounds();
	});

	describe('constructor', () => {
		it('instantiates either passing two latlngs or an array of latlngs', () => {
			const b = latLngBounds([
				latLng(14, 12),
				latLng(30, 40)
			]);
			expect(b).to.eql(a);
			expect(b.getNorthWest()).to.eql(latLng(30, 12));
		});

		it('returns an empty bounds when not argument is given', () => {
			const bounds = latLngBounds();
			expect(bounds instanceof LatLngBounds).to.be.true;
		});

		it('returns an empty bounds when not argument is given to factory', () => {
			const bounds = latLngBounds();
			expect(bounds instanceof LatLngBounds).to.be.true;
		});

	});

	describe('#extend', () => {
		it('extends the bounds by a given point', () => {
			a.extend(latLng(20, 50));
			expect(a.getNorthEast()).to.eql(latLng(30, 50));
		});

		it('extends the bounds by given bounds', () => {
			a.extend([[20, 50], [8, 40]]);
			expect(a.getSouthEast()).to.eql(latLng(8, 50));
		});

		it('extends the bounds by undefined', () => {
			expect(a.extend()).to.eql(a);
		});

		it('extends the bounds by raw object', () => {
			a.extend({lat: 20, lng: 50});
			expect(a.getNorthEast()).to.eql(latLng(30, 50));
		});

		it('extend the bounds by an empty bounds object', () => {
			expect(a.extend(latLngBounds())).to.eql(a);
		});
	});

	describe('#getCenter', () => {
		it('returns the bounds center', () => {
			expect(a.getCenter()).to.eql(latLng(22, 26));
		});
	});

	describe('#pad', () => {
		it('pads the bounds by a given ratio', () => {
			const b = a.pad(0.5);

			expect(b).to.eql(latLngBounds([[6, -2], [38, 54]]));
		});
	});

	describe('#equals', () => {
		it('returns true if bounds equal', () => {
			expect(a.equals([[14, 12], [30, 40]])).to.eql(true);
			expect(a.equals([[14, 13], [30, 40]])).to.eql(false);
			expect(a.equals(null)).to.eql(false);
		});

		it('returns true if compared objects are equal within a certain margin', () => {
			expect(a.equals([[15, 11], [29, 41]], 1)).to.eql(true);
		});

		it('returns false if compared objects are not equal within a certain margin', () => {
			expect(a.equals([[15, 11], [29, 41]], 0.5)).to.eql(false);
		});
	});

	describe('#isValid', () => {
		it('returns true if properly set up', () => {
			expect(a.isValid()).to.be.true;
		});

		it('returns false if is invalid', () => {
			expect(c.isValid()).to.be.false;
		});

		it('returns true if extended', () => {
			c.extend([0, 0]);
			expect(c.isValid()).to.be.true;
		});
	});

	describe('#getWest', () => {
		it('returns a proper bbox west value', () => {
			expect(a.getWest()).to.eql(12);
		});
	});

	describe('#getSouth', () => {
		it('returns a proper bbox south value', () => {
			expect(a.getSouth()).to.eql(14);
		});
	});

	describe('#getEast', () => {
		it('returns a proper bbox east value', () => {
			expect(a.getEast()).to.eql(40);
		});
	});

	describe('#getNorth', () => {
		it('returns a proper bbox north value', () => {
			expect(a.getNorth()).to.eql(30);
		});
	});

	describe('#toBBoxString', () => {
		it('returns a proper left,bottom,right,top bbox', () => {
			expect(a.toBBoxString()).to.eql('12,14,40,30');
		});
	});

	describe('#getNorthWest', () => {
		it('returns a proper north-west LatLng', () => {
			expect(a.getNorthWest()).to.eql(latLng(a.getNorth(), a.getWest()));
		});
	});

	describe('#getSouthEast', () => {
		it('returns a proper south-east LatLng', () => {
			expect(a.getSouthEast()).to.eql(latLng(a.getSouth(), a.getEast()));
		});
	});

	describe('#contains', () => {
		it('returns true if contains latlng point as array', () => {
			expect(a.contains([16, 20])).to.eql(true);
			expect(latLngBounds(a).contains([5, 20])).to.eql(false);
		});

		it('returns true if contains latlng point as {lat:, lng:} object', () => {
			expect(a.contains({lat: 16, lng: 20})).to.eql(true);
			expect(latLngBounds(a).contains({lat: 5, lng: 20})).to.eql(false);
		});

		it('returns true if contains latlng point as LatLng instance', () => {
			expect(a.contains(latLng([16, 20]))).to.eql(true);
			expect(latLngBounds(a).contains(latLng([5, 20]))).to.eql(false);
		});

		it('returns true if contains bounds', () => {
			expect(a.contains([[16, 20], [20, 40]])).to.eql(true);
			expect(a.contains([[16, 50], [8, 40]])).to.eql(false);
		});
	});

	describe('#intersects', () => {
		it('returns true if intersects the given bounds', () => {
			expect(a.intersects([[16, 20], [50, 60]])).to.eql(true);
			expect(a.contains([[40, 50], [50, 60]])).to.eql(false);
		});

		it('returns true if just touches the boundary of the given bounds', () => {
			expect(a.intersects([[25, 40], [55, 50]])).to.eql(true);
		});
	});

	describe('#overlaps', () => {
		it('returns true if overlaps the given bounds', () => {
			expect(a.overlaps([[16, 20], [50, 60]])).to.eql(true);
		});

		it('returns false if just touches the boundary of the given bounds', () => {
			expect(a.overlaps([[25, 40], [55, 50]])).to.eql(false);
		});
	});
});
