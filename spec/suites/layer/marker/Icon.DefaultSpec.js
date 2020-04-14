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

	it("detect icon images path", function () {
		var origPath = L.Icon.Default.imagePath; // set in after.js
		expect(origPath).to.be.ok();
		delete L.Icon.Default.imagePath;
		var marker = new L.Marker([0, 0]);

		expect(L.Icon.Default.imagePath).to.not.be.ok();
		marker.addTo(map);
		expect(L.Icon.Default.imagePath).to.equal(document.location.origin + origPath);
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
