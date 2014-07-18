describe("DivIcon", function() {
	var map;

	beforeEach(function () {
		map = L.map(document.createElement('div')).setView([0, 0], 0);
	});

	describe("#createIcon", function() {
		it ("Accepts an HTMl node", function() {
			var div = document.createElement('div'),
				icon = new L.DivIcon({ html: div });
		});
	});
});