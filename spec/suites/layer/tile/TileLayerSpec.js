
describe('TileLayer', function () {
	var tileUrl = '',
		map;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
	});

	describe("'loading' event", function() {
		var tileUrl1 = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
			tileUrl2 = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

		// Add map div to DOM. The map panning tests do not work reliably unless
		// the Leaflet map is properly styled and part of the DOM
		var mapDiv = document.createElement('div');
		mapDiv.style.height = '256px';
		mapDiv.style.width = '256px';
		document.body.appendChild(mapDiv);

		this.afterAll(function() {
			document.body.removeChild(mapDiv);
		});

		// Set the map zoom high enough that panning by 256 pixels necessarily loads more tiles
		var myMap = L.map(mapDiv).setView([0, 0], 13);

		describe("after a tilelayer has been initialized with an empty string", function() {
			var layer = L.tileLayer('');
			var updateInterval = layer.options.updateInterval + 500;

			var loadingSpy;
			beforeEach(function() {
				loadingSpy = sinon.spy();
				layer.on('loading', function() { loadingSpy(); });
			});
			afterEach(function() {
				layer.off('loading');
			});

			it("is fired when the tilelayer is added to the map", function() {
				layer.addTo(myMap);
				expect(loadingSpy.calledOnce).to.be.ok();
			});

			it("is fired again when the tilelayer has its url set to a real tile url", function(done) {
				layer.setUrl(tileUrl2);

				setTimeout(function() {
					expect(loadingSpy.calledOnce).to.be.ok();
					done();
				}, updateInterval);
			});

			it("is fired again when the map is panned enough to load more tiles", function(done) {
				myMap.panBy([256,256]);

				setTimeout(function() {
					expect(loadingSpy.calledOnce).to.be.ok();
					done();
				}, updateInterval);
			});
		});

		describe("after a tilelayer has been initialized with a real tile url", function() {
			var layer = L.tileLayer(tileUrl1);
			var updateInterval = layer.options.updateInterval + 500;

			var loadingSpy;
			beforeEach(function() {
				loadingSpy = sinon.spy();
				layer.on('loading', function() { loadingSpy(); });
			});
			afterEach(function() {
				layer.off('loading');
			});

			it("is fired when the tilelayer is added to the map", function() {
				layer.addTo(myMap);
				expect(loadingSpy.calledOnce).to.be.ok();
			});

			it("is fired again when the tilelayer has its url set to a real tile url", function(done) {
				layer.setUrl(tileUrl2);

				setTimeout(function() {
					expect(loadingSpy.calledOnce).to.be.ok();
					done();
				}, updateInterval);
			});

			it("is fired again when the map is panned enough to load more tiles", function(done) {
				myMap.panBy([256,256]);

				setTimeout(function() {
					expect(loadingSpy.calledOnce).to.be.ok();
					done();
				}, updateInterval);
			});
		});
	});

});
