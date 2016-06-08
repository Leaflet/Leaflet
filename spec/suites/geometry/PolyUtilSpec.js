describe('PolyUtil', function () {

	describe('#clipPolygon', function () {
		it('clips polygon by bounds', function () {
			var bounds = L.bounds([0, 0], [10, 10]);

			var points = [
				new L.Point(5, 5),
				new L.Point(15, 10),
				new L.Point(10, 15)
			];

			// check clip without rounding
			var clipped = L.PolyUtil.clipPolygon(points, bounds);

			for (var i = 0, len = clipped.length; i < len; i++) {
				delete clipped[i]._code;
			}

			expect(clipped).to.eql([
				new L.Point(7.5, 10),
				new L.Point(5, 5),
				new L.Point(10, 7.5),
				new L.Point(10, 10)
			]);

			// check clip with rounding
			var clippedRounded = L.PolyUtil.clipPolygon(points, bounds, true);

			for (i = 0, len = clippedRounded.length; i < len; i++) {
				delete clippedRounded[i]._code;
			}

			expect(clippedRounded).to.eql([
				new L.Point(8, 10),
				new L.Point(5, 5),
				new L.Point(10, 8),
				new L.Point(10, 10)
			]);
		});
	});

	describe('#ringContains', function () {

		var points = [
			new L.Point(2, 0),
			new L.Point(0, 2),
			new L.Point(-2, 0),
			new L.Point(0, -4)
		];

		it('checks ring points', function () {
			expect(L.PolyUtil.ringContains(points, new L.Point(-2, 0))).to.be.ok();
			// Excluded boundaries
			expect(L.PolyUtil.ringContains(points, new L.Point(0, 2))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(2, 0))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(0, -4))).to.not.be.ok();
		});

		it('checks points on the ring edges', function () {
			expect(L.PolyUtil.ringContains(points, new L.Point(-1, -2))).to.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(-1, 1))).to.be.ok();
			// Excluded boundaries
			expect(L.PolyUtil.ringContains(points, new L.Point(1, 1))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(1, -2))).to.not.be.ok();
		});

		it('checks points inside the ring', function () {
			expect(L.PolyUtil.ringContains(points, new L.Point(0, 0))).to.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(1, 0))).to.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(-1, 0))).to.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(0, 1))).to.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(0, -3))).to.be.ok();
		});

		it('checks points outside the bounding box', function () {
			expect(L.PolyUtil.ringContains(points, new L.Point(3, 2))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(1, 3))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(-3, 0))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(0, -5))).to.not.be.ok();
		});

		it('checks points in the bounding box but not in the ring', function () {
			expect(L.PolyUtil.ringContains(points, new L.Point(1, -3))).to.not.be.ok();
			expect(L.PolyUtil.ringContains(points, new L.Point(-1, -3))).to.not.be.ok();
		});

	});
});
