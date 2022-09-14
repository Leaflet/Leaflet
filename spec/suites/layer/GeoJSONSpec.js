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
			var layer = L.geoJSON();
			layer.addData(geojson);
			expect(layer.getLayers()[0].feature).to.eql(geojson);
		});

		it("normalizes a geometry to a Feature", function () {
			var layer = L.geoJSON();
			layer.addData(geojson.geometry);
			expect(layer.getLayers()[0].feature).to.eql(geojson);
		});

		it("accepts geojson with null geometry", function () {
			var layer = L.geoJSON();
			layer.addData(geojsonEmpty);
			expect(layer.getLayers().length).to.eql(0);
		});

		it("makes default marker inherit group options if explicitly requested", function () {
			// Check first that it does not inherit group options by default
			var options = {
				customOption: "My Custom Option"
			};
			var layer = L.geoJSON(null, options);
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
		var marker = L.marker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it("returns a 3D Point object", function () {
		var marker = L.marker([10, 20, 30]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', function () {
		var marker = L.marker([10.123456, 20.123456, 30.123456]);
		expect(marker.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123, 30.123]
		});
	});
});

describe("L.Circle#toGeoJSON", function () {
	it("returns a 2D Point object", function () {
		var circle = L.circle([10, 20], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it("returns a 3D Point object", function () {
		var circle = L.circle([10, 20, 30], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it('should allow specific precisions', function () {
		var circle = L.circle([10.1234, 20.1234, 30.1234], 100);
		expect(circle.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123, 30.123]
		});
	});
});

describe("L.CircleMarker#toGeoJSON", function () {
	it("returns a 2D Point object", function () {
		var marker = L.circleMarker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});

	it("returns a 3D Point object", function () {
		var marker = L.circleMarker([10, 20, 30]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10, 30]
		});
	});

	it("should allow specific precisions", function () {
		var marker = L.circleMarker([10.1234, 20.1234]);
		expect(marker.toGeoJSON(3).geometry).to.eql({
			type: 'Point',
			coordinates: [20.123, 10.123]
		});
	});
});

describe("L.Polyline#toGeoJSON", function () {
	it("returns a 2D LineString object", function () {
		var polyline = L.polyline([[10, 20], [2, 5]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10], [5, 2]]
		});
	});

	it("returns a 3D LineString object", function () {
		var polyline = L.polyline([[10, 20, 30], [2, 5, 10]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10, 30], [5, 2, 10]]
		});
	});

	it("should allow specific precisions", function () {
		var polyline = L.polyline([[10.1234, 20.1234, 30.1234], [2.1234, 5.1234, 10.1234]]);
		expect(polyline.toGeoJSON(3).geometry).to.eql({
			type: 'LineString',
			coordinates: [[20.123, 10.123, 30.123], [5.123, 2.123, 10.123]]
		});
	});
});

describe("L.Polyline (multi) #toGeoJSON", function () {
	it("returns a 2D MultiLineString object", function () {
		var multiPolyline = L.polyline([[[10, 20], [2, 5]], [[1, 2], [3, 4]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10], [5, 2]],
				[[2, 1], [4, 3]]
			]
		});
	});

	it("returns a 3D MultiLineString object", function () {
		var multiPolyline = L.polyline([[[10, 20, 30], [2, 5, 10]], [[1, 2, 3], [4, 5, 6]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10, 30], [5, 2, 10]],
				[[2, 1, 3], [5, 4, 6]]
			]
		});
	});

	it("should allow specific precisions", function () {
		var multiPolyline = L.polyline([[[10.1234, 20.1234, 30.1234], [2.1234, 5.1234, 10.1234]], [[1.1234, 2.1234, 3.1234], [4.1234, 5.1234, 6.1234]]]);
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
		var polygon = L.polygon([[1, 2], [3, 4], [5, 6]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1], [4, 3], [6, 5], [2, 1]]]
		});
	});

	it("returns a 3D Polygon object (no holes) from a flat LatLngs array", function () {
		var polygon = L.polygon([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]]
		});
	});

	it("returns a 2D Polygon object from a simple GeoJSON like input", function () {
		var multiPolygon = L.polygon([[[1, 2], [3, 4], [5, 6]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]]
			]
		});
	});

	it("returns a 3D MultiPolygon object from a simple GeoJSON like input", function () {
		var multiPolygon = L.polygon([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]
			]
		});
	});

	it("returns a 2D Polygon object (with holes)", function () {
		var polygon = L.polygon([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]],
				[[8, 7], [10, 9], [12, 11], [8, 7]]
			]
		});
	});

	it("returns a 3D Polygon object (with holes)", function () {
		var polygon = L.polygon([[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[10, 11, 12], [13, 14, 15], [16, 17, 18]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]],
				[[11, 10, 12], [14, 13, 15], [17, 16, 18], [11, 10, 12]]
			]
		});
	});

	it("should allow specific precisions", function () {
		var polygon = L.polygon([[1.1234, 2.1234], [3.1234, 4.1234], [5.1234, 6.1234]]);
		expect(polygon.toGeoJSON(3).geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2.123, 1.123], [4.123, 3.123], [6.123, 5.123], [2.123, 1.123]]]
		});
	});
});

describe("L.Polygon (multi) #toGeoJSON", function () {
	it("returns a 2D MultiPolygon object", function () {
		var multiPolygon = L.polygon([[[[1, 2], [3, 4], [5, 6]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]]
			]
		});
	});

	it("returns a 3D MultiPolygon object", function () {
		var multiPolygon = L.polygon([[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1, 3], [5, 4, 6], [8, 7, 9], [2, 1, 3]]]
			]
		});
	});

	it("returns a 2D MultiPolygon object with two polygons", function () {
		var multiPolygon = L.polygon([[[[1, 2], [3, 4], [5, 6]]], [[[7, 8], [9, 10], [11, 12]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]],
				[[[8, 7], [10, 9], [12, 11], [8, 7]]]
			]
		});
	});

	it("returns a 2D MultiPolygon object with polygon having a hole", function () {
		var multiPolygon = L.polygon([[[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]], [[8, 7], [10, 9], [12, 11], [8, 7]]]
			]
		});
	});

	it("should allow specific precisions", function () {
		var multiPolygon = L.polygon([[[[1.1234, 2.1234], [3.1234, 4.1234], [5.1234, 6.1234]]]]);
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
		var marker = L.marker([10, 20]),
		    polyline = L.polyline([[10, 20], [2, 5]]),
		    layerGroup = L.layerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(), polyline.toGeoJSON()]
		});
	});

	it("returns a 3D FeatureCollection object", function () {
		var marker = L.marker([10, 20, 30]),
		    polyline = L.polyline([[10, 20, 30], [2, 5, 10]]),
		    layerGroup = L.layerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(), polyline.toGeoJSON()]
		});
	});

	it("ensures that every member is a Feature", function () {
		var tileLayer = L.tileLayer(),
		    layerGroup = L.layerGroup([tileLayer]);

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
		var tileLayer = L.tileLayer(),
		    layerGroup = L.layerGroup([tileLayer]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: []
		});
	});

	it('should return only one FeatureCollection for nested LayerGroups', function () {
		var layerGroup = L.layerGroup([
			L.layerGroup([L.marker([-41.3330287, 173.2008273])]),
			L.marker([-41.273356, 173.287278])
		]);

		var geoJSON = layerGroup.toGeoJSON();

		expect(geoJSON.features.length).to.eql(2);
		expect(geoJSON.features[0].type).to.eql("Feature");
		expect(geoJSON.features[1].type).to.eql("Feature");
	});

	it("should allow specific precisions", function () {
		var marker = L.marker([10, 20]),
		    polyline = L.polyline([[10, 20], [2, 5]]),
		    layerGroup = L.layerGroup([marker, polyline]);
		expect(layerGroup.toGeoJSON(3)).to.eql({
			type: 'FeatureCollection',
			features: [marker.toGeoJSON(3), polyline.toGeoJSON(3)]
		});
	});
});

describe("L.GeoJSON functions", function () {
	describe("#geometryToLayer", function () {
		var point = {
			type: "Point",
			coordinates: [0, 0]
		};
		var multiPoint  = {
			type: "MultiPoint",
			coordinates: [
				[0, 0], [10, 10]
			]
		};
		var line =  {
			type: "LineString",
			coordinates: [
				[0, 0], [10, 10], [20, 20]
			]
		};
		var multiLine = {
			type: "MultiLineString",
			coordinates: [
				[[10, 10], [20, 20], [30, 30]],
				[[50, 50], [60, 60], [70, 70]]
			]
		};
		var polygon = {
			type: "Polygon",
			coordinates: [
				[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
			]
		};
		var multiPolygon = {
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
		var geometryCollection  = {
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

		var featureCollection  = {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [0, 0]
					}
				},
			]
		};

		function customPointToLayer(geojsonPoint, latLng) {
			return L.circle(latLng, {
				radius: geojsonPoint.properties.radius
			});
		}

		function customCoordstoLatLng(coords) {
			return L.latLng(coords[1] + 1, coords[0] + 1, coords[2] + 1);
		}

		[
			[point, L.Marker],
			[line, L.Polyline],
			[polygon, L.Polygon],
			[multiPoint, L.FeatureGroup],
			[multiLine, L.Polyline],
			[multiPolygon, L.Polygon],
			[geometryCollection, L.FeatureGroup],
			[featureCollection, L.FeatureGroup]
		].forEach(function (item) {
			var geometry = item[0], expectedType = item[1];

			it("creates a Layer from a GeoJSON feature (type='" + geometry.type + "')", function () {
				var layer = L.GeoJSON.geometryToLayer({
					type: "Feature",
					geometry: geometry
				});
				expect(layer).to.be.a(expectedType);
			});

			it("creates a Layer from a GeoJSON geometry (type='" + geometry.type + "')", function () {
				var layer = L.GeoJSON.geometryToLayer(geometry);
				expect(layer).to.be.a(expectedType);
			});
		});

		it("throws an error if feature is an invalid GeoJSON object", function () {
			expect(L.GeoJSON.geometryToLayer).withArgs({
				type: "Feature",
				geometry: {
					type: "invalid",
					coordinates: [0, 0]
				}
			}).to.throwError("Invalid GeoJSON object.");
		});

		it("returns nothing if feature does not have a geometry property", function () {
			var ret = L.GeoJSON.geometryToLayer({type: "Feature"});
			expect(ret).not.to.be.ok();
		});

		it("creates a Layer using pointToLayer option (Point)", function () {
			var layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: point,
				properties: {radius: 100}
			}, {
				pointToLayer: customPointToLayer
			});
			expect(layer).to.be.a(L.Circle);
			expect(layer.options.radius).to.be(100);
		});

		it("creates a Layer using pointToLayer option (MultiPoint)", function () {
			var layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: multiPoint,
				properties: {radius: 100}
			}, {
				pointToLayer: customPointToLayer
			});
			layer.eachLayer(function (lyr) {
				expect(lyr).to.be.a(L.Circle);
				expect(lyr.options.radius).to.be(100);
			});
		});

		it("creates a Layer using coordsToLatLng option (Point)", function () {
			var layer = L.GeoJSON.geometryToLayer({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [1, 2, 3]
				}
			}, {
				coordsToLatLng: customCoordstoLatLng
			});
			expect(layer.getLatLng()).to.eql({lat: 3, lng: 2, alt: 4});
		});

		it("creates a Layer using coordsToLatLng option (MultiPoint)", function () {
			var layer = L.GeoJSON.geometryToLayer({
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
			expect(layer.getLayers().map(function (lyr) {
				return lyr.getLatLng();
			})).to.eql([
				{lat: 3, lng: 2, alt: 4},
				{lat: 6, lng: 5, alt: 7}
			]);
		});
	});

	describe("#coordsToLatLng", function () {
		it("creates a LatLng object with given coordinates", function () {
			var latLng = L.GeoJSON.coordsToLatLng([1, 2]);
			var latLngWithAlt = L.GeoJSON.coordsToLatLng([3, 4, 5]);
			expect(latLng).to.be.a(L.LatLng);
			expect(latLngWithAlt).to.be.a(L.LatLng);
			expect(latLng).to.eql({lng: 1, lat: 2});
			expect(latLngWithAlt).to.eql({lng: 3, lat: 4, alt: 5});
		});
	});

	describe("#coordsToLatLngs", function () {

		function customCoordsToLatLng(coords) {
			return L.latLng(coords[1] + 1, coords[0] + 1, coords[2] + 1);
		}

		it("creates a multidimensional array of LatLngs", function () {
			var latLngs = L.GeoJSON.coordsToLatLngs([[1, 2], [3, 4], [5, 6]]);
			expect(latLngs).to.eql([{lng: 1, lat: 2}, {lng: 3, lat: 4}, {lng: 5, lat: 6}]);
			latLngs.forEach(function (latLng) {
				expect(latLng).to.be.a(L.LatLng);
			});
		});

		it("creates a multidimensional array of LatLngs (levelsDeep=1)", function () {
			var latLngs = L.GeoJSON.coordsToLatLngs([
				[[1, 2], [3, 4], [5, 6]],
				[[5, 6], [7, 8], [9, 10]]
			], 1);
			expect(latLngs).to.eql([
				[{lng: 1, lat: 2}, {lng: 3, lat: 4}, {lng: 5, lat: 6}],
				[{lng: 5, lat: 6}, {lng: 7, lat: 8}, {lng: 9, lat: 10}]
			]);
			latLngs.forEach(function (arr) {
				arr.forEach(function (latlng) {
					expect(latlng).to.be.a(L.LatLng);
				});
			});
		});

		it("creates a multidimensional array of LatLngs with custom coordsToLatLng", function () {
			var coords = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
			var latLngs = L.GeoJSON.coordsToLatLngs(coords, 0, customCoordsToLatLng);
			expect(latLngs).to.eql([
				{lat: 3, lng: 2, alt: 4},
				{lat: 6, lng: 5, alt: 7},
				{lat: 9, lng: 8, alt: 10}
			]);
		});

		it("creates a multidimensional array of LatLngs with custom coordsToLatLng (levelDeep=1)", function () {
			var coords = [
				[[1, 2, 3], [4, 5, 6]],
				[[12, 13, 14], [15, 16, 17]]
			];
			var latLngs = L.GeoJSON.coordsToLatLngs(coords, 1, customCoordsToLatLng);
			expect(latLngs).to.eql([
				[
					{lat: 3, lng: 2, alt: 4},
					{lat: 6, lng: 5, alt: 7}
				],
				[
					{lat: 14, lng: 13, alt: 15},
					{lat: 17, lng: 16, alt: 18}
				]
			]);
		});
	});

	describe("#latLngToCoords", function () {
		it("accepts latlng array", function () {
			var coords = L.GeoJSON.latLngToCoords([2, 1, 3]);
			expect(coords).to.eql([1, 2, 3]);
		});

		it("returns an array of coordinates and altitude", function () {
			var coords = L.GeoJSON.latLngToCoords(L.latLng(2, 1));
			var coordsWithAlt = L.GeoJSON.latLngToCoords(L.latLng(2, 1, 3));
			expect(coords).to.eql([1, 2]);
			expect(coordsWithAlt).to.eql([1, 2, 3]);
		});

		it("returns an array of coordinates with given precision", function () {
			var coords = L.GeoJSON.latLngToCoords(L.latLng(
				2.123456, 1.123456
			), 3);
			var coordsWithAlt = L.GeoJSON.latLngToCoords(L.latLng(
				2.123456, 1.123456, 3.123456
			), 3);
			expect(coords).to.eql([1.123, 2.123]);
			expect(coordsWithAlt).to.eql([1.123, 2.123, 3.123]);
		});
	});

	describe("#latLngsToCoords", function () {
		it("accepts multidimensional latlng array", function () {
			var coords = L.GeoJSON.latLngsToCoords([[2, 1, 3], [5, 4, 6]]);
			expect(coords).to.eql([[1, 2, 3], [4, 5, 6]]);
		});

		it("returns a multidimensional array of coordinates", function () {
			var coords = L.GeoJSON.latLngsToCoords([L.latLng(2, 1), L.latLng(4, 3)]);
			var coordWithAlt = L.GeoJSON.latLngsToCoords([L.latLng(2, 1, 3), L.latLng(5, 4, 6)]);
			expect(coords).to.eql([[1, 2], [3, 4]]);
			expect(coordWithAlt).to.eql([[1, 2, 3], [4, 5, 6]]);
		});

		it("returns a multidimensional array of coordinates (levelDeep=1)", function () {
			var latLngs = [
				[L.latLng(2, 1), L.latLng(4, 3)],
				[L.latLng(6, 5), L.latLng(8, 7)]
			];
			var coords = L.GeoJSON.latLngsToCoords(latLngs, 1);
			expect(coords).to.eql([
				[[1, 2], [3, 4]],
				[[5, 6], [7, 8]]
			]);
		});

		it("returns a multidimensional array of coordinates (closed=True)", function () {
			var latLngs = [L.latLng(2, 1), L.latLng(4, 3), L.latLng(6, 5)];
			var coords = L.GeoJSON.latLngsToCoords(latLngs, 0, true);
			expect(coords).to.eql([[1, 2], [3, 4], [5, 6], [1, 2]]);
		});

		it("returns a multidimensional array of coordinates (levelsDeep=1, closed=True)", function () {
			var latLngs = [
				[L.latLng(2, 1), L.latLng(4, 3), L.latLng(6, 5)],
				[L.latLng(8, 7), L.latLng(10, 9), L.latLng(12, 11)]
			];
			var coords = L.GeoJSON.latLngsToCoords(latLngs, 1, true);
			expect(coords).to.eql([
				[[1, 2], [3, 4], [5, 6], [1, 2]],
				[[7, 8], [9, 10], [11, 12], [7, 8]]
			]);
		});

		it("returns a multidimensional array of coordinates with given precision", function () {
			var latLngs = [L.latLng(2.123456, 1.123456), L.latLng(4.123456, 3.123456)];
			var coords = L.GeoJSON.latLngsToCoords(latLngs, 0, false, 3);
			expect(coords).to.eql([[1.123, 2.123], [3.123, 4.123]]);
		});

		it('returns a valid geojson from an unbalanced multipolygon', function () {
			var poly = L.polygon([
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
	});

	describe("#asFeature", function () {
		var geometry1 = {
			type: "Point",
			coordinates: [0, 0]
		};

		var geometry2 = {
			type: "Point",
			coordinates: [1, 1]
		};

		var feature1 = {
			type: "Feature",
			geometry: geometry1,
			properties: {a: 1}
		};

		var feature2 = {
			type: "Feature",
			geometry: geometry2,
			properties: {b: 2}
		};

		var featureCollection = {
			type: "FeatureCollection",
			features: [
				feature1,
				feature2
			]
		};

		it("given a bare geometry returns a GeoJSON-like feature", function () {
			var ret = L.GeoJSON.asFeature(geometry1);
			expect(ret).to.eql({
				type: "Feature",
				properties: {},
				geometry: geometry1
			});
		});

		it("given a GeoJSON feature directly returns it", function () {
			var ret = L.GeoJSON.asFeature(feature1);
			expect(ret).to.eql(feature1);
		});

		it("given a GeoJSON feature collection directly returns it", function () {
			var ret = L.GeoJSON.asFeature(featureCollection);
			expect(ret).to.eql(featureCollection);
		});
	});
});
