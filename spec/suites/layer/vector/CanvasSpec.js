describe('Canvas', () => {
	let container, map, latLngs;

	function p2ll(x, y) {
		return map.layerPointToLatLng([x, y]);
	}

	beforeEach(() => {
		container = createContainer();
		map = L.map(container, {preferCanvas: true, zoomControl: false});
		map.setView([0, 0], 6);
		latLngs = [p2ll(0, 0), p2ll(0, 100), p2ll(100, 100), p2ll(100, 0)];
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#events', () => {
		let layer;

		beforeEach(() => {
			layer = L.polygon(latLngs).addTo(map);
		});

		it('should fire event when layer contains mouse', () => {
			const spy = sinon.spy();
			layer.on('click', spy);
			happen.at('click', 50, 50);  // Click on the layer.
			expect(spy.callCount).to.eql(1);
			happen.at('click', 150, 150);  // Click outside layer.
			expect(spy.callCount).to.eql(1);
		});

		it('DOM events propagate from canvas polygon to map', () => {
			const spy = sinon.spy();
			map.on('click', spy);
			happen.at('click', 50, 50);
			expect(spy.callCount).to.eql(1);
		});

		it('DOM events fired on canvas polygon can be cancelled before being caught by the map', () => {
			const mapSpy = sinon.spy();
			const layerSpy = sinon.spy();
			map.on('click', mapSpy);
			layer.on('click', L.DomEvent.stopPropagation).on('click', layerSpy);
			happen.at('click', 50, 50);
			expect(layerSpy.callCount).to.eql(1);
			expect(mapSpy.callCount).to.eql(0);
		});

		it('DOM events fired on canvas polygon are propagated only once to the map even when two layers contains the event', () => {
			const spy = sinon.spy();
			L.polygon(latLngs).addTo(map); // layer 2
			map.on('click', spy);
			happen.at('click', 50, 50);
			expect(spy.callCount).to.eql(1);
		});

		it('should be transparent for DOM events going to non-canvas features', () => {
			const marker = L.marker(map.layerPointToLatLng([150, 150]))
				.addTo(map);
			const circle = L.circle(map.layerPointToLatLng([200, 200]), {
				radius: 20000,
				renderer: L.svg()
			}).addTo(map);

			const spyPolygon = sinon.spy();
			const spyMap = sinon.spy();
			const spyMarker = sinon.spy();
			const spyCircle = sinon.spy();
			layer.on('click', spyPolygon);
			map.on('click', spyMap);
			marker.on('click', spyMarker);
			circle.on('click', spyCircle);

			happen.at('click', 50, 50);   // polygon (canvas)
			happen.at('click', 151, 151); // empty space
			happen.at('click', 150, 148); // marker
			happen.at('click', 200, 200); // circle (svg)
			expect(spyPolygon.callCount).to.eql(1);
			expect(spyMap.callCount).to.eql(3); // except marker
			expect(spyMarker.callCount).to.eql(1);
			expect(spyCircle.callCount).to.eql(1);
		});

		it('should not block mousemove event going to non-canvas features', () => {
			const spyMap = sinon.spy();
			map.on('mousemove', spyMap);
			happen.at('mousemove', 151, 151); // empty space
			expect(spyMap.calledOnce).to.be.ok();
		});

		it('should fire preclick before click', () => {
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			layer.on('click', clickSpy);
			layer.on('preclick', preclickSpy);
			layer.once('preclick', () => {
				expect(clickSpy.called).to.be(false);
			});
			happen.at('click', 50, 50);  // Click on the layer.
			expect(clickSpy.callCount).to.eql(1);
			expect(preclickSpy.callCount).to.eql(1);
			happen.at('click', 150, 150);  // Click outside layer.
			expect(clickSpy.callCount).to.eql(1);
			expect(preclickSpy.callCount).to.eql(1);
		});

		it('should not fire click when dragging the map on top of it', (done) => {
			const downSpy = sinon.spy();
			const clickSpy = sinon.spy();
			const preclickSpy = sinon.spy();
			layer.on('click', clickSpy);
			layer.on('preclick', preclickSpy);
			layer.on('mousedown', downSpy);
			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					// Prosthetic does not fire a click when we down+up, but it real world
					// browsers would, so let's simulate it.
					happen.at('click', 70, 60);
					expect(downSpy.called).to.be(true);
					expect(clickSpy.called).to.be(false);
					expect(preclickSpy.called).to.be(false);
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(50, 50, 0)
				.down().moveBy(20, 10, 200).up();
		});

		it('does fire mousedown on layer after dragging map', (done) => { // #7775
			const spy = sinon.spy();
			const center = p2ll(300, 300);
			const radius = p2ll(200, 200).distanceTo(center);
			const circle = L.circle(center, {radius}).addTo(map);
			circle.on('mousedown', spy);

			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(spy.callCount).to.eql(2);
					done();
				}
			});
			const mouse = hand.growFinger('mouse');

			mouse.wait(100)
				.moveTo(300, 300, 0).down().moveBy(5, 0, 20).up()  // control case
				.moveTo(100, 100, 0).down().moveBy(5, 0, 20).up()  // drag the map (outside of circle)
				.moveTo(300, 300, 0).down().moveBy(5, 0, 20).up(); // expect mousedown ok
		});
	});

	describe('#events(interactive=false)', () => {
		it('should not fire click when not interactive', () => {
			const layer = L.polygon(latLngs, {interactive: false}).addTo(map);
			const spy = sinon.spy();
			layer.on('click', spy);
			happen.at('click', 50, 50);  // Click on the layer.
			expect(spy.callCount).to.eql(0);
			happen.at('click', 150, 150);  // Click outside layer.
			expect(spy.callCount).to.eql(0);
		});
	});

	describe('#dashArray', () => {
		it('can add polyline with dashArray', () => {
			L.polygon(latLngs, {
				dashArray: '5,5'
			}).addTo(map);
		});

		it('can setStyle with dashArray', () => {
			const layer = L.polygon(latLngs).addTo(map);
			layer.setStyle({
				dashArray: '5,5'
			});
		});
	});

	it('removes vector on next animation frame', function (done) {
		const layer = L.circle([0, 0]).addTo(map),
		    layerId = L.stamp(layer),
		    canvas = map.getRenderer(layer);

		expect(canvas._layers).to.have.property(layerId);

		map.removeLayer(layer);
		// Defer check due to how Canvas renderer manages layer removal.
		L.Util.requestAnimFrame(() => {
			expect(canvas._layers).to.not.have.property(layerId);
			done();
		}, this);
	});

	it('adds vectors even if they have been removed just before', function (done) {
		const layer = L.circle([0, 0]).addTo(map),
		    layerId = L.stamp(layer),
		    canvas = map.getRenderer(layer);

		expect(canvas._layers).to.have.property(layerId);

		map.removeLayer(layer);
		map.addLayer(layer);
		expect(canvas._layers).to.have.property(layerId);
		// Re-perform a deferred check due to how Canvas renderer manages layer removal.
		L.Util.requestAnimFrame(() => {
			expect(canvas._layers).to.have.property(layerId);
			done();
		}, this);
	});

	describe('#bringToBack', () => {
		it('is a no-op for layers not on a map', () => {
			const path = L.polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToBack()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', () => {
			const group = L.layerGroup().addTo(map);
			const path = L.polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToBack()).to.equal(path);
		});
	});

	describe('#bringToFront', () => {
		it('is a no-op for layers not on a map', () => {
			const path = L.polyline([[1, 2], [3, 4], [5, 6]]);
			expect(path.bringToFront()).to.equal(path);
		});

		it('is a no-op for layers no longer in a LayerGroup', () => {
			const group = L.layerGroup().addTo(map);
			const path = L.polyline([[1, 2], [3, 4], [5, 6]]).addTo(group);

			group.clearLayers();

			expect(path.bringToFront()).to.equal(path);
		});
	});

	describe('Canvas #remove', () => {
		it('can remove the map without errors', (done) => {
			L.polygon(latLngs).addTo(map);
			map.remove();
			map = null;
			L.Util.requestAnimFrame(() => { done(); });
		});

		it('can remove renderer without errors', (done) => {
			map.remove();

			const canvas = L.canvas();
			map = L.map(container, {renderer: canvas});
			map.setView([0, 0], 6);
			L.polygon(latLngs).addTo(map);

			canvas.remove();
			map.remove();
			map = null;
			L.Util.requestAnimFrame(() => { done(); });
		});
	});
});
