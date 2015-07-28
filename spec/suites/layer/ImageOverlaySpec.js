describe('ImageOverlay', function () {
	describe('#setStyle', function () {
		it('sets opacity', function () {
			var overlay = L.imageOverlay().setStyle({opacity: 0.5});
			expect(overlay.options.opacity).to.equal(0.5);
		});
	});
	describe('#setBounds', function () {
		it('sets bounds', function () {
			var bounds = new L.LatLngBounds(
				new L.LatLng(14, 12),
				new L.LatLng(30, 40));
			var overlay = L.imageOverlay().setBounds(bounds);
			expect(overlay._bounds).to.equal(bounds);
		});
	});
});
