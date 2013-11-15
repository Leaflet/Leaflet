describe('Popup', function () {

	var c, map;

	beforeEach(function () {
		c = document.createElement('div');
		c.style.width = '400px';
		c.style.height = '400px';
		map = new L.Map(c);
		map.setView(new L.LatLng(55.8, 37.6), 6);
	});

	it("closes on map click when map has closePopupOnClick option", function () {
		map.options.closePopupOnClick = true;

		var popup = new L.Popup()
			.setLatLng(new L.LatLng(55.8, 37.6))
			.openOn(map);

		happen.click(c);

		expect(map.hasLayer(popup)).to.be(false);
	});

	it("closes on map click when popup has closeOnClick option", function () {
		map.options.closePopupOnClick = false;

		var popup = new L.Popup({closeOnClick: true})
			.setLatLng(new L.LatLng(55.8, 37.6))
			.openOn(map);

		happen.click(c);

		expect(map.hasLayer(popup)).to.be(false);
	});

	it("does not close on map click when popup has closeOnClick: false option", function () {
		map.options.closePopupOnClick = true;

		var popup = new L.Popup({closeOnClick: false})
			.setLatLng(new L.LatLng(55.8, 37.6))
			.openOn(map);

		happen.click(c);

		expect(map.hasLayer(popup)).to.be(true);
	});

	it("toggles its visibility when marker is clicked", function () {
		var marker = new L.Marker(new L.LatLng(55.8, 37.6));
		map.addLayer(marker);

		marker.bindPopup('Popup1').openPopup();

		map.options.closePopupOnClick = true;
		happen.click(c);

		// toggle open popup
		sinon.spy(marker, "openPopup");
		marker.fire('click');
		expect(marker.openPopup.calledOnce).to.be(true);
		expect(map.hasLayer(marker._popup)).to.be(true);
		marker.openPopup.restore();

		// toggle close popup
		sinon.spy(marker, "closePopup");
		marker.fire('click');
		expect(marker.closePopup.calledOnce).to.be(true);
		expect(map.hasLayer(marker._popup)).to.be(false);
		marker.closePopup.restore();
	});

	it("should trigger popupopen on marker when popup opens", function () {
		var marker1 = new L.Marker(new L.LatLng(55.8, 37.6));
		var marker2 = new L.Marker(new L.LatLng(57.123076977278, 44.861962891635));

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

	it("should trigger popupclose on marker when popup closes", function () {
		var marker1 = new L.Marker(new L.LatLng(55.8, 37.6));
		var marker2 = new L.Marker(new L.LatLng(57.123076977278, 44.861962891635));

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
});
