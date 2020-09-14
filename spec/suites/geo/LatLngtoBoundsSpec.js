describe('LatLngtoBounds', function () {

	describe('#toBounds prototype', function () {
		var a = new L.LatLng(15.5, 10);
		var bounds = a.toBounds(100, 100);
		expect(bounds._southWest.lat).to.equal(15.499550842361463);
		expect(bounds._southWest.lng).to.equal(9.999533890157746);
		expect(bounds._northEast.lat).to.equal(15.500449157638537);
		expect(bounds._northEast.lng).to.equal(10.000466109842254);
	});
});
