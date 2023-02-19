describe('FeatureGroup', () => {
	describe('#_propagateEvent', () => {
		let marker;

		beforeEach(() => {
			marker = L.marker([0, 0]);
		});

		describe('when a Marker is added to multiple FeatureGroups ', () => {
			it('e.propagatedFrom should be the Marker', () => {
				const fg1 = L.featureGroup(),
				    fg2 = L.featureGroup();

				fg1.addLayer(marker);
				fg2.addLayer(marker);

				let wasClicked1,
				    wasClicked2;

				fg2.on('click', (e) => {
					expect(e.propagatedFrom).to.be(marker);
					expect(e.target).to.be(fg2);
					wasClicked2 = true;
				});

				fg1.on('click', (e) => {
					expect(e.propagatedFrom).to.be(marker);
					expect(e.target).to.be(fg1);
					wasClicked1 = true;
				});

				marker.fire('click', {type: 'click'}, true);

				expect(wasClicked1).to.be(true);
				expect(wasClicked2).to.be(true);
			});
		});
	});

	describe('addLayer', () => {
		it('adds the layer', () => {
			const fg = L.featureGroup(),
			    marker = L.marker([0, 0]);

			expect(fg.hasLayer(marker)).to.be(false);

			fg.addLayer(marker);

			expect(fg.hasLayer(marker)).to.be(true);
		});

		it('supports non-evented layers', () => {
			const fg = L.featureGroup(),
			    g = L.layerGroup();

			expect(fg.hasLayer(g)).to.be(false);

			fg.addLayer(g);

			expect(fg.hasLayer(g)).to.be(true);
		});
	});

	describe('removeLayer', () => {
		it('removes the layer passed to it', () => {
			const fg = L.featureGroup(),
			    marker = L.marker([0, 0]);

			fg.addLayer(marker);
			expect(fg.hasLayer(marker)).to.be(true);

			fg.removeLayer(marker);
			expect(fg.hasLayer(marker)).to.be(false);
		});

		it('removes the layer passed to it by id', () => {
			const fg = L.featureGroup(),
			    marker = L.marker([0, 0]);

			fg.addLayer(marker);
			expect(fg.hasLayer(marker)).to.be(true);

			fg.removeLayer(L.stamp(marker));
			expect(fg.hasLayer(marker)).to.be(false);
		});
	});

	describe('getBounds', () => {
		it('returns the bounds (latlng) of the group', () => {
			const fg = L.featureGroup([
				L.marker([0, 0]),
				L.marker([4, 4]),
				L.marker([3, 3]),
				L.marker([2, 2]),
				L.marker([1, 1]),
			]);

			const southWest = new L.LatLng(0, 0),
			    northEast = new L.LatLng(4, 4);

			const bounds = new L.LatLngBounds(southWest, northEast);
			expect(fg.getBounds()).to.eql(bounds);
		});

		it('returns the bounds (LatLng) of the group', () => {
			const fg = L.featureGroup([
				L.marker([0, 0]),
				L.marker([4, 4]),
				L.marker([3, 3]),
				L.marker([2, 2]),
				L.marker([1, 1]),
			]);

			const southWest = new L.LatLng(0, 0),
			    northEast = new L.LatLng(4, 4);

			const bounds = new L.LatLngBounds(southWest, northEast);
			expect(fg.getBounds()).to.eql(bounds);
		});

		describe('when a FeatureGroup contains a LayerGroup as children', () => {
			it('returns the bounds (LatLng) of the group, including group member\'s child layers', () => {
				const parentFeatureGroup = L.featureGroup([L.marker([-23, -102])]);

				L.layerGroup([
					L.marker([39.61, -105.02]),
					L.marker([39.74, -104.99]),
					L.marker([39.73, -104.8]),
					L.marker([39.77, -105.23]),
				]).addTo(parentFeatureGroup);

				const bounds = new L.LatLngBounds(
					new L.LatLng(-23, -105.23),
					new L.LatLng(39.77, -102)
				);
				expect(parentFeatureGroup.getBounds()).to.eql(bounds);
			});
		});

		describe('when a FeatureGroup contains nested LayerGroups/FeatureGroups as children', () => {
			it('returns the bounds (LatLng) of the group, including bounds of nested groups\' child layers', () => {
				const parentFeatureGroup = L.featureGroup();

				L.layerGroup([
					L.marker([39.61, -105.02]),
					L.marker([39.74, -104.99]),
					L.marker([39.73, -104.8]),
					L.marker([39.77, -105.23]),
				]).addTo(parentFeatureGroup);

				L.layerGroup([
					L.marker([39.72, -103.31]),
					L.layerGroup([
						L.marker([39.51, -104]),
						L.marker([39.52, -106]),
					]),
					L.layerGroup([
						L.marker([39.51, -104]),
						L.marker([39.5, -103]),
						L.marker([42, -104]),
					]),
					L.marker([39.77, -105.32]),
				]).addTo(parentFeatureGroup);

				L.layerGroup([
					L.marker([39.72, -103.31]),
					L.layerGroup([
						L.marker([39.51, -104]),
						L.marker([43.5, -103]),
					]),
					L.featureGroup([
						L.featureGroup([
							L.marker([39, -55]),
							L.marker([39, -55.6]),
							L.marker([39.2, -50]),
						])
					]),
				]).addTo(parentFeatureGroup);

				const bounds = new L.LatLngBounds(
					new L.LatLng(39, -106),
					new L.LatLng(43.5, -50)
				);
				expect(parentFeatureGroup.getBounds()).to.eql(bounds);
			});
		});

		describe('when a FeatureGroup contains nested LayerGroups/FeatureGroups as children with self references (circular structure)', () => {
			it('returns the bounds (LatLng) of the group, including bounds of nested groups\' child layers, while avoiding circular references', () => {
				const parentFeatureGroup = L.featureGroup();

				L.layerGroup([
					L.marker([39.61, -105.02]),
					L.marker([39.74, -104.99]),
					L.marker([39.73, -104.8]),
					L.marker([39.77, -105.23]),
				]).addTo(parentFeatureGroup);

				const nestedGroup = L.layerGroup([
					L.marker([39.72, -103.31]),
					L.layerGroup([
						L.marker([39.51, -104]),
						L.marker([39.52, -106]),
					]),
					L.layerGroup([
						L.marker([39.51, -104]),
						L.marker([39.5, -103]),
						L.marker([42, -104]),
					]),
					L.marker([39.77, -105.32]),
				]);

				nestedGroup.addTo(parentFeatureGroup);
				parentFeatureGroup.addTo(nestedGroup);

				L.layerGroup([
					L.marker([39.72, -103.31]),
					L.layerGroup([
						L.marker([39.51, -104]),
						L.marker([43.5, -103]),
					]),
					L.featureGroup([
						L.featureGroup([
							L.marker([39, -55]),
							L.marker([39, -55.6]),
							L.marker([39.2, -50]),
						])
					]),
				]).addTo(parentFeatureGroup);

				const bounds = new L.LatLngBounds(
					new L.LatLng(39, -106),
					new L.LatLng(43.5, -50)
				);
				expect(parentFeatureGroup.getBounds()).to.eql(bounds);
			});
		});
	});
});
