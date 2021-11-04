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

		it('adds a listener when passed an event map', function () {
			var listener = sinon.spy();

			L.DomEvent.on(el, {click: listener});

			happen.click(el);

			sinon.assert.called(listener);
		});

		it('binds "this" to the given context', function () {
			var obj = {foo: 'bar'};
			L.DomEvent.on(el, 'click', listener, obj);

			happen.click(el);

			expect(listener.calledOn(obj)).to.be.ok();
		});

		it('binds "this" to the given context when passed an event map', function () {
			var listener = sinon.spy(),
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, {click: listener}, ctx);

			happen.click(el);

			sinon.assert.calledOn(listener, ctx);
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

		it('removes a previously added listener when passed an event map', function () {
			var listener = sinon.spy(),
			    events = {click: listener};

			L.DomEvent.on(el, events);
			L.DomEvent.off(el, events);

			happen.click(el);

			sinon.assert.notCalled(listener);
		});

		it('removes listener added with context', function () {
			var listener = sinon.spy(),
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, 'click', listener, ctx);
			L.DomEvent.off(el, 'click', listener, ctx);

			happen.click(el);

			sinon.assert.notCalled(listener);
		});

		it('removes listener added with context when passed an event map', function () {
			var listener = sinon.spy(),
			    events = {click: listener},
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, events, ctx);
			L.DomEvent.off(el, events, ctx);

			happen.click(el);

			sinon.assert.notCalled(listener);
		});

		it('only removes listener when proper context specified', function () {
			var listener = sinon.spy(),
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.off(el, 'click', listener, ctx);

			happen.click(el);

			sinon.assert.called(listener);

			listener = sinon.spy();
			L.DomEvent.on(el, 'click', listener, ctx);
			L.DomEvent.off(el, 'click', listener, {}); // wrong context
			L.DomEvent.off(el, 'click', listener);

			happen.click(el);

			sinon.assert.called(listener);
		});

		it('only removes listener when proper context specified when passed an event map', function () {
			var listener = sinon.spy(),
			    events = {click: listener},
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, events);
			L.DomEvent.off(el, events, ctx);

			happen.click(el);

			sinon.assert.called(listener);

			listener = sinon.spy();
			   events = {click: listener};

			L.DomEvent.on(el, events, ctx);
			L.DomEvent.off(el, events);
			L.DomEvent.off(el, events, {}); // wrong context

			happen.click(el);

			sinon.assert.called(listener);
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

	describe('#disableScrollPropagation', function () {
		it('stops wheel events from propagation to parent elements', function () {
			var child = document.createElement('div');
			el.appendChild(child);
			var wheel = 'onwheel' in window ? 'wheel' : 'mousewheel';
			L.DomEvent.on(el, wheel, listener);

			L.DomEvent.disableScrollPropagation(child);
			happen.once(child, {type: wheel});

			expect(listener.notCalled).to.be.ok();
		});
	});

	describe('#disableClickPropagation', function () {
		it('stops click events from propagation to parent elements', function () { // except 'click'
			var child = document.createElement('div');
			el.appendChild(child);
			L.DomEvent.disableClickPropagation(child);
			L.DomEvent.on(el, 'dblclick contextmenu mousedown touchstart', listener);

			happen.once(child, {type: 'dblclick'});
			happen.once(child, {type: 'contextmenu'});
			happen.once(child, {type: 'mousedown'});
			happen.once(child, {type: 'touchstart', touches: []});

			expect(listener.notCalled).to.be.ok();
		});

		it('prevents click event on map object, but propagates to DOM elements', function () { // to solve #301
			var child = document.createElement('div');
			el.appendChild(child);
			L.DomEvent.disableClickPropagation(child);
			L.DomEvent.on(el, 'click', listener);
			var grandChild = document.createElement('div');
			child.appendChild(grandChild);

			var map = L.map(el).setView([0, 0], 0);
			var mapClickListener = sinon.spy();
			var mapOtherListener = sinon.spy();
			map.on('click', mapClickListener);          // control case
			map.on('keypress', mapOtherListener);       // control case

			happen.once(grandChild, {type: 'click'});
			happen.once(grandChild, {type: 'keypress'});

			expect(mapOtherListener.called).to.be.ok(); // control case
			expect(listener.called).to.be.ok();
			expect(mapClickListener.notCalled).to.be.ok();

			happen.once(child, {type: 'click'});
			happen.once(child, {type: 'keypress'});

			expect(listener.calledTwice).to.be.ok();
			expect(mapClickListener.notCalled).to.be.ok();

			map.remove();
		});
	});

	describe('#preventDefault', function () {
		function isPrevented(e) {
			if ('defaultPrevented' in e) {
				return e.defaultPrevented;
			} else { // IE<11
				return !e.returnValue;
			}
		}

		it('prevents the default action of event', function (done) {
			L.DomEvent.on(el, 'click', function (e) {
				expect(isPrevented(e)).not.to.be.ok(); // control case

				L.DomEvent.preventDefault(e);

				expect(isPrevented(e)).to.be.ok();
				done();
			});

			happen.click(el);
		});
	});
});
