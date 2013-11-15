describe('LayerGroup', function () {
	describe("#addLayer", function () {
		it('adds a layer', function () {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			expect(lg.addLayer(marker)).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be(true);
		});
	});
	describe("#removeLayer", function () {
		it('removes a layer', function () {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.removeLayer(marker)).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be(false);
		});
	});
	describe("#clearLayers", function () {
		it('removes all layers', function () {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.clearLayers()).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be(false);
		});
	});
	describe("#getLayers", function () {
		it('gets all layers', function () {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]);

			lg.addLayer(marker);

			expect(lg.getLayers()).to.eql([marker]);
		});
	});
	describe("#eachLayer", function () {
		it('iterates over all layers', function () {
			var lg = L.layerGroup(),
				marker = L.marker([0, 0]),
				ctx = { foo: 'bar' };

			lg.addLayer(marker);

			lg.eachLayer(function (layer) {
				expect(layer).to.eql(marker);
				expect(this).to.eql(ctx);
			}, ctx);
		});
	});
});
