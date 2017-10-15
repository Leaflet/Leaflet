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

	it("uses options set on L.Icon.Default.prototype (for backward compatibility)", function () {
		// No need for a map in this test.
		// This also avoids printing a warning in console due to HTML 404 resource not found.
		var newOptions = {
			iconUrl: 'dummy/icon.png',
			iconRetinaUrl: 'dummy/iconRetina.png',
			iconSize: [100, 200],
			iconAnchor: [50, 75],
			shadowUrl: 'dummy/shadow.png',
			shadowRetinaUrl: 'dummy/shadowRetina.png',
			shadowSize: [110, 210],
			shadowAnchor: [55, 80]
		};

		// Add options to L.Icon.Default.prototype like what previous apps may have done.
		L.Icon.Default.mergeOptions(newOptions);

		// Re-instantiate a new Default Icon, so that its options will be evaluated just now.
		var iconDefault = new L.Icon.Default();
		var iconDefaultOptions = iconDefault.options;

		L.Marker.mergeOptions({
			icon: iconDefault
		});

		var marker = new L.Marker([0, 0]);
		// Force retrieval of Default Icon options from CSS.
		marker.options.icon._getIconUrl('icon');

		// Make sure it used the specified default options instead of the ones from CSS.
		expect(iconDefaultOptions.iconUrl).to.be(newOptions.iconUrl);
		expect(iconDefaultOptions.iconRetinaUrl).to.be(newOptions.iconRetinaUrl);
		expect(iconDefaultOptions.iconSize).to.be(newOptions.iconSize);
		expect(iconDefaultOptions.iconAnchor).to.be(newOptions.iconAnchor);
		expect(iconDefaultOptions.shadowUrl).to.be(newOptions.shadowUrl);
		expect(iconDefaultOptions.shadowRetinaUrl).to.be(newOptions.shadowRetinaUrl);
		expect(iconDefaultOptions.shadowSize).to.be(newOptions.shadowSize);
		expect(iconDefaultOptions.shadowAnchor).to.be(newOptions.shadowAnchor);

		// Reset default options and re-force re-evaluation.
		_deleteIconOptions(L.Icon.Default.prototype.options, newOptions);

		// Re-instantiate a new Default Icon, for next tests to use default values (i.e. the ones from CSS).
		L.Marker.mergeOptions({
			icon: new L.Icon.Default()
		});

		function _deleteIconOptions(iconOptions, keysObj) {
			for (var key in keysObj) {
				delete iconOptions[key];
			}
		}
	});

});
