import {Canvas, Circle, CircleMarker, LayerGroup, LeafletMap, Polygon, Polyline, SVG} from 'leaflet';
import sinon from 'sinon';
import {userEvent} from 'vitest/browser';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Path', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);
		map.setView([0, 0], 0);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	// The following two tests are skipped, as the ES6-ifycation of Leaflet
	// means that Path is no longer visible.
	describe('#bringToBack', () => {
		it('is a no-op for layers not on a map', () => {
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToBack()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', () => {
			const group = new LayerGroup().addTo(map);
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToBack()).to.equal(path);
		});
	});

	describe('#bringToFront', () => {
		it('is a no-op for layers not on a map', () => {
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToFront()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', () => {
			const group = new LayerGroup().addTo(map);
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToFront()).to.equal(path);
		});

		it('keeps hover events paired when called from a pointerover handler (#10129)', async () => {
			const a = new Polygon([[-10, -30], [10, -30], [10, -10], [-10, -10]]).addTo(map);
			const b = new Polygon([[-10, -10], [10, -10], [10, 10], [-10, 10]]).addTo(map);
			const events = [];
			for (const [name, layer] of [['a', a], ['b', b]]) {
				layer.on('pointerover', () => { events.push(`over ${name}`); layer.bringToFront(); });
				layer.on('pointerout', () => events.push(`out ${name}`));
			}

			await userEvent.hover(a.getElement());
			await userEvent.hover(container, {position: {x: 5, y: 5}});
			await userEvent.hover(a.getElement());
			await userEvent.hover(b.getElement());
			await userEvent.hover(b.getElement(), {position: {x: 5, y: 5}});
			await userEvent.hover(container, {position: {x: 5, y: 5}});

			expect(events).to.eql(['over a', 'out a', 'over a', 'out a', 'over b', 'out b']);
			expect(a.getElement().parentNode.lastChild).to.equal(b.getElement());
		});
	});

	describe('#events', () => {
		it('fires click event', () => {
			const spy = sinon.spy();
			const layer = new Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('click', spy);
			UIEventSimulator.fire('click', layer._path);
			expect(spy.called).to.be.true;
		});

		it('propagates click event by default', () => {
			const spy = sinon.spy();
			const spy2 = sinon.spy();
			const mapSpy = sinon.spy();
			const layer = new Polygon([[1, 2], [3, 4], [5, 6]]).addTo(map);
			layer.on('click', spy);
			layer.on('click', spy2);
			map.on('click', mapSpy);
			UIEventSimulator.fire('click', layer._path);
			expect(spy.called).to.be.true;
			expect(spy2.called).to.be.true;
			expect(mapSpy.called).to.be.true;
		});

		it('can add a layer while being inside a moveend handler', () => {
			const zoneLayer = new LayerGroup();
			let polygon;
			map.addLayer(zoneLayer);

			map.on('moveend', () => {
				zoneLayer.clearLayers();
				polygon = new Polygon([[1, 2], [3, 4], [5, 6]]);
				zoneLayer.addLayer(polygon);
			});

			map.invalidateSize();
			map.setView([1, 2], 12, {animate: false});

			map.panBy([-260, 0], {animate: false});
			expect(polygon._parts.length).to.equal(0);

			map.panBy([260, 0], {animate: false});
			expect(polygon._parts.length).to.equal(1);
		});

		it('it should return tolerance with stroke', () => {
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]);
			path.addTo(map);
			expect(path._clickTolerance()).to.equal(path.options.weight / 2);
		});

		it('it should return zero tolerance without stroke', () => {
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]);
			path.addTo(map);
			path.options.stroke = false;
			expect(path._clickTolerance()).to.equal(0);
		});
	});

	[Canvas, SVG].forEach((Renderer) => {
		describe(`changed mid-zoom (${Renderer.name})`, () => {
			const a = [1, 1], b = [-1, -1];
			let renderer, still, moving;

			beforeEach(() => {
				map.setView([0, 0], 5);
				renderer = new Renderer();
				still = [new CircleMarker(a, {renderer}), new Polyline([a, b], {renderer}), new Circle(a, {radius: 1000, renderer})];
				moving = [new CircleMarker(b, {renderer}), new Polyline([b, a], {renderer}), new Circle(b, {radius: 1000, renderer})];
				for (const layer of [...still, ...moving]) { layer.addTo(map); }
			});

			// changed and new paths should be drawn where the untouched ones are, since they share the renderer
			function moveAndCheck() {
				moving[0].setLatLng(a);
				moving[1].setLatLngs([a, b]);
				moving[2].setLatLng(a);
				const added = new CircleMarker(a, {renderer}).addTo(map);

				expect([moving[0]._point, moving[1]._rings, moving[2]._point, added._point])
					.to.eql([still[0]._point, still[1]._rings, still[2]._point, still[0]._point]);
			}

			it('stay aligned with other paths during zoom animation', () => {
				const clock = sinon.useFakeTimers({toFake: ['requestAnimationFrame']});
				map.setZoom(6);
				clock.tick(100);
				moveAndCheck();

				clock.tick(1000);
				clock.restore();
				expect(map.getZoom()).to.equal(6);
				expect(moving[0]._point).to.eql(map.latLngToLayerPoint(a).round());
				expect(moving[1]._rings).to.eql(still[1]._rings);
			});

			it('stay aligned with other paths during pinch zoom', () => {
				map._moveStart(true);
				map._move(map.getCenter(), 5.5, {pinch: true});
				moveAndCheck();
			});
		});
	});
});
