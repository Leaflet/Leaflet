import {Map, latLng, Point, LatLngBounds, TileLayer, Handler, DomEvent, Bounds, Layer, control as lControl, GridLayer, Util, Marker, Polygon, DivIcon, CircleMarker, Canvas} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Map', () => {
	let container,
	    map;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);
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
			expect(spy.called).to.be.true;
		});

		it('fires no unload event if not loaded', () => {
			map.on('unload', spy);
			map.remove();
			map = null;
			expect(spy.called).not.to.be.true;
		});

		describe('corner case checking', () => {
			it('throws an exception upon reinitialization', () => {
				expect(() => new Map(container))
				  .to.throw('Map container is already initialized.');
			});

			it('throws an exception if a container is not found', () => {
				expect(() => new Map('nonexistentdivelement'))
				  .to.throw('Map container not found.');
			});
		});

		it('undefines container._leaflet_id', () => {
			expect(container._leaflet_id).to.be.ok;
			map.remove();
			map = null;
			expect(container._leaflet_id).to.equal(undefined);
		});

		it('unbinds events', () => {
			// before actual test: make sure that events are ok
			map.setView([0, 0], 0);
			map.on('click', spy);
			UIEventSimulator.fire('click', container);
			expect(spy.called).to.be.true;

			// actual test
			spy = sinon.spy();
			map.on('click dblclick mousedown mouseup mousemove', spy);
			map.remove();
			map = null;

			UIEventSimulator.fire('click', container);
			UIEventSimulator.fire('dblclick', container);
			UIEventSimulator.fire('mousedown', container);
			UIEventSimulator.fire('mouseup', container);
			UIEventSimulator.fire('mousemove', container);

			expect(spy.called).to.be.false;
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
			const map2 = new Map(container);

			expect(() => {
				map.remove();
			}).to.throw();

			map2.remove(); // clean up
			map = null;
		});
	});

	describe('#getCenter', () => {
		it('throws if not set before', () => {
			expect(() => {
				map.getCenter();
			}).to.throw();
		});

		it('returns a precise center when zoomed in after being set (#426)', () => {
			const center = latLng(10, 10);
			map.setView(center, 1);
			map.setZoom(19);
			expect(map.getCenter()).to.eql(center);
		});

		it('returns correct center after invalidateSize (#1919)', () => {
			const center = latLng(10, 10);
			map.setView(center, 1);
			map.invalidateSize();
			expect(map.getCenter()).not.to.eql(center);
		});

		it('returns a new object that can be mutated without affecting the map', () => {
			map.setView([10, 10], 1);
			const center = map.getCenter();
			center.lat += 10;
			expect(map.getCenter()).to.eql(latLng(10, 10));
		});
	});

	describe('#whenReady', () => {
		describe('when the map has not yet been loaded', () => {
			it('calls the callback when the map is loaded', () => {
				const spy = sinon.spy();
				map.whenReady(spy);
				expect(spy.called).to.be.false;

				map.setView([0, 0], 1);
				expect(spy.called).to.be.true;
			});
		});

		describe('when the map has already been loaded', () => {
			it('calls the callback immediately', () => {
				const spy = sinon.spy();
				map.setView([0, 0], 1);
				map.whenReady(spy);

				expect(spy.called).to.be.true;
			});
		});
	});

	describe('#setView', () => {
		it('sets the view of the map', () => {
			expect(map.setView([51.505, -0.09], 13)).to.equal(map);
			expect(map.getZoom()).to.equal(13);
			expect(map.getCenter().distanceTo([51.505, -0.09])).to.be.lessThan(5);
		});

		it('can be passed without a zoom specified', () => {
			map.setZoom(13);
			expect(map.setView([51.605, -0.11])).to.equal(map);
			expect(map.getZoom()).to.equal(13);
			expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
		});

		it('limits initial zoom when no zoom specified', () => {
			map.options.maxZoom = 20;
			map.setZoom(100);
			expect(map.setView([51.605, -0.11])).to.equal(map);
			expect(map.getZoom()).to.equal(20);
			expect(map.getCenter().distanceTo([51.605, -0.11])).to.be.lessThan(5);
		});

		it('defaults to zoom passed as map option', () => {
			const map = new Map(document.createElement('div'), {zoom: 13});
			const zoom = map.setView([51.605, -0.11]).getZoom();
			map.remove(); // clean up
			expect(zoom).to.equal(13);
		});

		it('passes duration option to panBy', () => {
			const map = new Map(document.createElement('div'), {zoom: 13, center: [0, 0]});
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

				expect(map.getZoom()).to.equal(15);
			});

			it('overwrites zoom passed as map option', () => {
				const map2 = new Map(document.createElement('div'), {zoom: 13});
				map2.setZoom(15);
				const zoom = map2.getZoom();

				map2.remove(); // clean up
				expect(zoom).to.equal(15);
			});
		});

		describe('when the map has been loaded', () => {
			beforeEach(() => {
				map.setView([0, 0], 0); // loads map
			});

			it('set zoom level is limited by max zoom', () => {
				map.options.maxZoom = 10;
				map.setZoom(15);

				expect(map.getZoom()).to.equal(10);
			});

			it('does not overwrite zoom passed as map option', () => {
				const map2 = new Map(document.createElement('div'), {zoom: 13});
				map2.setView([0, 0]);
				map2.setZoom(15);
				const zoom = map2.getZoom();

				map2.remove(); // clean up
				expect(zoom).to.equal(13);
			});
		});

		it('changes previous zoom level', () => {
			map.zoom = 10;
			map.setZoom(15);

			expect(map.getZoom()).to.equal(15);
		});

		it('can be passed without a zoom specified and keep previous zoom', () => {
			const prevZoom = map.getZoom();
			map.setZoom();

			expect(map.getZoom()).to.equal(prevZoom);
		});

		it('can be passed with a zoom level of undefined and keep previous zoom', () => {
			const prevZoom = map.getZoom();
			map.setZoom(undefined);

			expect(map.getZoom()).to.equal(prevZoom);
		});

		it('can be passed with a zoom level of infinity', () => {
			map.setZoom(Infinity);

			expect(map.getZoom()).to.equal(Infinity);
		});
	});

	describe('#stop', () => {
		it('does not try to stop the animation if it wasn\'t set before', () => {
			map.setView([50, 50], 10);
			map.stop = sinon.spy();
			map.panTo([10, 10], 10);
			expect(map.stop.called).to.be.false;
		});

		it('stops the execution of the flyTo animation', () => {
			map.setView([0, 0]);
			map.stop = sinon.spy();
			map.flyTo([51.505, -0.09]);
			map.stop();
			expect(map.stop.calledOnce).to.be.true;
		});

		it('stops the execution of the panTo animation', () => {
			map.setView([0, 0]);
			map.stop = sinon.spy();
			map.panTo([51.505, -0.09]);
			map.stop();
			expect(map.stop.calledOnce).to.be.true;
		});
	});

	describe('#setZoomAround', () => {
		beforeEach(() => {
			map.setView([0, 0], 0); // loads map
		});

		it('pass Point and change pixel in view', () => {
			const point = new Point(5, 5);
			map.setZoomAround(point, 5);

			expect(map.getBounds().contains(map.options.crs.pointToLatLng(point, 5))).to.be.false;
		});

		it('pass Point and change pixel in view at high zoom', () => {
			const point = new Point(5, 5);
			map.setZoomAround(point, 18);

			expect(map.getBounds().contains(map.options.crs.pointToLatLng(point, 18))).to.be.false;
		});

		it('pass latLng and keep specified latLng in view', () => {
			map.setZoomAround([5, 5], 5);

			expect(map.getBounds().contains([5, 5])).to.be.true;
		});

		it('pass latLng and keep specified latLng in view at high zoom fails', () => {
			map.setZoomAround([5, 5], 12); // usually fails around 9 zoom level

			expect(map.getBounds().contains([5, 5])).to.be.false;
		});

		it('throws if map is not loaded', () => {
			const unloadedMap = new Map(document.createElement('div'));

			expect(() => unloadedMap.setZoomAround([5, 5], 4)).to.throw();
		});

		it('throws if zoom is empty', () => {
			expect(() => map.setZoomAround([5, 5])).to.throw();
		});

		it('throws if zoom is undefined', () => {
			expect(() => map.setZoomAround([5, 5], undefined)).to.throw();
		});

		it('throws if latLng is undefined', () => {
			expect(() => map.setZoomAround([undefined, undefined], 4)).to.throw();
		});

		it('does not throw if latLng is infinity', () => {
			map.setView([5, 5]);
			map.setZoomAround([Infinity, Infinity], 4);

			expect(map.getCenter()).to.be.ok;
		});
	});

	describe('#getBounds', () => {
		it('is safe to call from within a moveend callback during initial load (#1027)', () => {
			const map = new Map(document.createElement('div'));
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

		it('returns multiples of zoomSnap when zoomSnap > 0', () => {
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
			const bounds = new LatLngBounds(
				[62.18475569507688, 6.926335173954951],
				[62.140483526511694, 6.923933370740089]);
			const padding = new Point(-50, -50);

			// control case: default crs
			let boundsZoom = map.getBoundsZoom(bounds, false, padding);
			expect(boundsZoom).to.eql(9);

			// test case: EPSG:25833 (mocked, for simplicity)
			// The following coordinates are bounds projected with proj4leaflet crs = EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs
			const crsMock = sinon.mock(map.options.crs);
			crsMock.expects('latLngToPoint')
				.withExactArgs(bounds.getNorthWest(), 16)
				.returns(new Point(7800503.059925064, 6440062.353052008));
			crsMock.expects('latLngToPoint')
				.withExactArgs(bounds.getSouthEast(), 16)
				.returns(new Point(7801987.203481699, 6425186.447901004));
			boundsZoom = map.getBoundsZoom(bounds, false, padding);
			crsMock.restore();

			crsMock.verify(); // ensure that latLngToPoint was called with expected args
			expect(boundsZoom).to.eql(7); // result expected for EPSG:25833
		});

		it('respects the \'inside\' parameter', () => {
			container.style.height = height;
			container.style.width = '1024px'; // Make sure the width is defined
			expect(map.getBoundsZoom(wideBounds, false, padding)).to.be.equal(17);
			expect(map.getBoundsZoom(wideBounds, true, padding)).to.be.equal(20);
		});
	});

	describe('#setMaxBounds', () => {
		it('aligns pixel-wise map view center with maxBounds center if it cannot move view bounds inside maxBounds (#1908)', () => {
			// large view, cannot fit within maxBounds
			container.style.width = container.style.height = '1000px';
			// maxBounds
			const bounds = new LatLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			// set view outside
			map.setView(latLng([53.0, 0.15]), 12, {animate: false});
			// get center of bounds in pixels
			const boundsCenter = map.project(bounds.getCenter()).round();
			expect(map.project(map.getCenter()).round()).to.eql(boundsCenter);
		});

		it('moves map view within maxBounds by changing one coordinate', () => {
			// small view, can fit within maxBounds
			container.style.width = container.style.height = '200px';
			// maxBounds
			const bounds = new LatLngBounds([51, -0.2], [52, 0.2]);
			map.setMaxBounds(bounds, {animate: false});
			// set view outside maxBounds on one direction only
			// leaves untouched the other coordinate (that is not already centered)
			const initCenter = [53.0, 0.1];
			map.setView(latLng(initCenter), 16, {animate: false});
			// one pixel coordinate hasn't changed, the other has
			const pixelCenter = map.project(map.getCenter()).round();
			const pixelInit = map.project(initCenter).round();
			expect(pixelCenter.x).to.eql(pixelInit.x);
			expect(pixelCenter.y).not.to.eql(pixelInit.y);
			// the view is inside the bounds
			expect(bounds.contains(map.getBounds())).to.be.true;
		});

		it('remove listeners when called without arguments', (done) => {
			new TileLayer('', {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = '500px';
			const bounds = new LatLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.setMaxBounds(bounds, {animate: false});
			map.setMaxBounds();
			// set view outside
			const center = latLng([0, 0]);
			map.once('moveend', () => {
				expect(center.equals(map.getCenter())).to.be.true;
				done();
			});
			map.setView(center, 18, {animate: false});
		});

		it('does not try to remove listeners if it wasn\'t set before', () => {
			new TileLayer('', {minZoom: 0, maxZoom: 20}).addTo(map);
			container.style.width = container.style.height = '500px';
			const bounds = new LatLngBounds([51.5, -0.05], [51.55, 0.05]);
			map.off = sinon.spy();
			map.setMaxBounds(bounds, {animate: false});
			expect(map.off.called).not.to.be.true;
		});

		it('avoid subpixel / floating point related wobble (#8532)', (done) => {
			map.setView([50.450036, 30.5241361], 13);

			const spy = sinon.spy();
			map.on('moveend', spy);
			map.setMaxBounds(map.getBounds());

			// Unfortunately this is one of those tests where we need to allow at least one animation tick
			setTimeout(() => {
				expect(spy.called).to.be.false;
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

				expect(spy.called).to.be.false;
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
				expect(spy.calledTwice).to.be.true;

				const postSpy = sinon.spy();
				map.on('zoomlevelschange', postSpy);

				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(postSpy.called).to.be.false;
			});

			it('fire \'zoomlevelschange\' but do not change zoom if max/min zoom is less/more current zoom', () => {
				map.setMinZoom(2);
				map.setMaxZoom(7);

				expect(map.getZoom()).to.eql(4);
				expect(map.getMinZoom()).to.eql(2);
				expect(map.getMaxZoom()).to.eql(7);
				expect(spy.calledTwice).to.be.true;
			});
		});

		it('reset min/max zoom if set to undefined or missing param', () => {
			map.setMinZoom(undefined);
			map.setMaxZoom();

			expect(map.options.minZoom).to.equal(undefined);
			expect(map.options.maxZoom).to.equal(undefined);

			expect(map.getMinZoom()).to.equal(0); // min layer zoom used instead
			expect(map.getMaxZoom()).to.equal(Infinity); // max layer zoom used instead
		});

		it('allow infinity to be passed', () => {
			map.setMinZoom(Infinity);
			map.setMaxZoom(Infinity);

			expect(map.getMinZoom()).to.equal(Infinity);
			expect(map.getMaxZoom()).to.equal(Infinity);
		});
	});

	describe('#getMinZoom and #getMaxZoom', () => {
		describe('#getMinZoom', () => {
			it('returns 0 if not set by Map options or TileLayer options', () => {
				expect(map.getMinZoom()).to.equal(0);
			});
		});

		it('minZoom and maxZoom options overrides any minZoom and maxZoom set on layers', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = new Map(container, {minZoom: 2, maxZoom: 20});

			new TileLayer('', {minZoom: 4, maxZoom: 10}).addTo(map);
			new TileLayer('', {minZoom: 6, maxZoom: 17}).addTo(map);
			new TileLayer('', {minZoom: 0, maxZoom: 22}).addTo(map);

			expect(map.getMinZoom()).to.equal(2);
			expect(map.getMaxZoom()).to.equal(20);
		});

		it('layer minZoom overrides map zoom if map has no minZoom set and layer minZoom is bigger than map zoom', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = new Map(container, {zoom: 10});

			new TileLayer('', {minZoom: 15}).addTo(map);

			expect(map.getMinZoom()).to.equal(15);
		});

		it('layer maxZoom overrides map zoom if map has no maxZoom set and layer maxZoom is smaller than map zoom', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = new Map(container, {zoom: 20});

			new TileLayer('', {maxZoom: 15}).addTo(map);

			expect(map.getMaxZoom()).to.equal(15);
		});

		it('map\'s zoom is adjusted to layer\'s minZoom even if initialized with smaller value', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = new Map(container, {zoom: 10});

			new TileLayer('', {minZoom: 15}).addTo(map);

			expect(map.getZoom()).to.equal(15);
		});

		it('map\'s zoom is adjusted to layer\'s maxZoom even if initialized with larger value', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = new Map(container, {zoom: 20});

			new TileLayer('', {maxZoom: 15}).addTo(map);

			expect(map.getZoom()).to.equal(15);
		});
	});

	describe('#addHandler', () => {
		function getHandler(callback = () => {}) {
			return Handler.extend({
				addHooks() {
					DomEvent.on(window, 'click', this.handleClick, this);
				},

				removeHooks() {
					DomEvent.off(window, 'click', this.handleClick, this);
				},

				handleClick: callback
			});
		}

		it('checking enabled method', () => {
			map.addHandler('clickHandler', getHandler());

			expect(map.clickHandler.enabled()).to.eql(false);

			map.clickHandler.enable();
			expect(map.clickHandler.enabled()).to.eql(true);

			map.clickHandler.disable();
			expect(map.clickHandler.enabled()).to.eql(false);
		});

		it('automatically enabled, when has a property named the same as the handler', () => {
			map.remove();
			map = new Map(container, {clickHandler: true});

			map.addHandler('clickHandler', getHandler());

			expect(map.clickHandler.enabled()).to.eql(true);
		});

		it('checking handling events when enabled/disabled', () => {
			const spy = sinon.spy();
			map.addHandler('clickHandler', getHandler(spy));

			UIEventSimulator.fire('click', window);
			UIEventSimulator.fire('click', window);
			expect(spy.called).not.to.be.true;

			map.clickHandler.enable();

			UIEventSimulator.fire('click', window);
			expect(spy.called).to.be.true;

			map.clickHandler.disable();

			UIEventSimulator.fire('click', window);
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

			expect(map.getPane('overlayPane')).to.not.equal(overlayPane);
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
			const map2 = new Map(document.createElement('div'));
			map2.remove();

			expect(map2.getPanes()).to.eql({});
		});
	});

	describe('#getContainer', () => {
		it('return container object', () => {
			expect(map.getContainer()._leaflet_id).to.be.ok;
		});

		it('return undefined on empty container id', () => {
			const container2 = createContainer();
			const map2 = new Map(container2);
			map2.remove(); // clean up

			expect(map2.getContainer()._leaflet_id).to.eql(undefined);
		});
	});

	describe('#getSize', () => {
		it('return map size in pixels', () => {
			expect(map.getSize()).to.eql(new Point(400, 400));
		});

		it('return map size if not specified', () => {
			const map2 = new Map(document.createElement('div'));

			expect(map2.getSize()).to.eql(new Point(0, 0));

			map2.remove(); // clean up
		});

		it('return map size if 0x0 pixels', () => {
			container.style.width = '0px';
			container.style.height = '0px';

			expect(map.getSize()).to.eql(new Point(0, 0));
		});

		it('return new pixels on change', () => {
			container.style.width = '300px';

			expect(map.getSize()).to.eql(new Point(300, 400));
		});

		it('return clone of size object from map', () => {
			expect(map.getSize()).to.not.equal(map._size);
		});

		it('return previous size on empty map', () => {
			const container2 = createContainer();
			const map2 = new Map(container2);

			map2.remove(); // clean up

			expect(map2.getSize()).to.eql(new Point(400, 400));
		});
	});

	describe('#getPixelBounds', () => {
		beforeEach(() => {
			map.setView([0, 0], 0); // load map
		});

		it('return map bounds in pixels', () => {
			expect(map.getPixelBounds()).to.eql(new Bounds([-72, -72], [328, 328]));
		});

		it('return changed map bounds if really zoomed in', () => {
			map.setZoom(20);

			expect(map.getPixelBounds()).to.eql(new Bounds([134217528, 134217528], [134217928, 134217928]));
		});

		it('return new pixels on view change', () => {
			map.setView([50, 50], 5);

			expect(map.getPixelBounds()).to.eql(new Bounds([5034, 2578], [5434, 2978]));
		});

		it('throw error if center and zoom were not set / map not loaded', () => {
			const container2 = createContainer();
			const map2 = new Map(container2);

			expect(map2.getPixelBounds).to.throw();

			map2.remove(); // clean up
		});
	});

	describe('#getPixelOrigin', () => {
		beforeEach(() => {
			map.setView([0, 0], 0); // load map
		});

		it('return pixel origin', () => {
			expect(map.getPixelOrigin()).to.eql(new Point(-72, -72));
		});

		it('return new pixels on view change', () => {
			map.setView([50, 50], 5);

			expect(map.getPixelOrigin()).to.eql(new Point(5034, 2578));
		});

		it('return changed map bounds if really zoomed in', () => {
			map.setZoom(20);

			expect(map.getPixelOrigin()).to.eql(new Point(134217528, 134217528));
		});

		it('throw error if center and zoom were not set / map not loaded', () => {
			const container2 = createContainer();
			const map2 = new Map(container2);

			expect(map2.getPixelOrigin).to.throw();

			map2.remove(); // clean up
		});
	});

	describe('#getPixelWorldBounds', () => {
		it('return map bounds in pixels', () => {
			expect(map.getPixelWorldBounds()).to.eql(new Bounds(
				[5.551115123125783e-17, 5.551115123125783e-17], [1, 1]));
		});

		it('return changed map bounds if really zoomed in', () => {
			map.setZoom(20);

			expect(map.getPixelWorldBounds()).to.eql(new Bounds(
				[1.4901161193847656e-8, 1.4901161193847656e-8], [268435456, 268435456]));
		});

		it('return new pixels on zoom change', () => {
			map.setZoom(5);

			expect(map.getPixelWorldBounds()).to.eql(new Bounds(
				[4.547473508864641e-13, 4.547473508864641e-13], [8192, 8192]));

			map.setView([0, 0]);

			// view does not change pixel world bounds
			expect(map.getPixelWorldBounds()).to.eql(new Bounds(
				[4.547473508864641e-13, 4.547473508864641e-13], [8192, 8192]));
		});

		it('return infinity bounds on infinity zoom', () => {
			map.setZoom(Infinity);

			expect(map.getPixelWorldBounds()).to.eql(new Bounds(
				[Infinity, Infinity], [Infinity, Infinity]));
		});
	});

	describe('#hasLayer', () => {
		it('throws when called without proper argument', () => {
			const hasLayer = map.hasLayer.bind(map);
			expect(() => hasLayer(new Layer())).to.not.throw(); // control case

			expect(() => hasLayer(undefined)).to.throw();
			expect(() => hasLayer(null)).to.throw();
			expect(() => hasLayer(false)).to.throw();
			expect(() => hasLayer()).to.throw();
		});
	});

	function layerSpy() {
		const layer = new Layer();
		layer.onAdd = sinon.spy();
		layer.onRemove = sinon.spy();
		return layer;
	}

	describe('#addLayer', () => {
		it('calls layer.onAdd immediately if the map is ready', () => {
			const layer = layerSpy();
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(layer.onAdd.called).to.be.true;
		});

		it('calls layer.onAdd when the map becomes ready', () => {
			const layer = layerSpy();
			map.addLayer(layer);
			expect(layer.onAdd.called).not.to.be.true;
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).to.be.true;
		});

		it('does not call layer.onAdd if the layer is removed before the map becomes ready', () => {
			const layer = layerSpy();
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(layer.onAdd.called).not.to.be.true;
		});

		it('fires a layeradd event immediately if the map is ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			expect(spy.called).to.be.true;
		});

		it('fires a layeradd event when the map becomes ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			expect(spy.called).not.to.be.true;
			map.setView([0, 0], 0);
			expect(spy.called).to.be.true;
		});

		it('does not fire a layeradd event if the layer is removed before the map becomes ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layeradd', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			map.setView([0, 0], 0);
			expect(spy.called).not.to.be.true;
		});

		it('adds the layer before firing layeradd', (done) => {
			const layer = layerSpy();
			map.on('layeradd', () => {
				expect(map.hasLayer(layer)).to.be.true;
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
		});

		it('throws if adding something which is not a layer', () => {
			const control = lControl.layers();
			expect(() => {
				map.addLayer(control);
			}).to.throw();
		});

		describe('When the first layer is added to a map', () => {
			it('fires a zoomlevelschange event', () => {
				const spy = sinon.spy();
				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.true;
				new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).to.be.true;
			});
		});

		describe('when a new layer with greater zoomlevel coverage than the current layer is added to a map', () => {
			it('fires a zoomlevelschange event', () => {
				const spy = sinon.spy();
				new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.true;
				new TileLayer('', {minZoom: 0, maxZoom: 15}).addTo(map);
				expect(spy.called).to.be.true;
			});
		});

		describe('when a new layer with the same or lower zoomlevel coverage as the current layer is added to a map', () => {
			it('fires no zoomlevelschange event', () => {
				const spy = sinon.spy();
				new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.true;
				new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				expect(spy.called).not.to.be.true;
				new TileLayer('', {minZoom: 0, maxZoom: 5}).addTo(map);
				expect(spy.called).not.to.be.true;
			});
		});
	});

	describe('#removeLayer', () => {
		it('calls layer.onRemove if the map is ready', () => {
			const layer = layerSpy();
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).to.be.true;
		});

		it('does not call layer.onRemove if the layer was not added', () => {
			const layer = layerSpy();
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.true;
		});

		it('does not call layer.onRemove if the map is not ready', () => {
			const layer = layerSpy();
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(layer.onRemove.called).not.to.be.true;
		});

		it('fires a layerremove event if the map is ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).to.be.true;
		});

		it('does not fire a layerremove if the layer was not added', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.setView([0, 0], 0);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.true;
		});

		it('does not fire a layerremove if the map is not ready', () => {
			const layer = layerSpy(),
			    spy = sinon.spy();
			map.on('layerremove', spy);
			map.addLayer(layer);
			map.removeLayer(layer);
			expect(spy.called).not.to.be.true;
		});

		it('removes the layer before firing layerremove', (done) => {
			const layer = layerSpy();
			map.on('layerremove', () => {
				expect(map.hasLayer(layer)).not.to.be.true;
				done();
			});
			map.setView([0, 0], 0);
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it('supports adding and removing a tile layer without initializing the map', () => {
			const layer = new TileLayer('');
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		it('supports adding and removing a tile layer without initializing the map', () => {
			map.setView([0, 0], 18);
			const layer = new GridLayer();
			map.addLayer(layer);
			map.removeLayer(layer);
		});

		describe('when the last tile layer on a map is removed', () => {
			it('fires a zoomlevelschange event', () => {
				map.setView([0, 0], 0);
				const spy = sinon.spy();
				const tl = new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);

				map.on('zoomlevelschange', spy);
				expect(spy.called).not.to.be.true;
				map.removeLayer(tl);
				expect(spy.called).to.be.true;
			});
		});

		describe('when a tile layer is removed from a map and it had greater zoom level coverage than the remainding layer', () => {
			it('fires a zoomlevelschange event', () => {
				map.setView([0, 0], 0);
				new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map);
				const spy = sinon.spy(),
				    t2 = new TileLayer('', {minZoom: 0, maxZoom: 15}).addTo(map);

				map.on('zoomlevelschange', spy);
				expect(spy.called).to.be.false;
				map.removeLayer(t2);
				expect(spy.called).to.be.true;
			});
		});

		describe('when a tile layer is removed from a map it and it had lesser or the same zoom level coverage as the remainding layer(s)', () => {
			it('fires no zoomlevelschange event', () => {
				map.setView([0, 0], 0);
				const spy = sinon.spy(),
				    t1 = new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map),
				    t2 = new TileLayer('', {minZoom: 0, maxZoom: 10}).addTo(map),
				    t3 = new TileLayer('', {minZoom: 0, maxZoom: 5}).addTo(map);

				map.on('zoomlevelschange', spy);
				map.removeLayer(t2);
				expect(spy.called).to.be.false;
				map.removeLayer(t3);
				expect(spy.called).to.be.false;
				map.removeLayer(t1);
				expect(spy.called).to.be.true;
			});
		});
	});

	describe('#eachLayer', () => {
		it('returns self', () => {
			expect(map.eachLayer(Util.falseFn)).to.equal(map);
		});

		it('calls the provided function for each layer', () => {
			const t1 = new TileLayer('').addTo(map),
			    t2 = new TileLayer('').addTo(map),
			    spy = sinon.spy();

			map.eachLayer(spy);

			expect(spy.callCount).to.eql(2);
			expect(spy.firstCall.args).to.eql([t1]);
			expect(spy.secondCall.args).to.eql([t2]);
		});

		it('calls the provided function with the provided context', () => {
			const spy = sinon.spy();
			new TileLayer('').addTo(map);

			map.eachLayer(spy, map);

			expect(spy.alwaysCalledOn(map)).to.be.true;
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
			expect(map._getMapPanePos().x).to.equal(1);

			container.style.width = `${origWidth + 2}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.equal(1);

			container.style.width = `${origWidth + 3}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.equal(2);
		});

		it('pans by the right amount when shrinking in 1px increments', () => {
			container.style.width = `${origWidth - 1}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.equal(0);

			container.style.width = `${origWidth - 2}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.equal(-1);

			container.style.width = `${origWidth - 3}px`;
			map.invalidateSize();
			expect(map._getMapPanePos().x).to.equal(-1);
		});

		it('pans back to the original position after growing by an odd size and back', () => {
			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize();

			container.style.width = `${origWidth}px`;
			map.invalidateSize();

			expect(map._getMapPanePos().x).to.equal(0);
		});

		it('emits no move event if the size has not changed', () => {
			const spy = sinon.spy();
			map.on('move', spy);

			map.invalidateSize();

			expect(spy.called).not.to.be.true;
		});

		it('emits a move event if the size has changed', () => {
			const spy = sinon.spy();
			map.on('move', spy);

			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize();

			expect(spy.called).to.be.true;
		});

		it('emits a moveend event if the size has changed', () => {
			const spy = sinon.spy();
			map.on('moveend', spy);

			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize();

			expect(spy.called).to.be.true;
		});

		it('debounces the moveend event if the debounceMoveend option is given', () => {
			const spy = sinon.spy();
			map.on('moveend', spy);

			container.style.width = `${origWidth + 5}px`;
			map.invalidateSize({debounceMoveend: true});

			expect(spy.called).not.to.be.true;

			clock.tick(200);

			expect(spy.called).to.be.true;
		});

		it('correctly adjusts for new container size when view is set during map initialization (#6165)', () => {
			// Use a newly initialized map
			map.remove();

			const center = [0, 0];

			// The edge case is only if view is set directly during map initialization
			map = new Map(container, {
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

			expect(spy.called).to.be.false;

			map.getContainer().style.width = '200px';

			map.on('resize', () => {
				expect(spy.called).to.be.true;
				done();
			});
		});

		it('disables auto invalidateSize', (done) => {
			clock.restore();
			map.remove();

			const center = [0, 0];

			// The edge case is only if view is set directly during map initialization
			map = new Map(container, {
				center,
				zoom: 0,
				trackResize: false
			});

			const spy = sinon.spy();
			map.invalidateSize = spy;

			expect(spy.called).to.be.false;

			map.getContainer().style.width = '200px';

			setTimeout(() => {
				expect(spy.called).to.be.false;
				done();
				// we need the 10 ms to be sure that the ResizeObserver is not triggered
			}, 10);
		});

		it('makes sure that auto invalidateSize is removed', (done) => {
			clock.restore();
			map.remove();

			const spy = sinon.spy();
			map.invalidateSize = spy;
			expect(spy.called).to.be.false;

			map.getContainer().style.width = '200px';

			setTimeout(() => {
				expect(spy.called).to.be.false;

				// make sure afterEach works correctly
				map = new Map(container);
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

			const newCenter = latLng(10, 11),
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

			const dc = latLng(38.91, -77.04);
			map.setView(dc, 14);

			map.on('zoomend', () => {
				expect(map.getCenter()).to.eql(dc);
				expect(map.getZoom()).to.eql(4);
				done();
			});

			map.flyTo(dc, 4, {duration: 0.1});
		});

		it('flyTo should honour maxZoom', (done) => {
			const newCenter = latLng(10, 11),
			    maxZoom = 20;
			map.options.maxZoom = maxZoom;

			map.setView([0, 0], 0);

			map.on('zoomend', () => {
				expect(map.getCenter()).to.eql(newCenter);
				expect(map.getZoom()).to.eql(maxZoom);
				done();
			});

			map.flyTo(newCenter, 22, {animate: true, duration: 0.1});
		});
	});

	describe('#zoomIn and #zoomOut', () => {
		const center = latLng(22, 33);
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

		it('zoomIn respects the zoomDelta option', (done) => {
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

		it('zoomOut respects the zoomDelta option', (done) => {
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

		it('zoomIn snaps to zoomSnap', (done) => {
			map.options.zoomSnap = 0.25;
			map.setView(center, 10);
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(10.25);
				expect(map.getCenter()).to.eql(center);
				done();
			});
			map.zoomIn(0.22, {animate: false});
		});

		it('zoomOut snaps to zoomSnap', (done) => {
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
		const center = latLng(50.5, 30.51);

		it('Returns valid center on empty bounds in unitialized map', () => {
			// Edge case from #5153
			const centerAndZoom = map._getBoundsCenterZoom([center, center]);
			expect(centerAndZoom.center).to.eql(center);
			expect(centerAndZoom.zoom).to.eql(Infinity);
		});
	});

	describe('#fitBounds', () => {
		const center = latLng(50.5, 30.51);
		let bounds = new LatLngBounds(latLng(1, 102), latLng(11, 122)),
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

		it('Snaps zoom to zoomSnap', (done) => {
			map.options.zoomSnap = 0.25;
			map.once('zoomend', () => {
				expect(map.getZoom()).to.eql(2.75);
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
			}).to.throw();
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

			bounds = new LatLngBounds([57.73, 11.93], [57.75, 11.95]);
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

			bounds = new LatLngBounds([90, -180], [-90, 180]);
			boundsCenter = bounds.getCenter();
			map.setZoom(22);
		});
	});

	describe('#fitBounds after layers set', () => {
		const center = latLng(22, 33),
		    bounds = new LatLngBounds(latLng(1, 102), latLng(11, 122));

		beforeEach(() => {
			// fitBounds needs a map container with non-null area
			container.style.width = container.style.height = '100px';
		});

		it('Snaps to a number after adding tile layer', () => {
			map.addLayer(new TileLayer(''));
			expect(map.getZoom()).to.equal(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.equal(2);
		});

		it('Snaps to a number after adding marker', () => {
			map.addLayer(new Marker(center));
			expect(map.getZoom()).to.equal(undefined);
			map.fitBounds(bounds);
			expect(map.getZoom()).to.equal(2);
		});

	});

	describe('#fitWorld', () => {
		const bounds = new LatLngBounds([90, -180], [-90, 180]),
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
			map.setView(latLng([53.0, 0.15]), 12, {animate: false});
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
			expect(distanceMoved.equals(new Point(-10, -20))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().max.x - 10, map.getPixelBounds().min.y];	// Top-right
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(new Point(30, -20))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().min.x + 35, map.getPixelBounds().max.y];	// Bottom-left
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(new Point(-5, 20))).to.eql(true);

			tlPix = map.getPixelBounds().min;
			p = [map.getPixelBounds().max.x - 15, map.getPixelBounds().max.y]; // Bottom-right
			map.panInside(map.unproject(p), {padding, animate: false});
			distanceMoved = map.getPixelBounds().min.subtract(tlPix);
			expect(distanceMoved.equals(new Point(25, 20))).to.eql(true);
		});

		it('supports different padding values for each border', () => {
			const p = tlPix.add([40, 0]),	// Top-Left
			    opts = {paddingTL: [60, 20], paddingBR: [10, 10], animate: false};
			map.panInside(map.unproject(p), opts);
			expect(center).to.eql(map.getCenter());

			const br = map.getPixelBounds().max;	// Bottom-Right
			map.panInside(map.unproject(new Point(br.x + 20, br.y)), opts);
			expect(center).to.not.eql(map.getCenter());
		});

		it('pans on both X and Y axes when the target is outside of the view area and both the point\'s coords are outside the bounds', () => {
			const p = map.unproject(tlPix.subtract([200, 200]));
			map.panInside(p, {animate: false});
			expect(map.getBounds().contains(p)).to.be.true;
			expect(map.getCenter().lng).to.not.eql(center.lng);
			expect(map.getCenter().lat).to.not.eql(center.lat);
		});

		it('pans only on the Y axis when the target\'s X coord is within bounds but the Y is not', () => {
			const p = latLng(tl.lat + 5, tl.lng);
			map.panInside(p, {animate: false});
			expect(map.getBounds().contains(p)).to.be.true;
			const dx = Math.abs(map.getCenter().lng - center.lng);
			expect(dx).to.be.lessThan(1.0E-9);
			expect(map.getCenter().lat).to.not.eql(center.lat);
		});

		it('pans only on the X axis when the target\'s Y coord is within bounds but the X is not', () => {
			const p = latLng(tl.lat, tl.lng - 5);
			map.panInside(p, 0, {animate: false});
			expect(map.getBounds().contains(p)).to.be.true;
			expect(map.getCenter().lng).to.not.eql(center.lng);
			const dy = map.getCenter().lat - center.lat;
			expect(dy).to.be.lessThan(1.0E-9);
		});

		it('pans correctly when padding takes up more than half the display bounds', () => {
			const oldCenter = map.project(center);
			const targetOffset = new Point(0, -5); // arbitrary point above center
			const target = oldCenter.add(targetOffset);
			const paddingOffset = new Point(0, 15);
			const padding = map.getSize().divideBy(2) // half size
			  .add(paddingOffset); // padding more than half the display bounds (replicates issue #7445)
			map.panInside(map.unproject(target), {paddingBottomRight: [0, padding.y], animate: false});
			const offset = map.project(map.getCenter()).subtract(oldCenter); // distance moved during the pan
			const result = paddingOffset.add(targetOffset).subtract(offset);
			expect(result.trunc().equals(new Point(0, 0))).to.be.true;
		});
	});

	describe('#DOM events', () => {
		beforeEach(() => {
			map.setView([0, 0], 0);
		});

		it('DOM events propagate from polygon to map', () => {
			const spy = sinon.spy();
			map.on('mousemove', spy);
			const layer = new Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			UIEventSimulator.fire('mousemove', layer._path);
			expect(spy.calledOnce).to.be.true;
		});

		it('DOM events propagate from marker to map', () => {
			const spy = sinon.spy();
			map.on('mousemove', spy);
			const layer = new Marker([1, 2]).addTo(map);
			UIEventSimulator.fire('mousemove', layer._icon);
			expect(spy.calledOnce).to.be.true;
		});

		it('DOM events fired on marker can be cancelled before being caught by the map', () => {
			const mapSpy = sinon.spy();
			const layerSpy = sinon.spy();
			map.on('mousemove', mapSpy);
			const layer = new Marker([1, 2]).addTo(map);
			layer.on('mousemove', DomEvent.stopPropagation).on('mousemove', layerSpy);
			UIEventSimulator.fire('mousemove', layer._icon);
			expect(layerSpy.calledOnce).to.be.true;
			expect(mapSpy.called).not.to.be.true;
		});

		it('DOM events fired on polygon can be cancelled before being caught by the map', () => {
			const mapSpy = sinon.spy();
			const layerSpy = sinon.spy();
			map.on('mousemove', mapSpy);
			const layer = new Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('mousemove', DomEvent.stopPropagation).on('mousemove', layerSpy);
			UIEventSimulator.fire('mousemove', layer._path);
			expect(layerSpy.calledOnce).to.be.true;
			expect(mapSpy.called).not.to.be.true;
		});

		it('mouseout is forwarded if fired on the original target', () => {
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			const layer = new Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			const other = new Polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			other.on('mouseout', otherSpy);
			UIEventSimulator.fire('mouseout', layer._path, {relatedTarget: container});
			expect(mapSpy.called).not.to.be.true;
			expect(otherSpy.called).not.to.be.true;
			expect(layerSpy.calledOnce).to.be.true;
		});

		it('mouseout is forwarded when using a DivIcon', () => {
			const icon = new DivIcon({
				html: '<p>this is text in a child element</p>',
				iconSize: [100, 100]
			});
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = new Marker([1, 2], {icon}).addTo(map);
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			UIEventSimulator.fire('mouseout', layer._icon, {relatedTarget: container});
			expect(mapSpy.called).not.to.be.true;
			expect(layerSpy.calledOnce).to.be.true;
		});

		it('mouseout is not forwarded if relatedTarget is a target\'s child', () => {
			const icon = new DivIcon({
				html: '<p>this is text in a child element</p>',
				iconSize: [100, 100]
			});
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = new Marker([1, 2], {icon}).addTo(map),
			    child = layer._icon.querySelector('p');
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			UIEventSimulator.fire('mouseout', layer._icon, {relatedTarget: child});
			expect(mapSpy.called).not.to.be.true;
			expect(layerSpy.called).not.to.be.true;
		});

		it('mouseout is not forwarded if fired on target\'s child', () => {
			const icon = new DivIcon({
				html: '<p>this is text in a child element</p>',
				iconSize: [100, 100]
			});
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    layer = new Marker([1, 2], {icon}).addTo(map),
			    child = layer._icon.querySelector('p');
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			UIEventSimulator.fire('mouseout', child, {relatedTarget: layer._icon});
			expect(mapSpy.called).not.to.be.true;
			expect(layerSpy.called).not.to.be.true;
		});

		it('mouseout is not forwarded to layers if fired on the map', () => {
			const mapSpy = sinon.spy(),
			    layerSpy = sinon.spy(),
			    otherSpy = sinon.spy();
			const layer = new Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			const other = new Polygon([[10, 20], [30, 40], [50, 60]]).addTo(map);
			map.on('mouseout', mapSpy);
			layer.on('mouseout', layerSpy);
			other.on('mouseout', otherSpy);
			UIEventSimulator.fire('mouseout', container);
			expect(otherSpy.called).not.to.be.true;
			expect(layerSpy.called).not.to.be.true;
			expect(mapSpy.calledOnce).to.be.true;
		});

		it('preclick is fired before click on marker and map', () => {
			let called = 0;
			const layer = new Marker([1, 2], {bubblingMouseEvents: true}).addTo(map);
			layer.on('preclick', (e) => {
				expect(called++).to.eql(0);
				expect(e.latlng).to.be.ok;
			});
			layer.on('click', (e) => {
				expect(called++).to.eql(2);
				expect(e.latlng).to.be.ok;
			});
			map.on('preclick', (e) => {
				expect(called++).to.eql(1);
				expect(e.latlng).to.be.ok;
			});
			map.on('click', (e) => {
				expect(called++).to.eql(3);
				expect(e.latlng).to.be.ok;
			});
			UIEventSimulator.fire('click', layer._icon);
			expect(called).to.eql(4);
		});

		it('prevents default action of contextmenu if there is any listener', () => {
			removeMapContainer(map, container);
			container = createContainer();
			map = new Map(container, {
				renderer: new Canvas(),
				center: [0, 0],
				zoom: 0
			});

			container.style.width = container.style.height = '300px';

			map.setView(latLng([0, 0]), 12);
			const spy = sinon.spy();
			map.on('contextmenu', (e) => {
				spy(e.originalEvent.defaultPrevented);
			});
			const marker = new CircleMarker([0, 0]).addTo(map);

			UIEventSimulator.fireAt('contextmenu', 0, 0); // first

			UIEventSimulator.fireAt('contextmenu', marker._point.x, marker._point.y); // second  (#5995)

			expect(spy.callCount).to.equal(2);
			expect(spy.firstCall.lastArg).to.be.true;
			expect(spy.secondCall.lastArg).to.be.true;
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
			expect(map.getZoom()).to.equal(undefined);
		});

		it('returns undefined if map not initialized but layers added', () => {
			map.addLayer(new TileLayer(''));
			expect(map.getZoom()).to.equal(undefined);
		});
	});

	describe('#Geolocation', () => {
		it('doesn\'t throw error if location is found and map is not existing', () => {
			const fn = map._handleGeolocationResponse.bind(map);
			map.remove();
			map = null;
			expect(() => {
				fn({coords: {latitude: 40.415296, longitude: 10.7419264, accuracy: 1129.5646101470752}});
			}).to.not.throw();
		});
		it('doesn\'t throw error if location is not found and map is not existing', () => {
			map._locateOptions = {setView: true};
			const fn = map._handleGeolocationError.bind(map);
			map.remove();
			map = null;
			expect(() => {
				fn({coords: {latitude: 40.415296, longitude: 10.7419264, accuracy: 1129.5646101470752}});
			}).to.not.throw();
		});
	});

	describe('#disableClickPropagation', () => {
		it('does not break if element is not in the DOM anymore', () => {
			map.setView([0, 0], 0);
			const parent = document.createElement('div');
			const child = document.createElement('div');
			parent.appendChild(child);
			container.appendChild(parent);
			DomEvent.on(child, 'click', () => {
				parent.remove();
			});
			expect(() => {
				UIEventSimulator.fire('click', child);
			}).to.not.throw();
		});
	});

	describe('#distance', () => {
		it('measure distance in meters', () => {
			const LA = latLng(34.0485672098387, -118.217781922035);
			const columbus = latLng(39.95715687063701, -83.00205705857633);

			expect(map.distance(LA, columbus)).to.be.within(3173910, 3173915);
		});

		it('accurately measure in small distances', () => {
			const p1 = latLng(40.160857881285416, -83.00841851162649);
			const p2 = latLng(40.16246493902907, -83.008622359483);

			expect(map.distance(p1, p2)).to.be.within(175, 185);
		});

		it('accurately measure in long distances', () => {
			const canada = latLng(60.01810635103154, -112.19675246283015);
			const newZeland = latLng(-42.36275164460971, 172.39309066597883);

			expect(map.distance(canada, newZeland)).to.be.within(13274700, 13274800);
		});

		it('throw with undefined values', () => {
			expect(() => map.distance(undefined, undefined)).to.throw();
		});

		it('throw with infinity values', () => {
			expect(() => map.distance(Infinity, Infinity)).to.throw();
		});

		it('throw with only 1 lat', () => {
			expect(() => map.distance(20, 50)).to.throw();
		});

		it('return 0 with 2 same latLng', () => {
			const p = latLng(20, 50);

			expect(map.distance(p, p)).to.eql(0);
		});
	});

	describe('#containerPointToLayerPoint', () => {
		it('return same point of LayerPoint is 0, 0', () => {
			expect(map.containerPointToLayerPoint(new Point(25, 25))).to.eql(new Point(25, 25));
		});

		it('return point relative to LayerPoint', (done) => {
			map.setView([20, 20], 2);

			map.once('moveend', () => {
				expect(map.containerPointToLayerPoint(new Point(30, 30))).to.eql(new Point(80, 80));
				done();
			});

			map.panBy([50, 50], {animate: false});
		});
	});

	describe('#layerPointToContainerPoint', () => {
		it('return same point of ContainerPoint is 0, 0', () => {
			expect(map.layerPointToContainerPoint(new Point(25, 25))).to.eql(new Point(25, 25));
		});

		it('return point relative to ContainerPoint', (done) => {
			map.setView([20, 20], 2);

			map.once('moveend', () => {
				expect(map.layerPointToContainerPoint(new Point(30, 30))).to.eql(new Point(-20, -20));
				done();
			});

			map.panBy([50, 50], {animate: false});
		});
	});

	describe('_addZoomLimit', () => {
		it('update zoom levels when min zoom is a number in a layer that is added to map', () => {
			map._addZoomLimit(new TileLayer('', {minZoom: 4}));
			expect(map._layersMinZoom).to.equal(4);
		});

		it('update zoom levels when max zoom is a number in a layer that is added to map', () => {
			map._addZoomLimit(new TileLayer('', {maxZoom: 10}));
			expect(map._layersMaxZoom).to.equal(10);
		});

		it('update zoom levels when min zoom is a number in two layers that are added to map', () => {
			map._addZoomLimit(new TileLayer('', {minZoom: 6}));
			map._addZoomLimit(new TileLayer('', {minZoom: 4}));
			expect(map._layersMinZoom).to.equal(4);
		});

		it('update zoom levels when max zoom is a number in two layers that are added to map', () => {
			map._addZoomLimit(new TileLayer('', {maxZoom: 10}));
			map._addZoomLimit(new TileLayer('', {maxZoom: 8}));
			expect(map._layersMaxZoom).to.equal(10);
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it('update zoom levels when min zoom is NaN in a layer that is added to map, so that min zoom becomes NaN,', () => {
			map._addZoomLimit(new TileLayer('', {minZoom: NaN}));
			expect(isNaN(map._layersMinZoom)).to.be.true;
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it('update zoom levels when max zoom is NaN in a layer that is added to map, so that max zoom becomes NaN', () => {
			map._addZoomLimit(new TileLayer('', {maxZoom: NaN}));
			expect(isNaN(map._layersMaxZoom)).to.be.true;
		});

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		// Test is clearly wrong, but kept for future fixes
		// it("update zoom levels when min zoom is NaN in at least one of many layers that are added to map, so that min zoom becomes NaN", function () {
		// 	map._addZoomLimit(new TileLayer("", {minZoom: 6}));
		// 	map._addZoomLimit(new TileLayer("", {minZoom: NaN})); --> Results in maxZoom = NaN --> _updateZoomLevels is not called.
		// 	Not same logic as for maxZoom.
		// 	map._addZoomLimit(new TileLayer("", {minZoom: 4}));
		// 	expect(isNaN(map._layersMinZoom)).to.be.true;
		// });

		// This test shows the NaN usage - it's not clear if NaN is a wanted "feature"
		it('update zoom levels when max zoom is NaN in at least one of many layers that are added to map, so that max zoom becomes NaN', () => {
			map._addZoomLimit(new TileLayer('', {maxZoom: 10}));
			map._addZoomLimit(new TileLayer('', {maxZoom: 8}));
			map._addZoomLimit(new TileLayer('', {maxZoom: NaN}));
			expect(isNaN(map._layersMaxZoom)).to.be.true;
		});

		it('doesn\'t update zoom levels when min and max zoom are both NaN in a layer that is added to map', () => {
			map._addZoomLimit(new TileLayer('', {minZoom: NaN, maxZoom: NaN}));
			expect(map._layersMinZoom === undefined && map._layersMaxZoom === undefined).to.be.true;
		});
	});

	describe('#containerPointToLatLng', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.containerPointToLatLng();
			}).to.throw();
		});

		it('returns geographical coordinate for point relative to map container', () => {
			const center = latLng(10, 10);
			map.setView(center, 50);
			const p = map.containerPointToLatLng(new Point(200, 200));
			expect(p.lat).to.be.within(10.0000000, 10.0000001);
			expect(p.lng).to.be.within(10.0000000, 10.0000001);
		});
	});


	describe('#latLngToContainerPoint', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.latLngToContainerPoint();
			}).to.throw();
		});

		it('returns point relative to map container for geographical coordinate', () => {
			const center = latLng(10, 10);
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
			}).to.throw();
		});

		it('pans the map to accurate location', () => {
			const center = latLng([50, 30]);
			expect(map.panTo(center)).to.equal(map);
			expect(map.getCenter().distanceTo(center)).to.be.lessThan(5);
		});
	});

	describe('#panInsideBounds', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.panInsideBounds();
			}).to.throw();
		});

		it('throws if passed invalid bounds', () => {
			expect(() => {
				map.panInsideBounds(0, 0);
			}).to.throw();
		});

		it('doesn\'t pan if already in bounds', () => {
			map.setView([0, 0]);
			const bounds = new LatLngBounds([[-1, -1], [1, 1]]);
			const expectedCenter = latLng([0, 0]);
			expect(map.panInsideBounds(bounds)).to.equal(map);
			expect(map.getCenter()).to.be.nearLatLng(expectedCenter);
		});

		it('pans to closest view in bounds', () => {
			const bounds = new LatLngBounds([[41.8, -87.6], [40.7, -74]]);
			const expectedCenter = latLng([41.59452223189, -74.2738647460]);
			map.setView([50.5, 30.5], 10);
			expect(map.panInsideBounds(bounds)).to.equal(map);
			expect(map.getCenter()).to.be.nearLatLng(expectedCenter);
		});
	});

	describe('#latLngToLayerPoint', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.latLngToLayerPoint();
			}).to.throw();
		});

		it('returns the corresponding pixel coordinate relative to the origin pixel', () => {
			const center = latLng([10, 10]);
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
			}).to.throw();
		});

		it('returns the corresponding geographical coordinate for a pixel coordinate relative to the origin pixel', () => {
			const center = latLng(10, 10);
			map.setView(center, 10);
			const point = new Point(200, 200);
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
				expect(error.code).to.equal(0);
				expect(error.message).to.eql('Geolocation error: Geolocation not supported..');

				errorSpy();
			});

			map.on('locationfound', foundSpy);

			map.locate({setView: true});

			expect(errorSpy.called).to.be.true;
			expect(foundSpy.called).to.be.false;
		});

		it('sets map view to geolocation coords', () => {
			Object.defineProperty(window, 'navigator', {
				value: geolocationStub
			});

			let expectedBounds;
			const expectedLatLngs = [50, 50];

			map.on('locationfound', (data) => {
				expect(data.latlng).to.be.nearLatLng(expectedLatLngs);
				expect(data.timestamp).to.equal(1670000000000);

				expectedBounds = data.bounds;

				foundSpy();
			});

			map.on('locationerror', errorSpy);

			map.locate({setView: true});

			expect(errorSpy.called).to.be.false;
			expect(foundSpy.called).to.be.true;

			expect(getCurrentPosSpy.called).to.be.true;
			expect(watchPosSpy.called).to.be.false;

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
				expect(data.timestamp).to.equal(1660000000000);

				expectedBounds = data.bounds;

				foundSpy();
			});

			map.on('locationerror', errorSpy);

			map.locate({setView: true, watch: true});

			expect(errorSpy.called).to.be.false;
			expect(foundSpy.called).to.be.true;

			expect(getCurrentPosSpy.called).to.be.false;
			expect(watchPosSpy.called).to.be.true;

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
				expect(data.timestamp).to.equal(1670000000000);

				foundSpy();
			});

			map.on('locationerror', errorSpy);

			map.locate();

			expect(errorSpy.called).to.be.false;
			expect(foundSpy.called).to.be.true;

			expect(getCurrentPosSpy.called).to.be.true;
			expect(watchPosSpy.called).to.be.false;

			expect(map._loaded).to.be.undefined;
		});
	});

	describe('#mouseEventToLatLng', () => {

		it('throws if map is not set before', () => {
			expect(() => {
				map.mouseEventToLatLng({clientX: 10, clientY: 10});
			}).to.throw();
		});

		it('returns geographical coordinate where the event took place.', () => {
			let latlng;
			map.setView([0, 0], 0);
			map.on('click', (e) => {
				latlng = map.mouseEventToLatLng(e.originalEvent);
			});
			UIEventSimulator.fireAt('click', 100, 100);

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
			}).to.throw();
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
		const offset = new Point(1000, 1000);

		it('throws if map is not set before', () => {
			expect(() => {
				map.panBy(offset);
			}).to.throw();
		});

		it('pans the map by given offset', () => {
			const center = latLng([0, 0]);
			map.setView(center, 7);
			const offsetCenterPoint = map.options.crs.latLngToPoint(center, 7).add(offset);
			const target = map.options.crs.pointToLatLng(offsetCenterPoint, 7);

			expect(map.panBy(offset, {animate: false})).to.equal(map);
			expect(map.getCenter().distanceTo(target)).to.be.lessThan(5);
			expect(map.getCenter()).to.be.nearLatLng([-10.9196177602, 10.9863281250]);
		});
	});

	describe('#unproject', () => {

		it('returns the latitude and langitude with given point', () => {
			map.setView([0, 0], 6);
			const expectedOutput = latLng(82.7432022836318, -175.60546875000003);
			const offset = new Point(200, 1000);
			const output = map.unproject(offset);
			expect(output).to.be.nearLatLng(expectedOutput);
		});

		it('return the latitude and langitude with different zoom and points', () => {
			map.setView([0, 0], 10);
			const expectedOutput = latLng(85.03926769025156, -179.98626708984378);
			const offset = new Point(10, 100);
			const output = map.unproject(offset);
			expect(output).to.be.nearLatLng(expectedOutput);

		});
	});
});
