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
