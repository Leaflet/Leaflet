describe("Icon.Default", function () {

	it("icon measures 25x41px", function () {
		var div = document.createElement('div');
		div.style.height = '100px';
		document.body.appendChild(div);

		var map = L.map(div).setView([0, 0], 0);

		var marker = new L.Marker([0, 0]).addTo(map);

		var img = map.getPane('markerPane').querySelector('img');
		expect(img.clientHeight).to.be(41);
		expect(img.clientWidth).to.be(25);
		document.body.removeChild(div);
	});

	it("shadow measures 41x41px", function () {
		var div = document.createElement('div');
		div.style.height = '100px';
		document.body.appendChild(div);

		var map = L.map(div).setView([0, 0], 0);

		var marker = new L.Marker([0, 0]).addTo(map);

		var img = map.getPane('shadowPane').querySelector('img');
		expect(img.clientHeight).to.be(41);
		expect(img.clientWidth).to.be(41);
		document.body.removeChild(div);
	});

});
