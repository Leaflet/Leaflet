import {GeoJSON, Marker, Circle, CircleMarker, Polyline, Polygon, LayerGroup, TileLayer, LatLng, FeatureGroup} from 'leaflet';

describe('GeoJSON', () => {
	describe('addData', () => {
		const geojson = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Point',
				coordinates: [20, 10, 5]
			}
		}, geojsonEmpty = {
			type: 'Feature',
			properties: {},
			geometry: null
		};

		it('sets feature property on member layers', () => {
			const layer = new GeoJSON();
			layer.addData(geojson);
			expect(layer.getLayers()[0].feature).to.eql(geojson);
		});

		it('normalizes a geometry to a Feature', () => {
			const layer = new GeoJSON();
			layer.addData(geojson.geometry);
			expect(layer.getLayers()[0].feature).to.eql(geojson);
		});

		it('accepts geojson with null geometry', () => {
			const layer = new GeoJSON();
			layer.addData(geojsonEmpty);
			expect(layer.getLayers().length).to.eql(0);
		});

		it('makes default marker inherit group options if explicitly requested', () => {
			// Check first that it does not inherit group options by default
			const options = {
				customOption: 'My Custom Option'
			};
			const layer = new GeoJSON(null, options);
			layer.addData(geojson);
			expect(layer.getLayers()[0].options.customOption).to.equal(undefined);

			// Now make it inherit group options
			layer.options.markersInheritOptions = true;
			layer.addData(geojson);
			expect(layer.getLayers()[1].options.customOption).to.eql(options.customOption);
		});
	});

	describe('resetStyle', () => {
		it('should reset init options', () => {
			const feature = {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates:[[-2.35, 51.38], [-2.38, 51.38]]
				}
			};
			const geojson = new GeoJSON(feature, {weight: 7, color: 'chocolate'});
			geojson.setStyle({weight: 22, color: 'coral'});
			const layer = geojson.getLayers()[0];
			expect(layer.options.weight).to.equal(22);
			expect(layer.options.color).to.equal('coral');
			geojson.resetStyle(layer);
			expect(layer.options.weight).to.equal(7);
			expect(layer.options.color).to.equal('chocolate');
		});

		it('should reset init options of all child layers', () => {
			const feature = {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates:[[-2.35, 51.38], [-2.38, 51.38]]
				}
			};
			const feature2 = {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates:[[-3.35, 50.38], [-3.38, 50.38]]
				}
			};
			const geojson = new GeoJSON([feature, feature2], {weight: 7, color: 'chocolate'});
			geojson.setStyle({weight: 22, color: 'coral'});
			const layer = geojson.getLayers()[0];
			expect(layer.options.weight).to.equal(22);
			expect(layer.options.color).to.equal('coral');
			const layer2 = geojson.getLayers()[1];
			expect(layer2.options.weight).to.equal(22);
			expect(layer2.options.color).to.equal('coral');
			geojson.resetStyle(); // Should apply to all layers
			expect(layer.options.weight).to.equal(7);
			expect(layer.options.color).to.equal('chocolate');
			expect(layer2.options.weight).to.equal(7);
			expect(layer2.options.color).to.equal('chocolate');
		});
	});
});

describe('Marker#toGeoJSON', () => {
	it('returns a 2D Point object', () => {
		const marker = new Marker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it('returns a 3D Point object', () => {
		const marker = new Marker([10, 20, 30]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', () => {
		const marker = new Marker([10.123456, 20.123456, 30.123456]);
		expect(marker.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123, 30.123]
		});
	});
});

describe('Circle#toGeoJSON', () => {
	it('returns a 2D Point object', () => {
		const circle = new Circle([10, 20], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it('returns a 3D Point object', () => {
		const circle = new Circle([10, 20, 30], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', () => {
		const circle = new Circle([10.1234, 20.1234, 30.1234], 100);
		expect(circle.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123, 30.123]
		});
	});
});

describe('CircleMarker#toGeoJSON', () => {
	it('returns a 2D Point object', () => {
		const marker = new CircleMarker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it('returns a 3D Point object', () => {
		const marker = new CircleMarker([10, 20, 30]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', () => {
		const marker = new CircleMarker([10.1234, 20.1234]);
		expect(marker.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123]
		});
	});
});

describe('Polyline#toGeoJSON', () => {
	it('returns a 2D LineString object', () => {
		const polyline = new Polyline([[10, 20], [2, 5]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10], [5, 2]]
		});
	});

	it('returns a 3D LineString object', () => {
		const polyline = new Polyline([[10, 20, 30], [2, 5, 10]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10, 30], [5, 2, 10]]
		});
	});

	it('should allow specific precisions', () => {
		const polyline = new Polyline([[10.1234, 20.1234, 30.1234], [2.1234, 5.1234, 10.1234]]);
		expect(polyline.toGeoJSON(3).geometry).to.eql({
			type: 'LineString',
			coordinates: [[20.123, 10.123, 30.123], [5.123, 2.123, 10.123]]
		});
	});
});

describe('Polyline (multi) #toGeoJSON', () => {
	it('returns a 2D MultiLineString object', () => {
		const multiPolyline = new Polyline([[[10, 20], [2, 5]], [[1, 2], [3, 4]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10], [5, 2]],
				[[2, 1], [4, 3]]
			]
		});
	});

	it('returns a 3D MultiLineString object', () => {
		const multiPolyline = new Polyline([[[10, 20, 30], [2, 5, 10]], [[1, 2, 3], [4, 5, 6]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10, 30], [5, 2, 10]],
				[[2, 1, 3], [5, 4, 6]]
			]
		});
	});

	it('should allow specific precisions', () => {
		const multiPolyline = new Polyline([[[10.1234, 20.1234, 30.1234], [2.1234, 5.1234, 10.1234]], [[1.1234, 2.1234, 3.1234], [4.1234, 5.1234, 6.1234]]]);
		expect(multiPolyline.toGeoJSON(3).geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20.123, 10.123, 30.123], [5.123, 2.123, 10.123]],
				[[2.123, 1.123, 3.123], [5.123, 4.123, 6.123]]
			]
		});
	});
});

describe('Polygon#toGeoJSON', () => {
	it('returns a 2D Polygon object (no holes) from a flat LatLngs array', () => {
		const polygon = new Polygon([[1, 2], [3, 4], [5, 6]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1], [4, 3], [6, 5], [2, 1]]]
		});
	});

	it('returns a 3D Polygon object (no holes) from a flat LatLngs array', () => {
		const polygon = new Polygon([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]]
		});
	});

	it('returns a 2D Polygon object from a simple GeoJSON like input', () => {
		const multiPolygon = new Polygon([[[1, 2], [3, 4], [5, 6]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]]
			]
		});
	});

	it('returns a 3D MultiPolygon object from a simple GeoJSON like input', () => {
		const multiPolygon = new Polygon([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]
			]
		});
	});

	it('returns a 2D Polygon object (with holes)', () => {
		const polygon = new Polygon([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]],
				[[8, 7], [10, 9], [12, 11], [8, 7]]
			]
		});
	});

	it('returns a 3D Polygon object (with holes)', () => {
		const polygon = new Polygon([[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[10, 11, 12], [13, 14, 15], [16, 17, 18]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]],
				[[11, 10, 12], [14, 13, 15], [17, 16, 18], [11, 10, 12]]
			]
		});
	});

	it('should allow specific precisions', () => {
		const polygon = new Polygon([[1.1234, 2.1234], [3.1234, 4.1234], [5.1234, 6.1234]]);
		expect(polygon.toGeoJSON(3).geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2.123, 1.123], [4.123, 3.123], [6.123, 5.123], [2.123, 1.123]]]
		});
	});
});

describe('Polygon (multi) #toGeoJSON', () => {
	it('returns a 2D MultiPolygon object', () => {
		const multiPolygon = new Polygon([[[[1, 2], [3, 4], [5, 6]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]]
			]
		});
	});

	it('returns a 3D MultiPolygon object', () => {
		const multiPolygon = new Polygon([[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]]
			]
		});
	});

	it('returns a 2D MultiPolygon object with two polygons', () => {
		const multiPolygon = new Polygon([[[[1, 2], [3, 4], [5, 6]]], [[[7, 8], [9, 10], [11, 12]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]],
				[[[8, 7], [10, 9], [12, 11], [8, 7]]]
			]
		});
	});

	it('returns a 2D MultiPolygon object with polygon having a hole', () => {
		const multiPolygon = new Polygon([[[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]], [[8, 7], [10, 9], [12, 11], [8, 7]]]
			]
		});
	});

	it('should allow specific precisions', () => {
		const multiPolygon = new Polygon([[[[1.1234, 2.1234], [3.1234, 4.1234], [5.1234, 6.1234]]]]);
		expect(multiPolygon.toGeoJSON(3).geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2.123, 1.123], [4.123, 3.123], [6.123, 5.123], [2.123, 1.123]]]
			]
		});
	});
});

describe('LayerGroup#toGeoJSON', () => {
	it('returns a 2D FeatureCollection object', () => {
		const marker = new Marker([10, 20]),
		    polyline = new Polyline([[10, 20], [2, 5]]),
		    layerGroup = new LayerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(), polyline.toGeoJSON()]
		});
	});

	it('returns a 3D FeatureCollection object', () => {
		const marker = new Marker([10, 20, 30]),
		    polyline = new Polyline([[10, 20, 30], [2, 5, 10]]),
		    layerGroup = new LayerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(), polyline.toGeoJSON()]
		});
	});

	it('ensures that every member is a Feature', () => {
		const tileLayer = new TileLayer(),
		    layerGroup = new LayerGroup([tileLayer]);

		tileLayer.toGeoJSON = function () {
			return {
				type: 'Point',
				coordinates: [20, 10]
			};
		};

		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Point',
					coordinates: [20, 10]
				}
			}]
		});
	});

	it('roundtrips GeometryCollection features', () => {
		const json = {
			'type': 'FeatureCollection',
			'features': [{
				'type': 'Feature',
				'geometry': {
					'type': 'GeometryCollection',
					'geometries': [{
						'type': 'LineString',
						'coordinates': [[-122.4425587930444, 37.80666418607323], [-122.4428379594768, 37.80663578323093]]
					}, {
						'type': 'LineString',
						'coordinates': [
							[-122.4425509770566, 37.80662588061205],
							[-122.4428340530617, 37.8065999493009]
						]
					}]
				},
				'properties': {
					'name': 'SF Marina Harbor Master'
				}
			}]
		};

		const expected = {
			'type': 'FeatureCollection',
			'features': [{
				'type': 'Feature',
				'geometry': {
					'type': 'GeometryCollection',
					'geometries': [{
						'type': 'LineString',
						'coordinates': [[-122.442559, 37.806664], [-122.442838, 37.806636]]
					}, {
						'type': 'LineString',
						'coordinates': [[-122.442551, 37.806626], [-122.442834, 37.8066]]
					}]
				},
				'properties': {
					'name': 'SF Marina Harbor Master'
				}
			}]
		};
		expect(new GeoJSON(json).toGeoJSON()).to.eql(expected);
	});

	it('roundtrips MultiPoint features', () => {
		const json = {
			'type': 'FeatureCollection',
			'features': [{
				'type': 'Feature',
				'geometry': {
					'type': 'MultiPoint',
					'coordinates': [[-122.4425587930444, 37.80666418607323], [-122.4428379594768, 37.80663578323093]]
				},
				'properties': {
					'name': 'Test MultiPoints'
				}
			}]
		};

		const expected = {
			'type': 'FeatureCollection',
			'features': [{
				'type': 'Feature',
				'geometry': {
					'type': 'MultiPoint',
					'coordinates': [[-122.442559, 37.806664], [-122.442838, 37.806636]]
				},
				'properties': {
					'name': 'Test MultiPoints'
				}
			}]
		};
		expect(new GeoJSON(json).toGeoJSON()).to.eql(expected);
	});

	it('omits layers which do not implement toGeoJSON', () => {
		const tileLayer = new TileLayer(),
		    layerGroup = new LayerGroup([tileLayer]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: []
		});
	});

	it('should return only one FeatureCollection for nested LayerGroups', () => {
		const layerGroup = new LayerGroup([
			new LayerGroup([new Marker([-41.3330287, 173.2008273])]),
			new Marker([-41.273356, 173.287278])
		]);

		const geoJSON = layerGroup.toGeoJSON();

		expect(geoJSON.features.length).to.eql(2);
		expect(geoJSON.features[0].type).to.eql('Feature');
		expect(geoJSON.features[1].type).to.eql('Feature');
	});

	it('should allow specific precisions', () => {
		const marker = new Marker([10, 20]),
		    polyline = new Polyline([[10, 20], [2, 5]]),
		    layerGroup = new LayerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON(3)).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(3), polyline.toGeoJSON(3)]
		});
	});
});

describe('GeoJSON functions', () => {
	describe('#geometryToLayer', () => {
		const point = {
			type: 'Point',
			coordinates: [0, 0]
		};
		const multiPoint  = {
			type: 'MultiPoint',
			coordinates: [
				[0, 0], [10, 10]
			]
		};
		const line =  {
			type: 'LineString',
			coordinates: [
				[0, 0], [10, 10], [20, 20]
			]
		};
		const multiLine = {
			type: 'MultiLineString',
			coordinates: [
				[[10, 10], [20, 20], [30, 30]],
				[[50, 50], [60, 60], [70, 70]]
			]
		};
		const polygon = {
			type: 'Polygon',
			coordinates: [
				[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
			]
		};
		const multiPolygon = {
			type: 'MultiPolygon',
			coordinates: [
				[
					[[30, 20], [45, 40], [10, 40], [30, 20]]
				],
				[
					[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
				]
			]
		};
		const geometryCollection  = {
			type: 'GeometryCollection',
			geometries: [
				{
					type: 'Point',
					coordinates: [0, 0]
				},
				{
					type: 'LineString',
					coordinates: [
						[10, 10], [20, 20]
					]
				}
			]
		};

		const featureCollection  = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [0, 0]
					}
				},
			]
		};

		function customPointToLayer(geojsonPoint, latLng) {
			return new Circle(latLng, {
				radius: geojsonPoint.properties.radius
			});
		}

		function customCoordstoLatLng(coords) {
			return new LatLng(coords[1] + 1, coords[0] + 1, coords[2] + 1);
		}

		[
			[point, Marker],
			[line, Polyline],
			[polygon, Polygon],
			[multiPoint, FeatureGroup],
			[multiLine, Polyline],
			[multiPolygon, Polygon],
			[geometryCollection, FeatureGroup],
			[featureCollection, FeatureGroup]
		].forEach((item) => {
			const geometry = item[0], expectedType = item[1];

			it(`creates a Layer from a GeoJSON feature (type='${geometry.type}')`, () => {
				const layer = GeoJSON.geometryToLayer({
					type: 'Feature',
					geometry
				});
				expect(layer).to.be.instanceOf(expectedType);
			});

			it(`creates a Layer from a GeoJSON geometry (type='${geometry.type}')`, () => {
				const layer = GeoJSON.geometryToLayer(geometry);
				expect(layer).to.be.instanceOf(expectedType);
			});
		});

		it('throws an error if feature is an invalid GeoJSON object', () => {
			expect(() => GeoJSON.geometryToLayer({
				type: 'Feature',
				geometry: {
					type: 'invalid',
					coordinates: [0, 0]
				}
			})).to.throw('Invalid GeoJSON object.');
		});

		it('returns nothing if feature does not have a geometry property', () => {
			const ret = GeoJSON.geometryToLayer({type: 'Feature'});
			expect(ret).not.to.be.true;
		});

		it('creates a Layer using pointToLayer option (Point)', () => {
			const layer = GeoJSON.geometryToLayer({
				type: 'Feature',
				geometry: point,
				properties: {radius: 100}
			}, {
				pointToLayer: customPointToLayer
			});
			expect(layer).to.be.instanceOf(Circle);
			expect(layer.options.radius).to.equal(100);
		});

		it('creates a Layer using pointToLayer option (MultiPoint)', () => {
			const layer = GeoJSON.geometryToLayer({
				type: 'Feature',
				geometry: multiPoint,
				properties: {radius: 100}
			}, {
				pointToLayer: customPointToLayer
			});
			layer.eachLayer((lyr) => {
				expect(lyr).to.be.instanceOf(Circle);
				expect(lyr.options.radius).to.equal(100);
			});
		});

		it('creates a Layer using coordsToLatLng option (Point)', () => {
			const layer = GeoJSON.geometryToLayer({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [1, 2, 3]
				}
			}, {
				coordsToLatLng: customCoordstoLatLng
			});
			expect(layer.getLatLng().equals(new LatLng(3, 2, 4))).to.be.true;
		});

		it('creates a Layer using coordsToLatLng option (MultiPoint)', () => {
			const layer = GeoJSON.geometryToLayer({
				type: 'Feature',
				geometry: {
					type: 'MultiPoint',
					coordinates: [
						[1, 2, 3], [4, 5, 6]
					]
				}
			}, {
				coordsToLatLng: customCoordstoLatLng
			});

			expect(layer.getLayers()[0].getLatLng().equals(new LatLng(3, 2, 4))).to.be.true;
			expect(layer.getLayers()[1].getLatLng().equals(new LatLng(6, 5, 7))).to.be.true;
		});
	});

	describe('#coordsToLatLng', () => {
		it('creates a LatLng object with given coordinates', () => {
			const latLng = GeoJSON.coordsToLatLng([1, 2]);
			const latLngWithAlt = GeoJSON.coordsToLatLng([3, 4, 5]);
			expect(latLng).to.be.instanceOf(LatLng);
			expect(latLngWithAlt).to.be.instanceOf(LatLng);
			expect(latLng.equals(new LatLng(2, 1))).to.be.true;
			expect(latLngWithAlt.equals(new LatLng(4, 3, 5)));
		});
	});

	describe('#coordsToLatLngs', () => {

		function customCoordsToLatLng(coords) {
			return new LatLng(coords[1] + 1, coords[0] + 1, coords[2] + 1);
		}

		it('creates a multidimensional array of LatLngs', () => {
			const latLngs = GeoJSON.coordsToLatLngs([[1, 2], [3, 4], [5, 6]]);

			expect(latLngs[0].equals(new LatLng(1, 2)));
			expect(latLngs[1].equals(new LatLng(3, 4)));
			expect(latLngs[2].equals(new LatLng(5, 6)));

			latLngs.forEach((latLng) => {
				expect(latLng).to.be.instanceOf(LatLng);
			});
		});

		it('creates a multidimensional array of LatLngs (levelsDeep=1)', () => {
			const latLngs = GeoJSON.coordsToLatLngs([
				[[1, 2], [3, 4], [5, 6]],
				[[5, 6], [7, 8], [9, 10]]
			], 1);

			expect(latLngs[0][0].equals(new LatLng(1, 2)));
			expect(latLngs[0][1].equals(new LatLng(3, 4)));
			expect(latLngs[0][2].equals(new LatLng(5, 6)));

			expect(latLngs[1][0].equals(new LatLng(5, 6)));
			expect(latLngs[1][1].equals(new LatLng(7, 8)));
			expect(latLngs[1][2].equals(new LatLng(9, 10)));

			latLngs.forEach((arr) => {
				arr.forEach((latlng) => {
					expect(latlng).to.be.instanceOf(LatLng);
				});
			});
		});

		it('creates a multidimensional array of LatLngs with custom coordsToLatLng', () => {
			const coords = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
			const latLngs = GeoJSON.coordsToLatLngs(coords, 0, customCoordsToLatLng);

			expect(latLngs[0].equals(new LatLng(3, 2, 4)));
			expect(latLngs[1].equals(new LatLng(6, 5, 7)));
			expect(latLngs[2].equals(new LatLng(9, 8, 10)));
		});

		it('creates a multidimensional array of LatLngs with custom coordsToLatLng (levelDeep=1)', () => {
			const coords = [
				[[1, 2, 3], [4, 5, 6]],
				[[12, 13, 14], [15, 16, 17]]
			];
			const latLngs = GeoJSON.coordsToLatLngs(coords, 1, customCoordsToLatLng);

			expect(latLngs[0][0].equals(new LatLng(3, 2, 4)));
			expect(latLngs[0][1].equals(new LatLng(6, 5, 7)));

			expect(latLngs[1][0].equals(new LatLng(14, 13, 15)));
			expect(latLngs[1][1].equals(new LatLng(17, 16, 18)));
		});
	});

	describe('#latLngToCoords', () => {
		it('accepts latlng array', () => {
			const coords = GeoJSON.latLngToCoords([2, 1, 3]);
			expect(coords).to.eql([1, 2, 3]);
		});

		it('returns an array of coordinates and altitude', () => {
			const coords = GeoJSON.latLngToCoords(new LatLng(2, 1));
			const coordsWithAlt = GeoJSON.latLngToCoords(new LatLng(2, 1, 3));
			expect(coords).to.eql([1, 2]);
			expect(coordsWithAlt).to.eql([1, 2, 3]);
		});

		it('returns an array of coordinates with given precision', () => {
			const coords = GeoJSON.latLngToCoords(new LatLng(
				2.123456, 1.123456
			), 3);
			const coordsWithAlt = GeoJSON.latLngToCoords(new LatLng(
				2.123456, 1.123456, 3.123456
			), 3);
			expect(coords).to.eql([1.123, 2.123]);
			expect(coordsWithAlt).to.eql([1.123, 2.123, 3.123]);
		});
	});

	describe('#latLngsToCoords', () => {
		it('accepts multidimensional latlng array', () => {
			const coords = GeoJSON.latLngsToCoords([[2, 1, 3], [5, 4, 6]]);
			expect(coords).to.eql([[1, 2, 3], [4, 5, 6]]);
		});

		it('returns a multidimensional array of coordinates', () => {
			const coords = GeoJSON.latLngsToCoords([new LatLng(2, 1), new LatLng(4, 3)]);
			const coordWithAlt = GeoJSON.latLngsToCoords([new LatLng(2, 1, 3), new LatLng(5, 4, 6)]);
			expect(coords).to.eql([[1, 2], [3, 4]]);
			expect(coordWithAlt).to.eql([[1, 2, 3], [4, 5, 6]]);
		});

		it('returns a multidimensional array of coordinates (levelDeep=1)', () => {
			const latLngs = [
				[new LatLng(2, 1), new LatLng(4, 3)],
				[new LatLng(6, 5), new LatLng(8, 7)]
			];
			const coords = GeoJSON.latLngsToCoords(latLngs, 1);
			expect(coords).to.eql([
				[[1, 2], [3, 4]],
				[[5, 6], [7, 8]]
			]);
		});

		it('returns a multidimensional array of coordinates (closed=True)', () => {
			const latLngs = [new LatLng(2, 1), new LatLng(4, 3), new LatLng(6, 5)];
			const coords = GeoJSON.latLngsToCoords(latLngs, 0, true);
			expect(coords).to.eql([[1, 2], [3, 4], [5, 6], [1, 2]]);
		});

		it('returns a multidimensional array of coordinates (levelsDeep=1, closed=True)', () => {
			const latLngs = [
				[new LatLng(2, 1), new LatLng(4, 3), new LatLng(6, 5)],
				[new LatLng(8, 7), new LatLng(10, 9), new LatLng(12, 11)]
			];
			const coords = GeoJSON.latLngsToCoords(latLngs, 1, true);
			expect(coords).to.eql([
				[[1, 2], [3, 4], [5, 6], [1, 2]],
				[[7, 8], [9, 10], [11, 12], [7, 8]]
			]);
		});

		it('returns a multidimensional array of coordinates with given precision', () => {
			const latLngs = [new LatLng(2.123456, 1.123456), new LatLng(4.123456, 3.123456)];
			const coords = GeoJSON.latLngsToCoords(latLngs, 0, false, 3);
			expect(coords).to.eql([[1.123, 2.123], [3.123, 4.123]]);
		});

		it('returns a valid geojson from an unbalanced multipolygon', () => {
			const poly = new Polygon([
				[
					[
						[51.509, -0.08],
						[51.503, -0.06],
						[51.51, -0.046]
					],
					[
						[51.508, -0.06],
						[51.504, -0.06],
						[51.509, -0.05]
					]
				], [
					[51.499, -0.08],
					[51.493, -0.06],
					[51.48, -0.046]
				]
			]);

			expect(poly.toGeoJSON(3).geometry).to.eql({
				type: 'MultiPolygon',
				coordinates: [
					[
						[
							[-0.08, 51.509],
							[-0.06, 51.503],
							[-0.046, 51.51],
							[-0.08, 51.509]
						],
						[
							[-0.06, 51.508],
							[-0.06, 51.504],
							[-0.05, 51.509],
							[-0.06, 51.508]
						]
					], [
						[-0.08, 51.499],
						[-0.06, 51.493],
						[-0.046, 51.48],
						[-0.08, 51.499]
					]
				]
			});
		});
		it('has no reference between first and last coordinates', () => {
			const coords = GeoJSON.latLngsToCoords([[2, 1, 3], [5, 4, 6]], null, true);
			expect(coords).to.eql([[1, 2, 3], [4, 5, 6], [1, 2, 3]]);
			expect(coords[0] === coords[2]).to.be.false;
		});
		it('still works if no values in coords array', () => {
			expect(() => {
				GeoJSON.latLngsToCoords([[]], 1, true);
			}).to.not.throw();
		});
	});

	describe('#asFeature', () => {
		const geometry1 = {
			type: 'Point',
			coordinates: [0, 0]
		};

		const geometry2 = {
			type: 'Point',
			coordinates: [1, 1]
		};

		const feature1 = {
			type: 'Feature',
			geometry: geometry1,
			properties: {a: 1}
		};

		const feature2 = {
			type: 'Feature',
			geometry: geometry2,
			properties: {b: 2}
		};

		const featureCollection = {
			type: 'FeatureCollection',
			features: [
				feature1,
				feature2
			]
		};

		it('given a bare geometry returns a GeoJSON-like feature', () => {
			const ret = GeoJSON.asFeature(geometry1);
			expect(ret).to.eql({
				type: 'Feature',
				properties: {},
				geometry: geometry1
			});
		});

		it('given a GeoJSON feature directly returns it', () => {
			const ret = GeoJSON.asFeature(feature1);
			expect(ret).to.eql(feature1);
		});

		it('given a GeoJSON feature collection directly returns it', () => {
			const ret = GeoJSON.asFeature(featureCollection);
			expect(ret).to.eql(featureCollection);
		});
	});
});
