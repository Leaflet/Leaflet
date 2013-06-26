describe("L.GeoJSON", function () {
	describe("addData", function () {
		var geoJSON = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Point',
				coordinates: [20, 10]
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
});

describe("L.Marker#toGeoJSON", function () {
	it("returns a Point object", function () {
		var marker = new L.Marker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});
});

describe("L.Circle#toGeoJSON", function () {
	it("returns a Point object", function () {
		var circle = new L.Circle([10, 20], 100);
		expect(circle.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});
});

describe("L.CircleMarker#toGeoJSON", function () {
	it("returns a Point object", function () {
		var marker = new L.CircleMarker([10, 20]);
		expect(marker.toGeoJSON().geometry).to.eql({
			type: 'Point',
			coordinates: [20, 10]
		});
	});
});

describe("L.Polyline#toGeoJSON", function () {
	it("returns a LineString object", function () {
		var polyline = new L.Polyline([[10, 20], [2, 5]]);
		expect(polyline.toGeoJSON().geometry).to.eql({
			type: 'LineString',
			coordinates: [[20, 10], [5, 2]]
		});
	});
});

describe("L.MultiPolyline#toGeoJSON", function () {
	it("returns a MultiLineString object", function () {
		var multiPolyline = new L.MultiPolyline([[[10, 20], [2, 5]], [[1, 2], [3, 4]]]);
		expect(multiPolyline.toGeoJSON().geometry).to.eql({
			type: 'MultiLineString',
			coordinates: [
				[[20, 10], [5, 2]],
				[[2, 1], [4, 3]]
			]
		});
	});
});

describe("L.Polygon#toGeoJSON", function () {
	it("returns a Polygon object (no holes)", function () {
		var polygon = new L.Polygon([[1, 2], [3, 4], [5, 6]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [[[2, 1], [4, 3], [6, 5], [2, 1]]]
		});
	});

	it("returns a Polygon object (with holes)", function () {
		var polygon = new L.Polygon([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]]);
		expect(polygon.toGeoJSON().geometry).to.eql({
			type: 'Polygon',
			coordinates: [
				[[2, 1], [4, 3], [6, 5], [2, 1]],
				[[8, 7], [10, 9], [12, 11], [8, 7]]
			]
		});
	});
});

describe("L.MultiPolygon#toGeoJSON", function () {
	it("returns a MultiPolygon object", function () {
		var multiPolygon = new L.MultiPolygon([[[1, 2], [3, 4], [5, 6]]]);
		expect(multiPolygon.toGeoJSON().geometry).to.eql({
			type: 'MultiPolygon',
			coordinates: [
				[[[2, 1], [4, 3], [6, 5], [2, 1]]]
			]
		});
	});
});

describe("L.LayerGroup#toGeoJSON", function () {
	it("returns a FeatureCollection object", function () {
		var marker = new L.Marker([10, 20]),
		    polyline = new L.Polyline([[10, 20], [2, 5]]),
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
			}
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

	it("omits layers which do not implement toGeoJSON", function () {
		var tileLayer = new L.TileLayer(),
		    layerGroup = new L.LayerGroup([tileLayer]);
		expect(layerGroup.toGeoJSON()).to.eql({
			type: 'FeatureCollection',
			features: []
		});
	});
});
