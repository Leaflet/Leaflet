describe("Control.Layers", function () {
	var map;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
	});

	describe("baselayerchange event", function () {
		it("is fired on input that changes the base layer", function () {
			var baseLayers = {"Layer 1": L.tileLayer(), "Layer 2": L.tileLayer()},
				layers = L.control.layers(baseLayers).addTo(map),
				spy = jasmine.createSpy();

			map.on('baselayerchange', spy);
			happen.click(layers._baseLayersList.getElementsByTagName("input")[0]);

			expect(spy).toHaveBeenCalled();
			expect(spy.mostRecentCall.args[0].layer).toBe(baseLayers["Layer 1"]);
		});

		it("is not fired on input that doesn't change the base layer", function () {
			var overlays = {"Marker 1": L.marker([0, 0]), "Marker 2": L.marker([0, 0])},
				layers = L.control.layers({}, overlays).addTo(map),
				spy = jasmine.createSpy();

			map.on('baselayerchange', spy);
			happen.click(layers._overlaysList.getElementsByTagName("input")[0]);

			expect(spy).not.toHaveBeenCalled();
		});
	});
});
