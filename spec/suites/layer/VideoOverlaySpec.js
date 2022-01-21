describe('VideoOverlay', function () {
	var c, map;
	var videoBounds = L.latLngBounds([[32, -130], [13, -100]]);

	beforeEach(function () {
		c = document.createElement('div');
		c.style.width = '400px';
		c.style.height = '400px';
		document.body.appendChild(c);
		map = new L.Map(c);
		map.setView(new L.LatLng(55.8, 37.6), 6);	// view needs to be set so when layer is added it is initilized
	});

	afterEach(function () {
		map.remove();
		map = null;
		document.body.removeChild(c);
	});

	it('create VideoOverlay', function () {
		var overlay = L.imageOverlay().setStyle({opacity: 0.5});
		expect(overlay.options.opacity).to.equal(0.5);


		var videoUrls = [
			'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
			'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
		];

		var videoOverlay = L.videoOverlay(videoUrls, videoBounds).addTo(map);

		expect(map.hasLayer(videoOverlay)).to.be.ok();
	});
});
