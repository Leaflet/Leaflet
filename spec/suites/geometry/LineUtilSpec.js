describe('LineUtil', () => {
	describe('#clipSegment', () => {
		let bounds;

		beforeEach(() => {
			bounds = L.bounds([5, 0], [15, 10]);
		});

		it('clips a segment by bounds', () => {
			const a = L.point(0, 0);
			const b = L.point(15, 15);

			const segment = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment[0]).to.eql(L.point(5, 5));
			expect(segment[1]).to.eql(L.point(10, 10));

			const c = L.point(5, -5);
			const d = L.point(20, 10);

			const segment2 = L.LineUtil.clipSegment(c, d, bounds);

			expect(segment2[0]).to.eql(L.point(10, 0));
			expect(segment2[1]).to.eql(L.point(15, 5));
		});

		it('uses last bit code and reject segments out of bounds', () => {
			const a = L.point(15, 15);
			const b = L.point(25, 20);
			const segment = L.LineUtil.clipSegment(a, b, bounds, true);

			expect(segment).to.be(false);
		});

		it('can round numbers in clipped bounds', () => {
			const a = L.point(4, 5);
			const b = L.point(8, 6);

			const segment1 = L.LineUtil.clipSegment(a, b, bounds);

			expect(segment1[0]).to.eql(L.point(5, 5.25));
			expect(segment1[1]).to.eql(b);

			const segment2 = L.LineUtil.clipSegment(a, b, bounds, false, true);

			expect(segment2[0]).to.eql(L.point(5, 5));
			expect(segment2[1]).to.eql(b);
		});
	});

	describe('#pointToSegmentDistance & #closestPointOnSegment', () => {
		const p1 = L.point(0, 10);
		const p2 = L.point(10, 0);
		const p = L.point(0, 0);

		it('calculates distance from point to segment', () => {
			expect(L.LineUtil.pointToSegmentDistance(p, p1, p2)).to.eql(Math.sqrt(200) / 2);
		});

		it('calculates point closest to segment', () => {
			expect(L.LineUtil.closestPointOnSegment(p, p1, p2)).to.eql(L.point(5, 5));
		});
	});

	describe('#simplify', () => {
		it('simplifies polylines according to tolerance', () => {
			const points = [
				L.point(0, 0),
				L.point(0.01, 0),
				L.point(0.5, 0.01),
				L.point(0.7, 0),
				L.point(1, 0),
				L.point(1.999, 0.999),
				L.point(2, 1)
			];

			const simplified = L.LineUtil.simplify(points, 0.1);

			expect(simplified).to.eql([
				L.point(0, 0),
				L.point(1, 0),
				L.point(2, 1)
			]);
		});
	});

	describe('#isFlat', () => {
		it('should return true for an array of LatLngs', () => {
			expect(L.LineUtil.isFlat([L.latLng([0, 0])])).to.be(true);
		});

		it('should return true for an array of LatLngs arrays', () => {
			expect(L.LineUtil.isFlat([[0, 0]])).to.be(true);
		});

		it('should return true for an empty array', () => {
			expect(L.LineUtil.isFlat([])).to.be(true);
		});

		it('should return false for a nested array of LatLngs', () => {
			expect(L.LineUtil.isFlat([[L.latLng([0, 0])]])).to.be(false);
		});

		it('should return false for a nested empty array', () => {
			expect(L.LineUtil.isFlat([[]])).to.be(false);
		});
	});

	describe('#polylineCenter', () => {
		let map, crs, zoom;
		beforeEach(() => {
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, zoomAnimation: false});
			crs = map.options.crs;
			zoom = map.getZoom();
		});

		afterEach(() => {
			map.remove();
		});

		// More tests in PolylineSpec

		it('computes center of line', () => {
			const latlngs = [[80, 0], [80, 90]];
			const center = L.LineUtil.polylineCenter(latlngs, crs, zoom);
			expect(center).to.be.nearLatLng([80, 45]);
		});

		it('computes center of line with maxZoom', () => {
			L.gridLayer({maxZoom: 18}).addTo(map);
			const latlngs = [[80, 0], [80, 90]];
			const center = L.LineUtil.polylineCenter(latlngs, crs, map.getMaxZoom());
			expect(center).to.be.nearLatLng([80, 45]);
		});

		it('computes center of a small line and test it on every zoom', () => {
			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polyline(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small line and test it on every zoom - CRS.EPSG3395', () => {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.EPSG3395, zoomAnimation: false});

			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polyline(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small line and test it on every zoom - CRS.EPSG4326', () => {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.EPSG4326, zoomAnimation: false});

			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polyline(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small line and test it on every zoom - CRS.Simple', () => {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.Simple, zoomAnimation: false});

			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polyline(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('throws error if latlngs not passed', () => {
			expect(() => {
				L.LineUtil.polylineCenter(null, crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlng array is empty', () => {
			expect(() => {
				L.LineUtil.polylineCenter([], crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if map not passed', () => {
			const latlngs = [[80, 0], [80, 90]];
			expect(() => {
				L.LineUtil.polylineCenter(latlngs, null);
			}).to.throwException('map not passed');
		});

		it('shows warning if latlngs is not flat', () => {
			const latlngs = [
				[[80, 0], [80, 90]]
			];
			const spy = sinon.spy(console, 'warn');
			const center = L.LineUtil.polylineCenter(latlngs, crs, zoom);
			console.warn.restore();
			expect(spy.calledOnce).to.be.ok();
			expect(center).to.be.nearLatLng([80, 45]);
		});
	});
});
