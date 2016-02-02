
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
				if (Object.keys(tiles).length === 1) {
					expect(Object.keys(tiles)).to.eql(['0:0:0']);
					done();
				}
			});

			map.addLayer(grid);
			map.setZoom(0, {animate: false});
			clock.tick(250);
		});
	});

	describe('#createTile', function () {

		beforeEach(function () {
			// Simpler sizes to test.
			div.style.width = '512px';
			div.style.height = '512px';
		});

		afterEach(function () {
			div.style.width = '800px';
			div.style.height = '600px';
		});

		// Passes on Firefox, but fails on phantomJS: done is never called.
		xit('only creates tiles for visible area on zoom in', function (done) {
			map.remove();
			map = L.map(div);
			map.setView([0, 0], 10);

			var grid = L.gridLayer(),
			    count = 0,
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

		describe("when a tilelayer is removed from a map", function () {
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

	describe("number of tiles loaded in synchronous grid", function () {
		var clock, grid, counts;

		beforeEach(function () {
			clock = sinon.useFakeTimers();

			grid = L.gridLayer({
				attribution: 'Grid Layer',
	// 			tileSize: L.point(150, 80)
				tileSize: L.point(256, 256)
			});

			grid.createTile = function (coords /* , done*/) {
				var tile = document.createElement('div');
				tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
				tile.style.border = '2px solid red';
	// 			tile.style.background = 'white';

// 				console.log('Creating new tile: ', [coords.x, coords.y, coords.z].join(', '));

				// test async
// 				setTimeout(function () {
// 					done(null, tile);
// 				}, Math.random() * 100);

				return tile;
			};

			counts = {
				tileload: 0,
				tileerror: 0,
				tileloadstart: 0,
				tileunload: 0
			};

			grid.on('tileload tileunload tileerror tileloadstart', function (ev) {
// 				console.log(ev.type);
				counts[ev.type]++;
			});
// 			grid.on('tileunload', function (ev) {
// 				console.log(ev.type, ev.coords, counts);
// 			});

			map.options.fadeAnimation = false;
		});

		afterEach(function () {
			clock.restore();
			grid.off();
			grid = undefined;
			counts = undefined;
		});

		it("Loads 8 256x256px tiles @800x600px zoom 1", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(8);
				expect(counts.tileload).to.be(8);
				expect(counts.tileunload).to.be(0);
				done();
			});

			map.addLayer(grid).setView([0, 0], 1);
			clock.tick(250);
		});

		it("Loads 5 256x256px tiles @800x600px zoom 0", function (done) {

			grid.on('load', function () {
				expect(counts.tileloadstart).to.be(5);
				expect(counts.tileload).to.be(5);
				expect(counts.tileunload).to.be(0);
				done();
			});

			map.addLayer(grid).setView([0, 0], 0);
			clock.tick(250);
		});
//
		it("Loads 16 256x256px tiles @800x600px zoom 10", function (done) {

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
//
		it("Loads 48, unloads 32 256x256px tiles @800x600px zoom 1", function (done) {

// 			console.log(counts);

			// Event handler just for logging
			grid.on('tileload tileunload', function (ev) {
				var pending = 0;
				for (var key in grid._tiles) {
					if (!grid._tiles[key].loaded) { pending++; }
				}
				console.log(ev.type + ': ', ev.coords, grid._loading, pending);
				console.log(counts);
			});

			function firstTest() {
				console.log('loaded at zoom 10');
				console.log(counts);
				expect(counts.tileloadstart).to.be(16);
				expect(counts.tileload).to.be(16);
				expect(counts.tileunload).to.be(0);
				grid.off();
				grid.on('load', secondTest);
				map.setZoom(11);
				clock.tick(250);
			}

			function secondTest() {
				console.log('loaded at zoom 11');
				console.log(counts);
				expect(counts.tileloadstart).to.be(32);
				expect(counts.tileload).to.be(32);
				expect(counts.tileunload).to.be(16);
				done();
			}

			grid.on('load', firstTest);

			map.addLayer(grid).setView([0, 0], 10);
			clock.tick(250);
		});


	});

});
