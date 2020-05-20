describe("L.GeoJSON", function () {
	describe("addData", function () {
		var geojson = {
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

		it("sets feature property on member layers", function () {
			var layer = new L.GeoJSON();
			layer.addData(geojson);
			expect(layer.getLayers()[0].feature).to.eql(geojson);
		});

		it("normalizes a geometry to a Feature", function () {
			var layer = new L.GeoJSON();
			layer.addData(geojson.geometry);
			expect(layer.getLayers()[0].feature).to.eql(geojson);
		});

		it("accepts geojson with null geometry", function () {
			var layer = new L.GeoJSON();
			layer.addData(geojsonEmpty);
			expect(layer.getLayers().length).to.eql(0);
		});

		it("makes default marker inherit group options if explicitly requested", function () {
			// Check first that it does not inherit group options by default
			var options = {
				customOption: "My Custom Option"
			};
			var layer = new L.GeoJSON(null, options);
			layer.addData(geojson);
			expect(layer.getLayers()[0].options.customOption).to.equal(undefined);

			// Now make it inherit group options
			layer.options.markersInheritOptions = true;
			layer.addData(geojson);
			expect(layer.getLayers()[1].options.customOption).to.eql(options.customOption);
		});
	});

	describe('resetStyle', function () {
		it('should reset init options', function () {
			var feature = {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates:[[-2.35, 51.38], [-2.38, 51.38]]
				}
			};
			var geojson = L.geoJSON(feature, {weight: 7, color: 'chocolate'});
			geojson.setStyle({weight: 22, color: 'coral'});
			var layer = geojson.getLayers()[0];
			expect(layer.options.weight).to.be(22);
			expect(layer.options.color).to.be('coral');
			geojson.resetStyle(layer);
			expect(layer.options.weight).to.be(7);
			expect(layer.options.color).to.be('chocolate');
		});

		it('should reset init options of all child layers', function () {
			var feature = {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates:[[-2.35, 51.38], [-2.38, 51.38]]
				}
			};
			var feature2 = {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates:[[-3.35, 50.38], [-3.38, 50.38]]
				}
			};
			var geojson = L.geoJSON([feature, feature2], {weight: 7, color: 'chocolate'});
			geojson.setStyle({weight: 22, color: 'coral'});
			var layer = geojson.getLayers()[0];
			expect(layer.options.weight).to.be(22);
			expect(layer.options.color).to.be('coral');
			var layer2 = geojson.getLayers()[1];
			expect(layer2.options.weight).to.be(22);
			expect(layer2.options.color).to.be('coral');
			geojson.resetStyle(); // Should apply to all layers
			expect(layer.options.weight).to.be(7);
			expect(layer.options.color).to.be('chocolate');
			expect(layer2.options.weight).to.be(7);
			expect(layer2.options.color).to.be('chocolate');
		});
	});
});

describe("L.Marker#toGeoJSON", function () {
	it("returns a 2D Point object", function () {
		var marker = new L.Marker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it("returns a 3D Point object", function () {
		var marker = new L.Marker([10, 20, 30]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', function () {
		var marker = new L.Marker([10.123456, 20.123456, 30.123456]);
		expect(marker.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123, 30.123]
		});
	});
});

describe("L.Circle#toGeoJSON", function () {
	it("returns a 2D Point object", function () {
		var circle = new L.Circle([10, 20], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it("returns a 3D Point object", function () {
		var circle = new L.Circle([10, 20, 30], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', function () {
		var circle = new L.Circle([10.1234, 20.1234, 30.1234], 100);
		expect(circle.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123, 30.123]
		});
	});
});

describe("L.CircleMarker#toGeoJSON", function () {
	it("returns a 2D Point object", function () {
		var marker = new L.CircleMarker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it("returns a 3D Point object", function () {
		var marker = new L.CircleMarker([10, 20, 30]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it("should allow specific precisions", function () {
		var marker = new L.CircleMarker([10.1234, 20.1234]);
		expect(marker.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123]
		});
	});
});

describe("L.Polyline#toGeoJSON", function () {
	it("returns a 2D LineString object", function () {
		var polyline = new L.Polyline([[10, 20], [2, 5]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10], [5, 2]]
		});
	});

	it("returns a 3D LineString object", function () {
		var polyline = new L.Polyline([[10, 20, 30], [2, 5, 10]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10, 30], [5, 2, 10]]
		});
	});

	it("should allow specific precisions", function () {
		var polyline = new L.Polyline([[10.1234, 20.1234, 30.1234], [2.1234, 5.1234, 10.1234]]);
		expect(polyline.toGeoJSON(3).geometry).to.eql({
			type: 'LineString',
			coordinates: [[20.123, 10.123, 30.123], [5.123, 2.123, 10.123]]
		});
	});
});

describe("L.Polyline (multi) #toGeoJSON", function () {
	it("returns a 2D MultiLineString object", function () {
		var multiPolyline = new L.Polyline([[[10, 20], [2, 5]], [[1, 2], [3, 4]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10], [5, 2]],
				[[2, 1], [4, 3]]
			]
		});
	});

	it("returns a 3D MultiLineString object", function () {
		var multiPolyline = new L.Polyline([[[10, 20, 30], [2, 5, 10]], [[1, 2, 3], [4, 5, 6]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10, 30], [5, 2, 10]],
				[[2, 1, 3], [5, 4, 6]]
			]
		});
	});

	it("should allow specific precisions", function () {
		var multiPolyline = new L.Polyline([[[10.1234, 20.1234, 30.1234], [2.1234, 5.1234, 10.1234]], [[1.1234, 2.1234, 3.1234], [4.1234, 5.1234, 6.1234]]]);
		expect(multiPolyline.toGeoJSON(3).geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20.123, 10.123, 30.123], [5.123, 2.123, 10.123]],
				[[2.123, 1.123, 3.123], [5.123, 4.123, 6.123]]
			]
		});
	});
});

describe("L.Polygon#toGeoJSON", function () {
	it("returns a 2D Polygon object (no holes) from a flat LatLngs array", function () {
		var polygon = new L.Polygon([[1, 2], [3, 4], [5, 6]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1], [4, 3], [6, 5], [2, 1]]]
		});
	});

	it("returns a 3D Polygon object (no holes) from a flat LatLngs array", function () {
		var polygon = new L.Polygon([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]]
		});
	});

	it("returns a 2D Polygon object from a simple GeoJSON like input", function () {
		var multiPolygon = new L.Polygon([[[1, 2], [3, 4], [5, 6]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]]
			]
		});
	});

	it("returns a 3D MultiPolygon object from a simple GeoJSON like input", function () {
		var multiPolygon = new L.Polygon([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]
			]
		});
	});

	it("returns a 2D Polygon object (with holes)", function () {
		var polygon = new L.Polygon([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]],
				[[8, 7], [10, 9], [12, 11], [8, 7]]
			]
		});
	});

	it("returns a 3D Polygon object (with holes)", function () {
		var polygon = new L.Polygon([[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[10, 11, 12], [13, 14, 15], [16, 17, 18]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]],
				[[11, 10, 12], [14, 13, 15], [17, 16, 18], [11, 10, 12]]
			]
		});
	});

	it("should allow specific precisions", function () {
		var polygon = new L.Polygon([[1.1234, 2.1234], [3.1234, 4.1234], [5.1234, 6.1234]]);
		expect(polygon.toGeoJSON(3).geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2.123, 1.123], [4.123, 3.123], [6.123, 5.123], [2.123, 1.123]]]
		});
	});
});

describe("L.Polygon (multi) #toGeoJSON", function () {
	it("returns a 2D MultiPolygon object", function () {
		var multiPolygon = new L.Polygon([[[[1, 2], [3, 4], [5, 6]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]]
			]
		});
	});

	it("returns a 3D MultiPolygon object", function () {
		var multiPolygon = new L.Polygon([[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]]
			]
		});
	});

	it("returns a 2D MultiPolygon object with two polygons", function () {
		var multiPolygon = new L.Polygon([[[[1, 2], [3, 4], [5, 6]]], [[[7, 8], [9, 10], [11, 12]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]],
				[[[8, 7], [10, 9], [12, 11], [8, 7]]]
			]
		});
	});

	it("returns a 2D MultiPolygon object with polygon having a hole", function () {
		var multiPolygon = new L.Polygon([[[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]], [[8, 7], [10, 9], [12, 11], [8, 7]]]
			]
		});
	});

	it("should allow specific precisions", function () {
		var multiPolygon = new L.Polygon([[[[1.1234, 2.1234], [3.1234, 4.1234], [5.1234, 6.1234]]]]);
		expect(multiPolygon.toGeoJSON(3).geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2.123, 1.123], [4.123, 3.123], [6.123, 5.123], [2.123, 1.123]]]
			]
		});
	});
});

describe("L.LayerGroup#toGeoJSON", function () {
	it("returns a 2D FeatureCollection object", function () {
		var marker = new L.Marker([10, 20]),
		    polyline = new L.Polyline([[10, 20], [2, 5]]),
		    layerGroup = new L.LayerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(), polyline.toGeoJSON()]
		});
	});

	it("returns a 3D FeatureCollection object", function () {
		var marker = new L.Marker([10, 20, 30]),
		    polyline = new L.Polyline([[10, 20, 30], [2, 5, 10]]),
		    layerGroup = new L.LayerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(), polyline.toGeoJSON()]
		});
	});

	it("ensures that every member is a Feature", function () {
		var tileLayer = new L.TileLayer(),
		    layerGroup = new L.LayerGroup([tileLayer]);

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

	it('roundtrips GeometryCollection features', function () {
		var json = {
			"type": "FeatureCollection",
			"features": [{
				"type": "Feature",
				"geometry": {
					"type": "GeometryCollection",
					"geometries": [{
						"type": "LineString",
						"coordinates": [[-122.4425587930444, 37.80666418607323], [-122.4428379594768, 37.80663578323093]]
					}, {
						"type": "LineString",
						"coordinates": [
							[-122.4425509770566, 37.80662588061205],
							[-122.4428340530617, 37.8065999493009]
						]
					}]
				},
				"properties": {
					"name": "SF Marina Harbor Master"
				}
			}]
		};

		var expected = {
			"type": "FeatureCollection",
			"features": [{
				"type": "Feature",
				"geometry": {
					"type": "GeometryCollection",
					"geometries": [{
						"type": "LineString",
						"coordinates": [[-122.442559, 37.806664], [-122.442838, 37.806636]]
					}, {
						"type": "LineString",
						"coordinates": [[-122.442551, 37.806626], [-122.442834, 37.8066]]
					}]
				},
				"properties": {
					"name": "SF Marina Harbor Master"
				}
			}]
		};
		expect(L.geoJSON(json).toGeoJSON()).to.eql(expected);
	});

	it('roundtrips MultiPoint features', function () {
		var json = {
			"type": "FeatureCollection",
			"features": [{
				"type": "Feature",
				"geometry": {
					"type": "MultiPoint",
					"coordinates": [[-122.4425587930444, 37.80666418607323], [-122.4428379594768, 37.80663578323093]]
				},
				"properties": {
					"name": "Test MultiPoints"
				}
			}]
		};

		var expected = {
			"type": "FeatureCollection",
			"features": [{
				"type": "Feature",
				"geometry": {
					"type": "MultiPoint",
					"coordinates": [[-122.442559, 37.806664], [-122.442838, 37.806636]]
				},
				"properties": {
					"name": "Test MultiPoints"
				}
			}]
		};
		expect(L.geoJSON(json).toGeoJSON()).to.eql(expected);
	});

	it("omits layers which do not implement toGeoJSON", function () {
		var tileLayer = new L.TileLayer(),
		    layerGroup = new L.LayerGroup([tileLayer]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: []
		});
	});

	it('should return only one FeatureCollection for nested LayerGroups', function () {
		var layerGroup = new L.LayerGroup([
			new L.LayerGroup([new L.Marker([-41.3330287, 173.2008273])]),
			new L.Marker([-41.273356, 173.287278])
		]);

		var geoJSON = layerGroup.toGeoJSON();

		expect(geoJSON.features.length).to.eql(2);
		expect(geoJSON.features[0].type).to.eql("Feature");
		expect(geoJSON.features[1].type).to.eql("Feature");
	});

	it("should allow specific precisions", function () {
		var marker = new L.Marker([10, 20]),
		    polyline = new L.Polyline([[10, 20], [2, 5]]),
		    layerGroup = new L.LayerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON(3)).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(3), polyline.toGeoJSON(3)]
		});
	});
});

describe("L.GeoJSON functions", function () {
	describe("#geometryToLayer", function () {
		const point = {
			type: "Point",
			coordinates: [0, 0]
		};
		const multiPoint  = {
			type: "MultiPoint",
			coordinates: [
				[0, 0], [10, 10]
			]
		};
		const line =  {
			type: "LineString",
			coordinates: [
				[0, 0], [10, 10], [20, 20]
			]
		};
		const multiLine = {
			type: "MultiLineString",
			coordinates: [
				[[10, 10], [20, 20], [30, 30]],
				[[50, 50], [60, 60], [70, 70]]
			]
		};
		const polygon = {
			type: "Polygon",
			coordinates: [
				[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
			]
		};
		const multiPolygon = {
			type: "MultiPolygon",
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
			type: "GeometryCollection",
			geometries: [
				{
					type: "Point",
					coordinates: [0, 0]
				},
				{
					type: "LineString",
					coordinates: [
						[10, 10], [20, 20]
					]
				}
			]
		};

		function customPointToLayer(geojsonPoint, latLng) {
			return new L.Circle(latLng, {
				radius: geojsonPoint.properties.radius
			});
		}

		function customCoordstoLatLng(coords) {
			return new L.LatLng(coords[1] + 1, coords[0] + 1, coords[2] + 1);
		}

		[
			point, line, polygon,
			multiPoint, multiLine, multiPolygon,
			geometryCollection
		].forEach(function (geometry) {
			it("creates a Layer from a GeoJSON feature (type='" + geometry.type + "')", function () {
				const layer = L.GeoJSON.geometryToLayer({
					type: "Feature",
					geometry: geometry
				});
				expect(layer instanceof L.Layer).to.be(true);
			});
		});

		[
			point, line, polygon,
			multiPoint, multiLine, multiPolygon,
			geometryCollection
		].forEach(function (geometry) {
			it("creates a Layer from a GeoJSON geometry (type='" + geometry.type + "')", function () {
				const layer = L.GeoJSON.geometryToLayer(geometry);
				expect(layer instanceof L.Layer).to.be(true);
			});
		});

		it("throws an error if feature is an invalid GeoJSON object", function () {
			expect(function () {
				L.GeoJSON.geometryToLayer({
					type: "Feature",
					geometry: {
						type: "invalid",
						coordinates: [0, 0]
					}
				});
			}).to.throwError("Invalid GeoJSON object.");
		});

		it("returns null if feature does not have a geometry property", function () {
			const ret = L.GeoJSON.geometryToLayer({type: "Feature"});
			expect(ret).to.be(null);
		});

		it("creates a Layer using pointToLayer option (Point)", function () {
			const layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: point,
				properties: {radius: 100}
			}, {
				pointToLayer: customPointToLayer
			});
			expect(layer instanceof L.Circle).to.be(true);
			expect(layer.options.radius).to.be(100);
		});

		it("creates a Layer using pointToLayer option (MultiPoint)", function () {
			const layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: multiPoint,
				properties: {radius: 100}
			}, {
				pointToLayer: customPointToLayer
			});
			Object.keys(layer._layers).forEach(function (id) {
				expect(layer._layers[id] instanceof L.Circle).to.be(true);
				expect(layer._layers[id].options.radius).to.be(100);
			});
		});

		it("creates a Layer using coordsToLatLng option (Point)", function () {
			const layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [1, 2, 3]
				}
			}, {
				coordsToLatLng: customCoordstoLatLng
			});
			expect(layer._latlng).to.eql({lat: 3, lng: 2, alt: 4});
		});

		it("creates a Layer using coordsToLatLng option (MultiPoint)", function () {
			const layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: {
					type: "MultiPoint",
					coordinates: [
						[1, 2, 3], [4, 5, 6]
					]
				}
			}, {
				coordsToLatLng: customCoordstoLatLng
			});
			const expected = [
				{lat: 3, lng: 2, alt: 4},
				{lat: 6, lng: 5, alt: 7}
			];
			const ids = Object.keys(layer._layers);
			for (var i = 0; i < ids.length; i++) {
				expect(layer._layers[ids[i]]._latlng).to.eql(expected[i]);
			}
		});
	});

	describe("#coordsToLatLng", function () {
		it("creates a LatLng object given longitude and latitude", function () {
			const latlng = L.GeoJSON.coordsToLatLng([0, 0]);
			expect(latlng instanceof L.LatLng).to.be(true);
			expect(latlng.lat).to.be(0);
			expect(latlng.lat).to.be(0);
			expect(latlng.alt).to.be(undefined);
		});

		it("creates a LatLng object given longitude, latitude and altitude", function () {
			const latlng = L.GeoJSON.coordsToLatLng([0, 0, 0]);
			expect(latlng instanceof L.LatLng).to.be(true);
			expect(latlng.lat).to.be(0);
			expect(latlng.lat).to.be(0);
			expect(latlng.alt).to.be(0);
		});
	});

	describe("#coordsToLatLngs", function () {

		function customCoordsToLatLng(coords) {
			return new L.LatLng(coords[0] + 1, coords[1] + 1, coords[2] + 1);
		}

		it("creates a multidimensional array of LatLngs", function () {
			const latLngs = L.GeoJSON.coordsToLatLngs([[0, 0], [1, 1], [2, 2]]);
			expect(latLngs.length).to.be(3);
			latLngs.forEach(function (latLng) {
				expect(latLng instanceof L.LatLng).to.be(true);
			});
		});

		it("creates a multidimensional array of LatLngs (levelsDeep=1)", function () {
			const latLngs = L.GeoJSON.coordsToLatLngs([
				[[0, 0], [1, 1], [2, 2]],
				[[4, 4], [5, 5], [6, 6]]
			], 1);
			expect(latLngs.length).to.be(2);
			for (var i = 0; i < latLngs.length; i++) {
				for (var j = 0; j < latLngs[i].length; j++) {
					expect(latLngs[i][j] instanceof L.LatLng).to.be(true);
				}
			}
		});

		it("creates a multidimensional array of LatLngs with custom coordsToLatLng", function () {
			const coords = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
			const latLngs = L.GeoJSON.coordsToLatLngs(coords, 0, customCoordsToLatLng);
			const expected = [
				{lat: 2, lng: 3, alt: 4},
				{lat: 5, lng: 6, alt: 7},
				{lat: 8, lng: 9, alt: 10}
			];
			for (var i = 0; i < latLngs.length; i++) {
				expect(latLngs[i]).to.eql(expected[i]);
			}
		});

		it("creates a multidimensional array of LatLngs with custom coordsToLatLng (levelDeep=1)", function () {
			const coords = [
				[[1, 2, 3], [4, 5, 6]],
				[[12, 13, 14], [15, 16, 17]]
			];
			const latLngs = L.GeoJSON.coordsToLatLngs(coords, 1, customCoordsToLatLng);
			const expected = [
				[
					{lat: 2, lng: 3, alt: 4},
					{lat: 5, lng: 6, alt: 7}
				],
				[
					{lat: 13, lng: 14, alt: 15},
					{lat: 16, lng: 17, alt: 18}
				]
			];
			for (var i = 0; i < latLngs.length; i++) {
				for (var j = 0; j < latLngs[i].length; j++) {
					expect(latLngs[i][j]).to.eql(expected[i][j]);
				}
			}
		});
	});

	describe("#latLngToCoords", function () {
		it("returns an array of coordinates (longitude, latitude)", function () {
			const coords = L.GeoJSON.latLngToCoords(new L.LatLng(0, 0));
			expect(coords).to.eql([0, 0]);
		});

		it("returns an array of coordinates and altitude (longitude, latitude, altitude)", function () {
			const coords = L.GeoJSON.latLngToCoords(new L.LatLng(0, 0, 0));
			expect(coords).to.eql([0, 0, 0]);
		});

		it("returns an array of coordinates with given precision (longitude, latitude)", function () {
			const coords = L.GeoJSON.latLngToCoords(new L.LatLng(
				1.123456, 1.123456
			), 3);
			expect(coords).to.eql([1.123, 1.123]);
		});

		it("returns an array of coordinates with given precision (longitude, latitude, altitude)", function () {
			const coords = L.GeoJSON.latLngToCoords(new L.LatLng(
				1.123456, 1.123456, 1.123456
			), 3);
			expect(coords).to.eql([1.123, 1.123, 1.123]);
		});
	});

	describe("#latLngsToCoords", function () {
		it("returns a multidimensional array of coordinates", function () {
			const coords = L.GeoJSON.latLngsToCoords([L.latLng(0, 0), L.latLng(1, 1)]);
			expect(coords).to.eql([[0, 0], [1, 1]]);
		});

		it("returns a multidimensional array of coordinates (levelDeep=1)", function () {
			const latLngs = [
				[L.latLng(0, 0), L.latLng(1, 1)],
				[L.latLng(2, 2), L.latLng(3, 3)]
			];
			const coords = L.GeoJSON.latLngsToCoords(latLngs, 1);
			const expected = [
				[[0, 0], [1, 1]],
				[[2, 2], [3, 3]]
			];
			expect(coords).to.eql(expected);
		});

		it("returns a multidimensional array of coordinates (closed=True)", function () {
			const latLngs = [L.latLng(0, 0), L.latLng(1, 1), L.latLng(2, 2)];
			const coords = L.GeoJSON.latLngsToCoords(latLngs, 0, true);
			expect(coords).to.eql([[0, 0], [1, 1], [2, 2], [0, 0]]);
		});

		it("returns a multidimensional array of coordinates (levelsDeep=1, closed=True)", function () {
			const latLngs = [
				[L.latLng(0, 0), L.latLng(1, 1), L.latLng(2, 2)],
				[L.latLng(3, 3), L.latLng(4, 4), L.latLng(5, 5)]
			];
			const coords = L.GeoJSON.latLngsToCoords(latLngs, 1, true);
			const expected = [
				[[0, 0], [1, 1], [2, 2], [0, 0]],
				[[3, 3], [4, 4], [5, 5], [3, 3]]
			];
			expect(coords).to.eql(expected);
		});

		it("returns a multidimensional array of coordinates with given precision", function () {
			const latLngs = [L.latLng(1.123456, 1.123456), L.latLng(2.123456, 2.123456)];
			const coords = L.GeoJSON.latLngsToCoords(latLngs, 0, false, 3);
			expect(coords).to.eql([[1.123, 1.123], [2.123, 2.123]]);
		});

		it("returns a multidimensional array of coordinates (latitude, longitude, altitude)", function () {
			const latLngs = [L.latLng(0, 0, 0), L.latLng(1, 1, 1)];
			const coords = L.GeoJSON.latLngsToCoords(latLngs);
			expect(coords).to.eql([[0, 0, 0], [1, 1, 1]]);
		});
	});

	describe("#asFeature", function () {
		const geometry1 = {
			type: "Point",
			coordinates: [0, 0]
		};

		const geometry2 = {
			type: "Point",
			coordinates: [1, 1]
		};

		const feature1 = {
			type: "Feature",
			geometry: geometry1,
			properties: {a: 1}
		};

		const feature2 = {
			type: "Feature",
			geometry: geometry2,
			properties: {b: 2}
		};

		const featureCollection = {
			type: "FeatureCollection",
			features: [
				feature1,
				feature2
			]
		};

		it("given a bare geometry returns a GeoJSON-like feature", function () {
			const ret = L.GeoJSON.asFeature(geometry1);
			const expected = {
				type: "Feature",
				properties: {},
				geometry: geometry1
			};
			expect(ret).to.eql(expected);
		});

		it("given a GeoJSON feature directly returns it", function () {
			const ret = L.GeoJSON.asFeature(feature1);
			expect(ret).to.eql(feature1);
		});

		it("given a GeoJSON feature collection directly returns it", function () {
			const ret = L.GeoJSON.asFeature(featureCollection);
			expect(ret).to.eql(featureCollection);
		});
	});
});
