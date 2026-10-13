describe('previous zoom image tiles', function () {
	var LeafletMap = L.Map, TileLayer = L.TileLayer;
	var container, map;
	var image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="blue"/></svg>');

	beforeEach(function () {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {fadeAnimation: false, zoomAnimation: true}).setView([0, 0], 11);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	function change(layer, action) {
		return new Promise(function (resolve) {
			function finish() {
				layer.off('load', finish);
				resolve(layer);
			}
			layer.once('load', finish);
			action();
			if (!layer.isLoading()) { finish(); }
		}).then(function () {
			layer._pruneTiles();
			return layer;
		});
	}

	function atZoom(layer, zoom) {
		return new Promise(function (resolve) {
			function finish() {
				if (map.getZoom() !== zoom || map._animatingZoom || layer.isLoading()) { return; }
				map.off('moveend', finish);
				layer.off('load', finish);
				layer._pruneTiles();
				resolve(layer);
			}
			map.on('moveend', finish);
			layer.on('load', finish);
			map.setZoom(zoom, {animate: true});
		});
	}

	function addLayer(options, url) {
		var layer = new TileLayer(url || image, options);
		return change(layer, function () { layer.addTo(map); });
	}

	function visibleImagesAt(layer) {
		var bounds = container.getBoundingClientRect();
		var x = bounds.left + 37, y = bounds.top + 53;
		return Object.keys(layer._tiles).map(function (key) { return layer._tiles[key]; }).filter(function (tile) {
			var rect = tile.el.getBoundingClientRect();
			return getComputedStyle(tile.el).visibility === 'visible' &&
				rect.left <= x && rect.right > x && rect.top <= y && rect.bottom > y;
		});
	}

	function olderTiles(layer) {
		return Object.keys(layer._tiles).map(function (key) { return layer._tiles[key]; })
			.filter(function (tile) { return tile.coords.z !== layer._tileZoom; });
	}

	it('reuses the same loaded image elements when zooming back', function () {
		var layer, original;
		return addLayer().then(function (loaded) {
			layer = loaded;
			original = Object.assign({}, layer._tiles);
			return atZoom(layer, 14);
		}).then(function () {
			expect(olderTiles(layer).length).to.equal(Object.keys(original).length);
			return atZoom(layer, 11);
		}).then(function () {
			Object.keys(original).forEach(function (key) {
				expect(layer._tiles[key].el).to.equal(original[key].el);
				expect(layer._tiles[key].active).to.equal(true);
			});
		});
	});

	it('retains only the configured number of images nearest the map center', function () {
		var layer, original, center;
		return addLayer({keepPreviousTiles: 2}).then(function (loaded) {
			layer = loaded;
			original = Object.keys(layer._tiles).map(function (key) { return layer._tiles[key]; });
			center = map.project(map.getCenter(), 11).unscaleBy(layer.getTileSize()).subtract([0.5, 0.5]);
			return atZoom(layer, 14);
		}).then(function () {
			var kept = olderTiles(layer);
			expect(kept.length).to.equal(2);
			var farthest = Math.max.apply(null, kept.map(function (tile) { return tile.coords.distanceTo(center); }));
			original.filter(function (tile) { return kept.indexOf(tile) < 0; }).forEach(function (tile) {
				expect(tile.coords.distanceTo(center) >= farthest).to.equal(true);
			});
		});
	});

	it('evicts zoom history beyond the immediately previous tile level', function () {
		var layer;
		return addLayer().then(function (loaded) {
			layer = loaded;
			return atZoom(layer, 12);
		}).then(function () { return atZoom(layer, 13); })
			.then(function () { return atZoom(layer, 14); })
			.then(function () {
				expect(olderTiles(layer).length > 0).to.equal(true);
				expect(olderTiles(layer).every(function (tile) { return tile.coords.z === 13; })).to.equal(true);
				expect(olderTiles(layer).length <= 128).to.equal(true);
			});
	});

	it('allows previous-level retention to be disabled', function () {
		var layer;
		return addLayer({keepPreviousTiles: 0}).then(function (loaded) {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(function () { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('does not retain failed images', function () {
		var layer;
		return addLayer({}, 'data:image/png;base64,AA==').then(function (loaded) {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(function () { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('clears previous images when redrawing', function () {
		var layer;
		return addLayer().then(function (loaded) {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(function () {
			expect(olderTiles(layer).length > 0).to.equal(true);
			return change(layer, function () { layer.redraw(); });
		}).then(function () { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('clears retained images and zoom history on layer removal', function () {
		var layer;
		return addLayer().then(function (loaded) {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(function () {
			layer.remove();
			expect(Object.keys(layer._tiles).length).to.equal(0);
			expect(layer._previousTileZoom).to.equal(undefined);
			return change(layer, function () { layer.addTo(map); });
		}).then(function () { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('keeps cached images opaque when fade animation is enabled', function () {
		map.remove();
		map = new LeafletMap(container, {fadeAnimation: true, zoomAnimation: true}).setView([0, 0], 11);
		var layer, original;
		return addLayer().then(function (loaded) {
			layer = loaded;
			return new Promise(function (resolve) { setTimeout(resolve, 300); });
		}).then(function () {
			original = Object.assign({}, layer._tiles);
			return atZoom(layer, 14);
		}).then(function () { return atZoom(layer, 11); })
			.then(function () {
				Object.keys(original).forEach(function (key) {
					expect(layer._tiles[key].el).to.equal(original[key].el);
					expect(layer._tiles[key].el.style.opacity).to.equal('1');
				});
			});
	});

	it('does not retain images that have not become opaque', function () {
		var layer;
		return addLayer().then(function (loaded) {
			layer = loaded;
			Object.keys(layer._tiles).forEach(function (key) { layer._tiles[key].active = false; });
			return atZoom(layer, 14);
		}).then(function () { expect(olderTiles(layer).length).to.equal(0); });
	});
	it('does not composite retained images behind transparent current tiles', function () {
		var transparent = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="blue" fill-opacity="0.5"/></svg>');
		var layer;
		return addLayer({}, transparent).then(function (loaded) {
			layer = loaded;
			expect(visibleImagesAt(layer).length).to.equal(1);
			return atZoom(layer, 14);
		}).then(function () {
			expect(olderTiles(layer).length > 0).to.equal(true);
			expect(visibleImagesAt(layer).length).to.equal(1);
			return atZoom(layer, 11);
		}).then(function () {
			expect(visibleImagesAt(layer).length).to.equal(1);
			expect(visibleImagesAt(layer)[0].coords.z).to.equal(11);
		});
	});

	it('shows cached parent images only while current tiles need a fallback', function () {
		var layer;
		return addLayer().then(function (loaded) {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(function () {
			expect(visibleImagesAt(layer).filter(function (tile) { return tile.coords.z === 11; }).length).to.equal(0);
			Object.keys(layer._tiles).map(function (key) { return layer._tiles[key]; }).filter(function (tile) { return tile.current; }).forEach(function (tile) { tile.active = false; });
			layer._pruneTiles();
			expect(visibleImagesAt(layer).filter(function (tile) { return tile.coords.z === 11; }).length).to.equal(1);
			Object.keys(layer._tiles).map(function (key) { return layer._tiles[key]; }).filter(function (tile) { return tile.current; }).forEach(function (tile) { tile.active = true; });
			layer._pruneTiles();
			expect(visibleImagesAt(layer).filter(function (tile) { return tile.coords.z === 11; }).length).to.equal(0);
		});
	});

});
