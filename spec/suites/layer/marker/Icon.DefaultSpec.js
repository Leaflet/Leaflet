describe("Icon.Default", function () {
	var div, map;

	beforeEach(function () {
		delete L.Icon.Default.imagePath;
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

	it("icon has src", function () {
		var img = map.getPane('markerPane').querySelector('img');
		expect(img.src).to.match(/images\/marker-icon(-2x)?\.png$/);
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

	describe("custom CSS URL", function () {
		beforeEach(function () {
			delete L.Icon.Default.imagePath;
			var style = document.createElement('style');
			style.innerText = '.leaflet-default-icon-path { background-image: url(spec:xxx/marker-icon.png); }';
			document.head.appendChild(style);
			div = document.createElement('div');
			div.style.height = '100px';
			document.body.appendChild(div);
			map = L.map(div).setView([0, 0], 0);
			L.marker([0, 0]).addTo(map);
		});
		it("icon has custom src", function () {
			var img = map.getPane('markerPane').querySelector('img');
			expect(img.src).to.match(/^spec:xxx\/marker-icon(-2x)?\.png$/);
		});
	});

});
