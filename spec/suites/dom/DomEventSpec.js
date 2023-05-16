describe('DomEvent', () => {
	let el, listener;

	beforeEach(() => {
		el = document.createElement('div');
		document.body.appendChild(el);
		listener = sinon.spy();
	});

	afterEach(() => {
		document.body.removeChild(el);
	});

	describe('#arguments check', () => {
		it('throws when el is not HTMLElement', () => {
			expect(() => L.DomEvent.on({}, 'click', L.Util.falseFn)).to.throw();
			expect(() => L.DomEvent.disableScrollPropagation({})).to.throw();
			expect(() => L.DomEvent.disableClickPropagation({})).to.throw();
			expect(() => L.DomEvent.getMousePosition({clientX: 0, clientY: 0}, {})).to.throw();
			// .off and .isExternalTarget do not throw atm
		});
	});

	describe('#on (addListener)', () => {
		it('throws when type is undefined and context is falseFn', () => {
			expect(() => L.DomEvent.on(el, undefined, L.Util.falseFn)).to.throw();
		});

		it('throws when type is null and context is falseFn', () => {
			expect(() => L.DomEvent.on(el, null, L.Util.falseFn)).to.throw();
		});

		it('throws when type is false and context is falseFn', () => {
			expect(() => L.DomEvent.on((el, false, L.Util.falseFn))).to.throw();
		});

		it('throws when type is "click" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'click', undefined)).to.throw();
		});

		it('throws when type is "click" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'click', null)).to.throw();
		});

		it('throws when type is "click" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'click', false)).to.throw();
		});

		it('throws when type is "click" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'click', undefined)).to.throw();
		});

		it('throws when type is "dblclick" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'dblclick', null)).to.throw();
		});

		it('throws when type is "dblclick" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'dblclick', false)).to.throw();
		});

		it('throws when type is "dblclick" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'dblclick', undefined)).to.throw();
		});

		it('throws when type is "mousedown" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'mousedown', null)).to.throw();
		});

		it('throws when type is "mousedown" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'mousedown', false)).to.throw();
		});

		it('throws when type is "mousedown" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'mousedown', undefined)).to.throw();
		});

		it('throws when type is "mouseup" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'mouseup', null)).to.throw();
		});

		it('throws when type is "mouseup" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'mouseup', false)).to.throw();
		});

		it('throws when type is "mouseup" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'mouseup', undefined)).to.throw();
		});

		it('throws when type is "mouseover" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'mouseover', null)).to.throw();
		});

		it('throws when type is "mouseover" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'mouseover', false)).to.throw();
		});

		it('throws when type is "mouseover" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'mouseover', undefined)).to.throw();
		});

		it('throws when type is "mouseout" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'mouseout', null)).to.throw();
		});

		it('throws when type is "mouseout" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'mouseout', false)).to.throw();
		});

		it('throws when type is "mouseout" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'mouseout', undefined)).to.throw();
		});

		it('throws when type is "mousemove" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'mousemove', null)).to.throw();
		});

		it('throws when type is "mousemove" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'mousemove', false)).to.throw();
		});

		it('throws when type is "mousemove" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'mousemove', undefined)).to.throw();
		});

		it('throws when type is "contextmenu" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'contextmenu', null)).to.throw();
		});

		it('throws when type is "contextmenu" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'contextmenu', false)).to.throw();
		});

		it('throws when type is "contextmenu" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'contextmenu', undefined)).to.throw();
		});

		it('throws when type is "keyup" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'keyup', null)).to.throw();
		});

		it('throws when type is "keyup" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'keyup', false)).to.throw();
		});

		it('throws when type is "keyup" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'keyup', undefined)).to.throw();
		});

		it('throws when type is "keypress" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'keypress', null)).to.throw();
		});

		it('throws when type is "keypress" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'keypress', false)).to.throw();
		});

		it('throws when type is "keypress" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'keypress', undefined)).to.throw();
		});

		it('throws when type is "keydown" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'keydown', null)).to.throw();
		});

		it('throws when type is "keydown" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'keydown', false)).to.throw();
		});

		it('throws when type is "keydown" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'keydown', undefined)).to.throw();
		});

		it('throws when type is "keydown and click" and context is null', () => {
			expect(() => L.DomEvent.on(el, 'keydown click', null)).to.throw();
		});

		it('throws when type is "keydown and click" and context is false', () => {
			expect(() => L.DomEvent.on(el, 'keydown click', false)).to.throw();
		});

		it('throws when type is "keydown and click" and context is undefined', () => {
			expect(() => L.DomEvent.on(el, 'keydown click', undefined)).to.throw();
		});

		it('adds a listener and calls it on event with click', () => {
			const listener2 = sinon.spy();
			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.on(el, 'click', listener2);

			UIEventSimulator.fire('click', el);

			expect(listener.called).to.be.true;
			expect(listener2.called).to.be.true;
		});

		it('adds a listener and calls it on event with click and keypress', () => {
			const listener2 = sinon.spy();
			L.DomEvent.on(el, 'click keypress', listener);
			L.DomEvent.on(el, 'click', listener2);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			expect(listener.called).to.be.true;
			expect(listener2.called).to.be.true;
		});

		it('adds a listener when passed an event map', () => {
			const listener = sinon.spy();

			L.DomEvent.on(el, {click: listener});

			UIEventSimulator.fire('click', el);

			sinon.assert.called(listener);
		});

		it('adds 2 listener when passed an event map with multiple events', () => {
			const listener2 = sinon.spy();

			L.DomEvent.on(el, {click: listener, keypress: listener2});

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			sinon.assert.called(listener);
			sinon.assert.called(listener2);
		});

		it('binds "this" to the given context', () => {
			const obj = {foo: 'bar'};
			L.DomEvent.on(el, 'click', listener, obj);

			UIEventSimulator.fire('click', el);

			expect(listener.calledOn(obj)).to.be.true;
		});

		it('binds "this" to the given context with multiple types', () => {
			const obj = {foo: 'bar'};
			L.DomEvent.on(el, 'click keypress', listener, obj);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			expect(listener.calledOn(obj)).to.be.true;
		});

		it('binds "this" to the given context when passed an event map', () => {
			const listener = sinon.spy(),
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, {click: listener}, ctx);

			UIEventSimulator.fire('click', el);

			sinon.assert.calledOn(listener, ctx);
		});

		it('binds "this" to the given context when passed an event map with multiple events', () => {
			const listener2 = sinon.spy(),
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, {click: listener, keypress: listener2}, ctx);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			sinon.assert.calledOn(listener, ctx);
			sinon.assert.calledOn(listener2, ctx);
		});

		it('passes an event object to the listener', () => {
			L.DomEvent.on(el, 'click', listener);

			UIEventSimulator.fire('click', el);

			expect(listener.lastCall.args[0].type).to.eql('click');
		});

		it('passes two event objects to the listener', () => {
			L.DomEvent.on(el, 'click keypress', listener);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			expect(listener.firstCall.args[0].type).to.eql('click');
			expect(listener.secondCall.args[0].type).to.eql('keypress');
		});

		it('is chainable', () => {
			const res = L.DomEvent.on(el, 'click', () => {});

			expect(res).to.equal(L.DomEvent);
		});

		it('is aliased to addListener ', () => {
			expect(L.DomEvent.on).to.equal(L.DomEvent.addListener);
		});
	});

	describe('#off (removeListener)', () => {
		it('removes a previously added listener', () => {
			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.off(el, 'click', listener);

			UIEventSimulator.fire('click', el);

			expect(listener.notCalled).to.be.true;
		});

		it('removes a previously added event', () => {
			L.DomEvent.on(el, 'click keypress', listener);
			L.DomEvent.off(el, 'click', listener);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			expect(listener.lastCall.args[0].type).to.eql('keypress');
		});

		it('only removes the specified listener', () => {
			const listenerA = sinon.spy(),
			listenerB = sinon.spy();

			L.DomEvent.on(el, 'click', listenerA);
			L.DomEvent.on(el, 'click', listenerB);
			L.DomEvent.off(el, 'click', listenerA);

			UIEventSimulator.fire('click', el);

			expect(listenerA.called).to.be.false;
			expect(listenerB.called).to.be.true;
		});

		it('removes a previously added listener when passed an event map', () => {
			const listener = sinon.spy(),
			    events = {click: listener};

			L.DomEvent.on(el, events);
			L.DomEvent.off(el, events);

			UIEventSimulator.fire('click', el);

			sinon.assert.notCalled(listener);
		});

		it('removes a previously added listener when passed an event map with multiple events', () => {
			const listener2 = sinon.spy(),
			    events = {click: listener, keypress: listener2};

			L.DomEvent.on(el, events);
			L.DomEvent.off(el, events);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			sinon.assert.notCalled(listener);
			sinon.assert.notCalled(listener2);
		});

		it('removes a previously added event when passed an event map with multiple events', () => {
			const listener2 = sinon.spy(),
			    events = {click: listener, keypress: listener2},
			events2 = {click: listener};

			L.DomEvent.on(el, events);
			L.DomEvent.off(el, events2);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			sinon.assert.notCalled(listener);
			expect(listener2.lastCall.args[0].type).to.eql('keypress');
		});

		it('removes listener added with context', () => {
			const listener = sinon.spy(),
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, 'click', listener, ctx);
			L.DomEvent.off(el, 'click', listener, ctx);

			UIEventSimulator.fire('click', el);

			sinon.assert.notCalled(listener);
		});

		it('removes listener added with context when passed an event map', () => {
			const listener = sinon.spy(),
			    events = {click: listener},
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, events, ctx);
			L.DomEvent.off(el, events, ctx);

			UIEventSimulator.fire('click', el);

			sinon.assert.notCalled(listener);
		});

		it('removes listener added with context when passed an event map with multiple events', () => {
			const listener2 = sinon.spy(),
			    events = {click: listener, keypress: listener2},
			events2 = {click: listener},
			    ctx = {foo: 'bar'};

			L.DomEvent.on(el, events, ctx);
			L.DomEvent.off(el, events2, ctx);

			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('keypress', el);

			sinon.assert.notCalled(listener);
			expect(listener2.lastCall.args[0].type).to.eql('keypress');
		});

		it('only removes listener when proper context specified', () => {
			let listener = sinon.spy();
			const ctx = {foo: 'bar'};

			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.off(el, 'click', listener, ctx);

			UIEventSimulator.fire('click', el);

			sinon.assert.called(listener);

			listener = sinon.spy();
			L.DomEvent.on(el, 'click', listener, ctx);
			L.DomEvent.off(el, 'click', listener, {}); // wrong context
			L.DomEvent.off(el, 'click', listener);

			UIEventSimulator.fire('click', el);

			sinon.assert.called(listener);
		});

		it('only removes listener when proper context specified when passed an event map', () => {
			let listener = sinon.spy(),
			    events = {click: listener};
			const ctx = {foo: 'bar'};

			L.DomEvent.on(el, events);
			L.DomEvent.off(el, events, ctx);

			UIEventSimulator.fire('click', el);

			sinon.assert.called(listener);

			listener = sinon.spy();
			   events = {click: listener};

			L.DomEvent.on(el, events, ctx);
			L.DomEvent.off(el, events);
			L.DomEvent.off(el, events, {}); // wrong context

			UIEventSimulator.fire('click', el);

			sinon.assert.called(listener);
		});

		it('removes all listeners when only passed the HTMLElement', () => {
			const listenerA = sinon.spy(),
			listenerB = sinon.spy();

			L.DomEvent.on(el, 'click', listenerA);
			L.DomEvent.on(el, 'click', listenerB, {});
			L.DomEvent.off(el);

			UIEventSimulator.fire('click', el);

			expect(listenerA.called).to.be.false;
			expect(listenerB.called).to.be.false;
		});

		it('only removes specified listeners type', () => {
			const listenerClick = sinon.spy(),
			listenerDblClick = sinon.spy();

			L.DomEvent.on(el, 'click', listenerClick);
			L.DomEvent.on(el, 'dblclick', listenerDblClick);
			L.DomEvent.off(el, 'click');
			UIEventSimulator.fire('click', el);
			UIEventSimulator.fire('dblclick', el);

			sinon.assert.notCalled(listenerClick);
			sinon.assert.called(listenerDblClick);
		});

		it('throws when types/fn are undefined/null/false', () => {
			expect(() => L.DomEvent.off(el, undefined)).to.throw();
			expect(() => L.DomEvent.off(el, null)).to.throw();
			expect(() => L.DomEvent.off(el, false)).to.throw();

			expect(() => L.DomEvent.off(el, 'click', undefined)).to.throw();
			expect(() => L.DomEvent.off(el, 'click', null)).to.throw();
			expect(() => L.DomEvent.off(el, 'click', false)).to.throw();
		});

		it('removes listener when passed an event map', () => {
			const listener = sinon.spy();

			L.DomEvent.on(el, 'click', listener);
			L.DomEvent.off(el, {'click': listener});

			UIEventSimulator.fire('click', el);

			expect(listener.called).to.be.false;
		});

		it('is chainable', () => {
			const res = L.DomEvent.off(el, 'click', () => {});

			expect(res).to.equal(L.DomEvent);
		});

		it('is aliased to removeListener ', () => {
			expect(L.DomEvent.off).to.equal(L.DomEvent.removeListener);
		});
	});

	describe('#stopPropagation', () => {
		it('stops propagation of the given event', () => {
			const child = document.createElement('div');
			el.appendChild(child);
			L.DomEvent.on(child, 'click', L.DomEvent.stopPropagation);
			L.DomEvent.on(el, 'click', listener);

			UIEventSimulator.fire('click', child);

			expect(listener.notCalled).to.be.true;
		});
	});

	describe('#disableScrollPropagation', () => {
		it('stops wheel events from propagation to parent elements', () => {
			const child = document.createElement('div');
			el.appendChild(child);
			const wheel = 'onwheel' in window ? 'wheel' : 'mousewheel';
			L.DomEvent.on(el, wheel, listener);

			L.DomEvent.disableScrollPropagation(child);
			UIEventSimulator.fire(wheel, child);

			expect(listener.notCalled).to.be.true;
		});
	});

	describe('#disableClickPropagation', () => {
		it('stops click events from propagation to parent elements', () => { // except 'click'
			const child = document.createElement('div');
			el.appendChild(child);
			L.DomEvent.disableClickPropagation(child);
			L.DomEvent.on(el, 'dblclick contextmenu mousedown touchstart', listener);

			UIEventSimulator.fire('dblclick', child);
			UIEventSimulator.fire('contextmenu', child);
			UIEventSimulator.fire('mousedown', child);
			UIEventSimulator.fire('touchstart', child, {touches: []});

			expect(listener.notCalled).to.be.true;
		});

		it('prevents click event on map object, but propagates to DOM elements', () => { // to solve #301
			const child = document.createElement('div');
			el.appendChild(child);
			L.DomEvent.disableClickPropagation(child);
			L.DomEvent.on(el, 'click', listener);
			const grandChild = document.createElement('div');
			child.appendChild(grandChild);

			const map = L.map(el).setView([0, 0], 0);
			const mapClickListener = sinon.spy();
			const mapOtherListener = sinon.spy();
			map.on('click', mapClickListener);          // control case
			map.on('keypress', mapOtherListener);       // control case

			UIEventSimulator.fire('click', grandChild);
			UIEventSimulator.fire('keypress', grandChild);

			expect(mapOtherListener.called).to.be.true; // control case
			expect(listener.called).to.be.true;
			expect(mapClickListener.notCalled).to.be.true;

			UIEventSimulator.fire('click', child);
			UIEventSimulator.fire('keypress', child);

			expect(listener.calledTwice).to.be.true;
			expect(mapClickListener.notCalled).to.be.true;

			map.remove();
		});
	});

	describe('#preventDefault', () => {
		function isPrevented(e) {
			if ('defaultPrevented' in e) {
				return e.defaultPrevented;
			} else { // IE<11
				return !e.returnValue;
			}
		}

		it('prevents the default action of event', (done) => {
			L.DomEvent.on(el, 'click', (e) => {
				expect(isPrevented(e)).not.to.be.true; // control case

				L.DomEvent.preventDefault(e);

				expect(isPrevented(e)).to.be.true;
				done();
			});

			UIEventSimulator.fire('click', el);
		});
	});
});
