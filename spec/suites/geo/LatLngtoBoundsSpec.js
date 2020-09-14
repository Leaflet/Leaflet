describe('LatLngtoBounds', function () {

	describe('#toBounds prototype', function () {
		var a = new L.LatLng(15.5, 10);
		expect(a.toBounds(100, 100)).to.eql({
			_southWest: {lat: 15.499550842361463, lng: 9.999533890157746},
			_northEast: {lat: 15.500449157638537, lng: 10.000466109842254}
		});
	});
});
