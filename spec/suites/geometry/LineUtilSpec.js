describe('LineUtil', function () {
	describe('#clipSegment', function () {
		var bounds;

		beforeEach(function () {
			bounds = L.bounds([5, 0], [15, 10]);
		});

		it('clips a segment by bounds', function () {
			var a = L.point(0, 0);
			var b = L.point(15, 15);

			var segment = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment[0]).to.eql(L.point(5, 5));
			expect(segment[1]).to.eql(L.point(10, 10));

			var c = L.point(5, -5);
			var d = L.point(20, 10);

			var segment2 = L.LineUtil.clipSegment(c, d, bounds);

			expect(segment2[0]).to.eql(L.point(10, 0));
			expect(segment2[1]).to.eql(L.point(15, 5));
		});

		it('uses last bit code and reject segments out of bounds', function () {
			var a = L.point(15, 15);
			var b = L.point(25, 20);
			var segment = L.LineUtil.clipSegment(a, b, bounds, true);

			expect(segment).to.be(false);
		});

		it('can round numbers in clipped bounds', function () {
			var a = L.point(4, 5);
			var b = L.point(8, 6);

			var segment1 = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment1[0]).to.eql(L.point(5, 5.25));
			expect(segment1[1]).to.eql(b);

			var segment2 = L.LineUtil.clipSegment(a, b, bounds, false, true);

			expect(segment2[0]).to.eql(L.point(5, 5));
			expect(segment2[1]).to.eql(b);
		});
	});

	describe('#pointToSegmentDistance & #closestPointOnSegment', function () {
		var p1 = L.point(0, 10);
		var p2 = L.point(10, 0);
		var p = L.point(0, 0);

		it('calculates distance from point to segment', function () {
			expect(L.LineUtil.pointToSegmentDistance(p, p1, p2)).to.eql(Math.sqrt(200) / 2);
		});

		it('calculates point closest to segment', function () {
			expect(L.LineUtil.closestPointOnSegment(p, p1, p2)).to.eql(L.point(5, 5));
		});
	});

	describe('#simplify', function () {
		it('simplifies polylines according to tolerance', function () {
			var points = [
				L.point(0, 0),
				L.point(0.01, 0),
				L.point(0.5, 0.01),
				L.point(0.7, 0),
				L.point(1, 0),
				L.point(1.999, 0.999),
				L.point(2, 1)
			];

			var simplified = L.LineUtil.simplify(points, 0.1);

			expect(simplified).to.eql([
				L.point(0, 0),
				L.point(1, 0),
				L.point(2, 1)
			]);
		});
	});

	describe('#isFlat', function () {
		it('should return true for an array of LatLngs', function () {
			expect(L.LineUtil.isFlat([L.latLng([0, 0])])).to.be(true);
		});

		it('should return true for an array of LatLngs arrays', function () {
			expect(L.LineUtil.isFlat([[0, 0]])).to.be(true);
		});

		it('should return true for an empty array', function () {
			expect(L.LineUtil.isFlat([])).to.be(true);
		});

		it('should return false for a nested array of LatLngs', function () {
			expect(L.LineUtil.isFlat([[L.latLng([0, 0])]])).to.be(false);
		});

		it('should return false for a nested empty array', function () {
			expect(L.LineUtil.isFlat([[]])).to.be(false);
		});

		it('should be aliased as _flat for retrocompat', function () {
			expect(L.LineUtil._flat([L.latLng([0, 0])])).to.be(true);
		});

		it('should be aliased as L.Polyline._flat for retrocompat', function () {
			expect(L.Polyline._flat([L.latLng([0, 0])])).to.be(true);
		});
	});

	describe('#polylineCenter', function () {
		var map, crs, zoom;
		beforeEach(function () {
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6});
			crs = map.options.crs;
			zoom = map.getZoom();
		});

		afterEach(function () {
			map.remove();
		});

		// More tests in PolylineSpec

		it('computes center of line', function () {
			var latlngs = [[80, 0], [80, 90]];
			var center = L.LineUtil.polylineCenter(latlngs, crs, zoom);
			expect(center).to.be.nearLatLng([80, 45]);
		});

		it('computes center of line with maxZoom', function () {
			L.gridLayer({maxZoom: 18}).addTo(map);
			var latlngs = [[80, 0], [80, 90]];
			var center = L.LineUtil.polylineCenter(latlngs, crs, map.getMaxZoom());
			expect(center).to.be.nearLatLng([80, 45]);
		});

		it('computes center of a small line and test it on every zoom', function () {
			var latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			var layer = L.polyline(latlngs).addTo(map);
			var i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small line and test it on every zoom - CRS.EPSG3395', function () {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.EPSG3395});

			var latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			var layer = L.polyline(latlngs).addTo(map);
			var i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small line and test it on every zoom - CRS.EPSG4326', function () {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.EPSG4326});

			var latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			var layer = L.polyline(latlngs).addTo(map);
			var i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small line and test it on every zoom - CRS.Simple', function () {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.Simple});

			var latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			var layer = L.polyline(latlngs).addTo(map);
			var i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('throws error if latlngs not passed', function () {
			expect(function () {
				L.LineUtil.polylineCenter(null, crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlng array is empty', function () {
			expect(function () {
				L.LineUtil.polylineCenter([], crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if map not passed', function () {
			var latlngs = [[80, 0], [80, 90]];
			expect(function () {
				L.LineUtil.polylineCenter(latlngs, null);
			}).to.throwException('map not passed');
		});

		it('shows warning if latlngs is not flat', function () {
			var latlngs = [
				[[80, 0], [80, 90]]
			];
			var spy = sinon.spy(console, 'warn');
			var center = L.LineUtil.polylineCenter(latlngs, crs, zoom);
			console.warn.restore();
			expect(spy.calledOnce).to.be.ok();
			expect(center).to.be.nearLatLng([80, 45]);
		});
	});
});
