xdescribe("Projection.Mercator", function() {
	var p = L.Projection.Mercator;
	
	beforeEach(function() {
		function almostEqual(a, b, p) {
			return Math.abs(a - b) <= (p || 1.0E-12);
		};
		this.addMatchers({
			toAlmostEqual: function(expected, margin) {
				var p1 = this.actual,
					p2 = expected;
				return almostEqual(p1.x, p2.x, margin) && almostEqual(p1.y, p2.y, margin);
			}
		});
	});
	

	describe("#project", function() {
		it("should do projection properly", function() {
			//edge cases
			expect(p.project(new L.LatLng(0, 0))).toAlmostEqual(new L.Point(0, 0));
			expect(p.project(new L.LatLng(90, 180))).toAlmostEqual(new L.Point(-Math.PI, Math.PI));
			expect(p.project(new L.LatLng(-90, -180))).toAlmostEqual(new L.Point(-Math.PI, -Math.PI));
			
			expect(p.project(new L.LatLng(50, 30))).toAlmostEqual(new L.Point(0.523598775598, 1.010683188683));
		});
	});

	describe("#unproject", function() {
		it("should do unprojection properly", function() {
			function pr(point) {
				return p.project(p.unproject(point));
			}
			
			expect(pr(new L.Point(0, 0))).toAlmostEqual(new L.Point(0, 0));
			expect(pr(new L.Point(-Math.PI, Math.PI))).toAlmostEqual(new L.Point(-Math.PI, Math.PI));
			expect(pr(new L.Point(-Math.PI, -Math.PI))).toAlmostEqual(new L.Point(-Math.PI, -Math.PI));
			
			expect(pr(new L.Point(0.523598775598, 1.010683188683))).toAlmostEqual(new L.Point(0.523598775598, 1.010683188683));
		});
	});
});

describe("Projection.SphericalMercator", function() {
	var p = L.Projection.SphericalMercator;

	beforeEach(function() {
		function almostEqual(a, b, p) {
			return Math.abs(a - b) <= (p || L.LatLng.MAX_MARGIN);
		}
		this.addMatchers({
			toAlmostEqual: function(expected, margin) {
				var p1 = this.actual,
					p2 = expected;
				return almostEqual(p1.x, p2.x, margin) && almostEqual(p1.y, p2.y, margin);
			}
		});
	});


	describe("#project", function() {
		it("should do default projection properly", function() {
			expect(p.project(new L.LatLng(0, 0))).toAlmostEqual(new L.Point(0, 0));
			expect(p.project(new L.LatLng(90, 180))).toAlmostEqual(new L.Point(Math.PI, Math.PI));
			expect(p.project(new L.LatLng(-90, -180))).toAlmostEqual(new L.Point(-Math.PI, -Math.PI));

			expect(p.project(new L.LatLng(50, 30))).toAlmostEqual(new L.Point(0.523598775598, 1.010683188683));
		});
	});

	describe("#magnetization", function() {
		it("should magnetize negative Lng with a positive magnet close to date line", function() {
			var magnetPoint = new L.Point(3, 1);
			expect(p.project(new L.LatLng(0, -45), magnetPoint)).toAlmostEqual(new L.Point(Math.PI * 7/4, 0));
			expect(p.project(new L.LatLng(0, -90), magnetPoint)).toAlmostEqual(new L.Point(Math.PI * 3/2, 0));
			expect(p.project(new L.LatLng(0, -135), magnetPoint)).toAlmostEqual(new L.Point(Math.PI * 5/4, 0));
			expect(p.project(new L.LatLng(0, -180), magnetPoint)).toAlmostEqual(new L.Point(Math.PI, 0));
		});

		it("should magnetize negative Lng with a positive magnet onto date line", function() {
			var magnetPoint = new L.Point(Math.PI, 1);
			expect(p.project(new L.LatLng(0, -135), magnetPoint)).toAlmostEqual(new L.Point(Math.PI * 5/4, 0));
		});

		it("should not magnetize negative Lng with a negative magnet close to date line", function() {
			var magnetPoint = new L.Point(-3, 1);
			expect(p.project(new L.LatLng(0, -135), magnetPoint)).toAlmostEqual(p.project(new L.LatLng(0, -135)));
		});

		it("should not magnetize negative Lng with a negative magnet onto date line", function() {
			var magnetPoint = new L.Point(-Math.PI, 1);
			expect(p.project(new L.LatLng(0, -135), magnetPoint)).toAlmostEqual(p.project(new L.LatLng(0, -135)));
		});

		it("should magnetize positive Lng with a negative magnet close to date line", function() {
			var magnetPoint = new L.Point(-3, 1);
			expect(p.project(new L.LatLng(0, 135), magnetPoint)).toAlmostEqual(new L.Point(-Math.PI * 5/4, 0));
		});

	});
});