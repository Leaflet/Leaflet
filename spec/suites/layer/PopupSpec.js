import {DivIcon, DomUtil, FeatureGroup, Icon, Map, Marker, Point, Polygon, Popup} from 'leaflet';
import Hand from 'prosthetic-hand';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Popup', () => {
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


	it('closes on map click when map has closePopupOnClick option', () => {
		map.options.closePopupOnClick = true;

		const popup = new Popup()
			.setLatLng(center)
			.openOn(map);

		UIEventSimulator.fire('click', container);

		expect(map.hasLayer(popup)).to.be.false;
	});

	it('closes on map click when popup has closeOnClick option', () => {
		map.options.closePopupOnClick = false;

		const popup = new Popup({closeOnClick: true})
			.setLatLng(center)
			.openOn(map);

		UIEventSimulator.fire('click', container);

		expect(map.hasLayer(popup)).to.be.false;
	});

	it('does not close on map click when popup has closeOnClick: false option', () => {
		map.options.closePopupOnClick = true;

		const popup = new Popup({closeOnClick: false})
			.setLatLng(center)
			.openOn(map);

		UIEventSimulator.fire('click', container);

		expect(map.hasLayer(popup)).to.be.true;
	});

	it('sets the default \'closeButtonLabel\' on the close button', () => {
		const popup = new Popup()
			.setLatLng(center)
			.openOn(map);

		expect(popup.getElement().querySelector('[aria-label="Close popup"]')).not.to.equal(null);
	});

	it('sets a custom \'closeButtonLabel\' on the close button', () => {
		const closeButtonLabel = 'TestLabel';
		const popup = new Popup({closeButtonLabel})
			.setLatLng(center)
			.openOn(map);

		expect(popup.getElement().querySelector(`[aria-label="${closeButtonLabel}"]`)).not.to.equal(null);
	});

	it('toggles its visibility when marker is clicked', () => {
		const marker = new Marker(center);
		map.addLayer(marker);

		marker.bindPopup('Popup1');
		expect(map.hasLayer(marker._popup)).to.be.false;

		// toggle open popup
		UIEventSimulator.fire('click', marker._icon);
		expect(map.hasLayer(marker._popup)).to.be.true;

		// toggle close popup
		UIEventSimulator.fire('click', marker._icon);
		expect(map.hasLayer(marker._popup)).to.be.false;
	});

	it('it should use a popup with a function as content with a FeatureGroup', () => {
		const marker1 = new Marker(center);
		const marker2 = new Marker([54.6, 38.2]);
		const group = new FeatureGroup([marker1, marker2]).addTo(map);

		marker1.description = 'I\'m marker 1.';
		marker2.description = 'I\'m marker 2.';
		group.bindPopup(layer => layer.description);

		map.options.closePopupOnClick = true;

		// toggle popup on marker1
		group.fire('click', {
			latlng: center,
			layer: marker1
		});
		expect(map.hasLayer(group._popup)).to.be.true;
		expect(group._popup._contentNode.innerHTML).to.equal('I\'m marker 1.');

		// toggle popup on marker2
		group.fire('click', {
			latlng: [54.6, 38.2],
			layer: marker2
		});
		expect(map.hasLayer(group._popup)).to.be.true;
		expect(group._popup._contentNode.innerHTML).to.equal('I\'m marker 2.');
	});

	it('it should function for popup content after bindPopup is called', () => {
		const marker1 = new Marker(center);
		const marker2 = new Marker([54.6, 38.2]);
		const group = new FeatureGroup([marker1]).addTo(map);

		marker1.description = 'I\'m marker 1.';
		marker2.description = 'I\'m marker 2.';
		group.bindPopup(layer => layer.description);

		group.addLayer(marker2);

		map.options.closePopupOnClick = true;

		// toggle popup on marker1
		group.fire('click', {
			latlng: center,
			layer: marker1
		});
		expect(map.hasLayer(group._popup)).to.be.true;
		expect(group._popup._contentNode.innerHTML).to.equal('I\'m marker 1.');

		// toggle popup on marker2
		group.fire('click', {
			latlng: [54.6, 38.2],
			layer: marker2
		});
		expect(map.hasLayer(group._popup)).to.be.true;
		expect(group._popup._contentNode.innerHTML).to.equal('I\'m marker 2.');
	});

	it('should use a function for popup content when a source is passed to Popup', () => {
		const marker = new Marker(center).addTo(map);
		new Popup({}, marker);

		marker.description = 'I am a marker.';

		marker.bindPopup(layer => layer.description);

		marker.fire('click', {
			latlng: center
		});

		expect(map.hasLayer(marker._popup)).to.be.true;
		expect(marker._popup._contentNode.innerHTML).to.equal('I am a marker.');
	});

	it('triggers popupopen on marker when popup opens', () => {
		const marker1 = new Marker(center);
		const marker2 = new Marker([57.123076977278, 44.861962891635]);

		map.addLayer(marker1);
		map.addLayer(marker2);

		marker1.bindPopup('Popup1');
		marker2.bindPopup('Popup2');

		const spy = sinon.spy();

		marker1.on('popupopen', spy);

		expect(spy.called).to.be.false;
		marker2.openPopup();
		expect(spy.called).to.be.false;
		marker1.openPopup();
		expect(spy.called).to.be.true;
	});

	// Related to #8558
	it('references the correct targets in popupopen event with multiple markers bound to same popup', () => {
		const marker1 = new Marker(center, {testId: 'markerA'});
		const marker2 = new Marker([57.123076977278, 44.861962891635], {testId: 'markerB'});
		map.addLayer(marker1);
		map.addLayer(marker2);

		const popup = new Popup().setContent('test');

		marker2.bindPopup(popup);
		marker1.bindPopup(popup);

		const spy = sinon.spy();
		const spy2 = sinon.spy();

		marker1.on('popupopen', (e) => {
			spy();
			expect(e.target.options.testId).to.eql('markerA');
		});

		marker2.on('popupopen', (e) => {
			spy2();
			expect(e.target.options.testId).to.eql('markerB');
		});

		expect(spy.called).to.be.false;
		marker2.openPopup();
		expect(spy.called).to.be.false;
		expect(spy2.called).to.be.true;
		marker1.closePopup().openPopup();
		expect(spy.called).to.be.true;
	});

	it('triggers popupclose on marker when popup closes', () => {
		const marker1 = new Marker(center);
		const marker2 = new Marker([57.123076977278, 44.861962891635]);

		map.addLayer(marker1);
		map.addLayer(marker2);

		marker1.bindPopup('Popup1');
		marker2.bindPopup('Popup2');

		const spy = sinon.spy();

		marker1.on('popupclose', spy);

		expect(spy.called).to.be.false;
		marker2.openPopup();
		expect(spy.called).to.be.false;
		marker1.openPopup();
		expect(spy.called).to.be.false;
		marker2.openPopup();
		expect(spy.called).to.be.true;
		marker1.openPopup();
		marker1.closePopup();
		expect(spy.callCount).to.equal(2);
	});

	it('should take into account icon popupAnchor option', () => {
		const latlng = center;
		const offset = new Point(20, 30);

		const autoPanBefore = Popup.prototype.options.autoPan;
		Popup.prototype.options.autoPan = false;
		const popupAnchorBefore = Icon.Default.prototype.options.popupAnchor;
		Icon.Default.prototype.options.popupAnchor = [0, 0];

		const icon = new DivIcon({popupAnchor: offset});
		const marker1 = new Marker(latlng);
		const marker2 = new Marker(latlng, {icon});

		marker1.bindPopup('Popup').addTo(map);
		marker1.openPopup();
		const defaultLeft = DomUtil.getPosition(marker1._popup._container).x;
		const defaultTop = DomUtil.getPosition(marker1._popup._container).y;
		marker2.bindPopup('Popup').addTo(map);
		marker2.openPopup();
		let offsetLeft = DomUtil.getPosition(marker2._popup._container).x;
		let offsetTop = DomUtil.getPosition(marker2._popup._container).y;
		expect(offsetLeft - offset.x).to.eql(defaultLeft);
		expect(offsetTop - offset.y).to.eql(defaultTop);

		// Now retry passing a popup instance to bindPopup
		marker2.bindPopup(new Popup());
		marker2.openPopup();
		offsetLeft = DomUtil.getPosition(marker2._popup._container).x;
		offsetTop = DomUtil.getPosition(marker2._popup._container).y;
		expect(offsetLeft - offset.x).to.eql(defaultLeft);
		expect(offsetTop - offset.y).to.eql(defaultTop);

		Popup.prototype.options.autoPan = autoPanBefore;
		Icon.Default.prototype.options.popupAnchor = popupAnchorBefore;
	});

	it('prevents an underlying map click for Layer', () => {
		const layer = new Polygon([center, [55.9, 37.7], [56.0, 37.8]]).addTo(map);
		layer.bindPopup('layer popup');

		let mapClicked = false;
		map.on('click', (e) => {
			mapClicked = true;
			new Popup()
				.setLatLng(e.latlng)
				.setContent('map popup')
				.openOn(map);
		});

		expect(map.hasLayer(layer._popup)).to.be.false;
		UIEventSimulator.fire('click', layer._path);
		expect(mapClicked).to.be.false;
		expect(map.hasLayer(layer._popup)).to.be.true;
	});


	it('can open a popup with enter keypress when marker has focus', () => {
		const layer = new Marker(center).addTo(map);
		layer.bindPopup('layer popup');

		UIEventSimulator.fire('keypress', layer._icon, {
			code: 'Enter'
		});

		expect(map.hasLayer(layer._popup)).to.be.true;
	});


	it('can change popup content with a click on removed DOM', () => {
		const popup = new Popup()
			.setLatLng(center)
			.setContent('<p onclick="this.parentNode.innerHTML = \'changed\'">initial</p>')
			.openOn(map);


		UIEventSimulator.fire('click', popup._container.querySelector('p'));

		expect(popup._container.innerHTML).to.not.contain('initial');
		expect(popup._container.innerHTML).to.contain('changed');
		expect(map.hasLayer(popup)).to.be.true;
	});

	describe('autoPan option should pan popup into visibility', () => {
		// Helper function which calculates the offset of the map-container & popup-container in pixel
		function getPopupOffset(map, popup) {
			const mapOffset = map._container.getBoundingClientRect().top;
			const popupOffset = popup._container.getBoundingClientRect().top;
			return popupOffset - mapOffset;
		}

		it('should not pan map to show popup content if autoPan is disabled', (done) => {
			map.on('popupopen', (e) => {
				const popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.be.below(0, 'The upper edge of the popup should not be visible');
				done();
			});
			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: false
			});
		});

		it('should pan map to show popup content if autoPan is enabled', (done) => {
			map.on('popupopen', (e) => {
				const popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.equal(10, 'The upper edge of the popup have a padding of 10');
				done();
			});
			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: true,
				autoPanPadding: new Point(10, 10)
			});
		});

		it('should pan map to show popup content if autoPan is enabled even when animating', (done) => {
			map.on('popupopen', (e) => {
				const popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.equal(10);
				done();
			});

			map.panTo([55.8, 40.7], {
				animate: true,
				duration: 1
			});

			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: true,
				autoPanPadding: new Point(10, 10)
			});
		});
	});

	it('opens popup with passed latlng position while initializing', () => {
		const popup = new Popup(center)
			.openOn(map);
		expect(map.hasLayer(popup)).to.be.true;
	});

	it('opens popup with passed latlng and options position while initializing', () => {
		const popup = new Popup(center, {className: 'testClass'})
			.addTo(map);
		expect(map.hasLayer(popup)).to.be.true;
		expect(popup.getElement().classList.contains('testClass')).to.be.true;
	});

	it('adds popup with passed content in options while initializing', () => {
		const popup = new Popup(center, {content: 'Test'})
			.addTo(map);
		expect(map.hasLayer(popup)).to.be.true;
		expect(popup.getContent()).to.equal('Test');
	});

	describe('Map#openPopup', () => {
		it('adds the popup layer to the map', () => {
			const popup = new Popup()
				.setLatLng(center);
			map.openPopup(popup);
			expect(map.hasLayer(popup)).to.be.true;
		});

		it('sets popup location', () => {
			const popup = new Popup();
			map.openPopup(popup, center);
			expect(popup.getLatLng()).to.be.nearLatLng([55.8, 37.6]);
		});

		it('creates a popup from content', () => {
			map.openPopup('<h2>Hello World</h2>', center);
			expect(map._popup).to.be.instanceOf(Popup);
			expect(map._popup.getContent()).to.eql('<h2>Hello World</h2>');
		});

		it('closes existing popup', () => {
			const p1 = new Popup().setLatLng(center);
			const p2 = new Popup().setLatLng(center);
			map.openPopup(p1);
			map.openPopup(p2);
			expect(map.hasLayer(p1)).to.be.false;
		});

		it('does not close existing popup with autoClose: false option', () => {
			const p1 = new Popup({autoClose: false}).setLatLng(center);
			const p2 = new Popup().setLatLng(center);
			map.openPopup(p1);
			map.openPopup(p2);
			expect(map.hasLayer(p1)).to.be.true;
			expect(map.hasLayer(p2)).to.be.true;
		});

		it('should not be closen when dragging map', (done) => {
			container.style.position = 'absolute';
			container.style.left = 0;
			container.style.top = 0;
			container.style.zIndex = 10000;

			const coords = map._container.getBoundingClientRect();
			const spy = sinon.spy();
			const p = new Popup().setLatLng(center);
			map.openPopup(p);
			expect(map.hasLayer(p)).to.be.true;
			map.on('drag', spy);
			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(spy.called).to.be.true;
					expect(map.hasLayer(p)).to.be.true;
					done();
				}});
			const mouse = hand.growFinger('mouse');
			mouse.moveTo(coords.left + 100, coords.left + 100, 0)
				.down().moveBy(10, 10, 20).up();
		});

		it('moves the map over a short distance to the popup if it is not in the view (keepInView)', (done) => {
			container.style.position = 'absolute';
			container.style.left = 0;
			container.style.top = 0;
			container.style.zIndex = 10000;

			// to prevent waiting until the animation is finished
			map.options.inertia = false;

			const spy = sinon.spy();
			map.on('autopanstart', spy);

			// Short hop to the edge of the map (at time of writing, will trigger an animated pan)
			const p = new Popup({keepInView: true}).setContent('Popup').setLatLng(map.getBounds()._northEast);
			map.once('moveend', () => {
				expect(spy.callCount).to.equal(1);
				expect(map.getBounds().contains(p.getLatLng())).to.be.true;
				done();
			});
			map.openPopup(p);
		});

		it('moves the map over a long distance to the popup if it is not in the view (keepInView)', (done) => {
			container.style.position = 'absolute';
			container.style.left = 0;
			container.style.top = 0;
			container.style.zIndex = 10000;

			// to prevent waiting until the animation is finished
			map.options.inertia = false;

			const spy = sinon.spy();
			map.on('autopanstart', spy);

			// Long hop (at time of writing, will trigger a view reset)
			const p = new Popup({keepInView: true}).setContent('Popup').setLatLng([center[0], center[1] + 50]);
			map.once('moveend', () => {
				expect(spy.callCount).to.equal(1);
				expect(map.getBounds().contains(p.getLatLng())).to.be.true;
				done();
			});
			map.openPopup(p);
		});

		it('moves on setLatLng after initial autopan', (done) => {
			const p = new Popup().setContent('Popup').setLatLng(map.getBounds().getNorthEast());

			map.once('moveend', () => {
				map.once('moveend', () => {
					expect(map.getBounds().contains(p.getLatLng())).to.be.true;
					done();
				});

				p.setLatLng(map.getBounds().getNorthEast());
			});

			map.openPopup(p);
		});

		it('shows the popup at the correct location when multiple markers are registered', () => {
			const popup = new Popup();
			const marker1 = new Marker([86, 32]).bindPopup(popup).addTo(map);
			const marker2 = new Marker([26.3, 83.9]).bindPopup(popup).addTo(map);

			expect(popup.getLatLng()).to.equal(undefined);

			marker1.openPopup();
			expect(popup.getLatLng()).to.be.nearLatLng([86, 32]);

			marker2.openPopup();
			expect(popup.getLatLng()).to.be.nearLatLng([26.3, 83.9]);
		});
	});

	describe('Layer#_popup', () => {
		let marker;

		beforeEach(() => {
			marker = new Marker([55.8, 37.6]).addTo(map);
		});

		it('only adds a popup to the map when opened', () => {
			marker.bindPopup('new layer');
			expect(map.hasLayer(marker.getPopup())).to.be.false;
			marker.openPopup();
			expect(map.hasLayer(marker.getPopup())).to.be.true;
		});

		it('keeps an open popup on the map when it\'s unbound from the layer', () => {
			marker.bindPopup('new layer').openPopup();
			const popup = marker.getPopup();
			marker.unbindPopup();
			expect(map.hasLayer(popup)).to.be.true;
		});

		it('should not give an error when the marker has no popup', () => {
			expect(() => {
				marker.isPopupOpen();
			}).to.not.throw();
			expect(marker.isPopupOpen()).to.be.false;
		});

		it('should show a popup as closed if it\'s never opened', () => {
			marker.bindPopup('new layer');
			expect(marker.isPopupOpen()).to.be.false;
		});

		it('should show a popup as opend if it\'s opened', () => {
			marker.bindPopup('new layer').openPopup();
			expect(marker.isPopupOpen()).to.be.true;
		});

		it('should show a popup as closed if it\'s opened and closed', () => {
			marker.bindPopup('new layer').openPopup().closePopup();
			expect(marker.isPopupOpen()).to.be.false;
		});

		it('should show the popup as closed if it\'s unbound', () => {
			marker.bindPopup('new layer').openPopup().unbindPopup();
			expect(() => {
				marker.isPopupOpen();
			}).to.not.throw();
			expect(marker.isPopupOpen()).to.be.false;
		});

		it('does not throw is popup is inmediately closed', (done) => {
			map.on('popupopen', () => {
				marker.closePopup();
			});

			expect(() => {
				marker.bindPopup('new layer').openPopup();
				done();
			}).to.not.throw();
		});

		it('does not close popup when clicking on it\'s tip', () => {
			container.style.position = 'absolute';
			container.style.top = '0';
			container.style.left = '0';
			const popup = new Popup().setLatLng(map.getCenter())
				.openOn(map);

			const point = map.latLngToContainerPoint(map.getCenter());
			point.y -= 2; // move mouse into the popup-tip
			const el = document.elementFromPoint(point.x, point.y);
			expect(el).to.equal(popup._tip);

			UIEventSimulator.fire('click', el, {
				clientX: point.x,
				clientY: point.y
			});
			expect(popup.isOpen()).to.be.true;
		});

		it('does not open for empty FeatureGroup', () => {
			const popup = new Popup();
			new FeatureGroup([])
			  .addTo(map)
			  .bindPopup(popup)
			  .openPopup();

			expect(map.hasLayer(popup)).to.be.false;
		});

		it('uses only visible layers of FeatureGroup for popup content source', () => {
			const marker1 = new Marker([1, 1]);
			const marker2 = new Marker([2, 2]);
			const marker3 = new Marker([3, 3]);
			const popup = new Popup();
			const group = new FeatureGroup([marker1, marker2, marker3])
			  .bindPopup(popup)
			  .addTo(map);

			marker1.remove();
			marker3.remove();
			group.openPopup();

			expect(map.hasLayer(popup)).to.be.true;
			expect(popup._source).to.equal(marker2);
		});
	});
});
