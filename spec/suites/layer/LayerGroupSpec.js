import {GeoJSON, GridLayer, Layer, LayerGroup, LayersControl, LeafletMap, Marker} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('LayerGroup', () => {
	describe('grouped base layer zoom limits', () => {
		let map, container;

		beforeEach(() => {
			container = createContainer();
			map = new LeafletMap(container, {zoomAnimation: false});
		});

		afterEach(() => removeMapContainer(map, container));

		function checkSwitch(zoom, lowFirst, expected) {
			map.setView([0, 0], zoom);
			const original = new GridLayer({maxZoom: 22}).addTo(map);

			const low = new GridLayer({minZoom: 2, maxZoom: 15});
			const high = new GridLayer({minZoom: 16, maxZoom: 19});
			const [first, second] = lowFirst ? [low, high] : [high, low];
			const group = new LayerGroup([new LayerGroup([first]), second]);
			const control = new LayersControl({original, group}).addTo(map).expand();
			const zooms = [];
			map.on('zoomend', () => zooms.push(map.getZoom()));

			control.getContainer().querySelectorAll('input')[1].click();

			expect(map.hasLayer(group)).to.be.true;
			expect(map.getZoom()).to.equal(expected);
			expect(zooms).to.eql(zoom === expected ? [] : [expected]);
		}

		it('keeps the zoom when the low-zoom layer is added first', () => checkSwitch(18, true, 18));
		it('keeps the zoom when the high-zoom layer is added first', () => checkSwitch(10, false, 10));
		it('zooms out to the group maximum', () => checkSwitch(20, true, 19));
		it('zooms in to the group minimum', () => checkSwitch(1, false, 2));
	});

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

		it('removes a layer by id and ignores an unknown id', () => {
			const lg = new LayerGroup(),
			marker = new Marker([0, 0]);

			lg.addLayer(marker);
			expect(lg.removeLayer(12345)).to.eql(lg);
			expect(lg.hasLayer(marker)).to.be.true;

			lg.removeLayer(lg.getLayerId(marker));
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

			const calls = [];
			lg.eachLayer(function (layer) {
				calls.push([layer, this]);
			}, ctx);

			expect(calls).to.have.length(1);
			expect(calls[0][0]).to.equal(marker);
			expect(calls[0][1]).to.equal(ctx);
		});
	});

	describe('#toGeoJSON', () => {
		it('squashes the FeatureCollection of a nested GeoJSON layer', () => {
			const geoJSON = {
				'type': 'FeatureCollection',
				'features': [
					{
						'type': 'Feature',
						'properties': {},
						'geometry': {
							'type': 'Point',
							'coordinates': [78.3984375, 56.9449741808516]
						}
					}
				]
			};

			const lg = new LayerGroup();
			const layer = new GeoJSON(geoJSON);
			lg.addLayer(layer);

			expect(lg.toGeoJSON(false)).to.eql(geoJSON);
		});

		it('includes the layers of a subclass that keeps them outside _layers', () => {
			class CustomGroup extends LayerGroup {
				eachLayer(method, context) {
					method.call(context, new Marker([51.5, 0]));
					return this;
				}
			}

			const json = new CustomGroup().toGeoJSON();
			expect(json.features).to.have.length(1);
			expect(json.features[0].geometry.coordinates).to.eql([0, 51.5]);
		});
	});
});
