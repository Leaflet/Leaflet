import {Projection, latLng, point} from 'leaflet';

describe('Projection.Mercator', () => {
	const p = Projection.Mercator;

	describe('#project', () => {
		it('projects a center point', () => {
			// edge cases
			expect(p.project(latLng(0, 0))).near([0, 0]);
		});

		it('projects the northeast corner of the world', () => {
			expect(p.project(latLng(85.0840591556, 180))).near([20037508, 20037508]);
		});

		it('projects the southwest corner of the world', () => {
			expect(p.project(latLng(-85.0840591556, -180))).near([-20037508, -20037508]);
		});

		it('projects other points', () => {
			expect(p.project(latLng(50, 30))).near([3339584, 6413524]);

			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(p.project(latLng(51.9371170300465, 80.11230468750001)))
			        .near([8918060.964088084, 6755099.410887127]);
		});
	});

	describe('#unproject', () => {
		function pr(point) {
			return p.project(p.unproject(point));
		}

		it('unprojects a center point', () => {
			expect(pr(point(0, 0))).near([0, 0]);
		});

		it('unprojects pi points', () => {
			expect(pr(point(-Math.PI, Math.PI))).near([-Math.PI, Math.PI]);
			expect(pr(point(-Math.PI, -Math.PI))).near([-Math.PI, -Math.PI]);

			expect(pr(point(0.523598775598, 1.010683188683))).near([0.523598775598, 1.010683188683]);
		});

		it('unprojects other points', () => {
			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(pr(point(8918060.964088084, 6755099.410887127)));
		});
	});
});

describe('Projection.SphericalMercator', () => {
	const p = Projection.SphericalMercator;

	describe('#project', () => {
		it('projects a center point', () => {
			// edge cases
			expect(p.project(latLng(0, 0))).near([0, 0]);
		});

		it('projects the northeast corner of the world', () => {
			expect(p.project(latLng(85.0511287798, 180))).near([20037508, 20037508]);
		});

		it('projects the southwest corner of the world', () => {
			expect(p.project(latLng(-85.0511287798, -180))).near([-20037508, -20037508]);
		});

		it('projects other points', () => {
			expect(p.project(latLng(50, 30))).near([3339584, 6446275]);

			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(p.project(latLng(51.9371170300465, 80.11230468750001)))
				.near([8918060.96409, 6788763.38325]);
		});
	});

	describe('#unproject', () => {
		function pr(point) {
			return p.project(p.unproject(point));
		}

		it('unprojects a center point', () => {
			expect(pr(point(0, 0))).near([0, 0]);
		});

		it('unprojects pi points', () => {
			expect(pr(point(-Math.PI, Math.PI))).near([-Math.PI, Math.PI]);
			expect(pr(point(-Math.PI, -Math.PI))).near([-Math.PI, -Math.PI]);

			expect(pr(point(0.523598775598, 1.010683188683))).near([0.523598775598, 1.010683188683]);
		});

		it('unprojects other points', () => {
			// from https://github.com/Leaflet/Leaflet/issues/1578
			expect(pr(point(8918060.964088084, 6755099.410887127)));
		});
	});
});
