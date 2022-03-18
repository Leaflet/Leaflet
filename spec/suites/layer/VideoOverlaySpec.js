describe('VideoOverlay', function () {
	var container, map;
	var videoBounds = L.latLngBounds([[32, -130], [13, -100]]);

	beforeEach(function () {
		container = container = createContainer();
		map = L.map(container);
		map.setView([55.8, 37.6], 6);	// view needs to be set so when layer is added it is initilized
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});


	it('create VideoOverlay', function () {
		this.timeout(10000); // This test takes longer than usual in IE

		var videoUrls = [
			'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
			'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
		];

		var videoOverlay = L.videoOverlay(videoUrls, videoBounds).addTo(map);

		expect(map.hasLayer(videoOverlay)).to.be.ok();
	});
});
