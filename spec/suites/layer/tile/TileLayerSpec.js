describe('TileLayer', function () {
	var div, map;

	// Placekitten via https://placekitten.com/attribution.html
	// Image licensed under CC-by-sa by http://flickr.com/photos/lachlanrogers/

	var placeKitten = "data:image/jpeg;base64," +
	"/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBF" +
	"RyB2NjIpLCBxdWFsaXR5ID0gNjUK/9sAQwALCAgKCAcLCgkKDQwLDREcEhEPDxEiGRoUHCkkKyooJCcn" +
	"LTJANy0wPTAnJzhMOT1DRUhJSCs2T1VORlRAR0hF/9sAQwEMDQ0RDxEhEhIhRS4nLkVFRUVFRUVFRUVF" +
	"RUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVF/8AAEQgBAAEAAwEiAAIRAQMRAf/E" +
	"AB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUS" +
	"ITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RV" +
	"VldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TF" +
	"xsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgME" +
	"BQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1Lw" +
	"FWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKD" +
	"hIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp" +
	"6vLz9PX29/j5+v/aAAwDAQACEQMRAD8Azy+KN+aqtNzUkTZrjubkjkiozJxUzrlc1mzy7DimIWdg2azZ" +
	"sBvrU7T56mq0jZNUkFyeBAw680+VABUUMgFOkfmgREo2tkVdhbcKrLg9atwACkwQkiEjFVnjKng8VoED" +
	"FRFVPWkmMroxxg0mwdatCEEcU5IcnBouBU3Ljmqssm1uDWjcW3B2ms6S3YN81UmhMaXWRfeqM42NkVoN" +
	"Cqr15qhOp5JzVxeomRjL0ONnJpInCHnpT52DAGr6kkYfkGponquFyM1LEOpNNgXI5AvXrTZJMt1qANk+" +
	"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" +
	"qQzPJJgDeASMHuOx+lAH/9k=";

	beforeEach(function () {
		div = document.createElement('div');
		div.style.width = '800px';
		div.style.height = '600px';
		div.style.visibility = 'hidden';
		document.body.appendChild(div);
		map = L.map(div);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(div);
	});

	function kittenLayerFactory(options) {
		return L.tileLayer(placeKitten, options || {});
	}

	function eachImg(layer, callback) {
		var imgtags = layer._container.children[0].children;
		for (var i in imgtags) {
			if (imgtags[i].tagName === 'IMG') {
				callback(imgtags[i]);
			}
		}
	}

	describe("number of kittens loaded", function () {
		var clock, kittenLayer, counts;

		// animationFrame helper, just runs requestAnimFrame() a given number of times
		function runFrames(n) {
			return _runFrames(n)();
		}

		function _runFrames(n) {
			if (n) {
				return function () {
					clock.tick(40); // 40msec/frame ~= 25fps
					map.fire('_frame');
					L.Util.requestAnimFrame(_runFrames(n - 1));
				};
			} else {
				return L.Util.falseFn;
			}
		}

		beforeEach(function () {
			clock = sinon.useFakeTimers();

			kittenLayer = kittenLayerFactory({keepBuffer: 0});

			counts = {
				tileload: 0,
				tileerror: 0,
				tileloadstart: 0,
				tileunload: 0
			};

			kittenLayer.on('tileload tileunload tileerror tileloadstart', function (ev) {
				// console.log(ev.type);
				counts[ev.type]++;
			});
			// grid.on('tileunload', function (ev) {
			// 	console.log(ev.type, ev.coords, counts);
			// });

			map.options.fadeAnimation = false;
			map.options.zoomAnimation = false;
		});

		afterEach(function () {
			clock.restore();
			kittenLayer.off();
			kittenLayer = undefined;
			counts = undefined;
		});

		it("Loads 8 kittens zoom 1", function (done) {
			kittenLayer.on('load', function () {
				expect(counts.tileloadstart).to.be(8);
				expect(counts.tileload).to.be(8);
				expect(counts.tileunload).to.be(0);
				expect(kittenLayer._container.querySelectorAll('img').length).to.be(8);
				done();
			});

			map.addLayer(kittenLayer).setView([0, 0], 1);
			clock.tick(250);
		});

		// NOTE: This test has different behaviour in PhantomJS and graphical
		// browsers due to CSS animations!
		it.skipIfNo3d("Loads 290, unloads 275 kittens on MAD-TRD flyTo()", function (done) {
			this.timeout(10000); // This test takes longer than usual due to frames

			var mad = [40.40, -3.7], trd = [63.41, 10.41];

			kittenLayer.on('load', function () {
				expect(counts.tileloadstart).to.be(12);
				expect(counts.tileload).to.be(12);
				expect(counts.tileunload).to.be(0);
				kittenLayer.off('load');

				map.on('zoomend', function () {
					expect(counts.tileloadstart).to.be(290);
					expect(counts.tileunload).to.be(275);

					// image tiles take time, so then might not be fully loaded yet.
					expect(counts.tileload).to.be.lessThan(counts.tileloadstart + 1);
					expect(counts.tileload).to.be.greaterThan(counts.tileunload);
					expect(kittenLayer._container.querySelectorAll('img').length).to.be(15);
					done();
				});

				map.flyTo(trd, 12, {animate: true});

				// map.on('_frame', function () {
				// 	console.log('frame', counts);
				// });

				runFrames(500);
			});

			map.addLayer(kittenLayer).setView(mad, 12);
			clock.tick(250);
		});

	});

	describe('url template', function () {
		beforeEach(function () {
			div.style.width = '400px';
			div.style.height = '400px';
			map.setView([0, 0], 2);
		});

		it('replaces {y} with y coordinate', function () {
			var layer = L.tileLayer('http://example.com/{z}/{y}/{x}.png').addTo(map);

			var urls = [
				'http://example.com/2/1/1.png',
				'http://example.com/2/1/2.png',
				'http://example.com/2/2/1.png',
				'http://example.com/2/2/2.png'
			];

			var i = 0;
			eachImg(layer, function (img) {
				expect(img.src).to.eql(urls[i]);
				i++;
			});
		});

		it('replaces {-y} with inverse y coordinate', function () {
			var layer = L.tileLayer('http://example.com/{z}/{-y}/{x}.png').addTo(map);
			var urls = [
				'http://example.com/2/2/1.png',
				'http://example.com/2/2/2.png',
				'http://example.com/2/1/1.png',
				'http://example.com/2/1/2.png'
			];
			var i = 0;
			eachImg(layer, function (img) {
				expect(img.src).to.eql(urls[i]);
				i++;
			});
		});

		it('Does not replace {-y} on map with infinite CRS', function () {
			var simplediv = document.createElement('div');
			simplediv.style.width = '400px';
			simplediv.style.height = '400px';
			simplediv.style.visibility = 'hidden';

			document.body.appendChild(simplediv);
			var simpleMap = L.map(simplediv, {
				crs: L.CRS.Simple
			}).setView([0, 0], 5);
			var layer = L.tileLayer('http://example.com/{z}/{-y}/{x}.png');

			expect(function () {
				layer.addTo(simpleMap);
			}).to.throwError('No value provided for variable {-y}');

			simpleMap.remove();
			document.body.removeChild(simplediv);
		});

		it('replaces {s} with [abc] by default', function () {
			var layer = L.tileLayer('http://{s}.example.com/{z}/{-y}/{x}.png').addTo(map);

			eachImg(layer, function (img) {
				expect(['a', 'b', 'c'].indexOf(img.src[7]) >= 0).to.eql(true);
			});
		});

		it('replaces {s} with specified prefixes', function () {
			var layer = L.tileLayer('http://{s}.example.com/{z}/{-y}/{x}.png', {
				subdomains: 'qrs'
			}).addTo(map);

			eachImg(layer, function (img) {
				expect(['q', 'r', 's'].indexOf(img.src[7]) >= 0).to.eql(true);
			});
		});

		it('uses zoomOffset option', function () {
			// Map view is set at zoom 2 in beforeEach.
			var layer = L.tileLayer('http://example.com/{z}/{y}/{x}.png', {
				zoomOffset: 1 // => zoom 2 + zoomOffset 1 => z 3 in URL.
			}).addTo(map);

			var urls = [
				'http://example.com/3/1/1.png',
				'http://example.com/3/1/2.png',
				'http://example.com/3/2/1.png',
				'http://example.com/3/2/2.png'
			];

			var i = 0;
			eachImg(layer, function (img) {
				expect(img.src).to.eql(urls[i]);
				i++;
			});
		});

		it('uses negative zoomOffset option', function () {
			// Map view is set at zoom 2 in beforeEach.
			var layer = L.tileLayer('http://example.com/{z}/{y}/{x}.png', {
				zoomOffset: -3 // => zoom 2 + zoomOffset -3 => z -1 in URL.
			}).addTo(map);

			var urls = [
				'http://example.com/-1/1/1.png',
				'http://example.com/-1/1/2.png',
				'http://example.com/-1/2/1.png',
				'http://example.com/-1/2/2.png'
			];

			var i = 0;
			eachImg(layer, function (img) {
				expect(img.src).to.eql(urls[i]);
				i++;
			});
		});

	});

	var _describe = 'crossOrigin' in L.DomUtil.create('img') ? describe : describe.skip; // skip in IE<11
	_describe('crossOrigin option', function () {
		beforeEach(function () {
			map.setView([0, 0], 2);
		});

		// https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
		testCrossOriginValue(undefined, null); // Falsy value (other than empty string '') => no attribute set.
		testCrossOriginValue(true, '');
		testCrossOriginValue('', '');
		testCrossOriginValue('anonymous', 'anonymous');
		testCrossOriginValue('use-credentials', 'use-credentials');

		function testCrossOriginValue(crossOrigin, expectedValue) {
			it('uses crossOrigin value ' + crossOrigin, function () {
				var layer = L.tileLayer('http://example.com/{z}/{y}/{x}.png', {
					crossOrigin: crossOrigin
				}).addTo(map);

				eachImg(layer, function (img) {
					expect(img.getAttribute('crossorigin')).to.be(expectedValue);
				});
			});
		}
	});

	describe('#setUrl', function () {
		it('fires only one load event', function (done) {
			var layer = L.tileLayer(placeKitten).addTo(map);
			var counts = {
				load: 0,
				tileload: 0
			};
			map.setView([0, 0], 1);

			layer.on('tileload load', function (e) {
				counts[e.type]++;
			});

			layer.setUrl(placeKitten);

			setTimeout(function () {
				expect(counts.load).to.equal(1);
				expect(counts.tileload).to.equal(8);
				done();
			}, 250);
		});
	});
});
