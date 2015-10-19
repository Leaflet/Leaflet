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

});
