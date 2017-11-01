describe('LineUtil', function () {

	describe('#clipSegment', function () {

		var bounds;

		beforeEach(function () {
			bounds = L.bounds([5, 0], [15, 10]);
		});

		it('clips a segment by bounds', function () {
			var a = new L.Point(0, 0);
			var b = new L.Point(15, 15);

			var segment = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment[0]).to.eql(new L.Point(5, 5));
			expect(segment[1]).to.eql(new L.Point(10, 10));

			var c = new L.Point(5, -5);
			var d = new L.Point(20, 10);

			var segment2 = L.LineUtil.clipSegment(c, d, bounds);

			expect(segment2[0]).to.eql(new L.Point(10, 0));
			expect(segment2[1]).to.eql(new L.Point(15, 5));
		});

		it('uses last bit code and reject segments out of bounds', function () {
			var a = new L.Point(15, 15);
			var b = new L.Point(25, 20);
			var segment = L.LineUtil.clipSegment(a, b, bounds, true);

			expect(segment).to.be(false);
		});

		it('can round numbers in clipped bounds', function () {
			var a = new L.Point(4, 5);
			var b = new L.Point(8, 6);

			var segment1 = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment1[0]).to.eql(new L.Point(5, 5.25));
			expect(segment1[1]).to.eql(b);

			var segment2 = L.LineUtil.clipSegment(a, b, bounds, false, true);

			expect(segment2[0]).to.eql(new L.Point(5, 5));
			expect(segment2[1]).to.eql(b);
		});
	});

	describe('#pointToSegmentDistance & #closestPointOnSegment', function () {

		var p1 = new L.Point(0, 10);
		var p2 = new L.Point(10, 0);
		var p = new L.Point(0, 0);

		it('calculates distance from point to segment', function () {
			expect(L.LineUtil.pointToSegmentDistance(p, p1, p2)).to.eql(Math.sqrt(200) / 2);
		});

		it('calculates point closest to segment', function () {
			expect(L.LineUtil.closestPointOnSegment(p, p1, p2)).to.eql(new L.Point(5, 5));
		});
	});

	describe('#simplify', function () {
		it('simplifies polylines according to tolerance', function () {
			var points = [
				new L.Point(0, 0),
				new L.Point(0.01, 0),
				new L.Point(0.5, 0.01),
				new L.Point(0.7, 0),
				new L.Point(1, 0),
				new L.Point(1.999, 0.999),
				new L.Point(2, 1)
			];

			var simplified = L.LineUtil.simplify(points, 0.1);

			expect(simplified).to.eql([
				new L.Point(0, 0),
				new L.Point(1, 0),
				new L.Point(2, 1)
			]);
		});
	});

	describe('#isCrossMeridian', function () {
		it('returns true if the line between two latLngs crosses either the Prime Meridian or the International Date Line', function () {
			expect(L.LineUtil.isCrossMeridian(L.latLng([50, -70]), L.latLng([52, 90]))).to.eql(true);
		});

		it('returns true if the line between two latLngs crosses either the Prime Meridian or the International Date Line', function () {
			expect(L.LineUtil.isCrossMeridian(L.latLng([50, -2]), L.latLng([52, 1]))).to.eql(true);
		});

		it('returns true if the line between two latLngs crosses either the Prime Meridian or the International Date Line', function () {
			expect(L.LineUtil.isCrossMeridian(L.latLng([50, -180]), L.latLng([52, 180]))).to.eql(true);
		});

		it('returns false if the line between two latLngs does not cross either the Prime Meridian or the International Date Line', function () {
			expect(L.LineUtil.isCrossMeridian(L.latLng([50, 70]), L.latLng([52, 90]))).to.eql(false);
		});

		it('returns false if the line between two latLngs does not cross either the Prime Meridian or the International Date Line', function () {
			expect(L.LineUtil.isCrossMeridian(L.latLng([50, 0]), L.latLng([52, 180]))).to.eql(false);
		});

		it('returns false if the line between two latLngs does not cross either the Prime Meridian or the International Date Line', function () {
			expect(L.LineUtil.isCrossMeridian(L.latLng([50, 0]), L.latLng([52, -180]))).to.eql(false);
		});
	});

	describe('#sign', function () {
		it('returns NaN if the value is not a number.', function () {
			expect(isNaN(L.LineUtil.sign('number'))).to.eql(true);
		});

		it('returns NaN if the value is null.', function () {
			expect(isNaN(L.LineUtil.sign(null))).to.eql(true);
		});

		it('returns 0 if the value is 0.', function () {
			expect(L.LineUtil.sign(0)).to.eql(0);
		});

		it('returns 1 if the value is positive.', function () {
			expect(L.LineUtil.sign(3.14)).to.eql(1);
		});

		it('returns -1 if the value is negative.', function () {
			expect(L.LineUtil.sign(-180)).to.eql(-1);
		});
	});

	describe('#calculateAntimeridianLat', function () {
		it('Calculates the International Date Line latitude crossing point between two LatLngs with the same lat.', function () {
			var latLngA = L.latLng([50, -70]);
			var latLngB = L.latLng([50, 90]);
			expect(L.LineUtil.calculateAntimeridianLat(latLngA, latLngB)).to.eql(50);
		});

		it('Calculates the International Date Line latitude crossing point between two evenly spaced LatLngs.', function () {
			var latLngA = L.latLng([55, -90]);
			var latLngB = L.latLng([50, 90]);
			expect(L.LineUtil.calculateAntimeridianLat(latLngA, latLngB)).to.eql(52.5);
		});

		it('Calculates the International Date Line latitude crossing point between two LatLngs.', function () {
			var latLngA = L.latLng([50, -70]);
			var latLngB = L.latLng([56, 90]);
			expect(L.LineUtil.calculateAntimeridianLat(latLngA, latLngB)).to.eql(53.3);
		});

		it('Calculates the International Date Line latitude crossing point between two LatLngs where one is at the International Date Line.', function () {
			var latLngA = L.latLng([50, -180]);
			var latLngB = L.latLng([70, 90]);
			expect(L.LineUtil.calculateAntimeridianLat(latLngA, latLngB)).to.eql(50);
		});
	});
});
