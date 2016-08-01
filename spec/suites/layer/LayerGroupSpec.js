describe('LayerGroup', function () {
	describe("#hasLayer", function () {
		it("returns false when passed undefined, null, or false", function () {
			var lg = L.layerGroup();
			expect(lg.hasLayer(undefined)).to.equal(false);
			expect(lg.hasLayer(null)).to.equal(false);
			expect(lg.hasLayer(false)).to.equal(false);
		});
	});

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

	describe("#getSingleLayersRecursive", function () {
		it('gets all non-group layers recursively', function () {
			var lg1 = L.layerGroup(),
			    marker1 = L.marker([0, 0]),
			    lg2 = L.layerGroup(),
			    marker2 = L.marker([0, 0]),
			    lg3 = L.layerGroup(),
			    marker3 = L.marker([0, 0]);

			lg1.addLayer(marker1);
			lg1.addLayer(lg2);
			lg2.addLayer(marker2);
			lg2.addLayer(lg3);
			lg3.addLayer(marker3);

			expect(lg1.getSingleLayersRecursive()).to.eql([marker1, marker2, marker3]);
		});
	});

	describe("#toSingleLayersArray", function () {
		it('gets all non-group layers recursively', function () {
			var lg1 = L.layerGroup(),
			    marker1 = L.marker([0, 0]),
			    lg2 = L.layerGroup(),
			    marker2 = L.marker([0, 0]),
			    lg3 = L.layerGroup(),
			    marker3 = L.marker([0, 0]);

			lg1.addLayer(marker1);
			lg1.addLayer(lg2);
			lg2.addLayer(marker2);
			lg2.addLayer(lg3);
			lg3.addLayer(marker3);

			expect(lg1.getSingleLayersRecursive()).to.eql([marker1, marker2, marker3]);
		});
	});

	describe("#eachLayer", function () {
		it('iterates over all layers', function () {
			var lg = L.layerGroup(),
			    marker = L.marker([0, 0]),
			    ctx = {foo: 'bar'};

			lg.addLayer(marker);

			lg.eachLayer(function (layer) {
				expect(layer).to.eql(marker);
				expect(this).to.eql(ctx);
			}, ctx);
		});
	});

	describe("#eachSingleLayerRecursive", function () {
		it('iterates over all non-group layers recursively', function () {
			var lg1 = L.layerGroup(),
			    marker1 = L.marker([0, 0]),
			    lg2 = L.layerGroup(),
			    marker2 = L.marker([0, 0]),
			    lg3 = L.layerGroup(),
			    marker3 = L.marker([0, 0]),
			    ctx = {foo: 'bar'},
			    result = [];

			lg1.addLayer(marker1);
			lg1.addLayer(lg2);
			lg2.addLayer(marker2);
			lg2.addLayer(lg3);
			lg3.addLayer(marker3);

			lg1.eachSingleLayerRecursive(function (layer) {
				result.push(layer);
				expect(this).to.eql(ctx);
			}, ctx);

			expect(result).to.eql([marker1, marker2, marker3]);
		});
	});
});
