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
			map.setView(new L.LatLng(55.8, 37.6), 6);

			overlay = L.imageOverlay(blankUrl, [[40.712216, -74.22655], [40.773941, -74.12544]], {
				errorOverlayUrl: errorUrl
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
				var loadraised = false;
				overlay.once('load', function () { loadraised = true; });
				raiseImageEvent('load');
				expect(loadraised).to.be(true);
			});
		});

		describe('when load fails', function () {
			it('should raise the error event', function () {
				var errorRaised = false;
				overlay.once('error', function () { errorRaised = true; });
				raiseImageEvent('error');
				expect(errorRaised).to.be(true);
			});
			it('should change the image to errorOverlayUrl', function () {
				raiseImageEvent('error');
				expect(overlay._url).to.be(errorUrl);
				expect(overlay._image.src).to.be(errorUrl);
			});
		});
	});
});
