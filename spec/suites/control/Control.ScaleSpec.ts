describe("Control.Scale", function () {
	it("can be added to an unloaded map", function () {
		var map = L.map(document.createElement('div'));
		new L.Control.Scale().addTo(map);
	});
});
