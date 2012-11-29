
describe('TileLayer', function () {
	describe("#getMaxZoom, #getMinZoom", function () {
		var map;
		beforeEach(function () {
			map = L.map(document.createElement('div'));
		});
		describe("when a tilelayer is added to a map with no other layers", function () {
			it("should have the same zoomlevels as the tilelayer", function () {
				var maxZoom = 10,
					minZoom = 5;
					map.setView([0, 0], 1);

					L.tileLayer("{z}{x}{y}", {
						maxZoom: maxZoom,
						minZoom: minZoom
					}).addTo(map);
				expect(map.getMaxZoom() === maxZoom).toBeTruthy();
				expect(map.getMinZoom() === minZoom).toBeTruthy();
			});
		});
		describe("when a tilelayer is added to a map that already has a tilelayer", function () {
			it("should have its zoomlevels updated to fit the new layer", function () {
				map.setView([0, 0], 1);

				L.tileLayer("{z}{x}{y}", { minZoom:10, maxZoom: 15 }).addTo(map);
				expect(map.getMinZoom()).toBe(10);
				expect(map.getMaxZoom()).toBe(15);

				L.tileLayer("{z}{x}{y}", { minZoom:5, maxZoom: 10 }).addTo(map);
				expect(map.getMinZoom()).toBe(5);  // changed
				expect(map.getMaxZoom()).toBe(15); // unchanged


				L.tileLayer("{z}{x}{y}",{ minZoom:10, maxZoom: 20 }).addTo(map);
				expect(map.getMinZoom()).toBe(5);  // unchanged
				expect(map.getMaxZoom()).toBe(20); // changed


				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 25 }).addTo(map);
				expect(map.getMinZoom()).toBe(0); // changed
				expect(map.getMaxZoom()).toBe(25); // changed
			});
		});
		describe("when a tilelayer is removed from a map", function () {
			it("it should have its zoomlevels updated to only fit the layers it currently has", function () {
				var tiles = [  L.tileLayer("{z}{x}{y}", { minZoom:10, maxZoom: 15 }).addTo(map),
							   L.tileLayer("{z}{x}{y}", { minZoom:5, maxZoom: 10 }).addTo(map),
							   L.tileLayer("{z}{x}{y}", { minZoom:10, maxZoom: 20 }).addTo(map),
							   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 25 }).addTo(map)
							];
				map.whenReady(function() {
					expect(map.getMinZoom()).toBe(0);
					expect(map.getMaxZoom()).toBe(25);

					map.removeLayer(tiles[0]);
					expect(map.getMinZoom()).toBe(0);
					expect(map.getMaxZoom()).toBe(25);

					map.removeLayer(tiles[3]);
					expect(map.getMinZoom()).toBe(5);
					expect(map.getMaxZoom()).toBe(20);

					map.removeLayer(tiles[2]);
					expect(map.getMinZoom()).toBe(5);
					expect(map.getMaxZoom()).toBe(10);

					map.removeLayer(tiles[1]);
					expect(map.getMinZoom()).toBe(0);
					expect(map.getMaxZoom()).toBe(Infinity);
				});
			});
		});
	});
});