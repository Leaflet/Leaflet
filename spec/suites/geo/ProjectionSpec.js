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