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

	var pointerToTouch = L.Browser.pointer && !L.Browser.touchNative;
	(pointerToTouch ? describe : skip)('#Simulates touch based on pointer events', function () {
		it('adds a listener and calls it on pointer event', function () {
			pointerEvents.forEach(function (type) {
				happen.once(el, {type: type});
			});
			touchEvents.forEach(function (type) {
				expect(listeners[type].called).to.be.ok();
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

		it('ignores events from mouse', function () {
			pointerEvents.forEach(function (type) {
				happen.once(el, {type: type, pointerType: 'mouse'});
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

		it('does not throw on invalid event names', function () {
			L.DomEvent.on(el, 'touchleave', L.Util.falseFn);
			L.DomEvent.off(el, 'touchleave', L.Util.falseFn);
		});

		it('simulates touch events with correct properties', function () {
			function containIn(props, evt) {
				if (Array.isArray(props)) {
					return props.every(function (props0) {
						return containIn(props0, evt);
					});
				}
				if ('length' in evt) {
					return Array.prototype.some.call(evt, containIn.bind(this, props));
				}
				for (var prop in props) {
					var res = true;
					if (props[prop] !== evt[prop]) {
						return false;
					}
				}
				return res;
			}
			// test helper function
			expect(containIn(undefined, {a:1})).not.to.be.ok();
			expect(containIn({}, {a:1})).not.to.be.ok();
			expect(containIn({a:1}, {a:2})).not.to.be.ok();
			expect(containIn({a:1}, {a:1, b:2})).to.be.ok();
			expect(containIn({a:1, b:2}, {a:1})).not.to.be.ok();
			expect(containIn({a:1}, [{a:1}, {b:2}])).to.be.ok();
			expect(containIn({a:1}, [{a:0}, {b:2}])).not.to.be.ok();
			expect(containIn([{a:1}, {b:2}], [{a:1}, {b:2}, {c:3}])).to.be.ok();
			expect(containIn([{a:1}, {b:2}], [{a:0}, {b:2}])).not.to.be.ok();

			// pointerdown/touchstart
			var pointer1 = {clientX:1, clientY:1, pointerId: 1};
			happen.once(el, L.extend({type: 'pointerdown'}, pointer1));
			var evt = listeners.touchstart.lastCall.args[0];
			expect(evt.type).to.be('pointerdown');
			expect(evt).to.have.keys('touches', 'changedTouches');
			expect(evt.changedTouches).to.have.length(1);
			expect(containIn(pointer1, evt.changedTouches[0])).to.be.ok();
			expect(evt.touches).to.have.length(1);
			expect(containIn(pointer1, evt.touches[0])).to.be.ok();

			// another pointerdown/touchstart (multitouch)
			var pointer2 = {clientX:2, clientY:2, pointerId: 2};
			happen.once(el, L.extend({type: 'pointerdown'}, pointer2));
			evt = listeners.touchstart.lastCall.args[0];
			expect(evt.type).to.be('pointerdown');
			expect(evt).to.have.keys('touches', 'changedTouches');
			expect(evt.changedTouches).to.have.length(1);
			expect(containIn(pointer2, evt.changedTouches[0])).to.be.ok();
			expect(evt.touches).to.have.length(2);
			expect(containIn([pointer1, pointer2], evt.touches)).to.be.ok();

			// pointermove/touchmove (multitouch)
			L.extend(pointer1, {clientX:11, clientY:11});
			happen.once(el, L.extend({type: 'pointermove'}, pointer1));
			evt = listeners.touchmove.lastCall.args[0];
			expect(evt.type).to.be('pointermove');
			expect(evt).to.have.keys('touches', 'changedTouches');
			expect(evt.changedTouches).to.have.length(1);
			expect(containIn(pointer1, evt.changedTouches[0])).to.be.ok();
			expect(evt.touches).to.have.length(2);
			expect(containIn([pointer1, pointer2], evt.touches)).to.be.ok();

			// pointerup/touchend (multitouch)
			happen.once(el, L.extend({type: 'pointerup'}, pointer2));
			evt = listeners.touchend.lastCall.args[0];
			expect(evt.type).to.be('pointerup');
			expect(evt).to.have.keys('touches', 'changedTouches');
			expect(evt.changedTouches).to.have.length(1);
			expect(containIn(pointer2, evt.changedTouches[0])).to.be.ok();
			expect(evt.touches).to.have.length(1);
			expect(containIn(pointer1, evt.touches[0])).to.be.ok();

			// pointercancel/touchcancel
			happen.once(el, L.extend({type: 'pointercancel'}, pointer1));
			evt = listeners.touchcancel.lastCall.args[0];
			expect(evt.type).to.be('pointercancel');
			expect(evt).to.have.keys('touches', 'changedTouches');
			expect(evt.changedTouches).to.have.length(1);
			expect(containIn(pointer1, evt.changedTouches[0])).to.be.ok();
			expect(evt.touches).to.be.empty();

			expect(listeners.touchstart.calledTwice).to.be.ok();
			expect(listeners.touchmove.calledOnce).to.be.ok();
			expect(listeners.touchend.calledOnce).to.be.ok();
			expect(listeners.touchcancel.calledOnce).to.be.ok();
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
