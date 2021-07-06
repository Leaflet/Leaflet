describe("Marker.Drag", function () {
	var map,
	    div;

	beforeEach(function () {
		div = document.createElement('div');
		div.style.width = div.style.height = '600px';
		div.style.top = div.style.left = 0;
		div.style.position = 'absolute';
		document.body.appendChild(div);

		map = L.map(div).setView([0, 0], 0);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(div);
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

					expect(map.getCenter()).to.eql({lat: 0, lng: 0});
					expect(marker.getLatLng().equals({ // small margin of error allowed
						lat: -40.979898069620134,
						lng: 360
					})).to.be.ok();

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
				div.style.webkitTransformOrigin = 'top left';
				div.style.webkitTransform = 'scale(' + scale.x + ', ' + scale.y + ')';
			});

			it("drags a marker with mouse, compensating for CSS scale", function (done) {
				var marker = new MyMarker([0, 0], {draggable: true}).addTo(map);

				var start = L.point(300, 280);
				var offset = L.point(256, 32);
				var finish = start.add(offset);

				var hand = new Hand({
					timing: 'fastframe',
					onStop: function () {
						expect(marker.getOffset()).to.eql(offset);

						expect(map.getCenter()).to.eql({lat: 0, lng: 0});
						expect(marker.getLatLng().equals({ // small margin of error allowed
							lat: -40.979898069620134,
							lng: 360
						})).to.be.ok();

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
					expect(map.getCenter().equals({lat: 0, lng: 11.25})).to.be.ok();
					expect(marker.getLatLng().equals({
						lat: -40.979898069620134,
						lng: 419.0625
					})).to.be.ok();

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.moveTo(start.x, start.y, 0)
				.down().moveBy(5, 0, 20).moveTo(finish.x, finish.y, 1000).up();
		});
	});
});
