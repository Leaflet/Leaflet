describe('Popup', () => {
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


	it("closes on map click when map has closePopupOnClick option", () => {
		map.options.closePopupOnClick = true;

		const popup = L.popup()
			.setLatLng(center)
			.openOn(map);

		happen.click(container);

		expect(map.hasLayer(popup)).to.be(false);
	});

	it("closes on map click when popup has closeOnClick option", () => {
		map.options.closePopupOnClick = false;

		const popup = L.popup({closeOnClick: true})
			.setLatLng(center)
			.openOn(map);

		happen.click(container);

		expect(map.hasLayer(popup)).to.be(false);
	});

	it("does not close on map click when popup has closeOnClick: false option", () => {
		map.options.closePopupOnClick = true;

		const popup = L.popup({closeOnClick: false})
			.setLatLng(center)
			.openOn(map);

		happen.click(container);

		expect(map.hasLayer(popup)).to.be(true);
	});

	it("toggles its visibility when marker is clicked", () => {
		const marker = L.marker(center);
		map.addLayer(marker);

		marker.bindPopup('Popup1');
		expect(map.hasLayer(marker._popup)).to.be(false);

		// toggle open popup
		happen.click(marker._icon);
		expect(map.hasLayer(marker._popup)).to.be(true);

		// toggle close popup
		happen.click(marker._icon);
		expect(map.hasLayer(marker._popup)).to.be(false);
	});

	it("it should use a popup with a function as content with a FeatureGroup", () => {
		const marker1 = L.marker(center);
		const marker2 = L.marker([54.6, 38.2]);
		const group = L.featureGroup([marker1, marker2]).addTo(map);

		marker1.description = "I'm marker 1.";
		marker2.description = "I'm marker 2.";
		group.bindPopup(layer => layer.description);

		map.options.closePopupOnClick = true;

		// toggle popup on marker1
		group.fire('click', {
			latlng: center,
			layer: marker1
		});
		expect(map.hasLayer(group._popup)).to.be(true);
		expect(group._popup._contentNode.innerHTML).to.be("I'm marker 1.");

		// toggle popup on marker2
		group.fire('click', {
			latlng: [54.6, 38.2],
			layer: marker2
		});
		expect(map.hasLayer(group._popup)).to.be(true);
		expect(group._popup._contentNode.innerHTML).to.be("I'm marker 2.");
	});

	it("it should function for popup content after bindPopup is called", () => {
		const marker1 = L.marker(center);
		const marker2 = L.marker([54.6, 38.2]);
		const group = L.featureGroup([marker1]).addTo(map);

		marker1.description = "I'm marker 1.";
		marker2.description = "I'm marker 2.";
		group.bindPopup(layer => layer.description);

		group.addLayer(marker2);

		map.options.closePopupOnClick = true;

		// toggle popup on marker1
		group.fire('click', {
			latlng: center,
			layer: marker1
		});
		expect(map.hasLayer(group._popup)).to.be(true);
		expect(group._popup._contentNode.innerHTML).to.be("I'm marker 1.");

		// toggle popup on marker2
		group.fire('click', {
			latlng: [54.6, 38.2],
			layer: marker2
		});
		expect(map.hasLayer(group._popup)).to.be(true);
		expect(group._popup._contentNode.innerHTML).to.be("I'm marker 2.");
	});

	it("should use a function for popup content when a source is passed to Popup", () => {
		const marker = L.marker(center).addTo(map);
		L.popup({}, marker);

		marker.description = "I am a marker.";

		marker.bindPopup(layer => layer.description);

		marker.fire('click', {
			latlng: center
		});

		expect(map.hasLayer(marker._popup)).to.be(true);
		expect(marker._popup._contentNode.innerHTML).to.be("I am a marker.");
	});

	it("triggers popupopen on marker when popup opens", () => {
		const marker1 = L.marker(center);
		const marker2 = L.marker([57.123076977278, 44.861962891635]);

		map.addLayer(marker1);
		map.addLayer(marker2);

		marker1.bindPopup('Popup1');
		marker2.bindPopup('Popup2');

		const spy = sinon.spy();

		marker1.on('popupopen', spy);

		expect(spy.called).to.be(false);
		marker2.openPopup();
		expect(spy.called).to.be(false);
		marker1.openPopup();
		expect(spy.called).to.be(true);
	});

	// Related to #8558
	it("references the correct targets in popupopen event with multiple markers bound to same popup", () => {
		const marker1 = L.marker(center, {testId: 'markerA'});
		const marker2 = L.marker([57.123076977278, 44.861962891635], {testId: 'markerB'});
		map.addLayer(marker1);
		map.addLayer(marker2);

		const popup = L.popup().setContent('test');

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

		expect(spy.called).to.be(false);
		marker2.openPopup();
		expect(spy.called).to.be(false);
		expect(spy2.called).to.be(true);
		marker1.closePopup().openPopup();
		expect(spy.called).to.be(true);
	});

	it("triggers popupclose on marker when popup closes", () => {
		const marker1 = L.marker(center);
		const marker2 = L.marker([57.123076977278, 44.861962891635]);

		map.addLayer(marker1);
		map.addLayer(marker2);

		marker1.bindPopup('Popup1');
		marker2.bindPopup('Popup2');

		const spy = sinon.spy();

		marker1.on('popupclose', spy);

		expect(spy.called).to.be(false);
		marker2.openPopup();
		expect(spy.called).to.be(false);
		marker1.openPopup();
		expect(spy.called).to.be(false);
		marker2.openPopup();
		expect(spy.called).to.be(true);
		marker1.openPopup();
		marker1.closePopup();
		expect(spy.callCount).to.be(2);
	});

	describe('should take into account icon popupAnchor option on', () => {
		const latlng = center;
		const offset = L.point(20, 30);
		let autoPanBefore;
		let popupAnchorBefore;
		let icon;
		let marker1;
		let marker2;

		before(() => {
			autoPanBefore = L.Popup.prototype.options.autoPan;
			L.Popup.prototype.options.autoPan = false;
			popupAnchorBefore = L.Icon.Default.prototype.options.popupAnchor;
			L.Icon.Default.prototype.options.popupAnchor = [0, 0];
		});

		beforeEach(() => {
			icon = L.divIcon({popupAnchor: offset});
			marker1 = L.marker(latlng);
			marker2 = L.marker(latlng, {icon});
		});

		after(() => {
			L.Popup.prototype.options.autoPan = autoPanBefore;
			L.Icon.Default.prototype.options.popupAnchor = popupAnchorBefore;
		});

		it.skipIf3d("non-any3d browsers", () => {
			marker1.bindPopup('Popup').addTo(map);
			marker1.openPopup();
			const defaultLeft = parseInt(marker1._popup._container.style.left, 10);
			const defaultBottom = parseInt(marker1._popup._container.style.bottom, 10);
			marker2.bindPopup('Popup').addTo(map);
			marker2.openPopup();
			let offsetLeft = parseInt(marker2._popup._container.style.left, 10);
			let offsetBottom = parseInt(marker2._popup._container.style.bottom, 10);
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetBottom + offset.y).to.eql(defaultBottom);

			// Now retry passing a popup instance to bindPopup
			marker2.bindPopup(L.popup());
			marker2.openPopup();
			offsetLeft = parseInt(marker2._popup._container.style.left, 10);
			offsetBottom = parseInt(marker2._popup._container.style.bottom, 10);
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetBottom + offset.y).to.eql(defaultBottom);
		});

		it.skipIfNo3d("any3d browsers", () => {
			marker1.bindPopup('Popup').addTo(map);
			marker1.openPopup();
			const defaultLeft = marker1._popup._container._leaflet_pos.x;
			const defaultTop = marker1._popup._container._leaflet_pos.y;
			marker2.bindPopup('Popup').addTo(map);
			marker2.openPopup();
			let offsetLeft = marker2._popup._container._leaflet_pos.x;
			let offsetTop = marker2._popup._container._leaflet_pos.y;
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetTop - offset.y).to.eql(defaultTop);

			// Now retry passing a popup instance to bindPopup
			marker2.bindPopup(L.popup());
			marker2.openPopup();
			offsetLeft = marker2._popup._container._leaflet_pos.x;
			offsetTop = marker2._popup._container._leaflet_pos.y;
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetTop - offset.y).to.eql(defaultTop);
		});
	});

	it("prevents an underlying map click for Layer", () => {
		const layer = L.polygon([center, [55.9, 37.7], [56.0, 37.8]]).addTo(map);
		layer.bindPopup("layer popup");

		let mapClicked = false;
		map.on('click', (e) => {
			mapClicked = true;
			L.popup()
				.setLatLng(e.latlng)
				.setContent("map popup")
				.openOn(map);
		});

		expect(map.hasLayer(layer._popup)).to.be(false);
		happen.click(layer._path);
		expect(mapClicked).to.be(false);
		expect(map.hasLayer(layer._popup)).to.be(true);
	});


	it("can open a popup with enter keypress when marker has focus", () => {
		const layer = L.marker(center).addTo(map);
		layer.bindPopup("layer popup");

		happen.keypress(layer._icon, {
			keyCode: 13
		});

		expect(map.hasLayer(layer._popup)).to.be(true);
	});

	describe("autoPan option should pan popup into visibility", () => {
		// Helper function which calculates the offset of the map-container & popup-container in pixel
		function getPopupOffset(map, popup) {
			const mapOffset = map._container.getBoundingClientRect().top;
			const popupOffset = popup._container.getBoundingClientRect().top;
			return popupOffset - mapOffset;
		}

		it("should not pan map to show popup content if autoPan is disabled", (done) => {
			map.on('popupopen', (e) => {
				const popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.be.below(0, "The upper edge of the popup should not be visible");
				done();
			});
			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: false
			});
		});

		it("should pan map to show popup content if autoPan is enabled", (done) => {
			map.on('popupopen', (e) => {
				const popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.be(10, "The upper edge of the popup have a padding of 10");
				done();
			});
			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: true,
				autoPanPadding: L.point(10, 10)
			});
		});

		it("should pan map to show popup content if autoPan is enabled even when animating", (done) => {
			map.on('popupopen', (e) => {
				const popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.be(10);
				done();
			});

			map.panTo([55.8, 40.7], {
				animate: true,
				duration: 1
			});

			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: true,
				autoPanPadding: L.point(10, 10)
			});
		});
	});

	it("opens popup with passed latlng position while initializing", () => {
		const popup = new L.Popup(center)
			.openOn(map);
		expect(map.hasLayer(popup)).to.be(true);
	});

	it("opens popup with passed latlng and options position while initializing", () => {
		const popup = new L.Popup(center, {className: 'testClass'})
			.addTo(map);
		expect(map.hasLayer(popup)).to.be(true);
		expect(L.DomUtil.hasClass(popup.getElement(), 'testClass')).to.be(true);
	});

	it("adds popup with passed content in options while initializing", () => {
		const popup = new L.Popup(center, {content: 'Test'})
			.addTo(map);
		expect(map.hasLayer(popup)).to.be(true);
		expect(popup.getContent()).to.be('Test');
	});

	describe("L.Map#openPopup", () => {
		it("adds the popup layer to the map", () => {
			const popup = L.popup()
				.setLatLng(center);
			map.openPopup(popup);
			expect(map.hasLayer(popup)).to.be(true);
		});

		it("sets popup location", () => {
			const popup = L.popup();
			map.openPopup(popup, center);
			expect(popup.getLatLng()).to.be.nearLatLng([55.8, 37.6]);
		});

		it("creates a popup from content", () => {
			map.openPopup("<h2>Hello World</h2>", center);
			expect(map._popup).to.be.an(L.Popup);
			expect(map._popup.getContent()).to.eql("<h2>Hello World</h2>");
		});

		it("closes existing popup", () => {
			const p1 = L.popup().setLatLng(center);
			const p2 = L.popup().setLatLng(center);
			map.openPopup(p1);
			map.openPopup(p2);
			expect(map.hasLayer(p1)).to.be(false);
		});

		it("does not close existing popup with autoClose: false option", () => {
			const p1 = L.popup({autoClose: false}).setLatLng(center);
			const p2 = L.popup().setLatLng(center);
			map.openPopup(p1);
			map.openPopup(p2);
			expect(map.hasLayer(p1)).to.be(true);
			expect(map.hasLayer(p2)).to.be(true);
		});

		it('should not be closen when dragging map', (done) => {
			container.style.position = 'absolute';
			container.style.left = 0;
			container.style.top = 0;
			container.style.zIndex = 10000;

			const coords = map._container.getBoundingClientRect();
			const spy = sinon.spy();
			const p = L.popup().setLatLng(center);
			map.openPopup(p);
			expect(map.hasLayer(p)).to.be(true);
			map.on('drag', spy);
			const hand = new Hand({
				timing: 'fastframe',
				onStop() {
					expect(spy.called).to.be(true);
					expect(map.hasLayer(p)).to.be(true);
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
			const p = L.popup({keepInView: true}).setContent('Popup').setLatLng(map.getBounds()._northEast);
			map.once('moveend', () => {
				expect(spy.callCount).to.be(1);
				expect(map.getBounds().contains(p.getLatLng())).to.be(true);
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
			const p = L.popup({keepInView: true}).setContent('Popup').setLatLng([center[0], center[1] + 50]);
			map.once('moveend', () => {
				expect(spy.callCount).to.be(1);
				expect(map.getBounds().contains(p.getLatLng())).to.be(true);
				done();
			});
			map.openPopup(p);
		});

		it('moves on setLatLng after initial autopan', (done) => {
			const p = L.popup().setContent('Popup').setLatLng(map.getBounds().getNorthEast());

			map.once('moveend', () => {
				map.once('moveend', () => {
					expect(map.getBounds().contains(p.getLatLng())).to.be(true);
					done();
				});

				p.setLatLng(map.getBounds().getNorthEast());
			});

			map.openPopup(p);
		});

		it("shows the popup at the correct location when multiple markers are registered", () => {
			const popup = L.popup();
			const marker1 = L.marker([86, 32]).bindPopup(popup).addTo(map);
			const marker2 = L.marker([26.3, 83.9]).bindPopup(popup).addTo(map);

			expect(popup.getLatLng()).to.be(undefined);

			marker1.openPopup();
			expect(popup.getLatLng()).to.be.nearLatLng([86, 32]);

			marker2.openPopup();
			expect(popup.getLatLng()).to.be.nearLatLng([26.3, 83.9]);
		});
	});

	describe('L.Layer#_popup', () => {
		let marker;

		beforeEach(() => {
			marker = L.marker([55.8, 37.6]).addTo(map);
		});

		it("only adds a popup to the map when opened", () => {
			marker.bindPopup("new layer");
			expect(map.hasLayer(marker.getPopup())).to.be(false);
			marker.openPopup();
			expect(map.hasLayer(marker.getPopup())).to.be(true);
		});

		it("keeps an open popup on the map when it's unbound from the layer", () => {
			marker.bindPopup("new layer").openPopup();
			const popup = marker.getPopup();
			marker.unbindPopup();
			expect(map.hasLayer(popup)).to.be(true);
		});

		it("should not give an error when the marker has no popup", () => {
			expect(() => {
				marker.isPopupOpen();
			}).to.not.throwException();
			expect(marker.isPopupOpen()).to.be(false);
		});

		it("should show a popup as closed if it's never opened", () => {
			marker.bindPopup("new layer");
			expect(marker.isPopupOpen()).to.be(false);
		});

		it("should show a popup as opend if it's opened", () => {
			marker.bindPopup("new layer").openPopup();
			expect(marker.isPopupOpen()).to.be(true);
		});

		it("should show a popup as closed if it's opened and closed", () => {
			marker.bindPopup("new layer").openPopup().closePopup();
			expect(marker.isPopupOpen()).to.be(false);
		});

		it("should show the popup as closed if it's unbound", () => {
			marker.bindPopup("new layer").openPopup().unbindPopup();
			expect(() => {
				marker.isPopupOpen();
			}).to.not.throwException();
			expect(marker.isPopupOpen()).to.be(false);
		});

		it('does not throw is popup is inmediately closed', (done) => {
			map.on('popupopen', () => {
				marker.closePopup();
			});

			expect(() => {
				marker.bindPopup("new layer").openPopup();
				done();
			}).to.not.throwException();
		});

		it("does not close popup when clicking on it's tip", () => {
			container.style.position = "absolute";
			container.style.top = "0";
			container.style.left = "0";
			const popup = L.popup().setLatLng(map.getCenter())
				.openOn(map);

			const point = map.latLngToContainerPoint(map.getCenter());
			point.y -= 2; // move mouse into the popup-tip
			const el = document.elementFromPoint(point.x, point.y);
			expect(el).to.be(popup._tip);

			happen.click(el, {
				clientX: point.x,
				clientY: point.y
			});
			expect(popup.isOpen()).to.be.ok();
		});

		it("does not open for empty FeatureGroup", () => {
			const popup = L.popup();
			L.featureGroup([])
			  .addTo(map)
			  .bindPopup(popup)
			  .openPopup();

			expect(map.hasLayer(popup)).to.not.be.ok();
		});

		it("uses only visible layers of FeatureGroup for popup content source", () => {
			const marker1 = L.marker([1, 1]);
			const marker2 = L.marker([2, 2]);
			const marker3 = L.marker([3, 3]);
			const popup = L.popup();
			const group = L.featureGroup([marker1, marker2, marker3])
			  .bindPopup(popup)
			  .addTo(map);

			marker1.remove();
			marker3.remove();
			group.openPopup();

			expect(map.hasLayer(popup)).to.be.ok();
			expect(popup._source).to.be(marker2);
		});
	});
});
