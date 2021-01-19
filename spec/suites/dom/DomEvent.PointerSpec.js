describe('DomEvent.Pointer', function () {
	var el, listener;

	beforeEach(function () {
		el = document.createElement('div');
		document.body.appendChild(el);
		listener = sinon.spy();
		L.DomEvent.on(el, 'touchstart', listener);
	});

	afterEach(function () {
		happen.once(el, {type: 'pointercancel'}); // to reset prosphetic-hand
		happen.once(el, {type: 'touchcancel'});   //
		document.body.removeChild(el);
	});

	var skip = describe.skip;

	(L.Browser.pointer ? describe : skip)('#Simulates touch based on pointer events', function () {
		it('adds a listener and calls it on pointer event', function () {
			happen.once(el, {type: 'pointerdown'});
			 expect(listener.called).to.be.ok();
		});

		it('does not call removed listener', function () {
			L.DomEvent.off(el, 'touchstart', listener);

			happen.once(el, {type: 'pointerdown'});
			expect(listener.notCalled).to.be.ok();
		});

		it('ignores native touch events', function () {
			happen.once(el, {type: 'touchstart'});
			expect(listener.notCalled).to.be.ok();
		});
	});

	(L.Browser.pointer ? skip : describe)('#Does not intrude if pointer events are not available', function () {
		it('adds a listener and calls it on touch event', function () {
			happen.once(el, {type: 'touchstart'});
			expect(listener.called).to.be.ok();
		});

		it('ignores pointer events', function () {
			happen.once(el, {type: 'pointerdown'});
			expect(listener.notCalled).to.be.ok();
		});
	});

});
