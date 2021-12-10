describe('Path', function () {
	var container, map;

	beforeEach(function () {
		container = container = createContainer();
		map = L.map(container);
		map.setView([0, 0], 0);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	// The following two tests are skipped, as the ES6-ifycation of Leaflet
	// means that L.Path is no longer visible.
	describe('#bringToBack', function () {
		it('is a no-op for layers not on a map', function () {
			var path = L.polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToBack()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', function () {
			var group = L.layerGroup().addTo(map);
			var path = L.polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToBack()).to.equal(path);
		});
	});

	describe('#bringToFront', function () {
		it('is a no-op for layers not on a map', function () {
			var path = L.polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToFront()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', function () {
			var group = L.layerGroup().addTo(map);
			var path = L.polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToFront()).to.equal(path);
		});
	});

	describe('#events', function () {
		it('fires click event', function () {
			var spy = sinon.spy();
			var layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('click', spy);
			happen.click(layer._path);
			expect(spy.called).to.be.ok();
		});

		it('propagates click event by default', function () {
			var spy = sinon.spy();
			var spy2 = sinon.spy();
			var mapSpy = sinon.spy();
			var layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('click', spy);
			layer.on('click', spy2);
			map.on('click', mapSpy);
			happen.click(layer._path);
			expect(spy.called).to.be.ok();
			expect(spy2.called).to.be.ok();
			expect(mapSpy.called).to.be.ok();
		});

		it('can add a layer while being inside a moveend handler', function (done) {
			var zoneLayer = L.layerGroup();
			var polygon;
			map.addLayer(zoneLayer);

			map.on('moveend', function () {
				zoneLayer.clearLayers();
				polygon = L.polygon([[1, 2], [3, 4], [5, 6]]);
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
			var path = L.polyline([[1, 2], [3, 4], [5, 6]]);
			path.addTo(map);
			expect(path._clickTolerance()).to.equal(path.options.weight / 2);
		});

		it('it should return zero tolerance without stroke', function () {
			var path = L.polyline([[1, 2], [3, 4], [5, 6]]);
			path.addTo(map);
			path.options.stroke = false;
			expect(path._clickTolerance()).to.equal(0);
		});
	});
});
