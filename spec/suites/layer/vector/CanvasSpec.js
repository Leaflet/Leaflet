import {Canvas, Circle, CircleMarker, DomEvent, LayerGroup, LeafletMap, Marker, Polygon, Polyline, SVG, Util} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer, Finger} from '../../SpecHelper.js';

describe('Canvas', () => {
	let container, map, latLngs;

	function p2ll(x, y) {
		return map.layerPointToLatLng([x, y]);
	}

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {renderer: new Canvas(), zoomControl: false});
		map.setView([0, 0], 6);
		latLngs = [p2ll(0, 0), p2ll(0, 100), p2ll(100, 100), p2ll(100, 0)];
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('on a high-DPI screen', () => {
		let dpr;

		beforeEach(() => {
			// the renderer reads the ratio on resize, so recreate the map with the stub in place
			dpr = sinon.stub(window, 'devicePixelRatio').value(2);
			removeMapContainer(map, container);
			container = createContainer();
			map = new LeafletMap(container, {renderer: new Canvas(), zoomControl: false});
			map.setView([0, 0], 6);
		});

		afterEach(() => {
			dpr.restore();
		});

		it('renders at device resolution', async () => {
			const layer = new Polygon([p2ll(0, 0), p2ll(0, 20), p2ll(20, 20), p2ll(20, 0)], {stroke: false, fillOpacity: 1}).addTo(map);
			await new Promise((resolve) => { requestAnimationFrame(resolve); });

			const renderer = layer._renderer;
			const canvas = renderer._container;
			expect(canvas.width).to.equal(2 * canvas.clientWidth);
			expect(canvas.height).to.equal(2 * canvas.clientHeight);

			const min = renderer._bounds.min;
			const alphaAt = (x, y) => renderer._ctx.getImageData((x - min.x) * 2, (y - min.y) * 2, 1, 1).data[3];
			expect(alphaAt(15, 15)).to.equal(255);
			expect(alphaAt(25, 25)).to.equal(0);
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

		it('DOM events propagate from canvas polygon to map', () => {
			const spy = sinon.spy();
			map.on('click', spy);
			UIEventSimulator.fireAt('click', 50, 50);
			expect(spy.callCount).to.eql(1);
		});

		it('DOM events fired on canvas polygon can be cancelled before being caught by the map', () => {
			const mapSpy = sinon.spy();
			const layerSpy = sinon.spy();
			map.on('click', mapSpy);
			layer.on('click', DomEvent.stopPropagation).on('click', layerSpy);
			UIEventSimulator.fireAt('click', 50, 50);
			expect(layerSpy.callCount).to.eql(1);
			expect(mapSpy.callCount).to.eql(0);
		});

		it('DOM events fired on canvas polygon are propagated only once to the map even when two layers contains the event', () => {
			const spy = sinon.spy();
			new Polygon(latLngs).addTo(map); // layer 2
			map.on('click', spy);
			UIEventSimulator.fireAt('click', 50, 50);
			expect(spy.callCount).to.eql(1);
		});

		it('fires on the topmost layer under the pointer, following draw order changes', () => {
			const top = new Polygon(latLngs).addTo(map),
			bottomSpy = sinon.spy(),
			topSpy = sinon.spy();
			layer.on('click pointerover', bottomSpy);
			top.on('click pointerover', topSpy);

			UIEventSimulator.fireAt('pointermove', 50, 50);
			UIEventSimulator.fireAt('click', 50, 50);
			expect(topSpy.callCount).to.eql(2);
			expect(bottomSpy.callCount).to.eql(0);

			top.bringToBack();
			UIEventSimulator.fireAt('click', 50, 50);
			expect(bottomSpy.callCount).to.eql(1);
			expect(topSpy.callCount).to.eql(2);
		});

		it('handles every pointermove without throttling', () => {
			const moveSpy = sinon.spy(), overSpy = sinon.spy(), outSpy = sinon.spy();
			layer.on({pointermove: moveSpy, pointerover: overSpy, pointerout: outSpy});

			UIEventSimulator.fireAt('pointermove', 150, 150);
			UIEventSimulator.fireAt('pointermove', 50, 50);
			UIEventSimulator.fireAt('pointermove', 60, 60);
			expect(overSpy.callCount).to.eql(1);
			expect(moveSpy.callCount).to.eql(2);

			UIEventSimulator.fireAt('pointermove', 150, 150);
			expect(outSpy.callCount).to.eql(1);
		});

		it('should be transparent for DOM events going to non-canvas features', () => {
			const marker = new Marker(map.layerPointToLatLng([150, 150]))
				.addTo(map);
			const circle = new Circle(map.layerPointToLatLng([200, 200]), {
				radius: 20000,
				renderer: new SVG()
			}).addTo(map);

			const spyPolygon = sinon.spy();
			const spyMap = sinon.spy();
			const spyMarker = sinon.spy();
			const spyCircle = sinon.spy();
			layer.on('click', spyPolygon);
			map.on('click', spyMap);
			marker.on('click', spyMarker);
			circle.on('click', spyCircle);

			UIEventSimulator.fireAt('click', 50, 50);   // polygon (canvas)
			UIEventSimulator.fireAt('click', 151, 156); // empty space
			UIEventSimulator.fireAt('click', 150, 148); // marker
			UIEventSimulator.fireAt('click', 200, 200); // circle (svg)
			expect(spyPolygon.callCount).to.eql(1);
			expect(spyMap.callCount).to.eql(3); // except marker
			expect(spyMarker.callCount).to.eql(1);
			expect(spyCircle.callCount).to.eql(1);
		});

		it('does not block interactive layers underneath (#4135)', () => {
			map.createPane('top').style.zIndex = 450;
			new Polygon(latLngs, {renderer: new Canvas({pane: 'top'})}).addTo(map);
			const svgLayer = new Polygon(latLngs, {renderer: new SVG()}).addTo(map);
			const spy = sinon.spy();
			svgLayer.on('click', spy);
			UIEventSimulator.fireAt('click', 50, 50);
			expect(spy.calledOnce).to.be.true;
		});

		it('hit-tests multiple canvas renderers, topmost first', () => {
			map.createPane('top').style.zIndex = 450;
			const top = new Polygon([p2ll(0, 0), p2ll(0, 40), p2ll(40, 40), p2ll(40, 0)],
				{renderer: new Canvas({pane: 'top'})}).addTo(map);
			const topSpy = sinon.spy();
			const bottomSpy = sinon.spy();
			top.on('click', topSpy);
			layer.on('click', bottomSpy);

			UIEventSimulator.fireAt('click', 20, 20);
			expect(topSpy.calledOnce).to.be.true;
			expect(bottomSpy.called).to.be.false;

			UIEventSimulator.fireAt('click', 70, 70);
			expect(topSpy.calledOnce).to.be.true;
			expect(bottomSpy.calledOnce).to.be.true;
		});

		it('changes the cursor and fires pointerout when moving onto a marker', () => {
			const marker = new Marker(p2ll(150, 150)).addTo(map);
			const outSpy = sinon.spy();
			const markerSpy = sinon.spy();
			layer.on('pointerout', outSpy);
			marker.on('pointerover pointerout', markerSpy);

			UIEventSimulator.fireAt('pointermove', 50, 50);
			expect(map.getContainer().classList.contains('leaflet-interactive')).to.be.true;

			UIEventSimulator.fireAt('pointermove', 150, 148);
			expect(outSpy.calledOnce).to.be.true;
			expect(markerSpy.called).to.be.false;
			expect(map.getContainer().classList.contains('leaflet-interactive')).to.be.false;
		});

		it('should not block pointermove event going to non-canvas features', () => {
			const spyMap = sinon.spy();
			map.on('pointermove', spyMap);
			UIEventSimulator.fireAt('pointermove', 151, 151); // empty space
			expect(spyMap.calledOnce).to.be.true;
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

		it('should not fire click when dragging the map on top of it', async () => {
			const downSpy = sinon.spy();
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			layer.on('click', clickSpy);
			layer.on('preclick', preclickSpy);
			layer.on('pointerdown', downSpy);
			await new Finger().moveTo(50, 50).down().moveBy(20, 10).up();

			// Finger doesn't click after a drag, but some browsers do, so simulate it
			UIEventSimulator.fireAt('click', 70, 60);
			expect(downSpy.called).to.be.true;
			expect(clickSpy.called).to.be.false;
			expect(preclickSpy.called).to.be.false;
		});

		it('does fire pointerdown on layer after dragging map', async () => { // #7775
			const spy = sinon.spy();
			const center = p2ll(300, 300);
			const radius = p2ll(200, 200).distanceTo(center);
			const circle = new Circle(center, {radius}).addTo(map);
			circle.on('pointerdown', spy);

			await new Finger()
				.moveTo(300, 300).down().moveBy(5, 0).up()  // control case
				.moveTo(100, 100).down().moveBy(5, 0).up()  // drag the map (outside of circle)
				.moveTo(300, 300).down().moveBy(5, 0).up(); // expect pointerdown ok

			expect(spy.callCount).to.eql(2);
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

	describe('#dashArray', () => {
		it('can add polyline with dashArray', () => {
			new Polygon(latLngs, {
				dashArray: '5,5'
			}).addTo(map);
		});

		it('can setStyle with dashArray', () => {
			const layer = new Polygon(latLngs).addTo(map);
			layer.setStyle({
				dashArray: '5,5'
			});
		});
	});

	it('removes vector on next animation frame', (done) => {
		const layer = new Circle([0, 0]).addTo(map),
		layerId = Util.stamp(layer),
		canvas = map.getRenderer(layer);

		expect(canvas._layers).to.have.property(layerId);

		map.removeLayer(layer);
		// Defer check due to how Canvas renderer manages layer removal.
		requestAnimationFrame(() => {
			expect(canvas._layers).to.not.have.property(layerId);
			done();
		});
	});

	it('adds vectors even if they have been removed just before', (done) => {
		const layer = new Circle([0, 0]).addTo(map),
		layerId = Util.stamp(layer),
		canvas = map.getRenderer(layer);

		expect(canvas._layers).to.have.property(layerId);

		map.removeLayer(layer);
		map.addLayer(layer);
		expect(canvas._layers).to.have.property(layerId);
		// Re-perform a deferred check due to how Canvas renderer manages layer removal.
		requestAnimationFrame(() => {
			expect(canvas._layers).to.have.property(layerId);
			done();
		});
	});

	it('adds vectors even if the canvas container was removed', (done) => {
		const layer = new Circle([0, 0]).addTo(map);
		map.eachLayer((layer) => {
			map.removeLayer(layer);
		});

		const spy = sinon.spy();
		const canvas = map.getRenderer(layer);
		canvas._redraw = spy;

		map.addLayer(layer);

		// Double requestAnimationFrame needed: first to schedule the _redraw, second to verify it executed
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				expect(spy.callCount).to.eql(1);
				done();
			});
		});
	});

	describe('#_extendRedrawBounds', () => {
		it('pads by a string weight numerically', () => {
			const layer = new Polygon(latLngs, {weight: '3'}).addTo(map);
			map.getRenderer(layer)._redrawBounds = null;
			layer.redraw();
			const {min, max} = map.getRenderer(layer)._redrawBounds;
			expect([min.x, min.y, max.x, max.y]).to.eql([-5.5, -5.5, 105.5, 105.5]);
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

	describe('draw order', () => {
		let layers;

		// walks the renderer's draw list both ways, so a broken prev or next link fails too
		function drawOrder() {
			const renderer = map.getRenderer(layers[0]), forward = [], backward = [];
			for (let o = renderer._drawFirst; o; o = o.next) { forward.push(layers.indexOf(o.layer)); }
			for (let o = renderer._drawLast; o; o = o.prev) { backward.unshift(layers.indexOf(o.layer)); }
			expect(backward).to.eql(forward);
			return forward;
		}

		beforeEach(() => {
			layers = [0, 1, 2, 3].map(() => new CircleMarker([0, 0]).addTo(map));
		});

		it('follows the order layers were added in', () => {
			expect(drawOrder()).to.eql([0, 1, 2, 3]);
		});

		it('moves layers to the front', () => {
			layers[1].bringToFront();
			expect(drawOrder()).to.eql([0, 2, 3, 1]);
			layers[0].bringToFront();
			expect(drawOrder()).to.eql([2, 3, 1, 0]);
			layers[0].bringToFront();
			expect(drawOrder()).to.eql([2, 3, 1, 0]);
		});

		it('moves layers to the back', () => {
			layers[2].bringToBack();
			expect(drawOrder()).to.eql([2, 0, 1, 3]);
			layers[3].bringToBack();
			expect(drawOrder()).to.eql([3, 2, 0, 1]);
			layers[3].bringToBack();
			expect(drawOrder()).to.eql([3, 2, 0, 1]);
		});

		it('unlinks removed layers and appends re-added ones', () => {
			layers[0].remove();
			expect(drawOrder()).to.eql([1, 2, 3]);
			layers[2].remove();
			expect(drawOrder()).to.eql([1, 3]);
			layers[3].remove();
			expect(drawOrder()).to.eql([1]);

			layers[1].bringToFront();
			layers[1].bringToBack();
			expect(drawOrder()).to.eql([1]);

			layers[1].remove();
			expect(drawOrder()).to.eql([]);

			layers[2].addTo(map);
			layers[0].addTo(map);
			expect(drawOrder()).to.eql([2, 0]);
		});
	});

	describe('Canvas #remove', () => {
		it('can remove the map without errors', (done) => {
			new Polygon(latLngs).addTo(map);
			map.remove();
			map = null;
			requestAnimationFrame(() => { done(); });
		});

		it('can remove the map without errors after a view reset', (done) => {
			new Polygon(latLngs).addTo(map);
			map.setView([1, 1], 7, {animate: false});
			map.remove();
			map = null;
			requestAnimationFrame(() => { done(); });
		});

		it('can remove renderer without errors', (done) => {
			map.remove();

			const canvas = new Canvas();
			map = new LeafletMap(container, {renderer: canvas});
			map.setView([0, 0], 6);
			new Polygon(latLngs).addTo(map);

			canvas.remove();
			map.remove();
			map = null;
			requestAnimationFrame(() => { done(); });
		});
	});

	describe('#_containsPoint', () => {
		it('detects point inside polygon', () => {
			const polygon = new Polygon([
				[-5, -5],
				[-5, 5],
				[5, 5],
				[5, -5]
			]).addTo(map);

			expect(polygon._containsPoint(map.latLngToLayerPoint([5, 5]))).to.be.true;
			expect(polygon._containsPoint(map.latLngToLayerPoint([-5, -5]))).to.be.true;
			expect(polygon._containsPoint(map.latLngToLayerPoint([0, 0]))).to.be.true;
			expect(polygon._containsPoint(map.latLngToLayerPoint([-5, 5]))).to.be.true;
		});

		it('does not detect point outside polygon', () => {
			const polygon = new Polygon([
				[-5, -5],
				[-5, 5],
				[5, 5],
				[5, -5]
			]).addTo(map);

			expect(polygon._containsPoint(map.latLngToLayerPoint([-5.1, 5]))).to.be.false;
			expect(polygon._containsPoint(map.latLngToLayerPoint([0, 7]))).to.be.false;
		});

		it('does not detect point which is outside of rendered polygon but is inside of polygon coords', () => {
			// TODO: Is this a wanted behavior? The point is inside the polygon but outside of the rendered area, so it is not detected as inside. Maybe we should detect it as inside anyway?
			const polygon = new Polygon([
				[0, 0],
				[0, 10],
				[10, 10], // outside of rendered area
				[10, 0]
			]).addTo(map);

			expect(polygon._containsPoint(map.latLngToLayerPoint([9, 9]))).to.be.false;
		});

		it('does detect point in multi-polygon correctly', () => {
			const polygon = new Polygon([
				[
					[-5, -5],
					[-5, 5],
					[5, 5],
					[5, -5]
				],
				[
					[3, 3],
					[3, 7],
					[7, 7],
					[7, 3]
				]
			]).addTo(map);

			expect(polygon._containsPoint(map.latLngToLayerPoint([4, 4]))).to.be.false; // inside the hole
			expect(polygon._containsPoint(map.latLngToLayerPoint([5, 5]))).to.be.true;
		});

		it('detects point on the line', () => {
			const line = new Polyline([[-5, -5], [0, -5]]).addTo(map);
			expect(line._containsPoint(map.latLngToLayerPoint([-5, -5]))).to.be.true;
			expect(line._containsPoint(map.latLngToLayerPoint([-2.5, -5]))).to.be.true;
			expect(line._containsPoint(map.latLngToLayerPoint([0, -5]))).to.be.true;
		});

		it('does not detect point on the line', () => {
			const line = new Polyline([[-5, -5], [0, -5]]).addTo(map);
			expect(line._containsPoint(map.latLngToLayerPoint([-10, -5]))).to.be.false;
			expect(line._containsPoint(map.latLngToLayerPoint([0, 0]))).to.be.false;
			expect(line._containsPoint(map.latLngToLayerPoint([-5.1, -5]))).to.be.false;
			expect(line._containsPoint(map.latLngToLayerPoint([-5, -5.1]))).to.be.false;
		});

		it('detects point in circle marker', () => {
			const circlemarker = new CircleMarker([0, 0], {radius: 10}).addTo(map);
			expect(circlemarker._containsPoint(map.latLngToLayerPoint([0, 0]))).to.be.true;
			expect(circlemarker._containsPoint(map.latLngToLayerPoint([20, 0]))).to.be.false;
		});
	});
});
