describe("Marker.Drag", function () {
	var map,
	    container;

	beforeEach(function () {
		container = createContainer();
		map = L.map(container);
		container.style.width = '600px';
		container.style.height = '600px';
		map.setView([0, 0], 0);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	var MyMarker = L.Marker.extend({
		_getPosition: function () {
			return L.DomUtil.getPosition(this.dragging._draggable._element);
		},
		getOffset: function () {
			return this._getPosition().subtract(this._initialPos);
		}
	}).addInitHook('on', 'add', function () {
		this._initialPos = this._getPosition();
	});

	describe("drag", function () {
		it("drags a marker with mouse", function (done) {
			var marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

			var start = L.point(300, 280);
			var offset = L.point(256, 32);
			var finish = start.add(offset);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(marker.getOffset()).to.eql(offset);

					expect(map.getCenter()).to.be.nearLatLng([0, 0]);
					expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 360]);

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		describe("in CSS scaled container", function () {
			var scale = L.point(2, 1.5);

			beforeEach(function () {
				container.style.webkitTransformOrigin = 'top left';
				container.style.webkitTransform = 'scale(' + scale.x + ', ' + scale.y + ')';
			});

			(L.Browser.ie ? it.skip : it)("drags a marker with mouse, compensating for CSS scale", function (done) {
				var marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

				var start = L.point(300, 280);
				var offset = L.point(256, 32);
				var finish = start.add(offset);

				var hand = new Hand({
					timing: 'fastframe',
					onStop: function () {
						expect(marker.getOffset()).to.eql(offset);

						expect(map.getCenter()).to.be.nearLatLng([0, 0]);
						expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 360]);

						done();
					}
				});
				var toucher = hand.growFinger('mouse');

				var startScaled = start.scaleBy(scale);
				var finishScaled = finish.scaleBy(scale);
				toucher.wait(0).moveTo(startScaled.x, startScaled.y, 0)
					.down().moveBy(5, 0, 20).moveTo(finishScaled.x, finishScaled.y, 1000).up();
			});
		});

		it("pans map when autoPan is enabled", function (done) {
			var marker = new MyMarker([0, 0], {
				draggable: true,
				autoPan: true
			}).addTo(map);

			var start = L.point(300, 280);
			var offset = L.point(290, 32);
			var finish = start.add(offset);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					expect(marker.getOffset()).to.eql(offset);

					// small margin of error allowed
					expect(map.getCenter()).to.be.nearLatLng([0, 11.25]);
					expect(marker.getLatLng()).to.be.nearLatLng([-40.979898069620134, 419.0625]);

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});

		it("should not exceeds maxBounds if set and autoPan is enabled", function (done) {
			var marker = new L.Marker([0, 0], {
				draggable: true,
				autoPan: true
			});
			map.setMaxBounds(map.getBounds());
			map.addLayer(marker);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					var center = map.getCenter();
					expect(center.lat).to.be(0);
					expect(center.lng).to.be(0);

					var markerPos = marker.getLatLng();
					// Marker drag is very timing sensitive, so we can't check
					// exact values here, just verify that the drag is in the
					// right ballpark
					expect(markerPos.lat).to.be.within(-50, -30);
					expect(markerPos.lng).to.be.within(400, 450);

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.wait(100).moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(290, 32, 1000).wait(100).up().wait(100);
		});
	});
});
