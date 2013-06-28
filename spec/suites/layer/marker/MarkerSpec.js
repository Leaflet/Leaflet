describe("Marker", function () {
	var map,
		spy;
	beforeEach(function () {
		map = L.map(document.createElement('div')).setView([0, 0], 0);
	});

	describe("#setIcon", function () {
		it("changes the icon to another image", function () {
			var marker = new L.Marker([0, 0], {icon: new L.Icon({iconUrl: 'icon1.png' }) });
			map.addLayer(marker);
			
			var beforeIcon = marker._icon;
			marker.setIcon(new L.Icon({iconUrl: 'icon2.png' }));
			var afterIcon = marker._icon;
			
			expect(beforeIcon).to.be(afterIcon);
			expect(afterIcon.src).to.contain('icon2.png');
		});

		it("changes the icon to another DivIcon", function () {
			var marker = new L.Marker([0, 0], {icon: new L.DivIcon({html: 'Inner1Text' }) });
			map.addLayer(marker);
			
			var beforeIcon = marker._icon;
			marker.setIcon(new L.DivIcon({html: 'Inner2Text' }));
			var afterIcon = marker._icon;
			
			expect(beforeIcon).to.be(afterIcon);
			expect(afterIcon.innerHTML).to.contain('Inner2Text');
		});

		it("removes text when changing to a blank DivIcon", function () {
			var marker = new L.Marker([0, 0], {icon: new L.DivIcon({html: 'Inner1Text' }) });
			map.addLayer(marker);
			
			marker.setIcon(new L.DivIcon());
			var afterIcon = marker._icon;
			
			expect(marker._icon.innerHTML).to.not.contain('Inner1Text');
		});

		it("changes a DivIcon to an image", function () {
			var marker = new L.Marker([0, 0], {icon: new L.DivIcon({html: 'Inner1Text' }) });
			map.addLayer(marker);
			var oldIcon = marker._icon;
			
			marker.setIcon(new L.Icon({iconUrl: 'icon1.png' }));
			
			expect(oldIcon).to.not.be(marker._icon);
			expect(oldIcon.parentNode).to.be(null);
			
			expect(marker._icon.src).to.contain('icon1.png');
			expect(marker._icon.parentNode).to.be(map._panes.markerPane);
		});

		it("changes an image to a DivIcon", function () {
			var marker = new L.Marker([0, 0], {icon: new L.Icon({iconUrl: 'icon1.png' }) });
			map.addLayer(marker);
			var oldIcon = marker._icon;

			marker.setIcon(new L.DivIcon({html: 'Inner1Text' }));
			
			expect(oldIcon).to.not.be(marker._icon);
			expect(oldIcon.parentNode).to.be(null);
			
			expect(marker._icon.innerHTML).to.contain('Inner1Text');
			expect(marker._icon.parentNode).to.be(map._panes.markerPane);
		});

		it("reuses the icon/shadow when changing icon", function () {
			var marker = new L.Marker([0, 0], { icon: new L.Icon({ iconUrl: 'icon1.png', shadowUrl: 'shadow1.png', }) });
			map.addLayer(marker);
			var oldIcon = marker._icon;
			var oldShadow = marker._shadow;

			marker.setIcon(new L.Icon({ iconUrl: 'icon2.png', shadowUrl: 'shadow2.png', }));

			expect(oldIcon).to.be(marker._icon);
			expect(oldShadow).to.be(marker._shadow);

			expect(marker._icon.parentNode).to.be(map._panes.markerPane);
			expect(marker._shadow.parentNode).to.be(map._panes.shadowPane);
		});
	});
});