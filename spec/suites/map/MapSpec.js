describe("Map", function () {
	var map,
		spy;
	beforeEach(function () {
		map = L.map(document.createElement('div'));
		spy = jasmine.createSpy();
	});

	describe("#remove", function () {
		it("fires an unload event if loaded", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container).setView([0, 0], 0);
			map.on('unload', spy);
			map.remove();
			expect(spy).toHaveBeenCalled();
		});

		it("fires no unload event if not loaded", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container);
			map.on('unload', spy);
			map.remove();
			expect(spy).not.toHaveBeenCalled();
		});

		it("undefines container._leaflet", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container);
			map.remove();
			expect(container._leaflet).toBeUndefined();
		});

		it("unbinds events", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container).setView([0, 0], 1);
			map.on('click dblclick mousedown mouseup mousemove', spy);
			map.remove();
			happen.click(container);
			happen.dblclick(container);
			happen.mousedown(container);
			happen.mouseup(container);
			happen.mousemove(container);
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('#getCenter', function () {
		it ('throws if not set before', function () {
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

	describe("#setView", function () {
		it("sets the view of the map", function () {
			expect(map.setView([51.505, -0.09], 13)).toBe(map);
			expect(map.getZoom()).toBe(13);
			expect(map.getCenter().distanceTo([51.505, -0.09])).toBeLessThan(5);
		});
	});

	describe("#getBounds", function () {
		it("is safe to call from within a moveend callback during initial load (#1027)", function () {
			map.on("moveend", function () {
				map.getBounds();
			});

			map.setView([51.505, -0.09], 13);
		});
	});

	describe("#getMinZoom and #getMaxZoom", function () {
		it("minZoom and maxZoom options overrides any minZoom and maxZoom set on layers", function () {
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
			it("fires a zoomlevelschange event", function () {
				map.on("zoomlevelschange", spy);
				expect(spy).not.toHaveBeenCalled();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				expect(spy).toHaveBeenCalled();
			});
		});

		describe("when a new layer with greater zoomlevel coverage than the current layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy).not.toHaveBeenCalled();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 15 }).addTo(map);
				expect(spy).toHaveBeenCalled();
			});
		});

		describe("when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map", function () {
			it("fires no zoomlevelschange event", function () {
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
			it("fires a zoomlevelschange event", function () {
				map.whenReady(function(){
					var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy).not.toHaveBeenCalled();
					map.removeLayer(tl);
					expect(spy).toHaveBeenCalled();
				});
			});
		});

		describe("when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer", function () {
			it("fires a zoomlevelschange event", function () {
				map.whenReady(function(){
					var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map),
					    t2 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 15 }).addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy).not.toHaveBeenCalled();
					map.removeLayer(t2);
					expect(spy).toHaveBeenCalled();
				});
			});
		});

		describe("when a tile layer is removed from a map it and it had lesser or the sa,e zoom level coverage as the remainding layer(s)", function () {
			it("fires no zoomlevelschange event", function () {
				map.whenReady(function(){
					var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map),
					    t2 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map),
					    t3 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 5 }).addTo(map);

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

	describe("#eachLayer", function () {
		it("returns self", function () {
			expect(map.eachLayer(function () {})).toBe(map);
		});

		it("calls the provided function for each layer", function () {
			var t1 = L.tileLayer("{z}{x}{y}").addTo(map),
			    t2 = L.tileLayer("{z}{x}{y}").addTo(map);

			map.eachLayer(spy);

			expect(spy.calls.length).toEqual(2);
			expect(spy.calls[0].args).toEqual([t1]);
			expect(spy.calls[1].args).toEqual([t2]);
		});

		it("calls the provided function with the provided context", function () {
			var t1 = L.tileLayer("{z}{x}{y}").addTo(map);

			map.eachLayer(spy, map);

			expect(spy.calls[0].object).toEqual(map);
		});
	});
});
