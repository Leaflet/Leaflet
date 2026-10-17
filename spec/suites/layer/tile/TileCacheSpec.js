import {expect} from 'chai';
import {LeafletMap, TileLayer} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('previous zoom image tiles', () => {
	let container, map;
	const image = `data:image/svg+xml,${  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="blue"/></svg>')}`;

	beforeEach(() => {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {fadeAnimation: false, zoomAnimation: true}).setView([0, 0], 11);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	function change(layer, action) {
		return new Promise((resolve) => {
			function finish() {
				layer.off('load', finish);
				resolve(layer);
			}
			layer.once('load', finish);
			action();
			if (!layer.isLoading()) { finish(); }
		}).then(() => {
			layer._pruneTiles();
			return layer;
		});
	}

	function atZoom(layer, zoom) {
		return new Promise((resolve) => {
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
		const layer = new TileLayer(url || image, options);
		return change(layer, () => { layer.addTo(map); });
	}

	function visibleImagesAt(layer) {
		const bounds = container.getBoundingClientRect();
		const x = bounds.left + 37, y = bounds.top + 53;
		return Object.values(layer._tiles).filter((tile) => {
			const rect = tile.el.getBoundingClientRect();
			return getComputedStyle(tile.el).visibility === 'visible' &&
				rect.left <= x && rect.right > x && rect.top <= y && rect.bottom > y;
		});
	}

	function olderTiles(layer) {
		return Object.keys(layer._tiles).map(key => layer._tiles[key])
			.filter(tile => tile.coords.z !== layer._tileZoom);
	}

	it('reuses the same loaded image elements when zooming back', () => {
		let layer, original;
		return addLayer().then((loaded) => {
			layer = loaded;
			original = {...layer._tiles};
			return atZoom(layer, 14);
		}).then(() => {
			expect(olderTiles(layer).length).to.equal(Object.keys(original).length);
			return atZoom(layer, 11);
		}).then(() => {
			Object.keys(original).forEach((key) => {
				expect(layer._tiles[key].el).to.equal(original[key].el);
				expect(layer._tiles[key].active).to.equal(true);
			});
		});
	});

	it('retains only the configured number of images nearest the map center', () => {
		let layer, original, center;
		return addLayer({keepPreviousTiles: 2}).then((loaded) => {
			layer = loaded;
			original = Object.keys(layer._tiles).map(key => layer._tiles[key]);
			center = map.project(map.getCenter(), 11).unscaleBy(layer.getTileSize()).subtract([0.5, 0.5]);
			return atZoom(layer, 14);
		}).then(() => {
			const kept = olderTiles(layer);
			expect(kept.length).to.equal(2);
			const farthest = Math.max(...kept.map(tile => tile.coords.distanceTo(center)));
			original.filter(tile => !kept.includes(tile)).forEach((tile) => {
				expect(tile.coords.distanceTo(center) >= farthest).to.equal(true);
			});
		});
	});

	it('evicts zoom history beyond the immediately previous tile level', () => {
		let layer;
		return addLayer().then((loaded) => {
			layer = loaded;
			return atZoom(layer, 12);
		}).then(() => atZoom(layer, 13))
			.then(() => atZoom(layer, 14))
			.then(() => {
				expect(olderTiles(layer).length > 0).to.equal(true);
				expect(olderTiles(layer).every(tile => tile.coords.z === 13)).to.equal(true);
				expect(olderTiles(layer).length <= 128).to.equal(true);
			});
	});

	it('allows previous-level retention to be disabled', () => {
		let layer;
		return addLayer({keepPreviousTiles: 0}).then((loaded) => {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(() => { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('does not retain failed images', () => {
		let layer;
		return addLayer({}, 'data:image/png;base64,AA==').then((loaded) => {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(() => { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('clears previous images when redrawing', () => {
		let layer;
		return addLayer().then((loaded) => {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(() => {
			expect(olderTiles(layer).length > 0).to.equal(true);
			return change(layer, () => { layer.redraw(); });
		}).then(() => { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('clears retained images and zoom history on layer removal', () => {
		let layer;
		return addLayer().then((loaded) => {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(() => {
			layer.remove();
			expect(Object.keys(layer._tiles).length).to.equal(0);
			expect(layer._previousTileZoom).to.equal(undefined);
			return change(layer, () => { layer.addTo(map); });
		}).then(() => { expect(olderTiles(layer).length).to.equal(0); });
	});

	it('keeps cached images opaque when fade animation is enabled', () => {
		map.remove();
		map = new LeafletMap(container, {fadeAnimation: true, zoomAnimation: true}).setView([0, 0], 11);
		let layer, original;
		return addLayer().then((loaded) => {
			layer = loaded;
			return new Promise((resolve) => { setTimeout(resolve, 300); });
		}).then(() => {
			original = {...layer._tiles};
			return atZoom(layer, 14);
		}).then(() => atZoom(layer, 11))
			.then(() => {
				Object.keys(original).forEach((key) => {
					expect(layer._tiles[key].el).to.equal(original[key].el);
					expect(layer._tiles[key].el.style.opacity).to.equal('1');
				});
			});
	});

	it('does not retain images that have not become opaque', () => {
		let layer;
		return addLayer().then((loaded) => {
			layer = loaded;
			Object.keys(layer._tiles).forEach((key) => { layer._tiles[key].active = false; });
			return atZoom(layer, 14);
		}).then(() => { expect(olderTiles(layer).length).to.equal(0); });
	});
	it('does not composite retained images behind transparent current tiles', () => {
		const transparent = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="blue" fill-opacity="0.5"/></svg>')}`;
		let layer;
		return addLayer({}, transparent).then((loaded) => {
			layer = loaded;
			expect(visibleImagesAt(layer).length).to.equal(1);
			return atZoom(layer, 14);
		}).then(() => {
			expect(olderTiles(layer).length > 0).to.equal(true);
			expect(visibleImagesAt(layer).length).to.equal(1);
			return atZoom(layer, 11);
		}).then(() => {
			expect(visibleImagesAt(layer).length).to.equal(1);
			expect(visibleImagesAt(layer)[0].coords.z).to.equal(11);
		});
	});

	it('shows cached parent images only while current tiles need a fallback', () => {
		let layer;
		return addLayer().then((loaded) => {
			layer = loaded;
			return atZoom(layer, 14);
		}).then(() => {
			expect(visibleImagesAt(layer).filter(tile => tile.coords.z === 11).length).to.equal(0);
			Object.values(layer._tiles).filter(tile => tile.current).forEach((tile) => { tile.active = false; });
			layer._pruneTiles();
			expect(visibleImagesAt(layer).filter(tile => tile.coords.z === 11).length).to.equal(1);
			Object.values(layer._tiles).filter(tile => tile.current).forEach((tile) => { tile.active = true; });
			layer._pruneTiles();
			expect(visibleImagesAt(layer).filter(tile => tile.coords.z === 11).length).to.equal(0);
		});
	});

});
