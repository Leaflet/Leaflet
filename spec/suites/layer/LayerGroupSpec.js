describe('LayerGroup', function () {
	describe("#addLayer", function () {
		it('adds a layer', function() {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			expect(lg.addLayer(marker)).toEqual(lg);

			expect(lg.hasLayer(marker)).toBe(true);
		});
	});
	describe("#removeLayer", function () {
		it('removes a layer', function() {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.removeLayer(marker)).toEqual(lg);

			expect(lg.hasLayer(marker)).toBe(false);
		});
	});
	describe("#clearLayers", function () {
		it('removes all layers', function() {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.clearLayers()).toEqual(lg);

			expect(lg.hasLayer(marker)).toBe(false);
		});
	});
	describe("#getLayers", function () {
		it('gets all layers', function() {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			lg.addLayer(marker);

			expect(lg.getLayers()).toEqual([marker]);
		});
	});
	describe("#eachLayer", function () {
		it('iterates over all layers', function() {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]),
				ctx = { foo: 'bar' };

			lg.addLayer(marker);

			lg.eachLayer(function(layer) {
				expect(layer).toEqual(marker);
				expect(this).toEqual(ctx);
			}, ctx);
		});
	});
});
