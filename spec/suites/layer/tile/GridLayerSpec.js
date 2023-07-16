import {Map, GridLayer, DomUtil, Point, Util} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('GridLayer', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container);
		container.style.width = '800px';
		container.style.height = '600px';
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#redraw', () => {
		it('can be called before map.setView', () => {
			const grid = new GridLayer().addTo(map);
			expect(grid.redraw()).to.equal(grid);
		});
	});

	describe('#setOpacity', () => {
		it('can be called before map.setView', () => {
			const grid = new GridLayer().addTo(map);
			expect(grid.setOpacity(0.5)).to.equal(grid);
		});

		it('works when map has fadeAnimated=false (IE8 is exempt)', (done) => {
			map.remove();
			map = new Map(container, {fadeAnimation: false}).setView([0, 0], 0);

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

		for (let i = 0; i < tiles.length; i++) {
			const coords = tiles[i].coords,
			    pos = DomUtil.getPosition(tiles[i].tile);

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
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
		});

		it('removes tiles for unused zoom levels', (done) => {
			map.remove();
			map = new Map(container, {fadeAnimation: false});
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
					done('error', tile);
					return tile;
				};
			});

			it('does not raise tileload events', (done) => {
				const tileLoadRaised = sinon.spy();
				grid.on('tileload', tileLoadRaised);
				grid.on('tileerror', () => {
					if (keys.length === 4) {
						expect(tileLoadRaised.notCalled).to.be.true;
						done();
					}
				});
				map.addLayer(grid);
			});

			it('raises tileerror events', (done) => {
				const tileErrorRaised = sinon.spy();
				grid.on('tileerror', () => {
					tileErrorRaised();
					if (keys.length === 4) {
						expect(tileErrorRaised.callCount).to.equal(4);
						done();
					}
				});
				map.addLayer(grid);
			});

			it('does not add the .leaflet-tile-loaded class to tile elements', (done) => {
				let count = 0;
				grid.on('tileerror', (e) => {
					if (!e.tile.classList.contains('leaflet-tile-loaded')) {
						count++;
					}
					if (keys.length === 4) {
						expect(count).to.equal(4);
						done();
					}
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

			expect(onReset.calledBefore(onAddSpy)).to.be.true;
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
			clock = sinon.useFakeTimers();

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
				// console.log(ev.type);
				counts[ev.type]++;
			});
			// grid.on('tileunload', function (ev) {
			// 	console.log(ev.type, ev.coords, counts);
			// });

			map.options.fadeAnimation = false;
			map.options.zoomAnimation = false;
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
					expect(counts.tileunload).to.equal(16);
					done();
				});

				map.setZoom(11, {animate: false});
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
					expect(counts.tileunload).to.equal(16);
					done();
				});

				map.setZoom(10, {animate: false});
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
	});

	describe('number of 256px tiles loaded in synchronous animated grid @800x600px', () => {
		let clock, grid, counts;

		beforeEach(() => {
			clock = sinon.useFakeTimers();

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

		// Debug helper
		/*
		function logTiles(ev) {
			var pending = 0;
			for (var key in grid._tiles) {
				if (!grid._tiles[key].loaded) { pending++; }
			}
			console.log(ev.type + ': ', ev.coords, grid._loading, counts, ' pending: ', pending);
		}
		*/

		// animationFrame helper, just runs requestAnimFrame() a given number of times
		function runFrames(n) {
			return _runFrames(n)();
		}

		function _runFrames(n) {
			if (n) {
				return function () {
					clock.tick(40); // 40msec/frame ~= 25fps
					map.fire('_frame');
					Util.requestAnimFrame(_runFrames(n - 1));
				};
			} else {
				return Util.falseFn;
			}
		}

		it('Loads 32, unloads 16 tiles zooming in 10-11', (done) => {
			// Advance the time to !== 0 otherwise `tile.loaded` timestamp will appear to be falsy.
			clock.tick(1);
			// Date.now() is 1.

			// grid.on('tileload tileunload tileloadstart load loading', logTiles);

			// Use "once" to automatically detach the listener,
			// and avoid removing the above logTiles
			// (which would happen when calling "grid.off('load')").
			grid.once('load', () => {
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				// Wait for a frame to let _updateOpacity starting.
				Util.requestAnimFrame(() => {
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

						// Wait > 250msec for the zoom animation to complete,
						// which triggers the tile pruning
						// Animated zoom takes 1 frame + 250ms before firing "zoom" event
						// => GridLayer._resetView => GridLayer._setView => _pruneTiles
						// However, this "load" event callback executes synchronously,
						// i.e. _tileReady still did not have a chance to prepare the
						// setTimeout(250) for pruning after the end of the fade-in animation.
						clock.tick(300);
						// At 301 + 250 = 551ms, the pruneTile from the end of the zoom animation executes.
						// It unloads the 'outside' 12 tiles from z10, but not the 4 tiles in the center,
						// since _updateOpacity did not have a chance yet to flag the 16 new z11 tiles as "active".
						expect(counts.tileunload).to.equal(12);
						// Date.now() is 601.

						// Wait for a frame to let _updateOpacity starting
						// + _tileReady to be able to prepare its setTimeout(250)
						// for pruning after the end of the fade-in animation.
						// Since we are already > 200ms since the 'load' event fired,
						// _updateOpacity should directly set the current tiles as "active",
						// so the remaining 4 tiles from z10 can then be pruned.
						// However we have skipped any pruning from _updateOpacity,
						// so we will have to rely on the setTimeout from _tileReady.
						Util.requestAnimFrame(() => {
							// Wait > 250msec for the tile fade-in animation to complete,
							// which triggers the tile pruning
							clock.tick(300);
							// At 851ms, the pruneTile from the end of the z11 tiles fade-in animation executes.
							// It unloads the remaining 4 tiles from z10.
							expect(counts.tileunload).to.equal(16);
							// Date.now() is 901.
							done();
						});
					});

					map.setZoom(11, {animate: true});
					// Animation (and new tiles loading) starts after 1 frame.
					Util.requestAnimFrame(() => {
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
					Util.requestAnimFrame(() => {
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
			// Advance the time to !== 0 otherwise `tile.loaded` timestamp will appear to be falsy.
			clock.tick(1);
			// Date.now() is 1.

			// grid.on('tileload tileunload load', logTiles);

			grid.once('load', () => {
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				// Wait for a frame to let _updateOpacity starting.
				Util.requestAnimFrame(() => {
					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the z11 tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', () => {
						expect(counts.tileload).to.equal(20);
						// No tile should be unloaded yet.
						expect(counts.tileunload).to.equal(0);

						// Wait > 250msec for the zoom animation to complete,
						// which triggers the tile pruning, but there are no
						// tiles to prune yet (z11 tiles are all in bounds).
						clock.tick(300);
						// Date.now() is 601.

						// At the end of the animation, all 16 tiles from z10
						// are loading.
						expect(counts.tileloadstart).to.equal(32);
						expect(counts.tileload).to.equal(20);

						// Now that the zoom animation is complete,
						// the grid is ready to fire a new "load" event
						// on next frame, so prepare its listener now.
						// During that frame, _updateOpacity will flag the 4
						// central tiles from z10 as "active", since we are now
						// > 200ms after the first "load" event fired.
						grid.once('load', () => {
							expect(counts.tileload).to.equal(32);
							// No tile should be unloaded yet.
							expect(counts.tileunload).to.equal(0);

							// Wait for a frame for next _updateOpacity to prune
							// all 16 tiles from z11 which are now covered by the
							// 4 central active tiles of z10.
							Util.requestAnimFrame(() => {
								expect(counts.tileunload).to.equal(16);
								done();
							});
						});
					});
				});

				map.setZoom(10, {animate: true});
				// Animation (and new tiles loading) starts after 1 frame.
				Util.requestAnimFrame(() => {
					// We're one frame into the zoom animation, there are
					// 16 tiles for z11 plus 4 tiles for z10 covering the
					// bounds at the *beginning* of the zoom-*out* anim
					expect(counts.tileloadstart).to.equal(20);
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
					Util.requestAnimFrame(() => {
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

		it('Loads 290, unloads 275 tiles on MAD-TRD flyTo()', function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			const mad = [40.40, -3.7], trd = [63.41, 10.41];

			grid.on('load', () => {
				expect(counts.tileloadstart).to.equal(12);
				expect(counts.tileload).to.equal(12);
				expect(counts.tileunload).to.equal(0);
				grid.off('load');

				map.on('zoomend', () => {
					expect(counts.tileloadstart).to.equal(290);
					expect(counts.tileunload).to.equal(275);
					expect(counts.tileload).to.equal(290);
					expect(grid._container.querySelectorAll('div').length).to.equal(16);	// 15 + container
					done();
				});

				map.flyTo(trd, 12, {animate: true});

				// map.on('_frame', function () {
				// 	console.log('frame', counts);
				// });

				runFrames(500);
			});

			grid.options.keepBuffer = 0;

			map.addLayer(grid).setView(mad, 12);
			clock.tick(250);
		});

	});

	describe('configurable tile pruning', () => {
		let clock, grid, counts;

		beforeEach(() => {
			clock = sinon.useFakeTimers();

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
				// console.log(ev.type);
				counts[ev.type]++;
			});
			// grid.on('tileunload', function (ev) {
			// 	console.log(ev.type, ev.coords, counts);
			// });

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
			// Advance the time to !== 0 otherwise `tile.loaded` timestamp will appear to be falsy.
			clock.tick(1);
			// Date.now() is 1.

			grid.once('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				// Wait for a frame to let _updateOpacity starting.
				Util.requestAnimFrame(() => {

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

						// Wait for a frame to let _updateOpacity starting
						// It will prune the 12 tiles outside the new bounds.
						Util.requestAnimFrame(() => {
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
					// clock.tick(250);
				});
			});

			grid.options.keepBuffer = 0;

			// 800px width * 600px height => 4 tiles horizontally * 4 tiles vertically = 16 tiles
			map.addLayer(grid).setView([0, 0], 10);
			// clock.tick(250);
		});

		it('Loads map, moves forth and back by 512 px, keepBuffer = 0', (done) => {
			grid.once('load', () => {
				expect(counts.tileloadstart).to.equal(16);
				expect(counts.tileload).to.equal(16);
				expect(counts.tileunload).to.equal(0);

				grid.once('load', () => {
					expect(counts.tileloadstart).to.equal(28);
					expect(counts.tileload).to.equal(28);

					// Wait for a frame to let _updateOpacity starting
					// It will prune the 12 tiles outside the new bounds.
					Util.requestAnimFrame(() => {
						expect(counts.tileunload).to.equal(12);

						grid.once('load', () => {
							expect(counts.tileloadstart).to.equal(40);
							expect(counts.tileload).to.equal(40);

							// Wait an extra frame for the tile pruning to happen.
							Util.requestAnimFrame(() => {
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

					grid.addEventListener('load', spy);

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
	});

	describe('Sanity checks for infinity', () => {
		it('Throws error on map center at plus Infinity longitude', () => {
			expect(() => {
				map.panTo([Infinity, Infinity]);
				new GridLayer().addTo(map);
			}).to.throw('Attempted to load an infinite number of tiles');
		});

		it('Throws error on map center at minus Infinity longitude', () => {
			expect(() => {
				map.panTo([-Infinity, -Infinity]);
				new GridLayer().addTo(map);
			}).to.throw('Attempted to load an infinite number of tiles');
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
