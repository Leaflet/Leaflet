describe("Map.DoubleClickZoom", () => {
	var container, map;

	beforeEach(() => {
		container = createContainer();
		map = L.map(container, {
			center: [0, 0],
			zoom: 3,
			zoomAnimation: false
		});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it("zooms in while dblclick", (done) => {
		var zoom = map.getZoom();

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([17.308687886770034, -17.578125000000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});

		happen.dblclick(container);
	});

	it("zooms out while dblclick and holding shift", (done) => {
		var zoom = map.getZoom();

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([-33.137551192346145, 35.15625000000001]);
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});

		happen.dblclick(container, {shiftKey: true});
	});

	it("doubleClickZoom: 'center'", (done) => {
		var doubleClickZoomBefore = map.options.doubleClickZoom;
		map.options.doubleClickZoom = 'center';
		var zoom = map.getZoom();

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.doubleClickZoom = doubleClickZoomBefore;
			done();
		});

		happen.dblclick(container);
	});

});
