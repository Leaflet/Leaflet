describe("Map.ScrollWheelZoom", function () {
	var container, map;
	var wheel = 'onwheel' in window ? 'wheel' : 'mousewheel';
	var scrollIn = {
		type: wheel,
		deltaY: -120,
		deltaMode: 0
	};
	var scrollOut = {
		type: wheel,
		deltaY: 120,
		deltaMode: 0
	};

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

	it("zooms out while firing 'wheel' event", function (done) {
		var zoom = map.getZoom();
		happen.once(container, scrollOut);

		map.on('zoomend', function () {
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([-33.137551192346145, 35.15625000000001]);
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});
	});

	it("zooms in while firing 'wheel' event", function (done) {
		var zoom = map.getZoom();
		happen.once(container, scrollIn);

		map.on('zoomend', function () {
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([17.308687886770034, -17.578125000000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it("scrollWheelZoom: 'center'", function (done) {
		var scrollWheelZoomBefore = map.options.scrollWheelZoom;
		map.options.scrollWheelZoom = 'center';
		var zoom = map.getZoom();
		happen.once(container, scrollIn);

		map.on('zoomend', function () {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.scrollWheelZoom = scrollWheelZoomBefore;
			done();
		});
	});

	it("changes the option 'wheelDebounceTime'", function (done) {
		var wheelDebounceTimeBefore = map.options.wheelDebounceTime;
		map.options.wheelDebounceTime = 100;
		var zoom = map.getZoom();

		var spy = sinon.spy();
		map.on('zoomend', spy);

		happen.once(container, scrollIn);
		setTimeout(function () {
			happen.once(container, scrollIn);

			expect(spy.notCalled).to.be.ok();
		}, 50);

		map.on('zoomend', function () {
			expect(spy.calledOnce).to.be.ok();
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([25.48295117535531, -26.367187500000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.wheelDebounceTime = wheelDebounceTimeBefore;
			done();
		});
	});

	it("changes the option 'wheelPxPerZoomLevel'", function (done) {
		var wheelPxPerZoomLevelBefore = map.options.wheelPxPerZoomLevel;
		map.setZoom(15, {animate: false});

		var zoom = map.getZoom();
		happen.once(container, scrollIn);

		map.once('zoomend', function () {
			expect(map.getZoom()).to.be.greaterThan(zoom);
			var zoomDiff = map.getZoom() - zoom;

			// Bug 1.8.0: .once('zoomend') is called twice if call `setZoom` in its function
			setTimeout(function () {
				map.setZoom(zoom, {animate: false});
				expect(map.getZoom()).to.be(zoom);

				map.options.wheelPxPerZoomLevel = 30;
				happen.once(container, scrollIn);

				map.once('zoomend', function () {
					expect(map.getZoom()).to.be.greaterThan(zoom);
					expect(map.getZoom() - zoom).to.be.greaterThan(zoomDiff);
					map.options.wheelPxPerZoomLevel = wheelPxPerZoomLevelBefore;
					done();
				});
			}, 10);
		});
	});
});
