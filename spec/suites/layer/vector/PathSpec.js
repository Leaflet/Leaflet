import {expect} from 'chai';
import {LayerGroup, Map, Polygon, Polyline} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Path', () => {
	let container, map;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);
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
	});

	describe('#setInteractive', () => {
		it('cannot be called before adding to map', () => {
			const path = new Polyline([[1, 2], [3, 4], [5, 6]]);

			expect(() => path.setInteractive(true)).to.throw();
		});

		it('can set interactive if unset initially', () => {
			const group = new LayerGroup().addTo(map);
			const path = new Polyline([[1, 2], [3, 4], [5, 6]], {interactive: false}).addTo(group);

			expect(path._path.classList.contains('leaflet-interactive')).to.equal(false);

			path.setInteractive(true);

			expect(path.options.interactive).to.equal(true);
			expect(path._path.classList.contains('leaflet-interactive')).to.equal(true);
		});

		it('can unset interactive if set initially', () => {
			const group = new LayerGroup().addTo(map);
			const path = new Polyline([[1, 2], [3, 4], [5, 6]], {interactive: true}).addTo(group);

			expect(path._path.classList.contains('leaflet-interactive')).to.equal(true);

			path.setInteractive(false);

			expect(path.options.interactive).to.equal(false);
			expect(path._path.classList.contains('leaflet-interactive')).to.equal(false);
		});

		it('can unset interactive if unset initially', () => {
			const group = new LayerGroup().addTo(map);
			const path = new Polyline([[1, 2], [3, 4], [5, 6]], {interactive: false}).addTo(group);

			expect(path._path.classList.contains('leaflet-interactive')).to.equal(false);

			path.setInteractive(false);

			expect(path.options.interactive).to.equal(false);
			expect(path._path.classList.contains('leaflet-interactive')).to.equal(false);
		});

		it('can set interactive if set initially', () => {
			const group = new LayerGroup().addTo(map);
			const path = new Polyline([[1, 2], [3, 4], [5, 6]], {interactive: true}).addTo(group);

			expect(path._path.classList.contains('leaflet-interactive')).to.equal(true);

			path.setInteractive(true);

			expect(path.options.interactive).to.equal(true);
			expect(path._path.classList.contains('leaflet-interactive')).to.equal(true);
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
});
