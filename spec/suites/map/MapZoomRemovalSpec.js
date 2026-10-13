describe('removing a map during zoom', function () {
	var LeafletMap = L.Map, GridLayer = L.GridLayer;
	var container, map, clock;

	beforeEach(function () {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {zoomAnimation: true}).setView([0, 0], 11);
		new GridLayer().addTo(map);
		clock = sinon.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'Date']});
	});

	afterEach(function () {
		clock.restore();
		removeMapContainer(map, container);
	});

	it('cancels the completion timer and ignores late transition callbacks', function () {
		var ended = 0;
		var completed = sinon.spy(map, '_onZoomTransitionEnd');
		map.on('zoomend', function () { ended++; });
		map._animateZoom(map.getCenter(), 14, true);
		var removed = map;
		map.remove();
		map = null;
		clock.tick(300);
		expect(completed.callCount).to.equal(0);
		removed._onZoomTransitionEnd();
		expect(ended).to.equal(0);
	});

	it('cancels a zoom scheduled for the next frame', function (done) {
		var started = 0;
		map.on('zoomstart', function () { started++; });
		map.setZoom(14, {animate: true});
		map.remove();
		map = null;
		started = 0;
		L.Util.requestAnimFrame(function () {
			expect(started).to.equal(0);
			done();
		});
	});
});
