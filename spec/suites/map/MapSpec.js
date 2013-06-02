describe("Map", function () {
	var map,
		spy;
	beforeEach(function () {
		map = L.map(document.createElement('div'));
	});

	describe("#remove", function () {
		it("fires an unload event if loaded", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container).setView([0, 0], 0),
				spy = sinon.spy();
			map.on('unload', spy);
			map.remove();
			expect(spy.called).to.be.ok();
		});

		it("fires no unload event if not loaded", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container),
				spy = sinon.spy();
			map.on('unload', spy);
			map.remove();
			expect(spy.called).not.to.be.ok();
		});

		describe("corner case checking", function () {
			it("throws an exception upon reinitialization", function () {
				var container = document.createElement('div'),
					map = new L.Map(container);
				expect(function () {
					new L.Map(container);
				}).to.throwException(function(e) {
					expect(e.message).to.eql("Map container is already initialized.");
				});
				map.remove();
			});

			it("throws an exception if a container is not found", function () {
				expect(function () {
					new L.Map('nonexistentdivelement');
				}).to.throwException(function(e) {
					expect(e.message).to.eql("Map container not found.");
				});
				map.remove();
			});
		});

		it("undefines container._leaflet", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container);
			map.remove();
			expect(container._leaflet).to.be(undefined);
		});

		it("unbinds events", function () {
			var container = document.createElement('div'),
			    map = new L.Map(container).setView([0, 0], 1),
				spy = sinon.spy();

			map.on('click dblclick mousedown mouseup mousemove', spy);
			map.remove();

			happen.click(container);
			happen.dblclick(container);
			happen.mousedown(container);
			happen.mouseup(container);
			happen.mousemove(container);

			expect(spy.called).to.not.be.ok();
		});
	});

	describe('#getCenter', function () {
		it ('throws if not set before', function () {
			expect(function () {
				map.getCenter();
			}).to.throwError();
		});
	});

	describe("#whenReady", function () {
		describe("when the map has not yet been loaded", function () {
			it("calls the callback when the map is loaded", function () {
				var spy = sinon.spy();
				map.whenReady(spy);
				expect(spy.called).to.not.be.ok();

				map.setView([0, 0], 1);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when the map has already been loaded", function () {
			it("calls the callback immediately", function () {
				var spy = sinon.spy();
				map.setView([0, 0], 1);
				map.whenReady(spy);

				expect(spy.called).to.be.ok();
			});
		});
	});

	describe("#setView", function () {
		it("sets the view of the map", function () {
			expect(map.setView([51.505, -0.09], 13)).to.be(map);
			expect(map.getZoom()).to.be(13);
			expect(map.getCenter().distanceTo([51.505, -0.09])).to.be.lessThan(5);
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
			expect(map.getMinZoom()).to.be(5);
			expect(map.getMaxZoom()).to.be(10);
		});
	});

	describe("#addLayer", function () {
		it("calls layer.onAdd immediately if the map is ready", function () {
			var layer = { onAdd: sinon.spy() };
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(layer.onAdd.called).to.be.ok();
		});

		it("calls layer.onAdd when the map becomes ready", function () {
			var layer = { onAdd: sinon.spy() };
			map.addLayer(layer);
			expect(layer.onAdd.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).to.be.ok();
		});

		it("does not call layer.onAdd if the layer is removed before the map becomes ready", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() };
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).not.to.be.ok();
		});

		it("fires a layeradd event immediately if the map is ready", function () {
			var layer = { onAdd: sinon.spy() },
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it("fires a layeradd event when the map becomes ready", function () {
			var layer = { onAdd: sinon.spy() },
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			expect(spy.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(spy.called).to.be.ok();
		});

		it("does not fire a layeradd event if the layer is removed before the map becomes ready", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() },
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(spy.called).not.to.be.ok();
		});

		describe("When the first layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				var spy = sinon.spy();
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a new layer with greater zoomlevel coverage than the current layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				var spy = sinon.spy();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 15 }).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map", function () {
			it("fires no zoomlevelschange event", function () {
				var spy = sinon.spy();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 5 }).addTo(map);
				expect(spy.called).not.to.be.ok();
			});
		});
	});

	describe("#removeLayer", function () {
		it("calls layer.onRemove if the map is ready", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() };
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).to.be.ok();
		});

		it("does not call layer.onRemove if the layer was not added", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() };
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.ok();
		});

		it("does not call layer.onRemove if the map is not ready", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() };
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.ok();
		});

		it("fires a layerremove event if the map is ready", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() },
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it("does not fire a layerremove if the layer was not added", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() },
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it("does not fire a layerremove if the map is not ready", function () {
			var layer = { onAdd: sinon.spy(), onRemove: sinon.spy() },
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		describe("when the last tile layer on a map is removed", function () {
			it("fires a zoomlevelschange event", function () {
				map.whenReady(function(){
					var spy = sinon.spy();
					var tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy.called).not.to.be.ok();
					map.removeLayer(tl);
					expect(spy.called).to.be.ok();
				});
			});
		});

		describe("when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer", function () {
			it("fires a zoomlevelschange event", function () {
				map.whenReady(function(){
					var spy = sinon.spy(),
						tl = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 10 }).addTo(map),
					    t2 = L.tileLayer("{z}{x}{y}", { minZoom:0, maxZoom: 15 }).addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy.called).to.not.be.ok();
					map.removeLayer(t2);
					expect(spy.called).to.be.ok();
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
			expect(map.eachLayer(function () {})).to.be(map);
		});

		it("calls the provided function for each layer", function () {
			var t1 = L.tileLayer("{z}{x}{y}").addTo(map),
			    t2 = L.tileLayer("{z}{x}{y}").addTo(map),
				spy = sinon.spy();

			map.eachLayer(spy);

			expect(spy.callCount).to.eql(2);
			expect(spy.firstCall.args).to.eql([t1]);
			expect(spy.secondCall.args).to.eql([t2]);
		});

		it("calls the provided function with the provided context", function () {
			var t1 = L.tileLayer("{z}{x}{y}").addTo(map),
				spy = sinon.spy();

			map.eachLayer(spy, map);

			expect(spy.thisValues[0]).to.eql(map);
		});
	});
});
