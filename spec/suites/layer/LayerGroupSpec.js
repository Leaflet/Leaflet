describe('LayerGroup', () => {
	describe("#hasLayer", () => {
		it("throws when called without proper argument", () => {
			var lg = L.layerGroup();
			var hasLayer = lg.hasLayer.bind(lg);
			expect(hasLayer).withArgs(new L.Layer()).to.not.throwException(); // control case

			expect(hasLayer).withArgs(undefined).to.throwException();
			expect(hasLayer).withArgs(null).to.throwException();
			expect(hasLayer).withArgs(false).to.throwException();
			expect(hasLayer).to.throwException();
		});
	});

	describe("#addLayer", () => {
		it('adds a layer', () => {
			var lg = L.layerGroup(),
			    marker = L.marker([0, 0]);

			expect(lg.addLayer(marker)).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be(true);
		});
	});

	describe("#removeLayer", () => {
		it('removes a layer', () => {
			var lg = L.layerGroup(),
			    marker = L.marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.removeLayer(marker)).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be(false);
		});
	});

	describe("#clearLayers", () => {
		it('removes all layers', () => {
			var lg = L.layerGroup(),
			    marker = L.marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.clearLayers()).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be(false);
		});
	});

	describe("#getLayers", () => {
		it('gets all layers', () => {
			var lg = L.layerGroup(),
			    marker = L.marker([0, 0]);

			lg.addLayer(marker);

			expect(lg.getLayers()).to.eql([marker]);
		});
	});

	describe("#eachLayer", () => {
		it('iterates over all layers', () => {
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

	describe("#toGeoJSON", () => {
		it('should return valid GeoJSON for a layer with a FeatureCollection', () => {
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

	describe("#invoke", () => {
		it('should invoke `setOpacity` method on every layer', () => {
			var layers = [
				L.marker([0, 0]),
				L.marker([1, 1])
			];
			var lg = L.layerGroup(layers);
			var opacity = 0.5;

			expect(layers[0].options.opacity).to.not.eql(opacity);
			lg.invoke('setOpacity', opacity);
			expect(layers[0].options.opacity).to.eql(opacity);
			expect(layers[1].options.opacity).to.eql(opacity);
		});
	});
});
