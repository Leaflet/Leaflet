describe('Tooltip', function () {
	var c, map,
	    center = [55.8, 37.6];

	beforeEach(function () {
		c = document.createElement('div');
		c.style.width = '400px';
		c.style.height = '400px';
		// Allow to use happen.at with determinist positions.
		c.style.position = 'absolute';
		c.style.top = '0';
		c.style.left = '0';
		document.body.appendChild(c);
		map = new L.Map(c);
		map.setView(center, 6);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(c);
	});

	it("opens on marker mouseover and close on mouseout", function () {
		var layer = new L.Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');

		happen.mouseover(layer._icon, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.mouseout(layer._icon, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it("stays open on marker when permanent", function () {
		var layer = new L.Marker(center).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it("can be added with bindTooltip before added to the map", function () {
		var layer = new L.Marker(center);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it("is removed when removing marker", function () {
		var layer = new L.Marker(center).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it("can be made interactive", function () {
		var layer = new L.Marker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		happen.click(layer._tooltip._container);
		expect(spy.calledOnce).to.be(true);
	});

	it("has class leaflet-interactive", function () {
		var layer = new L.Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		expect(L.DomUtil.hasClass(layer._tooltip._container, 'leaflet-interactive')).to.be(true);
	});

	it("has not class leaflet-interactive", function () {
		var layer = new L.Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true});
		expect(L.DomUtil.hasClass(layer._tooltip._container, 'leaflet-interactive')).to.be(false);
	});

	it("can be forced on left direction", function () {
		var layer = new L.Marker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A long tooltip that should be displayed on the left', {permanent: true, direction: 'left', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 150, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it("honours offset on left direction", function () {
		var layer = new L.Marker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A long tooltip that should be displayed on the left', {permanent: true, direction: 'left', interactive: true, offset: [-20, -20]});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 150, 180);
		expect(spy.calledOnce).to.be(false);
		happen.at('click', 130, 160);
		expect(spy.calledOnce).to.be(true);
	});

	it("can be forced on top direction", function () {
		var layer = L.circleMarker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'top', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 200, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it("honours offset on top direction", function () {
		var layer = L.circleMarker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'top', interactive: true, offset: [-20, -20]});
		happen.at('click', 200, 180);
		expect(spy.calledOnce).to.be(false);
		happen.at('click', 180, 150);
		expect(spy.calledOnce).to.be(true);
	});

	it("can be forced on bottom direction", function () {
		var layer = L.circleMarker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'bottom', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 200, 220);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it("honours offset on bottom direction", function () {
		var layer = L.circleMarker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'bottom', interactive: true, offset: [20, 20]});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 200, 220);
		expect(spy.calledOnce).to.be(false);
		happen.at('click', 220, 230);
		expect(spy.calledOnce).to.be(true);
	});

	it("can be forced on center", function () {
		var layer = new L.Marker(center).addTo(map);
		var spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the center', {permanent: true, direction: 'center', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 150, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it("honours opacity option", function () {
		var layer = new L.Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true, opacity: 0.57});
		expect(layer._tooltip._container.style.opacity).to.eql(0.57);
	});

	it("can change opacity with setOpacity", function () {
		var layer = new L.Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true});
		expect(layer._tooltip._container.style.opacity).to.eql(0.9);
		layer._tooltip.setOpacity(0.57);
		expect(layer._tooltip._container.style.opacity).to.eql(0.57);
	});

	it("it should use a tooltip with a function as content with a FeatureGroup", function () {
		var marker1 = new L.Marker([55.8, 37.6], {description: "I'm marker 1."});
		var marker2 = new L.Marker([54.6, 38.2], {description: "I'm marker 2."});
		var group = new L.FeatureGroup([marker1, marker2]).addTo(map);

		group.bindTooltip(function (layer) {
			return layer.options.description;
		});

		// toggle popup on marker1
		happen.mouseover(marker1._icon, {relatedTarget: map._container});
		expect(map.hasLayer(group._tooltip)).to.be(true);
		expect(group._tooltip._container.innerHTML).to.be("I'm marker 1.");

		// toggle popup on marker2
		happen.mouseover(marker2._icon, {relatedTarget: map._container});
		expect(map.hasLayer(group._tooltip)).to.be(true);
		expect(group._tooltip._container.innerHTML).to.be("I'm marker 2.");
	});

	it("opens on polygon mouseover and close on mouseout", function () {
		var layer = new L.Polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip');

		happen.mouseover(layer._path, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.mouseout(layer._path, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it("stays open on polygon when permanent", function () {
		var layer = new L.Polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it("can be added on polygon with bindTooltip before beind added to the map", function () {
		var layer = new L.Polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it("opens on polyline mouseover and close on mouseout", function () {
		var layer = new L.Polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip');

		happen.mouseover(layer._path, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.mouseout(layer._path, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it("stays open on polyline when permanent", function () {
		var layer = new L.Polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it("can be added on polyline with bindTooltip before added to the map", function () {
		var layer = new L.Polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it.skipIfNotTouch("is opened when tapping on touch", function () {
		var layer = new L.Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		happen.click(layer._icon);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it.skipIfNotTouch("is closed if not permanent when clicking on the map elsewhere on touch", function () {
		var layer = new L.Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		happen.click(layer._icon);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.click(map._container);
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});


	it("opens with map.openTooltip", function (done) {
		map.on('tooltipopen', function (e) {
			expect(map.hasLayer(e.tooltip)).to.be(true);
			done();
		});
		map.openTooltip('Tooltip', center);
	});

	it("map.openTooltip considers interactive option", function () {
		if (!window.getComputedStyle) { this.skip(); } // IE9+

		var tooltip = L.tooltip({interactive: true}).setContent('Tooltip');
		map.openTooltip(tooltip, center);
		expect(getComputedStyle(tooltip._container).pointerEvents).to.equal('auto');
	});

	it("can call closeTooltip while not on the map", function () {
		var layer = new L.Marker(center);
		layer.bindTooltip('Tooltip', {interactive: true});
		layer.closeTooltip();
	});

	it("opens a tooltip and follow the mouse (sticky)", function () {
		var layer = L.rectangle([[58, 39.7], [54, 35.3]]).addTo(map);
		layer.bindTooltip('Sticky', {sticky: true}).openTooltip();
		var tooltip = layer.getTooltip();
		expect(tooltip.getLatLng().equals(layer.getCenter())).to.be(true);

		happen.at('click', 120, 120);
		var latlng = map.containerPointToLatLng([120, 120]);
		expect(tooltip.getLatLng().equals(latlng)).to.be(true);
	});

	it("opens a permanent tooltip and follow the mouse (sticky)", function (done) {
		var layer = L.rectangle([[58, 39.7], [54, 35.3]]).addTo(map);
		layer.bindTooltip('Sticky', {sticky: true, permanent: true}).openTooltip();
		var tooltip = layer.getTooltip();
		expect(tooltip.getLatLng().equals(layer.getCenter())).to.be(true);

		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				var latlng = map.containerPointToLatLng([120, 120]);
				expect(tooltip.getLatLng().equals(latlng)).to.be(true);
				done();
			}
		});
		var toucher = hand.growFinger('mouse');
		toucher.wait(100).moveTo(120, 120, 1000).wait(100);
	});

	it("closes existent tooltip on new bindTooltip call", function () {
		var layer = new L.Marker(center).addTo(map);
		var eventSpy = sinon.spy(layer, "unbindTooltip");
		layer.bindTooltip('Tooltip1', {permanent: true});
		var tooltip1 = layer.getTooltip();
		layer.bindTooltip('Tooltip2').openTooltip();
		layer.unbindTooltip.restore(); // unwrap the spy
		expect(map.hasLayer(tooltip1)).to.not.be.ok();
		expect(eventSpy.calledOnce).to.be.ok();
	});

	it("don't opens the tooltip on marker mouseover while dragging map", function () {
		// Sometimes the mouse is moving faster then the map while dragging and then the marker can be hover and
		// the tooltip opened / closed.
		var layer = L.marker(center).addTo(map).bindTooltip('Tooltip');
		var tooltip = layer.getTooltip();

		// simulate map dragging
		map.dragging.moving = function () {
			return true;
		};
		happen.at('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be(false);

		// simulate map not dragging anymore
		map.dragging.moving = function () {
			return false;
		};
		happen.at('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be.ok();
	});

	it("closes the tooltip on marker mouseout while dragging map and don't open it again", function () {
		// Sometimes the mouse is moving faster then the map while dragging and then the marker can be hover and
		// the tooltip opened / closed.
		var layer = L.marker(center).addTo(map).bindTooltip('Tooltip');
		var tooltip = layer.getTooltip();

		// open tooltip before "dragging map"
		happen.at('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be.ok();

		// simulate map dragging
		map.dragging.moving = function () {
			return true;
		};
		happen.mouseout(layer._icon, {relatedTarget: map._container});
		expect(tooltip.isOpen()).to.be(false);

		// tooltip should not open again while dragging
		happen.at('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be(false);
	});
});
