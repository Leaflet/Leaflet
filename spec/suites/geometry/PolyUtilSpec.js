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

	describe('#polygonCenter', function () {
		var map;
		before(function () {
			map = new L.Map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6});
		});

		after(function () {
			map.remove();
		});

		// More tests in PolygonSpec

		it('compute center of polygon', function () {
			var latlngs = [[0, 0], [10, 0], [10, 10], [0, 10]];
			expect(L.PolyUtil.polygonCenter(latlngs, map)).to.be.nearLatLng(L.latLng([5, 5]), 1e-1);
		});

		it('throws error if latlngs not passed', function () {
			expect(function () {
				L.PolyUtil.polygonCenter(null, map);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlng array is empty', function () {
			expect(function () {
				L.PolyUtil.polygonCenter([], map);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlngs not flat', function () {
			var latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			expect(function () {
				L.PolyUtil.polygonCenter(latlngs, map);
			}).to.throwException('latlngs are not flat!');
		});

		it('throws error if map not passed', function () {
			var latlngs = [[80, 0], [80, 90]];
			expect(function () {
				L.PolyUtil.polygonCenter(latlngs, null);
			}).to.throwException('map not passed');
		});
	});
});
