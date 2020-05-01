var c, map, center = [55.8, 37.6];

function setup() {
	c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	document.body.appendChild(c);
	map = new L.Map(c);
	map.setView(center, 6);
}

function cleanup() {
	map.remove();
	document.body.removeChild(c);
}

describe('Popup', function () {
	beforeEach(setup);
	afterEach(cleanup);

	it("closes on map click when map has closePopupOnClick option", function () {
		map.options.closePopupOnClick = true;

		var popup = new L.Popup()
			.setLatLng(center)
			.openOn(map);

		happen.click(c);

		expect(map.hasLayer(popup)).to.be(false);
	});

	it("closes on map click when popup has closeOnClick option", function () {
		map.options.closePopupOnClick = false;

		var popup = new L.Popup({closeOnClick: true})
			.setLatLng(center)
			.openOn(map);

		happen.click(c);

		expect(map.hasLayer(popup)).to.be(false);
	});

	it("does not close on map click when popup has closeOnClick: false option", function () {
		map.options.closePopupOnClick = true;

		var popup = new L.Popup({closeOnClick: false})
			.setLatLng(center)
			.openOn(map);

		happen.click(c);

		expect(map.hasLayer(popup)).to.be(true);
	});

	it("toggles its visibility when marker is clicked", function () {
		var marker = new L.Marker(center);
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

	it("it should use a popup with a function as content with a FeatureGroup", function () {
		var marker1 = new L.Marker(center);
		var marker2 = new L.Marker([54.6, 38.2]);
		var group = new L.FeatureGroup([marker1, marker2]).addTo(map);

		marker1.description = "I'm marker 1.";
		marker2.description = "I'm marker 2.";
		group.bindPopup(function (layer) {
			return layer.description;
		});

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

	it("it should function for popup content after bindPopup is called", function () {
		var marker1 = new L.Marker(center);
		var marker2 = new L.Marker([54.6, 38.2]);
		var group = new L.FeatureGroup([marker1]).addTo(map);

		marker1.description = "I'm marker 1.";
		marker2.description = "I'm marker 2.";
		group.bindPopup(function (layer) {
			return layer.description;
		});

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

	it("should use a function for popup content when a source is passed to Popup", function () {
		var marker = new L.Marker(center).addTo(map);
		L.popup({}, marker);

		marker.description = "I am a marker.";

		marker.bindPopup(function (layer) {
			return layer.description;
		});

		marker.fire('click', {
			latlng: center
		});

		expect(map.hasLayer(marker._popup)).to.be(true);
		expect(marker._popup._contentNode.innerHTML).to.be("I am a marker.");
	});

	it("triggers popupopen on marker when popup opens", function () {
		var marker1 = new L.Marker(center);
		var marker2 = new L.Marker([57.123076977278, 44.861962891635]);

		map.addLayer(marker1);
		map.addLayer(marker2);

		marker1.bindPopup('Popup1');
		marker2.bindPopup('Popup2');

		var spy = sinon.spy();

		marker1.on('popupopen', spy);

		expect(spy.called).to.be(false);
		marker2.openPopup();
		expect(spy.called).to.be(false);
		marker1.openPopup();
		expect(spy.called).to.be(true);
	});

	it("triggers popupclose on marker when popup closes", function () {
		var marker1 = new L.Marker(center);
		var marker2 = new L.Marker([57.123076977278, 44.861962891635]);

		map.addLayer(marker1);
		map.addLayer(marker2);

		marker1.bindPopup('Popup1');
		marker2.bindPopup('Popup2');

		var spy = sinon.spy();

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

	describe('should take into account icon popupAnchor option on', function () {
		var latlng = center;
		var offset = new L.Point(20, 30);
		var autoPanBefore;
		var popupAnchorBefore;
		var icon;
		var marker1;
		var marker2;

		before(function () {
			autoPanBefore = L.Popup.prototype.options.autoPan;
			L.Popup.prototype.options.autoPan = false;
			popupAnchorBefore = L.Icon.Default.prototype.options.popupAnchor;
			L.Icon.Default.prototype.options.popupAnchor = [0, 0];
		});

		beforeEach(function () {
			icon = new L.DivIcon({popupAnchor: offset});
			marker1 = new L.Marker(latlng);
			marker2 = new L.Marker(latlng, {icon: icon});
		});

		after(function () {
			L.Popup.prototype.options.autoPan = autoPanBefore;
			L.Icon.Default.prototype.options.popupAnchor = popupAnchorBefore;
		});

		it.skipIf3d("non-any3d browsers", function () {
			marker1.bindPopup('Popup').addTo(map);
			marker1.openPopup();
			var defaultLeft = parseInt(marker1._popup._container.style.left, 10);
			var defaultBottom = parseInt(marker1._popup._container.style.bottom, 10);
			marker2.bindPopup('Popup').addTo(map);
			marker2.openPopup();
			var offsetLeft = parseInt(marker2._popup._container.style.left, 10);
			var offsetBottom = parseInt(marker2._popup._container.style.bottom, 10);
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetBottom + offset.y).to.eql(defaultBottom);

			// Now retry passing a popup instance to bindPopup
			marker2.bindPopup(new L.Popup());
			marker2.openPopup();
			offsetLeft = parseInt(marker2._popup._container.style.left, 10);
			offsetBottom = parseInt(marker2._popup._container.style.bottom, 10);
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetBottom + offset.y).to.eql(defaultBottom);
		});

		it.skipIfNo3d("any3d browsers", function () {
			marker1.bindPopup('Popup').addTo(map);
			marker1.openPopup();
			var defaultLeft = marker1._popup._container._leaflet_pos.x;
			var defaultTop = marker1._popup._container._leaflet_pos.y;
			marker2.bindPopup('Popup').addTo(map);
			marker2.openPopup();
			var offsetLeft = marker2._popup._container._leaflet_pos.x;
			var offsetTop = marker2._popup._container._leaflet_pos.y;
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetTop - offset.y).to.eql(defaultTop);

			// Now retry passing a popup instance to bindPopup
			marker2.bindPopup(new L.Popup());
			marker2.openPopup();
			offsetLeft = marker2._popup._container._leaflet_pos.x;
			offsetTop = marker2._popup._container._leaflet_pos.y;
			expect(offsetLeft - offset.x).to.eql(defaultLeft);
			expect(offsetTop - offset.y).to.eql(defaultTop);
		});
	});

	it("prevents an underlying map click for Layer", function () {
		var layer = new L.Polygon([center, [55.9, 37.7], [56.0, 37.8]]).addTo(map);
		layer.bindPopup("layer popup");

		var mapClicked = false;
		map.on('click', function (e) {
			mapClicked = true;
			new L.Popup()
				.setLatLng(e.latlng)
				.setContent("map popup")
				.openOn(map);
		});

		expect(map.hasLayer(layer._popup)).to.be(false);
		happen.click(layer._path);
		expect(mapClicked).to.be(false);
		expect(map.hasLayer(layer._popup)).to.be(true);
	});


	it("can open a popup with enter keypress when marker has focus", function () {
		var layer = new L.Marker(center).addTo(map);
		layer.bindPopup("layer popup");

		happen.keypress(layer._icon, {
			keyCode: 13
		});

		expect(map.hasLayer(layer._popup)).to.be(true);
	});

	describe("autoPan option should pan popup into visibility", function () {
		// Helper function which calculates the offset of the map-container & popup-container in pixel
		function getPopupOffset(map, popup) {
			var mapOffset = map._container.getBoundingClientRect().top;
			var popupOffset = popup._container.getBoundingClientRect().top;
			return popupOffset - mapOffset;
		}

		it("should not pan map to show popup content if autoPan is disabled", function (done) {
			map.on('popupopen', function (e) {
				var popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.be.below(0, "The upper edge of the popup should not be visible");
				done();
			});
			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: false
			});
		});

		it("should pan map to show popup content if autoPan is enabled", function (done) {
			map.on('popupopen', function (e) {
				var popupTopOffset = getPopupOffset(map, e.popup);
				expect(popupTopOffset).to.be(10, "The upper edge of the popup have a padding of 10");
				done();
			});
			map.openPopup('<div style="height: 400px;"></div>', [58.4, 37.6], {
				autoPan: true,
				autoPanPadding: L.point(10, 10)
			});
		});

		it("should pan map to show popup content if autoPan is enabled even when animating", function (done) {
			map.on('popupopen', function (e) {
				var popupTopOffset = getPopupOffset(map, e.popup);
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
});

describe("L.Map#openPopup", function () {
	beforeEach(setup);
	afterEach(cleanup);

	it("adds the popup layer to the map", function () {
		var popup = new L.Popup()
			.setLatLng(center);
		map.openPopup(popup);
		expect(map.hasLayer(popup)).to.be(true);
	});

	it("sets popup location", function () {
		var popup = new L.Popup();
		map.openPopup(popup, center);
		expect(popup.getLatLng()).to.eql(L.latLng(55.8, 37.6));
	});

	it("creates a popup from content", function () {
		map.openPopup("<h2>Hello World</h2>", center);
		expect(map._popup).to.be.an(L.Popup);
		expect(map._popup.getContent()).to.eql("<h2>Hello World</h2>");
	});

	it("closes existing popup", function () {
		var p1 = new L.Popup().setLatLng(center);
		var p2 = new L.Popup().setLatLng(center);
		map.openPopup(p1);
		map.openPopup(p2);
		expect(map.hasLayer(p1)).to.be(false);
	});

	it("does not close existing popup with autoClose: false option", function () {
		var p1 = new L.Popup({autoClose: false}).setLatLng(center);
		var p2 = new L.Popup().setLatLng(center);
		map.openPopup(p1);
		map.openPopup(p2);
		expect(map.hasLayer(p1)).to.be(true);
		expect(map.hasLayer(p2)).to.be(true);
	});

	it('should not be closen when dragging map', function (done) {
		c.style.position = 'absolute';
		c.style.left = 0;
		c.style.top = 0;
		c.style.zIndex = 10000;

		var coords = map._container.getBoundingClientRect();
		var spy = sinon.spy();
		var p = new L.Popup().setLatLng(center);
		map.openPopup(p);
		expect(map.hasLayer(p)).to.be(true);
		map.on('drag', spy);
		var hand = new Hand({
			timing: 'fastframe',
			onStop: function () {
				expect(spy.called).to.be(true);
				expect(map.hasLayer(p)).to.be(true);
				done();
			}});
		var mouse = hand.growFinger('mouse');
		mouse.moveTo(coords.left + 100, coords.left + 100, 0)
			.down().moveBy(10, 10, 20).up();
	});

});

describe('L.Layer#_popup', function () {
	beforeEach(setup);
	afterEach(cleanup);

	var marker;

	beforeEach(function () {
		marker = L.marker(L.latLng(55.8, 37.6)).addTo(map);
	});

	it("only adds a popup to the map when opened", function () {
		marker.bindPopup("new layer");
		expect(map.hasLayer(marker.getPopup())).to.be(false);
		marker.openPopup();
		expect(map.hasLayer(marker.getPopup())).to.be(true);
	});

	it("keeps an open popup on the map when it's unbound from the layer", function () {
		marker.bindPopup("new layer").openPopup();
		var popup = marker.getPopup();
		marker.unbindPopup();
		expect(map.hasLayer(popup)).to.be(true);
	});

	it("should not give an error when the marker has no popup", function () {
		expect(function () {
			marker.isPopupOpen();
		}).to.not.throwException();
		expect(marker.isPopupOpen()).to.be(false);
	});

	it("should show a popup as closed if it's never opened", function () {
		marker.bindPopup("new layer");
		expect(marker.isPopupOpen()).to.be(false);
	});

	it("should show a popup as opend if it's opened", function () {
		marker.bindPopup("new layer").openPopup();
		expect(marker.isPopupOpen()).to.be(true);
	});

	it("should show a popup as closed if it's opened and closed", function () {
		marker.bindPopup("new layer").openPopup().closePopup();
		expect(marker.isPopupOpen()).to.be(false);
	});

	it("should show the popup as closed if it's unbound", function () {
		marker.bindPopup("new layer").openPopup().unbindPopup();
		expect(function () {
			marker.isPopupOpen();
		}).to.not.throwException();
		expect(marker.isPopupOpen()).to.be(false);
	});

	it('does not throw is popup is inmediately closed', function (done) {
		map.on('popupopen', function () {
			marker.closePopup();
		});

		expect(function () {
			marker.bindPopup("new layer").openPopup();
			done();
		}).to.not.throwException();
	});
});
