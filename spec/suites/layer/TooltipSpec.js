describe('Tooltip', function () {

	var c, map, p2ll,
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
		p2ll = function (x, y) {
			return map.layerPointToLatLng([x, y]);
		};
	});

	afterEach(function () {
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
		var marker1 = new L.Marker(new L.LatLng(55.8, 37.6), {description: "I'm marker 1."});
		var marker2 = new L.Marker(new L.LatLng(54.6, 38.2), {description: "I'm marker 2."});
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

	it("can call closeTooltip while not on the map", function () {
		var layer = new L.Marker(center);
		layer.bindTooltip('Tooltip', {interactive: true});
		layer.closeTooltip();
	});

});

