describe('ImageOverlay', function () {
	describe('#setStyle', function () {
		it('sets opacity', function () {
			var overlay = L.imageOverlay().setStyle({opacity: 0.5});
			expect(overlay.options.opacity).to.equal(0.5);
		});
	});
	describe('#setBounds', function () {
		it('sets bounds', function () {
			var bounds = new L.LatLngBounds(
				new L.LatLng(14, 12),
				new L.LatLng(30, 40));
			var overlay = L.imageOverlay().setBounds(bounds);
			expect(overlay._bounds).to.equal(bounds);
		});
	});
	describe("_image", function () {
		var c, map, overlay;
		// Url for testing errors
		var errorUrl = 'data:image/false;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAT1JREFUOI2dk79qwlAUxr9zcKmxbyAWh0IIDqJrcchkX6ODrn2TDAWRPEkyKKVzBxHJkKFoySP0mlLhnA5NbIgmpf6my73n+853/xFKRLY9UJEpAy6Am2x6q8xLYZ73omhVrKd88DocNpvGPBHwUDYtIiL+9X7/2EmS9GiQiUMC7urER1RfLGPGnSRJGQCyzidiy/Nged6pAdHoo9XyAIAj2x78FfscBEw3jtNnFZn+V5zDIhPOTvsiFHAZv1d1SYIuXyrOaQDYArg9t3gIw1qxML81lHlJFQZfQVBrwKoLFuZ5VUHlO8ggVZ97UbQSEf9cwSEMq7ehOrPjeE0A8N5uXxnLCkA0qs2cIcBzM03vu7vdJwNAJ0lSy5hxVZJy51wMFH5jzsZx+iwyUcBlkS7wc9qsuiBV347jdbH+G/fth7AzHdiJAAAAAElFTkSuQmCC';
		var blankUrl = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

		// Create map and overlay for each test
		beforeEach(function () {
			c = document.createElement('div');
			c.style.width = '400px';
			c.style.height = '400px';
			document.body.appendChild(c);
			map = new L.Map(c);
			map.setView(new L.LatLng(55.8, 37.6), 6);	// view needs to be set so when layer is added it is initilized

			overlay = L.imageOverlay(blankUrl, [[40.712216, -74.22655], [40.773941, -74.12544]], {
				errorOverlayUrl: errorUrl,
				className: 'my-custom-image-class'
			});
			map.addLayer(overlay);

			var bounds = new L.LatLngBounds(
				new L.LatLng(14, 12),
				new L.LatLng(30, 40));
			overlay.setBounds(bounds);
		});

		// Clean up after each test run
		afterEach(function () {
			document.body.removeChild(c);
			map.removeLayer(overlay);
			overlay = null;
			map = null;
		});

		function raiseImageEvent(event) {
			var domEvent = document.createEvent('Event');
			domEvent.initEvent(event);
			overlay._image.dispatchEvent(domEvent);
		}

		describe('when loaded', function () {
			it('should raise the load event', function () {
				var loadRaised = sinon.spy();
				overlay.once('load', loadRaised);
				raiseImageEvent('load');
				expect(loadRaised.called).to.be(true);
			});
		});

		describe('when load fails', function () {
			it('should raise the error event', function () {
				var errorRaised  = sinon.spy();
				overlay.once('error', errorRaised);
				raiseImageEvent('error');
				expect(errorRaised.called).to.be(true);
			});
			it('should change the image to errorOverlayUrl', function () {
				raiseImageEvent('error');
				expect(overlay._url).to.be(errorUrl);
				expect(overlay._image.src).to.be(errorUrl);
			});
		});

		describe('className', function () {
			it('should set image\'s class', function () {
				expect(L.DomUtil.hasClass(overlay._image, 'my-custom-image-class')).to.be(true);
			});
		});
	});

	describe('#setZIndex', function () {

		var div, map;
		var corner1 = L.latLng(40.712, -74.227),
		corner2 = L.latLng(40.774, -74.125),
		bounds = L.latLngBounds(corner1, corner2);

		beforeEach(function () {
			div = document.createElement('div');
			div.style.width = '800px';
			div.style.height = '600px';
			div.style.visibility = 'hidden';

			document.body.appendChild(div);

			map = L.map(div);
			map.setView([0, 0], 1);	// view needs to be set so when layer is added it is initilized
		});

		afterEach(function () {
			document.body.removeChild(div);
		});

		it('sets the z-index of the image', function () {
			var overlay = L.imageOverlay();
			overlay.setZIndex(10);
			expect(overlay.options.zIndex).to.equal(10);
		});

		it('should update the z-index of the image if it has allready been added to the map', function () {
			var overlay = L.imageOverlay('', bounds);
			overlay.addTo(map);
			expect(overlay._image.style.zIndex).to.be('1');

			overlay.setZIndex('10');
			expect(overlay._image.style.zIndex).to.be('10');
		});

		it('should set the z-index of the image when it is added to the map', function () {
			var overlay = L.imageOverlay('', bounds);
			overlay.setZIndex('10');
			overlay.addTo(map);
			expect(overlay._image.style.zIndex).to.be('10');
		});

		it('should use the z-index specified in options', function () {
			var overlay = L.imageOverlay('', bounds, {zIndex: 20});
			overlay.addTo(map);
			expect(overlay._image.style.zIndex).to.be('20');
		});

		it('should be fluent', function () {
			var overlay = L.imageOverlay();
			expect(overlay.setZIndex()).to.equal(overlay);
		});
	});

	// For tests that do not actually need to append the map container to the document.
	// This saves PhantomJS memory.
	describe('_image2', function () {
		var c, map, overlay;
		var blankUrl = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
		var bounds = [[40.712216, -74.22655], [40.773941, -74.12544]];

		// Create map and overlay for each test
		beforeEach(function () {
			c = document.createElement('div');
			c.style.width = '400px';
			c.style.height = '400px';
			map = new L.Map(c);
			map.setView(new L.LatLng(55.8, 37.6), 6);	// view needs to be set so when layer is added it is initialized
		});

		// Clean up after each test run
		afterEach(function () {
			map.removeLayer(overlay);
			overlay = null;
			map = null;
		});

		// https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
		testCrossOriginValue(undefined, null); // Falsy value (other than empty string '') => no attribute set.
		testCrossOriginValue(true, '');
		testCrossOriginValue('', '');
		testCrossOriginValue('anonymous', 'anonymous');
		testCrossOriginValue('use-credentials', 'use-credentials');

		function testCrossOriginValue(crossOrigin, expectedValue) {
			it('uses crossOrigin option value ' + crossOrigin, function () {
				overlay = L.imageOverlay(blankUrl, bounds, {
					crossOrigin: crossOrigin
				});
				map.addLayer(overlay);

				expect(overlay._image.getAttribute('crossorigin')).to.be(expectedValue);
			});
		}
	});
});
