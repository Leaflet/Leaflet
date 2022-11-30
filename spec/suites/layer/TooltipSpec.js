describe('Tooltip', () => {
	let container, map;
	const center = [55.8, 37.6];

	beforeEach(() => {
		container = container = createContainer();
		map = L.map(container);
		map.setView(center, 6);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('opens on marker mouseover and close on mouseout', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip');

		happen.mouseover(layer._icon, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.mouseout(layer._icon, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it('opens on marker focus and closes on blur', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip');

		const element = layer.getElement();

		happen.once(element, {type:'focus'});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.once(element, {type:'blur'});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it('opens on marker focus and closes on blur when first bound, then added to map', () => {
		const layer = L.marker(center);

		layer.bindTooltip('Tooltip').addTo(map);

		const element = layer.getElement();

		happen.once(element, {type:'focus'});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.once(element, {type:'blur'});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it('opens on marker focus and closes on blur in layer group', () => {
		const marker1 = L.marker([41.18, 9.45], {description: 'Marker 1'});
		const marker2 = L.marker([41.18, 9.46], {description: 'Marker 2'});
		const group = new L.FeatureGroup([marker1, marker2]).addTo(map);
		group.bindTooltip(layer => `Group tooltip: ${layer.options.description}`);

		const element1 = marker1.getElement();
		const element2 = marker2.getElement();

		happen.once(element1, {type:'focus'});

		expect(map.hasLayer(group._tooltip)).to.be(true);
		expect(group._tooltip._container.innerHTML).to.be('Group tooltip: Marker 1');

		happen.once(element1, {type:'blur'});
		expect(map.hasLayer(group._tooltip)).to.be(false);

		happen.once(element2, {type:'focus'});

		expect(map.hasLayer(group._tooltip)).to.be(true);
		expect(group._tooltip._container.innerHTML).to.be('Group tooltip: Marker 2');

		happen.once(element2, {type:'blur'});
		expect(map.hasLayer(group._tooltip)).to.be(false);
	});

	it('is mentioned in aria-describedby of a bound layer', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		const element = layer.getElement();

		happen.once(element, {type:'focus'});

		const tooltip = layer.getTooltip();
		expect(element.getAttribute('aria-describedby')).to.equal(tooltip._container.id);
	});

	it('is mentioned in aria-describedby of a bound layer group', () => {
		const marker1 = L.marker([41.18, 9.45], {description: 'Marker 1'});
		const marker2 = L.marker([41.18, 9.46], {description: 'Marker 2'});
		const group = new L.FeatureGroup([marker1, marker2]).addTo(map);
		group.bindTooltip(layer => `Group tooltip: ${layer.options.description}`);

		const element = marker2.getElement();

		happen.once(element, {type:'focus'});

		const tooltip = group.getTooltip();
		expect(element.getAttribute('aria-describedby')).to.equal(tooltip._container.id);

	});

	it('stays open on marker when permanent', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it('can be added with bindTooltip before added to the map', () => {
		const layer = L.marker(center);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it('is removed when removing marker', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it('is not interactive by default', () => {
		const layer = L.marker(center).addTo(map);
		const spy = sinon.spy();

		layer.bindTooltip('Tooltip', {permanent: true});
		layer._tooltip.on('click', spy);
		happen.click(layer._tooltip._container);
		expect(spy.called).to.be(false);
	});

	it('can be made interactive', () => {
		const layer = L.marker(center).addTo(map);
		const spy = sinon.spy();

		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		layer._tooltip.on('click', spy);
		happen.click(layer._tooltip._container);
		expect(spy.calledOnce).to.be(true);
	});

	it('events are propagated to bound layer', () => {
		const layer = L.marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		happen.click(layer._tooltip._container);
		expect(spy.calledOnce).to.be(true);
	});

	it('has class leaflet-interactive', () => {
		const layer = L.marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		expect(L.DomUtil.hasClass(layer._tooltip._container, 'leaflet-interactive')).to.be(true);
	});

	it('has not class leaflet-interactive', () => {
		const layer = L.marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true});
		expect(L.DomUtil.hasClass(layer._tooltip._container, 'leaflet-interactive')).to.be(false);
	});

	it('can be forced on left direction', () => {
		const layer = L.marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A long tooltip that should be displayed on the left', {permanent: true, direction: 'left', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 150, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it('honours offset on left direction', () => {
		const layer = L.marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A long tooltip that should be displayed on the left', {permanent: true, direction: 'left', interactive: true, offset: [-20, -20]});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 150, 180);
		expect(spy.calledOnce).to.be(false);
		happen.at('click', 130, 160);
		expect(spy.calledOnce).to.be(true);
	});

	it('can be forced on top direction', () => {
		const layer = L.circleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'top', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 200, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it('honours offset on top direction', () => {
		const layer = L.circleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'top', interactive: true, offset: [-20, -20]});
		happen.at('click', 200, 180);
		expect(spy.calledOnce).to.be(false);
		happen.at('click', 180, 150);
		expect(spy.calledOnce).to.be(true);
	});

	it('can be forced on bottom direction', () => {
		const layer = L.circleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'bottom', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 200, 220);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it('honours offset on bottom direction', () => {
		const layer = L.circleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'bottom', interactive: true, offset: [20, 20]});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 200, 220);
		expect(spy.calledOnce).to.be(false);
		happen.at('click', 220, 230);
		expect(spy.calledOnce).to.be(true);
	});

	it('can be forced on center', () => {
		const layer = L.marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the center', {permanent: true, direction: 'center', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.at('click', 150, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be(true);
	});

	it('honours opacity option', () => {
		const layer = L.marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true, opacity: 0.57});
		expect(layer._tooltip._container.style.opacity).to.eql(0.57);
	});

	it('can change opacity with setOpacity', () => {
		const layer = L.marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true});
		expect(layer._tooltip._container.style.opacity).to.eql(0.9);
		layer._tooltip.setOpacity(0.57);
		expect(layer._tooltip._container.style.opacity).to.eql(0.57);
	});

	it('it should use a tooltip with a function as content with a FeatureGroup', () => {
		const marker1 = L.marker([55.8, 37.6], {description: 'I\'m marker 1.'});
		const marker2 = L.marker([54.6, 38.2], {description: 'I\'m marker 2.'});
		const group = L.featureGroup([marker1, marker2]).addTo(map);

		group.bindTooltip(layer => layer.options.description);

		// toggle popup on marker1
		happen.mouseover(marker1._icon, {relatedTarget: map._container});
		expect(map.hasLayer(group._tooltip)).to.be(true);
		expect(group._tooltip._container.innerHTML).to.be('I\'m marker 1.');

		// toggle popup on marker2
		happen.mouseover(marker2._icon, {relatedTarget: map._container});
		expect(map.hasLayer(group._tooltip)).to.be(true);
		expect(group._tooltip._container.innerHTML).to.be('I\'m marker 2.');
	});

	it('opens on polygon mouseover and close on mouseout', () => {
		const layer = L.polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip');

		happen.mouseover(layer._path, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.mouseout(layer._path, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it('stays open on polygon when permanent', () => {
		const layer = L.polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it('can be added on polygon with bindTooltip before beind added to the map', () => {
		const layer = L.polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it('opens on polyline mouseover and close on mouseout', () => {
		const layer = L.polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip');

		happen.mouseover(layer._path, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be(true);

		happen.mouseout(layer._path, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});

	it('stays open on polyline when permanent', () => {
		const layer = L.polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it('can be added on polyline with bindTooltip before added to the map', () => {
		const layer = L.polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it.skipIfNotTouch('is opened when tapping on touch', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		expect(map.hasLayer(layer._tooltip)).to.be(false);
		happen.click(layer._icon);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
	});

	it.skipIfNotTouch('is closed if not permanent when clicking on the map elsewhere on touch', () => {
		const layer = L.marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		happen.click(layer._icon);
		expect(map.hasLayer(layer._tooltip)).to.be(true);
		happen.click(map._container);
		expect(map.hasLayer(layer._tooltip)).to.be(false);
	});


	it('opens with map.openTooltip', (done) => {
		map.on('tooltipopen', (e) => {
			expect(map.hasLayer(e.tooltip)).to.be(true);
			done();
		});
		map.openTooltip('Tooltip', center);
	});

	it('map.openTooltip considers interactive option', () => {
		const spy = sinon.spy();
		const tooltip = L.tooltip({interactive: true, permanent: true})
		  .setContent('Tooltip')
		  .on('click', spy);
		map.openTooltip(tooltip, center);

		happen.click(tooltip._container);
		expect(spy.calledOnce).to.be(true);
	});

	it('can call closeTooltip while not on the map', () => {
		const layer = L.marker(center);
		layer.bindTooltip('Tooltip', {interactive: true});
		layer.closeTooltip();
	});

	it('opens a tooltip and follow the mouse (sticky)', () => {
		const layer = L.rectangle([[58, 39.7], [54, 35.3]]).addTo(map);
		layer.bindTooltip('Sticky', {sticky: true}).openTooltip();
		const tooltip = layer.getTooltip();
		expect(tooltip.getLatLng().equals(layer.getCenter())).to.be(true);

		happen.at('click', 120, 120);
		const latlng = map.containerPointToLatLng([120, 120]);
		expect(tooltip.getLatLng().equals(latlng)).to.be(true);
	});

	it('opens a permanent tooltip and follow the mouse (sticky)', (done) => {
		const layer = L.rectangle([[58, 39.7], [54, 35.3]]).addTo(map);
		layer.bindTooltip('Sticky', {sticky: true, permanent: true}).openTooltip();
		const tooltip = layer.getTooltip();
		expect(tooltip.getLatLng().equals(layer.getCenter())).to.be(true);

		const hand = new Hand({
			timing: 'fastframe',
			onStop() {
				const latlng = map.containerPointToLatLng([120, 120]);
				expect(tooltip.getLatLng().equals(latlng)).to.be(true);
				done();
			}
		});
		const toucher = hand.growFinger('mouse');
		toucher.wait(100).moveTo(120, 120, 1000).wait(100);
	});

	it('closes existent tooltip on new bindTooltip call', () => {
		const layer = L.marker(center).addTo(map);
		const eventSpy = sinon.spy(layer, 'unbindTooltip');
		layer.bindTooltip('Tooltip1', {permanent: true});
		const tooltip1 = layer.getTooltip();
		layer.bindTooltip('Tooltip2').openTooltip();
		layer.unbindTooltip.restore(); // unwrap the spy
		expect(map.hasLayer(tooltip1)).to.not.be.ok();
		expect(eventSpy.calledOnce).to.be.ok();
	});

	it('don\'t opens the tooltip on marker mouseover while dragging map', () => {
		// Sometimes the mouse is moving faster then the map while dragging and then the marker can be hover and
		// the tooltip opened / closed.
		const layer = L.marker(center).addTo(map).bindTooltip('Tooltip');
		const tooltip = layer.getTooltip();

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

	it('closes the tooltip on marker mouseout while dragging map and don\'t open it again', () => {
		// Sometimes the mouse is moving faster then the map while dragging and then the marker can be hover and
		// the tooltip opened / closed.
		const layer = L.marker(center).addTo(map).bindTooltip('Tooltip');
		const tooltip = layer.getTooltip();

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

	it('opens tooltip with passed latlng position while initializing', () => {
		const tooltip = new L.Tooltip(center)
			.addTo(map);
		expect(map.hasLayer(tooltip)).to.be(true);
	});

	it('opens tooltip with passed latlng and options position while initializing', () => {
		const tooltip = new L.Tooltip(center, {className: 'testClass'})
			.addTo(map);
		expect(map.hasLayer(tooltip)).to.be(true);
		expect(L.DomUtil.hasClass(tooltip.getElement(), 'testClass')).to.be(true);
	});

	it('adds tooltip with passed content in options while initializing', () => {
		const tooltip = new L.Tooltip(center, {content: 'Test'})
			.addTo(map);
		expect(map.hasLayer(tooltip)).to.be(true);
		expect(tooltip.getContent()).to.be('Test');
	});

	// Related to #8558
	it('references the correct targets in tooltipopen event with multiple markers bound to same tooltip', () => {
		const marker1 = L.marker(center, {testId: 'markerA'});
		const marker2 = L.marker([57.123076977278, 44.861962891635], {testId: 'markerB'});
		map.addLayer(marker1);
		map.addLayer(marker2);

		const tooltip = L.tooltip().setContent('test');

		const layer1 = marker1.bindTooltip(tooltip);
		const layer2 = marker2.bindTooltip(tooltip);

		const spy = sinon.spy();
		const spy2 = sinon.spy();

		layer1.on('tooltipopen', (e) => {
			spy();
			expect(e.target.options.testId).to.eql('markerA');
		});

		layer2.on('tooltipopen', (e) => {
			spy2();
			expect(e.target.options.testId).to.eql('markerB');
		});

		expect(spy.called).to.be(false);
		layer1.openTooltip().closeTooltip();
		expect(spy.called).to.be(true);
		expect(spy2.called).to.be(false);
		layer2.openTooltip();
		expect(spy2.called).to.be(true);
	});
});
