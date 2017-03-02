describe('ImageOverlay', function () {
	describe('#setStyle', function () {
		it('sets opacity', function () {
			var overlay = L.imageOverlay().setStyle({opacity: 0.5});
			expect(overlay.options.opacity).to.equal(0.5);
		});
	});
	describe('#setBounds', function () {
		it('sets bounds', function () {
			var bounds = new L.LatLngBounds(
				new L.LatLng(14, 12),
				new L.LatLng(30, 40));
			var overlay = L.imageOverlay().setBounds(bounds);
			expect(overlay._bounds).to.equal(bounds);
		});
	});
	describe('#setZIndex', function () {

		var div, map;
		var corner1 = L.latLng(40.712, -74.227),
		corner2 = L.latLng(40.774, -74.125),
		bounds = L.latLngBounds(corner1, corner2);

		beforeEach(function () {
			div = document.createElement('div');
			div.style.width = '800px';
			div.style.height = '600px';
			div.style.visibility = 'hidden';

			document.body.appendChild(div);

			map = L.map(div);
		});

		afterEach(function () {
			document.body.removeChild(div);
		});

		it('sets the z-index of the image', function () {
			var overlay = L.imageOverlay();
			overlay.setZIndex(10);
			expect(overlay.options.zIndex).to.equal(10);
		});

		it('should update the z-index of the image if it has allready been added to the map', function () {
			var overlay = L.imageOverlay('', bounds);
			overlay.addTo(map);
			map.setView([0, 0], 1);	// view needs to be set so when layer is added it is initilized
			expect(overlay._image.style.zIndex).to.be('1');

			overlay.setZIndex('10');
			expect(overlay._image.style.zIndex).to.be('10');
		});

		it('should set the z-index of the image when it is added to the map', function () {
			var overlay = L.imageOverlay('', bounds);
			overlay.setZIndex('10');
			overlay.addTo(map);
			map.setView([0, 0], 1);	// view needs to be set so when layer is added it is initilized
			expect(overlay._image.style.zIndex).to.be('10');
		});
		it('should use the z-index specified in options', function () {
			var overlay = L.imageOverlay('', bounds, {zIndex: 20});
			overlay.addTo(map);
			map.setView([0, 0], 1);	// view needs to be set so when layer is added it is initilized
			expect(overlay._image.style.zIndex).to.be('20');
		});
		it('should be fluent', function () {
			var overlay = L.imageOverlay();
			expect(overlay.setZIndex()).to.equal(overlay);
		});
	});
});
