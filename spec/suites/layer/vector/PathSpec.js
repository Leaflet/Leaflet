describe("Path", function() {
	var map;

	beforeEach(function () {
		map = L.map(document.createElement('div')).setView([0, 0], 0);
	});

	it("propagates events from the container", function() {
		var events = ['mousedown', 'mouseup', 'mouseover', 'mouseout',
		              'mousemove', 'dblclick'];
		for (var i = 0; i < events.length; i++) {
			var path = new L.Path().addTo(map),
			    spy = sinon.spy();
			path.on(events[i], spy);
			happen[events[i]](path._container);
			expect(spy.called).to.be.ok();
		}
	});
});
