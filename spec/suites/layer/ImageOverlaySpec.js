describe("L.ImageOverlay", function () {

	var div;

	beforeEach(function () {
		div = document.createElement('div');
		div.style.width = '800px';
		div.style.height = '600px';
		div.style.visibility = 'hidden';

		document.body.appendChild(div);
	});

	afterEach(function () {
		document.body.removeChild(div);
	});

	it('can be added and removed', function () {
		var map = L.map(div).setView([0, 0], 1),
		    image = L.imageOverlay(L.Util.emptyImageUrl, [[1, -2], [2, -1]]).addTo(map);

		expect(div.getElementsByTagName('img').length).to.equal(1);

		map.removeLayer(image);

		expect(div.getElementsByTagName('img').length).to.equal(0);
	});

	it('is hidden when far away', function () {
		var map = L.map(div).setView([0, 0], 16),
		    image = L.imageOverlay(L.Util.emptyImageUrl, [[1, 1], [2, 2]]).addTo(map),
		    img = div.getElementsByTagName('img')[0];

		expect(img.style.display).to.equal('none');

		map.setView([1, 1]);
		expect(img.style.display).to.not.equal('none');

		map.setView([-2, -2]);
		expect(img.style.display).to.equal('none');
	});
});
