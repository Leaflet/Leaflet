
describe('TileLayer', function () {
	var tileUrl = '';

	describe("#getMaxZoom, #getMinZoom", function () {
		var map;
		beforeEach(function () {
			map = L.map(document.createElement('div'));
		});
		describe("when a tilelayer is added to a map with no other layers", function () {
			it("has the same zoomlevels as the tilelayer", function () {
				var maxZoom = 10,
					minZoom = 5;

				map.setView([0, 0], 1);

				L.tileLayer(tileUrl, {
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

				var layer = L.tileLayer(tileUrl).addTo(map);
				expect(layer.getContainer()).to.be.ok();
			});
		});

		describe("when a tilelayer is added to a map that already has a tilelayer", function () {
			it("has its zoomlevels updated to fit the new layer", function () {
				map.setView([0, 0], 1);

				L.tileLayer(tileUrl, {minZoom: 10, maxZoom: 15}).addTo(map);
				expect(map.getMinZoom()).to.be(10);
				expect(map.getMaxZoom()).to.be(15);

				L.tileLayer(tileUrl, {minZoom: 5, maxZoom: 10}).addTo(map);
				expect(map.getMinZoom()).to.be(5);  // changed
				expect(map.getMaxZoom()).to.be(15); // unchanged

				L.tileLayer(tileUrl, {minZoom: 10, maxZoom: 20}).addTo(map);
				expect(map.getMinZoom()).to.be(5);  // unchanged
				expect(map.getMaxZoom()).to.be(20); // changed


				L.tileLayer(tileUrl, {minZoom: 0, maxZoom: 25}).addTo(map);
				expect(map.getMinZoom()).to.be(0); // changed
				expect(map.getMaxZoom()).to.be(25); // changed
			});
		});
		describe("when a tilelayer is removed from a map", function () {
			it("has its zoomlevels updated to only fit the layers it currently has", function () {
				var tiles = [  L.tileLayer(tileUrl, {minZoom: 10, maxZoom: 15}).addTo(map),
							   L.tileLayer(tileUrl, {minZoom: 5, maxZoom: 10}).addTo(map),
							   L.tileLayer(tileUrl, {minZoom: 10, maxZoom: 20}).addTo(map),
							   L.tileLayer(tileUrl, {minZoom: 0, maxZoom: 25}).addTo(map)
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
