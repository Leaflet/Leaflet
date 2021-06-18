describe('Path', function () {
	let c, map;

	beforeEach(function () {
		c = document.createElement('div');
		c.style.width = '400px';
		c.style.height = '400px';
		map = new L.Map(c);
		map.setView(new L.LatLng(0, 0), 0);
		document.body.appendChild(c);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(c);
	});

	// The following two tests are skipped, as the ES6-ifycation of Leaflet
	// means that L.Path is no longer visible.
	describe('#bringToBack', function () {
		it('is a no-op for layers not on a map', function () {
			const path = new L.Polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToBack()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', function () {
			const group = new L.LayerGroup().addTo(map);
			const path = new L.Polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToBack()).to.equal(path);
		});
	});

	describe('#bringToFront', function () {
		it('is a no-op for layers not on a map', function () {
			const path = new L.Polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToFront()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', function () {
			const group = new L.LayerGroup().addTo(map);
			const path = new L.Polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToFront()).to.equal(path);
		});
	});

	describe('#events', function () {
		it('fires click event', function () {
			const spy = sinon.spy();
			const layer = new L.Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('click', spy);
			happen.click(layer._path);
			expect(spy.called).to.be.ok();
		});

		it('propagates click event by default', function () {
			const spy = sinon.spy();
			const spy2 = sinon.spy();
			const mapSpy = sinon.spy();
			const layer = new L.Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('click', spy);
			layer.on('click', spy2);
			map.on('click', mapSpy);
			happen.click(layer._path);
			expect(spy.called).to.be.ok();
			expect(spy2.called).to.be.ok();
			expect(mapSpy.called).to.be.ok();
		});

		it('can add a layer while being inside a moveend handler', function (done) {
			const zoneLayer = L.layerGroup();
			let polygon;
			map.addLayer(zoneLayer);

			map.on('moveend', function () {
				zoneLayer.clearLayers();
				polygon = new L.Polygon([[1, 2], [3, 4], [5, 6]]);
				zoneLayer.addLayer(polygon);
			});

			map.invalidateSize();
			map.setView([1, 2], 12, {animate: false});

			map.panBy([-260, 0]);
			setTimeout(function () {
				expect(polygon._parts.length).to.be(0);
				map.panBy([260, 0]);
				setTimeout(function () {
					expect(polygon._parts.length).to.be(1);
					done();
				}, 300);
			}, 300);
		});

		it('it should return tolerance with stroke', function () {
			const path = new L.Polyline([[1, 2], [3, 4], [5, 6]]);
			path.addTo(map);
			expect(path._clickTolerance()).to.equal(path.options.weight / 2);
		});

		it('it should return zero tolerance without stroke', function () {
			const path = new L.Polyline([[1, 2], [3, 4], [5, 6]]);
			path.addTo(map);
			path.options.stroke = false;
			expect(path._clickTolerance()).to.equal(0);
		});
	});
});
