import {CircleMarker, FeatureGroup, LayerGroup, Map, Marker, Polygon, Polyline, Rectangle, Tooltip} from 'leaflet';
import Hand from 'prosthetic-hand';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Tooltip', () => {
	let container, map;
	const center = [55.8, 37.6];

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);
		map.setView(center, 6);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('opens on marker mouseover and close on mouseout', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');

		UIEventSimulator.fire('mouseover', layer._icon, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be.true;

		UIEventSimulator.fire('mouseout', layer._icon, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});

	it('opens on marker focus and closes on blur', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');

		const element = layer.getElement();

		UIEventSimulator.fire('focus', element);

		expect(map.hasLayer(layer._tooltip)).to.be.true;

		UIEventSimulator.fire('blur', element);
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});

	it('opens on marker focus and closes on blur when first bound, then added to map', () => {
		const layer = new Marker(center);

		layer.bindTooltip('Tooltip').addTo(map);

		const element = layer.getElement();

		UIEventSimulator.fire('focus', element);

		expect(map.hasLayer(layer._tooltip)).to.be.true;

		UIEventSimulator.fire('blur', element);
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});

	it('opens on marker focus and closes on blur in layer group', () => {
		const marker1 = new Marker([41.18, 9.45], {description: 'Marker 1'});
		const marker2 = new Marker([41.18, 9.46], {description: 'Marker 2'});
		const group = new FeatureGroup([marker1, marker2]).addTo(map);
		group.bindTooltip(layer => `Group tooltip: ${layer.options.description}`);

		const element1 = marker1.getElement();
		const element2 = marker2.getElement();

		UIEventSimulator.fire('focus', element1);

		expect(map.hasLayer(group._tooltip)).to.be.true;
		expect(group._tooltip._container.innerHTML).to.equal('Group tooltip: Marker 1');

		UIEventSimulator.fire('blur', element1);
		expect(map.hasLayer(group._tooltip)).to.be.false;

		UIEventSimulator.fire('focus', element2);

		expect(map.hasLayer(group._tooltip)).to.be.true;
		expect(group._tooltip._container.innerHTML).to.equal('Group tooltip: Marker 2');

		UIEventSimulator.fire('blur', element2);
		expect(map.hasLayer(group._tooltip)).to.be.false;
	});

	it('opens on marker focus and ignore layers without getElement function', () => {
		const marker1 = new Marker([41.18, 9.45]);
		const someLayerWithoutGetElement = new LayerGroup();
		const group = new FeatureGroup([marker1, someLayerWithoutGetElement]).addTo(map);
		group.bindTooltip('Tooltip');
		expect(() => {
			UIEventSimulator.fire('focus', marker1.getElement());
		}).to.not.throw();
	});


	it('is mentioned in aria-describedby of a bound layer', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		const element = layer.getElement();

		UIEventSimulator.fire('focus', element);

		const tooltip = layer.getTooltip();
		expect(element.getAttribute('aria-describedby')).to.equal(tooltip._container.id);
	});

	it('is mentioned in aria-describedby of a bound layer group', () => {
		const marker1 = new Marker([41.18, 9.45], {description: 'Marker 1'});
		const marker2 = new Marker([41.18, 9.46], {description: 'Marker 2'});
		const group = new FeatureGroup([marker1, marker2]).addTo(map);
		group.bindTooltip(layer => `Group tooltip: ${layer.options.description}`);

		const element = marker2.getElement();

		UIEventSimulator.fire('focus', element);

		const tooltip = group.getTooltip();
		expect(element.getAttribute('aria-describedby')).to.equal(tooltip._container.id);

	});

	it('stays open on marker when permanent', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it('can be added with bindTooltip before added to the map', () => {
		const layer = new Marker(center);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.false;
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it('is removed when removing marker', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});

	it('is not interactive by default', () => {
		const layer = new Marker(center).addTo(map);
		const spy = sinon.spy();

		layer.bindTooltip('Tooltip', {permanent: true});
		layer._tooltip.on('click', spy);
		UIEventSimulator.fire('click', layer._tooltip._container);
		expect(spy.called).to.be.false;
	});

	it('can be made interactive', () => {
		const layer = new Marker(center).addTo(map);
		const spy = sinon.spy();

		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		layer._tooltip.on('click', spy);
		UIEventSimulator.fire('click', layer._tooltip._container);
		expect(spy.calledOnce).to.be.true;
	});

	it('events are propagated to bound layer', () => {
		const layer = new Marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		UIEventSimulator.fire('click', layer._tooltip._container);
		expect(spy.calledOnce).to.be.true;
	});

	it('has class leaflet-interactive', () => {
		const layer = new Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true, interactive: true});
		expect(layer._tooltip._container.classList.contains('leaflet-interactive')).to.be.true;
	});

	it('has not class leaflet-interactive', () => {
		const layer = new Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true});
		expect(layer._tooltip._container.classList.contains('leaflet-interactive')).to.be.false;
	});

	it('can be forced on left direction', () => {
		const layer = new Marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A long tooltip that should be displayed on the left', {permanent: true, direction: 'left', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fireAt('click', 150, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be.true;
	});

	it('honours offset on left direction', () => {
		const layer = new Marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A long tooltip that should be displayed on the left', {permanent: true, direction: 'left', interactive: true, offset: [-20, -20]});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fireAt('click', 150, 180);
		expect(spy.calledOnce).to.be.false;
		UIEventSimulator.fireAt('click', 130, 160);
		expect(spy.calledOnce).to.be.true;
	});

	it('can be forced on top direction', () => {
		const layer = new CircleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'top', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fireAt('click', 200, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be.true;
	});

	it('honours offset on top direction', () => {
		const layer = new CircleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'top', interactive: true, offset: [-20, -20]});
		UIEventSimulator.fireAt('click', 200, 180);
		expect(spy.calledOnce).to.be.false;
		UIEventSimulator.fireAt('click', 180, 150);
		expect(spy.calledOnce).to.be.true;
	});

	it('can be forced on bottom direction', () => {
		const layer = new CircleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'bottom', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fireAt('click', 200, 220);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be.true;
	});

	it('honours offset on bottom direction', () => {
		const layer = new CircleMarker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the top', {permanent: true, direction: 'bottom', interactive: true, offset: [20, 20]});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fireAt('click', 200, 220);
		expect(spy.calledOnce).to.be.false;
		UIEventSimulator.fireAt('click', 220, 230);
		expect(spy.calledOnce).to.be.true;
	});

	it('can be forced on center', () => {
		const layer = new Marker(center).addTo(map);
		const spy = sinon.spy();
		layer.on('click', spy);

		layer.bindTooltip('A tooltip that should be displayed on the center', {permanent: true, direction: 'center', interactive: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fireAt('click', 150, 180);  // Marker is on the map center, which is 400px large.
		expect(spy.calledOnce).to.be.true;
	});

	it('honours opacity option', () => {
		const layer = new Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true, opacity: 0.57});
		expect(layer._tooltip._container.style.opacity).to.eql('0.57');
	});

	it('can change opacity with setOpacity', () => {
		const layer = new Marker(center).addTo(map);
		layer.bindTooltip('Tooltip', {permanent: true});
		expect(layer._tooltip._container.style.opacity).to.eql('0.9');
		layer._tooltip.setOpacity(0.57);
		expect(layer._tooltip._container.style.opacity).to.eql('0.57');
	});

	it('it should use a tooltip with a function as content with a FeatureGroup', () => {
		const marker1 = new Marker([55.8, 37.6], {description: 'I\'m marker 1.'});
		const marker2 = new Marker([54.6, 38.2], {description: 'I\'m marker 2.'});
		const group = new FeatureGroup([marker1, marker2]).addTo(map);

		group.bindTooltip(layer => layer.options.description);

		// toggle popup on marker1
		UIEventSimulator.fire('mouseover', marker1._icon, {relatedTarget: map._container});
		expect(map.hasLayer(group._tooltip)).to.be.true;
		expect(group._tooltip._container.innerHTML).to.equal('I\'m marker 1.');

		// toggle popup on marker2
		UIEventSimulator.fire('mouseover', marker2._icon, {relatedTarget: map._container});
		expect(map.hasLayer(group._tooltip)).to.be.true;
		expect(group._tooltip._container.innerHTML).to.equal('I\'m marker 2.');
	});

	it('opens on polygon mouseover and close on mouseout', () => {
		const layer = new Polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip');

		UIEventSimulator.fire('mouseover', layer._path, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be.true;

		UIEventSimulator.fire('mouseout', layer._path, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});

	it('stays open on polygon when permanent', () => {
		const layer = new Polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it('can be added on polygon with bindTooltip before beind added to the map', () => {
		const layer = new Polygon([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.false;
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be.false;
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it('opens on polyline mouseover and close on mouseout', () => {
		const layer = new Polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip');

		UIEventSimulator.fire('mouseover', layer._path, {relatedTarget: map._container});

		expect(map.hasLayer(layer._tooltip)).to.be.true;

		UIEventSimulator.fire('mouseout', layer._path, {relatedTarget: map._container});
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});

	it('stays open on polyline when permanent', () => {
		const layer = new Polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]).addTo(map);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it('can be added on polyline with bindTooltip before added to the map', () => {
		const layer = new Polyline([[55.8, 37.6], [55.9, 37.6], [55.8, 37.5]]);

		layer.bindTooltip('Tooltip', {permanent: true});
		expect(map.hasLayer(layer._tooltip)).to.be.false;
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		layer.remove();
		expect(map.hasLayer(layer._tooltip)).to.be.false;
		layer.addTo(map);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it.skipIfNotTouch('is opened when tapping on touch', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		expect(map.hasLayer(layer._tooltip)).to.be.false;
		UIEventSimulator.fire('click', layer._icon);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
	});

	it.skipIfNotTouch('is closed if not permanent when clicking on the map elsewhere on touch', () => {
		const layer = new Marker(center).addTo(map);

		layer.bindTooltip('Tooltip');
		UIEventSimulator.fire('click', layer._icon);
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		UIEventSimulator.fire('click', map._container);
		expect(map.hasLayer(layer._tooltip)).to.be.false;
	});


	it('opens with map.openTooltip', (done) => {
		map.on('tooltipopen', (e) => {
			expect(map.hasLayer(e.tooltip)).to.be.true;
			done();
		});
		map.openTooltip('Tooltip', center);
	});

	it('map.openTooltip considers interactive option', () => {
		const spy = sinon.spy();
		const tooltip = new Tooltip({interactive: true, permanent: true})
		  .setContent('Tooltip')
		  .on('click', spy);
		map.openTooltip(tooltip, center);

		UIEventSimulator.fire('click', tooltip._container);
		expect(spy.calledOnce).to.be.true;
	});

	it('can call closeTooltip while not on the map', () => {
		const layer = new Marker(center);
		layer.bindTooltip('Tooltip', {interactive: true});
		layer.closeTooltip();
	});

	it('opens a tooltip and follow the mouse (sticky)', () => {
		const layer = new Rectangle([[58, 39.7], [54, 35.3]]).addTo(map);
		layer.bindTooltip('Sticky', {sticky: true}).openTooltip();
		const tooltip = layer.getTooltip();
		expect(tooltip.getLatLng().equals(layer.getCenter())).to.be.true;

		UIEventSimulator.fireAt('click', 120, 120);
		const latlng = map.containerPointToLatLng([120, 120]);
		expect(tooltip.getLatLng().equals(latlng)).to.be.true;
	});

	it('opens a permanent tooltip and follow the mouse (sticky)', (done) => {
		const layer = new Rectangle([[58, 39.7], [54, 35.3]]).addTo(map);
		layer.bindTooltip('Sticky', {sticky: true, permanent: true}).openTooltip();
		const tooltip = layer.getTooltip();
		expect(tooltip.getLatLng().equals(layer.getCenter())).to.be.true;

		const hand = new Hand({
			timing: 'fastframe',
			onStop() {
				const latlng = map.containerPointToLatLng([120, 120]);
				expect(tooltip.getLatLng().equals(latlng)).to.be.true;
				done();
			}
		});
		const toucher = hand.growFinger('mouse');
		toucher.wait(100).moveTo(120, 120, 1000).wait(100);
	});

	it('closes existent tooltip on new bindTooltip call', () => {
		const layer = new Marker(center).addTo(map);
		const eventSpy = sinon.spy(layer, 'unbindTooltip');
		layer.bindTooltip('Tooltip1', {permanent: true});
		const tooltip1 = layer.getTooltip();
		layer.bindTooltip('Tooltip2').openTooltip();
		layer.unbindTooltip.restore(); // unwrap the spy
		expect(map.hasLayer(tooltip1)).to.be.false;
		expect(eventSpy.calledOnce).to.be.true;
	});

	it('don\'t opens the tooltip on marker mouseover while dragging map', () => {
		// Sometimes the mouse is moving faster then the map while dragging and then the marker can be hover and
		// the tooltip opened / closed.
		const layer = new Marker(center).addTo(map).bindTooltip('Tooltip');
		const tooltip = layer.getTooltip();

		// simulate map dragging
		map.dragging.moving =  () => true;

		UIEventSimulator.fireAt('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be.false;

		// simulate map not dragging anymore
		map.dragging.moving = function () {
			return false;
		};
		UIEventSimulator.fireAt('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be.true;
	});

	it('closes the tooltip on marker mouseout while dragging map and don\'t open it again', () => {
		// Sometimes the mouse is moving faster then the map while dragging and then the marker can be hover and
		// the tooltip opened / closed.
		const layer = new Marker(center).addTo(map).bindTooltip('Tooltip');
		const tooltip = layer.getTooltip();

		// open tooltip before "dragging map"
		UIEventSimulator.fireAt('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be.true;

		// simulate map dragging
		map.dragging.moving = () => true;
		UIEventSimulator.fire('mouseout', layer._icon, {relatedTarget: map._container});
		expect(tooltip.isOpen()).to.be.false;

		// tooltip should not open again while dragging
		UIEventSimulator.fireAt('mouseover', 210, 195);
		expect(tooltip.isOpen()).to.be.false;
	});

	it('opens the tooltip if the tooltip is loaded while the map is dragging.', () => {
		// simulate map dragging
		map.dragging.moving = () => true;

		// If tooltips are dynamically loaded while the map is dragging, they need
		// to be loaded when the dragging stops.
		const layer = new Marker(center).bindTooltip('Tooltip', {permanent: true});
		map.addLayer(layer);

		// simulate map not dragging anymore
		map.dragging.moving = () => false;

		// Actually triggers both movestart and moveend.
		map.setView([51.505, -0.09], 13);

		// The tooltip is loaded now!
		expect(map.hasLayer(layer._tooltip)).to.be.true;
		const tooltip = layer.getTooltip();
		expect(tooltip.isOpen()).to.be.true;
	});

	it('opens tooltip with passed latlng position while initializing', () => {
		const tooltip = new Tooltip(center)
			.addTo(map);
		expect(map.hasLayer(tooltip)).to.be.true;
	});

	it('opens tooltip with passed latlng and options position while initializing', () => {
		const tooltip = new Tooltip(center, {className: 'testClass'})
			.addTo(map);
		expect(map.hasLayer(tooltip)).to.be.true;
		expect(tooltip.getElement().classList.contains('testClass')).to.be.true;
	});

	it('adds tooltip with passed content in options while initializing', () => {
		const tooltip = new Tooltip(center, {content: 'Test'})
			.addTo(map);
		expect(map.hasLayer(tooltip)).to.be.true;
		expect(tooltip.getContent()).to.equal('Test');
	});

	// Related to #8558
	it('references the correct targets in tooltipopen event with multiple markers bound to same tooltip', () => {
		const marker1 = new Marker(center, {testId: 'markerA'});
		const marker2 = new Marker([57.123076977278, 44.861962891635], {testId: 'markerB'});
		map.addLayer(marker1);
		map.addLayer(marker2);

		const tooltip = new Tooltip().setContent('test');

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

		expect(spy.called).to.be.false;
		layer1.openTooltip().closeTooltip();
		expect(spy.called).to.be.true;
		expect(spy2.called).to.be.false;
		layer2.openTooltip();
		expect(spy2.called).to.be.true;
	});
});
