describe('Polyline', function () {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#initialize", function () {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polyline = new L.Polyline(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(polyline._latlngs).to.not.eql(sourceLatLngs);
		});
	});

	describe("#setLatLngs", function () {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polyline = new L.Polyline(sourceLatLngs);

			polyline.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});
	});

	describe("#spliceLatLngs", function () {
		it("splices the internal latLngs", function () {
			var latLngs = [
				[1, 2],
				[3, 4],
				[5, 6]
			];

			var polyline = new L.Polyline(latLngs);

			polyline.spliceLatLngs(1, 1, [7, 8]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2]), L.latLng([7, 8]), L.latLng([5, 6])]);
		});
	});

	describe('#getCenter', function () {

		it('should compute center of a big flat line on equator', function () {
			var polyline = new L.Polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyline.getCenter()).to.eql(L.latLng([0, 45]));
		});

		it('should compute center of a big flat line close to the pole', function () {
			var polyline = new L.Polyline([[80, 0], [80, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng(L.latLng([80, 45]), 1e-2);
		});

		it('should compute center of a big diagonal line', function () {
			var polyline = new L.Polyline([[0, 0], [80, 80]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng(L.latLng([57, 40]), 1);
		});

		it('should compute center of a diagonal line close to the pole', function () {
			var polyline = new L.Polyline([[70, 70], [84, 84]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng(L.latLng([79, 77]), 1);
		});

		it('should compute center of a big multiline', function () {
			var polyline = new L.Polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng(L.latLng([0, 5]), 1);
		});

		it('should compute center of a small flat line', function () {
			var polyline = new L.Polyline([[0, 0], [0, 0.090]]).addTo(map);
			map.setZoom(0);  // Make the line disappear in screen;
			expect(polyline.getCenter()).to.be.nearLatLng(L.latLng([0, 0]), 1e-2);
		});

	});

});
