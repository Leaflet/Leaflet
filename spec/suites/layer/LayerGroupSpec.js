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

	describe("#toGeoJSON", function () {
		it('should return valid GeoJSON for a layer with a FeatureCollection', function () {
			var geoJSON = {
				"type":"FeatureCollection",
				"features":[
					{
						"type":"Feature",
						"properties":{},
						"geometry": {
							"type":"Point",
							"coordinates": [78.3984375, 56.9449741808516]
						}
					}
				]
			};

			var layerGroup = L.layerGroup();
			var layer = L.geoJSON(geoJSON);
			layerGroup.addLayer(layer);

			L.geoJson(layerGroup.toGeoJSON());
		});
	});
});
