describe("Map", function () {
	describe("#getBounds", function () {
		it("is safe to call from within a moveend callback during initial load (#1027)", function () {
			var c = document.createElement('div'),
				map = L.map(c);

			map.on("moveend", function () {
			  map.getBounds();
			});

			map.setView([51.505, -0.09], 13);
		});
	});
});
