describe('Polyline', function () {
	var map, container;

	beforeEach(function () {
		container = createContainer();
		map = L.map(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	describe("#initialize", function () {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polyline = L.polyline(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(polyline._latlngs).to.not.eql(sourceLatLngs);
			expect(polyline.getLatLngs()).to.eql(polyline._latlngs);
		});

		it("should accept a multi", function () {
			var latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			var polyline = L.polyline(latLngs);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
			expect(polyline.getLatLngs()).to.eql(polyline._latlngs);
		});

		it("should accept an empty array", function () {
			var polyline = L.polyline([]);

			expect(polyline._latlngs).to.eql([]);
			expect(polyline.getLatLngs()).to.eql(polyline._latlngs);
		});

		it("can be added to the map when empty", function () {
			var polyline = L.polyline([]).addTo(map);
			expect(map.hasLayer(polyline)).to.be(true);
		});

	});

	describe("#isEmpty", function () {
		it('should return true for a polyline with no latlngs', function () {
			var polyline = L.polyline([]);
			expect(polyline.isEmpty()).to.be(true);
		});

		it('should return false for simple polyline', function () {
			var latLngs = [[1, 2], [3, 4]];
			var polyline = L.polyline(latLngs);
			expect(polyline.isEmpty()).to.be(false);
		});

		it('should return false for multi-polyline', function () {
			var latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];
			var polyline = L.polyline(latLngs);
			expect(polyline.isEmpty()).to.be(false);
		});

	});

	describe("#setLatLngs", function () {
		it("doesn't overwrite the given latlng array", function () {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var polyline = L.polyline(sourceLatLngs);

			polyline.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it("can be set a multi", function () {
			var latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			var polyline = L.polyline([]);
			polyline.setLatLngs(latLngs);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
		});
	});

	describe('#getCenter', function () {
		it('should compute center of a big flat line on equator', function () {
			var polyline = L.polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyline.getCenter()).to.eql(L.latLng([0, 45]));
		});

		it('should compute center of a big flat line on equator with maxZoom', function () {
			map.setMaxZoom(18);
			var polyline = L.polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([0, 45]);
		});

		it('should compute center of a big flat line close to the pole', function () {
			var polyline = L.polyline([[80, 0], [80, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([80, 45], 1e-2);
		});

		it('should compute center of a big diagonal line', function () {
			var polyline = L.polyline([[0, 0], [80, 80]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([57.04516467328689, 40], 1);
		});

		it('should compute center of a diagonal line close to the pole', function () {
			var polyline = L.polyline([[70, 70], [84, 84]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([79.01810060159328, 77], 1);
		});

		it('should compute center of a big multiline', function () {
			var polyline = L.polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([0, 5], 1);
		});

		it('should compute center of a small flat line', function () {
			var polyline = L.polyline([[0, 0], [0, 0.090]]).addTo(map);
			map.setZoom(0);  // Make the line disappear in screen;
			expect(polyline.getCenter()).to.be.nearLatLng([0, 0.045]);
		});

		it('throws error if not yet added to map', function () {
			expect(function () {
				var polyline = L.polyline([[0, 0], [0, 0.090]]);
				polyline.getCenter();
			}).to.throwException('Must add layer to map before using getCenter()');
		});

		it('should compute same center for low and high zoom', function () {
			var layer = L.polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			map.setZoom(0);
			var center = layer.getCenter();
			map.setZoom(18);
			expect(layer.getCenter()).to.be.nearLatLng(center);
		});

		it('should compute center of a zick-zack line', function () {
			var polyline = L.polyline([[0, 0], [50, 50], [30, 30], [35, 35]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([40.551864181628666, 38.36684065813897]);
		});

	});

	describe("#_defaultShape", function () {
		it("should return latlngs when flat", function () {
			var latLngs = [L.latLng([1, 2]), L.latLng([3, 4])];

			var polyline = L.polyline(latLngs);

			expect(polyline._defaultShape()).to.eql(latLngs);
		});

		it("should return first latlngs on a multi", function () {
			var latLngs = [
				[L.latLng([1, 2]), L.latLng([3, 4])],
				[L.latLng([11, 12]), L.latLng([13, 14])]
			];

			var polyline = L.polyline(latLngs);

			expect(polyline._defaultShape()).to.eql(latLngs[0]);
		});

	});

	describe("#addLatLng", function () {
		it("should add latlng to latlngs", function () {
			var latLngs = [
				[1, 2],
				[3, 4]
			];

			var polyline = L.polyline(latLngs);

			polyline.addLatLng([5, 6]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
		});

		it("should add latlng to first latlngs on a multi", function () {
			var latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];

			var polyline = L.polyline(latLngs);

			polyline.addLatLng([5, 6]);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14])]);
		});

		it("should add latlng to latlngs by reference", function () {
			var latLngs = [
				[[11, 12], [13, 14]],
				[[1, 2], [3, 4]]
			];

			var polyline = L.polyline(latLngs);

			polyline.addLatLng([5, 6], polyline._latlngs[1]);

			expect(polyline._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[0]).to.eql([L.latLng([11, 12]), L.latLng([13, 14])]);
		});

		it("should add latlng on empty polyline", function () {
			var polyline = L.polyline([]);

			polyline.addLatLng([1, 2]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2])]);
		});
	});

	describe("#setStyle", function () {
		it("succeeds for empty Polyline already added to the map", function () {
			var style = {
				weight: 3
			};
			var polyline = L.polyline([]);

			polyline.addTo(map);
			polyline.setStyle(style);

			for (var prop in style) {
				expect(polyline.options[prop]).to.be(style[prop]);
			}
		});
	});

	describe("#setStyle", function () {
		it("succeeds for empty Polyline already added to the map", function () {
			var style = {
				weight: 3
			};
			var polyline = L.polyline([]);

			polyline.addTo(map);
			polyline.setStyle(style);

			for (var prop in style) {
				expect(polyline.options[prop]).to.be(style[prop]);
			}
		});
	});

	describe("#distance", function () {
		it("calculates closestLayerPoint", function () {
			var p1 = map.latLngToLayerPoint([55.8, 37.6]);
			var p2 = map.latLngToLayerPoint([57.123076977278, 44.861962891635]);
			var latlngs = [[56.485503424111, 35.545556640339], [55.972522915346, 36.116845702918], [55.502459116923, 34.930322265253], [55.31534617509, 38.973291015816]]
				.map(function (ll) {
					return L.latLng(ll[0], ll[1]);
				});
			var polyline = L.polyline([], {
				'noClip': true
			});
			map.addLayer(polyline);

			expect(polyline.closestLayerPoint(p1)).to.be(null);

			polyline.setLatLngs(latlngs);
			var point = polyline.closestLayerPoint(p1);
			expect(point).not.to.be(null);
			expect(point.distance).to.not.be(Infinity);
			expect(point.distance).to.not.be(NaN);

			var point2 = polyline.closestLayerPoint(p2);

			expect(point.distance).to.be.lessThan(point2.distance);
		});
	});
});
