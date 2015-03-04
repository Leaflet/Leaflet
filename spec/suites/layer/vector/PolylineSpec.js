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

			var removed = polyline.spliceLatLngs(1, 1, [7, 8]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2]), L.latLng([7, 8]), L.latLng([5, 6])]);
			expect(removed).to.eql([L.latLng([3, 4])]);
		});

		it("splices first latLngs of a multi by default", function () {
			var latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			var polyline = new L.Polyline(latLngs);

			polyline.spliceLatLngs(1, 1, [7, 8]);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([7, 8]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
		});

		it("splices latLngs of a multi by reference", function () {
			var latLngs = [
				[[11, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			var polyline = new L.Polyline(latLngs);

			polyline.spliceLatLngs(1, 1, [7, 8], polyline._latlngs[1]);

			expect(polyline._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([7, 8]), L.latLng([5, 6])]);
		});

	});

	describe("#addLatLng", function () {
		it("should add latlng to latlngs", function () {
			var latLngs = [
				[1, 2],
				[3, 4]
			];

			var polyline = new L.Polyline(latLngs);

			polyline.addLatLng([5, 6]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
		});

		it("should add latlng to first latlngs on a multi", function () {
			var latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];

			var polyline = new L.Polyline(latLngs);

			polyline.addLatLng([5, 6]);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14])]);
		});

		it("should add latlng to latlngs by reference", function () {
			var latLngs = [
				[[11, 12], [13, 14]],
				[[1, 2], [3, 4]]
			];

			var polyline = new L.Polyline(latLngs);

			polyline.addLatLng([5, 6], polyline._latlngs[1]);

			expect(polyline._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[0]).to.eql([L.latLng([11, 12]), L.latLng([13, 14])]);
		});

		it("should add latlng on empty polyline", function () {
			var polyline = new L.Polyline([]);

			polyline.addLatLng([1, 2]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2])]);
		});

	});
});
