describe('DomEvent.Pointer', function () {
	var el,
	    listeners = {};

	var pointerEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
	var touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

	beforeEach(function () {
		el = document.createElement('div');
		document.body.appendChild(el);
		touchEvents.forEach(function (type) {
			listeners[type] = sinon.spy();
			L.DomEvent.on(el, type, listeners[type]);
		});
	});

	afterEach(function () {
		happen.once(el, {type: 'pointercancel'}); // to reset prosphetic-hand
		happen.once(el, {type: 'touchcancel'});   //
		document.body.removeChild(el);
	});

	var skip = describe.skip;

	(L.Browser.pointer ? describe : skip)('#Simulates touch based on pointer events', function () {
		it('adds a listener and calls it on pointer event', function () {
			pointerEvents.forEach(function (type) {
				happen.once(el, {type: type});
			});
			touchEvents.forEach(function (type) {
				expect(listeners[type].calledOnce).to.be.ok();
			});
		});

		it('does not call removed listener', function () {
			touchEvents.forEach(function (type) {
				L.DomEvent.off(el, type, listeners[type]);
			});
			pointerEvents.forEach(function (type) {
				happen.once(el, {type: type});
			});
			touchEvents.forEach(function (type) {
				expect(listeners[type].notCalled).to.be.ok();
			});
		});

		it('ignores native touch events', function () {
			touchEvents.forEach(function (type) {
				happen.once(el, {type: type});
			});
			touchEvents.forEach(function (type) {
				expect(listeners[type].notCalled).to.be.ok();
			});
		});
	});

	(L.Browser.pointer ? skip : describe)('#Does not intrude if pointer events are not available', function () {
		it('adds a listener and calls it on touch event', function () {
			touchEvents.forEach(function (type) {
				happen.once(el, {type: type});
			});
			touchEvents.forEach(function (type) {
				expect(listeners[type].calledOnce).to.be.ok();
			});
		});

		it('ignores pointer events', function () {
			pointerEvents.forEach(function (type) {
				happen.once(el, {type: type});
			});
			touchEvents.forEach(function (type) {
				expect(listeners[type].notCalled).to.be.ok();
			});
		});
	});

});
