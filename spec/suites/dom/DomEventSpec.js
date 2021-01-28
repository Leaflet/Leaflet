describe('DomEvent', function () {
	var el, listener;

	beforeEach(function () {
		el = document.createElement('div');
		document.body.appendChild(el);
		listener = sinon.spy();
	});

	afterEach(function () {
		document.body.removeChild(el);
	});

	describe('#on (addListener)', function () {
		it('adds a listener and calls it on event', function () {
			var listener2 = sinon.spy();
			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.on(el, 'click', listener2);

			happen.click(el);

			expect(listener.called).to.be.ok();
			expect(listener2.called).to.be.ok();
		});

		it('binds "this" to the given context', function () {
			var obj = {foo: 'bar'};
			L.DomEvent.on(el, 'click', listener, obj);

			happen.click(el);

			expect(listener.calledOn(obj)).to.be.ok();
		});

		it('passes an event object to the listener', function () {
			L.DomEvent.on(el, 'click', listener);

			happen.click(el);

			expect(listener.lastCall.args[0].type).to.eql('click');
		});

		it('is chainable', function () {
			var res = L.DomEvent.on(el, 'click', function () {});

			expect(res).to.be(L.DomEvent);
		});

		it('is aliased to addListener ', function () {
			expect(L.DomEvent.on).to.be(L.DomEvent.addListener);
		});
	});

	describe('#off (removeListener)', function () {
		it('removes a previously added listener', function () {
			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.off(el, 'click', listener);

			happen.click(el);

			expect(listener.notCalled).to.be.ok();
		});

		it('is chainable', function () {
			var res = L.DomEvent.off(el, 'click', function () {});

			expect(res).to.be(L.DomEvent);
		});

		it('is aliased to removeListener ', function () {
			expect(L.DomEvent.off).to.be(L.DomEvent.removeListener);
		});
	});

	describe('#stopPropagation', function () {
		it('stops propagation of the given event', function () {
			var child = document.createElement('div');
			el.appendChild(child);
			L.DomEvent.on(child, 'click', L.DomEvent.stopPropagation);
			L.DomEvent.on(el, 'click', listener);

			happen.click(child);

			expect(listener.notCalled).to.be.ok();
		});
	});

	describe('#preventDefault', function () {
		it('prevents the default action of event', function () {
			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.on(el, 'click', L.DomEvent.preventDefault);

			happen.click(el);

			var e = listener.lastCall.args[0];
			if ('defaultPrevented' in e) {
				expect(e.defaultPrevented).to.be.ok();
			} else {
				expect(e.returnValue).not.to.be.ok();
			}
		});
	});
});
