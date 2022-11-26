describe('Marker', () => {
	let map,
	    container,
	    icon1,
	    icon2;

	beforeEach(() => {
		container = container = createContainer();
		map = L.map(container);

		map.setView([0, 0], 0);
		icon1 = new L.Icon.Default();
		icon2 = new L.Icon.Default({
			iconUrl: `${icon1.options.iconUrl}?2`,
			shadowUrl: `${icon1.options.shadowUrl}?2`
		});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#setIcon', () => {

		it('set the correct x and y size attributes', () => {
			const expectedX = 96;
			const expectedY = 100;
			const sizedIcon = new L.Icon.Default({
				iconUrl: `${icon1.options.iconUrl}?3`,
				iconSize: [expectedX, expectedY]
			});

			const marker = L.marker([0, 0], {icon: sizedIcon});
			map.addLayer(marker);

			const icon = marker._icon;

			expect(icon.style.width).to.be(`${expectedX}px`);
			expect(icon.style.height).to.be(`${expectedY}px`);
		});

		it('set the correct x and y size attributes passing only one value', () => {
			const expectedXY = 96;
			const sizedIcon = new L.Icon.Default({
				iconUrl: `${icon1.options.iconUrl}?3`,
				iconSize: expectedXY
			});

			const marker = L.marker([0, 0], {icon: sizedIcon});
			map.addLayer(marker);

			const icon = marker._icon;

			expect(icon.style.width).to.be(`${expectedXY}px`);
			expect(icon.style.height).to.be(`${expectedXY}px`);
		});

		it('set the correct x and y size attributes passing a L.Point instance', () => {
			const expectedXY = 96;
			const sizedIcon = new L.Icon.Default({
				iconUrl: `${icon1.options.iconUrl}?3`,
				iconSize: L.point(expectedXY, expectedXY)
			});

			const marker = L.marker([0, 0], {icon: sizedIcon});
			map.addLayer(marker);

			const icon = marker._icon;

			expect(icon.style.width).to.be(`${expectedXY}px`);
			expect(icon.style.height).to.be(`${expectedXY}px`);
		});

		it('changes the icon to another image while re-using the IMG element', () => {
			const marker = L.marker([0, 0], {icon: icon1});
			map.addLayer(marker);

			const beforeIcon = marker._icon;
			marker.setIcon(icon2);
			const afterIcon = marker._icon;

			expect(beforeIcon).to.be(afterIcon); // Check that the <IMG> element is re-used
			expect(afterIcon.src).to.contain(icon2._getIconUrl('icon'));
		});

		it('preserves draggability', () => {
			const marker = L.marker([0, 0], {icon: icon1});
			map.addLayer(marker);

			marker.dragging.disable();
			marker.setIcon(icon2);

			expect(marker.dragging.enabled()).to.be(false);

			marker.dragging.enable();

			marker.setIcon(icon1);

			expect(marker.dragging.enabled()).to.be(true);

			map.removeLayer(marker);
			map.addLayer(marker);

			expect(marker.dragging.enabled()).to.be(true);

			map.removeLayer(marker);
			// Dragging is still enabled, we should be able to disable it,
			// even if marker is off the map.
			expect(marker.dragging).to.be(undefined);
			marker.options.draggable = false;
			map.addLayer(marker);

			map.removeLayer(marker);

			// We should also be able to enable dragging while off the map
			expect(marker.dragging).to.be(undefined);
			marker.options.draggable = true;

			map.addLayer(marker);
			expect(marker.dragging.enabled()).to.be(true);
		});

		it('changes the DivIcon to another DivIcon, while re-using the DIV element', () => {
			const marker = L.marker([0, 0], {icon: L.divIcon({html: 'Inner1Text'})});
			map.addLayer(marker);

			const beforeIcon = marker._icon;
			marker.setIcon(L.divIcon({html: 'Inner2Text'}));
			const afterIcon = marker._icon;

			expect(beforeIcon).to.be(afterIcon); // Check that the <DIV> element is re-used
			expect(afterIcon.innerHTML).to.contain('Inner2Text');
		});

		it('removes text when changing to a blank DivIcon', () => {
			const marker = L.marker([0, 0], {icon: L.divIcon({html: 'Inner1Text'})});
			map.addLayer(marker);

			marker.setIcon(L.divIcon());

			expect(marker._icon.innerHTML).to.not.contain('Inner1Text');
		});

		it('changes a DivIcon to an image', () => {
			const marker = L.marker([0, 0], {icon: L.divIcon({html: 'Inner1Text'})});
			map.addLayer(marker);
			const oldIcon = marker._icon;

			marker.setIcon(icon1);

			expect(oldIcon).to.not.be(marker._icon); // Check that the _icon is NOT re-used
			expect(oldIcon.parentNode).to.be(null);

			if (L.Browser.retina) {
				expect(marker._icon.src).to.contain('marker-icon-2x.png');
			} else {
				expect(marker._icon.src).to.contain('marker-icon.png');
			}
			expect(marker._icon.parentNode).to.be(map._panes.markerPane);
		});

		it('changes an image to a DivIcon', () => {
			const marker = L.marker([0, 0], {icon: icon1});
			map.addLayer(marker);
			const oldIcon = marker._icon;

			marker.setIcon(L.divIcon({html: 'Inner1Text'}));

			expect(oldIcon).to.not.be(marker._icon); // Check that the _icon is NOT re-used
			expect(oldIcon.parentNode).to.be(null);

			expect(marker._icon.innerHTML).to.contain('Inner1Text');
			expect(marker._icon.parentNode).to.be(map._panes.markerPane);
		});

		it('reuses the icon/shadow when changing icon', () => {
			const marker = L.marker([0, 0], {icon: icon1});
			map.addLayer(marker);
			const oldIcon = marker._icon;
			const oldShadow = marker._shadow;

			marker.setIcon(icon2);

			expect(oldIcon).to.be(marker._icon);
			expect(oldShadow).to.be(marker._shadow);

			expect(marker._icon.parentNode).to.be(map._panes.markerPane);
			expect(marker._shadow.parentNode).to.be(map._panes.shadowPane);
		});

		it('sets the alt attribute to a default value when no alt text is passed', () => {
			const marker = L.marker([0, 0], {icon: icon1});
			map.addLayer(marker);
			const icon = marker._icon;
			expect(icon.hasAttribute('alt')).to.be(true);
			expect(icon.alt).to.be('Marker');
		});

		it('doesn\'t set the alt attribute for DivIcons', () => {
			const marker = L.marker([0, 0], {icon: L.divIcon(), alt: 'test'});
			map.addLayer(marker);
			const icon = marker._icon;
			expect(icon.hasAttribute('alt')).to.be(false);
		});

		it('pan map to focus marker', () => {
			const marker = L.marker([70, 0], {icon: L.divIcon()});
			map.addLayer(marker);

			expect(() => {
				marker._icon.focus();
			}).to.not.throwException();
		});

		it('pan map to focus marker with no iconSize', () => {
			const marker = L.marker([70, 0], {icon: L.divIcon({iconSize: null})});
			map.addLayer(marker);

			expect(() => {
				marker._panOnFocus();
			}).to.not.throwException();
		});
	});

	describe('#setLatLng', () => {
		it('fires a move event', () => {

			const marker = L.marker([0, 0], {icon: icon1});
			map.addLayer(marker);

			const beforeLatLng = marker._latlng;
			const afterLatLng = new L.LatLng(1, 2);

			let eventArgs = null;
			marker.on('move', (e) => {
				eventArgs = e;
			});

			marker.setLatLng(afterLatLng);

			expect(eventArgs).to.not.be(null);
			expect(eventArgs.oldLatLng).to.be(beforeLatLng);
			expect(eventArgs.latlng).to.be(afterLatLng);
			expect(marker.getLatLng()).to.be(afterLatLng);
		});
	});

	describe('events', () => {
		it('fires click event when clicked', () => {
			const spy = sinon.spy();

			const marker = L.marker([0, 0]).addTo(map);

			marker.on('click', spy);
			happen.click(marker._icon);

			expect(spy.called).to.be.ok();
		});

		it('fires click event when clicked with DivIcon', () => {
			const spy = sinon.spy();

			const marker = L.marker([0, 0], {icon: L.divIcon()}).addTo(map);

			marker.on('click', spy);
			happen.click(marker._icon);

			expect(spy.called).to.be.ok();
		});

		it('fires click event when clicked on DivIcon child element', () => {
			const spy = sinon.spy();

			const marker = L.marker([0, 0], {icon: L.divIcon({html: '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />'})}).addTo(map);

			marker.on('click', spy);

			happen.click(marker._icon);
			expect(spy.called).to.be.ok();

			happen.click(marker._icon.querySelector('img'));
			expect(spy.calledTwice).to.be.ok();
		});

		it('fires click event when clicked on DivIcon child element set using setIcon', () => {
			const spy = sinon.spy();

			const marker = L.marker([0, 0]).addTo(map);
			marker.setIcon(L.divIcon({html: '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />'}));

			marker.on('click', spy);

			happen.click(marker._icon);
			expect(spy.called).to.be.ok();

			happen.click(marker._icon.querySelector('img'));
			expect(spy.calledTwice).to.be.ok();
		});

		it('do not propagate click event', () => {
			const spy = sinon.spy();
			const spy2 = sinon.spy();
			const mapSpy = sinon.spy();
			const marker = L.marker([55.8, 37.6]);
			map.addLayer(marker);
			marker.on('click', spy);
			marker.on('click', spy2);
			map.on('click', mapSpy);
			happen.click(marker._icon);
			expect(spy.called).to.be.ok();
			expect(spy2.called).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it('do not propagate dblclick event', () => {
			const spy = sinon.spy();
			const spy2 = sinon.spy();
			const mapSpy = sinon.spy();
			const marker = L.marker([55.8, 37.6]);
			map.addLayer(marker);
			marker.on('dblclick', spy);
			marker.on('dblclick', spy2);
			map.on('dblclick', mapSpy);
			happen.dblclick(marker._icon);
			expect(spy.called).to.be.ok();
			expect(spy2.called).to.be.ok();
			expect(mapSpy.called).not.to.be.ok();
		});

		it('do not catch event if it does not listen to it', (done) => {
			const marker = L.marker([55, 37]);
			map.addLayer(marker);
			marker.once('mousemove', (e) => {
				// It should be the marker coordinates
				expect(e.latlng.equals(marker.getLatLng())).to.be.equal(true);
			});
			happen.mousemove(marker._icon);

			map.once('mousemove', (e) => {
				// It should be the mouse coordinates, not the marker ones
				expect(e.latlng.equals(marker.getLatLng())).to.be.equal(false);
				done();
			});
			happen.mousemove(marker._icon);
		});
	});
});
