describe('Icon.Default', () => {
	let container, map;

	beforeEach(() => {
		container = container = createContainer();
		map = L.map(container);

		map.setView([0, 0], 0);
		L.marker([0, 0]).addTo(map);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('detect icon images path', () => {
		const origPath = L.Icon.Default.imagePath; // set in after.js
		expect(origPath).to.be.ok();
		delete L.Icon.Default.imagePath;
		const marker = L.marker([0, 0]);

		expect(L.Icon.Default.imagePath).to.not.be.ok();
		marker.addTo(map);

		expect(L.Icon.Default.imagePath).to.equal(location.origin + origPath);

		const stripUrl = L.Icon.Default.prototype._stripUrl;
		const properPath = 'http://localhost:8000/base/dist/images/';
		[ // valid
			'url("http://localhost:8000/base/dist/images/marker-icon.png")',  // Firefox
			'url(\'http://localhost:8000/base/dist/images/marker-icon.png\')',
			'url(http://localhost:8000/base/dist/images/marker-icon.png)',    // IE, Edge
		].map(stripUrl).forEach((str) => { expect(str).to.be(properPath); });

		[ // invalid
			'url("http://localhost:8000/base/dist/images/marker-icon.png?2x)"',
			'url("data:image/png;base64,iVBORw...")',                         // inline image (bundlers)
		].map(stripUrl).forEach((str) => { expect(str).not.to.be.ok(); });
	});

	it('icon measures 25x41px', () => {
		const img = map.getPane('markerPane').querySelector('img');
		expect(img.clientHeight).to.be(41);
		expect(img.clientWidth).to.be(25);
	});

	it('shadow measures 41x41px', () => {
		const img = map.getPane('shadowPane').querySelector('img');
		expect(img.clientHeight).to.be(41);
		expect(img.clientWidth).to.be(41);
	});
});
