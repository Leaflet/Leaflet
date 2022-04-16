describe('Rectangle', function () {
	var map, container;

	beforeEach(function () {
		container = createContainer();
		map = L.map(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	describe("#initialize", function () {
		it("should never be flat", function () {
			var latLngs = [[1, 2], [3, 4]];

			var rectangle = L.rectangle(latLngs);

			expect(L.LineUtil.isFlat(rectangle._latlngs)).to.be(false);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});

		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var rectangle = L.rectangle(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(rectangle._latlngs).to.not.eql(sourceLatLngs);
		});

		it("cannot be called with an empty array", function () {
			// Throws error due to undefined lat
			expect(L.rectangle).withArgs([]).to.throwException();
		});

		it("can be initialized with holes", function () {
			var originalLatLngs = [
				[[0, 10]], // external ring
				[[20, 30]] // hole
			];

			var rectangle = L.rectangle(originalLatLngs);

			expect(rectangle._latlngs).to.eql([
				[L.latLng([0, 10]), L.latLng([20, 10]), L.latLng([20, 30]), L.latLng([0, 30])]
			]);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});

		it("cannot be initialized with more than 2 coords", function () {
			var originalLatLngs = [
				[0, 10], [20, 30],
				[2, 3], [4, 5] // extra coords
			];

			var rectangle = L.rectangle(originalLatLngs);

			expect(rectangle._latlngs).to.not.eql([
				[L.latLng([0, 10]), L.latLng([20, 10]), L.latLng([20, 30]), L.latLng([0, 30])]
			]);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});
	});

	describe("#setBounds", function () {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var rectangle = L.rectangle(sourceLatLngs);

			rectangle.setBounds(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it("changes original bounds to new bounds", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];

			var newLatLngs = [
				[5, 6],
				[7, 8]
			];

			var rectangle = L.rectangle(originalLatLngs);
			rectangle.setBounds(newLatLngs);

			expect(rectangle._latlngs).to.eql([
				[L.latLng([5, 6]), L.latLng([7, 6]), L.latLng([7, 8]), L.latLng([5, 8])]
			]);

			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});

		it("can be set with holes", function () {
			var originalLatLngs = [
				[[2, 3], [4, 5]]
			];

			var newLatLngs = [
				[[0, 10]], // external ring
				[[20, 30]] // hole
			];

			var rectangle = L.rectangle(originalLatLngs);
			rectangle.setBounds(newLatLngs);

			expect(rectangle._latlngs).to.eql([
				[L.latLng([0, 10]), L.latLng([20, 10]), L.latLng([20, 30]), L.latLng([0, 30])]
			]);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});

		it("cannot be set with more than 2 coords", function () {
			var originalLatLngs = [
				[[2, 3], [4, 5]]
			];

			var newLatLngs = [
				[0, 10], [20, 30],
				[6, 7], [8, 9] // extra coords
			];

			var rectangle = L.rectangle(originalLatLngs);
			rectangle.setBounds(newLatLngs);

			expect(rectangle._latlngs).to.not.eql([
				[L.latLng([0, 10]), L.latLng([20, 10]), L.latLng([20, 30]), L.latLng([0, 30])]
			]);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});
	});
});
