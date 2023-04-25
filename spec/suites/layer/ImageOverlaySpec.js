import {Map, imageOverlay, LatLngBounds} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('ImageOverlay', () => {
	let container, map;
	const imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);
		map.setView([55.8, 37.6], 6);	// view needs to be set so when layer is added it is initilized
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#setStyle', () => {
		it('sets opacity', () => {
			const overlay = imageOverlay().setStyle({opacity: 0.5});
			expect(overlay.options.opacity).to.equal(0.5);
		});
	});

	describe('#setBounds', () => {
		it('sets bounds', () => {
			const bounds = new LatLngBounds(
				[14, 12],
				[30, 40]
			);
			const overlay = imageOverlay().setBounds(bounds);
			expect(overlay._bounds).to.equal(bounds);
		});
	});

	describe('_image', () => {
		let overlay;

		// Url for testing errors
		const errorUrl = 'data:image/false;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAT1JREFUOI2dk79qwlAUxr9zcKmxbyAWh0IIDqJrcchkX6ODrn2TDAWRPEkyKKVzBxHJkKFoySP0mlLhnA5NbIgmpf6my73n+853/xFKRLY9UJEpAy6Am2x6q8xLYZ73omhVrKd88DocNpvGPBHwUDYtIiL+9X7/2EmS9GiQiUMC7urER1RfLGPGnSRJGQCyzidiy/Nged6pAdHoo9XyAIAj2x78FfscBEw3jtNnFZn+V5zDIhPOTvsiFHAZv1d1SYIuXyrOaQDYArg9t3gIw1qxML81lHlJFQZfQVBrwKoLFuZ5VUHlO8ggVZ97UbQSEf9cwSEMq7ehOrPjeE0A8N5uXxnLCkA0qs2cIcBzM03vu7vdJwNAJ0lSy5hxVZJy51wMFH5jzsZx+iwyUcBlkS7wc9qsuiBV347jdbH+G/fth7AzHdiJAAAAAElFTkSuQmCC';
		const blankUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

		// Create overlay for each test
		beforeEach(() => {
			overlay = imageOverlay(blankUrl, imageBounds, {
				errorOverlayUrl: errorUrl,
				className: 'my-custom-image-class'
			});
			map.addLayer(overlay);

			const bounds = new LatLngBounds(
				[14, 12],
				[30, 40]
			);
			overlay.setBounds(bounds);
		});

		// Clean up after each test run
		afterEach(() => {
			map.removeLayer(overlay);
			overlay = null;
		});

		function raiseImageEvent(event) {
			const domEvent = document.createEvent('Event');
			domEvent.initEvent(event, false, false);
			overlay._image.dispatchEvent(domEvent);
		}

		describe('when loaded', () => {
			it('should raise the load event', () => {
				const loadRaised = sinon.spy();
				overlay.once('load', loadRaised);
				raiseImageEvent('load');
				expect(loadRaised.called).to.be.true;
			});
		});

		describe('when load fails', () => {
			it('should raise the error event', () => {
				const errorRaised  = sinon.spy();
				overlay.once('error', errorRaised);
				raiseImageEvent('error');
				expect(errorRaised.called).to.be.true;
			});

			it('should change the image to errorOverlayUrl', () => {
				raiseImageEvent('error');
				expect(overlay._url).to.equal(errorUrl);
				expect(overlay._image.src).to.equal(errorUrl);
			});
		});

		describe('className', () => {
			it('should set image\'s class', () => {
				expect(overlay._image.classList.contains('my-custom-image-class')).to.be.true;
			});
		});
	});

	describe('#setZIndex', () => {
		it('sets the z-index of the image', () => {
			const overlay = imageOverlay();
			overlay.setZIndex(10);
			expect(overlay.options.zIndex).to.equal(10);
		});

		it('should update the z-index of the image if it has allready been added to the map', () => {
			const overlay = imageOverlay('', imageBounds);
			overlay.addTo(map);
			expect(overlay._image.style.zIndex).to.eql('1'); // Number type in IE

			overlay.setZIndex('10');
			expect(overlay._image.style.zIndex).to.eql('10'); // Number type in IE
		});

		it('should set the z-index of the image when it is added to the map', () => {
			const overlay = imageOverlay('', imageBounds);
			overlay.setZIndex('10');
			overlay.addTo(map);
			expect(overlay._image.style.zIndex).to.eql('10'); // Number type in IE
		});

		it('should use the z-index specified in options', () => {
			const overlay = imageOverlay('', imageBounds, {zIndex: 20});
			overlay.addTo(map);
			expect(overlay._image.style.zIndex).to.eql('20'); // Number type in IE
		});

		it('should be fluent', () => {
			const overlay = imageOverlay();
			expect(overlay.setZIndex()).to.equal(overlay);
		});
	});

	describe('#getCenter', () => {
		it('should return the correct center', () => {
			const overlay = imageOverlay('', imageBounds).addTo(map);
			expect(overlay.getCenter()).to.be.nearLatLng([40.743078, -74.175995]);
		});
		it('should open popup at the center', () => {
			const overlay = imageOverlay('', imageBounds).addTo(map);
			overlay.bindPopup('Center').openPopup();
			expect(overlay.getPopup().getLatLng()).to.be.nearLatLng([40.743078, -74.175995]);
		});
	});

	describe('crossOrigin option', () => {
		let overlay;
		const blankUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

		// https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
		testCrossOriginValue(undefined, null); // Falsy value (other than empty string '') => no attribute set.
		testCrossOriginValue(true, '');
		testCrossOriginValue('', '');
		testCrossOriginValue('anonymous', 'anonymous');
		testCrossOriginValue('use-credentials', 'use-credentials');

		function testCrossOriginValue(crossOrigin, expectedValue) {
			it(`uses crossOrigin option value ${crossOrigin}`, () => {
				overlay = imageOverlay(blankUrl, imageBounds, {
					crossOrigin
				});
				map.addLayer(overlay);

				expect(overlay._image.getAttribute('crossorigin')).to.equal(expectedValue);
			});
		}
	});
});
