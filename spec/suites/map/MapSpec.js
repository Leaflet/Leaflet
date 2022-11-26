describe('Map', () => {
	let container,
	    map;

	beforeEach(() => {
		container = container = createContainer();
		map = L.map(container);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#remove', () => {
		let spy;

		beforeEach(() => {
			spy = sinon.spy();
		});

		it('fires an unload event if loaded', () => {
			map.setView([0, 0], 0);
			map.on('unload', spy);
			map.remove();
			map = null;
			expect(spy.called).to.be.ok();
		});

		it('fires no unload event if not loaded', () => {
			map.on('unload', spy);
			map.remove();
			map = null;
			expect(spy.called).not.to.be.ok();
		});

		describe('corner case checking', () => {
			it('throws an exception upon reinitialization', () => {
				expect(L.map).withArgs(container)
				  .to.throwException('Map container is already initialized.');
			});

			it('throws an exception if a container is not found', () => {
				expect(L.map).withArgs('nonexistentdivelement')
				  .to.throwException('Map container not found.');
			});
		});

		it('undefines container._leaflet_id', () => {
			expect(container._leaflet_id).to.be.ok();
			map.remove();
			map = null;
			expect(container._leaflet_id).to.be(undefined);
		});

		it('unbinds events', () => {
			// before actual test: make sure that events are ok
			map.setView([0, 0], 0);
			map.on('click', spy);
			happen.click(container);
			expect(spy.called).to.be.ok();

			// actual test
			spy = sinon.spy();
			map.on('click dblclick mousedown mouseup mousemove', spy);
			map.remove();
			map = null;

			happen.click(container);
			happen.dblclick(container);
			happen.mousedown(container);
			happen.mouseup(container);
			happen.mousemove(container);

			expect(spy.called).to.not.be.ok();
		});

		it('does not throw if removed during animation', () => {
			map.setView([0, 0], 1).setMaxBounds([[0, 1], [2, 3]]);

			// Force creation of animation proxy,
			// otherwise browser checks disable it
			map._createAnimProxy();

			// #6775 Remove the map in the middle of the animation
			map.on('zoom', map.remove.bind(map));
			map.setZoom(2);
		});

		it('throws error if container is reused by other instance', () => {
			map.remove();
			const map2 = L.map(container);

			expect(() => {
				map.remove();
			}).to.throwException();

			map2.remove(); // clean up
			map = null;
		});
	});

	describe('#getCenter', () => {
		it('throws if not set before', () => {
			expect(() => {
				map.getCenter();
			}).to.throwError();
		});

		it('returns a precise center when zoomed in after being set (#426)', () => {
			const center = L.latLng(10, 10);
			map.setView(center, 1);
			map.setZoom(19);
			expect(map.getCenter()).to.eql(center);
		});

		it('returns correct center after invalidateSize (#1919)', () => {
			const center = L.latLng(10, 10);
			map.setView(center, 1);
			map.invalidateSize();
			expect(map.getCenter()).not.to.eql(center);
		});

		it('returns a new object that can be mutated without affecting the map', () => {
			map.setView([10, 10], 1);
			const center = map.getCenter();
			center.lat += 10;
			expect(map.getCenter()).to.eql(L.latLng(10, 10));
		});
	});

	describe('#whenReady', () => {
		describe('when the map has not yet been loaded', () => {
			it('calls the callback when the map is loaded', () => {
				const spy = sinon.spy();
				map.whenReady(spy);
				expect(spy.called).to.not.be.ok();

				map.setView([0, 0], 1);
				expect(spy.called).to.be.ok();
			});
		});

		describe('when the map has already been loaded', () => {
			it('calls the callback immediately', () => {
				const spy = sinon.spy();
				map.setView([0, 0], 1);
				map.whenReady(spy);

				expect(spy.called).to.be.ok();
			});
		});
	});

	describe('#setView', () => {
		it('sets the view of the map', () => {
			expect(map.setView([51.505, -0.09], 13)).to.be(map);
			expect(map.getZoom()).to.be(13);
			expect(map.getCenter().distanceTo([51.505, -0.09])).to.be.lessThan(5);
		});

		it('can be passed without a zoom specified', () => {
			map.setZoom(13);
			expect(map.setView([51.605, -0.11])).to.be(map);
			expect(map.getZoom()).to.be(13);
			expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
		});

		it('limits initial zoom when no zoom specified', () => {
			map.options.maxZoom = 20;
			map.setZoom(100);
			expect(map.setView([51.605, -0.11])).to.be(map);
			expect(map.getZoom()).to.be(20);
			expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
		});

		it('defaults to zoom passed as map option', () => {
			const map = L.map(document.createElement('div'), {zoom: 13});
			const zoom = map.setView([51.605, -0.11]).getZoom();
			map.remove(); // clean up
			expect(zoom).to.be(13);
		});

		it('passes duration option to panBy', () => {
			const map = L.map(document.createElement('div'), {zoom: 13, center: [0, 0]});
			map.panBy = sinon.spy();
			map.setView([51.605, -0.11], 13, {animate: true, duration: 13});
			map.remove(); // clean up
			expect(map.panBy.callCount).to.eql(1);
			expect(map.panBy.args[0][1].duration).to.eql(13);
		});

		it('prevents firing movestart noMoveStart', (done) => {
			const movestartSpy = sinon.spy();
			map.on('movestart', movestartSpy);
			const moveendSpy = sinon.spy();
			map.on('moveend', moveendSpy);

			map.setView([51.505, -0.09], 13, {pan: {noMoveStart: true}});

			setTimeout(() => {
				expect(movestartSpy.notCalled).to.eql(true);
				expect(moveendSpy.calledOnce).to.eql(true);
				done();
			}, 100);
		});
	});

	describe('#setZoom', () => {
		describe('when the map has not yet been loaded', () => {
			it('set zoom level is not limited by max zoom', () => {
				map.options.maxZoom = 10;
				map.setZoom(15);

				expect(map.getZoom()).to.be(15);
			});

			it('overwrites zoom passed as map option', () => {
				const map2 = L.map(document.createElement('div'), {zoom: 13});
				map2.setZoom(15);
				const zoom = map2.getZoom();

				map2.remove(); // clean up
				expect(zoom).to.be(15);
			});
		});

		describe('when the map has been loaded', () => {
			beforeEach(() => {
				map.setView([0, 0], 0); // loads map
			});

			it('set zoom level is limited by max zoom', () => {
				map.options.maxZoom = 10;
				map.setZoom(15);

				expect(map.getZoom()).to.be(10);
			});

			it('does not overwrite zoom passed as map option', () => {
				const map2 = L.map(document.createElement('div'), {zoom: 13});
				map2.setView([0, 0]);
				map2.setZoom(15);
				const zoom = map2.getZoom();

				map2.remove(); // clean up
				expect(zoom).to.be(13);
			});
		});

		it('changes previous zoom level', () => {
			map.zoom = 10;
			map.setZoom(15);

			expect(map.getZoom()).to.be(15);
		});

		it('can be passed without a zoom specified and keep previous zoom', () => {
			const prevZoom = map.getZoom();
			map.setZoom();

			expect(map.getZoom()).to.be(prevZoom);
		});

		it('can be passed with a zoom level of undefined and keep previous zoom', () => {
			const prevZoom = map.getZoom();
			map.setZoom(undefined);

			expect(map.getZoom()).to.be(prevZoom);
		});

		it('can be passed with a zoom level of infinity', () => {
			map.setZoom(Infinity);

			expect(map.getZoom()).to.be(Infinity);
		});
	});

	describe('#stop', () => {
		it('does not try to stop the animation if it wasn\'t set before', () => {
			map.setView([50, 50], 10);
			map.stop = sinon.spy();
			map.panTo([10, 10], 10);
			expect(map.stop.called).to.not.be.ok();
		});

		it('stops the execution of the flyTo animation', () => {
			map.setView([0, 0]);
			map.stop = sinon.spy();
			map.flyTo([51.505, -0.09]);
			map.stop();
			expect(map.stop.calledOnce).to.be.ok();
		});

		it('stops the execution of the panTo animation', () => {
			map.setView([0, 0]);
			map.stop = sinon.spy();
			map.panTo([51.505, -0.09]);
			map.stop();
			expect(map.stop.calledOnce).to.be.ok();
		});
	});

	describe('#setZoomAround', () => {
		beforeEach(() => {
			map.setView([0, 0], 0); // loads map
		});

		it('pass Point and change pixel in view', () => {
			const point = L.point(5, 5);
			map.setZoomAround(point, 5);

			expect(map.getBounds().contains(map.options.crs.pointToLatLng(point, 5))).to.be(false);
		});

		it('pass Point and change pixel in view at high zoom', () => {
			const point = L.point(5, 5);
			map.setZoomAround(point, 18);

			expect(map.getBounds().contains(map.options.crs.pointToLatLng(point, 18))).to.be(false);
		});

		it('pass latLng and keep specified latLng in view', () => {
			map.setZoomAround([5, 5], 5);

			expect(map.getBounds().contains([5, 5])).to.be(true);
		});

		it('pass latLng and keep specified latLng in view at high zoom fails', () => {
			map.setZoomAround([5, 5], 12); // usually fails around 9 zoom level

			expect(map.getBounds().contains([5, 5])).to.be(false);
		});

		it('throws if map is not loaded', () => {
			const unloadedMap = L.map(document.createElement('div'));

			expect(unloadedMap.setZoomAround).withArgs([5, 5], 4).to.throwException();
		});

		it('throws if zoom is empty', () => {
			expect(map.setZoomAround).withArgs([5, 5]).to.throwException();
		});

		it('throws if zoom is undefined', () => {
			expect(map.setZoomAround).withArgs([5, 5], undefined).to.throwException();
		});

		it('throws if latLng is undefined', () => {
			expect(map.setZoomAround).withArgs([undefined, undefined], 4).to.throwException();
		});

		it('does not throw if latLng is infinity', () => {
			map.setView([5, 5]);
			map.setZoomAround([Infinity, Infinity], 4);

			expect(map.getCenter()).to.be.ok();
		});
	});

	describe('#getBounds', () => {
		it('is safe to call from within a moveend callback during initial load (#1027)', () => {
			const map = L.map(document.createElement('div'));
			map.on('moveend', () => {
				map.getBounds();
			});
			map.setView([51.505, -0.09], 13);
			map.remove(); // clean up
		});
	});

	describe('#getBoundsZoom', () => {
		const halfLength = 0.00025;
		const bounds = [[-halfLength, -halfLength], [halfLength, halfLength]];
		const wideBounds = [[-halfLength, -halfLength * 10], [halfLength, halfLength * 10]];
		const padding = [100, 100];
		const height = '400px';

		it('returns high levels of zoom with small areas and big padding', () => {
			container.style.height = height;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19);
		});

		it.skipIfNo3d('returns multiples of zoomSnap when zoomSnap > 0 on any3d browsers', () => {
			container.style.height = height;
			map.options.zoomSnap = 0.5;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19.5);
			map.options.zoomSnap = 0.2;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.equal(19.6);
			map.options.zoomSnap = 0;
			expect(map.getBoundsZoom(bounds, false, padding)).to.be.within(19.6864560, 19.6864561);
		});

		it('getBoundsZoom does not return Infinity when projected SE - NW has negative components', () => {
			container.style.height = '';
			container.style.width = '';
			map.setZoom(16);
			const bounds = L.latLngBounds(
				[62.18475569507688, 6.926335173954951],
				[62.140483526511694, 6.923933370740089]);
			const padding = L.point(-50, -50);

			// control case: default crs
			let boundsZoom = map.getBoundsZoom(bounds, false, padding);
			expect(boundsZoom).to.eql(9);

			// test case: EPSG:25833 (mocked, for simplicity)
			// The following coordinates are bounds projected with proj4leaflet crs = EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs
			const crsMock = sinon.mock(map.options.crs);
			crsMock.expects('latLngToPoint')
				.withExactArgs(bounds.getNorthWest(), 16)
				.returns(L.point(7800503.059925064, 6440062.353052008));
			crsMock.expects('latLngToPoint')
				.withExactArgs(bounds.getSouthEast(), 16)
				.returns(L.point(7801987.203481699, 6425186.447901004));
			boundsZoom = map.getBoundsZoom(bounds, false, padding);
			crsMock.restore();

			crsMock.verify(); // ensure that latLngToPoint was called with expected args
			expect(boundsZoom).to.eql(7); // result expected for EPSG:25833
		});

		it('respects the \'inside\' parameter', () => {
			container.style.height = height;
			container.style.width = '1024px'; // Make sure the width is defined for browsers other than PhantomJS (in particular Firefox).
			expect(map.getBoundsZoom(wideBounds, false, padding)).to.be.equal(17);
			expect(map.getBoundsZoom(wideBounds, true, padding)).to.be.equal(20);
		});
	});

	describe('#setMaxBounds', () => {
		it('aligns pixel-wise map view center with maxBounds center if it cannot move view bounds inside maxBounds (#1908)', () => {
			// large view, cannot fit within maxBounds
			container.style.width = container.style.height = '1000px';
			// maxBounds
			const bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			// set view outside
			map.setView(L.latLng([53.0, 0.15]), 12, {animate: false});
			// get center of bounds in pixels
			const boundsCenter = map.project(bounds.getCenter()).round();
			expect(map.project(map.getCenter()).round()).to.eql(boundsCenter);
		});

		it('moves map view within maxBounds by changing one coordinate', () => {
			// small view, can fit within maxBounds
			container.style.width = container.style.height = '200px';
			// maxBounds
			const bounds = L.latLngBounds([51, -0.2], [52, 0.2]);
			map.setMaxBounds(bounds, {animate: false});
			// set view outside maxBounds on one direction only
			// leaves untouched the other coordinate (that is not already centered)
			const initCenter = [53.0, 0.1];
			map.setView(L.latLng(initCenter), 16, {animate: false});
			// one pixel coordinate hasn't changed, the other has
			const pixelCenter = map.project(map.getCenter()).round();
			const pixelInit = map.project(initCenter).round();
			expect(pixelCenter.x).to.eql(pixelInit.x);
			expect(pixelCenter.y).not.to.eql(pixelInit.y);
			// the view is inside the bounds
			expect(bounds.contains(map.getBounds())).to.be(true);
		});

		it('remove listeners when called without arguments', (done) => {
			L.tileLayer('', {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = '500px';
			const bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			map.setMaxBounds();
			// set view outside
			const center = L.latLng([0, 0]);
			map.once('moveend', () => {
				expect(center.equals(map.getCenter())).to.be(true);
				done();
			});
			map.setView(center, 18, {animate: false});
		});

		it('does not try to remove listeners if it wasn\'t set before', () => {
			L.tileLayer('', {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = '500px';
			const bounds = L.latLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.off = sinon.spy();
			map.setMaxBounds(bounds, {animate: false});
			expect(map.off.called).not.to.be.ok();
		});

		it('avoid subpixel / floating point related wobble (#8532)', (done) => {
			map.setView([50.450036, 30.5241361], 13);

			const spy = sinon.spy();
			map.on('moveend', spy);
			map.setMaxBounds(map.getBounds());

			// Unfortunately this is one of those tests where we need to allow at least one animation tick
			setTimeout(() => {
				expect(spy.called).to.be(false);
				done();
			}, 300);
		});
	});

	describe('#setMinZoom and #setMaxZoom', () => {
		describe('when map is not loaded', () => {
			it('change min and max zoom but not zoom', () => {
				map.setZoom(2);
				map.setMinZoom(3);

				expect(map.getZoom()).to.eql(2);
				expect(map.getMinZoom()).to.eql(3);

				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
			});

			it('do not fire \'zoomlevelschange\'', () => {
				const spy = sinon.spy();
				map.on('zoomlevelschange', spy);

				map.setZoom(5);
				map.setMinZoom(3);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(5);
				expect(map.getMinZoom()).to.eql(3);
				expect(map.getMaxZoom()).to.eql(7);

				expect(spy.called).to.not.be.ok();
			});
		});

		describe('when map is loaded', () => {
			let spy;

			beforeEach(() => {
				map.setView([0, 0], 4); // loads map

				spy = sinon.spy();
				map.on('zoomlevelschange', spy);
			});

			it('do not fire \'zoomlevelschange\' if zoom level did not change', () => {
				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(4);
				expect(map.getMinZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
				expect(spy.calledTwice).to.be.ok();

				const postSpy = sinon.spy();
				map.on('zoomlevelschange', postSpy);

				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(postSpy.called).to.not.be.ok();
			});

			it('fire \'zoomlevelschange\' but do not change zoom if max/min zoom is less/more current zoom', () => {
				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(4);
				expect(map.getMinZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
				expect(spy.calledTwice).to.be.ok();
			});
		});

		it('reset min/max zoom if set to undefined or missing param', () => {
			map.setMinZoom(undefined);
			map.setMaxZoom();

			expect(map.options.minZoom).to.be(undefined);
			expect(map.options.maxZoom).to.be(undefined);

			expect(map.getMinZoom()).to.be(0); // min layer zoom used instead
			expect(map.getMaxZoom()).to.be(Infinity); // max layer zoom used instead
		});

		it('allow infinity to be passed', () => {
			map.setMinZoom(Infinity);
			map.setMaxZoom(Infinity);

			expect(map.getMinZoom()).to.be(Infinity);
			expect(map.getMaxZoom()).to.be(Infinity);
		});
	});

	describe('#getMinZoom and #getMaxZoom', () => {
		describe('#getMinZoom', () => {
			it('returns 0 if not set by Map options or TileLayer options', () => {
				expect(map.getMinZoom()).to.be(0);
			});
		});

		it('minZoom and maxZoom options overrides any minZoom and maxZoom set on layers', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {minZoom: 2, maxZoom: 20});

			L.tileLayer('', {minZoom: 4, maxZoom: 10}).addTo(map);
			L.tileLayer('', {minZoom: 6, maxZoom: 17}).addTo(map);
			L.tileLayer('', {minZoom: 0, maxZoom: 22}).addTo(map);

			expect(map.getMinZoom()).to.be(2);
			expect(map.getMaxZoom()).to.be(20);
		});

		it('layer minZoom overrides map zoom if map has no minZoom set and layer minZoom is bigger than map zoom', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 10});

			L.tileLayer('', {minZoom: 15}).addTo(map);

			expect(map.getMinZoom()).to.be(15);
		});

		it('layer maxZoom overrides map zoom if map has no maxZoom set and layer maxZoom is smaller than map zoom', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 20});

			L.tileLayer('', {maxZoom: 15}).addTo(map);

			expect(map.getMaxZoom()).to.be(15);
		});

		it('map\'s zoom is adjusted to layer\'s minZoom even if initialized with smaller value', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 10});

			L.tileLayer('', {minZoom: 15}).addTo(map);

			expect(map.getZoom()).to.be(15);
		});

		it('map\'s zoom is adjusted to layer\'s maxZoom even if initialized with larger value', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = L.map(container, {zoom: 20});

			L.tileLayer('', {maxZoom: 15}).addTo(map);

			expect(map.getZoom()).to.be(15);
		});
	});

	describe('#addHandler', () => {
		function getHandler(callback = () => {}) {
			return L.Handler.extend({
				addHooks() {
					L.DomEvent.on(window, 'click', this.handleClick, this);
				},

				removeHooks() {
					L.DomEvent.off(window, 'click', this.handleClick, this);
				},

				handleClick: callback
			});
		}

		it('checking enabled method', () => {
			L.ClickHandler = getHandler();
			map.addHandler('clickHandler', L.ClickHandler);

			expect(map.clickHandler.enabled()).to.eql(false);

			map.clickHandler.enable();
			expect(map.clickHandler.enabled()).to.eql(true);

			map.clickHandler.disable();
			expect(map.clickHandler.enabled()).to.eql(false);
		});

		it('automatically enabled, when has a property named the same as the handler', () => {
			map.remove();
			map = L.map(container, {clickHandler: true});

			L.ClickHandler = getHandler();
			map.addHandler('clickHandler', L.ClickHandler);

			expect(map.clickHandler.enabled()).to.eql(true);
		});

		it('checking handling events when enabled/disabled', () => {
			const spy = sinon.spy();
			L.ClickHandler = getHandler(spy);
			map.addHandler('clickHandler', L.ClickHandler);

			happen.once(window, {type: 'click'});
			expect(spy.called).not.to.be.ok();

			map.clickHandler.enable();

			happen.once(window, {type: 'click'});
			expect(spy.called).to.be.ok();

			map.clickHandler.disable();

			happen.once(window, {type: 'click'});
			expect(spy.callCount).to.eql(1);
		});
	});

	describe('createPane', () => {
		it('create a new pane to mapPane when container not specified', () => {
			map.createPane('controlPane');

			expect(map.getPane('controlPane').className).to.eql('leaflet-pane leaflet-control-pane');
		});

		it('create a new pane to container specified', () => {
			map.createPane('controlPane', map.getPane('tooltipPane'));

			expect(map.getPane('controlPane').parentElement.className).to.eql(
				'leaflet-pane leaflet-tooltip-pane');
		});

		it('create a new pane to mapPane when container is invalid', () => {
			map.createPane('controlPane', undefined);

			expect(map.getPane('controlPane').parentElement.className).to.eql(
				'leaflet-pane leaflet-map-pane');
		});

		it('replace same named pane', () => {
			const overlayPane = map.getPane('overlayPane');

			map.createPane('overlayPane');

			expect(map.getPane('overlayPane')).to.not.be(overlayPane);
		});
	});

	describe('#getPane', () => {
		it('return pane by String', () => {
			expect(map.getPane('tilePane').className).to.eql('leaflet-pane leaflet-tile-pane');
		});

		it('return pane by pane', () => {

			expect(map.getPane(map.getPanes()['shadowPane']).className).to.eql(
				'leaflet-pane leaflet-shadow-pane');
		});

		it('return empty pane when not found', () => {
			expect(map.getPane('foo bar')).to.eql(undefined);
		});
	});

	describe('#getPanes', () => {
		it('return all default panes', () => {
			const keys = Object.keys(map.getPanes());

			expect(keys).to.eql(
				['mapPane', 'tilePane', 'overlayPane', 'shadowPane', 'markerPane', 'tooltipPane', 'popupPane']);
		});

		it('return empty pane when map deleted', () => {
			const map2 = L.map(document.createElement('div'));
			map2.remove();

			expect(map2.getPanes()).to.eql({});
		});
	});

	describe('#getContainer', () => {
		it('return container object', () => {
			expect(map.getContainer()._leaflet_id).to.be.ok();
		});

		it('return undefined on empty container id', () => {
			const container2 = createContainer();
			const map2 = L.map(container2);
			map2.remove(); // clean up

			expect(map2.getContainer()._leaflet_id).to.eql(undefined);
		});
	});

	describe('#getSize', () => {
		it('return map size in pixels', () => {
			expect(map.getSize()).to.eql(L.point([400, 400]));
		});

		it('return map size if not specified', () => {
			const map2 = L.map(document.createElement('div'));

			expect(map2.getSize()).to.eql(L.point([0, 0]));

			map2.remove(); // clean up
		});

		it('return map size if 0x0 pixels', () => {
			container.style.width = '0px';
			container.style.height = '0px';

			expect(map.getSize()).to.eql(L.point([0, 0]));
		});

		it('return new pixels on change', () => {
			container.style.width = '300px';

			expect(map.getSize()).to.eql(L.point([300, 400]));
		});

		it('return clone of size object from map', () => {
			expect(map.getSize()).to.not.be(map._size);
		});

		it('return previous size on empty map', () => {
			const container2 = createContainer();
			const map2 = L.map(container2);

			map2.remove(); // clean up

			expect(map2.getSize()).to.eql(L.point([400, 400]));
		});
	});

	describe('#getPixelBounds', () => {
		beforeEach(() => {
			map.setView([0, 0], 0); // load map
		});

		it('return map bounds in pixels', () => {
			expect(map.getPixelBounds()).to.eql(L.bounds([-72, -72], [328, 328]));
		});

		it('return changed map bounds if really zoomed in', () => {
			map.setZoom(20);

			expect(map.getPixelBounds()).to.eql(L.bounds([134217528, 134217528], [134217928, 134217928]));
		});

		it('return new pixels on view change', () => {
			map.setView([50, 50], 5);

			expect(map.getPixelBounds()).to.eql(L.bounds([5034, 2578], [5434, 2978]));
		});

		it('throw error if center and zoom were not set / map not loaded', () => {
			const container2 = createContainer();
			const map2 = L.map(container2);

			expect(map2.getPixelBounds).to.throwException();

			map2.remove(); // clean up
		});
	});

	describe('#getPixelOrigin', () => {
		beforeEach(() => {
			map.setView([0, 0], 0); // load map
		});

		it('return pixel origin', () => {
			expect(map.getPixelOrigin()).to.eql(L.point([-72, -72]));
		});

		it('return new pixels on view change', () => {
			map.setView([50, 50], 5);

			expect(map.getPixelOrigin()).to.eql(L.point([5034, 2578]));
		});

		it('return changed map bounds if really zoomed in', () => {
			map.setZoom(20);

			expect(map.getPixelOrigin()).to.eql(L.point([134217528, 134217528]));
		});

		it('throw error if center and zoom were not set / map not loaded', () => {
			const container2 = createContainer();
			const map2 = L.map(container2);

			expect(map2.getPixelOrigin).to.throwException();

			map2.remove(); // clean up
		});
	});

	describe('#getPixelWorldBounds', () => {
		it('return map bounds in pixels', () => {
			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[5.551115123125783e-17, 5.551115123125783e-17], [1, 1]));
		});

		it('return changed map bounds if really zoomed in', () => {
			map.setZoom(20);

			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[1.4901161193847656e-8, 1.4901161193847656e-8], [268435456, 268435456]));
		});

		it('return new pixels on zoom change', () => {
			map.setZoom(5);

			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[4.547473508864641e-13, 4.547473508864641e-13], [8192, 8192]));

			map.setView([0, 0]);

			// view does not change pixel world bounds
			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[4.547473508864641e-13, 4.547473508864641e-13], [8192, 8192]));
		});

		it('return infinity bounds on infinity zoom', () => {
			map.setZoom(Infinity);

			expect(map.getPixelWorldBounds()).to.eql(L.bounds(
				[Infinity, Infinity], [Infinity, Infinity]));
		});
	});

	describe('#hasLayer', () => {
		it('throws when called without proper argument', () => {
			const hasLayer = map.hasLayer.bind(map);
			expect(hasLayer).withArgs(new L.Layer()).to.not.throwException(); // control case

			expect(hasLayer).withArgs(undefined).to.throwException();
			expect(hasLayer).withArgs(null).to.throwException();
			expect(hasLayer).withArgs(false).to.throwException();
			expect(hasLayer).to.throwException();
		});
	});

	function layerSpy() {
		const layer = new L.Layer();
		layer.onAdd = sinon.spy();
		layer.onRemove = sinon.spy();
		return layer;
	}

	describe('#addLayer', () => {
		it('calls layer.onAdd immediately if the map is ready', () => {
			const layer = layerSpy();
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(layer.onAdd.called).to.be.ok();
		});

		it('calls layer.onAdd when the map becomes ready', () => {
			const layer = layerSpy();
			map.addLayer(layer);
			expect(layer.onAdd.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).to.be.ok();
		});

		it('does not call layer.onAdd if the layer is removed before the map becomes ready', () => {
			const layer = layerSpy();
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).not.to.be.ok();
		});

		it('fires a layeradd event immediately if the map is ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it('fires a layeradd event when the map becomes ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			expect(spy.called).not.to.be.ok();
			map.setView([0, 0], 0);
			expect(spy.called).to.be.ok();
		});

		it('does not fire a layeradd event if the layer is removed before the map becomes ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(spy.called).not.to.be.ok();
		});

		it('adds the layer before firing layeradd', (done) => {
			const layer = layerSpy();
			map.on('layeradd', () => {
				expect(map.hasLayer(layer)).to.be.ok();
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
		});

		it('throws if adding something which is not a layer', () => {
			const control = L.control.layers();
			expect(() => {
				map.addLayer(control);
			}).to.throwError();
		});

		describe('When the first layer is added to a map', () => {
			it('fires a zoomlevelschange event', () => {
				const spy = sinon.spy();
				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe('when a new layer with greater zoomlevel coverage than the current layer is added to a map', () => {
			it('fires a zoomlevelschange event', () => {
				const spy = sinon.spy();
				L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer('', {minZoom: 0, maxZoom: 15}).addTo(map);
				expect(spy.called).to.be.ok();
			});
		});

		describe('when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map', () => {
			it('fires no zoomlevelschange event', () => {
				const spy = sinon.spy();
				L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.ok();
				L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).not.to.be.ok();
				L.tileLayer('', {minZoom: 0, maxZoom: 5}).addTo(map);
				expect(spy.called).not.to.be.ok();
			});
		});
	});

	describe('#removeLayer', () => {
		it('calls layer.onRemove if the map is ready', () => {
			const layer = layerSpy();
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).to.be.ok();
		});

		it('does not call layer.onRemove if the layer was not added', () => {
			const layer = layerSpy();
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.ok();
		});

		it('does not call layer.onRemove if the map is not ready', () => {
			const layer = layerSpy();
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.ok();
		});

		it('fires a layerremove event if the map is ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).to.be.ok();
		});

		it('does not fire a layerremove if the layer was not added', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it('does not fire a layerremove if the map is not ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.ok();
		});

		it('removes the layer before firing layerremove', (done) => {
			const layer = layerSpy();
			map.on('layerremove', () => {
				expect(map.hasLayer(layer)).not.to.be.ok();
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it('supports adding and removing a tile layer without initializing the map', () => {
			const layer = L.tileLayer('');
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it('supports adding and removing a tile layer without initializing the map', () => {
			map.setView([0, 0], 18);
			const layer = L.gridLayer();
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		describe('when the last tile layer on a map is removed', () => {
			it('fires a zoomlevelschange event', () => {
				map.setView([0, 0], 0);
				const spy = sinon.spy();
				const tl = L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);

				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.ok();
				map.removeLayer(tl);
				expect(spy.called).to.be.ok();
			});
		});

		describe('when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer', () => {
			it('fires a zoomlevelschange event', () => {
				map.setView([0, 0], 0);
				L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				const spy = sinon.spy(),
				    t2 = L.tileLayer('', {minZoom: 0, maxZoom: 15}).addTo(map);

				map.on('zoomlevelschange', spy);
				expect(spy.called).to.not.be.ok();
				map.removeLayer(t2);
				expect(spy.called).to.be.ok();
			});
		});

		describe('when a tile layer is removed from a map it and it had lesser or the same zoom level coverage as the remainding layer(s)', () => {
			it('fires no zoomlevelschange event', () => {
				map.setView([0, 0], 0);
				const spy = sinon.spy(),
				    t1 = L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map),
				    t2 = L.tileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map),
				    t3 = L.tileLayer('', {minZoom: 0, maxZoom: 5}).addTo(map);

				map.on('zoomlevelschange', spy);
				map.removeLayer(t2);
				expect(spy.called).to.not.be.ok();
				map.removeLayer(t3);
				expect(spy.called).to.not.be.ok();
				map.removeLayer(t1);
				expect(spy.called).to.be.ok();
			});
		});
	});

	describe('#eachLayer', () => {
		it('returns self', () => {
			expect(map.eachLayer(L.Util.falseFn)).to.be(map);
		});

		it('calls the provided function for each layer', () => {
			const t1 = L.tileLayer('').addTo(map),
			    t2 = L.tileLayer('').addTo(map),
			    spy = sinon.spy();

			map.eachLayer(spy);

			expect(spy.callCount).to.eql(2);
			expect(spy.firstCall.args).to.eql([t1]);
			expect(spy.secondCall.args).to.eql([t2]);
		});

		it('calls the provided function with the provided context', () => {
			const spy = sinon.spy();
			L.tileLayer('').addTo(map);

			map.eachLayer(spy, map);

			expect(spy.alwaysCalledOn(map)).to.be.ok();
		});
	});

	describe('#invalidateSize', () => {
		const origWidth = 100;
		let clock;

		beforeEach(() => {
			container.style.height = '100px';
			container.style.width = `${origWidth}px`;
			map.setView([0, 0], 0);
			map.invalidateSize({pan: false});
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
		});

		it('pans by the right amount when growing in 1px increments', () => {
			container.style.width = `${origWidth + 1}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(1);

			container.style.width = `${origWidth + 2}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(1);

			container.style.width = `${origWidth + 3}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(2);
		});

		it('pans by the right amount when shrinking in 1px increments', () => {
			container.style.width = `${origWidth - 1}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(0);

			container.style.width = `${origWidth - 2}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(-1);

			container.style.width = `${origWidth - 3}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.be(-1);
		});

		it('pans back to the original position after growing by an odd size and back', () => {
			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize();

			container.style.width = `${origWidth}px`;
			map.invalidateSize();

			expect(map._getMapPanePos().x).to.be(0);
		});

		it('emits no move event if the size has not changed', () => {
			const spy = sinon.spy();
			map.on('move', spy);

			map.invalidateSize();

			expect(spy.called).not.to.be.ok();
		});

		it('emits a move event if the size has changed', () => {
			const spy = sinon.spy();
			map.on('move', spy);

			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize();

			expect(spy.called).to.be.ok();
		});

		it('emits a moveend event if the size has changed', () => {
			const spy = sinon.spy();
			map.on('moveend', spy);

			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize();

			expect(spy.called).to.be.ok();
		});

		it('debounces the moveend event if the debounceMoveend option is given', () => {
			const spy = sinon.spy();
			map.on('moveend', spy);

			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize({debounceMoveend: true});

			expect(spy.called).not.to.be.ok();

			clock.tick(200);

			expect(spy.called).to.be.ok();
		});

		it('correctly adjusts for new container size when view is set during map initialization (#6165)', () => {
			// Use a newly initialized map
			map.remove();

			const center = [0, 0];

			// The edge case is only if view is set directly during map initialization
			map = L.map(container, {
				center,
				zoom: 0
			});

			// Change the container size
			container.style.width = '600px';

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

		it('auto invalidateSize after container resize', (done) => {
			map.setView([0, 0], 0);
			const spy = sinon.spy();
			map.on('resize', spy);

			expect(spy.called).to.not.be.ok();

			map.getContainer().style.width = '200px';

			map.on('resize', () => {
				expect(spy.called).to.be.ok();
				done();
			});
		});

		it('disables auto invalidateSize', (done) => {
			clock.restore();
			map.remove();

			const center = [0, 0];

			// The edge case is only if view is set directly during map initialization
			map = L.map(container, {
				center,
				zoom: 0,
				trackResize: false
			});

			const spy = sinon.spy();
			map.invalidateSize = spy;

			expect(spy.called).to.not.be.ok();

			map.getContainer().style.width = '200px';

			setTimeout(() => {
				expect(spy.called).to.not.be.ok();
				done();
				// we need the 10 ms to be sure that the ResizeObserver is not triggered
			}, 10);
		});

		it('makes sure that auto invalidateSize is removed', (done) => {
			clock.restore();
			map.remove();

			const spy = sinon.spy();
			map.invalidateSize = spy;
			expect(spy.called).to.not.be.ok();

			map.getContainer().style.width = '200px';

			setTimeout(() => {
				expect(spy.called).to.not.be.ok();

				// make sure afterEach works correctly
				map = L.map(container);
				done();
				// we need the 10 ms to be sure that the ResizeObserver is not triggered
			}, 10);
		});
	});

	describe('#flyTo', () => {
		beforeEach(() => {
			container.style.width = '800px';
			container.style.height = '600px';
			container.style.visibility = 'hidden';
		});

		it('move to requested center and zoom, and call zoomend once', function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			const newCenter = L.latLng(10, 11),
			    newZoom = 12;
			const callback = function () {
				expect(map.getCenter()).to.eql(newCenter);
				expect(map.getZoom()).to.eql(newZoom);
				done();
			};
			map.setView([0, 0], 0);
			map.on('zoomend', callback).flyTo(newCenter, newZoom, {duration: 0.1});
		});

		it('flyTo start latlng == end latlng', function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			const dc = L.latLng(38.91, -77.04);
			map.setView(dc, 14);

			map.on('zoomend', () => {
				expect(map.getCenter()).to.eql(dc);
				expect(map.getZoom()).to.eql(4);
				done();
			});

			map.flyTo(dc, 4, {duration: 0.1});
		});
	});

	describe('#zoomIn and #zoomOut', () => {
		const center = L.latLng(22, 33);
		beforeEach(() => {
			map.setView(center, 10);
		});

		it('zoomIn zooms by 1 zoom level by default', (done) => {
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(11);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it('zoomOut zooms by 1 zoom level by default', (done) => {
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(9);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(null, {animate: false});
		});

		it.skipIf3d('zoomIn ignores the zoomDelta option on non-any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(11);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it.skipIfNo3d('zoomIn respects the zoomDelta option on any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.setView(center, 10);
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(null, {animate: false});
		});

		it.skipIfNo3d('zoomOut respects the zoomDelta option on any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.options.zoomDelta = 0.25;
			map.setView(center, 10);
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(9.75);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(null, {animate: false});
		});

		it.skipIfNo3d('zoomIn snaps to zoomSnap on any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(0.22, {animate: false});
		});

		it.skipIfNo3d('zoomOut snaps to zoomSnap on any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(9.75);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomOut(0.22, {animate: false});
		});
	});

	describe('#_getBoundsCenterZoom', () => {
		const center = L.latLng(50.5, 30.51);

		it('Returns valid center on empty bounds in unitialized map', () => {
			// Edge case from #5153
			const centerAndZoom = map._getBoundsCenterZoom([center, center]);
			expect(centerAndZoom.center).to.eql(center);
			expect(centerAndZoom.zoom).to.eql(Infinity);
		});
	});

	describe('#fitBounds', () => {
		const center = L.latLng(50.5, 30.51);
		let bounds = L.latLngBounds(L.latLng(1, 102), L.latLng(11, 122)),
		    boundsCenter = bounds.getCenter();

		beforeEach(() => {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = '100px';
			map.setView(center, 15);
		});

		it('Snaps zoom level to integer by default', (done) => {
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it.skipIfNo3d('Snaps zoom to zoomSnap on any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(2.75);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it.skipIf3d('Ignores zoomSnap on non-any3d browsers', (done) => {
			map.options.zoomSnap = 0.25;
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it('can be called with an array', (done) => {
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(2);
				expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
				done();
			});
			const bounds = [[1, 102], [11, 122]];
			map.fitBounds(bounds, {animate: false});
		});

		it('throws an error with invalid bounds', () => {
			expect(() => {
				map.fitBounds(NaN);
			}).to.throwError();
		});

		it('Fits to same scale and zoom', (done) => {
			const bounds = map.getBounds(),
			    zoom = map.getZoom();
			map.once('moveend zoomend', () => {
				const newBounds = map.getBounds();
				expect(newBounds.getSouthWest()).to.nearLatLng(bounds.getSouthWest());
				expect(newBounds.getNorthEast()).to.nearLatLng(bounds.getNorthEast());
				expect(map.getZoom()).to.eql(zoom);
				done();
			});
			map.fitBounds(bounds, {animate: false});
		});

		it('Fits to small bounds from small zoom', (done) => {
			map.once('zoomend', () => {
				map.once('zoomend', () => {
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

		it('Fits to large bounds from large zoom', (done) => {
			map.once('zoomend', () => {
				map.once('zoomend', () => {
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

	describe('#fitBounds after layers set', () => {
		const center = L.latLng(22, 33),
		    bounds = L.latLngBounds(L.latLng(1, 102), L.latLng(11, 122));

		beforeEach(() => {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = '100px';
		});

		it('Snaps to a number after adding tile layer', () => {
			// expect(L.Browser.any3d).to.be.ok(); // precondition
			map.addLayer(L.tileLayer(''));
			expect(map.getZoom()).to.be(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.be(2);
		});

		it('Snaps to a number after adding marker', () => {
			// expect(L.Browser.any3d).to.be.ok(); // precondition
			map.addLayer(L.marker(center));
			expect(map.getZoom()).to.be(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.be(2);
		});

	});

	describe('#fitWorld', () => {
		const bounds = L.latLngBounds([90, -180], [-90, 180]),
		boundsCenter = bounds.getCenter();


		beforeEach(() => {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = '100px';
		});

		it('map zooms out to max view with default settings', () => {
			map.setZoom(5);
			map.fitWorld();

			expect(map.getZoom()).to.eql(0);
			expect(map.getCenter().equals(boundsCenter, 0.05)).to.eql(true);
		});
	});

	describe('#panInside', () => {
		let center,
		    tl,
		    tlPix;

		beforeEach(() => {
			container.style.height = container.style.width = '500px';
			map.setView(L.latLng([53.0, 0.15]), 12, {animate: false});
			center = map.getCenter().clone();
			tl = map.getBounds().getNorthWest();
			tlPix = map.getPixelBounds().min;
		});

		it('does not pan the map when the target is within bounds', () => {
			map.panInside(tl, {animate:false});
			expect(center).to.eql(map.getCenter());
		});

		it('pans the map when padding is provided and the target is within the border area', () => {
			const padding = [40, 20];
			let p = tlPix.add([30, 0]),	// Top-left
			    distanceMoved;
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([-10, -20]))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().max.x - 10, map.getPixelBounds().min.y];	// Top-right
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([30, -20]))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().min.x + 35, map.getPixelBounds().max.y];	// Bottom-left
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([-5, 20]))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().max.x - 15, map.getPixelBounds().max.y]; // Bottom-right
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(L.point([25, 20]))).to.eql(true);
		});

		it('supports different padding values for each border', () => {
			const p = tlPix.add([40, 0]),	// Top-Left
			    opts = {paddingTL: [60, 20], paddingBR: [10, 10], animate: false};
			map.panInside(map.unproject(p), opts);
			expect(center).to.eql(map.getCenter());

			const br = map.getPixelBounds().max;	// Bottom-Right
			map.panInside(map.unproject(L.point(br.x + 20, br.y)), opts);
			expect(center).to.not.eql(map.getCenter());
		});

		it('pans on both X and Y axes when the target is outside of the view area and both the point\'s coords are outside the bounds', () => {
			const p = map.unproject(tlPix.subtract([200, 200]));
			map.panInside(p, {animate: false});
			expect(map.getBounds().contains(p)).to.be(true);
			expect(map.getCenter().lng).to.not.eql(center.lng);
			expect(map.getCenter().lat).to.not.eql(center.lat);
		});

		it('pans only on the Y axis when the target\'s X coord is within bounds but the Y is not', () => {
			const p = L.latLng(tl.lat + 5, tl.lng);
			map.panInside(p, {animate: false});
			expect(map.getBounds().contains(p)).to.be(true);
			const dx = Math.abs(map.getCenter().lng - center.lng);
			expect(dx).to.be.lessThan(1.0E-9);
			expect(map.getCenter().lat).to.not.eql(center.lat);
		});

		it('pans only on the X axis when the target\'s Y coord is within bounds but the X is not', () => {
			const p = L.latLng(tl.lat, tl.lng - 5);
			map.panInside(p, 0, {animate: false});
			expect(map.getBounds().contains(p)).to.be(true);
			expect(map.getCenter().lng).to.not.eql(center.lng);
			const dy = map.getCenter().lat - center.lat;
			expect(dy).to.be.lessThan(1.0E-9);
		});

		it('pans correctly when padding takes up more than half the display bounds', () => {
			const oldCenter = map.project(center);
			const targetOffset = L.point(0, -5); // arbitrary point above center
			const target = oldCenter.add(targetOffset);
			const paddingOffset = L.point(0, 15);
			const padding = map.getSize().divideBy(2) // half size
			  .add(paddingOffset); // padding more than half the display bounds (replicates issue #7445)
			map.panInside(map.unproject(target), {paddingBottomRight: [0, padding.y], animate: false});
			const offset = map.project(map.getCenter()).subtract(oldCenter); // distance moved during the pan
			const result = paddingOffset.add(targetOffset).subtract(offset);
			expect(result.trunc()).to.eql(L.point(0, 0));
		});
	});

	describe('#DOM events', () => {
		beforeEach(() => {
			map.setView([0, 0], 0);
		});

		it('DOM events propagate from polygon to map', () => {
			const spy = sinon.spy();
			map.on('mousemove', spy);
			const layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			happen.mousemove(layer._path);
			expect(spy.calledOnce).to.be.ok();
		});

		it('DOM events propagate from marker to map', () => {
			const spy = sinon.spy();
			map.on('mousemove', spy);
			const layer = L.marker([1, 2]).addTo(map);
			happen.mousemove(layer._icon);
			expect(spy.calledOnce).to.be.ok();
		});

		it('DOM events fired on marker can be cancelled before being caught by the map', () => {
			const mapSpy = sinon.spy();
			const layerSpy = sinon.spy();
			map.on('mousemove', mapSpy);
			const layer = L.marker([1, 2]).addTo(map);
			layer.on('mousemove', L.DomEvent.stopPropagation).on('mousemove', layerSpy);
			happen.mousemove(layer._icon);
			expect(layerSpy.calledOnce).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it('DOM events fired on polygon can be cancelled before being caught by the map', () => {
			const mapSpy = sinon.spy();
			const layerSpy = sinon.spy();
			map.on('mousemove', mapSpy);
			const layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('mousemove', L.DomEvent.stopPropagation).on('mousemove', layerSpy);
			happen.mousemove(layer._path);
			expect(layerSpy.calledOnce).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it('mouseout is forwarded if fired on the original target', () => {
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			const layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			const other = L.polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			other.on('mouseout', otherSpy);
			happen.mouseout(layer._path, {relatedTarget: container});
			expect(mapSpy.called).not.to.be.ok();
			expect(otherSpy.called).not.to.be.ok();
			expect(layerSpy.calledOnce).to.be.ok();
		});

		it('mouseout is forwarded when using a DivIcon', () => {
			const icon = L.divIcon({
				html: '<p>this is text in a child element</p>',
				iconSize: [100, 100]
			});
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon}).addTo(map);
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			happen.mouseout(layer._icon, {relatedTarget: container});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.calledOnce).to.be.ok();
		});

		it('mouseout is not forwarded if relatedTarget is a target\'s child', () => {
			const icon = L.divIcon({
				html: '<p>this is text in a child element</p>',
				iconSize: [100, 100]
			});
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon}).addTo(map),
			    child = layer._icon.querySelector('p');
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			happen.mouseout(layer._icon, {relatedTarget: child});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
		});

		it('mouseout is not forwarded if fired on target\'s child', () => {
			const icon = L.divIcon({
				html: '<p>this is text in a child element</p>',
				iconSize: [100, 100]
			});
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = L.marker([1, 2], {icon}).addTo(map),
			    child = layer._icon.querySelector('p');
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			happen.mouseout(child, {relatedTarget: layer._icon});
			expect(mapSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
		});

		it('mouseout is not forwarded to layers if fired on the map', () => {
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			const layer = L.polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			const other = L.polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			other.on('mouseout', otherSpy);
			happen.mouseout(container);
			expect(otherSpy.called).not.to.be.ok();
			expect(layerSpy.called).not.to.be.ok();
			expect(mapSpy.calledOnce).to.be.ok();
		});

		it('preclick is fired before click on marker and map', () => {
			let called = 0;
			const layer = L.marker([1, 2], {bubblingMouseEvents: true}).addTo(map);
			layer.on('preclick', (e) => {
				expect(called++).to.eql(0);
				expect(e.latlng).to.ok();
			});
			layer.on('click', (e) => {
				expect(called++).to.eql(2);
				expect(e.latlng).to.ok();
			});
			map.on('preclick', (e) => {
				expect(called++).to.eql(1);
				expect(e.latlng).to.ok();
			});
			map.on('click', (e) => {
				expect(called++).to.eql(3);
				expect(e.latlng).to.ok();
			});
			happen.click(layer._icon);
			expect(called).to.eql(4);
		});

		it('prevents default action of contextmenu if there is any listener', function () {
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
			const spy = sinon.spy();
			map.on('contextmenu', (e) => {
				spy(e.originalEvent.defaultPrevented);
			});
			const marker = L.circleMarker([0, 0]).addTo(map);

			happen.at('contextmenu', 0, 0); // first

			happen.at('contextmenu', marker._point.x, marker._point.y); // second  (#5995)

			expect(spy.callCount).to.be(2);
			expect(spy.firstCall.lastArg).to.be.ok();
			expect(spy.secondCall.lastArg).to.be.ok();
		});
	});

	describe('#getScaleZoom && #getZoomScale', () => {
		it('converts zoom to scale and vice versa and returns the same values', () => {
			const toZoom = 6.25;
			const fromZoom = 8.5;
			const scale = map.getZoomScale(toZoom, fromZoom);
			expect(Math.round(map.getScaleZoom(scale, fromZoom) * 100) / 100).to.eql(toZoom);
		});

		it('converts scale to zoom and returns Infinity if map crs.zoom returns NaN', () => {
			const stub = sinon.stub(map.options.crs, 'zoom');
			stub.returns(NaN);
			const scale = 0.25;
			const fromZoom = 8.5;
			expect(map.getScaleZoom(scale, fromZoom)).to.eql(Infinity);
			map.options.crs.zoom.restore();
		});
	});

	describe('#getZoom', () => {
		it('returns undefined if map not initialized', () => {
			expect(map.getZoom()).to.be(undefined);
		});

		it('returns undefined if map not initialized but layers added', () => {
			map.addLayer(L.tileLayer(''));
			expect(map.getZoom()).to.be(undefined);
		});
	});

	describe('#Geolocation', () => {
		it('doesn\'t throw error if location is found and map is not existing', () => {
			const fn = map._handleGeolocationResponse.bind(map);
			map.remove();
			map = null;
			expect(() => {
				fn({coords: {latitude: 40.415296, longitude: 10.7419264, accuracy: 1129.5646101470752}});
			}).to.not.throwException();
		});
		it('doesn\'t throw error if location is not found and map is not existing', () => {
			map._locateOptions = {setView: true};
			const fn = map._handleGeolocationError.bind(map);
			map.remove();
			map = null;
			expect(() => {
				fn({coords: {latitude: 40.415296, longitude: 10.7419264, accuracy: 1129.5646101470752}});
			}).to.not.throwException();
		});
	});

	describe('#disableClickPropagation', () => {
		it('does not break if element is not in the DOM anymore', () => {
			map.setView([0, 0], 0);
			const parent = document.createElement('div');
			const child = document.createElement('div');
			parent.appendChild(child);
			container.appendChild(parent);
			L.DomEvent.on(child, 'click', () => {
				L.DomUtil.remove(parent);
			});
			expect(() => {
				happen.once(child, {type: 'click'});
			}).to.not.throwException();
		});
	});

	describe('#distance', () => {
		it('measure distance in meters', () => {
			const LA = L.latLng(34.0485672098387, -118.217781922035);
			const columbus = L.latLng(39.95715687063701, -83.00205705857633);

			expect(map.distance(LA, columbus)).to.be.within(3173910, 3173915);
		});

		it('accurately measure in small distances', () => {
			const p1 = L.latLng(40.160857881285416, -83.00841851162649);
			const p2 = L.latLng(40.16246493902907, -83.008622359483);

			expect(map.distance(p1, p2)).to.be.within(175, 185);
		});

		it('accurately measure in long distances', () => {
			const canada = L.latLng(60.01810635103154, -112.19675246283015);
			const newZeland = L.latLng(-42.36275164460971, 172.39309066597883);

			expect(map.distance(canada, newZeland)).to.be.within(13274700, 13274800);
		});

		it('throw with undefined values', () => {
			expect(map.distance).withArgs(undefined, undefined).to.throwException();
		});

		it('throw with infinity values', () => {
			expect(map.distance).withArgs(Infinity, Infinity).to.throwException();
		});

		it('throw with only 1 lat', () => {
			expect(map.distance).withArgs(20, 50).to.throwException();
		});

		it('return 0 with 2 same latLng', () => {
			const p = L.latLng(20, 50);

			expect(map.distance(p, p)).to.eql(0);
		});
	});

	describe('#containerPointToLayerPoint', () => {
		it('return same point of LayerPoint is 0, 0', () => {
			expect(map.containerPointToLayerPoint(L.point(25, 25))).to.eql(L.point(25, 25));
		});

		it('return point relative to LayerPoint', (done) => {
			map.setView([20, 20], 2);

			map.once('moveend', () => {
				expect(map.containerPointToLayerPoint(L.point(30, 30))).to.eql(L.point(80, 80));
				done();
			});

			map.panBy([50, 50], {animate: false});
		});
	});

	describe('#layerPointToContainerPoint', () => {
		it('return same point of ContainerPoint is 0, 0', () => {
			expect(map.layerPointToContainerPoint(L.point(25, 25))).to.eql(L.point(25, 25));
		});

		it('return point relative to ContainerPoint', (done) => {
			map.setView([20, 20], 2);

			map.once('moveend', () => {
				expect(map.layerPointToContainerPoint(L.point(30, 30))).to.eql(L.point(-20, -20));
				done();
			});

			map.panBy([50, 50], {animate: false});
		});
	});

	describe('_addZoomLimit', () => {
		it('update zoom levels when min zoom is a number in a layer that is added to map', () => {
			map._addZoomLimit(L.tileLayer('', {minZoom: 4}));
			expect(map._layersMinZoom).to.be(4);
		});

		it('update zoom levels when max zoom is a number in a layer that is added to map', () => {
			map._addZoomLimit(L.tileLayer('', {maxZoom: 10}));
			expect(map._layersMaxZoom).to.be(10);
		});

		it('update zoom levels when min zoom is a number in two layers that are added to map', () => {
			map._addZoomLimit(L.tileLayer('', {minZoom: 6}));
			map._addZoomLimit(L.tileLayer('', {minZoom: 4}));
			expect(map._layersMinZoom).to.be(4);
		});

		it('update zoom levels when max zoom is a number in two layers that are added to map', () => {
			map._addZoomLimit(L.tileLayer('', {maxZoom: 10}));
			map._addZoomLimit(L.tileLayer('', {maxZoom: 8}));
			expect(map._layersMaxZoom).to.be(10);
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it('update zoom levels when min zoom is NaN in a layer that is added to map, so that min zoom becomes NaN,', () => {
			map._addZoomLimit(L.tileLayer('', {minZoom: NaN}));
			expect(isNaN(map._layersMinZoom)).to.be(true);
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it('update zoom levels when max zoom is NaN in a layer that is added to map, so that max zoom becomes NaN', () => {
			map._addZoomLimit(L.tileLayer('', {maxZoom: NaN}));
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
		it('update zoom levels when max zoom is NaN in at least one of many layers that are added to map, so that max zoom becomes NaN', () => {
			map._addZoomLimit(L.tileLayer('', {maxZoom: 10}));
			map._addZoomLimit(L.tileLayer('', {maxZoom: 8}));
			map._addZoomLimit(L.tileLayer('', {maxZoom: NaN}));
			expect(isNaN(map._layersMaxZoom)).to.be(true);
		});

		it('doesn\'t update zoom levels when min and max zoom are both NaN in a layer that is added to map', () => {
			map._addZoomLimit(L.tileLayer('', {minZoom: NaN, maxZoom: NaN}));
			expect(map._layersMinZoom === undefined && map._layersMaxZoom === undefined).to.be(true);
		});
	});

	describe('#containerPointToLatLng', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.containerPointToLatLng();
			}).to.throwError();
		});

		it('returns geographical coordinate for point relative to map container', () => {
			const center = L.latLng(10, 10);
			map.setView(center, 50);
			const p = map.containerPointToLatLng(L.point(200, 200));
			expect(p.lat).to.be.within(10.0000000, 10.0000001);
			expect(p.lng).to.be.within(10.0000000, 10.0000001);
		});
	});


	describe('#latLngToContainerPoint', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.latLngToContainerPoint();
			}).to.throwError();
		});

		it('returns point relative to map container for geographical coordinate', () => {
			const center = L.latLng(10, 10);
			map.setView(center);
			const p = map.latLngToContainerPoint(center);
			expect(p.x).to.be.equal(200);
			expect(p.y).to.be.equal(200);
		});
	});

	describe('#panTo', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.panTo();
			}).to.throwError();
		});

		it('pans the map to accurate location', () => {
			const center = L.latLng([50, 30]);
			expect(map.panTo(center)).to.be(map);
			expect(map.getCenter().distanceTo(center)).to.be.lessThan(5);
		});
	});

	describe('#panInsideBounds', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.panInsideBounds();
			}).to.throwError();
		});

		it('throws if passed invalid bounds', () => {
			expect(() => {
				map.panInsideBounds(0, 0);
			}).to.throwError();
		});

		it('doesn\'t pan if already in bounds', () => {
			map.setView([0, 0]);
			const bounds = L.latLngBounds([[-1, -1], [1, 1]]);
			const expectedCenter = L.latLng([0, 0]);
			expect(map.panInsideBounds(bounds)).to.be(map);
			expect(map.getCenter()).to.be.nearLatLng(expectedCenter);
		});

		it('pans to closest view in bounds', () => {
			const bounds = L.latLngBounds([[41.8, -87.6], [40.7, -74]]);
			const expectedCenter = L.latLng([41.59452223189, -74.2738647460]);
			map.setView([50.5, 30.5], 10);
			expect(map.panInsideBounds(bounds)).to.be(map);
			expect(map.getCenter()).to.be.nearLatLng(expectedCenter);
		});
	});

	describe('#latLngToLayerPoint', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.latLngToLayerPoint();
			}).to.throwError();
		});

		it('returns the corresponding pixel coordinate relative to the origin pixel', () => {
			const center = L.latLng([10, 10]);
			map.setView(center, 0);
			const p = map.latLngToLayerPoint(center);
			expect(p.x).to.be.equal(200);
			expect(p.y).to.be.equal(200);
		});
	});

	describe('#layerPointToLatLng', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.layerPointToLatLng();
			}).to.throwError();
		});

		it('returns the corresponding geographical coordinate for a pixel coordinate relative to the origin pixel', () => {
			const center = L.latLng(10, 10);
			map.setView(center, 10);
			const point = L.point(200, 200);
			const latlng = map.layerPointToLatLng(point);
			expect(latlng).to.be.nearLatLng([9.9999579356371, 10.000305175781252]);
		});
	});

	describe('#locate', () => {
		let foundSpy;
		let errorSpy;

		let getCurrentPosSpy;
		let watchPosSpy;

		const geolocationStub = {
			geolocation: {
				getCurrentPosition(onSuccess) {
					onSuccess(
						{
							coords:
							{
								latitude: 50,
								longitude: 50,
								accuracy: 14
							},

							timestamp: 1670000000000
						});

					getCurrentPosSpy();
				},

				watchPosition(onSuccess) {
					onSuccess(
						{
							coords:
							{
								latitude: 25,
								longitude: 25,
								accuracy: 14
							},

							timestamp: 1660000000000
						});

					watchPosSpy();

					return 25;
				}
			}
		};

		beforeEach(() => {
			foundSpy = sinon.spy();
			errorSpy = sinon.spy();

			getCurrentPosSpy = sinon.spy();
			watchPosSpy = sinon.spy();
		});

		it('returns \'Geolocation not found!\' error if geolocation can\'t be found', () => {
			Object.defineProperty(window, 'navigator', {
				value: {}
			});

			map.on('locationerror', (error) => {
				expect(error.code).to.be(0);
				expect(error.message).to.eql('Geolocation error: Geolocation not supported..');

				errorSpy();
			});

			map.on('locationfound', foundSpy);

			map.locate({setView: true});

			expect(errorSpy.called).to.be.ok();
			expect(foundSpy.called).to.not.be.ok();
		});

		it('sets map view to geolocation coords', () => {
			Object.defineProperty(window, 'navigator', {
				value: geolocationStub
			});

			let expectedBounds;
			const expectedLatLngs = [50, 50];

			map.on('locationfound', (data) => {
				expect(data.latlng).to.be.nearLatLng(expectedLatLngs);
				expect(data.timestamp).to.be(1670000000000);

				expectedBounds = data.bounds;

				foundSpy();
			});

			map.on('locationerror', errorSpy);

			map.locate({setView: true});

			expect(errorSpy.called).to.not.be.ok();
			expect(foundSpy.called).to.be.ok();

			expect(getCurrentPosSpy.called).to.be.ok();
			expect(watchPosSpy.called).to.not.be.ok();

			expect(map.getCenter()).to.be.nearLatLng(expectedLatLngs);

			const currentBounds = map.getBounds();
			expect(currentBounds._southWest.distanceTo(expectedBounds._southWest)).to.be.lessThan(8);
			expect(currentBounds._northEast.distanceTo(expectedBounds._northEast)).to.be.lessThan(8);
		});

		it('sets map view to geolocation coords and returns location watch ID when watch is true', () => {
			Object.defineProperty(window, 'navigator', {
				value: geolocationStub
			});

			let expectedBounds;
			const expectedLatLngs = [25, 25];

			map.on('locationfound', (data) => {
				expect(data.latlng).to.be.nearLatLng(expectedLatLngs);
				expect(data.timestamp).to.be(1660000000000);

				expectedBounds = data.bounds;

				foundSpy();
			});

			map.on('locationerror', errorSpy);

			map.locate({setView: true, watch: true});

			expect(errorSpy.called).to.not.be.ok();
			expect(foundSpy.called).to.be.ok();

			expect(getCurrentPosSpy.called).to.not.be.ok();
			expect(watchPosSpy.called).to.be.ok();

			expect(map.getCenter()).to.be.nearLatLng(expectedLatLngs);

			const currentBounds = map.getBounds();
			expect(currentBounds._southWest.distanceTo(expectedBounds._southWest)).to.be.lessThan(20);
			expect(currentBounds._northEast.distanceTo(expectedBounds._northEast)).to.be.lessThan(20);

			expect(map._locationWatchId).to.eql(25);
		});

		it('does not set map view by default', () => {
			Object.defineProperty(window, 'navigator', {
				value: geolocationStub
			});

			map.on('locationfound', (data) => {
				expect(data.latlng).to.be.nearLatLng([50, 50]);
				expect(data.timestamp).to.be(1670000000000);

				foundSpy();
			});

			map.on('locationerror', errorSpy);

			map.locate();

			expect(errorSpy.called).to.not.be.ok();
			expect(foundSpy.called).to.be.ok();

			expect(getCurrentPosSpy.called).to.be.ok();
			expect(watchPosSpy.called).to.not.be.ok();

			expect(map._loaded).to.not.be.ok();
		});
	});

	describe('#mouseEventToLatLng', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.mouseEventToLatLng({clientX: 10, clientY: 10});
			}).to.throwException();
		});

		it('returns geographical coordinate where the event took place.', () => {
			let latlng;
			map.setView([0, 0], 0);
			map.on('click', (e) => {
				latlng = map.mouseEventToLatLng(e.originalEvent);
			});
			happen.at('click', 100, 100);

			const expectedCenter = [80.178713496, -140.625];
			expect(latlng).to.be.nearLatLng(expectedCenter);
		});
	});

	describe('#stopLocate', () => {
		it('clears the watch handler registered with the geolocation API', () => {
			const locationWatchId = 123;
			map._locationWatchId = locationWatchId;
			navigator.geolocation.clearWatch = sinon.spy();

			map.stopLocate();

			expect(navigator.geolocation.clearWatch.calledOnceWith(locationWatchId)).to.equal(true);
		});

		it('resets the setView option to false', () => {
			map._locateOptions = {setView: true};

			map.stopLocate();

			expect(map._locateOptions.setView).to.equal(false);
		});
	});

	describe('#mouseEventToContainerPoint', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.mouseEventToContainerPoint();
			}).to.throwError();
		});

		it('returns the pixel coordinate relative to the map container where the event took place', () => {
			const mouseEvent = new MouseEvent('mouseenter', {
				clientX: 1,
				clientY: 2
			});
			const p = map.mouseEventToContainerPoint(mouseEvent);
			expect(p.x).to.be.equal(1);
			expect(p.y).to.be.equal(2);
		});
	});

	describe('#panBy', () => {
		const offset = L.point(1000, 1000);

		it('throws if map is not set before', () => {
			expect(() => {
				map.panBy(offset);
			}).to.throwError();
		});

		it('pans the map by given offset', () => {
			const center = L.latLng([0, 0]);
			map.setView(center, 7);
			const offsetCenterPoint = map.options.crs.latLngToPoint(center, 7).add(offset);
			const target = map.options.crs.pointToLatLng(offsetCenterPoint, 7);

			expect(map.panBy(offset, {animate: false})).to.be(map);
			expect(map.getCenter().distanceTo(target)).to.be.lessThan(5);
			expect(map.getCenter()).to.be.nearLatLng([-10.9196177602, 10.9863281250]);
		});
	});
});
