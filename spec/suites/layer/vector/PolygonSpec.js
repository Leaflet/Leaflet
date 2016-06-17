describe('Polygon', function () {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#initialize", function () {
		it("should never be flat", function () {
			var latLngs = [[1, 2], [3, 4]];

			var polygon = new L.Polygon(latLngs);

			expect(L.Polyline._flat(polygon._latlngs)).to.be(false);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

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
			expect(polygon._latlngs).to.eql([[]]);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

		it("can be initialized with holes", function () {
			var originalLatLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			var polygon = new L.Polygon(originalLatLngs);

			expect(polygon._latlngs).to.eql([
				[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])],
				[L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]
			]);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

		it("can be initialized with multi including hole", function () {
			var latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			var polygon = new L.Polygon(latLngs);

			expect(polygon._latlngs).to.eql([
				[[L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]],
				[[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])], [L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]]
			]);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

		it("can be added to the map when empty", function () {
			var polygon = new L.Polygon([]).addTo(map);
			expect(map.hasLayer(polygon)).to.be(true);
		});

	});

	describe("#isEmpty", function () {

		it('should return true for a polygon with no latlngs', function () {
			var layer = new L.Polygon([]);
			expect(layer.isEmpty()).to.be(true);
		});

		it('should return false for simple polygon', function () {
			var latLngs = [[1, 2], [3, 4], [5, 6]];
			var layer = new L.Polygon(latLngs);
			expect(layer.isEmpty()).to.be(false);
		});

		it('should return false for a multi-polygon', function () {
			var latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];
			var layer = new L.Polygon(latLngs);
			expect(layer.isEmpty()).to.be(false);
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

		it("can be set external ring and holes", function () {
			var latLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			var polygon = new L.Polygon([]);
			polygon.setLatLngs(latLngs);

			expect(polygon.getLatLngs()).to.eql([
				[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])],
				[L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]
			]);
		});

		it("can be set multi including hole", function () {
			var latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			var polygon = new L.Polygon([]);
			polygon.setLatLngs(latLngs);

			expect(polygon.getLatLngs()).to.eql([
				[[L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]],
				[[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])], [L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]]
			]);
		});

	});

	describe('#getCenter', function () {

		it('should compute center of a big simple polygon around equator', function () {
			var latlngs = [
				[[0, 0], [10, 0], [10, 10], [0, 10]]
			];
			var layer = new L.Polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng(L.latLng([5, 5]), 1e-1);
		});

		it('should compute center of a small simple polygon', function () {
			var latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			var layer = new L.Polygon(latlngs).addTo(map);
			map.setZoom(0);  // Make the polygon disappear in screen.
			expect(layer.getCenter()).to.be.nearLatLng(L.latLng([0, 0]));
		});

	});

	describe("#_defaultShape", function () {

		it("should return latlngs on a simple polygon", function () {
			var latlngs = [
				L.latLng([1, 2]),
				L.latLng([3, 4])
			];

			var polygon = new L.Polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs);
		});

		it("should return first latlngs on a polygon with hole", function () {
			var latlngs = [
				[L.latLng([0, 12]), L.latLng([13, 14]), L.latLng([15, 16])],
				[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]
			];

			var polygon = new L.Polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs[0]);
		});

		it("should return first latlngs on a multipolygon", function () {
			var latlngs = [
				[[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]],
				[[L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]]
			];

			var polygon = new L.Polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs[0][0]);
		});

		it("should return first latlngs on a multipolygon with hole", function () {
			var latlngs = [
				[[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])],
				 [L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]],
				[[L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]]
			];

			var polygon = new L.Polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs[0][0]);
		});

	});

	describe("#addLatLng", function () {
		it("should add latlng to latlngs", function () {
			var latLngs = [
				[1, 2],
				[3, 4]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([5, 6]);

			expect(polygon._latlngs).to.eql([[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]]);
		});

		it("should add latlng to first latlngs on a polygon with hole", function () {
			var latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([17, 0]);

			expect(polygon._latlngs[0]).to.eql([L.latLng([0, 12]), L.latLng([13, 14]), L.latLng([15, 16]), L.latLng([17, 0])]);
			expect(polygon._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
		});

		it("should add latlng by reference on a polygon with hole", function () {
			var latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([7, 8], polygon._latlngs[1]);

			expect(polygon._latlngs[0]).to.eql([L.latLng([0, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
			expect(polygon._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6]), L.latLng([7, 8])]);
		});

		it("should add latlng to first latlngs on a multi", function () {
			var latLngs = [
				[[[1, 2], [3, 4]]],
				[[[11, 12], [13, 14], [15, 16]]]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([5, 6]);

			expect(polygon._latlngs[0]).to.eql([[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]]);
			expect(polygon._latlngs[1]).to.eql([[L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]]);
		});

		it("should add latlng to latlngs by reference on a multi", function () {
			var latLngs = [
				[[[11, 12], [13, 14], [15, 16]]],
				[[[1, 2], [3, 4]]]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([5, 6], polygon._latlngs[1][0]);

			expect(polygon._latlngs[1]).to.eql([[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]]);
			expect(polygon._latlngs[0]).to.eql([[L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]]);
		});

		it("should add latlng on first latlngs by default on a multipolygon with hole", function () {
			var latLngs = [
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]],
				[[[10, 20], [30, 40], [50, 60]]]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([-10, -10]);

			expect(polygon._latlngs[0][0]).to.eql([L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0]), L.latLng([-10, -10])]);
			expect(polygon._latlngs[0][1]).to.eql([L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]);
			expect(polygon._latlngs[1][0]).to.eql([L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]);
		});

		it("should add latlng by reference on a multipolygon with hole", function () {
			var latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];

			var polygon = new L.Polygon(latLngs);

			polygon.addLatLng([2, 2], polygon._latlngs[1][1]);

			expect(polygon._latlngs[0][0]).to.eql([L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]);
			expect(polygon._latlngs[1][0]).to.eql([L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])]);
			expect(polygon._latlngs[1][1]).to.eql([L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4]), L.latLng([2, 2])]);
		});

	});

	describe('#contains', function () {

		var latlngs = [
			[[3, 1], [1, 3], [1, 7], [3, 5], [5, 7], [7, 5], [7, 3], [5, 1]],
			[[4, 3], [3, 4], [5, 4]]
		];

		var polygon = new L.Polygon(latlngs).addTo(map);

		it("checks for the polygon outer ring nodes", function () {
			// Westward and northward horizontal boundaries included
			expect(polygon.contains(new L.LatLng(3, 1))).to.be.ok();
			expect(polygon.contains(new L.LatLng(5, 1))).to.be.ok();
			expect(polygon.contains(new L.LatLng(7, 3))).to.be.ok();
			// Estward and southward horizontal boundaries excluded
			expect(polygon.contains(new L.LatLng(1, 3))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(1, 7))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(3, 5))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(5, 7))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(7, 5))).to.not.be.ok();
		});

		it("checks for latlngs outside the bounding box", function () {
			expect(polygon.contains(new L.LatLng(3, 8))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(0, 4))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(4, 0))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(8, 3))).to.not.be.ok();
		});

		it("checks for latlngs in the bounding box but not in the polygon", function () {
			expect(polygon.contains(new L.LatLng(3, 6))).to.not.be.ok();
			expect(polygon.contains(new L.LatLng(6.5, 6.5))).to.not.be.ok();
		});

		it("checks for latlngs in the polygon", function () {
			expect(polygon.contains(new L.LatLng(3, 2))).to.be.ok();
			expect(polygon.contains(new L.LatLng(6, 4))).to.be.ok();
			expect(polygon.contains(new L.LatLng(2, 4))).to.be.ok();
			expect(polygon.contains(new L.LatLng(5, 6))).to.be.ok();
		});

		it("checks for latlngs in the polygon hole", function () {
			expect(polygon.contains(new L.LatLng(4, 3.5))).to.not.be.ok();
			// Hole nodes not included in the hole
			expect(polygon.contains(new L.LatLng(3, 4))).to.be.ok();
			expect(polygon.contains(new L.LatLng(5, 4))).to.be.ok();
			// Hole node contained in the hole
			expect(polygon.contains(new L.LatLng(4, 3))).to.not.be.ok();
		});

		var multi = new L.Polygon([
			[
				[[1, 2], [1, 4], [3, 4], [3, 2]]
			],
			[
				[[6, 5], [3, 5], [3, 9], [6, 9]],
				[[5, 6], [4, 6], [4, 8], [5, 8]]
			]
		]).addTo(map);

		it("checks for nodes in one of the polygons outer ring", function () {
			expect(multi.contains(new L.LatLng(3, 2))).to.be.ok();
			expect(multi.contains(new L.LatLng(6, 5))).to.be.ok();
			// Excluded boundaries
			expect(multi.contains(new L.LatLng(1, 2))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(1, 4))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(3, 4))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(3, 5))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(3, 9))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(6, 9))).to.not.be.ok();
		});

		it("checks for latlngs outside the bounding box", function () {
			expect(multi.contains(new L.LatLng(2, 1))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(0, 4))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(10, 0))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(8, 3))).to.not.be.ok();
		});

		it("checks for latlngs in the bounding box but not in one of the polygons", function () {
			expect(multi.contains(new L.LatLng(4, 3))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(2, 5))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(3, 8))).to.not.be.ok();
			expect(multi.contains(new L.LatLng(3, 4.5))).to.not.be.ok();
		});

		it("checks for latlngs in one of the polygons", function () {
			expect(multi.contains(new L.LatLng(2, 3))).to.be.ok();
			expect(multi.contains(new L.LatLng(4.5, 5.5))).to.be.ok();
			expect(multi.contains(new L.LatLng(3.5, 7))).to.be.ok();
			expect(multi.contains(new L.LatLng(4.5, 8.5))).to.be.ok();
		});

		it("checks for latlngs in the second polygon hole", function () {
			expect(multi.contains(new L.LatLng(4.5, 7))).to.not.be.ok();
			// Hole nodes not included in the hole
			expect(multi.contains(new L.LatLng(4, 6))).to.be.ok();
			expect(multi.contains(new L.LatLng(4, 8))).to.be.ok();
			expect(multi.contains(new L.LatLng(5, 8))).to.be.ok();
			// Hole node contained in the hole
			expect(multi.contains(new L.LatLng(5, 6))).to.not.be.ok();
		});

	});

});
