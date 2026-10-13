var LeafletMap = L.Map, Marker = L.Marker, DivIcon = L.DivIcon, LatLng = L.LatLng;

describe('view changes during zoom', function () {
	var container, map, clock;

	beforeEach(function () {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {zoomAnimation: true}).setView([0, 0], 13);
		new Marker([0, 0], {icon: new DivIcon()}).addTo(map);
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
	});

	afterEach(function () {
		removeMapContainer(map, container);
		if (clock) { clock.restore(); }
	});

	function startZoom() {
		map._animateZoom(new LatLng(0.0005, 0.0005), 14, true);
	}

	it('applies only the latest center and zoom after the transition', function () {
		startZoom();
		expect(map.setView([0.001, 0.001], 15, {animate: false})).to.equal(map);
		map.setView([0.002, 0.002], 16, {animate: false});
		clock.tick(250);
		expect(map.getZoom()).to.equal(16);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.002, 0.002));
	});

	it('preserves pan options for a center-only change', function () {
		startZoom();
		var started = sinon.spy();
		map.on('movestart', started);
		map.setView([0.001, 0.001], undefined, {pan: {animate: false, noMoveStart: true}});
		clock.tick(250);
		expect(map.getZoom()).to.equal(14);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.001, 0.001));
		expect(started.called).to.equal(false);
	});

	it('can return to the zoom level before the active transition', function () {
		startZoom();
		map.setView([0.001, 0.001], 13, {animate: false});
		clock.tick(250);
		expect(map.getZoom()).to.equal(13);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.001, 0.001));
	});

	['zoomend', 'moveend'].forEach(function (event) {
		it('keeps a newer view requested by a ' + event + ' listener', function () {
			startZoom();
			map.setView([0.001, 0.001], 15, {animate: false});
			map.once(event, function () { map.setView([0.002, 0.002], 16, {animate: false}); });
			clock.tick(250);
			expect(map.getZoom()).to.equal(16);
			expect(map.getCenter()).to.nearLatLng(new LatLng(0.002, 0.002));
		});
	});

	it('discards the waiting view when stopped', function () {
		startZoom();
		map.setView([0.001, 0.001], 15, {animate: false});
		map.stop();
		clock.tick(250);
		expect(map.getZoom()).to.equal(14);
		expect(map.getCenter()).to.nearLatLng(new LatLng(0.0005, 0.0005));
	});

	[false, true].forEach(function (animate) {
		it('handles a request during a real zoom transition with animate=' + animate, function (done) {
			clock.restore();
			clock = null;
			var ended = 0;
			map.once('zoomanim', function () {
				setTimeout(function () {
					expect(map._animatingZoom).to.equal(true);
					map.setView([0.001, 0.001], 15, {animate: animate});
				}, 10);
			});
			map.on('moveend', function () {
				if (++ended !== 2) { return; }
				expect(map.getZoom()).to.equal(15);
				expect(map.getCenter()).to.nearLatLng(new LatLng(0.001, 0.001));
				done();
			});
			map.setView([0.0005, 0.0005], 14, {animate: true});
		});
	});
});
