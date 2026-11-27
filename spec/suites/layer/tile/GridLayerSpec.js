import {DomUtil, GridLayer, LeafletMap, Point} from 'leaflet';
import sinon from 'sinon';
import {createClock, createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('GridLayer', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);
		container.style.width = '800px';
		container.style.height = '600px';
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	async function expectImmediateTileCompletion(error) {
		class ImmediateGridLayer extends GridLayer {
			createTile(coords, done) {
				const tile = document.createElement('div');
				done(error, tile);
				return tile;
			}
		}

		const grid = new ImmediateGridLayer();
		const started = new Set(), finished = new Set();
		grid.on('tileloadstart', ({tile}) => started.add(tile));
		grid.on(error ? 'tileerror' : 'tileload', ({tile, error: reportedError}) => {
			expect(started.has(tile)).to.be.true;
			if (error) { expect(reportedError).to.equal(error); }
			finished.add(tile);
		});

		grid.addTo(map.setView([0, 0], 2));
		await new Promise((resolve) => { requestAnimationFrame(resolve); });

		expect(started.size).to.be.greaterThan(0);
		expect(finished).to.eql(started);
		expect(grid.isLoading()).to.be.false;
	}

	it('reports synchronous tile completion after tileloadstart', () => expectImmediateTileCompletion(null));

	it('reports synchronous tile errors after tileloadstart', () => expectImmediateTileCompletion(new Error('tile creation failed')));

	describe('#redraw', () => {
		it('can be called before map.setView', () => {
			const grid = new GridLayer().addTo(map);
			expect(grid.redraw()).to.equal(grid);
		});

		it('uses integer tile zoom with fractional map zoom', () => {
			map.options.zoomSnap = 0.1;
			map.setView([0, 0], 2.4);
			const grid = new GridLayer().addTo(map);
			grid._tileZoom = undefined;
			grid.redraw();
			expect(grid._tileZoom).to.equal(2);
		});

		describe('keeping the old tiles', () => {
			let grid, pending, clock;

			// tiles load only when the spec says so
			class ManualGridLayer extends GridLayer {
				createTile(coords, done) {
					const tile = document.createElement('div');
					pending.push(() => done(null, tile));
					return tile;
				}
			}

			function loadAll() {
				const callbacks = pending;
				pending = [];
				for (const fn of callbacks) { fn(); }
			}

			const tileEls = () => [...grid._container.querySelectorAll('.leaflet-tile')];

			beforeEach(() => {
				pending = [];
				map.remove();
				map = new LeafletMap(container, {fadeAnimation: false}).setView([0, 0], 10);
				grid = new ManualGridLayer().addTo(map);
				loadAll();
			});

			afterEach(() => { clock?.restore(); clock = undefined; });

			it('keeps them under the new ones until each new tile loads', () => {
				const oldEls = tileEls(), unloaded = [];
				grid.on('tileunload', e => unloaded.push(e.tile));

				grid.redraw();
				expect(tileEls()).to.have.length(oldEls.length * 2);
				expect(oldEls.every(el => el.isConnected)).to.be.true;
				expect(unloaded).to.have.length(0);

				pending.shift()();
				expect(unloaded).to.eql([oldEls[0]]);
				expect(oldEls[0].isConnected).to.be.false;

				loadAll();
				expect(unloaded).to.have.length(oldEls.length);
				expect(tileEls()).to.have.length(oldEls.length);
			});

			it('keeps the loaded tiles on repeated redraws', () => {
				const oldEls = tileEls();

				grid.redraw();
				grid.redraw();
				expect(tileEls()).to.have.length(oldEls.length * 2);
				expect(oldEls.every(el => el.isConnected)).to.be.true;

				loadAll();
				expect(tileEls()).to.have.length(oldEls.length);
				expect(oldEls.some(el => el.isConnected)).to.be.false;
			});

			it('removes them with the new tiles that leave the view', () => {
				const oldEls = tileEls();

				grid.redraw();
				map.panBy([2000, 0], {animate: false});
				loadAll();
				expect(oldEls.some(el => el.isConnected)).to.be.false;
				expect(tileEls()).to.have.length(Object.keys(grid._tiles).length);
			});

			it('removes them when the new tiles fade in', () => {
				clock = createClock();
				map.remove();
				map = new LeafletMap(container).setView([0, 0], 10);
				grid = new ManualGridLayer().addTo(map);
				loadAll();
				clock.tick(250);
				const oldEls = tileEls();

				grid.redraw();
				loadAll();
				expect(oldEls.every(el => el.isConnected)).to.be.true;

				clock.tick(250);
				expect(oldEls.some(el => el.isConnected)).to.be.false;
				expect(tileEls()).to.have.length(oldEls.length);
			});
		});
	});

	describe('#setOpacity', () => {
		it('can be called before map.setView', () => {
			const grid = new GridLayer().addTo(map);
			expect(grid.setOpacity(0.5)).to.equal(grid);
		});

		it('works when map has fadeAnimated=false', (done) => {
			map.remove();
			map = new LeafletMap(container, {fadeAnimation: false}).setView([0, 0], 0);

			const grid = new GridLayer().setOpacity(0.5).addTo(map);
			grid.on('load', () => {
				expect(grid._container.style.opacity).to.equal('0.5');
				done();
			});
		});
	});

	it('positions tiles correctly with wrapping and bounding', () => {
		map.setView([0, 0], 1);

		const tiles = [];

		const grid = new GridLayer();
		grid.createTile = function (coords) {
			const tile = document.createElement('div');
			tiles.push({coords, tile});
			return tile;
		};

		map.addLayer(grid);

		const loaded = {};

		for (const tile of tiles) {
			const coords = tile.coords,
			pos = DomUtil.getPosition(tile.tile);

			loaded[`${pos.x}:${pos.y}`] = [coords.x, coords.y];
		}

		expect(loaded).to.eql({
			'144:0': [0, 0],
			'400:0': [1, 0],
			'144:256': [0, 1],
			'400:256': [1, 1],
			'-112:0': [1, 0],
			'656:0': [0, 0],
			'-112:256': [1, 1],
			'656:256': [0, 1]
		});
	});

	describe('tile pyramid', () => {
		let clock;

		beforeEach(() => {
			clock = createClock();
		});

		afterEach(() => {
			clock.restore();
		});

		it('removes tiles for unused zoom levels', (done) => {
			map.remove();
			map = new LeafletMap(container, {fadeAnimation: false});
			map.setView([0, 0], 1);

			const grid = new GridLayer();
			const tiles = {};

			grid.createTile = function (coords) {
				tiles[grid._tileCoordsToKey(coords)] = true;
				return document.createElement('div');
			};

			grid.on('tileunload', (e) => {
				delete tiles[grid._tileCoordsToKey(e.coords)];
			});

			grid.on('load', () => {
				if (Object.keys(tiles).length === 1) {
					expect(Object.keys(tiles)).to.eql(['0:0:0']);
					grid.off();
					done();
				}
			});

			map.addLayer(grid);
			map.setZoom(0, {animate: false});
			clock.tick(250);
		});
	});

	describe('#createTile', () => {
		let grid;

		beforeEach(() => {
			// Simpler sizes to test.
			container.style.width = '512px';
			container.style.height = '512px';

			map.setView([0, 0], 10);

			grid = new GridLayer();
		});

		it('only creates tiles for visible area on zoom in', (done) => {
			map._zoomAnimated = false; // fixme https://github.com/Leaflet/Leaflet/issues/7116
			let count = 0,
			loadCount = 0;
			grid.createTile = function () {
				count++;
				return document.createElement('div');
			};
			const onLoad = function () {
				expect(count).to.eql(4);
				count = 0;
				loadCount++;
				if (loadCount === 1) {  // On layer add.
					map.zoomIn();
				} else {  // On zoom in.
					done();
				}
			};
			grid.on('load', onLoad);
			map.addLayer(grid);
		});

		describe('when done() is called with an error parameter', () => {
			let keys;

			beforeEach(() => {
				keys = [];
				grid.createTile = function (coords, done) {
					const tile = document.createElement('div');
					keys.push(this._tileCoordsToKey(coords));
					// async like a real tile, so that the tile is registered by the time it's reported as failed
					queueMicrotask(() => done('error', tile));
					return tile;
				};
			});

			it('does not raise tileload events', (done) => {
				const tileLoadRaised = sinon.spy();
				grid.on('tileload', tileLoadRaised);
				grid.on('load', () => {
					expect(keys.length).to.equal(4);
					expect(tileLoadRaised.notCalled).to.be.true;
					done();
				});
				map.addLayer(grid);
			});

			it('raises tileerror events', (done) => {
				const tileErrorRaised = sinon.spy();
				grid.on('tileerror', tileErrorRaised);
				grid.on('load', () => {
					expect(tileErrorRaised.callCount).to.equal(4);
					done();
				});
				map.addLayer(grid);
			});

			it('does not add the .leaflet-tile-loaded class to tile elements', (done) => {
				grid.on('load', () => {
					const tiles = Object.values(grid._tiles);
					expect(tiles.length).to.equal(4);
					for (const tile of tiles) {
						expect(tile.el.classList.contains('leaflet-tile-loaded')).to.be.false;
					}
					done();
				});
				map.addLayer(grid);
			});
		});

	});

	describe('#onAdd', () => {
		it('is called after zoomend on first map load', () => {
			const layer = new GridLayer().addTo(map);

			const onAdd = layer.onAdd,
			onAddSpy = sinon.spy();
			layer.onAdd = function (...args) {
				onAdd.apply(this, args);
				onAddSpy();
			};

			const onReset = sinon.spy();
			map.on('zoomend', onReset);
			map.setView([0, 0], 0);

			expect(onAddSpy.calledOnce).to.be.true;
			expect(onReset.calledBefore(onAddSpy)).to.be.true;
		});
	});

	describe('zoom animation', () => {
		let clock;
		beforeEach(() => { clock = createClock(); });
		afterEach(() => { clock.restore(); });

		it('zooms the container as a whole and resets it when the animation ends', (done) => {
			const grid = new GridLayer().addTo(map.setView([0, 0], 10));

			// loaded, so the z10 tiles stay under the z11 ones still loading at the end
			grid.once('load', () => {
				const oldTransform = grid._levels[10].el.style.transform;

				map._moveStart(true, false);
				map._animateZoom(map.getCenter(), 11);
				expect(grid._container.style.transform).to.contain('scale(2)');
				expect(grid._levels[10].el.style.transform).to.equal(oldTransform);
				expect(grid._levels[11].el.style.transform).to.contain('scale(0.5)');

				clock.tick(1000);
				expect(grid._container.style.transform).to.equal('');
				expect(grid._levels[10].el.style.transform).to.contain('scale(2)');
				expect(grid._levels[11].el.style.transform).to.contain('scale(1)');
				done();
			});
		});

		it('resets the container when the animation ends at the same zoom', () => {
			const grid = new GridLayer().addTo(map.setView([0, 0], 10));

			map._moveStart(true, false);
			map._animateZoom(map.containerPointToLatLng([500, 400]), 10, true);
			expect(grid._container.style.transform).to.contain('translate3d(-100px, -100px, 0px)');

			clock.tick(1000);
			expect(grid._container.style.transform).to.equal('');
			expect(grid._levels[10].el.style.transform).to.contain('translate3d(-100px, -100px, 0px)');
		});
	});

	describe('#getMaxZoom, #getMinZoom', () => {
		beforeEach(() => {
			map.setView([0, 0], 1);
		});

		describe('when a gridlayer is added to a map with no other layers', () => {
			it('has the same zoomlevels as the gridlayer', () => {
				const maxZoom = 10,
				minZoom = 5;

				new GridLayer({
					maxZoom,
					minZoom
				}).addTo(map);

				expect(map.getMaxZoom()).to.equal(maxZoom);
				expect(map.getMinZoom()).to.equal(minZoom);
			});
		});

		describe('accessing a gridlayer\'s properties', () => {
			it('provides a container', () => {
				const layer = new GridLayer().addTo(map);
				expect(layer.getContainer()).to.be.ok;
			});
		});

		describe('when a gridlayer is added to a map that already has a gridlayer', () => {
			it('has its zoomlevels updated to fit the new layer', () => {
				new GridLayer({minZoom: 10, maxZoom: 15}).addTo(map);
				expect(map.getMinZoom()).to.equal(10);
				expect(map.getMaxZoom()).to.equal(15);

				new GridLayer({minZoom: 5, maxZoom: 10}).addTo(map);
				expect(map.getMinZoom()).to.equal(5);  // changed
				expect(map.getMaxZoom()).to.equal(15); // unchanged

				new GridLayer({minZoom: 10, maxZoom: 20}).addTo(map);
				expect(map.getMinZoom()).to.equal(5);  // unchanged
				expect(map.getMaxZoom()).to.equal(20); // changed


				new GridLayer({minZoom: 0, maxZoom: 25}).addTo(map);
				expect(map.getMinZoom()).to.equal(0); // changed
				expect(map.getMaxZoom()).to.equal(25); // changed
			});
		});

		describe('when a gridlayer is removed from a map', () => {
			it('has its zoomlevels updated to only fit the layers it currently has', () => {
				const tiles = [
					new GridLayer({minZoom: 10, maxZoom: 15}).addTo(map),
					new GridLayer({minZoom: 5, maxZoom: 10}).addTo(map),
					new GridLayer({minZoom: 10, maxZoom: 20}).addTo(map),
					new GridLayer({minZoom: 0, maxZoom: 25}).addTo(map)
				];
				expect(map.getMinZoom()).to.equal(0);
				expect(map.getMaxZoom()).to.equal(25);

				map.removeLayer(tiles[0]);
				expect(map.getMinZoom()).to.equal(0);
				expect(map.getMaxZoom()).to.equal(25);

				map.removeLayer(tiles[3]);
				expect(map.getMinZoom()).to.equal(5);
				expect(map.getMaxZoom()).to.equal(20);

				map.removeLayer(tiles[2]);
				expect(map.getMinZoom()).to.equal(5);
				expect(map.getMaxZoom()).to.equal(10);

				map.removeLayer(tiles[1]);
				expect(map.getMinZoom()).to.equal(0);
				expect(map.getMaxZoom()).to.equal(Infinity);
			});
		});
	});

	describe('when removed from a tile event listener', () => {
		let done;

		class AsyncGrid extends GridLayer {
			createTile(coords, tileDone) {
				const tile = document.createElement('div');
				done.push(() => tileDone(null, tile));
				return tile;
			}
		}

		beforeEach(() => {
			done = [];
			map.options.fadeAnimation = false;
			map.setView([0, 0], 0);
		});

		it('does not throw when the map is removed on load', () => {
			const grid = new AsyncGrid().addTo(map);
			const onLoad = sinon.spy(() => { map.remove(); map = null; });
			grid.on('load', onLoad);

			for (const fn of done) { fn(); }
			expect(onLoad.calledOnce).to.be.true;
		});

		it('does not fire load when the layer is removed on tileload', () => {
			const grid = new AsyncGrid().addTo(map);
			const onLoad = sinon.spy();
			grid.once('tileload', () => grid.remove());
			grid.on('load', onLoad);

			for (const fn of done) { fn(); }
			expect(onLoad.called).to.be.false;
		});
	});

	describe('fractional zoom outside min/maxZoom', () => {
		let grid, created;

		beforeEach(() => {
			map.options.zoomSnap = 0.1;
			map.options.minZoom = 0;
			map.options.maxZoom = 5;
			created = 0;
			grid = new GridLayer({minZoom: 2, maxZoom: 3});
			grid.createTile = function () {
				created++;
				return document.createElement('div');
			};
		});

		it('hides the layer just past maxZoom without creating tiles', () => {
			map.setView([0, 0], 3);
			grid.addTo(map);
			expect(created).to.be.above(0);

			created = 0;
			map.setZoom(3.1, {animate: false});
			map.setZoom(3.2, {animate: false});
			expect(created).to.equal(0);
			expect(grid._tileZoom).to.equal(undefined);
			expect(Object.keys(grid._tiles)).to.have.length(0);
		});

		it('hides the layer just below minZoom without creating tiles', () => {
			map.setView([0, 0], 1.9);
			grid.addTo(map);
			expect(created).to.equal(0);
			expect(grid._tileZoom).to.equal(undefined);
		});

		it('does not create tiles on redraw past maxZoom', () => {
			map.setView([0, 0], 3.1);
			grid.addTo(map);
			grid.redraw();
			expect(created).to.equal(0);
			expect(Object.keys(grid._tiles)).to.have.length(0);
		});
	});

	describe('min/maxNativeZoom option', () => {
		it('calls createTile() with maxNativeZoom when map zoom is larger', (done) => {
			map.setView([0, 0], 10);

			const grid = new GridLayer({
				maxNativeZoom: 5
			});
			let tileCount = 0;

			grid.createTile = function (coords) {
				expect(coords.z).to.equal(5);
				tileCount++;
				return document.createElement('div');
			};
			grid.on('load', () => {
				if (tileCount > 0) {
					done();
				} else {
					done('No tiles loaded');
				}
			});

			map.addLayer(grid);
		});

		it('calls createTile() with minNativeZoom when map zoom is smaller', (done) => {
			map.setView([0, 0], 3);

			const grid = new GridLayer({
				minNativeZoom: 5
			});
			let tileCount = 0;

			grid.createTile = function (coords) {
				expect(coords.z).to.equal(5);
				tileCount++;
				return document.createElement('div');
			};
			grid.on('load', () => {
				if (tileCount > 0) {
					done();
				} else {
					done('No tiles loaded');
				}
			});

			map.addLayer(grid);
		});

		it('redraws tiles properly after changing maxNativeZoom', () => {
			const initialZoom = 12;
			map.setView([0, 0], initialZoom);

			const grid = new GridLayer().addTo(map);
			expect(grid._tileZoom).to.equal(initialZoom);

			grid.options.maxNativeZoom = 11;
			grid.redraw();
			expect(grid._tileZoom).to.equal(11);
		});
	});

	describe('number of 256px tiles loaded in synchronous non-animated grid @800x600px', () => {
		let clock, grid, counts;

		beforeEach(() => {
			clock = createClock();

			grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 256)
			});

			grid.createTile = function (coords) {
				const tile = document.createElement('div');
				tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
				tile.style.border = '2px solid red';
				return tile;
			};

			counts = {
				tileload: 0,
				tileerror: 0,
				tileloadstart: 0,
				tileunload: 0
			};

			grid.on('tileload tileunload tileerror tileloadstart', (ev) => {
				counts[ev.type]++;
			});

			map.remove();
			map = new LeafletMap(container, {fadeAnimation: false, zoomAnimation: false});
		});

		afterEach(() => {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		it('Loads 8 tiles zoom 1', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(8);
				expect(counts.tileload).to.equal(8);
				expect(counts.tileunload).to.equal(0);
				done();
			});

			map.addLayer(grid).setView([0, 0], 1);
			clock.tick(250);
		});

		it('Loads 5 tiles zoom 0', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(5);
				expect(counts.tileload).to.equal(5);
				expect(counts.tileunload).to.equal(0);
				done();
			});

			map.addLayer(grid).setView([0, 0], 0);
			clock.tick(250);
		});

		it('Loads 16 tiles zoom 10', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off();

				done();
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it('Loads 32, unloads 16 tiles zooming in 10-11', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				grid.on('load', () => {
					expect(counts.tileloadstart).to.equal(32);
					expect(counts.tileload).to.equal(32);

					// the z10 tiles under the new ones go on the next frame
					requestAnimationFrame(() => {
						expect(counts.tileunload).to.equal(16);
						done();
					});
				});

				map.setZoom(11, {animate: false});
				// the 4 z10 tiles under the new view stay until the z11 ones load
				expect(counts.tileunload).to.equal(12);
				clock.tick(250);
			});


			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it('Loads 32, unloads 16 tiles zooming out 11-10', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				grid.on('load', () => {
					expect(counts.tileloadstart).to.equal(32);
					expect(counts.tileload).to.equal(32);

					// the z11 tiles over the new ones go on the next frame
					requestAnimationFrame(() => {
						expect(counts.tileunload).to.equal(16);
						done();
					});
				});

				map.setZoom(10, {animate: false});
				// the z11 tiles stay until the z10 ones load
				expect(counts.tileunload).to.equal(0);
				clock.tick(250);
			});


			map.addLayer(grid).setView([0, 0], 11);
			clock.tick(250);
		});

		it('Loads 32, unloads 16 tiles zooming out 18-10', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				grid.on('load', () => {
					expect(counts.tileloadstart).to.equal(32);
					expect(counts.tileload).to.equal(32);
					expect(counts.tileunload).to.equal(16);
					done();
				});

				map.setZoom(10, {animate: false});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 18);
			clock.tick(250);
		});

		it('keeps the old tiles when zooming after panning a screen away', (done) => {
			grid.once('load', () => {
				map.panBy([1000, 0], {animate: false});
				grid.once('load', () => {
					const unloaded = counts.tileunload;
					map.setZoom(11, {animate: false});
					expect(counts.tileunload - unloaded).to.be.lessThan(16);
					done();
				});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it('unloads all tiles at once when zooming to another place', (done) => {
			grid.once('load', () => {
				map.setView([60, 60], 11, {animate: false});
				expect(counts.tileunload).to.equal(16);
				done();
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});
	});

	describe('number of 256px tiles loaded in synchronous animated grid @800x600px', () => {
		let clock, grid, counts;

		beforeEach(() => {
			clock = createClock();

			grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 256)
			});

			grid.createTile = function (coords) {
				const tile = document.createElement('div');
				tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
				tile.style.border = '2px solid red';
				return tile;
			};

			counts = {
				tileload: 0,
				tileerror: 0,
				tileloadstart: 0,
				tileunload: 0
			};

			grid.on('tileload tileunload tileerror tileloadstart', (ev) => {
				counts[ev.type]++;
			});
		});

		afterEach(() => {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		// calls `start`, then synchronously runs up to n frames of 40ms (~25fps) while any animation frame
		// callbacks are queued, instead of waiting for real frames
		function runFrames(n, start) {
			const callbacks = [];
			const raf = sinon.stub(window, 'requestAnimationFrame').callsFake(cb => callbacks.push(cb));
			start();
			for (let i = 0; i < n && callbacks.length; i++) {
				clock.tick(40);
				map.fire('_frame');
				for (const cb of callbacks.splice(0)) { cb(); }
			}
			raf.restore();
		}

		it('Loads 32, unloads 16 tiles zooming in 10-11', (done) => {
			clock.tick(1);
			// Date.now() is 1.

			grid.once('load', () => {
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				requestAnimationFrame(() => {
					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the z10 tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', () => {
						expect(counts.tileload).to.equal(32);

						// We're one frame into the zoom animation,
						// so GridLayer._setView with noPrune === undefined is not called yet
						// No tile should be unloaded yet.
						expect(counts.tileunload).to.equal(0);

						// Wait for the zoom animation to end, which triggers the tile pruning. Without
						// 'transitionend' under fake timers, it ends on the map's 1s fallback timer and fires "zoom"
						// => GridLayer._resetView => GridLayer._setView => _pruneTiles
						// However, this "load" event callback executes synchronously,
						// i.e. _tileReady still did not have a chance to prepare the
						// setTimeout(250) for pruning after the end of the fade-in animation.
						clock.tick(1000);
						// At 501ms, the fade-in of the z11 tiles finishes and flags them as "active" (without
						// pruning during the zoom animation). At ~1300ms, the pruneTile from the end of the zoom
						// animation executes and unloads all 16 tiles from z10, since z11 tiles now cover them.
						expect(counts.tileunload).to.equal(16);
						// Date.now() is 1301.
						done();
					});

					map.setZoom(11, {animate: true});
					// Animation (and new tiles loading) starts after 1 frame.
					requestAnimationFrame(() => {
						// 16 extra tiles from z11 being loaded. Total 16 + 16 = 32.
						expect(counts.tileloadstart).to.equal(32);
					});

				});
			});

			map.addLayer(grid).setView([0, 0], 10);
			// The first setView does not animated, therefore it starts loading tiles immediately.
			// 16 tiles from z10 being loaded.
			expect(counts.tileloadstart).to.equal(16);
			// At 1ms, first pruneTile (map fires "viewreset" event => GridLayer._resetView => GridLayer._setView => _pruneTiles).
		});

		it('Loads 32, unloads 16 tiles zooming in 10-18', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				grid.on('load', () => {

					// In this particular scenario, the tile unloads happen in the
					// next render frame after the grid's 'load' event.
					requestAnimationFrame(() => {
						expect(counts.tileloadstart).to.equal(32);
						expect(counts.tileload).to.equal(32);
						expect(counts.tileunload).to.equal(16);
						done();
					});
				});

				map.setZoom(18, {animate: true});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it('Loads 32, unloads 16 tiles zooming out 11-10', (done) => {
			clock.tick(1);
			// Date.now() is 1.

			grid.once('load', () => {
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				requestAnimationFrame(() => {
					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the z11 tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', () => {
						expect(counts.tileload).to.equal(32);
						// No tile should be unloaded during the zoom animation.
						expect(counts.tileunload).to.equal(0);

						// Wait for the zoom animation to end on the map's 1s fallback timer. The z10 tiles
						// finished fading in during the animation, so the prune at its end unloads all 16
						// tiles from z11 they cover.
						clock.tick(1000);
						expect(counts.tileloadstart).to.equal(32);
						expect(counts.tileunload).to.equal(16);
						done();
					});
				});

				map.setZoom(10, {animate: true});
				// Animation (and new tiles loading) starts after 1 frame.
				requestAnimationFrame(() => {
					// We're one frame into the zoom animation, there are 16 tiles for z11 plus 16 tiles for
					// z10 covering the bounds at the *end* of the zoom-*out* anim
					expect(counts.tileloadstart).to.equal(32);
				});
			});

			map.addLayer(grid).setView([0, 0], 11);
			// The first setView does not animated, therefore it starts loading tiles immediately.
			// 16 tiles from z10 being loaded.
			expect(counts.tileloadstart).to.equal(16);
		});

		it('Loads 32, unloads 16 tiles zooming out 18-10', (done) => {
			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				grid.on('load', () => {

					// In this particular scenario, the tile unloads happen in the
					// next render frame after the grid's 'load' event.
					requestAnimationFrame(() => {
						expect(counts.tileloadstart).to.equal(32);
						expect(counts.tileload).to.equal(32);
						expect(counts.tileunload).to.equal(16);
						done();
					});
				});

				map.setZoom(10, {animate: true});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 18);
			clock.tick(250);
		});

		it('keeps the old tiles on screen while zooming in', (done) => {
			grid.once('load', () => {
				// the animation ends on the map's 1s fallback timer under fake timers
				map.setZoom(12, {animate: true});
				requestAnimationFrame(() => {
					clock.tick(500);
					expect(counts.tileunload).to.equal(0);
					done();
				});
			});

			map.addLayer(grid).setView([0, 0], 10);
		});

		it('loads tiles only at the target zoom when animating by more than one level', (done) => {
			grid.once('load', () => {
				const zooms = new Set();
				grid.on('tileloadstart', ({coords}) => zooms.add(coords.z));
				map.setZoom(7, {animate: true});
				requestAnimationFrame(() => {
					expect(grid._tileZoom).to.equal(7);
					expect([...zooms]).to.eql([7]);
					done();
				});
			});

			map.addLayer(grid).setView([0, 0], 10);
		});

		it('prunes after a pinch when the move ends, not when new tiles fade in during it', (done) => {
			grid.once('load', () => {
				map._moveStart(true, false);
				map._move(map.getCenter(), 9.4, {pinch: true});

				grid.once('load', () => {
					clock.tick(300); // fade-in
					requestAnimationFrame(() => {
						expect(counts.tileunload).to.equal(0);

						map._moveEnd(true);
						expect(counts.tileunload).to.be.greaterThan(0);
						done();
					});
				});
			});

			map.addLayer(grid).setView([0, 0], 10);
		});

		it('Loads 290, unloads 275 tiles on MAD-TRD flyTo()', (done) => {
			const mad = [40.40, -3.7], trd = [63.41, 10.41];

			grid.once('load', () => {
				expect(counts).to.deep.equal({
					tileloadstart: 12,
					tileload: 12,
					tileunload: 0,
					tileerror: 0,
				});

				map.on('zoomend', () => {
					expect(counts).to.deep.equal({
						tileloadstart: 290,
						tileload: 290,
						tileunload: 275,
						tileerror: 0,
					});
					expect(grid._container.querySelectorAll('div').length).to.equal(16);	// 15 + container
					done();
				});

				runFrames(500, () => map.flyTo(trd, 12, {animate: true}));
			});

			grid.options.keepBuffer = 0;

			map.addLayer(grid).setView(mad, 12);
			clock.tick(250);
		}, 10000);

	});

	describe('configurable tile pruning', () => {
		let clock, grid, counts;

		beforeEach(() => {
			clock = createClock();

			grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 256)
			});

			grid.createTile = function (coords) {
				const tile = document.createElement('div');
				tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
				tile.style.border = '2px solid red';
				return tile;
			};

			counts = {
				tileload: 0,
				tileerror: 0,
				tileloadstart: 0,
				tileunload: 0
			};

			grid.on('tileload tileunload tileerror tileloadstart', (ev) => {
				counts[ev.type]++;
			});

			map.options.fadeAnimation = false;
			map.options.zoomAnimation = false;
		});

		afterEach(() => {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		it('Loads map, moves forth by 512 px, keepBuffer = 0', (done) => {
			clock.tick(1);
			// Date.now() is 1.

			grid.once('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				// Wait for a frame to let the tile fade-in start.
				requestAnimationFrame(() => {

					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the setView tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', () => {
						// Since there is no animation requested,
						// We directly jump to the target position.
						// => 12 new tiles, total = 16 + 12 = 28 tiles.
						expect(counts.tileloadstart).to.equal(28);
						expect(counts.tileload).to.equal(28);

						// Wait for a frame to let the tile fade-in start
						// It will prune the 12 tiles outside the new bounds.
						requestAnimationFrame(() => {
							expect(counts.tileunload).to.equal(12);
							done();
						});
					});

					// Move up 512px => 2 tile rows => 2*4 = 8 new tiles (V and M).
					// Move right 512px => 2 tile columns => 2*4 = 4 new tiles (H) + 4 new tiles (M) in common with vertical pan.
					// Total = 8 + 8 - 4 = 12 new tiles.
					// ..VVMM
					// ..VVMM
					// OOXXHH // O = Old tile, X = Old tile still visible.
					// OOXXHH
					// OOOO
					// OOOO
					map.panBy([512, 512], {animate: false});
				});
			});

			grid.options.keepBuffer = 0;

			// 800px width * 600px height => 4 tiles horizontally * 4 tiles vertically = 16 tiles
			map.addLayer(grid).setView([0, 0], 10);
		});

		it('Loads map, moves forth and back by 512 px, keepBuffer = 0', (done) => {
			grid.once('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				grid.once('load', () => {
					expect(counts.tileloadstart).to.equal(28);
					expect(counts.tileload).to.equal(28);

					// Wait for a frame to let the tile fade-in start
					// It will prune the 12 tiles outside the new bounds.
					requestAnimationFrame(() => {
						expect(counts.tileunload).to.equal(12);

						grid.once('load', () => {
							expect(counts.tileloadstart).to.equal(40);
							expect(counts.tileload).to.equal(40);

							// Wait an extra frame for the tile pruning to happen.
							requestAnimationFrame(() => {
								expect(counts.tileunload).to.equal(24);
								done();
							});
						});

						map.panBy([-512, -512], {animate: false});
						clock.tick(250);
					});
				});

				map.panBy([512, 512], {animate: false});
				clock.tick(250);
			});

			grid.options.keepBuffer = 0;

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it('Loads map, moves forth and back by 512 px, default keepBuffer', (done) => {
			const spy = sinon.spy();

			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				grid.on('load', () => {
					expect(counts.tileloadstart).to.equal(28);
					expect(counts.tileload).to.equal(28);
					expect(counts.tileunload).to.equal(0);
					grid.off('load');

					grid.on('load', spy);

					map.panBy([-512, -512], {animate: false});
					clock.tick(250);

					expect(spy.called).to.be.false;
					done();
				});

				map.panBy([512, 512], {animate: false});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});
	});

	describe('nowrap option', () => {
		it('When false, uses same coords at zoom 0 for all tiles', (done) => {
			const grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 256),
				noWrap: false
			});
			const loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(`${coords.x}:${coords.y}:${coords.z}`);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 0);

			grid.on('load', () => {
				expect(loadedTileKeys).to.eql(['0:0:0', '0:0:0', '0:0:0', '0:0:0', '0:0:0']);
				done();
			});
		});

		it('When true, uses different coords at zoom level 0 for all tiles', (done) => {
			const grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 256),
				noWrap: true
			});
			const loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(`${coords.x}:${coords.y}:${coords.z}`);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 0);

			grid.on('load', () => {
				expect(loadedTileKeys).to.eql(['0:0:0', '-1:0:0', '1:0:0', '-2:0:0', '2:0:0']);
				done();
			});
		});

		it('When true and with bounds, loads just one tile at zoom level 0', (done) => {
			const grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 256),
				bounds: [[-90, -180], [90, 180]],
				noWrap: true
			});
			const loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(`${coords.x}:${coords.y}:${coords.z}`);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 0);

			grid.on('load', () => {
				expect(loadedTileKeys).to.eql(['0:0:0']);
				done();
			});
		});

		it('When false, wraps the columns of non-square tiles by the tile width', (done) => {
			container.style.width = '512px';
			container.style.height = '512px';

			const grid = new GridLayer({
				attribution: 'Grid Layer',
				tileSize: new Point(256, 512),
				noWrap: false
			});
			const loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(`${coords.x}:${coords.y}:${coords.z}`);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 1);

			grid.on('load', () => {
				// At zoom 1 the world is 512px wide, i.e. two columns of 256px tiles
				expect(loadedTileKeys).to.eql(['0:0:1', '1:0:1']);
				done();
			});
		});
	});

	describe('Sanity checks for infinity', () => {
		it('Throws error on map center at plus Infinity longitude', () => {
			expect(() => {
				map.panTo([Infinity, Infinity]);
				new GridLayer().addTo(map);
			}).to.throw('Invalid Point object: (NaN, NaN)');
		});

		it('Throws error on map center at minus Infinity longitude', () => {
			expect(() => {
				map.panTo([-Infinity, -Infinity]);
				new GridLayer().addTo(map);
			}).to.throw('Invalid Point object: (NaN, NaN)');
		});
	});

	it('doesn\'t call map\'s getZoomScale method with null after _invalidateAll method was called', () => {
		map.setView([0, 0], 0);
		const grid = new GridLayer().addTo(map);
		const wrapped = sinon.spy(map, 'getZoomScale');
		grid._invalidateAll();
		grid.redraw();
		expect(wrapped.neverCalledWith(sinon.match.any, null)).to.be.true;
	});
});
