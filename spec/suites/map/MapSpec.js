describe("Map", function () {
	describe("#whenReady", function () {
		describe("when the map has not yet been loaded", function () {
			it("calls the callback when the map is loaded", function () {
				var map = L.map(document.createElement('div')),
					spy = jasmine.createSpy();

				map.whenReady(spy);
				expect(spy).not.toHaveBeenCalled();

				map.setView([0, 0], 1);
				expect(spy).toHaveBeenCalled();
			})
		});

		describe("when the map has already been loaded", function () {
			it("calls the callback immediately", function () {
				var map = L.map(document.createElement('div')),
					spy = jasmine.createSpy();

				map.setView([0, 0], 1);
				map.whenReady(spy);

				expect(spy).toHaveBeenCalled();
			});
		});
	});

	describe("#getBounds", function () {
		it("is safe to call from within a moveend callback during initial load (#1027)", function () {
			var c = document.createElement('div'),
				map = L.map(c);

			map.on("moveend", function () {
			  map.getBounds();
			});

			map.setView([51.505, -0.09], 13);
		});
	});
});
