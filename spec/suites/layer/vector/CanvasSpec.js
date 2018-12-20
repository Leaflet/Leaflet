describe('Canvas', function () {

	var c, map, p2ll, latLngs;

	before(function () {
		c = document.createElement('div');
		c.style.width = '400px';
		c.style.height = '400px';
		c.style.position = 'absolute';
		c.style.top = '0';
		c.style.left = '0';
		document.body.appendChild(c);
		map = new L.Map(c, {preferCanvas: true, zoomControl: false});
		map.setView([0, 0], 6);
		p2ll = function (x, y) {
			return map.layerPointToLatLng([x, y]);
		};
		latLngs = [p2ll(0, 0), p2ll(0, 100), p2ll(100, 100), p2ll(100, 0)];
	});

	after(function () {
		document.body.removeChild(c);
	});

	describe("#events", function () {
		var layer;

		beforeEach(function () {
			layer = L.polygon(latLngs).addTo(map);
		});

		afterEach(function () {
			layer.remove();
		});

		it("should fire event when layer contains mouse", function () {
			var spy = sinon.spy();
			layer.on('click', spy);
			happen.at('click', 50, 50);  // Click on the layer.
			expect(spy.callCount).to.eql(1);
			happen.at('click', 150, 150);  // Click outside layer.
			expect(spy.callCount).to.eql(1);
			layer.off("click", spy);
		});

		it("DOM events propagate from canvas polygon to map", function () {
			var spy = sinon.spy();
			map.on("click", spy);
			happen.at('click', 50, 50);
			expect(spy.callCount).to.eql(1);
			map.off("click", spy);
		});

		it("DOM events fired on canvas polygon can be cancelled before being caught by the map", function () {
			var mapSpy = sinon.spy();
			var layerSpy = sinon.spy();
			map.on("click", mapSpy);
			layer.on("click", L.DomEvent.stopPropagation).on("click", layerSpy);
			happen.at('click', 50, 50);
			expect(layerSpy.callCount).to.eql(1);
			expect(mapSpy.callCount).to.eql(0);
			map.off("click", mapSpy);
			layer.off("click", L.DomEvent.stopPropagation).off("click", layerSpy);
		});

		it("DOM events fired on canvas polygon are propagated only once to the map even when two layers contains the event", function () {
			var spy = sinon.spy();
			var layer2 = L.polygon(latLngs).addTo(map);
			map.on("click", spy);
			happen.at('click', 50, 50);
			expect(spy.callCount).to.eql(1);
			layer2.remove();
			map.off("click", spy);
		});

		it("should fire preclick before click", function () {
			var clickSpy = sinon.spy();
			var preclickSpy = sinon.spy();
			layer.on('click', clickSpy);
			layer.on('preclick', preclickSpy);
			layer.once('preclick', function (e) {
				expect(clickSpy.called).to.be(false);
			});
			happen.at('click', 50, 50);  // Click on the layer.
			expect(clickSpy.callCount).to.eql(1);
			expect(preclickSpy.callCount).to.eql(1);
			happen.at('click', 150, 150);  // Click outside layer.
			expect(clickSpy.callCount).to.eql(1);
			expect(preclickSpy.callCount).to.eql(1);
			layer.off();
		});

		it("should not fire click when dragging the map on top of it", function (done) {
			var downSpy = sinon.spy();
			var clickSpy = sinon.spy();
			var preclickSpy = sinon.spy();
			layer.on('click', clickSpy);
			layer.on('preclick', preclickSpy);
			layer.on('mousedown', downSpy);
			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					// Prosthetic does not fire a click when we down+up, but it real world
					// browsers would, so let's simulate it.
					happen.at('click', 70, 60);
					expect(downSpy.called).to.be(true);
					expect(clickSpy.called).to.be(false);
					expect(preclickSpy.called).to.be(false);
					layer.off();
					done();
				}
			});
			var mouse = hand.growFinger('mouse');

			// We move 5 pixels first to overcome the 3-pixel threshold of
			// L.Draggable.
			mouse.moveTo(50, 50, 0)
				.down().moveBy(20, 10, 200).up();
		});

	});

	describe("#events(interactive=false)", function () {
		var layer;

		beforeEach(function () {
			layer = L.polygon(latLngs, {interactive: false}).addTo(map);
		});

		afterEach(function () {
			layer.remove();
		});

		it("should not fire click when not interactive", function () {
			var spy = sinon.spy();
			layer.on('click', spy);
			happen.at('click', 50, 50);  // Click on the layer.
			expect(spy.callCount).to.eql(0);
			happen.at('click', 150, 150);  // Click outside layer.
			expect(spy.callCount).to.eql(0);
			layer.off("click", spy);
		});

	});

	describe('#dashArray', function () {
		it('can add polyline with dashArray', function () {
			var layer = L.polygon(latLngs, {
				dashArray: "5,5"
			}).addTo(map);
		});
		it('can setStyle with dashArray', function () {
			var layer = L.polygon(latLngs).addTo(map);
			layer.setStyle({
				dashArray: "5,5"
			});
		});
	});

	it('removes vector on next animation frame', function (done) {
		var layer = L.circle([0, 0]).addTo(map),
		    layerId = L.stamp(layer),
		    canvas = map.getRenderer(layer);

		expect(canvas._layers.hasOwnProperty(layerId)).to.be(true);

		map.removeLayer(layer);
		// Defer check due to how Canvas renderer manages layer removal.
		L.Util.requestAnimFrame(function () {
			expect(canvas._layers.hasOwnProperty(layerId)).to.be(false);
			done();
		}, this);
	});

	it('adds vectors even if they have been removed just before', function (done) {
		var layer = L.circle([0, 0]).addTo(map),
		    layerId = L.stamp(layer),
		    canvas = map.getRenderer(layer);

		expect(canvas._layers.hasOwnProperty(layerId)).to.be(true);

		map.removeLayer(layer);
		map.addLayer(layer);
		expect(canvas._layers.hasOwnProperty(layerId)).to.be(true);
		// Re-perform a deferred check due to how Canvas renderer manages layer removal.
		L.Util.requestAnimFrame(function () {
			expect(canvas._layers.hasOwnProperty(layerId)).to.be(true);
			done();
		}, this);
	});

});

describe('Canvas remove', function () {

	var c;

	before(function () {
		c = document.createElement('div');
		c.style.width = '400px';
		c.style.height = '400px';
		c.style.position = 'absolute';
		c.style.top = '0';
		c.style.left = '0';
		document.body.appendChild(c);
	});

	after(function () {
		document.body.removeChild(c);
	});

	function createCanvasMap(c, options) {
		var map = new L.Map(c, options);
		map.setView([0, 0], 6);
		var p2ll = function (x, y) {
			return map.layerPointToLatLng([x, y]);
		};
		var latLngs = [p2ll(0, 0), p2ll(0, 100), p2ll(100, 100), p2ll(100, 0)];
		var layer = L.polygon(latLngs).addTo(map);
		return map;
	}

	it("can remove the map without errors", function (done) {
		var map1 = createCanvasMap(c, {preferCanvas: true, zoomControl: false});
		map1.remove();
		L.Util.requestAnimFrame(function () { done(); });
	});

	it("can remove renderer without errors", function (done) {
		var canvas = L.canvas();
		var map = createCanvasMap(c, {renderer: canvas, zoomControl: false});
		canvas.remove();
		map.remove();
		L.Util.requestAnimFrame(function () { done(); });
	});

});

