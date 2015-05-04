describe("L.GeoJSON", function () {
	describe("addData", function () {
		var geoJSON = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Point',
				coordinates: [20, 10, 5]
			}
		};

		it("sets feature property on member layers", function () {
			var layer = new L.GeoJSON();
			layer.addData(geoJSON);
			expect(layer.getLayers()[0].feature).to.eql(geoJSON);
		});

		it("normalizes a geometry to a Feature", function () {
			var layer = new L.GeoJSON();
			layer.addData(geoJSON.geometry);
			expect(layer.getLayers()[0].feature).to.eql(geoJSON);
		});
	});

	describe("constructor", function () {
		it("throws an error on an invalid point", function() {
			expect(function () {
				var layer = new L.GeoJSON({
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Point',
						coordinates: [20]
					}});
			}).to.throwException(function (e) {
				expect(e.message).to.eql("Invalid GeoJSON Point.");
			});
		});

		it("throws an error on an invalid multipoint", function() {
			expect(function () {
				var layer = new L.GeoJSON({
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'MultiPoint',
						coordinates: [[20, 10], [10, 20], [NaN, NaN]]
					}});
			}).to.throwException(function (e) {
				expect(e.message).to.eql("Invalid GeoJSON Multipoint.");
			});
		});

		it("throws an error on an invalid linestring", function() {
			expect(function () {
				var layer = new L.GeoJSON({
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: [[20, 10], [10, 20], [NaN, NaN]]
					}});
			}).to.throwException(function (e) {
				expect(e.message).to.eql("Invalid GeoJSON LineString/MultiLineString.");
			});
		});

		it("throws an error on an invalid multilinestring", function() {
			expect(function () {
				var layer = new L.GeoJSON({
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'MultiLineString',
						coordinates: [[[20, 10], [10, 20]], [[NaN]]]
					}});
			}).to.throwException(function (e) {
				expect(e.message).to.eql("Invalid GeoJSON LineString/MultiLineString.");
			});
		});
	});

	it("throws an error on an invalid polygon", function() {
		expect(function () {
			var layer = new L.GeoJSON({
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Polygon',
					coordinates: [[[]]]
				}});
		}).to.throwException(function (e) {
			expect(e.message).to.eql("Invalid GeoJSON Polygon/MultiPolygon.");
		});
	});

	it("throws an error on an invalid feature collection", function() {
		expect(function () {
			var layer = new L.GeoJSON({
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: [[20, 10, 5], [20, 30, 5], [10, 30, 5]]
					}
				}, {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Point',
						coordinates: [NaN, NaN]
					}
				}]
			});
		}).to.throwException(function (e) {
			expect(e.message).to.eql("Invalid GeoJSON Point.");
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

		expect(L.geoJson(json).toGeoJSON()).to.eql(json);
	});

	it('roundtrips MiltiPoint features', function () {
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

		expect(L.geoJson(json).toGeoJSON()).to.eql(json);
	});

	it("omits layers which do not implement toGeoJSON", function () {
		var tileLayer = new L.TileLayer(),
		    layerGroup = new L.LayerGroup([tileLayer]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: []
		});
	});
});
