describe('Circle', function () {
	describe('#getBounds', function () {

		var circle, map;

		beforeEach(function () {
			map = L.map(document.createElement('div'));
			map.setView([80, 30], 3);

			circle = L.circle([80, 30], 500000).addTo(map);
		});

		it('returns bounds', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest().equals([74.35482803013984, 4.21875])).toBeTruthy();
			expect(bounds.getNorthEast().equals([83.61859796759485, 55.8984375])).toBeTruthy();
		});
	});
});
