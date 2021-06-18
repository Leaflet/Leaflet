describe('LineUtil', function () {
	describe('#clipSegment', function () {
		let bounds;

		beforeEach(function () {
			bounds = L.bounds([5, 0], [15, 10]);
		});

		it('clips a segment by bounds', function () {
			const a = new L.Point(0, 0);
			const b = new L.Point(15, 15);

			const segment = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment[0]).to.eql(new L.Point(5, 5));
			expect(segment[1]).to.eql(new L.Point(10, 10));

			const c = new L.Point(5, -5);
			const d = new L.Point(20, 10);

			const segment2 = L.LineUtil.clipSegment(c, d, bounds);

			expect(segment2[0]).to.eql(new L.Point(10, 0));
			expect(segment2[1]).to.eql(new L.Point(15, 5));
		});

		it('uses last bit code and reject segments out of bounds', function () {
			const a = new L.Point(15, 15);
			const b = new L.Point(25, 20);
			const segment = L.LineUtil.clipSegment(a, b, bounds, true);

			expect(segment).to.be(false);
		});

		it('can round numbers in clipped bounds', function () {
			const a = new L.Point(4, 5);
			const b = new L.Point(8, 6);

			const segment1 = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment1[0]).to.eql(new L.Point(5, 5.25));
			expect(segment1[1]).to.eql(b);

			const segment2 = L.LineUtil.clipSegment(a, b, bounds, false, true);

			expect(segment2[0]).to.eql(new L.Point(5, 5));
			expect(segment2[1]).to.eql(b);
		});
	});

	describe('#pointToSegmentDistance & #closestPointOnSegment', function () {
		const p1 = new L.Point(0, 10);
		const p2 = new L.Point(10, 0);
		const p = new L.Point(0, 0);

		it('calculates distance from point to segment', function () {
			expect(L.LineUtil.pointToSegmentDistance(p, p1, p2)).to.eql(Math.sqrt(200) / 2);
		});

		it('calculates point closest to segment', function () {
			expect(L.LineUtil.closestPointOnSegment(p, p1, p2)).to.eql(new L.Point(5, 5));
		});
	});

	describe('#simplify', function () {
		it('simplifies polylines according to tolerance', function () {
			const points = [
				new L.Point(0, 0),
				new L.Point(0.01, 0),
				new L.Point(0.5, 0.01),
				new L.Point(0.7, 0),
				new L.Point(1, 0),
				new L.Point(1.999, 0.999),
				new L.Point(2, 1)
			];

			const simplified = L.LineUtil.simplify(points, 0.1);

			expect(simplified).to.eql([
				new L.Point(0, 0),
				new L.Point(1, 0),
				new L.Point(2, 1)
			]);
		});
	});
});
