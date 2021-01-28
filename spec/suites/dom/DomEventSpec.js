describe('DomEvent', function () {
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

	describe('#on (addListener)', function () {
		it('adds a listener and calls it on event', function () {
			var listener1 = sinon.spy(),
			    listener2 = sinon.spy();

			L.DomEvent.on(el, 'click', listener1);
			L.DomEvent.on(el, 'click', listener2);

			happen.click(el);

			expect(listener1.called).to.be.ok();
			expect(listener2.called).to.be.ok();
		});

		it('binds "this" to the given context', function () {
			var obj = {foo: 'bar'},
			    result;

			L.DomEvent.on(el, 'click', function () {
				result = this;
			}, obj);

			happen.click(el);

			expect(result).to.eql(obj);
		});

		it('passes an event object to the listener', function () {
			var type;

			L.DomEvent.on(el, 'click', function (e) {
				type = e && e.type;
			});
			happen.click(el);

			expect(type).to.eql('click');
		});

		it('is chainable', function () {
			var res = L.DomEvent.on(el, 'click', function () {});
			expect(res.on).to.be.a('function');
		});

		it('is aliased to addListener ', function () {
			expect(L.DomEvent.on).to.be(L.DomEvent.addListener);
		});
	});

	describe('#off (removeListener)', function () {
		it('removes a previously added listener', function () {
			var listener = sinon.spy();

			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.off(el, 'click', listener);

			happen.click(el);

			expect(listener.called).to.not.be.ok();
		});

		it('is chainable', function () {
			var res = L.DomEvent.off(el, 'click', function () {});
			expect(res.off).to.be.a('function');
		});

		it('is aliased to removeListener ', function () {
			expect(L.DomEvent.off).to.be(L.DomEvent.removeListener);
		});
	});

	describe('#stopPropagation', function () {
		it('stops propagation of the given event', function () {
			var child = document.createElement('div'),
			    listener = sinon.spy();

			el.appendChild(child);

			L.DomEvent.on(child, 'click', L.DomEvent.stopPropagation);
			L.DomEvent.on(el, 'click', listener);

			happen.click(child);

			expect(listener.called).to.not.be.ok();

			el.removeChild(child);
		});
	});

	describe('#preventDefault', function () {
		it('prevents the default action of event', function () {
			L.DomEvent.on(el, 'click', L.DomEvent.preventDefault);
			var listener = sinon.spy();
			L.DomEvent.on(el, 'click', listener);

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
