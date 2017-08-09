describe("Marker.Drag", function () {
	var map,
	    div;

	beforeEach(function () {
		div = document.createElement('div');
		div.style.width = div.style.height = '600px';
		div.style.top = div.style.left = 0;
		div.style.position = 'absolute';
		document.body.appendChild(div);

		map = L.map(div).setView([0, 0], 0);
	});

	afterEach(function () {
		document.body.removeChild(div);
	});

	describe("drag", function () {
		it("drags a marker with mouse", function (done) {
			var marker = new L.Marker([0, 0], {
				draggable: true
			});
			map.addLayer(marker);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					var center = map.getCenter();
					expect(center.lat).to.be(0);
					expect(center.lng).to.be(0);

					var markerPos = marker.getLatLng();
					// Marker drag is very timing sensitive, so we can't check
					// exact values here, just verify that the drag is in the
					// right ballpark
					expect(markerPos.lat).to.be.within(-50, -30);
					expect(markerPos.lng).to.be.within(340, 380);

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.wait(100).moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 1000).wait(100).up().wait(100);
		});

		it("pans map when autoPan is enabled", function (done) {
			var marker = new L.Marker([0, 0], {
				draggable: true,
				autoPan: true
			});
			map.addLayer(marker);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					var center = map.getCenter();
					expect(center.lat).to.be(0);
					expect(center.lng).to.be.within(10, 30);

					var markerPos = marker.getLatLng();
					// Marker drag is very timing sensitive, so we can't check
					// exact values here, just verify that the drag is in the
					// right ballpark
					expect(markerPos.lat).to.be.within(-50, -30);
					expect(markerPos.lng).to.be.within(400, 450);

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.wait(100).moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(290, 32, 1000).wait(100).up().wait(100);
		});
	});

	// describe("#setIcon", function () {

	// 	it("set the correct x and y size attributes", function () {
	// 		var expectedX = 96;
	// 		var expectedY = 100;
	// 		var sizedIcon = new L.Icon.Default({
	// 			iconUrl: icon1.options.iconUrl + '?3',
	// 			iconSize: [expectedX, expectedY]
	// 		});

	// 		var marker = new L.Marker([0, 0], {icon: sizedIcon});
	// 		map.addLayer(marker);

	// 		var icon = marker._icon;

	// 		expect(icon.style.width).to.be(expectedX + 'px');
	// 		expect(icon.style.height).to.be(expectedY + 'px');
	// 	});

	// 	it("set the correct x and y size attributes passing only one value", function () {
	// 		var expectedXY = 96;
	// 		var sizedIcon = new L.Icon.Default({
	// 			iconUrl: icon1.options.iconUrl + '?3',
	// 			iconSize: expectedXY
	// 		});

	// 		var marker = new L.Marker([0, 0], {icon: sizedIcon});
	// 		map.addLayer(marker);

	// 		var icon = marker._icon;

	// 		expect(icon.style.width).to.be(expectedXY + 'px');
	// 		expect(icon.style.height).to.be(expectedXY + 'px');
	// 	});

	// 	it("set the correct x and y size attributes passing a L.Point instance", function () {
	// 		var expectedXY = 96;
	// 		var sizedIcon = new L.Icon.Default({
	// 			iconUrl: icon1.options.iconUrl + '?3',
	// 			iconSize: L.point(expectedXY, expectedXY)
	// 		});

	// 		var marker = new L.Marker([0, 0], {icon: sizedIcon});
	// 		map.addLayer(marker);

	// 		var icon = marker._icon;

	// 		expect(icon.style.width).to.be(expectedXY + 'px');
	// 		expect(icon.style.height).to.be(expectedXY + 'px');
	// 	});

	// 	it("changes the icon to another image while re-using the IMG element", function () {
	// 		var marker = new L.Marker([0, 0], {icon: icon1});
	// 		map.addLayer(marker);

	// 		var beforeIcon = marker._icon;
	// 		marker.setIcon(icon2);
	// 		var afterIcon = marker._icon;

	// 		expect(beforeIcon).to.be(afterIcon); // Check that the <IMG> element is re-used
	// 		expect(afterIcon.src).to.contain(icon2._getIconUrl('icon'));
	// 	});

	// 	it("preserves draggability", function () {
	// 		var marker = new L.Marker([0, 0], {icon: icon1});
	// 		map.addLayer(marker);

	// 		marker.dragging.disable();
	// 		marker.setIcon(icon2);

	// 		expect(marker.dragging.enabled()).to.be(false);

	// 		marker.dragging.enable();

	// 		marker.setIcon(icon1);

	// 		expect(marker.dragging.enabled()).to.be(true);

	// 		map.removeLayer(marker);
	// 		map.addLayer(marker);

	// 		expect(marker.dragging.enabled()).to.be(true);

	// 		map.removeLayer(marker);
	// 		// Dragging is still enabled, we should be able to disable it,
	// 		// even if marker is off the map.
	// 		expect(marker.dragging).to.be(undefined);
	// 		marker.options.draggable = false;
	// 		map.addLayer(marker);

	// 		map.removeLayer(marker);

	// 		// We should also be able to enable dragging while off the map
	// 		expect(marker.dragging).to.be(undefined);
	// 		marker.options.draggable = true;

	// 		map.addLayer(marker);
	// 		expect(marker.dragging.enabled()).to.be(true);
	// 	});

	// 	it("changes the DivIcon to another DivIcon, while re-using the DIV element", function () {
	// 		var marker = new L.Marker([0, 0], {icon: new L.DivIcon({html: 'Inner1Text'})});
	// 		map.addLayer(marker);

	// 		var beforeIcon = marker._icon;
	// 		marker.setIcon(new L.DivIcon({html: 'Inner2Text'}));
	// 		var afterIcon = marker._icon;

	// 		expect(beforeIcon).to.be(afterIcon); // Check that the <DIV> element is re-used
	// 		expect(afterIcon.innerHTML).to.contain('Inner2Text');
	// 	});

	// 	it("removes text when changing to a blank DivIcon", function () {
	// 		var marker = new L.Marker([0, 0], {icon: new L.DivIcon({html: 'Inner1Text'})});
	// 		map.addLayer(marker);

	// 		marker.setIcon(new L.DivIcon());
	// 		var afterIcon = marker._icon;

	// 		expect(marker._icon.innerHTML).to.not.contain('Inner1Text');
	// 	});

	// 	it("changes a DivIcon to an image", function () {
	// 		var marker = new L.Marker([0, 0], {icon: new L.DivIcon({html: 'Inner1Text'})});
	// 		map.addLayer(marker);
	// 		var oldIcon = marker._icon;

	// 		marker.setIcon(icon1);

	// 		expect(oldIcon).to.not.be(marker._icon); // Check that the _icon is NOT re-used
	// 		expect(oldIcon.parentNode).to.be(null);

	// 		if (L.Browser.retina) {
	// 			expect(marker._icon.src).to.contain('marker-icon-2x.png');
	// 		} else {
	// 			expect(marker._icon.src).to.contain('marker-icon.png');
	// 		}
	// 		expect(marker._icon.parentNode).to.be(map._panes.markerPane);
	// 	});

	// 	it("changes an image to a DivIcon", function () {
	// 		var marker = new L.Marker([0, 0], {icon: icon1});
	// 		map.addLayer(marker);
	// 		var oldIcon = marker._icon;

	// 		marker.setIcon(new L.DivIcon({html: 'Inner1Text'}));

	// 		expect(oldIcon).to.not.be(marker._icon); // Check that the _icon is NOT re-used
	// 		expect(oldIcon.parentNode).to.be(null);

	// 		expect(marker._icon.innerHTML).to.contain('Inner1Text');
	// 		expect(marker._icon.parentNode).to.be(map._panes.markerPane);
	// 	});

	// 	it("reuses the icon/shadow when changing icon", function () {
	// 		var marker = new L.Marker([0, 0], {icon: icon1});
	// 		map.addLayer(marker);
	// 		var oldIcon = marker._icon;
	// 		var oldShadow = marker._shadow;

	// 		marker.setIcon(icon2);

	// 		expect(oldIcon).to.be(marker._icon);
	// 		expect(oldShadow).to.be(marker._shadow);

	// 		expect(marker._icon.parentNode).to.be(map._panes.markerPane);
	// 		expect(marker._shadow.parentNode).to.be(map._panes.shadowPane);
	// 	});
	// });

	// describe("#setLatLng", function () {
	// 	it("fires a move event", function () {

	// 		var marker = new L.Marker([0, 0], {icon: icon1});
	// 		map.addLayer(marker);

	// 		var beforeLatLng = marker._latlng;
	// 		var afterLatLng = new L.LatLng(1, 2);

	// 		var eventArgs = null;
	// 		marker.on('move', function (e) {
	// 			eventArgs = e;
	// 		});

	// 		marker.setLatLng(afterLatLng);

	// 		expect(eventArgs).to.not.be(null);
	// 		expect(eventArgs.oldLatLng).to.be(beforeLatLng);
	// 		expect(eventArgs.latlng).to.be(afterLatLng);
	// 		expect(marker.getLatLng()).to.be(afterLatLng);
	// 	});
	// });

	// describe('events', function () {
	// 	it('fires click event when clicked', function () {
	// 		var spy = sinon.spy();

	// 		var marker = L.marker([0, 0]).addTo(map);

	// 		marker.on('click', spy);
	// 		happen.click(marker._icon);

	// 		expect(spy.called).to.be.ok();
	// 	});

	// 	it('fires click event when clicked with DivIcon', function () {
	// 		var spy = sinon.spy();

	// 		var marker = L.marker([0, 0], {icon: new L.DivIcon()}).addTo(map);

	// 		marker.on('click', spy);
	// 		happen.click(marker._icon);

	// 		expect(spy.called).to.be.ok();
	// 	});

	// 	it('fires click event when clicked on DivIcon child element', function () {
	// 		var spy = sinon.spy();

	// 		var marker = L.marker([0, 0], {icon: new L.DivIcon({html: '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />'})}).addTo(map);

	// 		marker.on('click', spy);

	// 		happen.click(marker._icon);
	// 		expect(spy.called).to.be.ok();

	// 		happen.click(marker._icon.querySelector('img'));
	// 		expect(spy.calledTwice).to.be.ok();
	// 	});

	// 	it('fires click event when clicked on DivIcon child element set using setIcon', function () {
	// 		var spy = sinon.spy();

	// 		var marker = L.marker([0, 0]).addTo(map);
	// 		marker.setIcon(new L.DivIcon({html: '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />'}));

	// 		marker.on('click', spy);

	// 		happen.click(marker._icon);
	// 		expect(spy.called).to.be.ok();

	// 		happen.click(marker._icon.querySelector('img'));
	// 		expect(spy.calledTwice).to.be.ok();
	// 	});

	// 	it("do not propagate click event", function () {
	// 		var spy = sinon.spy();
	// 		var spy2 = sinon.spy();
	// 		var mapSpy = sinon.spy();
	// 		var marker = new L.Marker(new L.LatLng(55.8, 37.6));
	// 		map.addLayer(marker);
	// 		marker.on('click', spy);
	// 		marker.on('click', spy2);
	// 		map.on('click', mapSpy);
	// 		happen.click(marker._icon);
	// 		expect(spy.called).to.be.ok();
	// 		expect(spy2.called).to.be.ok();
	// 		expect(mapSpy.called).not.to.be.ok();
	// 	});

	// 	it("do not propagate dblclick event", function () {
	// 		var spy = sinon.spy();
	// 		var spy2 = sinon.spy();
	// 		var mapSpy = sinon.spy();
	// 		var marker = new L.Marker(new L.LatLng(55.8, 37.6));
	// 		map.addLayer(marker);
	// 		marker.on('dblclick', spy);
	// 		marker.on('dblclick', spy2);
	// 		map.on('dblclick', mapSpy);
	// 		happen.dblclick(marker._icon);
	// 		expect(spy.called).to.be.ok();
	// 		expect(spy2.called).to.be.ok();
	// 		expect(mapSpy.called).not.to.be.ok();
	// 	});

	// 	it("do not catch event if it does not listen to it", function (done) {
	// 		var marker = new L.Marker([55, 37]);
	// 		map.addLayer(marker);
	// 		marker.once('mousemove', function (e) {
	// 			// It should be the marker coordinates
	// 			expect(e.latlng.equals(marker.getLatLng())).to.be.equal(true);
	// 		});
	// 		happen.mousemove(marker._icon);

	// 		map.once('mousemove', function (e) {
	// 			// It should be the mouse coordinates, not the marker ones
	// 			expect(e.latlng.equals(marker.getLatLng())).to.be.equal(false);
	// 			done();
	// 		});
	// 		happen.mousemove(marker._icon);
	// 	});

	// });
});
