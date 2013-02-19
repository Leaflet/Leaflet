describe("Map", function () {
	var map,
		spy;
	beforeEach(function () {
		map = L.map(document.createElement('div'));
		spy = jasmine.createSpy();
	});

	describe('#getCenter', function () {
		it ('should throw if not set before', function () {
			expect(function () {
				map.getCenter();
			}).toThrow();
		});
	});

	describe("#whenReady", function () {
		describe("when the map has not yet been loaded", function () {
			it("calls the callback when the map is loaded", function () {
				map.whenReady(spy);
				expect(spy).not.toHaveBeenCalled();

				map.setView([0, 0], 1);
				expect(spy).toHaveBeenCalled();
			});
		});

		describe("when the map has already been loaded", function () {
			it("calls the callback immediately", function () {
				map.setView([0, 0], 1);
				map.whenReady(spy);

				expect(spy).toHaveBeenCalled();
			});
		});
	});

	describe("#getBounds", function () {
		it("is safe to call from within a moveend callback during initial " +
		   "load (#1027)", function () {
			map.on("moveend", function () {
			  map.getBounds();
			});

			map.setView([51.505, -0.09], 13);
		});
	});

	describe("#getMinZoom and #getMaxZoom", function () {
		it("The minZoom and maxZoom options overrides any" +
		   " minZoom and maxZoom set on layers", function () {
			   var c = document.createElement('div'),
				   map = L.map(c, { minZoom: 5, maxZoom: 10 });
			   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
			   L.tileLayer("{z}{x}{y}", { minZoom:5, maxZoom: 15 }).addTo(map);
			   expect(map.getMinZoom()).toBe(5);
			   expect(map.getMaxZoom()).toBe(10);
		   });
	});

	describe("#addLayer", function () {
		describe("When the first layer is added to a map", function () {
			it("should fire a zoomlevelschange event", function () {
				map.on("zoomlevelschange", spy);
				expect(spy).not.toHaveBeenCalled();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				expect(spy).toHaveBeenCalled();
			});
		});
		describe("when a new layer with greater zoomlevel coverage than the current layer is added to a map", function () {
			it("Should fire a zoomlevelschange event ",
			   function () {
				   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				   map.on("zoomlevelschange", spy);
				   expect(spy).not.toHaveBeenCalled();
				   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 15 }).addTo(map);
				   expect(spy).toHaveBeenCalled();
			   });
		});
		describe("when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map", function () {
			it("Shouldn't fire a zoomlevelschange event ",
			   function () {
				   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				   map.on("zoomlevelschange", spy);
				   expect(spy).not.toHaveBeenCalled();
				   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				   expect(spy).not.toHaveBeenCalled();
				   L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 5 }).addTo(map);
				   expect(spy).not.toHaveBeenCalled();

			   });
		});

	});
	describe("#removeLayer", function () {
		describe("when the last tile layer on a map is removed", function () {
			it("should fire a zoomlevelschange event ", function () {
				   map.whenReady(function(){
					   var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 })
							   .addTo(map);

					   map.on("zoomlevelschange", spy);
					   expect(spy).not.toHaveBeenCalled();
					   map.removeLayer(tl);
					   expect(spy).toHaveBeenCalled();
				   });
			   });
		});
		describe("when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer", function () {
			it("should fire a zoomlevelschange event ", function () {
				   map.whenReady(function(){
					   var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 })
							   .addTo(map),
						   t2 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 15 })
							   .addTo(map);

					   map.on("zoomlevelschange", spy);
					   expect(spy).not.toHaveBeenCalled();
					   map.removeLayer(t2);
					   expect(spy).toHaveBeenCalled();
				   });
			});
		});
		describe("when a tile layer is removed from a map it and it had lesser or the sa,e zoom level coverage as the remainding layer(s)", function () {
			it("shouldn't fire a zoomlevelschange event ", function () {
				map.whenReady(function(){
					var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 })
							.addTo(map),
						t2 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 })
							.addTo(map),
						t3 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 5 })
							.addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy).not.toHaveBeenCalled();
					map.removeLayer(t2);
					expect(spy).not.toHaveBeenCalled();
					map.removeLayer(t3);
					expect(spy).not.toHaveBeenCalled();

				});
			});
		});

	});
});
