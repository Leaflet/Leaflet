import {expect} from 'chai';
import {GeoJSON, Layer, Marker, LayerGroup} from 'leaflet';

describe('LayerGroup', () => {
	describe('#hasLayer', () => {
		it('throws when called without proper argument', () => {
			const lg = new LayerGroup();
			const hasLayer = lg.hasLayer.bind(lg);
			expect(() => hasLayer(new Layer())).to.not.throw(); // control case

			expect(() => hasLayer(undefined)).to.throw();
			expect(() => hasLayer(null)).to.throw();
			expect(() => hasLayer(false)).to.throw();
			expect(() => hasLayer()).to.throw();
		});
	});

	describe('#addLayer', () => {
		it('adds a layer', () => {
			const lg = new LayerGroup(),
			marker = new Marker([0, 0]);

			expect(lg.addLayer(marker)).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be.true;
		});
	});

	describe('#removeLayer', () => {
		it('removes a layer', () => {
			const lg = new LayerGroup(),
			marker = new Marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.removeLayer(marker)).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be.false;
		});
	});

	describe('#clearLayers', () => {
		it('removes all layers', () => {
			const lg = new LayerGroup(),
			marker = new Marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.clearLayers()).to.eql(lg);

			expect(lg.hasLayer(marker)).to.be.false;
		});
	});

	describe('#getLayers', () => {
		it('gets all layers', () => {
			const lg = new LayerGroup(),
			marker = new Marker([0, 0]);

			lg.addLayer(marker);

			expect(lg.getLayers()).to.eql([marker]);
		});
	});

	describe('#eachLayer', () => {
		it('iterates over all layers', () => {
			const lg = new LayerGroup(),
			marker = new Marker([0, 0]),
			ctx = {foo: 'bar'};

			lg.addLayer(marker);

			lg.eachLayer(function (layer) {
				expect(layer).to.eql(marker);
				expect(this).to.eql(ctx);
			}, ctx);
		});
	});

	describe('#toGeoJSON', () => {
		it('should return valid GeoJSON for a layer with a FeatureCollection', () => {
			const geoJSON = {
				'type':'FeatureCollection',
				'features':[
					{
						'type':'Feature',
						'properties':{},
						'geometry': {
							'type':'Point',
							'coordinates': [78.3984375, 56.9449741808516]
						}
					}
				]
			};

			const lg = new LayerGroup();
			const layer = new GeoJSON(geoJSON);
			lg.addLayer(layer);

			new GeoJSON(lg.toGeoJSON());
		});
	});
});
