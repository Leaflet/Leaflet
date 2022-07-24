describe('Polygon', function () {
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

			var polygon = L.polygon(latLngs);

			expect(L.LineUtil.isFlat(polygon._latlngs)).to.be(false);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polygon = L.polygon(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(polygon._latlngs).to.not.eql(sourceLatLngs);
		});

		it("can be called with an empty array", function () {
			var polygon = L.polygon([]);
			expect(polygon._latlngs).to.eql([[]]);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

		it("can be initialized with holes", function () {
			var originalLatLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			var polygon = L.polygon(originalLatLngs);

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

			var polygon = L.polygon(latLngs);

			expect(polygon._latlngs).to.eql([
				[[L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]],
				[[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])], [L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]]
			]);
			expect(polygon.getLatLngs()).to.eql(polygon._latlngs);
		});

		it("can be added to the map when empty", function () {
			var polygon = L.polygon([]).addTo(map);
			var isAdded = map.hasLayer(polygon);
			expect(isAdded).to.be(true);
		});

	});

	describe("#isEmpty", function () {

		it('should return true for a polygon with no latlngs', function () {
			var layer = L.polygon([]);
			expect(layer.isEmpty()).to.be(true);
		});

		it('should return false for simple polygon', function () {
			var latLngs = [[1, 2], [3, 4], [5, 6]];
			var layer = L.polygon(latLngs);
			expect(layer.isEmpty()).to.be(false);
		});

		it('should return false for a multi-polygon', function () {
			var latLngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];
			var layer = L.polygon(latLngs);
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

			var polygon = L.polygon(sourceLatLngs);

			polygon.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it("can be set external ring and holes", function () {
			var latLngs = [
				[[0, 10], [10, 10], [10, 0]], // external ring
				[[2, 3], [2, 4], [3, 4]] // hole
			];

			var polygon = L.polygon([]);
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

			var polygon = L.polygon([]);
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
			var layer = L.polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([5.019148099025293, 5]);
		});

		it('should compute center of a small simple polygon', function () {
			var latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			var layer = L.polygon(latlngs).addTo(map);
			map.setZoom(0);  // Make the polygon disappear in screen.
			expect(layer.getCenter()).to.be.nearLatLng([0.005, 0.005]);
		});

		it('throws error if not yet added to map', function () {
			expect(function () {
				var latlngs = [
					[[0, 0], [10, 0], [10, 10], [0, 10]]
				];
				var layer = L.polygon(latlngs);
				layer.getCenter();
			}).to.throwException('Must add layer to map before using getCenter()');
		});

		it('should compute same center for low and high zoom', function () {
			var latlngs = [
				[[0, 0], [0.010, 0], [0.010, 0.010], [0, 0.010]]
			];
			var layer = L.polygon(latlngs).addTo(map);
			map.setZoom(0);
			var center = layer.getCenter();
			map.setZoom(18);
			expect(layer.getCenter()).to.be.nearLatLng(center);
		});

		it("should compute center for multi-polygon including hole", function () {
			var latlngs = [
				[[[10, 20], [30, 40], [50, 60]]],
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]]
			];
			var layer = L.polygon(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([31.436532296911807, 39.99999999999979]);
		});
	});

	describe("#_defaultShape", function () {
		it("should return latlngs on a simple polygon", function () {
			var latlngs = [
				L.latLng([1, 2]),
				L.latLng([3, 4])
			];

			var polygon = L.polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs);
		});

		it("should return first latlngs on a polygon with hole", function () {
			var latlngs = [
				[L.latLng([0, 12]), L.latLng([13, 14]), L.latLng([15, 16])],
				[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]
			];

			var polygon = L.polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs[0]);
		});

		it("should return first latlngs on a multipolygon", function () {
			var latlngs = [
				[[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]],
				[[L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]]
			];

			var polygon = L.polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs[0][0]);
		});

		it("should return first latlngs on a multipolygon with hole", function () {
			var latlngs = [
				[[L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])],
				 [L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4])]],
				[[L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]]
			];

			var polygon = L.polygon(latlngs);

			expect(polygon._defaultShape()).to.eql(latlngs[0][0]);
		});
	});

	describe("#addLatLng", function () {
		it("should add latlng to latlngs", function () {
			var latLngs = [
				[1, 2],
				[3, 4]
			];

			var polygon = L.polygon(latLngs);

			polygon.addLatLng([5, 6]);

			expect(polygon._latlngs).to.eql([[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]]);
		});

		it("should add latlng to first latlngs on a polygon with hole", function () {
			var latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			var polygon = L.polygon(latLngs);

			polygon.addLatLng([17, 0]);

			expect(polygon._latlngs[0]).to.eql([L.latLng([0, 12]), L.latLng([13, 14]), L.latLng([15, 16]), L.latLng([17, 0])]);
			expect(polygon._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
		});

		it("should add latlng by reference on a polygon with hole", function () {
			var latLngs = [
				[[0, 12], [13, 14], [15, 16]],
				[[1, 2], [3, 4], [5, 6]]
			];

			var polygon = L.polygon(latLngs);

			polygon.addLatLng([7, 8], polygon._latlngs[1]);

			expect(polygon._latlngs[0]).to.eql([L.latLng([0, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
			expect(polygon._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6]), L.latLng([7, 8])]);
		});

		it("should add latlng to first latlngs on a multi", function () {
			var latLngs = [
				[[[1, 2], [3, 4]]],
				[[[11, 12], [13, 14], [15, 16]]]
			];

			var polygon = L.polygon(latLngs);

			polygon.addLatLng([5, 6]);

			expect(polygon._latlngs[0]).to.eql([[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]]);
			expect(polygon._latlngs[1]).to.eql([[L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]]);
		});

		it("should add latlng to latlngs by reference on a multi", function () {
			var latLngs = [
				[[[11, 12], [13, 14], [15, 16]]],
				[[[1, 2], [3, 4]]]
			];

			var polygon = L.polygon(latLngs);

			polygon.addLatLng([5, 6], polygon._latlngs[1][0]);

			expect(polygon._latlngs[1]).to.eql([[L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]]);
			expect(polygon._latlngs[0]).to.eql([[L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]]);
		});

		it("should add latlng on first latlngs by default on a multipolygon with hole", function () {
			var latLngs = [
				[[[0, 10], [10, 10], [10, 0]], [[2, 3], [2, 4], [3, 4]]],
				[[[10, 20], [30, 40], [50, 60]]]
			];

			var polygon = L.polygon(latLngs);

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

			var polygon = L.polygon(latLngs);

			polygon.addLatLng([2, 2], polygon._latlngs[1][1]);

			expect(polygon._latlngs[0][0]).to.eql([L.latLng([10, 20]), L.latLng([30, 40]), L.latLng([50, 60])]);
			expect(polygon._latlngs[1][0]).to.eql([L.latLng([0, 10]), L.latLng([10, 10]), L.latLng([10, 0])]);
			expect(polygon._latlngs[1][1]).to.eql([L.latLng([2, 3]), L.latLng([2, 4]), L.latLng([3, 4]), L.latLng([2, 2])]);
		});
	});

	describe("#setStyle", function () {
		it("succeeds for empty Polygon already added to the map", function () {
			var style = {
				weight: 3
			};
			var polygon = L.polygon([]);

			polygon.addTo(map);
			polygon.setStyle(style);

			for (var prop in style) {
				expect(polygon.options[prop]).to.be(style[prop]);
			}
		});
	});
});
