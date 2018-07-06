
describe('GridLayer', function () {

	var div, map;

	beforeEach(function () {
		div = document.createElement('div');
		div.style.width = '800px';
		div.style.height = '600px';
		div.style.visibility = 'hidden';

		document.body.appendChild(div);

		map = L.map(div);
	});

	afterEach(function () {
		document.body.removeChild(div);
	});

	describe('#redraw', function () {
		it('can be called before map.setView', function () {
			var grid = L.gridLayer().addTo(map);
			expect(grid.redraw()).to.equal(grid);
		});
	});

	describe('#setOpacity', function () {
		it('can be called before map.setView', function () {
			var grid = L.gridLayer().addTo(map);
			expect(grid.setOpacity(0.5)).to.equal(grid);
		});

		it('works when map has fadeAnimated=false (IE8 is exempt)', function (done) {
			map.remove();
			map = L.map(div, {fadeAnimation: false}).setView([0, 0], 0);

			var grid = L.gridLayer().setOpacity(0.5).addTo(map);
			grid.on('load', function () {
				expect(grid._container.style.opacity).to.equal('0.5');
				done();
			});
		});
	});

	it('positions tiles correctly with wrapping and bounding', function () {

		map.setView([0, 0], 1);

		var tiles = [];

		var grid = L.gridLayer();
		grid.createTile = function (coords) {
			var tile = document.createElement('div');
			tiles.push({coords: coords, tile: tile});
			return tile;
		};

		map.addLayer(grid);

		var loaded = {};

		for (var i = 0; i < tiles.length; i++) {
			var coords = tiles[i].coords,
			    pos = L.DomUtil.getPosition(tiles[i].tile);

			loaded[pos.x + ':' + pos.y] = [coords.x, coords.y];
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

	describe('tile pyramid', function () {
		var clock;

		beforeEach(function () {
			clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			clock.restore();
		});

		it('removes tiles for unused zoom levels', function (done) {
			map.remove();
			map = L.map(div, {fadeAnimation: false});
			map.setView([0, 0], 1);

			var grid = L.gridLayer();
			var tiles = {};

			grid.createTile = function (coords) {
				tiles[grid._tileCoordsToKey(coords)] = true;
				return document.createElement('div');
			};

			grid.on('tileunload', function (e) {
				delete tiles[grid._tileCoordsToKey(e.coords)];
			});

			grid.on('load', function (e) {
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

	describe('#createTile', function () {
		var grid;

		beforeEach(function () {
			// Simpler sizes to test.
			div.style.width = '512px';
			div.style.height = '512px';

			map.remove();
			map = L.map(div);
			map.setView([0, 0], 10);

			grid = L.gridLayer();
		});

		afterEach(function () {
			div.style.width = '800px';
			div.style.height = '600px';
		});

		// Passes on Firefox, but fails on phantomJS: done is never called.
		it('only creates tiles for visible area on zoom in', function (done) {
			var count = 0,
			    loadCount = 0;
			grid.createTile = function (coords) {
				count++;
				return document.createElement('div');
			};
			var onLoad = function (e) {
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

		describe('when done() is called with an error parameter', function () {
			var keys;

			beforeEach(function () {
				keys = [];
				grid.createTile = function (coords, done) {
					var tile = document.createElement('div');
					keys.push(this._tileCoordsToKey(coords));
					done('error', tile);
					return tile;
				};
			});

			it('does not raise tileload events', function (done) {
				var tileLoadRaised = sinon.spy();
				grid.on('tileload', tileLoadRaised);
				grid.on('tileerror', function () {
					if (keys.length === 4) {
						expect(tileLoadRaised.notCalled).to.be(true);
						done();
					}
				});
				map.addLayer(grid);
			});

			it('raises tileerror events', function (done) {
				var tileErrorRaised = sinon.spy();
				grid.on('tileerror', function () {
					tileErrorRaised();
					if (keys.length === 4) {
						expect(tileErrorRaised.callCount).to.be(4);
						done();
					}
				});
				map.addLayer(grid);
			});

			it('does not add the .leaflet-tile-loaded class to tile elements', function (done) {
				var count = 0;
				grid.on('tileerror', function (e) {
					if (!L.DomUtil.hasClass(e.tile, 'leaflet-tile-loaded')) {
						count++;
					}
					if (keys.length === 4) {
						expect(count).to.be(4);
						done();
					}
				});
				map.addLayer(grid);
			});
		});

	});

	describe("#onAdd", function () {
		it('is called after zoomend on first map load', function () {
			var layer = L.gridLayer().addTo(map);

			var onAdd = layer.onAdd,
			    onAddSpy = sinon.spy();
			layer.onAdd = function () {
				onAdd.apply(this, arguments);
				onAddSpy();
			};

			var onReset = sinon.spy();
			map.on('zoomend', onReset);
			map.setView([0, 0], 0);

			expect(onReset.calledBefore(onAddSpy)).to.be.ok();
		});
	});

	describe("#getMaxZoom, #getMinZoom", function () {
		describe("when a tilelayer is added to a map with no other layers", function () {
			it("has the same zoomlevels as the tilelayer", function () {
				var maxZoom = 10,
				    minZoom = 5;

				map.setView([0, 0], 1);

				L.gridLayer({
					maxZoom: maxZoom,
					minZoom: minZoom
				}).addTo(map);

				expect(map.getMaxZoom()).to.be(maxZoom);
				expect(map.getMinZoom()).to.be(minZoom);
			});
		});

		describe("accessing a tilelayer's properties", function () {
			it('provides a container', function () {
				map.setView([0, 0], 1);

				var layer = L.gridLayer().addTo(map);
				expect(layer.getContainer()).to.be.ok();
			});
		});

		describe("when a tilelayer is added to a map that already has a tilelayer", function () {
			it("has its zoomlevels updated to fit the new layer", function () {
				map.setView([0, 0], 1);

				L.gridLayer({minZoom: 10, maxZoom: 15}).addTo(map);
				expect(map.getMinZoom()).to.be(10);
				expect(map.getMaxZoom()).to.be(15);

				L.gridLayer({minZoom: 5, maxZoom: 10}).addTo(map);
				expect(map.getMinZoom()).to.be(5);  // changed
				expect(map.getMaxZoom()).to.be(15); // unchanged

				L.gridLayer({minZoom: 10, maxZoom: 20}).addTo(map);
				expect(map.getMinZoom()).to.be(5);  // unchanged
				expect(map.getMaxZoom()).to.be(20); // changed


				L.gridLayer({minZoom: 0, maxZoom: 25}).addTo(map);
				expect(map.getMinZoom()).to.be(0); // changed
				expect(map.getMaxZoom()).to.be(25); // changed
			});
		});

		describe("when a gridlayer is removed from a map", function () {
			it("has its zoomlevels updated to only fit the layers it currently has", function () {
				var tiles = [
					L.gridLayer({minZoom: 10, maxZoom: 15}).addTo(map),
					L.gridLayer({minZoom: 5, maxZoom: 10}).addTo(map),
					L.gridLayer({minZoom: 10, maxZoom: 20}).addTo(map),
					L.gridLayer({minZoom: 0, maxZoom: 25}).addTo(map)
				];
				map.whenReady(function () {
					expect(map.getMinZoom()).to.be(0);
					expect(map.getMaxZoom()).to.be(25);

					map.removeLayer(tiles[0]);
					expect(map.getMinZoom()).to.be(0);
					expect(map.getMaxZoom()).to.be(25);

					map.removeLayer(tiles[3]);
					expect(map.getMinZoom()).to.be(5);
					expect(map.getMaxZoom()).to.be(20);

					map.removeLayer(tiles[2]);
					expect(map.getMinZoom()).to.be(5);
					expect(map.getMaxZoom()).to.be(10);

					map.removeLayer(tiles[1]);
					expect(map.getMinZoom()).to.be(0);
					expect(map.getMaxZoom()).to.be(Infinity);
				});
			});
		});
	});


	describe("min/maxNativeZoom option", function () {
		it("calls createTile() with maxNativeZoom when map zoom is larger", function (done) {
			map.setView([0, 0], 10);

			var grid = L.gridLayer({
				maxNativeZoom: 5
			});
			var tileCount = 0;

			grid.createTile = function (coords) {
				expect(coords.z).to.be(5);
				tileCount++;
				return document.createElement('div');
			};
			grid.on('load', function () {
				if (tileCount > 0) {
					done();
				} else {
					done('No tiles loaded');
				}
			});

			map.addLayer(grid);
		});

		it("calls createTile() with minNativeZoom when map zoom is smaller", function (done) {
			map.setView([0, 0], 3);

			var grid = L.gridLayer({
				minNativeZoom: 5
			});
			var tileCount = 0;

			grid.createTile = function (coords) {
				expect(coords.z).to.be(5);
				tileCount++;
				return document.createElement('div');
			};
			grid.on('load', function () {
				if (tileCount > 0) {
					done();
				} else {
					done('No tiles loaded');
				}
			});

			map.addLayer(grid);
		});
	});

	describe("number of 256px tiles loaded in synchronous non-animated grid @800x600px", function () {
		var clock, grid, counts;

		beforeEach(function () {
			clock = sinon.useFakeTimers();

			grid = L.gridLayer({
				attribution: 'Grid Layer',
				tileSize: L.point(256, 256)
			});

			grid.createTile = function (coords) {
				var tile = document.createElement('div');
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

			grid.on('tileload tileunload tileerror tileloadstart', function (ev) {
				// console.log(ev.type);
				counts[ev.type]++;
			});
			// grid.on('tileunload', function (ev) {
			// 	console.log(ev.type, ev.coords, counts);
			// });

			map.options.fadeAnimation = false;
			map.options.zoomAnimation = false;
		});

		afterEach(function () {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		it("Loads 8 tiles zoom 1", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(8);
				expect(counts.tileload).to.be(8);
				expect(counts.tileunload).to.be(0);
				done();
			});

			map.addLayer(grid).setView([0, 0], 1);
			clock.tick(250);
		});

		it("Loads 5 tiles zoom 0", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(5);
				expect(counts.tileload).to.be(5);
				expect(counts.tileunload).to.be(0);
				done();
			});

			map.addLayer(grid).setView([0, 0], 0);
			clock.tick(250);
		});

		it("Loads 16 tiles zoom 10", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off();

				done();
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it("Loads 32, unloads 16 tiles zooming in 10-11", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				grid.on('load', function () {
					expect(counts.tileloadstart).to.be(32);
					expect(counts.tileload).to.be(32);
					expect(counts.tileunload).to.be(16);
					done();
				});

				map.setZoom(11, {animate: false});
				clock.tick(250);
			});


			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		it("Loads 32, unloads 16 tiles zooming out 11-10", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				grid.on('load', function () {
					expect(counts.tileloadstart).to.be(32);
					expect(counts.tileload).to.be(32);
					expect(counts.tileunload).to.be(16);
					done();
				});

				map.setZoom(10, {animate: false});
				clock.tick(250);
			});


			map.addLayer(grid).setView([0, 0], 11);
			clock.tick(250);
		});


		it("Loads 32, unloads 16 tiles zooming out 18-10", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				grid.on('load', function () {
					expect(counts.tileloadstart).to.be(32);
					expect(counts.tileload).to.be(32);
					expect(counts.tileunload).to.be(16);
					done();
				});

				map.setZoom(10, {animate: false});
				clock.tick(250);
			});


			map.addLayer(grid).setView([0, 0], 18);
			clock.tick(250);
		});

	});


	describe("number of 256px tiles loaded in synchronous animated grid @800x600px", function () {

		var clock, grid, counts;

		beforeEach(function () {
			clock = sinon.useFakeTimers();

			grid = L.gridLayer({
				attribution: 'Grid Layer',
				tileSize: L.point(256, 256)
			});

			grid.createTile = function (coords) {
				var tile = document.createElement('div');
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

			grid.on('tileload tileunload tileerror tileloadstart', function (ev) {
				counts[ev.type]++;
			});
		});

		afterEach(function () {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		// Debug helper
		function logTiles(ev) {
			var pending = 0;
			for (var key in grid._tiles) {
				if (!grid._tiles[key].loaded) { pending++; }
			}
			console.log(ev.type + ': ', ev.coords, grid._loading, counts, ' pending: ', pending);
		}


		// animationFrame helper, just runs requestAnimFrame() a given number of times
		function runFrames(n) {
			return _runFrames(n)();
		}

		function _runFrames(n) {
			if (n) {
				return function () {
					clock.tick(40); // 40msec/frame ~= 25fps
					map.fire('_frame');
					L.Util.requestAnimFrame(_runFrames(n - 1));
				};
			} else {
				return L.Util.falseFn;
			}
		}

		// NOTE: This test has different behaviour in PhantomJS and graphical
		// browsers due to CSS animations!
		it.skipInPhantom("Loads 32, unloads 16 tiles zooming in 10-11", function (done) {

			// Advance the time to !== 0 otherwise `tile.loaded` timestamp will appear to be falsy.
			clock.tick(1);
			// Date.now() is 1.

			// grid.on('tileload tileunload tileloadstart load loading', logTiles);

			// Use "once" to automatically detach the listener,
			// and avoid removing the above logTiles
			// (which would happen when calling "grid.off('load')").
			grid.once('load', function () {
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);

				// Wait for a frame to let _updateOpacity starting.
				L.Util.requestAnimFrame(function () {
					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the z10 tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', function () {
						expect(counts.tileload).to.be(32);

						// We're one frame into the zoom animation,
						// so GridLayer._setView with noPrune === undefined is not called yet
						// No tile should be unloaded yet.
						expect(counts.tileunload).to.be(0);

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
						expect(counts.tileunload).to.be(12);
						// Date.now() is 601.

						// Wait for a frame to let _updateOpacity starting
						// + _tileReady to be able to prepare its setTimeout(250)
						// for pruning after the end of the fade-in animation.
						// Since we are already > 200ms since the 'load' event fired,
						// _updateOpacity should directly set the current tiles as "active",
						// so the remaining 4 tiles from z10 can then be pruned.
						// However we have skipped any pruning from _updateOpacity,
						// so we will have to rely on the setTimeout from _tileReady.
						L.Util.requestAnimFrame(function () {
							// Wait > 250msec for the tile fade-in animation to complete,
							// which triggers the tile pruning
							clock.tick(300);
							// At 851ms, the pruneTile from the end of the z11 tiles fade-in animation executes.
							// It unloads the remaining 4 tiles from z10.
							expect(counts.tileunload).to.be(16);
							// Date.now() is 901.
							done();
						});
					});

					map.setZoom(11, {animate: true});
					// Animation (and new tiles loading) starts after 1 frame.
					L.Util.requestAnimFrame(function () {
						// 16 extra tiles from z11 being loaded. Total 16 + 16 = 32.
						expect(counts.tileloadstart).to.be(32);
					});

				});
			});

			map.addLayer(grid).setView([0, 0], 10);
			// The first setView does not animated, therefore it starts loading tiles immediately.
			// 16 tiles from z10 being loaded.
			expect(counts.tileloadstart).to.be(16);
			// At 1ms, first pruneTile (map fires "viewreset" event => GridLayer._resetView => GridLayer._setView => _pruneTiles).
		});

		it("Loads 32, unloads 16 tiles zooming in 10-18", function (done) {
			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				grid.on('load', function () {

					// In this particular scenario, the tile unloads happen in the
					// next render frame after the grid's 'load' event.
					L.Util.requestAnimFrame(function () {
						expect(counts.tileloadstart).to.be(32);
						expect(counts.tileload).to.be(32);
						expect(counts.tileunload).to.be(16);
						done();
					});
				});

				map.setZoom(18, {animate: true});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});

		// NOTE: This test has different behaviour in PhantomJS and graphical
		// browsers due to CSS animations!
		it.skipInPhantom("Loads 32, unloads 16 tiles zooming out 11-10", function (done) {

			// Advance the time to !== 0 otherwise `tile.loaded` timestamp will appear to be falsy.
			clock.tick(1);
			// Date.now() is 1.

			// grid.on('tileload tileunload load', logTiles);

			grid.once('load', function () {
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);

				// Wait for a frame to let _updateOpacity starting.
				L.Util.requestAnimFrame(function () {
					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the z11 tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', function () {
						expect(counts.tileload).to.be(20);
						// No tile should be unloaded yet.
						expect(counts.tileunload).to.be(0);

						// Wait > 250msec for the zoom animation to complete,
						// which triggers the tile pruning, but there are no
						// tiles to prune yet (z11 tiles are all in bounds).
						clock.tick(300);
						// Date.now() is 601.

						// At the end of the animation, all 16 tiles from z10
						// are loading.
						expect(counts.tileloadstart).to.be(32);
						expect(counts.tileload).to.be(20);

						// Now that the zoom animation is complete,
						// the grid is ready to fire a new "load" event
						// on next frame, so prepare its listener now.
						// During that frame, _updateOpacity will flag the 4
						// central tiles from z10 as "active", since we are now
						// > 200ms after the first "load" event fired.
						grid.once('load', function () {
							expect(counts.tileload).to.be(32);
							// No tile should be unloaded yet.
							expect(counts.tileunload).to.be(0);

							// Wait for a frame for next _updateOpacity to prune
							// all 16 tiles from z11 which are now covered by the
							// 4 central active tiles of z10.
							L.Util.requestAnimFrame(function () {
								expect(counts.tileunload).to.be(16);
								done();
							});
						});
					});
				});

				map.setZoom(10, {animate: true});
				// Animation (and new tiles loading) starts after 1 frame.
				L.Util.requestAnimFrame(function () {
					// We're one frame into the zoom animation, there are
					// 16 tiles for z11 plus 4 tiles for z10 covering the
					// bounds at the *beginning* of the zoom-*out* anim
					expect(counts.tileloadstart).to.be(20);
				});
			});

			map.addLayer(grid).setView([0, 0], 11);
			// The first setView does not animated, therefore it starts loading tiles immediately.
			// 16 tiles from z10 being loaded.
			expect(counts.tileloadstart).to.be(16);
		});

		it("Loads 32, unloads 16 tiles zooming out 18-10", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				grid.on('load', function () {

					// In this particular scenario, the tile unloads happen in the
					// next render frame after the grid's 'load' event.
					L.Util.requestAnimFrame(function () {
						expect(counts.tileloadstart).to.be(32);
						expect(counts.tileload).to.be(32);
						expect(counts.tileunload).to.be(16);
						done();
					});
				});

				map.setZoom(10, {animate: true});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 18);
			clock.tick(250);
		});

		// NOTE: This test has different behaviour in PhantomJS and graphical
		// browsers due to CSS animations!
		it.skipInPhantom("Loads 290, unloads 275 tiles on MAD-TRD flyTo()", function (done) {

			this.timeout(10000); // This test takes longer than usual due to frames

			var mad = [40.40, -3.7], trd = [63.41, 10.41];

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(12);
				expect(counts.tileload).to.be(12);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				map.on('zoomend', function () {
					expect(counts.tileloadstart).to.be(290);
					expect(counts.tileunload).to.be(275);
					expect(counts.tileload).to.be(290);
					expect(grid._container.querySelectorAll('div').length).to.be(16);	// 15 + container
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

	describe("configurable tile pruning", function () {
		var clock, grid, counts;

		beforeEach(function () {
			clock = sinon.useFakeTimers();

			grid = L.gridLayer({
				attribution: 'Grid Layer',
				tileSize: L.point(256, 256)
			});

			grid.createTile = function (coords) {
				var tile = document.createElement('div');
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

			grid.on('tileload tileunload tileerror tileloadstart', function (ev) {
				// console.log(ev.type);
				counts[ev.type]++;
			});
			// grid.on('tileunload', function (ev) {
			// 	console.log(ev.type, ev.coords, counts);
			// });

			map.options.fadeAnimation = false;
			map.options.zoomAnimation = false;
		});

		afterEach(function () {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		// NOTE: This test has different behaviour in PhantomJS and graphical
		// browsers due to CSS animations!
		it("Loads map, moves forth by 512 px, keepBuffer = 0", function (done) {

			// Advance the time to !== 0 otherwise `tile.loaded` timestamp will appear to be falsy.
			clock.tick(1);
			// Date.now() is 1.

			grid.once('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);

				// Wait for a frame to let _updateOpacity starting.
				L.Util.requestAnimFrame(function () {

					// Wait > 250msec for the tile fade-in animation to complete,
					// which triggers the tile pruning
					clock.tick(300);
					// At 251ms, the pruneTile from the end of the setView tiles fade-in animation executes.
					// Date.now() is 301.

					grid.once('load', function () {
						// Since there is no animation requested,
						// We directly jump to the target position.
						// => 12 new tiles, total = 16 + 12 = 28 tiles.
						expect(counts.tileloadstart).to.be(28);
						expect(counts.tileload).to.be(28);

						// Wait for a frame to let _updateOpacity starting
						// It will prune the 12 tiles outside the new bounds.
						// PhantomJS has Browser.any3d === false, so it actually
						// does not perform the fade animation and does not need
						// this rAF, but it does not harm either.
						L.Util.requestAnimFrame(function () {
							expect(counts.tileunload).to.be(12);
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

		// NOTE: This test has different behaviour in PhantomJS and graphical
		// browsers due to CSS animations!
		it("Loads map, moves forth and back by 512 px, keepBuffer = 0", function (done) {

			grid.once('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);

				grid.once('load', function () {
					expect(counts.tileloadstart).to.be(28);
					expect(counts.tileload).to.be(28);

					// Wait for a frame to let _updateOpacity starting
					// It will prune the 12 tiles outside the new bounds.
					// PhantomJS has Browser.any3d === false, so it actually
					// does not perform the fade animation and does not need
					// this rAF, but it does not harm either.
					L.Util.requestAnimFrame(function () {
						expect(counts.tileunload).to.be(12);

						grid.once('load', function () {
							expect(counts.tileloadstart).to.be(40);
							expect(counts.tileload).to.be(40);

							// Wait an extra frame for the tile pruning to happen.
							L.Util.requestAnimFrame(function () {
								expect(counts.tileunload).to.be(24);
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

		it("Loads map, moves forth and back by 512 px, default keepBuffer", function (done) {

			var spy = sinon.spy();

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off('load');

				grid.on('load', function () {
					expect(counts.tileloadstart).to.be(28);
					expect(counts.tileload).to.be(28);
					expect(counts.tileunload).to.be(0);
					grid.off('load');

					grid.addEventListener('load', spy);

					map.panBy([-512, -512], {animate: false});
					clock.tick(250);

					expect(spy.called).to.be(false);
					done();
				});

				map.panBy([512, 512], {animate: false});
				clock.tick(250);
			});

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});
	});

	describe("nowrap option", function () {
		it("When false, uses same coords at zoom 0 for all tiles", function (done) {

			var grid = L.gridLayer({
				attribution: 'Grid Layer',
				tileSize: L.point(256, 256),
				noWrap: false
			});
			var loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(coords.x + ':' + coords.y + ':' + coords.z);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 0);

			grid.on('load', function () {
				expect(loadedTileKeys).to.eql(["0:0:0", "0:0:0", "0:0:0", "0:0:0", "0:0:0"]);
				done();
			});
		});

		it("When true, uses different coords at zoom level 0 for all tiles", function (done) {

			var grid = L.gridLayer({
				attribution: 'Grid Layer',
				tileSize: L.point(256, 256),
				noWrap: true
			});
			var loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(coords.x + ':' + coords.y + ':' + coords.z);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 0);

			grid.on('load', function () {
				expect(loadedTileKeys).to.eql(['0:0:0', '-1:0:0', '1:0:0', '-2:0:0', '2:0:0']);
				done();
			});
		});

		it("When true and with bounds, loads just one tile at zoom level 0", function (done) {

			var grid = L.gridLayer({
				attribution: 'Grid Layer',
				tileSize: L.point(256, 256),
				bounds: [[-90, -180], [90, 180]],
				noWrap: true
			});
			var loadedTileKeys = [];

			grid.createTile = function (coords) {
				loadedTileKeys.push(coords.x + ':' + coords.y + ':' + coords.z);
				return document.createElement('div');
			};

			map.addLayer(grid).setView([0, 0], 0);

			grid.on('load', function () {
				expect(loadedTileKeys).to.eql(['0:0:0']);
				done();
			});
		});
	});

	describe("Sanity checks for infinity", function () {
		it("Throws error on map center at plus Infinity longitude", function () {
			expect(function () {
				map.setCenter([Infinity, Infinity]);
				L.gridLayer().addTo(map);
			}).to.throwError('Attempted to load an infinite number of tiles');
		});

		it("Throws error on map center at minus Infinity longitude", function () {
			expect(function () {
				map.setCenter([-Infinity, -Infinity]);
				L.gridLayer().addTo(map);
			}).to.throwError('Attempted to load an infinite number of tiles');
		});
	});

	it("doesn't call map's getZoomScale method with null after _invalidateAll method was called", function () {
		map.setView([0, 0], 0);
		var grid = L.gridLayer().addTo(map);
		var wrapped = sinon.spy(map, 'getZoomScale');
		grid._invalidateAll();
		grid.redraw();
		expect(wrapped.neverCalledWith(sinon.match.any, null)).to.be(true);
	});
});
