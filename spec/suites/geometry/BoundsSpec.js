import {expect} from 'chai';
import {Bounds, Point} from 'leaflet';

describe('Bounds', () => {
	let a, b, c;

	beforeEach(() => {
		a = new Bounds(
			[14, 12], // left, top
			[30, 40]); // right, bottom
		b = new Bounds([
			[20, 12], // center, top
			[14, 20], // left, middle
			[30, 40] // right, bottom
		]);
		c = new Bounds();
	});

	describe('constructor', () => {
		it('creates bounds with proper min & max on (Point, Point)', () => {
			expect(a.min).to.eql(new Point(14, 12));
			expect(a.max).to.eql(new Point(30, 40));
		});

		it('creates bounds with proper min & max on (Point[])', () => {
			expect(b.min).to.eql(new Point(14, 12));
			expect(b.max).to.eql(new Point(30, 40));
		});
	});

	describe('#extend', () => {
		it('extends the bounds to contain the given point', () => {
			a.extend([50, 20]);
			expect(a.min).to.eql(new Point(14, 12));
			expect(a.max).to.eql(new Point(50, 40));

			b.extend([25, 50]);
			expect(b.min).to.eql(new Point(14, 12));
			expect(b.max).to.eql(new Point(30, 50));
		});

		it('extends the bounds by given bounds', () => {
			a.extend([20, 50]);
			expect(a.max).to.eql(new Point(30, 50));
		});

		it('extends the bounds by given bounds', () => {
			a.extend([[20, 50], [8, 40]]);
			expect(a.getBottomLeft()).to.eql(new Point(8, 50));
		});

		it('extends the bounds by undefined', () => {
			expect(a.extend()).to.eql(a);
		});

		it('extends the bounds by raw object', () => {
			a.extend({x: 20, y: 50});
			expect(a.max).to.eql(new Point(30, 50));
		});

		it('extend the bounds by an empty bounds object', () => {
			expect(a.extend(new Bounds())).to.eql(a);
		});
	});

	describe('#getCenter', () => {
		it('returns the center point', () => {
			expect(a.getCenter()).to.eql(new Point(22, 26));
		});
	});

	describe('#pad', () => {
		it('pads the bounds by a given ratio', () => {
			expect(a.pad(0.5)).to.eql(new Bounds([[6, -2], [38, 54]]));
		});
	});

	describe('#contains', () => {
		it('contains other bounds or point', () => {
			a.extend([50, 10]);
			expect(a.contains(b)).to.be.true;
			expect(b.contains(a)).to.be.false;
			expect(a.contains([24, 25])).to.be.true;
			expect(a.contains([54, 65])).to.be.false;
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

	describe('#getSize', () => {
		it('returns the size of the bounds as point', () => {
			expect(a.getSize()).to.eql(new Point(16, 28));
		});
	});

	describe('#intersects', () => {
		it('returns true if bounds intersect', () => {
			expect(a.intersects(b)).to.be.true;
		});

		it('two bounds intersect if they have at least one point in common', () => {
			expect(a.intersects([[14, 12], [6, 5]])).to.be.true;
		});

		it('returns false if bounds not intersect', () => {
			expect(a.intersects([[100, 100], [120, 120]])).to.eql(false);
		});
	});

	describe('#overlaps', () => {
		it('returns true if bounds overlaps', () => {
			expect(a.overlaps(b)).to.be.true;
		});

		it('two bounds overlaps if their intersection is an area', () => {
			// point in common
			expect(a.overlaps([[14, 12], [6, 5]])).to.be.false;
			// matching boundary
			expect(a.overlaps([[30, 12], [35, 25]])).to.be.false;
		});

		it('returns false if bounds not overlaps', () => {
			expect(a.overlaps([[100, 100], [120, 120]])).to.eql(false);
		});
	});

	describe('#getBottomLeft', () => {
		it('returns the proper bounds bottom-left value', () => {
			expect(a.getBottomLeft()).to.eql(new Point(14, 40)); // left, bottom
		});
	});

	describe('#getTopRight', () => {
		it('returns the proper bounds top-right value', () => {
			expect(a.getTopRight()).to.eql(new Point(30, 12)); // right, top
		});
	});

	describe('#getTopLeft', () => {
		it('returns the proper bounds top-left value', () => {
			expect(a.getTopLeft()).to.eql(new Point(14, 12)); // left, top
		});
	});

	describe('#getBottomRight', () => {
		it('returns the proper bounds bottom-right value', () => {
			expect(a.getBottomRight()).to.eql(new Point(30, 40)); // left, bottom
		});
	});

	describe('bounds factory', () => {
		it('creates bounds from array of number arrays', () => {
			expect(new Bounds([[14, 12], [30, 40]])).to.eql(a);
		});
	});

	describe('#equals', () => {
		it('returns true if bounds equal', () => {
			expect(a.equals([[14, 12], [30, 40]])).to.eql(true);
			expect(a.equals([[14, 13], [30, 40]])).to.eql(false);
			expect(a.equals(null)).to.eql(false);
		});
	});
});
