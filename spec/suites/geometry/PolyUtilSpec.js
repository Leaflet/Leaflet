describe('PolyUtil', function () {
	describe('#clipPolygon', function () {
		it('clips polygon by bounds', function () {
			var bounds = L.bounds([0, 0], [10, 10]);

			var points = [
				L.point(5, 5),
				L.point(15, 10),
				L.point(10, 15)
			];

			// check clip without rounding
			var clipped = L.PolyUtil.clipPolygon(points, bounds);

			for (var i = 0, len = clipped.length; i < len; i++) {
				delete clipped[i]._code;
			}

			expect(clipped).to.eql([
				L.point(7.5, 10),
				L.point(5, 5),
				L.point(10, 7.5),
				L.point(10, 10)
			]);

			// check clip with rounding
			var clippedRounded = L.PolyUtil.clipPolygon(points, bounds, true);

			for (i = 0, len = clippedRounded.length; i < len; i++) {
				delete clippedRounded[i]._code;
			}

			expect(clippedRounded).to.eql([
				L.point(8, 10),
				L.point(5, 5),
				L.point(10, 8),
				L.point(10, 10)
			]);
		});
	});

	describe('#polygonCenter', function () {
		var map, crs, zoom;
		beforeEach(function () {
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6});
			crs = map.options.crs;
			zoom = map.getZoom();
		});

		afterEach(function () {
			map.remove();
		});

		// More tests in PolygonSpec

		it('computes center of polygon', function () {
			var latlngs = [[0, 0], [10, 0], [10, 10], [0, 10]];
			var center = L.PolyUtil.polygonCenter(latlngs, crs, zoom);
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('computes center of polygon with maxZoom', function () {
			L.gridLayer({maxZoom: 18}).addTo(map);
			var latlngs = [[0, 0], [10, 0], [10, 10], [0, 10]];
			var center = L.PolyUtil.polygonCenter(latlngs, crs, map.getMaxZoom());
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('throws error if latlngs not passed', function () {
			expect(function () {
				L.PolyUtil.polygonCenter(null,  crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlng array is empty', function () {
			expect(function () {
				L.PolyUtil.polygonCenter([], crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('shows warning if latlngs is not flat', function () {
			var latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			var spy = sinon.spy(console, 'warn');
			var center = L.PolyUtil.polygonCenter(latlngs, crs, zoom);
			console.warn.restore();
			expect(spy.calledOnce).to.be.ok();
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('throws error if map not passed', function () {
			var latlngs = [[80, 0], [80, 90]];
			expect(function () {
				L.PolyUtil.polygonCenter(latlngs, null);
			}).to.throwException('map not passed');
		});
	});
});
