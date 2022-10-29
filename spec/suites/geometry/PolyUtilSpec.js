describe('PolyUtil', () => {
	describe('#clipPolygon', () => {
		it('clips polygon by bounds', () => {
			const bounds = L.bounds([0, 0], [10, 10]);

			const points = [
				L.point(5, 5),
				L.point(15, 10),
				L.point(10, 15)
			];

			// check clip without rounding
			const clipped = L.PolyUtil.clipPolygon(points, bounds);

			for (let i = 0, len = clipped.length; i < len; i++) {
				delete clipped[i]._code;
			}

			expect(clipped).to.eql([
				L.point(7.5, 10),
				L.point(5, 5),
				L.point(10, 7.5),
				L.point(10, 10)
			]);

			// check clip with rounding
			const clippedRounded = L.PolyUtil.clipPolygon(points, bounds, true);

			for (let i = 0, len = clippedRounded.length; i < len; i++) {
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

	describe('#polygonCenter', () => {
		let map, crs, zoom;
		beforeEach(() => {
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, zoomAnimation: false});
			crs = map.options.crs;
			zoom = map.getZoom();
		});

		afterEach(() => {
			map.remove();
		});

		// More tests in PolygonSpec

		it('computes center of polygon', () => {
			const latlngs = [[0, 0], [10, 0], [10, 10], [0, 10]];
			const center = L.PolyUtil.polygonCenter(latlngs, crs, zoom);
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('computes center of polygon with maxZoom', () => {
			L.gridLayer({maxZoom: 18}).addTo(map);
			const latlngs = [[0, 0], [10, 0], [10, 10], [0, 10]];
			const center = L.PolyUtil.polygonCenter(latlngs, crs, map.getMaxZoom());
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('computes center of a small polygon and test it on every zoom', () => {
			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polygon(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49949394037396, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small polygon and test it on every zoom - CRS.EPSG3395', () => {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.EPSG3395, zoomAnimation: false});

			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polygon(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49949394037396, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small polygon and test it on every zoom - CRS.EPSG4326', () => {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.EPSG4326, zoomAnimation: false});

			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polygon(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49949394037396, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('computes center of a small polygon and test it on every zoom - CRS.Simple', () => {
			map.remove();
			map = L.map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, crs: L.CRS.Simple, zoomAnimation: false});

			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];

			const layer = L.polygon(latlngs).addTo(map);
			let i = 0;
			function check() {
				expect(layer.getCenter()).to.be.nearLatLng([50.49949394037396, 30.50989603626345]);
				i++;
				if (i < 30) { map.setZoom(i); }
			}

			map.on('zoomend', check);
			map.setView(layer.getCenter(), i);
		});

		it('throws error if latlngs not passed', () => {
			expect(() => {
				L.PolyUtil.polygonCenter(null,  crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('throws error if latlng array is empty', () => {
			expect(() => {
				L.PolyUtil.polygonCenter([], crs, zoom);
			}).to.throwException('latlngs not passed');
		});

		it('shows warning if latlngs is not flat', () => {
			const latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			const spy = sinon.spy(console, 'warn');
			const center = L.PolyUtil.polygonCenter(latlngs, crs, zoom);
			console.warn.restore();
			expect(spy.calledOnce).to.be.ok();
			expect(center).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('throws error if map not passed', () => {
			const latlngs = [[80, 0], [80, 90]];
			expect(() => {
				L.PolyUtil.polygonCenter(latlngs, null);
			}).to.throwException('map not passed');
		});
	});
});
