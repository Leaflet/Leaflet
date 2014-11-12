describe('ImageOverlay', function () {
	describe('#setStyle', function () {
		it('sets opacity', function () {
			var overlay = L.imageOverlay().setStyle({opacity: 0.5});
			expect(overlay.options.opacity).to.equal(0.5);
		});
	});
});
