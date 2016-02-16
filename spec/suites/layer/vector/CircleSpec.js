describe('Circle', function () {

	describe('#init', function () {

		it('uses default radius if not given', function () {
			var circle = L.circle([0, 0]);
			expect(circle.getRadius()).to.eql(10);
		});

		it('throws error if radius is NaN', function () {
			expect(function () {
				L.circle([0, 0], NaN);
			}).to.throwException('Circle radius cannot be NaN');
		});

	});

	describe('#getBounds', function () {

		var map, circle;

		beforeEach(function () {
			map = L.map(document.createElement('div')).setView([0, 0], 4);
			circle = L.circle([50, 30], {radius: 200}).addTo(map);
		});

		it('returns bounds', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng(new L.LatLng(49.94347, 29.91211));
			expect(bounds.getNorthEast()).nearLatLng(new L.LatLng(50.05646, 30.08789));
		});
	});

	describe('Legacy factory', function () {

		var map, circle;

		beforeEach(function () {
			map = L.map(document.createElement('div')).setView([0, 0], 4);
			circle = L.circle([50, 30], 200).addTo(map);
		});

		it('returns same bounds as 1.0 factory', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng(new L.LatLng(49.94347, 29.91211));
			expect(bounds.getNorthEast()).nearLatLng(new L.LatLng(50.05646, 30.08789));
		});
	});

});
