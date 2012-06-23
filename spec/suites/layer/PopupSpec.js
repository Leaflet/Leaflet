describe('Popup', function() {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#popupopen", function() {
		it("should triggers on marker when popup opens", function() {
			var marker1 = new L.Marker(new L.LatLng(55.8, 37.6));
			var marker2 = new L.Marker(new L.LatLng(57.123076977278, 44.861962891635));

			map.addLayer(marker1);
			map.addLayer(marker2);

			marker1.bindPopup('Popup1');
			marker2.bindPopup('Popup2');

			var eventTriggered = false;
			marker1.on('popupopen', function() {
				eventTriggered = true;
			});

			expect(eventTriggered).toEqual(false);
			marker2.openPopup();
			expect(eventTriggered).toEqual(false);
			marker1.openPopup();
			expect(eventTriggered).toEqual(true);
		});
	});

	describe("#popupclose", function() {
		it("should triggers on marker when popup closes", function() {
			var marker1 = new L.Marker(new L.LatLng(55.8, 37.6));
			var marker2 = new L.Marker(new L.LatLng(57.123076977278, 44.861962891635));

			map.addLayer(marker1);
			map.addLayer(marker2);

			marker1.bindPopup('Popup1');
			marker2.bindPopup('Popup2');

			var eventTriggered = false;
			marker1.on('popupclose', function() {
				eventTriggered = true;
			});

			expect(eventTriggered).toEqual(false);
			marker2.openPopup();
			expect(eventTriggered).toEqual(false);
			marker1.openPopup();
			expect(eventTriggered).toEqual(false);
			marker2.openPopup();
			expect(eventTriggered).toEqual(true);
			eventTriggered = false;
			marker1.openPopup();
			marker1.closePopup();
			expect(eventTriggered).toEqual(true);
		});
	});
});
