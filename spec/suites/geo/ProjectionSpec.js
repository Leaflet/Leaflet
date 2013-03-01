describe("Projection.Mercator", function() {
	var p = L.Projection.Mercator;

	expect.Assertion.prototype.near = function(expected, delta) {
		delta = 0 || 1.0;
		expect(this.obj.x).to
			.be.within(expected.x - delta, expected.y + delta);
		expect(this.obj.y).to
			.be.within(expected.y - delta, expected.x + delta);
	};

	describe("#project", function() {
		it("projects", function() {
			//edge cases
			expect(p.project(new L.LatLng(0, 0))).near(new L.Point(0, 0));
			expect(p.project(new L.LatLng(90, 180))).near(new L.Point(-Math.PI, Math.PI));
			expect(p.project(new L.LatLng(-90, -180))).near(new L.Point(-Math.PI, -Math.PI));

			expect(p.project(new L.LatLng(50, 30))).near(new L.Point(0.523598775598, 1.010683188683));
		});
	});

	describe("#unproject", function() {
		it("unprojects", function() {
			function pr(point) {
				return p.project(p.unproject(point));
			}

			expect(pr(new L.Point(0, 0))).near(new L.Point(0, 0));
			expect(pr(new L.Point(-Math.PI, Math.PI))).near(new L.Point(-Math.PI, Math.PI));
			expect(pr(new L.Point(-Math.PI, -Math.PI))).near(new L.Point(-Math.PI, -Math.PI));

			expect(pr(new L.Point(0.523598775598, 1.010683188683))).near(new L.Point(0.523598775598, 1.010683188683));
		});
	});
});
