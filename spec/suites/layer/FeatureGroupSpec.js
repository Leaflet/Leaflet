describe('FeatureGroup', function () {
	var map;
	beforeEach(function () {
		map = L.map(document.createElement('div'));
		map.setView([0, 0], 1);
	});
	describe("#_propagateEvent", function () {
		var marker;
		beforeEach(function () {
			marker = L.marker([0, 0]);
		});
		describe("when a Marker is added to multiple FeatureGroups ", function () {
			it("e.layer should be the Marker", function () {
				var fg1 = L.featureGroup(),
				    fg2 = L.featureGroup();

				fg1.addLayer(marker);
				fg2.addLayer(marker);

				var wasClicked = 0;
				fg2.on('click', function(e) {
					expect(e.layer).to.be(marker);
					expect(e.target).to.be(fg2);
					wasClicked |= 1;
				});

				fg1.on('click', function (e) {
					expect(e.layer).to.be(marker);
					expect(e.target).to.be(fg1);
					wasClicked |= 2;
				});

				marker.fire('click', { type: 'click' });

				expect(wasClicked).to.be(3);
			});
		});
	});
	describe('addLayer', function () {
		it('adds the layer', function () {
			var fg = L.featureGroup(),
			    marker = L.marker([0, 0]);

			expect(fg.hasLayer(marker)).to.be(false);

			fg.addLayer(marker);

			expect(fg.hasLayer(marker)).to.be(true);
		});
	});
	describe('removeLayer', function () {
		it('removes the layer passed to it', function () {
			var fg = L.featureGroup(),
			    marker = L.marker([0, 0]);

			fg.addLayer(marker);
			expect(fg.hasLayer(marker)).to.be(true);

			fg.removeLayer(marker);
			expect(fg.hasLayer(marker)).to.be(false);
		});
		it('removes the layer passed to it by id', function () {
			var fg = L.featureGroup(),
			    marker = L.marker([0, 0]);

			fg.addLayer(marker);
			expect(fg.hasLayer(marker)).to.be(true);

			fg.removeLayer(marker._leaflet_id);
			expect(fg.hasLayer(marker)).to.be(false);
		});
	});
});
