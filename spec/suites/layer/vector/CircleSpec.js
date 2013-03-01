describe('Circle', function () {
	describe('#getBounds', function () {

		var circle;

		beforeEach(function () {
			circle = L.circle([50, 30], 200);
		});

		it('returns bounds', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest().equals([49.998203369, 29.997204939])).to.be.ok();
			expect(bounds.getNorthEast().equals([50.001796631, 30.002795061])).to.be.ok();
		});
	});
});
