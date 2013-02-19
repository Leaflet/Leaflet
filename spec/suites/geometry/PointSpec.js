describe("Point", function() {

	describe('constructor', function() {

		it("creates a point with the given x and y", function() {
			var p = new L.Point(1.5, 2.5);
			expect(p.x).toEqual(1.5);
			expect(p.y).toEqual(2.5);
		});

		it("rounds the given x and y if the third argument is true", function() {
			var p = new L.Point(1.3, 2.7, true);
			expect(p.x).toEqual(1);
			expect(p.y).toEqual(3);
		});
	});

	describe('#subtract', function() {
		it('subtracts the given point from this one', function() {
			var a = new L.Point(50, 30),
				b = new L.Point(20, 10);
			expect(a.subtract(b)).toEqual(new L.Point(30, 20));
		});
	});

	describe('#add', function() {
		it('adds given point to this one', function() {
			expect(new L.Point(50, 30).add(new L.Point(20, 10))).toEqual(new L.Point(70, 40));
		});
	});

	describe('#divideBy', function() {
		it('divides this point by the given amount', function() {
			expect(new L.Point(50, 30).divideBy(5)).toEqual(new L.Point(10, 6));
		});
	});

	describe('#multiplyBy', function() {
		it('multiplies this point by the given amount', function() {
			expect(new L.Point(50, 30).multiplyBy(2)).toEqual(new L.Point(100, 60));
		});
	});

	describe('#floor', function () {
		it('returns a new point with floored coordinates', function () {
			expect(new L.Point(50.56, 30.123).floor()).toEqual(new L.Point(50, 30));
		});
	});

	describe('#distanceTo', function () {
		it('calculates distance between two points', function () {
			var p1 = new L.Point(0, 30);
			var p2 = new L.Point(40, 0);
			expect(p1.distanceTo(p2)).toEqual(50.0);
		});
	});

	describe('#equals', function () {
		it('returns true if points are equal', function () {
			var p1 = new L.Point(20.4, 50.12);
			var p2 = new L.Point(20.4, 50.12);
			var p3 = new L.Point(20.5, 50.13);

			expect(p1.equals(p2)).toBe(true);
			expect(p1.equals(p3)).toBe(false);
		});
	});

	describe('#toString', function () {
		it('formats a string out of point coordinates', function () {
			expect(new L.Point(50, 30) + '').toEqual('Point(50, 30)');
		});
	});

	describe('L.point factory', function () {
		it('leaves L.Point instances as is', function () {
			var p = new L.Point(50, 30);
			expect(L.point(p)).toBe(p);
		});
		it('creates a point out of three arguments', function () {
			expect(L.point(50.1, 30.1, true)).toEqual(new L.Point(50, 30));
		});
		it('creates a point from an array of coordinates', function () {
			expect(L.point([50, 30])).toEqual(new L.Point(50, 30));
		});
		it('does not fail on invalid arguments', function () {
			expect(L.point(undefined)).toBe(undefined);
			expect(L.point(null)).toBe(null);
		});
	});
});
