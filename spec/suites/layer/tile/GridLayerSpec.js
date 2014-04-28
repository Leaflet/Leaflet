
describe('GridLayer', function () {

	var div;

	beforeEach(function () {
		div = document.createElement('div');
		div.style.width = '800px';
		div.style.height = '600px';
		div.style.visibility = 'hidden';

		document.body.appendChild(div);
	});

	afterEach(function () {
		document.body.removeChild(div);
	});

	describe('#redraw', function () {
		it('can be called before map.setView', function () {
			var map = L.map(div),
				grid = L.gridLayer().addTo(map);
			expect(grid.redraw()).to.equal(grid);
		});
	});

	describe('#setOpacity', function () {
		it('can be called before map.setView', function () {
			var map = L.map(div),
				grid = L.gridLayer().addTo(map);
			expect(grid.setOpacity(0.5)).to.equal(grid);
		});
	});

	it('positions tiles correctly with wrapping and bounding', function () {

		var map = L.map(div).setView([0, 0], 1);

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

	it('fires tile events', function (done) {
		var map = L.map(div).setView([0, 0], 10),
		    grid = L.gridLayer(),
		    loadingSpy = sinon.spy(),
		    loadSpy = sinon.spy(),
		    unloadSpy = sinon.spy();

		grid.on({
		    tileloadstart: loadingSpy,
		    tileload: loadSpy,
		    tileunload: unloadSpy
		});

		grid.createTile = function (coords) {
			return document.createElement('div');
		};

		map.addLayer(grid);

		setTimeout(function () {
			expect(loadingSpy.callCount).to.be.equal(16);
			expect(loadSpy.callCount).to.be.equal(16);
			expect(loadSpy.lastCall.args[0].coords.z).to.be.equal(10);

			map.setZoom(9);
			setTimeout(function () {
				expect(unloadSpy.callCount).to.be.equal(16);
				expect(unloadSpy.lastCall.args[0].coords.z).to.be.equal(10);
				done();
			});
		}, 0);
		
	});
});