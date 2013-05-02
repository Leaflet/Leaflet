describe('Polygon', function() {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#initialize", function() {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polygon = new L.Polygon(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(polygon._latlngs).to.not.eql(sourceLatLngs);
		});

		it("can be called with an empty array", function () {
			var polygon = new L.Polygon([]);
			expect(polygon.getLatLngs()).to.eql([]);
		});
	});

	describe("#setLatLngs", function () {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polygon = new L.Polygon(sourceLatLngs);

			polygon.setLatLngs(sourceLatLngs);

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

			var polygon = new L.Polygon(latLngs);

			polygon.spliceLatLngs(1, 1, [7, 8]);

			expect(polygon._latlngs).to.eql([L.latLng([1, 2]), L.latLng([7, 8]), L.latLng([5, 6])]);
		});
	});
});
