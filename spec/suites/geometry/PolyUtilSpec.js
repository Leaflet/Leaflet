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
});
