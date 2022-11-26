describe('Polyline', () => {
	let map, container;

	beforeEach(() => {
		container = createContainer();
		map = L.map(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#initialize', () => {
		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const polyline = L.polyline(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(polyline._latlngs).to.not.eql(sourceLatLngs);
			expect(polyline.getLatLngs()).to.eql(polyline._latlngs);
		});

		it('should accept a multi', () => {
			const latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			const polyline = L.polyline(latLngs);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
			expect(polyline.getLatLngs()).to.eql(polyline._latlngs);
		});

		it('should accept an empty array', () => {
			const polyline = L.polyline([]);

			expect(polyline._latlngs).to.eql([]);
			expect(polyline.getLatLngs()).to.eql(polyline._latlngs);
		});

		it('can be added to the map when empty', () => {
			const polyline = L.polyline([]).addTo(map);
			expect(map.hasLayer(polyline)).to.be(true);
		});

	});

	describe('#isEmpty', () => {
		it('should return true for a polyline with no latlngs', () => {
			const polyline = L.polyline([]);
			expect(polyline.isEmpty()).to.be(true);
		});

		it('should return false for simple polyline', () => {
			const latLngs = [[1, 2], [3, 4]];
			const polyline = L.polyline(latLngs);
			expect(polyline.isEmpty()).to.be(false);
		});

		it('should return false for multi-polyline', () => {
			const latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];
			const polyline = L.polyline(latLngs);
			expect(polyline.isEmpty()).to.be(false);
		});

	});

	describe('#setLatLngs', () => {
		it('doesn\'t overwrite the given latlng array', () => {
			const originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			const sourceLatLngs = originalLatLngs.slice();

			const polyline = L.polyline(sourceLatLngs);

			polyline.setLatLngs(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it('can be set a multi', () => {
			const latLngs = [
				[[1, 2], [3, 4], [5, 6]],
				[[11, 12], [13, 14], [15, 16]]
			];

			const polyline = L.polyline([]);
			polyline.setLatLngs(latLngs);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14]), L.latLng([15, 16])]);
		});
	});

	describe('#getCenter', () => {
		it('should compute center of a big flat line on equator', () => {
			const polyline = L.polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyline.getCenter()).to.eql(L.latLng([0, 45]));
		});

		it('should compute center of a big flat line on equator with maxZoom', () => {
			map.setMaxZoom(18);
			const polyline = L.polyline([[0, 0], [0, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([0, 45]);
		});

		it('should compute center of a big flat line close to the pole', () => {
			const polyline = L.polyline([[80, 0], [80, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([80, 45], 1e-2);
		});

		it('should compute center of a big diagonal line', () => {
			const polyline = L.polyline([[0, 0], [80, 80]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([57.04516467328689, 40], 1);
		});

		it('should compute center of a diagonal line close to the pole', () => {
			const polyline = L.polyline([[70, 70], [84, 84]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([79.01810060159328, 77], 1);
		});

		it('should compute center of a big multiline', () => {
			const polyline = L.polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([0, 5], 1);
		});

		it('should compute center of a small flat line', () => {
			const polyline = L.polyline([[0, 0], [0, 0.090]]).addTo(map);
			map.setZoom(0);  // Make the line disappear in screen;
			expect(polyline.getCenter()).to.be.nearLatLng([0, 0.045]);
		});

		it('throws error if not yet added to map', () => {
			expect(() => {
				const polyline = L.polyline([[0, 0], [0, 0.090]]);
				polyline.getCenter();
			}).to.throwException('Must add layer to map before using getCenter()');
		});

		it('should compute same center for low and high zoom', () => {
			const layer = L.polyline([[10, -80], [0, 0], [0, 10], [10, 90]]).addTo(map);
			map.setZoom(0);
			const center = layer.getCenter();
			map.setZoom(18);
			expect(layer.getCenter()).to.be.nearLatLng(center);
		});

		it('should compute center of a zick-zack line', () => {
			const polyline = L.polyline([[0, 0], [50, 50], [30, 30], [35, 35]]).addTo(map);
			expect(polyline.getCenter()).to.be.nearLatLng([40.551864181628666, 38.36684065813897]);
		});

	});

	describe('#_defaultShape', () => {
		it('should return latlngs when flat', () => {
			const latLngs = [L.latLng([1, 2]), L.latLng([3, 4])];

			const polyline = L.polyline(latLngs);

			expect(polyline._defaultShape()).to.eql(latLngs);
		});

		it('should return first latlngs on a multi', () => {
			const latLngs = [
				[L.latLng([1, 2]), L.latLng([3, 4])],
				[L.latLng([11, 12]), L.latLng([13, 14])]
			];

			const polyline = L.polyline(latLngs);

			expect(polyline._defaultShape()).to.eql(latLngs[0]);
		});

	});

	describe('#addLatLng', () => {
		it('should add latlng to latlngs', () => {
			const latLngs = [
				[1, 2],
				[3, 4]
			];

			const polyline = L.polyline(latLngs);

			polyline.addLatLng([5, 6]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
		});

		it('should add latlng to first latlngs on a multi', () => {
			const latLngs = [
				[[1, 2], [3, 4]],
				[[11, 12], [13, 14]]
			];

			const polyline = L.polyline(latLngs);

			polyline.addLatLng([5, 6]);

			expect(polyline._latlngs[0]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[1]).to.eql([L.latLng([11, 12]), L.latLng([13, 14])]);
		});

		it('should add latlng to latlngs by reference', () => {
			const latLngs = [
				[[11, 12], [13, 14]],
				[[1, 2], [3, 4]]
			];

			const polyline = L.polyline(latLngs);

			polyline.addLatLng([5, 6], polyline._latlngs[1]);

			expect(polyline._latlngs[1]).to.eql([L.latLng([1, 2]), L.latLng([3, 4]), L.latLng([5, 6])]);
			expect(polyline._latlngs[0]).to.eql([L.latLng([11, 12]), L.latLng([13, 14])]);
		});

		it('should add latlng on empty polyline', () => {
			const polyline = L.polyline([]);

			polyline.addLatLng([1, 2]);

			expect(polyline._latlngs).to.eql([L.latLng([1, 2])]);
		});
	});

	describe('#setStyle', () => {
		it('succeeds for empty Polyline already added to the map', () => {
			const style = {
				weight: 3
			};
			const polyline = L.polyline([]);

			polyline.addTo(map);
			polyline.setStyle(style);

			for (const prop in style) {
				expect(polyline.options[prop]).to.be(style[prop]);
			}
		});
	});

	describe('#setStyle', () => {
		it('succeeds for empty Polyline already added to the map', () => {
			const style = {
				weight: 3
			};
			const polyline = L.polyline([]);

			polyline.addTo(map);
			polyline.setStyle(style);

			for (const prop in style) {
				expect(polyline.options[prop]).to.be(style[prop]);
			}
		});
	});

	describe('#distance', () => {
		it('calculates closestLayerPoint', () => {
			const p1 = map.latLngToLayerPoint([55.8, 37.6]);
			const p2 = map.latLngToLayerPoint([57.123076977278, 44.861962891635]);
			const latlngs = [[56.485503424111, 35.545556640339], [55.972522915346, 36.116845702918], [55.502459116923, 34.930322265253], [55.31534617509, 38.973291015816]]
				.map(ll => L.latLng(ll[0], ll[1]));
			const polyline = L.polyline([], {
				'noClip': true
			});
			map.addLayer(polyline);

			expect(polyline.closestLayerPoint(p1)).to.be(null);

			polyline.setLatLngs(latlngs);
			const point = polyline.closestLayerPoint(p1);
			expect(point).not.to.be(null);
			expect(point.distance).to.not.be(Infinity);
			expect(point.distance).to.not.be(NaN);

			const point2 = polyline.closestLayerPoint(p2);

			expect(point.distance).to.be.lessThan(point2.distance);
		});
	});
});
