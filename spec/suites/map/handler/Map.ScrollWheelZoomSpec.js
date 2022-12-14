describe('Map.ScrollWheelZoom', () => {
	let container, map;
	const wheel = 'onwheel' in window ? 'wheel' : 'mousewheel';
	const scrollIn = {
		type: wheel,
		deltaY: -120,
		deltaMode: 0
	};
	const scrollOut = {
		type: wheel,
		deltaY: 120,
		deltaMode: 0
	};

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

	it('zooms out while firing \'wheel\' event', (done) => {
		const zoom = map.getZoom();
		happen.once(container, scrollOut);

		map.on('zoomend', () => {
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([-33.137551192346145, 35.15625000000001]);
			expect(map.getZoom()).to.be.lessThan(zoom);
			done();
		});
	});

	it('zooms in while firing \'wheel\' event', (done) => {
		const zoom = map.getZoom();
		happen.once(container, scrollIn);

		map.on('zoomend', () => {
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([17.308687886770034, -17.578125000000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			done();
		});
	});

	it('scrollWheelZoom: \'center\'', (done) => {
		const scrollWheelZoomBefore = map.options.scrollWheelZoom;
		map.options.scrollWheelZoom = 'center';
		const zoom = map.getZoom();
		happen.once(container, scrollIn);

		map.on('zoomend', () => {
			expect(map.getCenter()).to.be.nearLatLng([0, 0]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.scrollWheelZoom = scrollWheelZoomBefore;
			done();
		});
	});

	it('changes the option \'wheelDebounceTime\'', (done) => {
		const wheelDebounceTimeBefore = map.options.wheelDebounceTime;
		map.options.wheelDebounceTime = 100;
		const zoom = map.getZoom();

		const spy = sinon.spy();
		map.on('zoomend', spy);

		happen.once(container, scrollIn);
		setTimeout(() => {
			happen.once(container, scrollIn);

			expect(spy.notCalled).to.be.ok();
		}, 50);

		map.on('zoomend', () => {
			expect(spy.calledOnce).to.be.ok();
			// Bug 1.8.0: Firefox wheel zoom makes 2 steps #7403
			// expect(map.getCenter()).to.be.nearLatLng([25.48295117535531, -26.367187500000004]);
			expect(map.getZoom()).to.be.greaterThan(zoom);
			map.options.wheelDebounceTime = wheelDebounceTimeBefore;
			done();
		});
	});

	it('changes the option \'wheelPxPerZoomLevel\'', (done) => {
		const wheelPxPerZoomLevelBefore = map.options.wheelPxPerZoomLevel;
		map.setZoom(15, {animate: false});

		const zoom = map.getZoom();
		happen.once(container, scrollIn);

		map.once('zoomend', () => {
			expect(map.getZoom()).to.be.greaterThan(zoom);
			const zoomDiff = map.getZoom() - zoom;

			map.setZoom(zoom, {animate: false});
			expect(map.getZoom()).to.be(zoom);

			map.options.wheelPxPerZoomLevel = 30 / L.DomEvent.getWheelPxFactor();
			happen.once(container, scrollIn);

			map.once('zoomend', () => {
				expect(map.getZoom()).to.be.greaterThan(zoom);
				expect(map.getZoom() - zoom).to.be.greaterThan(zoomDiff);
				map.options.wheelPxPerZoomLevel = wheelPxPerZoomLevelBefore;
				done();
			});
		});
	});
});
