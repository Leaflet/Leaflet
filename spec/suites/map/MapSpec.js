describe("Map", function () {
	var container,
	    map;

	beforeEach(function () {
		container = container = createContainer();
		map = L.map(container);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	describe("#remove", function () {
		var spy;

		beforeEach(function () {
			spy = sinon.spy();
		});

		it("fires an unload event if loaded", function () {
			map.setView([0, 0], 0);
			map.on("unload", spy);
			map.remove();
			map = null;
			expect(spy.called).to.be.ok();
		});

		it("fires no unload event if not loaded", function () {
			map.on("unload", spy);
			map.remove();
			map = null;
			expect(spy.called).not.to.be.ok();
		});

		describe("corner case checking", function () {
			it("throws an exception upon reinitialization", function () {
				expect(L.map).withArgs(container)
				  .to.throwException("Map container is already initialized.");
			});

			it("throws an exception if a container is not found", function () {
				expect(L.map).withArgs("nonexistentdivelement")
				  .to.throwException("Map container not found.");
			});
		});

		it("undefines container._leaflet_id", function () {
			expect(container._leaflet_id).to.be.ok();
			map.remove();
			map = null;
			expect(container._leaflet_id).to.be(undefined);
		});

		it("unbinds events", function () {
			// before actual test: make sure that events are ok
			map.setView([0, 0], 0);
			map.on("click", spy);
			happen.click(container);
			expect(spy.called).to.be.ok();

			// actual test
			spy = sinon.spy();
			map.on("click dblclick mousedown mouseup mousemove", spy);
			map.remove();
			map = null;

			happen.click(container);
			happen.dblclick(container);
			happen.mousedown(container);
			happen.mouseup(container);
			happen.mousemove(container);

			expect(spy.called).to.not.be.ok();
		});

		it("does not throw if removed during animation", function () {
			map.setView([0, 0], 1).setMaxBounds([[0, 1], [2, 3]]);

			// Force creation of animation proxy,
			// otherwise browser checks disable it
			map._createAnimProxy();

			// #6775 Remove the map in the middle of the animation
			map.on("zoom", map.remove.bind(map));
			map.setZoom(2);
		});

		it("throws error if container is reused by other instance", function () {
			map.remove();
			var map2 = L.map(container);

			expect(function () {
				map.remove();
			}).to.throwException();

			map2.remove(); // clean up
			map = null;
		});
	});

	describe("#getCenter", function () {
		it("throws if not set before", function () {
			expect(function () {
				map.getCenter();
			}).to.throwError();
		});

		it("returns a precise center when zoomed in after being set (#426)", function () {
			var center = L.latLng(10, 10);
			map.setView(center, 1);
			map.setZoom(19);
			expect(map.getCenter()).to.eql(center);
		});

		it("returns correct center after invalidateSize (#1919)", function () {
			var center = L.latLng(10, 10);
			map.setView(center, 1);
			map.invalidateSize();
			expect(map.getCenter()).not.to.eql(center);
		});

		it("returns a new object that can be mutated without affecting the map", function () {
			map.setView([10, 10], 1);
			var center = map.getCenter();
			center.lat += 10;
			expect(map.getCenter()).to.eql(L.latLng(10, 10));
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
			var map = L.map(document.createElement("div"), {zoom: 13});
			var zoom = map.setView([51.605, -0.11]).getZoom();
			map.remove(); // clean up
			expect(zoom).to.be(13);
		});

		it("passes duration option to panBy", function () {
			var map = L.map(document.createElement("div"), {zoom: 13, center: [0, 0]});
			map.panBy = sinon.spy();
			map.setView([51.605, -0.11], 13, {animate: true, duration: 13});
			map.remove(); // clean up
			expect(map.panBy.callCount).to.eql(1);
			expect(map.panBy.args[0][1].duration).to.eql(13);
		});

		it("prevents firing movestart noMoveStart", function (done) {
			var movestartSpy = sinon.spy();
			map.on("movestart", movestartSpy);
			var moveendSpy = sinon.spy();
			map.on("moveend", moveendSpy);

			map.setView([51.505, -0.09], 13, {pan: {noMoveStart: true}});

			setTimeout(function () {
				expect(movestartSpy.notCalled).to.eql(true);
				expect(moveendSpy.calledOnce).to.eql(true);
				done();
			}, 100);
		});
	});

	describe("#setZoom", function () {
		describe("when the map has not yet been loaded", function () {
			it("set zoom level is not limited by max zoom", function () {
				map.options.maxZoom = 10;
				map.setZoom(15);

				expect(map.getZoom()).to.be(15);
			});

			it("overwrites zoom passed as map option", function () {
				var map2 = L.map(document.createElement("div"), {zoom: 13});
				map2.setZoom(15);
				var zoom = map2.getZoom();

				map2.remove(); // clean up
				expect(zoom).to.be(15);
			});
		});

		describe("when the map has been loaded", function () {
			beforeEach(function () {
				map.setView([0, 0], 0); // loads map
			});

			it("set zoom level is limited by max zoom", function () {
				map.options.maxZoom = 10;
				map.setZoom(15);

				expect(map.getZoom()).to.be(10);
			});

			it("does not overwrite zoom passed as map option", function () {
				var map2 = L.map(document.createElement("div"), {zoom: 13});
				map2.setView([0, 0]);
				map2.setZoom(15);
				var zoom = map2.getZoom();

				map2.remove(); // clean up
				expect(zoom).to.be(13);
			});
		});

		it("changes previous zoom level", function () {
			map.zoom = 10;
			map.setZoom(15);

			expect(map.getZoom()).to.be(15);
		});

		it("can be passed without a zoom specified and keep previous zoom", function () {
			var prevZoom = map.getZoom();
			map.setZoom();

			expect(map.getZoom()).to.be(prevZoom);
		});

		it("can be passed with a zoom level of undefined and keep previous zoom", function () {
			var prevZoom = map.getZoom();
			map.setZoom(undefined);

			expect(map.getZoom()).to.be(prevZoom);
		});

		it("can be passed with a zoom level of infinity", function () {
			map.setZoom(Infinity);

			expect(map.getZoom()).to.be(Infinity);
		});
	});

	describe("#setZoomAround", function () {
		beforeEach(function () {
			map.setView([0, 0], 0); // loads map
		});

		it("pass Point and change pixel in view", function () {
			var point = L.point(5, 5);
			map.setZoomAround(point, 5);

			expect(map.getBounds().contains(map.options.crs.pointToLatLng(point, 5))).to.be(false);
		});

		it("pass Point and change pixel in view at high zoom", function () {
			var point = L.point(5, 5);
			map.setZoomAround(point, 18);

			expect(map.getBounds().contains(map.options.crs.pointToLatLng(point, 18))).to.be(false);
		});

		it("pass latLng and keep specified latLng in view", function () {
			map.setZoomAround([5, 5], 5);

			expect(map.getBounds().contains([5, 5])).to.be(true);
		});

		it("pass latLng and keep specified latLng in view at high zoom fails", function () {
			map.setZoomAround([5, 5], 12); // usually fails around 9 zoom level

			expect(map.getBounds().contains([5, 5])).to.be(false);
		});

		it("throws if map is not loaded", function () {
			var unloadedMap = L.map(document.createElement("div"));

			expect(unloadedMap.setZoomAround).withArgs([5, 5], 4).to.throwException();
		});

		it("throws if zoom is empty", function () {
			expect(map.setZoomAround).withArgs([5, 5]).to.throwException();
		});

		it("throws if zoom is undefined", function () {
			expect(map.setZoomAround).withArgs([5, 5], undefined).to.throwException();
		});

		it("throws if latLng is undefined", function () {
			expect(map.setZoomAround).withArgs([undefined, undefined], 4).to.throwException();
		});

		it("does not throw if latLng is infinity", function () {
			map.setView([5, 5]);
			map.setZoomAround([Infinity, Infinity], 4);

			expect(map.getCenter()).to.be.ok();
		});
	});

	describe("#getBounds", function () {
		it("is safe to call from within a moveend callback during initial load (#1027)", function () {
			var map = L.map(document.createElement("div"));
			map.on("moveend", function () {
				map.getBounds();
			});
			map.setView([51.505, -0.09], 13);
			map.remove(); // clean up
		});
	});

	describe("#getBoundsZoom", function () {
		var halfLength = 0.00025;
		var bounds = [[-halfLength, -halfLength], [halfLength, halfLength]];
		var wideBounds = [[-halfLength, -halfLength * 10], [halfLength, halfLength * 10]];
		var padding = [100, 100];
		var height = "400px";

		it("returns high levels of zoom with small areas and big padding", function () {
			container.style.height = height;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19);
		});

		it.skipIfNo3d("returns multiples of zoomSnap when zoomSnap > 0 on any3d browsers", function () {
			container.style.height = height;
			map.options.zoomSnap = 0.5;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19.5);
			map.options.zoomSnap = 0.2;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19.6);
			map.options.zoomSnap = 0;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.within(19.6864560, 19.6864561);
		});

		it("getBoundsZoom does not return Infinity when projected SE - NW has negative components", function () {
			container.style.height = '';
			container.style.width = '';
			map.setZoom(16);
			var bounds = L.latLngBounds(
				[62.18475569507688, 6.926335173954951],
				[62.140483526511694, 6.923933370740089]);
			var padding = L.point(-50, -50);

			// control case: default crs
			var boundsZoom = map.getBoundsZoom(bounds, false, padding);
			expect(boundsZoom).to.eql(9);

			// test case: EPSG:25833 (mocked, for simplicity)
			// The following coordinates are bounds projected with proj4leaflet crs = EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs
			var crsMock = sinon.mock(map.options.crs);
			crsMock.expects("latLngToPoint")
				.withExactArgs(bounds.getNorthWest(), 16)
				.returns(L.point(7800503.059925064, 6440062.353052008));
			crsMock.expects("latLngToPoint")
				.withExactArgs(bounds.getSouthEast(), 16)
				.returns(L.point(7801987.203481699, 6425186.447901004));
			boundsZoom = map.getBoundsZoom(bounds, false, padding);
			crsMock.restore();

			crsMock.verify(); // ensure that latLngToPoint was called with expected args
			expect(boundsZoom).to.eql(7); // result expected for EPSG:25833
		});

		it("respects the 'inside' parameter", function () {
			container.style.height = height;
			container.style.width = "1024px"; // Make sure the width is defined for browsers other than PhantomJS (in particular Firefox).
			expect(map.getBoundsZoom(wideBounds, false, padding)).to.be.equal(17);
			expect(map.getBoundsZoom(wideBounds, true, padding)).to.be.equal(20);
		});
	});

	describe("#setMaxBounds", function () {
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

		it("remove listeners when called without arguments", function (done) {
			L.tileLayer("", {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = "500px";
			var bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			map.setMaxBounds();
			// set view outside
			var center = L.latLng([0, 0]);
			map.once("moveend", function () {
				expect(center.equals(map.getCenter())).to.be(true);
				done();
			});
			map.setView(center, 18, {animate: false});
		});

		it("does not try to remove listeners if it wasn't set before", function () {
			L.tileLayer("", {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = "500px";
			var bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.off = sinon.spy();
			map.setMaxBounds(bounds, {animate: false});
			expect(map.off.called).not.to.be.ok();
		});
	});

	describe("#setMinZoom and #setMaxZoom", function () {
		describe("when map is not loaded", function () {
			it("change min and max zoom but not zoom", function () {
				map.setZoom(2);
				map.setMinZoom(3);

				expect(map.getZoom()).to.eql(2);
				expect(map.getMinZoom()).to.eql(3);

				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
			});

			it("do not fire 'zoomlevelschange'", function () {
				var spy = sinon.spy();
				map.on("zoomlevelschange", spy);

				map.setZoom(5);
				map.setMinZoom(3);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(5);
				expect(map.getMinZoom()).to.eql(3);
				expect(map.getMaxZoom()).to.eql(7);

				expect(spy.called).to.not.be.ok();
			});
		});

		describe("when map is loaded", function () {
			var spy;

			beforeEach(function () {
				map.setView([0, 0], 4); // loads map

				spy = sinon.spy();
				map.on("zoomlevelschange", spy);
			});

			it("do not fire 'zoomlevelschange' if zoom level did not change", function () {
				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(4);
				expect(map.getMinZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
				expect(spy.calledTwice).to.be.ok();

				var postSpy = sinon.spy();
				map.on("zoomlevelschange", postSpy);

				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(postSpy.called).to.not.be.ok();
			});

			it("fire 'zoomlevelschange' but do not change zoom if max/min zoom is less/more current zoom", function () {
				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(4);
				expect(map.getMinZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
				expect(spy.calledTwice).to.be.ok();
			});
		});

		it("reset min/max zoom if set to undefined or missing param", function () {
			map.setMinZoom(undefined);
			map.setMaxZoom();

			expect(map.options.minZoom).to.be(undefined);
			expect(map.options.maxZoom).to.be(undefined);

			expect(map.getMinZoom()).to.be(0); // min layer zoom used instead
			expect(map.getMaxZoom()).to.be(Infinity); // max layer zoom used instead
		});

		it("allow infinity to be passed", function () {
			map.setMinZoom(Infinity);
			map.setMaxZoom(Infinity);

			expect(map.getMinZoom()).to.be(Infinity);
			expect(map.getMaxZoom()).to.be(Infinity);
		});
	});

	describe("#getMinZoom and #getMaxZoom", function () {
		describe("#getMinZoom", function () {
			it("returns 0 if not set by Map options or TileLayer options", function () {
				expect(map.getMinZoom()).to.be(0);
			});
		});

		it("minZoom and maxZoom options overrides any minZoom and maxZoom set on layers", function () {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {minZoom: 2, maxZoom: 20});

			L.tileLayer("", {minZoom: 4, maxZoom: 10}).addTo(map);
			L.tileLayer("", {minZoom: 6, maxZoom: 17}).addTo(map);
			L.tileLayer("", {minZoom: 0, maxZoom: 22}).addTo(map);

			expect(map.getMinZoom()).to.be(2);
			expect(map.getMaxZoom()).to.be(20);
		});

		it("layer minZoom overrides map zoom if map has no minZoom set and layer minZoom is bigger than map zoom", function () {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 10});

			L.tileLayer("", {minZoom: 15}).addTo(map);

			expect(map.getMinZoom()).to.be(15);
		});

		it("layer maxZoom overrides map zoom if map has no maxZoom set and layer maxZoom is smaller than map zoom", function () {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 20});

			L.tileLayer("", {maxZoom: 15}).addTo(map);

			expect(map.getMaxZoom()).to.be(15);
		});

		it("map's zoom is adjusted to layer's minZoom even if initialized with smaller value", function () {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 10});

			L.tileLayer("", {minZoom: 15}).addTo(map);

			expect(map.getZoom()).to.be(15);
		});

		it("map's zoom is adjusted to layer's maxZoom even if initialized with larger value", function () {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 20});

			L.tileLayer("", {maxZoom: 15}).addTo(map);

			expect(map.getZoom()).to.be(15);
		});
	});

	describe("createPane", function () {
		it("create a new pane to mapPane when container not specified", function () {
			map.createPane('controlPane');

			expect(map.getPane('controlPane').className).to.eql('leaflet-pane leaflet-control-pane');
		});

		it("create a new pane to container specified", function () {
			map.createPane('controlPane', map.getPane('tooltipPane'));

			expect(map.getPane('controlPane').parentElement.className).to.eql(
				'leaflet-pane leaflet-tooltip-pane');
		});

		it("create a new pane to mapPane when container is invalid", function () {
			map.createPane('controlPane', undefined);

			expect(map.getPane('controlPane').parentElement.className).to.eql(
				'leaflet-pane leaflet-map-pane');
		});

		it("replace same named pane", function () {
			var overlayPane = map.getPane('overlayPane');

			map.createPane('overlayPane');

			expect(map.getPane('overlayPane')).to.not.be(overlayPane);
		});
	});

	describe("#getPane", function () {
		it("return pane by String", function () {
			expect(map.getPane('tilePane').className).to.eql('leaflet-pane leaflet-tile-pane');
		});

		it("return pane by pane", function () {

			expect(map.getPane(map.getPanes()['shadowPane']).className).to.eql(
				'leaflet-pane leaflet-shadow-pane');
		});

		it("return empty pane when not found", function () {
			expect(map.getPane('foo bar')).to.eql(undefined);
		});
	});

	describe("#getPanes", function () {
		it("return all default panes", function () {
			var keys = Object.keys(map.getPanes());

			expect(keys).to.eql(
				['mapPane', 'tilePane', 'overlayPane', 'shadowPane', 'markerPane', 'tooltipPane', 'popupPane']);
		});

		it("return empty pane when map deleted", function () {
			var map2 = L.map(document.createElement('div'));
			map2.remove();

			expect(map2.getPanes()).to.eql({});
		});
	});

	describe("#getContainer", function () {
		it("return container object", function () {
			expect(map.getContainer()._leaflet_id).to.be.ok();
		});

		it("return undefined on empty container id", function () {
			var container2 = createContainer();
			var map2 = L.map(container2);
			map2.remove(); // clean up

			expect(map2.getContainer()._leaflet_id).to.eql(undefined);
		});
	});

	describe("#getSize", function () {
		it("return map size in pixels", function () {
			expect(map.getSize()).to.eql(L.point([400, 400]));
		});

		it("return map size if not specified", function () {
			var map2 = L.map(document.createElement("div"));

			expect(map2.getSize()).to.eql(L.point([0, 0]));

			map2.remove(); // clean up
		});

		it("return map size if 0x0 pixels", function () {
			container.style.width = "0px";
			container.style.height = "0px";

			expect(map.getSize()).to.eql(L.point([0, 0]));
		});

		it("return new pixels on change", function () {
			container.style.width = "300px";

			expect(map.getSize()).to.eql(L.point([300, 400]));
		});

		it("return clone of size object from map", function () {
			expect(map.getSize()).to.not.be(map._size);
		});

		it("return previous size on empty map", function () {
			var container2 = createContainer();
			var map2 = L.map(container2);

			map2.remove(); // clean up

			expect(map2.getSize()).to.eql(L.point([400, 400]));
		});
	});

	describe("#getPixelBounds", function () {
		beforeEach(function () {
			map.setView([0, 0], 0); // load map
		});

		it("return map bounds in pixels", function () {
			expect(map.getPixelBounds()).to.eql(L.bounds([-72, -72], [328, 328]));
		});

		it("return changed map bounds if really zoomed in", function () {
			map.setZoom(20);

			expect(map.getPixelBounds()).to.eql(L.bounds([134217528, 134217528], [134217928, 134217928]));
		});

		it("return new pixels on view change", function () {
			map.setView([50, 50], 5);

			expect(map.getPixelBounds()).to.eql(L.bounds([5034, 2578], [5434, 2978]));
		});

		it("throw error if center and zoom were not set / map not loaded", function () {
			var container2 = createContainer();
			var map2 = L.map(container2);

			expect(map2.getPixelBounds).to.throwException();

			map2.remove(); // clean up
		});
	});

	describe("#getPixelOrigin", function () {
		beforeEach(function () {
			map.setView([0, 0], 0); // load map
		});

		it("return pixel origin", function () {
			expect(map.getPixelOrigin()).to.eql(L.point([-72, -72]));
		});

		it("return new pixels on view change", function () {
			map.setView([50, 50], 5);

			expect(map.getPixelOrigin()).to.eql(L.point([5034, 2578]));
		});

		it("return changed map bounds if really zoomed in", function () {
			map.setZoom(20);

			expect(map.getPixelOrigin()).to.eql(L.point([134217528, 134217528]));
		});

		it("throw error if center and zoom were not set / map not loaded", function () {
			var container2 = createContainer();
			var map2 = L.map(container2);

			expect(map2.getPixelOrigin).to.throwException();

			map2.remove(); // clean up
		});
	});

	describe("#getPixelWorldBounds", function () {
		it("return map bounds in pixels", function () {
			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[5.551115123125783e-17, 5.551115123125783e-17], [1, 1]));
		});

		it("return changed map bounds if really zoomed in", function () {
			map.setZoom(20);

			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[1.4901161193847656e-8, 1.4901161193847656e-8], [268435456, 268435456]));
		});

		it("return new pixels on zoom change", function () {
			map.setZoom(5);

			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[4.547473508864641e-13, 4.547473508864641e-13], [8192, 8192]));

			map.setView([0, 0]);

			// view does not change pixel world bounds
			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[4.547473508864641e-13, 4.547473508864641e-13], [8192, 8192]));
		});

		it("return infinity bounds on infinity zoom", function () {
			map.setZoom(Infinity);

			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[Infinity, Infinity], [Infinity, Infinity]));
		});
	});

	describe("#hasLayer", function () {
		it("throws when called without proper argument", function () {
			var hasLayer = L.Util.bind(map.hasLayer, map);
			expect(hasLayer).withArgs(new L.Layer()).to.not.throwException(); // control case

			expect(hasLayer).withArgs(undefined).to.throwException();
			expect(hasLayer).withArgs(null).to.throwException();
			expect(hasLayer).withArgs(false).to.throwException();
			expect(hasLayer).to.throwException();
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
			map.on("layeradd", spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it("fires a layeradd event when the map becomes ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on("layeradd", spy);
			map.addLayer(layer);
			expect(spy.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(spy.called).to.be.ok();
		});

		it("does not fire a layeradd event if the layer is removed before the map becomes ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on("layeradd", spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(spy.called).not.to.be.ok();
		});

		it("adds the layer before firing layeradd", function (done) {
			var layer = layerSpy();
			map.on("layeradd", function () {
				expect(map.hasLayer(layer)).to.be.ok();
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
		});

		it("throws if adding something which is not a layer", function () {
			var control = L.control.layers();
			expect(function () {
				map.addLayer(control);
			}).to.throwError();
		});

		describe("When the first layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				var spy = sinon.spy();
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a new layer with greater zoomlevel coverage than the current layer is added to a map", function () {
			it("fires a zoomlevelschange event", function () {
				var spy = sinon.spy();
				L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("", {minZoom: 0, maxZoom: 15}).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map", function () {
			it("fires no zoomlevelschange event", function () {
				var spy = sinon.spy();
				L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).not.to.be.ok();
				L.tileLayer("", {minZoom: 0, maxZoom: 5}).addTo(map);
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
			map.on("layerremove", spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it("does not fire a layerremove if the layer was not added", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on("layerremove", spy);
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it("does not fire a layerremove if the map is not ready", function () {
			var layer = layerSpy(),
			    spy = sinon.spy();
			map.on("layerremove", spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it("removes the layer before firing layerremove", function (done) {
			var layer = layerSpy();
			map.on("layerremove", function () {
				expect(map.hasLayer(layer)).not.to.be.ok();
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it("supports adding and removing a tile layer without initializing the map", function () {
			var layer = L.tileLayer("");
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
				map.setView([0, 0], 0);
				var spy = sinon.spy();
				var tl = L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map);

				map.on("zoomlevelschange", spy);
				expect(spy.called).not.to.be.ok();
				map.removeLayer(tl);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer", function () {
			it("fires a zoomlevelschange event", function () {
				map.setView([0, 0], 0);
				L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map);
				var spy = sinon.spy(),
				    t2 = L.tileLayer("", {minZoom: 0, maxZoom: 15}).addTo(map);

				map.on("zoomlevelschange", spy);
				expect(spy.called).to.not.be.ok();
				map.removeLayer(t2);
				expect(spy.called).to.be.ok();
			});
		});

		describe("when a tile layer is removed from a map it and it had lesser or the same zoom level coverage as the remainding layer(s)", function () {
			it("fires no zoomlevelschange event", function () {
				map.setView([0, 0], 0);
				var spy = sinon.spy(),
				    t1 = L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map),
				    t2 = L.tileLayer("", {minZoom: 0, maxZoom: 10}).addTo(map),
				    t3 = L.tileLayer("", {minZoom: 0, maxZoom: 5}).addTo(map);

				map.on("zoomlevelschange", spy);
				map.removeLayer(t2);
				expect(spy.called).to.not.be.ok();
				map.removeLayer(t3);
				expect(spy.called).to.not.be.ok();
				map.removeLayer(t1);
				expect(spy.called).to.be.ok();
			});
		});
	});

	describe("#eachLayer", function () {
		it("returns self", function () {
			expect(map.eachLayer(L.Util.falseFn)).to.be(map);
		});

		it("calls the provided function for each layer", function () {
			var t1 = L.tileLayer("").addTo(map),
			    t2 = L.tileLayer("").addTo(map),
			    spy = sinon.spy();

			map.eachLayer(spy);

			expect(spy.callCount).to.eql(2);
			expect(spy.firstCall.args).to.eql([t1]);
			expect(spy.secondCall.args).to.eql([t2]);
		});

		it("calls the provided function with the provided context", function () {
			var spy = sinon.spy();
			L.tileLayer("").addTo(map);

			map.eachLayer(spy, map);

			expect(spy.alwaysCalledOn(map)).to.be.ok();
		});
	});

	describe("#invalidateSize", function () {
		var origWidth = 100,
		    clock;

		beforeEach(function () {
			container.style.height = "100px";
			container.style.width = origWidth + "px";
			map.setView([0, 0], 0);
			map.invalidateSize({pan: false});
			clock = sinon.useFakeTimers();
		});

		afterEach(function () {
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

		it("correctly adjusts for new container size when view is set during map initialization (#6165)", function () {
			// Use a newly initialized map
			map.remove();

			var center = [0, 0];

			// The edge case is only if view is set directly during map initialization
			map = L.map(container, {
				center: center,
				zoom: 0
			});

			// Change the container size
			container.style.width = "600px";

			// The map should not be aware yet of container size change,
			// otherwise the next invalidateSize will not be able to
			// compute the size difference
			expect(map.getSize().x).to.equal(100);
			expect(map.latLngToContainerPoint(center).x).to.equal(50);

			// Now notifying the map that the container size has changed,
			// it should return new values and correctly position coordinates
			map.invalidateSize();

			expect(map.getSize().x).to.equal(600);
			expect(map.latLngToContainerPoint(center).x).to.equal(300);
		});
	});

	describe("#flyTo", function () {
		beforeEach(function () {
			container.style.width = "800px";
			container.style.height = "600px";
			container.style.visibility = "hidden";
		});

		it("move to requested center and zoom, and call zoomend once", function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			var newCenter = L.latLng(10, 11),
			    newZoom = 12;
			var callback = function () {
				expect(map.getCenter()).to.eql(newCenter);
				expect(map.getZoom()).to.eql(newZoom);
				done();
			};
			map.setView([0, 0], 0);
			map.on("zoomend", callback).flyTo(newCenter, newZoom);
		});

		it("flyTo start latlng == end latlng", function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			var dc = L.latLng(38.91, -77.04);
			map.setView(dc, 14);

			map.on("zoomend", function () {
				expect(map.getCenter()).to.eql(dc);
				expect(map.getZoom()).to.eql(4);
				done();
			});

			map.flyTo(dc, 4);
		});
	});

	describe("#zoomIn and #zoomOut", function () {
		var center = L.latLng(22, 33);
		beforeEach(function () {
			map.setView(center, 10);
		});

		it("zoomIn zooms by 1 zoom level by default", function (done) {
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(11);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it("zoomOut zooms by 1 zoom level by default", function (done) {
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(9);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(null, {animate: false});
		});

		it.skipIf3d("zoomIn ignores the zoomDelta option on non-any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(11);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it.skipIfNo3d("zoomIn respects the zoomDelta option on any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.setView(center, 10);
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it.skipIfNo3d("zoomOut respects the zoomDelta option on any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.setView(center, 10);
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(9.75);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(null, {animate: false});
		});

		it.skipIfNo3d("zoomIn snaps to zoomSnap on any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(0.22, {animate: false});
		});

		it.skipIfNo3d("zoomOut snaps to zoomSnap on any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(9.75);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(0.22, {animate: false});
		});
	});

	describe("#_getBoundsCenterZoom", function () {
		var center = L.latLng(50.5, 30.51);

		it("Returns valid center on empty bounds in unitialized map", function () {
			// Edge case from #5153
			var centerAndZoom = map._getBoundsCenterZoom([center, center]);
			expect(centerAndZoom.center).to.eql(center);
			expect(centerAndZoom.zoom).to.eql(Infinity);
		});
	});

	describe("#fitBounds", function () {
		var center = L.latLng(50.5, 30.51),
		    bounds = L.latLngBounds(L.latLng(1, 102), L.latLng(11, 122)),
		    boundsCenter = bounds.getCenter();

		beforeEach(function () {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = "100px";
			map.setView(center, 15);
		});

		it("Snaps zoom level to integer by default", function (done) {
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it.skipIfNo3d("Snaps zoom to zoomSnap on any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(2.75);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it.skipIf3d("Ignores zoomSnap on non-any3d browsers", function (done) {
			map.options.zoomSnap = 0.25;
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it("can be called with an array", function (done) {
			map.once("zoomend", function () {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			var bounds = [[1, 102], [11, 122]];
			map.fitBounds(bounds, {animate: false});
		});

		it("throws an error with invalid bounds", function () {
			expect(function () {
				map.fitBounds(NaN);
			}).to.throwError();
		});

		it("Fits to same scale and zoom", function (done) {
			var bounds = map.getBounds(),
			    zoom = map.getZoom();
			map.once("moveend zoomend", function () {
				var newBounds = map.getBounds();
				expect(newBounds.getSouthWest()).to.nearLatLng(bounds.getSouthWest());
				expect(newBounds.getNorthEast()).to.nearLatLng(bounds.getNorthEast());
				expect(map.getZoom()).to.eql(zoom);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it("Fits to small bounds from small zoom", function (done) {
			map.once("zoomend", function () {
				map.once("zoomend", function () {
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

		it("Fits to large bounds from large zoom", function (done) {
			map.once("zoomend", function () {
				map.once("zoomend", function () {
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

	describe("#fitBounds after layers set", function () {
		var center = L.latLng(22, 33),
		    bounds = L.latLngBounds(L.latLng(1, 102), L.latLng(11, 122));

		beforeEach(function () {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = "100px";
		});

		it("Snaps to a number after adding tile layer", function () {
			// expect(L.Browser.any3d).to.be.ok(); // precondition
			map.addLayer(L.tileLayer(""));
			expect(map.getZoom()).to.be(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.be(2);
		});

		it("Snaps to a number after adding marker", function () {
			// expect(L.Browser.any3d).to.be.ok(); // precondition
			map.addLayer(L.marker(center));
			expect(map.getZoom()).to.be(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.be(2);
		});

	});

	describe("#fitWorld", function () {
		var bounds = L.latLngBounds([90, -180], [-90, 180]),
		boundsCenter = bounds.getCenter();


		beforeEach(function () {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = "100px";
		});

		it("map zooms out to max view with default settings", function () {
			map.setZoom(5);
			map.fitWorld();

			expect(map.getZoom()).to.eql(0);
			expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
		});
	});

	describe("#panInside", function () {
		var center,
		    tl,
		    tlPix;

		beforeEach(function () {
			container.style.height = container.style.width = "500px";
			map.setView(L.latLng([53.0, 0.15]), 12, {animate: false});
			center = map.getCenter().clone();
			tl = map.getBounds().getNorthWest();
			tlPix = map.getPixelBounds().min;
		});

		it("does not pan the map when the target is within bounds", function () {
			map.panInside(tl, {animate:false});
			expect(center).to.eql(map.getCenter());
		});

		it("pans the map when padding is provided and the target is within the border area", function () {
			var padding = [40, 20],
			    p = tlPix.add([30, 0]),	// Top-left
			    distanceMoved;
			map.panInside(map.unproject(p), {padding: padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([-10, -20]))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().max.x - 10, map.getPixelBounds().min.y];	// Top-right
			map.panInside(map.unproject(p), {padding: padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([30, -20]))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().min.x + 35, map.getPixelBounds().max.y];	// Bottom-left
			map.panInside(map.unproject(p), {padding: padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([-5, 20]))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().max.x - 15, map.getPixelBounds().max.y]; // Bottom-right
			map.panInside(map.unproject(p), {padding: padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([25, 20]))).to.eql(true);
		});

		it("supports different padding values for each border", function () {
			var p = tlPix.add([40, 0]),	// Top-Left
			    opts = {paddingTL: [60, 20], paddingBR: [10, 10], animate: false};
			map.panInside(map.unproject(p), opts);
			expect(center).to.eql(map.getCenter());

			var br = map.getPixelBounds().max;	// Bottom-Right
			map.panInside(map.unproject(L.point(br.x + 20, br.y)), opts);
			expect(center).to.not.eql(map.getCenter());
		});

		it("pans on both X and Y axes when the target is outside of the view area and both the point's coords are outside the bounds", function () {
			var p = map.unproject(tlPix.subtract([200, 200]));
			map.panInside(p, {animate: false});
			expect(map.getBounds().contains(p)).to.be(true);
			expect(map.getCenter().lng).to.not.eql(center.lng);
			expect(map.getCenter().lat).to.not.eql(center.lat);
		});

		it("pans only on the Y axis when the target's X coord is within bounds but the Y is not", function () {
			var p = L.latLng(tl.lat + 5, tl.lng);
			map.panInside(p, {animate: false});
			expect(map.getBounds().contains(p)).to.be(true);
			var dx = Math.abs(map.getCenter().lng - center.lng);
			expect(dx).to.be.lessThan(1.0E-9);
			expect(map.getCenter().lat).to.not.eql(center.lat);
		});

		it("pans only on the X axis when the target's Y coord is within bounds but the X is not", function () {
			var p = L.latLng(tl.lat, tl.lng - 5);
			map.panInside(p, 0, {animate: false});
			expect(map.getBounds().contains(p)).to.be(true);
			expect(map.getCenter().lng).to.not.eql(center.lng);
			var dy = map.getCenter().lat - center.lat;
			expect(dy).to.be.lessThan(1.0E-9);
		});

		it("pans correctly when padding takes up more than half the display bounds", function () {
			var oldCenter = map.project(center);
			var targetOffset = L.point(0, -5); // arbitrary point above center
			var target = oldCenter.add(targetOffset);
			var paddingOffset = L.point(0, 15);
			var padding = map.getSize().divideBy(2) // half size
			  .add(paddingOffset); // padding more than half the display bounds (replicates issue #7445)
			map.panInside(map.unproject(target), {paddingBottomRight: [0, padding.y], animate: false});
			var offset = map.project(map.getCenter()).subtract(oldCenter); // distance moved during the pan
			var result = paddingOffset.add(targetOffset).subtract(offset);
			expect(result.trunc()).to.eql(L.point(0, 0));
		});
	});

	describe("#DOM events", function () {
		beforeEach(function () {
			map.setView([0, 0], 0);
		});

		it("DOM events propagate from polygon to map", function () {
			var spy = sinon.spy();
			map.on("mousemove", spy);
			var layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			happen.mousemove(layer._path);
			expect(spy.calledOnce).to.be.ok();
		});

		it("DOM events propagate from marker to map", function () {
			var spy = sinon.spy();
			map.on("mousemove", spy);
			var layer = L.marker([1, 2]).addTo(map);
			happen.mousemove(layer._icon);
			expect(spy.calledOnce).to.be.ok();
		});

		it("DOM events fired on marker can be cancelled before being caught by the map", function () {
			var mapSpy = sinon.spy();
			var layerSpy = sinon.spy();
			map.on("mousemove", mapSpy);
			var layer = L.marker([1, 2]).addTo(map);
			layer.on("mousemove", L.DomEvent.stopPropagation).on("mousemove", layerSpy);
			happen.mousemove(layer._icon);
			expect(layerSpy.calledOnce).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it("DOM events fired on polygon can be cancelled before being caught by the map", function () {
			var mapSpy = sinon.spy();
			var layerSpy = sinon.spy();
			map.on("mousemove", mapSpy);
			var layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on("mousemove", L.DomEvent.stopPropagation).on("mousemove", layerSpy);
			happen.mousemove(layer._path);
			expect(layerSpy.calledOnce).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it("mouseout is forwarded if fired on the original target", function () {
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			var layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			var other = L.polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			other.on("mouseout", otherSpy);
			happen.mouseout(layer._path, {relatedTarget: container});
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
			happen.mouseout(layer._icon, {relatedTarget: container});
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
			    child = layer._icon.querySelector("p");
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			happen.mouseout(layer._icon, {relatedTarget: child});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
		});

		it("mouseout is not forwarded if fired on target's child", function () {
			var icon = L.divIcon({
				html: "<p>this is text in a child element</p>",
				iconSize: [100, 100]
			});
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon: icon}).addTo(map),
			    child = layer._icon.querySelector("p");
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			happen.mouseout(child, {relatedTarget: layer._icon});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
		});

		it("mouseout is not forwarded to layers if fired on the map", function () {
			var mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			var layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			var other = L.polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on("mouseout", mapSpy);
			layer.on("mouseout", layerSpy);
			other.on("mouseout", otherSpy);
			happen.mouseout(container);
			expect(otherSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
			expect(mapSpy.calledOnce).to.be.ok();
		});

		it("preclick is fired before click on marker and map", function () {
			var called = 0;
			var layer = L.marker([1, 2], {bubblingMouseEvents: true}).addTo(map);
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
			expect(called).to.eql(4);
		});

		it("prevents default action of contextmenu if there is any listener", function () {
			if (!L.Browser.canvas) { this.skip(); }

			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {
				renderer: L.canvas(),
				center: [0, 0],
				zoom: 0
			});

			container.style.width = container.style.height = '300px';

			map.setView(L.latLng([0, 0]), 12);
			var spy = sinon.spy();
			map.on('contextmenu', function (e) {
				spy(e.originalEvent.defaultPrevented);
			});
			var marker = L.circleMarker([0, 0]).addTo(map);

			happen.at('contextmenu', 0, 0); // first

			happen.at('contextmenu', marker._point.x, marker._point.y); // second  (#5995)

			expect(spy.callCount).to.be(2);
			expect(spy.firstCall.lastArg).to.be.ok();
			expect(spy.secondCall.lastArg).to.be.ok();
		});
	});

	describe("#getScaleZoom && #getZoomScale", function () {
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

	describe("#getZoom", function () {
		it("returns undefined if map not initialized", function () {
			expect(map.getZoom()).to.be(undefined);
		});

		it("returns undefined if map not initialized but layers added", function () {
			map.addLayer(L.tileLayer(""));
			expect(map.getZoom()).to.be(undefined);
		});
	});

	describe("#Geolocation", function () {
		it("doesn't throw error if location is found and map is not existing", function () {
			var fn = L.Util.bind(map._handleGeolocationResponse, map);
			map.remove();
			map = null;
			expect(function () {
				fn({coords: {latitude: 40.415296, longitude: 10.7419264, accuracy: 1129.5646101470752}});
			}).to.not.throwException();
		});
		it("doesn't throw error if location is not found and map is not existing", function () {
			map._locateOptions = {setView: true};
			var fn = L.Util.bind(map._handleGeolocationError, map);
			map.remove();
			map = null;
			expect(function () {
				fn({coords: {latitude: 40.415296, longitude: 10.7419264, accuracy: 1129.5646101470752}});
			}).to.not.throwException();
		});
	});

	describe('#disableClickPropagation', function () {
		it('does not break if element is not in the DOM anymore', function () {
			map.setView([0, 0], 0);
			var parent = document.createElement('div');
			var child = document.createElement('div');
			parent.appendChild(child);
			container.appendChild(parent);
			L.DomEvent.on(child, 'click', function () {
				L.DomUtil.remove(parent);
			});
			expect(function () {
				happen.once(child, {type: 'click'});
			}).to.not.throwException();
		});
	});

	describe("#distance", function () {
		it("measure distance in meters", function () {
			var LA = L.latLng(34.0485672098387, -118.217781922035);
			var columbus = L.latLng(39.95715687063701, -83.00205705857633);

			expect(map.distance(LA, columbus)).to.be.within(3173910, 3173915);
		});

		it("accurately measure in small distances", function () {
			var p1 = L.latLng(40.160857881285416, -83.00841851162649);
			var p2 = L.latLng(40.16246493902907, -83.008622359483);

			expect(map.distance(p1, p2)).to.be.within(175, 185);
		});

		it("accurately measure in long distances", function () {
			var canada = L.latLng(60.01810635103154, -112.19675246283015);
			var newZeland = L.latLng(-42.36275164460971, 172.39309066597883);

			expect(map.distance(canada, newZeland)).to.be.within(13274700, 13274800);
		});

		it("throw with undefined values", function () {
			expect(map.distance).withArgs(undefined, undefined).to.throwException();
		});

		it("throw with infinity values", function () {
			expect(map.distance).withArgs(Infinity, Infinity).to.throwException();
		});

		it("throw with only 1 lat", function () {
			expect(map.distance).withArgs(20, 50).to.throwException();
		});

		it("return 0 with 2 same latLng", function () {
			var p = L.latLng(20, 50);

			expect(map.distance(p, p)).to.eql(0);
		});
	});

	describe("#containerPointToLayerPoint", function () {
		it("return same point of LayerPoint is 0, 0", function () {
			expect(map.containerPointToLayerPoint(L.point(25, 25))).to.eql(L.point(25, 25));
		});

		it("return point relative to LayerPoint", function (done) {
			map.setView([20, 20], 2);

			map.once("moveend", function () {
				expect(map.containerPointToLayerPoint(L.point(30, 30))).to.eql(L.point(80, 80));
				done();
			});

			map.panBy([50, 50]);
		});
	});

	describe("#layerPointToContainerPoint", function () {
		it("return same point of ContainerPoint is 0, 0", function () {
			expect(map.layerPointToContainerPoint(L.point(25, 25))).to.eql(L.point(25, 25));
		});

		it("return point relative to ContainerPoint", function (done) {
			map.setView([20, 20], 2);

			map.once("moveend", function () {
				expect(map.layerPointToContainerPoint(L.point(30, 30))).to.eql(L.point(-20, -20));
				done();
			});

			map.panBy([50, 50]);
		});
	});

	describe("_addZoomLimit", function () {
		it("update zoom levels when min zoom is a number in a layer that is added to map", function () {
			map._addZoomLimit(L.tileLayer("", {minZoom: 4}));
			expect(map._layersMinZoom).to.be(4);
		});

		it("update zoom levels when max zoom is a number in a layer that is added to map", function () {
			map._addZoomLimit(L.tileLayer("", {maxZoom: 10}));
			expect(map._layersMaxZoom).to.be(10);
		});

		it("update zoom levels when min zoom is a number in two layers that are added to map", function () {
			map._addZoomLimit(L.tileLayer("", {minZoom: 6}));
			map._addZoomLimit(L.tileLayer("", {minZoom: 4}));
			expect(map._layersMinZoom).to.be(4);
		});

		it("update zoom levels when max zoom is a number in two layers that are added to map", function () {
			map._addZoomLimit(L.tileLayer("", {maxZoom: 10}));
			map._addZoomLimit(L.tileLayer("", {maxZoom: 8}));
			expect(map._layersMaxZoom).to.be(10);
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it("update zoom levels when min zoom is NaN in a layer that is added to map, so that min zoom becomes NaN,", function () {
			map._addZoomLimit(L.tileLayer("", {minZoom: NaN}));
			expect(isNaN(map._layersMinZoom)).to.be(true);
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it("update zoom levels when max zoom is NaN in a layer that is added to map, so that max zoom becomes NaN", function () {
			map._addZoomLimit(L.tileLayer("", {maxZoom: NaN}));
			expect(isNaN(map._layersMaxZoom)).to.be(true);
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		// Test is clearly wrong, but kept for future fixes
		// it("update zoom levels when min zoom is NaN in at least one of many layers that are added to map, so that min zoom becomes NaN", function () {
		// 	map._addZoomLimit(L.tileLayer("", {minZoom: 6}));
		// 	map._addZoomLimit(L.tileLayer("", {minZoom: NaN})); --> Results in maxZoom = NaN --> _updateZoomLevels is not called.
		// 	Not same logic as for maxZoom.
		// 	map._addZoomLimit(L.tileLayer("", {minZoom: 4}));
		// 	expect(isNaN(map._layersMinZoom)).to.be(true);
		// });

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it("update zoom levels when max zoom is NaN in at least one of many layers that are added to map, so that max zoom becomes NaN", function () {
			map._addZoomLimit(L.tileLayer("", {maxZoom: 10}));
			map._addZoomLimit(L.tileLayer("", {maxZoom: 8}));
			map._addZoomLimit(L.tileLayer("", {maxZoom: NaN}));
			expect(isNaN(map._layersMaxZoom)).to.be(true);
		});

		it("doesn't update zoom levels when min and max zoom are both NaN in a layer that is added to map", function () {
			map._addZoomLimit(L.tileLayer("", {minZoom: NaN, maxZoom: NaN}));
			expect(map._layersMinZoom === undefined && map._layersMaxZoom === undefined).to.be(true);
		});
	});

	describe("#containerPointToLatLng", function () {

		it("throws if map is not set before", function () {
			expect(function () {
				map.containerPointToLatLng();
			}).to.throwError();
		});

		it("returns geographical coordinate for point relative to map container", function () {
			var center = L.latLng(10, 10);
			map.setView(center, 50);
			var p = map.containerPointToLatLng(L.point(200, 200));
			expect(p.lat).to.be.within(10.0000000, 10.0000001);
			expect(p.lng).to.be.within(10.0000000, 10.0000001);
		});
	});


	describe("#latLngToContainerPoint", function () {

		it("throws if map is not set before", function () {
			expect(function () {
				map.latLngToContainerPoint();
			}).to.throwError();
		});

		it("returns point relative to map container for geographical coordinate", function () {
			var center = L.latLng(10, 10);
			map.setView(center);
			var p = map.latLngToContainerPoint(center);
			expect(p.x).to.be.equal(200);
			expect(p.y).to.be.equal(200);
		});
	});

	describe("#panTo", function () {

		it("throws if map is not set before", function () {
			expect(function () {
				map.panTo();
			}).to.throwError();
		});

		it("pans the map to accurate location", function () {
			var center = L.latLng([50, 30]);
			expect(map.panTo(center)).to.be(map);
			expect(map.getCenter().distanceTo(center)).to.be.lessThan(5);
		});
	});

	describe("#latLngToLayerPoint", function () {

		it("throws if map is not set before", function () {
			expect(function () {
				map.latLngToLayerPoint();
			}).to.throwError();
		});

		it("returns the corresponding pixel coordinate relative to the origin pixel", function () {
			var center = L.latLng([10, 10]);
			map.setView(center, 0);
			var p = map.latLngToLayerPoint(center);
			expect(p.x).to.be.equal(200);
			expect(p.y).to.be.equal(200);
		});
	});
});
