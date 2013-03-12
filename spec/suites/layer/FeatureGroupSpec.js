describe('CircleMarker', function () {
	describe("#_propagateEvent", function () {
		var map, marker;
		beforeEach(function () {
			map = L.map(document.createElement('div'));
			map.setView([0, 0], 1);
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
					expect(e.layer).toBe(marker);
					expect(e.target).toBe(fg2);
					wasClicked |= 1;
				});

				fg1.on('click', function (e) {
					expect(e.layer).toBe(marker);
					expect(e.target).toBe(fg1);
					wasClicked |= 2;
				});

				marker.fire('click', { type: 'click' });

				expect(wasClicked).toBe(3);
			});
		});
	});
});
