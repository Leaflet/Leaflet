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
			});
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
		it("is safe to call from within a moveend callback during initial "
		   + "load (#1027)", function () {
			var c = document.createElement('div'),
				map = L.map(c);

			map.on("moveend", function () {
			  map.getBounds();
			});

			map.setView([51.505, -0.09], 13);
		});
	});

	describe("#getMinZoom and #getMaxZoom", function () {
		it("The minZoom and maxZoom options overrides any"
		   + " minZoom and maxZoom set on layers", function () {
			   var c = document.createElement('div'),
				   map = L.map(c, { minZoom: 5, maxZoom: 10 });
			   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
			   L.tileLayer("{z}{x}{y}", { minZoom:5, maxZoom: 15 }).addTo(map);
			   expect(map.getMinZoom()).toBe(5);
			   expect(map.getMaxZoom()).toBe(10);
		   });
	});
});
