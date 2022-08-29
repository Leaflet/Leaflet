describe('Bounds', function () {
	var a, b, c;

	beforeEach(function () {
		a = L.bounds(
			[14, 12], // left, top
			[30, 40]); // right, bottom
		b = L.bounds([
			[20, 12], // center, top
			[14, 20], // left, middle
			[30, 40] // right, bottom
		]);
		c = new L.Bounds();
	});

	describe('constructor', function () {
		it('creates bounds with proper min & max on (Point, Point)', function () {
			expect(a.min).to.eql(L.point(14, 12));
			expect(a.max).to.eql(L.point(30, 40));
		});

		it('creates bounds with proper min & max on (Point[])', function () {
			expect(b.min).to.eql(L.point(14, 12));
			expect(b.max).to.eql(L.point(30, 40));
		});
	});

	describe('#extend', function () {
		it('extends the bounds to contain the given point', function () {
			a.extend([50, 20]);
			expect(a.min).to.eql(L.point(14, 12));
			expect(a.max).to.eql(L.point(50, 40));

			b.extend([25, 50]);
			expect(b.min).to.eql(L.point(14, 12));
			expect(b.max).to.eql(L.point(30, 50));
		});

		it('extends the bounds by given bounds', function () {
			a.extend([20, 50]);
			expect(a.max).to.eql(L.point(30, 50));
		});

		it('extends the bounds by given bounds', function () {
			a.extend([[20, 50], [8, 40]]);
			expect(a.getBottomLeft()).to.eql(L.point(8, 50));
		});

		it('extends the bounds by undefined', function () {
			expect(a.extend()).to.eql(a);
		});

		it('extends the bounds by raw object', function () {
			a.extend({x: 20, y: 50});
			expect(a.max).to.eql(L.point(30, 50));
		});

		it('extend the bounds by an empty bounds object', function () {
			expect(a.extend(L.bounds())).to.eql(a);
		});
	});

	describe('#getCenter', function () {
		it('returns the center point', function () {
			expect(a.getCenter()).to.eql(L.point(22, 26));
		});
	});

	describe('#pad', function () {
		it('pads the bounds by a given ratio', function () {
			var bounds = a.pad(0.5);
			expect(bounds).to.eql(L.bounds([[6, -2], [38, 54]]));
		});
	});

	describe('#contains', function () {
		it('contains other bounds or point', function () {
			a.extend([50, 10]);
			expect(a.contains(b)).to.be.ok();
			expect(b.contains(a)).to.not.be.ok();
			expect(a.contains([24, 25])).to.be.ok();
			expect(a.contains([54, 65])).to.not.be.ok();
		});
	});

	describe('#isValid', function () {
		it('returns true if properly set up', function () {
			expect(a.isValid()).to.be.ok();
		});

		it('returns false if is invalid', function () {
			expect(c.isValid()).to.not.be.ok();
		});

		it('returns true if extended', function () {
			c.extend([0, 0]);
			expect(c.isValid()).to.be.ok();
		});
	});

	describe('#getSize', function () {
		it('returns the size of the bounds as point', function () {
			expect(a.getSize()).to.eql(L.point(16, 28));
		});
	});

	describe('#intersects', function () {
		it('returns true if bounds intersect', function () {
			expect(a.intersects(b)).to.be(true);
		});

		it('two bounds intersect if they have at least one point in common', function () {
			expect(a.intersects([[14, 12], [6, 5]])).to.be(true);
		});

		it('returns false if bounds not intersect', function () {
			expect(a.intersects([[100, 100], [120, 120]])).to.eql(false);
		});
	});

	describe('#overlaps', function () {
		it('returns true if bounds overlaps', function () {
			expect(a.overlaps(b)).to.be(true);
		});

		it('two bounds overlaps if their intersection is an area', function () {
			// point in common
			expect(a.overlaps([[14, 12], [6, 5]])).to.be(false);
			// matching boundary
			expect(a.overlaps([[30, 12], [35, 25]])).to.be(false);
		});

		it('returns false if bounds not overlaps', function () {
			expect(a.overlaps([[100, 100], [120, 120]])).to.eql(false);
		});
	});

	describe('#getBottomLeft', function () {
		it('returns the proper bounds bottom-left value', function () {
			expect(a.getBottomLeft()).to.eql(L.point(14, 40)); // left, bottom
		});
	});

	describe('#getTopRight', function () {
		it('returns the proper bounds top-right value', function () {
			expect(a.getTopRight()).to.eql(L.point(30, 12)); // right, top
		});
	});

	describe('#getTopLeft', function () {
		it('returns the proper bounds top-left value', function () {
			expect(a.getTopLeft()).to.eql(L.point(14, 12)); // left, top
		});
	});

	describe('#getBottomRight', function () {
		it('returns the proper bounds bottom-right value', function () {
			expect(a.getBottomRight()).to.eql(L.point(30, 40)); // left, bottom
		});
	});

	describe('L.bounds factory', function () {
		it('creates bounds from array of number arrays', function () {
			var bounds = L.bounds([[14, 12], [30, 40]]);
			expect(bounds).to.eql(a);
		});
	});

	describe('#equals', function () {
		it('returns true if bounds equal', function () {
			expect(a.equals([[14, 12], [30, 40]])).to.eql(true);
			expect(a.equals([[14, 13], [30, 40]])).to.eql(false);
			expect(a.equals(null)).to.eql(false);
		});
	});
});
