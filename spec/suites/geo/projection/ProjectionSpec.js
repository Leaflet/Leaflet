describe("Projection.Mercator", function () {
	var p = L.Projection.Mercator;

	describe("#project", function () {
		it("projects a center point", function () {
			// edge cases
			expect(p.project(L.latLng(0, 0))).near([0, 0]);
		});

		it("projects the northeast corner of the world", function () {
			expect(p.project(L.latLng(85.0840591556, 180))).near([20037508, 20037508]);
		});

		it("projects the southwest corner of the world", function () {
			expect(p.project(L.latLng(-85.0840591556, -180))).near([-20037508, -20037508]);
		});

		it("projects other points", function () {
			expect(p.project(L.latLng(50, 30))).near([3339584, 6413524]);

			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(p.project(L.latLng(51.9371170300465, 80.11230468750001)))
			        .near([8918060.964088084, 6755099.410887127]);
		});
	});

	describe("#unproject", function () {
		function pr(point) {
			return p.project(p.unproject(point));
		}

		it("unprojects a center point", function () {
			expect(pr(L.point(0, 0))).near([0, 0]);
		});

		it("unprojects pi points", function () {
			expect(pr(L.point(-Math.PI, Math.PI))).near([-Math.PI, Math.PI]);
			expect(pr(L.point(-Math.PI, -Math.PI))).near([-Math.PI, -Math.PI]);

			expect(pr(L.point(0.523598775598, 1.010683188683))).near([0.523598775598, 1.010683188683]);
		});

		it('unprojects other points', function () {
			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(pr(L.point(8918060.964088084, 6755099.410887127)));
		});
	});
});

describe("Projection.SphericalMercator", function () {
	var p = L.Projection.SphericalMercator;

	describe("#project", function () {
		it("projects a center point", function () {
			// edge cases
			expect(p.project(L.latLng(0, 0))).near([0, 0]);
		});

		it("projects the northeast corner of the world", function () {
			expect(p.project(L.latLng(85.0511287798, 180))).near([20037508, 20037508]);
		});

		it("projects the southwest corner of the world", function () {
			expect(p.project(L.latLng(-85.0511287798, -180))).near([-20037508, -20037508]);
		});

		it("projects other points", function () {
			expect(p.project(L.latLng(50, 30))).near([3339584, 6446275]);

			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(p.project(L.latLng(51.9371170300465, 80.11230468750001)))
				.near([8918060.96409, 6788763.38325]);
		});
	});

	describe("#unproject", function () {
		function pr(point) {
			return p.project(p.unproject(point));
		}

		it("unprojects a center point", function () {
			expect(pr(L.point(0, 0))).near([0, 0]);
		});

		it("unprojects pi points", function () {
			expect(pr(L.point(-Math.PI, Math.PI))).near([-Math.PI, Math.PI]);
			expect(pr(L.point(-Math.PI, -Math.PI))).near([-Math.PI, -Math.PI]);

			expect(pr(L.point(0.523598775598, 1.010683188683))).near([0.523598775598, 1.010683188683]);
		});

		it('unprojects other points', function () {
			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(pr(L.point(8918060.964088084, 6755099.410887127)));
		});
	});
});
