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
		document.body.removeChild(div);
	});

	describe("drag", function () {
		it("drags a marker with mouse", function (done) {
			var marker = new L.Marker([0, 0], {
				draggable: true
			});
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
					expect(markerPos.lng).to.be.within(340, 380);

					done();
				}
			});
			var toucher = hand.growFinger('mouse');

			toucher.wait(100).moveTo(300, 280, 0)
				.down().moveBy(5, 0, 20).moveBy(256, 32, 1000).wait(100).up().wait(100);
		});

		describe("in CSS scaled container", function () {
			var scaleX = 2;
			var scaleY = 1.5;

			beforeEach(function () {
				div.style.webkitTransformOrigin = 'top left';
				div.style.webkitTransform = 'scale(' + scaleX + ', ' + scaleY + ')';
			});

			afterEach(function () {
				div.style.webkitTransformOrigin = '';
				div.style.webkitTransform = '';
			});

			it("drags a marker with mouse, compensating for CSS scale", function (done) {
				var marker = new L.Marker([0, 0], {
					draggable: true
				});
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
						expect(markerPos.lng).to.be.within(340, 380);

						done();
					}
				});
				var toucher = hand.growFinger('mouse');

				toucher.wait(100).moveTo(scaleX * 300, scaleY * 280, 0)
					.down().moveBy(5, 0, 20).moveBy(scaleX * 256, scaleY * 32, 1000).wait(100).up().wait(100);
			});
		});

		it("pans map when autoPan is enabled", function (done) {
			var marker = new L.Marker([0, 0], {
				draggable: true,
				autoPan: true
			});
			map.addLayer(marker);

			var hand = new Hand({
				timing: 'fastframe',
				onStop: function () {
					var center = map.getCenter();
					expect(center.lat).to.be(0);
					expect(center.lng).to.be.within(10, 30);

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
