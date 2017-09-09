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

	it("uses imagePath option if specified", function () {
		// No need for a map in this test.
		// This also avoids printing a warning in console due to HTML 404 resource not found.
		var iconDefault = L.Marker.prototype.options.icon;
		var iconDefaultOptions = iconDefault.options;

		// Force re-evaluation of IconDefault options from CSS, using imagePath.
		iconDefault._needsInit = true;
		iconDefaultOptions.imagePath = 'IconDefault/dummy/imagePath/';
		iconDefaultOptions.iconUrl = null;

		var marker = new L.Marker([0, 0]);

		var path = marker.options.icon._getIconUrl('icon');

		// 'marker-icon.png' is now defined in CSS.
		expect(path).to.be('IconDefault/dummy/imagePath/marker-icon.png');

		// Force re-evaluation of IconDefault options from CSS, without imagePath.
		iconDefault._needsInit = true;
		delete iconDefaultOptions.imagePath;
		delete iconDefaultOptions.iconUrl;
	});

});
