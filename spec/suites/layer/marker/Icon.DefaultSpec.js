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
		// Re-instantiate a new Default Icon, so that its options will be evaluated just now.
		var iconDefault = new L.Icon.Default();
		var iconDefaultOptions = iconDefault.options;

		iconDefaultOptions.imagePath = 'IconDefault/dummy/imagePath/';

		var path = iconDefault._getIconUrl('icon');

		// 'marker-icon.png' is now defined in CSS.
		expect(iconDefaultOptions.iconUrl).to.be('marker-icon.png');
		expect(path).to.be('IconDefault/dummy/imagePath/marker-icon.png');
	});

	it("uses imagePath and iconUrl options", function () {
		// No need for a map in this test.
		// This also avoids printing a warning in console due to HTML 404 resource not found.
		// Re-instantiate a new Default Icon, so that its options will be evaluated just now.
		var options = {
			iconUrl: 'extra/path/to/marker.png',
			imagePath: 'IconDefault/dummy/imagePath/'
		};
		var iconDefault = new L.Icon.Default(options);

		var path = iconDefault._getIconUrl('icon');

		expect(path).to.be(options.imagePath + options.iconUrl);
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

		iconDefault._getIconUrl('icon');

		try {
			// Make sure it used the specified default options instead of the ones from CSS.
			expect(iconDefaultOptions.iconUrl).to.be(newOptions.iconUrl);
			expect(iconDefaultOptions.iconRetinaUrl).to.be(newOptions.iconRetinaUrl);
			expect(iconDefaultOptions.iconSize).to.be(newOptions.iconSize);
			expect(iconDefaultOptions.iconAnchor).to.be(newOptions.iconAnchor);
			expect(iconDefaultOptions.shadowUrl).to.be(newOptions.shadowUrl);
			expect(iconDefaultOptions.shadowRetinaUrl).to.be(newOptions.shadowRetinaUrl);
			expect(iconDefaultOptions.shadowSize).to.be(newOptions.shadowSize);
			expect(iconDefaultOptions.shadowAnchor).to.be(newOptions.shadowAnchor);
		} finally {
			// Reset default options and re-force re-evaluation.
			// Make so in a `finally` block so that it is executed even if the above test expectations fail,
			// and they do not affect next tests. Similar to specifying an `after` block.
			_deleteIconOptions(L.Icon.Default.prototype.options, newOptions);
		}

		function _deleteIconOptions(iconOptions, keysObj) {
			for (var key in keysObj) {
				delete iconOptions[key];
			}
		}
	});

	it("fallsback to cursor CSS rule in case background-image is empty (for FF high contrast option)", function () {

		var className = 'leaflet-default-icon-icon';
		var el = L.DomUtil.create('div',  className, document.body);
		var previousBkgImage = L.DomUtil.getStyle(el, 'background-image');
		var previousCursor = L.DomUtil.getStyle(el, 'cursor');
		var newCursorFilename = 'dummy-cursor-icon.png';
		var newCursorUrl = 'dummy/path/to/' + newCursorFilename;

		// As specified in: https://github.com/Leaflet/Leaflet/blob/v1.2.0/spec/after.js#L1
		// Caution: in case of error, the printed path will be proxied as specified in:
		// https://github.com/Leaflet/Leaflet/blob/v1.2.0/spec/karma.conf.js#L42
		var expectedImagePath = '/base/dist/images/';

		try {
			expect(L.DomUtil.getStyle(el, 'background-image')).to.be.ok();

			// Modify the CSS rules.
			addCSSRule(document.styleSheets[0], '.' + className, 'background: none');
			// This will print a 404 warning unfortunately…
			addCSSRule(document.styleSheets[0], '.' + className, 'cursor: url(' + newCursorUrl  + '), auto');

			// Make sure the new CSS rule is applied.
			expect(L.DomUtil.getStyle(el, 'background-image')).to.equal('none');
			var newCursorRule = L.DomUtil.getStyle(el, 'cursor');
			expect(new RegExp(newCursorUrl).test(newCursorRule)).to.be.ok();

			// Re-instantiate a new Default Icon, so that its options will be evaluated just now.
			var iconDefault = new L.Icon.Default();

			var path = iconDefault._getIconUrl('icon');
			expect(iconDefault.options.iconUrl).to.be(newCursorFilename);
			expect(path).to.be(expectedImagePath + newCursorFilename);

		} finally {
			// Reset the CSS rules.
			// Make so in a `finally` block so that it is executed even if the above test expectations fail,
			// and they do not affect next tests. Similar to specifying an `after` block.
			addCSSRule(document.styleSheets[0], '.' + className, 'background: ' + previousBkgImage);
			addCSSRule(document.styleSheets[0], '.' + className, 'cursor: ' + previousCursor);
		}


		function addCSSRule(sheet, selector, rules, index) {
			if (sheet.insertRule) {
				// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
				if (typeof index !== 'number') {
					index = sheet.cssRules.length;
				}
				sheet.insertRule(selector + '{' + rules + '}', index);
			} else if (sheet.addRule) {
				sheet.addRule(selector, rules, index);
			} else {
				console.log('cannot add CSS rule');
			}
		}
	});

});
