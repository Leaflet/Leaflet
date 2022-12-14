describe('Point', () => {
	describe('constructor', () => {
		it('creates a point with the given x and y', () => {
			const p = L.point(1.5, 2.5);
			expect(p.x).to.eql(1.5);
			expect(p.y).to.eql(2.5);
		});

		it('rounds the given x and y if the third argument is true', () => {
			const p = L.point(1.3, 2.7, true);
			expect(p.x).to.eql(1);
			expect(p.y).to.eql(3);
		});
	});

	describe('#subtract', () => {
		it('subtracts the given point from this one', () => {
			const a = L.point(50, 30),
			    b = L.point(20, 10);
			expect(a.subtract(b)).to.eql(L.point(30, 20));
		});
	});

	describe('#add', () => {
		it('adds given point to this one', () => {
			expect(L.point(50, 30).add(L.point(20, 10))).to.eql(L.point(70, 40));
		});
	});

	describe('#divideBy', () => {
		it('divides this point by the given amount', () => {
			expect(L.point(50, 30).divideBy(5)).to.eql(L.point(10, 6));
		});
	});

	describe('#multiplyBy', () => {
		it('multiplies this point by the given amount', () => {
			expect(L.point(50, 30).multiplyBy(2)).to.eql(L.point(100, 60));
		});
	});

	describe('#floor', () => {
		it('returns a new point with floored coordinates', () => {
			expect(L.point(50.56, 30.123).floor()).to.eql(L.point(50, 30));
			expect(L.point(-50.56, -30.123).floor()).to.eql(L.point(-51, -31));
		});
	});

	describe('#trunc', () => {
		it('returns a new point with truncated coordinates', () => {
			expect(L.point(50.56, 30.123).trunc()).to.eql(L.point(50, 30));
			expect(L.point(-50.56, -30.123).trunc()).to.eql(L.point(-50, -30));
		});
	});

	describe('#distanceTo', () => {
		it('calculates distance between two points', () => {
			const p1 = L.point(0, 30);
			const p2 = L.point(40, 0);
			expect(p1.distanceTo(p2)).to.eql(50.0);
		});
	});

	describe('#equals', () => {
		it('returns true if points are equal', () => {
			const p1 = L.point(20.4, 50.12);
			const p2 = L.point(20.4, 50.12);
			const p3 = L.point(20.5, 50.13);

			expect(p1.equals(p2)).to.be(true);
			expect(p1.equals(p3)).to.be(false);
		});
	});

	describe('#contains', () => {
		it('returns true if the point is bigger in absolute dimensions than the passed one', () => {
			const p1 = L.point(50, 30),
			    p2 = L.point(-40, 20),
			    p3 = L.point(60, -20),
			    p4 = L.point(-40, -40);

			expect(p1.contains(p2)).to.be(true);
			expect(p1.contains(p3)).to.be(false);
			expect(p1.contains(p4)).to.be(false);
		});
	});

	describe('#toString', () => {
		it('formats a string out of point coordinates', () => {
			expect(`${L.point(50, 30)}`).to.eql('Point(50, 30)');
			expect(`${L.point(50.1234567, 30.1234567)}`).to.eql('Point(50.123457, 30.123457)');
		});
	});

	describe('L.point factory', () => {
		it('leaves L.Point instances as is', () => {
			const p = L.point(50, 30);
			expect(L.point(p)).to.be(p);
		});

		it('creates a point out of three arguments', () => {
			expect(L.point(50.1, 30.1, true)).to.eql(L.point(50, 30));
		});

		it('creates a point from an array of coordinates', () => {
			expect(L.point([50, 30])).to.eql(L.point(50, 30));
		});

		it('creates a point from an object with x and y properties', () => {
			expect(L.point({x: 50, y: 30})).to.eql(L.point(50, 30));
		});

		it('does not fail on invalid arguments', () => {
			expect(L.point(undefined)).to.be(undefined);
			expect(L.point(null)).to.be(null);
		});
	});
});
