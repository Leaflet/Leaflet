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
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, zoomAnimation: false});
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

		it('computes center of a small polygon', function () {
			var latlngs = [[42.87097909758862, -81.12594320566181], [42.87108302016597, -81.12594320566181], [42.87108302016597, -81.12576504805303], [42.87097909758862, -81.12576504805303]];
			var layer = L.polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([42.87103105887729, -81.12585412685742]);
		});

		it('computes center of a big polygon', function () {
			var latlngs = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
			var layer = L.polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([0, 0]);
		});

		it('throws error if latlngs not passed', function () {
			expect(function () {
				L.PolyUtil.polygonCenter(null,  crs);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlng array is empty', function () {
			expect(function () {
				L.PolyUtil.polygonCenter([], crs);
			}).to.throwException('latlngs not passed');
		});

		it('shows warning if latlngs is not flat', function () {
			var latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			var spy = sinon.spy(console, 'warn');
			var center = L.PolyUtil.polygonCenter(latlngs, crs);
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

		it('iterates only over the array values', function () {
			// eslint-disable-next-line
			Array.prototype.foo = 'ABC';
			var latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			var center = L.PolyUtil.polygonCenter(latlngs, crs);
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});
	});
});
