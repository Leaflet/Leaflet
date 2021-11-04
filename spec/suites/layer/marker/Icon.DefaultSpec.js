describe("Icon.Default", function () {
	var div, map;

	beforeEach(function () {
		div = document.createElement('div');
		div.style.height = '100px';
		document.body.appendChild(div);
		map = L.map(div).setView([0, 0], 0);
		L.marker([0, 0]).addTo(map);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(div);
	});

	it("icon measures 25x41px", function () {
		var img = map.getPane('markerPane').querySelector('img');
		expect(img.clientHeight).to.be(41);
		expect(img.clientWidth).to.be(25);
	});

	it("shadow measures 41x41px", function () {
		var img = map.getPane('shadowPane').querySelector('img');
		expect(img.clientHeight).to.be(41);
		expect(img.clientWidth).to.be(41);
	});
});
