describe('Bounds', function() {
	var a, b, c;

	beforeEach(function() {
		a = new L.Bounds(
			new L.Point(14, 12),
			new L.Point(30, 40));
		b = new L.Bounds([
			new L.Point(20, 12),
			new L.Point(14, 20),
			new L.Point(30, 40)
		]);
		c = new L.Bounds();
	});

	function testConstructor(fn, factory) {
		return function () {
			it('constructs a Bounds instance from the given Points', function () {
				var min = new L.Point(14, 12),
				    max = new L.Point(30, 40),
				    b = fn(min, max);
				expect(b.min).toEqual(min);
				expect(b.max).toEqual(max);
			});

			it('constructs a Bounds instance from the given array of Points', function () {
				var min = new L.Point(14, 12),
				    max = new L.Point(30, 40),
				    b = fn([min, max]);
				expect(b.min).toEqual(min);
				expect(b.max).toEqual(max);
			});

			it('constructs a Bounds instance from the given array of coordinates', function () {
				var min = [14, 12],
				    max = [30, 40],
				    b = fn([min, max]);
				expect(b.min).toEqual(new L.Point(min));
				expect(b.max).toEqual(new L.Point(max));
			});

			it('returns Bounds instance as is', function () {
				expect(fn(a)).toBe(a);
			});

			if (factory) {
				it('returns null or undefined as is', function () {
					expect(fn(undefined)).toBe(undefined);
					expect(fn(null)).toBe(null);
				});
			}
		}
	}

	describe('constructed via new L.Bounds', testConstructor(function(a, b) { return new L.Bounds(a, b); }));
	describe('constructed via L.Bounds', testConstructor(function(a, b) { return L.Bounds(a, b); }, true));
	describe('constructed via L.bounds', testConstructor(function(a, b) { return L.bounds(a, b); }, true));

	describe('#extend', function() {
		it('extends the bounds to contain the given point', function() {
			a.extend(new L.Point(50, 20));
			expect(a.min).toEqual(new L.Point(14, 12));
			expect(a.max).toEqual(new L.Point(50, 40));

			b.extend(new L.Point(25, 50));
			expect(b.min).toEqual(new L.Point(14, 12));
			expect(b.max).toEqual(new L.Point(30, 50));
		});
	});

	describe('#getCenter', function() {
		it('returns the center point', function() {
			expect(a.getCenter()).toEqual(new L.Point(22, 26));
		});
	});

	describe('#contains', function() {
		it('contains other bounds or point', function() {
			a.extend(new L.Point(50, 10));
			expect(a.contains(b)).toBeTruthy();
			expect(b.contains(a)).toBeFalsy();
			expect(a.contains(new L.Point(24, 25))).toBeTruthy();
			expect(a.contains(new L.Point(54, 65))).toBeFalsy();
		});
	});

	describe('#isValid', function() {
		it('returns true if properly set up', function() {
			expect(a.isValid()).toBeTruthy();
		});
		it('returns false if is invalid', function() {
			expect(c.isValid()).toBeFalsy();
		});
		it('returns true if extended', function() {
			c.extend([0, 0]);
			expect(c.isValid()).toBeTruthy();
		});
	});

	describe('#getSize', function () {
		it('returns the size of the bounds as point', function () {
			expect(a.getSize()).toEqual(new L.Point(16, 28));
		});
	});

	describe('#intersects', function () {
		it('returns true if bounds intersect', function () {
			expect(a.intersects(b)).toBe(true);
			expect(a.intersects(new L.Bounds(new L.Point(100, 100), new L.Point(120, 120)))).toEqual(false);
		});
	});
});
