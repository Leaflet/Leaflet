describe.only('DomEvent.Pointer', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '-10000px';
		document.body.appendChild(el);
	});

	afterEach(function () {
		document.body.removeChild(el);
	});

	var skip = describe.skip;

	(L.Browser.pointer ? describe : skip)('#Simulates touch based on pointer events', function () {
		it('adds a listener and calls it on pointer event', function () {
			var listener = sinon.spy();
			L.DomEvent.addListener(el, 'touchstart', listener);

			happen.once(el, {type: 'pointerdown'});
			expect(listener.called).to.be.ok();
		});

		it('does not call removed listener', function () {
			var listener = sinon.spy();
			L.DomEvent.addListener(el, 'touchstart', listener);
			L.DomEvent.removeListener(el, 'touchstart', listener);

			happen.once(el, {type: 'pointerdown'});
			expect(listener.called).not.to.be.ok();
		});

		it('ignores native touch events', function () {
			var listener = sinon.spy();
			L.DomEvent.addListener(el, 'touchstart', listener);

			happen.once(el, {type: 'touchstart'});
			expect(listener.called).not.to.be.ok();
		});
	});

	(L.Browser.pointer ? skip : describe)('#Does not intrude if pointer events are not available', function () {
		it('adds a listener and calls it on touch event', function () {
			var listener = sinon.spy();
			L.DomEvent.addListener(el, 'touchstart', listener);

			happen.once(el, {type: 'touchstart'});
			expect(listener.called).to.be.ok();
		});

		it('ignores pointer events', function () {
			var listener = sinon.spy();
			L.DomEvent.addListener(el, 'touchstart', listener);

			happen.once(el, {type: 'pointerdown'});
			expect(listener.called).not.to.be.ok();
		});
	});
});
