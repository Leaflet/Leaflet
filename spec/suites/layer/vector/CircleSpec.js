describe('Circle', function () {
	var map, circle;

	beforeEach(function () {
		map = L.map(document.createElement('div')).setView([0, 0], 4);
		circle = L.circle([50, 30], {radius: 200}).addTo(map);
	});

	afterEach(function () {
		map.remove();
	});

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
		it('returns bounds', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng([49.99820, 29.99720]);
			expect(bounds.getNorthEast()).nearLatLng([50.00179, 30.00279]);
		});
	});

	describe('Legacy factory', function () {
		it('returns same bounds as 1.0 factory', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng([49.99820, 29.99720]);
			expect(bounds.getNorthEast()).nearLatLng([50.00179, 30.00279]);
		});
	});

	describe("#setRadius", function () {
		it("fires a move event", function () {
			var circle = new L.Circle([0, 0]);
			map.addLayer(circle);

			var beforeRadius = circle._mRadius;
			var afterRadius = 30;

			var moveEvent = sinon.spy();
			circle.on('move', moveEvent);

			circle.setRadius(afterRadius);

			expect(moveEvent.callCount).to.not.be(0);
			expect(moveEvent.args[0][0].oldRadius).to.be(beforeRadius);
			expect(moveEvent.args[0][0].radius).to.be(afterRadius);
			expect(moveEvent.args[0][0].latlng).to.be(circle.getLatLng());
			expect(circle.getRadius()).to.be(afterRadius);
		});
	});
});
