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
					L.map(container);
				}).to.throwException(function (e) {
					expect(e.message).to.eql("Map container is already initialized.");
				});
				map.remove();
			});

			it("throws an exception if a container is not found", function () {
				expect(function () {
					L.map('nonexistentdivelement');
				}).to.throwException(function (e) {
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

		it("throws error if container is reused by other instance", function () {
			var container = document.createElement('div'),
			    map = L.map(container),
			    map2;

			map.remove();
			map2 = L.map(container);

			expect(function () {
				map.remove();
			}).to.throwException();
		});
	});

	describe('#getCenter', function () {
		it('throws if not set before', function () {
			expect(function () {
				map.getCenter();
			}).to.throwError();
		});

		it('returns a precise center when zoomed in after being set (#426)', function () {
			var center = L.latLng(10, 10);
			map.setView(center, 1);
			map.setZoom(19);
			expect(map.getCenter()).to.eql(center);
		});

		it('returns correct center after invalidateSize (#1919)', function () {
			map.setView(L.latLng(10, 10), 1);
			map.invalidateSize();
			expect(map.getCenter()).not.to.eql(L.latLng(10, 10));
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

		it("can be passed without a zoom specified", function () {
			map.setZoom(13);
			expect(map.setView([51.605, -0.11])).to.be(map);
			expect(map.getZoom()).to.be(13);
			expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
		});

		it("limits initial zoom when no zoom specified", function () {
			map.options.maxZoom = 20;
			map.setZoom(100);
			expect(map.setView([51.605, -0.11])).to.be(map);
			expect(map.getZoom()).to.be(20);
			expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
		});

		it("defaults to zoom passed as map option", function () {
			map = L.map(document.createElement('div'), {zoom: 13});
			expect(map.setView([51.605, -0.11])).to.be(map);
			expect(map.getZoom()).to.be(13);
		});

		it("passes duration option to panBy", function () {
			map = L.map(document.createElement('div'), {zoom: 13, center: [0, 0]});
			map.panBy = sinon.spy();
			map.setView([51.605, -0.11], 13, {animate: true, duration: 13});
			expect(map.panBy.callCount).to.eql(1);
			expect(map.panBy.args[0][1].duration).to.eql(13);
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

	describe("#getBoundsZoom", function () {
		var halfLength = 0.00025;
		var bounds = [[-halfLength, -halfLength], [halfLength, halfLength]];
		var wideBounds = [[-halfLength, -halfLength * 10], [halfLength, halfLength * 10]];
		var padding = [100, 100];
		var height = '400px';

		it("returns high levels of zoom with small areas and big padding", function () {
			var container = map.getContainer();
			container.style.height = height;
			document.body.appendChild(container);
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19);
		});

		it("returns multiples of zoomSnap when zoomSnap > 0 on any3d browsers", function () {
			var container = map.getContainer();
			container.style.height = height;
			document.body.appendChild(container);
			L.Browser.any3d = true;
			map.options.zoomSnap = 0.5;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19.5);
			map.options.zoomSnap = 0.2;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19.6);
			map.options.zoomSnap = 0;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.within(19.6864560, 19.6864561);
		});

		it("getBoundsZoom does not return Infinity when projected SE - NW has negative components", function () {
			var container = map.getContainer();
			container.style.height = 369;
			container.style.width = 1048;
			document.body.appendChild(container);
			var bounds = L.latLngBounds(L.latLng([62.18475569507688, 6.926335173954951]), L.latLng([62.140483526511694, 6.923933370740089]));

			// The following coordinates are bounds projected with proj4leaflet crs = EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs
			var projectedSE = L.point(7800503.059925064, 6440062.353052008);
			var projectedNW = L.point(7801987.203481699, 6425186.447901004);
			var crsMock = sinon.mock(map.options.crs);
			crsMock.expects("project").withArgs(bounds.getNorthWest()).returns(projectedNW);
			crsMock.expects("project").withArgs(bounds.getSouthEast()).returns(projectedSE);

			var padding = L.point(-50, -50);
			map.setZoom(16);
			expect(map.getBoundsZoom(bounds, false, padding)).to.eql(9);
		});

		it("respects the 'inside' parameter", function () {
			var container = map.getContainer();
			container.style.height = height;
			document.body.appendChild(container);
			expect(map.getBoundsZoom(wideBounds, false, padding)).to.be.equal(17);
			expect(map.getBoundsZoom(wideBounds, true, padding)).to.be.equal(20);
		});
	});

	describe('#setMaxBounds', function () {
		var container;

		beforeEach(function () {
			container = map.getContainer();
			document.body.appendChild(container);
		});

		afterEach(function () {
			// document.body.removeChild(container);
		});

		it("aligns pixel-wise map view center with maxBounds center if it cannot move view bounds inside maxBounds (#1908)", function () {
			// large view, cannot fit within maxBounds
			container.style.width = container.style.height = "1000px";
			// maxBounds
			var bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			// set view outside
			map.setView(L.latLng([53.0, 0.15]), 12, {animate: false});
			// get center of bounds in pixels
			var boundsCenter = map.project(bounds.getCenter()).round();
			expect(map.project(map.getCenter()).round()).to.eql(boundsCenter);
		});

		it("moves map view within maxBounds by changing one coordinate", function () {
			// small view, can fit within maxBounds
			container.style.width = container.style.height = "200px";
			// maxBounds
			var bounds = L.latLngBounds([51, -0.2], [52, 0.2]);
			map.setMaxBounds(bounds, {animate: false});
			// set view outside maxBounds on one direction only
			// leaves untouched the other coordinate (that is not already centered)
			var initCenter = [53.0, 0.1];
			map.setView(L.latLng(initCenter), 16, {animate: false});
			// one pixel coordinate hasn't changed, the other has
			var pixelCenter = map.project(map.getCenter()).round();
			var pixelInit = map.project(initCenter).round();
			expect(pixelCenter.x).to.eql(pixelInit.x);
			expect(pixelCenter.y).not.to.eql(pixelInit.y);
			// the view is inside the bounds
			expect(bounds.contains(map.getBounds())).to.be(true);
		});

		it("remove listeners when called without arguments", function () {
			L.tileLayer('http://tilecache.openstreetmap.fr/hot/{z}/{x}/{y}.png', {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = "500px";
			var bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			map.setMaxBounds();
			// set view outside
			var center = L.latLng([0, 0]);
			map.once('moveend', function () {
				expect(center.equals(map.getCenter())).to.be(true);
			});
			map.setView(center, 18, {animate: false});
		});

	});

	describe("#getMinZoom and #getMaxZoom", function () {
		describe('#getMinZoom', function () {
			it('returns 0 if not set by Map options or TileLayer options', function () {
				var map = L.map(document.createElement('div'));
				expect(map.getMinZoom()).to.be(0);
			});
		});

		it("minZoom and maxZoom options overrides any minZoom and maxZoom set on layers", function () {

			var map = L.map(document.createElement('div'), {minZoom: 2, maxZoom: 20});

			L.tileLayer("{z}{x}{y}", {minZoom: 4, maxZoom: 10}).addTo(map);
			L.tileLayer("{z}{x}{y}", {minZoom: 6, maxZoom: 17}).addTo(map);
			L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 22}).addTo(map);

			expect(map.getMinZoom()).to.be(2);
			expect(map.getMaxZoom()).to.be(20);
		});

		it("layer minZoom overrides map zoom if map has no minZoom set and layer minZoom is bigger than map zoom", function () {
			var map = L.map(document.createElement("div"), {zoom: 10});
			L.tileLayer("{z}{x}{y}", {minZoom: 15}).addTo(map);

			expect(map.getMinZoom()).to.be(15);
		});

		it("layer maxZoom overrides map zoom if map has no maxZoom set and layer maxZoom is smaller than map zoom", function () {
			var map = L.map(document.createElement("div"), {zoom: 20});
			L.tileLayer("{z}{x}{y}", {maxZoom: 15}).addTo(map);

			expect(map.getMaxZoom()).to.be(15);
		});

		it("map's zoom is adjusted to layer's minZoom even if initialized with smaller value", function () {
			var map = L.map(document.createElement("div"), {zoom: 10});
			L.tileLayer("{z}{x}{y}", {minZoom: 15}).addTo(map);

			expect(map.getZoom()).to.be(15);
		});

		it("map's zoom is adjusted to layer's maxZoom even if initialized with larger value", function () {
			var map = L.map(document.createElement("div"), {zoom: 20});
			L.tileLayer("{z}{x}{y}", {maxZoom: 15}).addTo(map);

			expect(map.getZoom()).to.be(15);
		});
	});

	describe("#hasLayer", function () {
		it("returns false when passed undefined, null, or false", function () {
			var map = L.map(document.createElement('div'));
			expect(map.hasLayer(undefined)).to.equal(false);
			expect(map.hasLayer(null)).to.equal(false);
			expect(map.hasLayer(false)).to.equal(false);
		});
	});

	function layerSpy() {
		var layer = new L.Layer();
		layer.onAdd = sinon.spy();
		layer.onRemove = sinon.spy();
		return layer;
	}

	describe("#addLayer", function () {

		it("calls layer.onAdd immediately if the map is ready", function () {
			var layer = layerSpy();
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(layer.onAdd.called).to.be.ok();
		});

		it("calls layer.onAdd when the map becomes ready", function () {
			var layer = layerSpy();
			map.addLayer(layer);
			expect(layer.onAdd.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).to.be.ok();
		});

		it("does not call layer.onAdd if the layer is removed before the map becomes ready", function () {
			var layer = layerSpy();
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).not.to.be.ok();
		});

		it("fires a layeradd event immediately if the map is ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it("fires a layeradd event when the map becomes ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			expect(spy.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(spy.called).to.be.ok();
		});

		it("does not fire a layeradd event if the layer is removed before the map becomes ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(spy.called).not.to.be.ok();
		});

		it("adds the layer before firing layeradd", function (done) {
			var layer = layerSpy();
			map.on('layeradd', function () {
				expect(map.hasLayer(layer)).to.be.ok();
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
		});

		describe("When the first layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				var spy = sinon.spy();
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a new layer with greater zoomlevel coverage than the current layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				var spy = sinon.spy();
				L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 15}).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map", function () {
			it("fires no zoomlevelschange event", function () {
				var spy = sinon.spy();
				L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 5}).addTo(map);
				expect(spy.called).not.to.be.ok();
			});
		});
	});

	describe("#removeLayer", function () {
		it("calls layer.onRemove if the map is ready", function () {
			var layer = layerSpy();
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).to.be.ok();
		});

		it("does not call layer.onRemove if the layer was not added", function () {
			var layer = layerSpy();
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.ok();
		});

		it("does not call layer.onRemove if the map is not ready", function () {
			var layer = layerSpy();
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.ok();
		});

		it("fires a layerremove event if the map is ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it("does not fire a layerremove if the layer was not added", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it("does not fire a layerremove if the map is not ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it("removes the layer before firing layerremove", function (done) {
			var layer = layerSpy();
			map.on('layerremove', function () {
				expect(map.hasLayer(layer)).not.to.be.ok();
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it("supports adding and removing a tile layer without initializing the map", function () {
			var layer = L.tileLayer("{z}{x}{y}");
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it("supports adding and removing a tile layer without initializing the map", function () {
			map.setView([0, 0], 18);
			var layer = L.gridLayer();
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		describe("when the last tile layer on a map is removed", function () {
			it("fires a zoomlevelschange event", function () {
				map.whenReady(function () {
					var spy = sinon.spy();
					var tl = L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy.called).not.to.be.ok();
					map.removeLayer(tl);
					expect(spy.called).to.be.ok();
				});
			});
		});

		describe("when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer", function () {
			it("fires a zoomlevelschange event", function () {
				map.whenReady(function () {
					var spy = sinon.spy(),
					    tl = L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map),
					    t2 = L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 15}).addTo(map);

					map.on("zoomlevelschange", spy);
					expect(spy.called).to.not.be.ok();
					map.removeLayer(t2);
					expect(spy.called).to.be.ok();
				});
			});
		});

		describe("when a tile layer is removed from a map it and it had lesser or the sa,e zoom level coverage as the remainding layer(s)", function () {
			it("fires no zoomlevelschange event", function () {
				map.whenReady(function () {
					var tl = L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map),
					    t2 = L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 10}).addTo(map),
					    t3 = L.tileLayer("{z}{x}{y}", {minZoom: 0, maxZoom: 5}).addTo(map);

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

	describe("#invalidateSize", function () {
		var container,
		    origWidth = 100,
		    clock;

		beforeEach(function () {
			container = map.getContainer();
			container.style.width = origWidth + "px";
			document.body.appendChild(container);
			map.setView([0, 0], 0);
			map.invalidateSize({pan: false});
			clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			document.body.removeChild(container);
			clock.restore();
		});

		it("pans by the right amount when growing in 1px increments", function () {
			container.style.width = (origWidth + 1) + "px";
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(1);

			container.style.width = (origWidth + 2) + "px";
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(1);

			container.style.width = (origWidth + 3) + "px";
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(2);
		});

		it("pans by the right amount when shrinking in 1px increments", function () {
			container.style.width = (origWidth - 1) + "px";
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(0);

			container.style.width = (origWidth - 2) + "px";
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(-1);

			container.style.width = (origWidth - 3) + "px";
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(-1);
		});

		it("pans back to the original position after growing by an odd size and back", function () {
			container.style.width = (origWidth + 5) + "px";
			map.invalidateSize();

			container.style.width = origWidth + "px";
			map.invalidateSize();

			expect(map._getMapPanePos().x).to.be(0);
		});

		it("emits no move event if the size has not changed", function () {
			var spy = sinon.spy();
			map.on("move", spy);

			map.invalidateSize();

			expect(spy.called).not.to.be.ok();
		});

		it("emits a move event if the size has changed", function () {
			var spy = sinon.spy();
			map.on("move", spy);

			container.style.width = (origWidth + 5) + "px";
			map.invalidateSize();

			expect(spy.called).to.be.ok();
		});

		it("emits a moveend event if the size has changed", function () {
			var spy = sinon.spy();
			map.on("moveend", spy);

			container.style.width = (origWidth + 5) + "px";
			map.invalidateSize();

			expect(spy.called).to.be.ok();
		});

		it("debounces the moveend event if the debounceMoveend option is given", function () {
			var spy = sinon.spy();
			map.on("moveend", spy);

			container.style.width = (origWidth + 5) + "px";
			map.invalidateSize({debounceMoveend: true});

			expect(spy.called).not.to.be.ok();

			clock.tick(200);

			expect(spy.called).to.be.ok();
		});
	});

	describe('#flyTo', function () {
		var div;

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

		it('move to requested center and zoom, and call zoomend once', function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			var spy = sinon.spy(),
			    newCenter = new L.LatLng(10, 11),
			    newZoom = 12;
			var callback = function () {
				expect(map.getCenter()).to.eql(newCenter);
				expect(map.getZoom()).to.eql(newZoom);
				spy();
				expect(spy.calledOnce).to.be.ok();
				done();
			};
			map.setView([0, 0], 0);
			map.on('zoomend', callback).flyTo(newCenter, newZoom);
		});

		it('flyTo start latlng == end latlng', function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			var dc = new L.LatLng(38.91, -77.04);
			map.setView(dc, 14);

			map.on('zoomend', function () {
				expect(map.getCenter()).to.eql(dc);
				expect(map.getZoom()).to.eql(4);
				done();
			});

			map.flyTo(dc, 4);
		});
	});

	describe('#zoomIn and #zoomOut', function () {
		var center = L.latLng(22, 33);
		beforeEach(function () {
			map.setView(center, 10);
		});

		it('zoomIn zooms by 1 zoom level by default', function (done) {
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(11);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it('zoomOut zooms by 1 zoom level by default', function (done) {
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(9);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(null, {animate: false});
		});

		it('zoomIn ignores the zoomDelta option on non-any3d browsers', function (done) {
			L.Browser.any3d = false;
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(11);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it('zoomIn respects the zoomDelta option on any3d browsers', function (done) {
			L.Browser.any3d = true;
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.setView(center, 10);
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it('zoomOut respects the zoomDelta option on any3d browsers', function (done) {
			L.Browser.any3d = true;
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.setView(center, 10);
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(9.75);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(null, {animate: false});
		});

		it('zoomIn snaps to zoomSnap on any3d browsers', function (done) {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			L.Browser.any3d = true;
			map.zoomIn(0.22, {animate: false});
		});

		it('zoomOut snaps to zoomSnap on any3d browsers', function (done) {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(9.75);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			L.Browser.any3d = true;
			map.zoomOut(0.22, {animate: false});
		});
	});

	describe('#fitBounds', function () {
		var center = L.latLng(50.5, 30.51),
		    bounds = L.latLngBounds(L.latLng(1, 102), L.latLng(11, 122)),
		    boundsCenter = bounds.getCenter();

		beforeEach(function () {
			// fitBounds needs a map container with non-null area
			var container = map.getContainer();
			container.style.width = container.style.height = "100px";
			document.body.appendChild(container);
			map.setView(center, 15);
		});

		afterEach(function () {
			document.body.removeChild(map.getContainer());
		});

		it('Snaps zoom level to integer by default', function (done) {
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it('Snaps zoom to zoomSnap on any3d browsers', function (done) {
			map.options.zoomSnap = 0.25;
			L.Browser.any3d = true;
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(2.75);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it('Ignores zoomSnap on non-any3d browsers', function (done) {
			map.options.zoomSnap = 0.25;
			L.Browser.any3d = false;
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it('can be called with an array', function (done) {
			map.once('zoomend', function () {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			var bounds = [[1, 102], [11, 122]];
			map.fitBounds(bounds, {animate: false});
		});

		it('throws an error with invalid bounds', function () {
			expect(function () {
				map.fitBounds(NaN);
			}).to.throwError();
		});

		it('Fits to same scale and zoom', function (done) {
			var bounds = map.getBounds(),
			    zoom = map.getZoom();
			map.once('moveend zoomend', function () {
				var newBounds = map.getBounds();
				expect(newBounds.getSouthWest()).to.nearLatLng(bounds.getSouthWest());
				expect(newBounds.getNorthEast()).to.nearLatLng(bounds.getNorthEast());
				expect(map.getZoom()).to.eql(zoom);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it('Fits to small bounds from small zoom', function (done) {
			map.once('zoomend', function () {
				map.once('zoomend', function () {
					expect(map.getZoom()).to.eql(11);
					expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
					done();
				});
				map.fitBounds(bounds);
			});

			bounds = L.latLngBounds([57.73, 11.93], [57.75, 11.95]);
			boundsCenter = bounds.getCenter();
			map.setZoom(0);
		});

		it('Fits to large bounds from large zoom', function (done) {
			map.once('zoomend', function () {
				map.once('zoomend', function () {
					expect(map.getZoom()).to.eql(0);
					expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
					done();
				});
				map.fitBounds(bounds);
			});

			bounds = L.latLngBounds([90, -180], [-90, 180]);
			boundsCenter = bounds.getCenter();
			map.setZoom(22);
		});
	});


	describe('#fitBounds after layers set', function () {
		var center = L.latLng(22, 33),
		    bounds = L.latLngBounds(L.latLng(1, 102), L.latLng(11, 122)),
		    boundsCenter = bounds.getCenter();

		beforeEach(function () {
			// fitBounds needs a map container with non-null area
			var container = map.getContainer();
			container.style.width = container.style.height = "100px";
			document.body.appendChild(container);
		});

		afterEach(function () {
			document.body.removeChild(map.getContainer());
		});

		it('Snaps to a number after adding tile layer', function (done) {
			L.Browser.any3d = true;
			map.addLayer(L.tileLayer('file:///dev/null'));
			expect(map.getZoom()).to.be(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.be(2);
			done();
		});

		it('Snaps to a number after adding marker', function (done) {
			L.Browser.any3d = true;
			map.addLayer(L.marker(center));
			expect(map.getZoom()).to.be(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.be(2);
			done();
		});

	});

	describe('#DOM events', function () {

		var c, map;

		beforeEach(function () {
			c = document.createElement('div');
			c.style.width = '400px';
			c.style.height = '400px';
			map = new L.Map(c);
			map.setView(new L.LatLng(0, 0), 0);
			document.body.appendChild(c);
		});

		afterEach(function () {
			document.body.removeChild(c);
		});

		it("DOM events propagate from polygon to map", function () {
			var spy = sinon.spy();
			map.on("mousemove", spy);
			var layer = new L.Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			happen.mousemove(layer._path);
			expect(spy.calledOnce).to.be.ok();
		});

		it("DOM events propagate from marker to map", function () {
			var spy = sinon.spy();
			map.on("mousemove", spy);
			var layer = new L.Marker([1, 2]).addTo(map);
			happen.mousemove(layer._icon);
			expect(spy.calledOnce).to.be.ok();
		});

		it("DOM events fired on marker can be cancelled before being caught by the map", function () {
			var mapSpy = sinon.spy();
			var layerSpy = sinon.spy();
			map.on("mousemove", mapSpy);
			var layer = new L.Marker([1, 2]).addTo(map);
			layer.on("mousemove", L.DomEvent.stopPropagation).on("mousemove", layerSpy);
			happen.mousemove(layer._icon);
			expect(layerSpy.calledOnce).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it("DOM events fired on polygon can be cancelled before being caught by the map", function () {
			var mapSpy = sinon.spy();
			var layerSpy = sinon.spy();
			map.on("mousemove", mapSpy);
			var layer = new L.Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on("mousemove", L.DomEvent.stopPropagation).on("mousemove", layerSpy);
			happen.mousemove(layer._path);
			expect(layerSpy.calledOnce).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it("mouseout is forwarded if fired on the original target", function () {
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			var layer = new L.Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			var other = new L.Polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			other.on("mouseout", otherSpy);
			happen.mouseout(layer._path, {relatedTarget: map._container});
			expect(mapSpy.called).not.to.be.ok();
			expect(otherSpy.called).not.to.be.ok();
			expect(layerSpy.calledOnce).to.be.ok();
		});

		it("mouseout is forwarded when using a DivIcon", function () {
			var icon = L.divIcon({
				html: "<p>this is text in a child element</p>",
				iconSize: [100, 100]
			});
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon: icon}).addTo(map);
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			happen.mouseout(layer._icon, {relatedTarget: map._container});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.calledOnce).to.be.ok();
		});

		it("mouseout is not forwarded if relatedTarget is a target's child", function () {
			var icon = L.divIcon({
				html: "<p>this is text in a child element</p>",
				iconSize: [100, 100]
			});
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon: icon}).addTo(map),
			    child = layer._icon.querySelector('p');
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			happen.mouseout(layer._icon, {relatedTarget: child});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.calledOnce).not.to.be.ok();
		});

		it("mouseout is not forwarded if fired on target's child", function () {
			var icon = L.divIcon({
				html: "<p>this is text in a child element</p>",
				iconSize: [100, 100]
			});
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon: icon}).addTo(map),
			    child = layer._icon.querySelector('p');
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			happen.mouseout(child, {relatedTarget: layer._icon});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.calledOnce).not.to.be.ok();
		});

		it("mouseout is not forwarded to layers if fired on the map", function () {
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			var layer = new L.Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			var other = new L.Polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			other.on("mouseout", otherSpy);
			happen.mouseout(map._container);
			expect(otherSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
			expect(mapSpy.calledOnce).to.be.ok();
		});

		it("preclick is fired before click on marker and map", function () {
			var called = 0;
			var layer = new L.Marker([1, 2]).addTo(map);
			layer.on("preclick", function (e) {
				expect(called++).to.eql(0);
				expect(e.latlng).to.ok();
			});
			layer.on("click", function (e) {
				expect(called++).to.eql(2);
				expect(e.latlng).to.ok();
			});
			map.on("preclick", function (e) {
				expect(called++).to.eql(1);
				expect(e.latlng).to.ok();
			});
			map.on("click", function (e) {
				expect(called++).to.eql(3);
				expect(e.latlng).to.ok();
			});
			happen.click(layer._icon);
		});

	});

	describe('#getScaleZoom && #getZoomScale', function () {
		it("converts zoom to scale and vice versa and returns the same values", function () {
			var toZoom = 6.25;
			var fromZoom = 8.5;
			var scale = map.getZoomScale(toZoom, fromZoom);
			expect(Math.round(map.getScaleZoom(scale, fromZoom) * 100) / 100).to.eql(toZoom);
		});

		it("converts scale to zoom and returns Infinity if map crs.zoom returns NaN", function () {
			var stub = sinon.stub(map.options.crs, "zoom");
			stub.returns(NaN);
			var scale = 0.25;
			var fromZoom = 8.5;
			expect(map.getScaleZoom(scale, fromZoom)).to.eql(Infinity);
			map.options.crs.zoom.restore();
		});
	});

	describe('#getZoom', function () {
		it("returns undefined if map not initialized", function () {
			expect(map.getZoom()).to.be(undefined);
		});

		it("returns undefined if map not initialized but layers added", function () {
			map.addLayer(L.tileLayer('file:///dev/null'));
			expect(map.getZoom()).to.be(undefined);
		});
	});
});
