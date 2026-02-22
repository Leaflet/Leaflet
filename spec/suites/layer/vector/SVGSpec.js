import {expect} from 'chai';
import {SVG, Circle, Polygon, Polyline, LeafletMap, LayerGroup, Util, Canvas} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('SVG', () => {
	let container, map, latLngs;

	function p2ll(x, y) {
		return map.layerPointToLatLng([x, y]);
	}

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {renderer: new SVG(), zoomControl: false});
		map.setView([0, 0], 6);
		latLngs = [p2ll(0, 0), p2ll(0, 100), p2ll(100, 100), p2ll(100, 0)];
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#initialization', () => {
		it('creates an SVG container', () => {
			const renderer = map.getRenderer(new Circle([0, 0]));
			expect(renderer._container).to.be.ok;
			expect(renderer._container.tagName).to.equal('svg');
		});

		it('sets pointer-events to none on the SVG root', () => {
			const renderer = map.getRenderer(new Circle([0, 0]));
			expect(renderer._container.getAttribute('pointer-events')).to.equal('none');
		});

		it('creates a root group element', () => {
			const renderer = map.getRenderer(new Circle([0, 0]));
			expect(renderer._rootGroup).to.be.ok;
			expect(renderer._rootGroup.tagName).to.equal('g');
		});
	});

	describe('#events', () => {
		let layer;

		beforeEach(() => {
			layer = new Polygon(latLngs).addTo(map);
		});

		it('should fire event when layer contains mouse', () => {
			const spy = sinon.spy();
			layer.on('click', spy);
			UIEventSimulator.fireAt('click', 50, 50);  // Click on the layer.
			expect(spy.callCount).to.eql(1);
			UIEventSimulator.fireAt('click', 150, 150);  // Click outside layer.
			expect(spy.callCount).to.eql(1);
		});

		it('DOM events propagate from SVG polygon to map', () => {
			const spy = sinon.spy();
			map.on('click', spy);
			UIEventSimulator.fireAt('click', 50, 50);
			expect(spy.callCount).to.eql(1);
		});

		it('should fire preclick before click', () => {
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			layer.on('click', clickSpy);
			layer.on('preclick', preclickSpy);
			layer.once('preclick', () => {
				expect(clickSpy.called).to.be.false;
			});
			UIEventSimulator.fireAt('click', 50, 50);  // Click on the layer.
			expect(clickSpy.callCount).to.eql(1);
			expect(preclickSpy.callCount).to.eql(1);
			UIEventSimulator.fireAt('click', 150, 150);  // Click outside layer.
			expect(clickSpy.callCount).to.eql(1);
			expect(preclickSpy.callCount).to.eql(1);
		});
	});

	describe('#events(interactive=false)', () => {
		it('should not fire click when not interactive', () => {
			const layer = new Polygon(latLngs, {interactive: false}).addTo(map);
			const spy = sinon.spy();
			layer.on('click', spy);
			UIEventSimulator.fireAt('click', 50, 50);  // Click on the layer.
			expect(spy.callCount).to.eql(0);
			UIEventSimulator.fireAt('click', 150, 150);  // Click outside layer.
			expect(spy.callCount).to.eql(0);
		});
	});

	describe('#styling', () => {
		it('can add polyline with dashArray', () => {
			const layer = new Polyline(latLngs, {
				dashArray: '5,5'
			}).addTo(map);
			expect(layer._path.getAttribute('stroke-dasharray')).to.equal('5,5');
		});

		it('can setStyle with dashArray', () => {
			const layer = new Polyline(latLngs).addTo(map);
			layer.setStyle({
				dashArray: '5,5'
			});
			expect(layer._path.getAttribute('stroke-dasharray')).to.equal('5,5');
		});

		it('applies custom className to path', () => {
			const layer = new Polygon(latLngs, {
				className: 'custom-class another-class'
			}).addTo(map);
			expect(layer._path.classList.contains('custom-class')).to.be.true;
			expect(layer._path.classList.contains('another-class')).to.be.true;
		});

		it('adds leaflet-interactive class when interactive', () => {
			const layer = new Polygon(latLngs, {interactive: true}).addTo(map);
			expect(layer._path.classList.contains('leaflet-interactive')).to.be.true;
		});

		it('does not add leaflet-interactive class when not interactive', () => {
			const layer = new Polygon(latLngs, {interactive: false}).addTo(map);
			expect(layer._path.classList.contains('leaflet-interactive')).to.be.false;
		});

		it('applies stroke styles correctly', () => {
			const layer = new Polyline(latLngs, {
				color: '#ff0000',
				weight: 5,
				opacity: 0.8
			}).addTo(map);
			expect(layer._path.getAttribute('stroke')).to.equal('#ff0000');
			expect(layer._path.getAttribute('stroke-width')).to.equal('5');
			expect(layer._path.getAttribute('stroke-opacity')).to.equal('0.8');
		});

		it('applies fill styles correctly', () => {
			const layer = new Polygon(latLngs, {
				fillColor: '#00ff00',
				fillOpacity: 0.5
			}).addTo(map);
			expect(layer._path.getAttribute('fill')).to.equal('#00ff00');
			expect(layer._path.getAttribute('fill-opacity')).to.equal('0.5');
		});
	});

	describe('#layer management', () => {
		it('removes vector immediately', () => {
			const layer = new Circle([0, 0]).addTo(map),
			layerId = Util.stamp(layer),
			svg = map.getRenderer(layer);

			expect(svg._layers).to.have.property(layerId);

			map.removeLayer(layer);
			expect(svg._layers).to.not.have.property(layerId);
		});

		it('adds vectors even if they have been removed just before', () => {
			const layer = new Circle([0, 0]).addTo(map),
			layerId = Util.stamp(layer),
			svg = map.getRenderer(layer);

			expect(svg._layers).to.have.property(layerId);

			map.removeLayer(layer);
			map.addLayer(layer);
			expect(svg._layers).to.have.property(layerId);
		});
	});

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

	describe('SVG #remove', () => {
		it('can remove the map without errors', () => {
			new Polygon(latLngs).addTo(map);
			map.remove();
			map = null;
		});

		it('can remove renderer without errors', () => {
			map.remove();

			const svg = new SVG();
			map = new LeafletMap(container, {renderer: svg});
			map.setView([0, 0], 6);
			new Polygon(latLngs).addTo(map);

			svg.remove();
			map.remove();
			map = null;
		});
	});

	describe('#viewBox updates', () => {
		it('updates viewBox on zoom', () => {
			const layer = new Circle([0, 0], {radius: 100000}).addTo(map);
			const svg = map.getRenderer(layer);
			const initialViewBox = svg._container.getAttribute('viewBox');

			map.setZoom(7, {animate: false});

			const newViewBox = svg._container.getAttribute('viewBox');
			expect(newViewBox).to.not.equal(initialViewBox);
		});

		it('updates viewBox on pan', () => {
			const layer = new Circle([0, 0], {radius: 100000}).addTo(map);
			const svg = map.getRenderer(layer);
			const initialViewBox = svg._container.getAttribute('viewBox');

			map.panBy([50, 50], {animate: false});

			const newViewBox = svg._container.getAttribute('viewBox');
			expect(newViewBox).to.not.equal(initialViewBox);
		});
	});

	describe('#mixed renderers', () => {
		it('can mix SVG and Canvas renderers on the same map', () => {
			const svgLayer = new Circle([0, 0], {
				radius: 100000,
				renderer: new SVG()
			}).addTo(map);

			const canvasLayer = new Circle([1, 1], {
				radius: 100000,
				renderer: new Canvas()
			}).addTo(map);

			expect(map.hasLayer(svgLayer)).to.be.true;
			expect(map.hasLayer(canvasLayer)).to.be.true;
			expect(svgLayer._renderer).to.not.equal(canvasLayer._renderer);
		});
	});
});
