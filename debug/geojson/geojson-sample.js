var geojsonSample = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
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
