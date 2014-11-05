describe('Path', function () {
	describe('#bringToBack', function () {
		it('is a no-op for layers not on a map', function () {
			var path = new L.Path();
			expect(path.bringToBack()).to.equal(path);
		});
	});

	describe('#bringToFront', function () {
		it('is a no-op for layers not on a map', function () {
			var path = new L.Path();
			expect(path.bringToFront()).to.equal(path);
		});
	});
});
