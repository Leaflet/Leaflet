describe('tile loading during zoom-out', function () {
	var container, map;

	beforeEach(function () {
		container = createContainer('800px', '600px');
		map = new L.Map(container, {fadeAnimation: false, zoomAnimation: true}).setView([0, 0], 3);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	it('finishes one loading cycle when the zoom-out button is clicked', function () {
		var image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="blue"/></svg>');
		var layer = new L.TileLayer(image, {keepPreviousTiles: 0});
		return new Promise(function (resolve) {
			layer.once('load', resolve).addTo(map);
		}).then(function () {
			return new Promise(function (resolve, reject) {
				var loading = 0;
				layer.on('loading', function () { loading++; });
				function finish() {
					if (map.getZoom() !== 2 || map._animatingZoom || layer.isLoading()) { return; }
					map.off('moveend', finish);
					layer.off('load', finish);
					try {
						expect(loading).to.equal(1);
						resolve();
					} catch (error) {
						reject(error);
					}
				}
				map.on('moveend', finish);
				layer.on('load', finish);
				container.querySelector('.leaflet-control-zoom-out').click();
			});
		});
	});
});
