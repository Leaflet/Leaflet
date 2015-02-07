
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
			'144:44': [0, 0],
			'400:44': [1, 0],
			'144:300': [0, 1],
			'400:300': [1, 1],
			'-112:44': [1, 0],
			'656:44': [0, 0],
			'-112:300': [1, 1],
			'656:300': [0, 1]
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

	describe("#onAdd", function () {
		it('is called after viewreset on first map load', function () {
			var layer = L.gridLayer().addTo(map);

			var onAdd = layer.onAdd,
				onAddSpy = sinon.spy();
			layer.onAdd = function () {
				onAdd.apply(this, arguments);
				onAddSpy();
			};

			var onReset = sinon.spy();
			map.on('viewreset', onReset);
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
});
