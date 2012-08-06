describe('GeoJSON', function() {

	var geojsonSample = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"id": 500,
				"geometry": {
					"type": "Point",
					"coordinates": [102.0, 0.5]
				},
				"properties": {
					"prop0": "value0",
					"color": "blue"
				}
			},

			{
				"type": "Feature",
				"id": 800,
				"geometry": {
					"type": "LineString",
					"coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
				},
				"properties": {
					"color": "red",
					"prop1": 0.0
				}
			},

			{
				"type": "Feature",
				"id": 801,
				"geometry": {
					"type": "Polygon",
					"coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]
				},
				"properties": {
					"color": "green",
					"prop1": {
						"this": "that"
					}
				}
			},

			{
				"type": "Feature",
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [[[[100.0, 1.5], [100.5, 1.5], [100.5, 2.0], [100.0, 2.0], [100.0, 1.5]]], [[[100.5, 2.0], [100.5, 2.5], [101.0, 2.5], [101.0, 2.0], [100.5, 2.0]]]]
				},
				"properties": {
					"color": "purple"
				}
			}
		]
	};

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c, {
		center: new L.LatLng(0.78, 102.37)
	});
	
	var ids = [500, 800, 801];
	var i = 0, id;

	describe('constructor', function() {
		it('should extend the geoJSON layers with the FeautureLayer mixin', function() {
				var jgLayer = new L.GeoJSON(geojsonSample,{
					onEachFeature: function( feat, layer) {
						expect(layer.getId).toBeDefined();
						expect(layer.getProperties).toBeDefined();
					}
				});
				expect(jgLayer.getLayerById).toBeDefined();
				jgLayer.eachLayer( function(layer) {
						expect(layer.getId).toBeDefined();
						expect(layer.getProperties).toBeDefined();
				});
		});

		// layer without id preservation (default)
		it('should preserve ids when option preserveId is set (default off)', function() {
			var jgLayer = new L.GeoJSON(geojsonSample,{
				onEachFeature: function( feat, layer) {
					expect(L.Util.stamp(layer)).toBe(layer.getId());
					expect(layer.getId()).not.toEqual(800); // auto generated
				}
			});
			i = 0;
			// layer with id preservation
			var jgLayer = new L.GeoJSON(geojsonSample,{
				onEachFeature: function( feat, layer) {
					id = ids[i++];
					if ( id != null)
						expect(layer.getId()).toEqual(id); // manually set ids
					else
						expect(layer.getId()).not.toEqual(800); // auto generated
				},
				preserveId: true
			});
		});

		it('should store properties when option storeProps is set (default off)', function() {
			// layer with props storage
			var jgLayer = new L.GeoJSON(geojsonSample,{
				onEachFeature: function( feat, layer) {
					expect(layer.getProperties()).toBe(null); // no props
				}
			});

			var jgLayer = new L.GeoJSON(geojsonSample,{
				onEachFeature: function( feat, layer) {
					expect(layer.getProperties()).not.toBe(null); // no props
				},
				storeProps: true
			});
		});

		it('should be able to store properties modification without side effects', function() {

			var jgLayer2 = new L.GeoJSON(geojsonSample,{
				preserveId: true,
				storeProps: true
			});

			var jgLayer3 = new L.GeoJSON(geojsonSample,{
				preserveId: true,
				storeProps: true
			});

			var l2 = jgLayer2.getLayerById(545433);

			expect(l2).toBe(null);

			var l2 = jgLayer2.getLayerById(500);
			var l3 = jgLayer3.getLayerById(500);

			expect(l2).not.toEqual(null);

			expect(l2.getProperties()).not.toEqual(null);

			expect(l2.getProperties().prop0).toBe("value0");

			l2.getProperties().prop0 = 'xvalue';

			expect(l2.getProperties().prop0).toBe("xvalue");

			expect(l3.getProperties().prop0).toBe("value0");
		});

	});

});
	
