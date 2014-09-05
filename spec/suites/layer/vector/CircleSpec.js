describe('Circle', function () {
	describe('#getBounds', function () {

		var map, circle;

		beforeEach(function () {
			map = L.map(document.createElement('div')).setView([0, 0], 4);
			circle = L.circle([50, 30], 200).addTo(map);
		});

		it('returns bounds', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng(new L.LatLng(49.94347, 29.91211));
			expect(bounds.getNorthEast()).nearLatLng(new L.LatLng(50.05646, 30.08789));
		});

		it('Adds radius and pointType properties when converted with geoJSONProperties option.', function() {
			var geojson;

			L.Circle.include({
				geoJSONProperties: function() {
					return {
						pointType: 'circle',
						radius: this.getRadius()
					};
				}
			});

			circle = L.circle([50, 30], 200).addTo(map);
			geojson = circle.toGeoJSON();

			expect(geojson.properties.pointType).to.equal('circle');
			expect(geojson.properties.radius).to.equal(circle.getRadius());
		});
	});
});
