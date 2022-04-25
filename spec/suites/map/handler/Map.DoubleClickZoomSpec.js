describe("Map.DoubleClickZoom", function () {
	var container, map;

	beforeEach(function () {
		container = createContainer();
		map = L.map(container, {
			center: [0, 0],
			zoom: 3
		});
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	it("zooms in while dblclick", function (done) {
		var zoom = map.getZoom();
		happen.dblclick(container);

		map.on('zoomend', function () {
			expect(map.getCenter()).to.be.nearLatLng([17.308687886770034, -17.578125000000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it("zooms out while dblclick and holding shift", function (done) {
		var zoom = map.getZoom();
		happen.dblclick(container, {shiftKey: true});

		map.on('zoomend', function () {
			expect(map.getCenter()).to.be.nearLatLng([-33.137551192346145, 35.15625000000001]);
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});
	});

	it("doubleClickZoom: 'center'", function (done) {
		var doubleClickZoomBefore = map.options.doubleClickZoom;
		map.options.doubleClickZoom = 'center';
		var zoom = map.getZoom();
		happen.dblclick(container);

		map.on('zoomend', function () {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.doubleClickZoom = doubleClickZoomBefore;
			done();
		});
	});

});
