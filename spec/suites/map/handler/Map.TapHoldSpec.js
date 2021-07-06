describe('Map.TapHoldSpec.js', function () {
	var el, clock, spy, map;

	var posStart = {clientX:1, clientY:1};
	var posNear = {clientX:10, clientY:10};
	var posFar = {clientX:100, clientY:100};

	beforeEach(function () {
		el = document.createElement('div');
		document.body.appendChild(el);

		clock = sinon.useFakeTimers();
		clock.tick(1000);
		spy = sinon.spy();

		map = L.map(el, {
			center: [51.505, -0.09],
			zoom: 13,
			tapHold: true
		});
		map.on('contextmenu', spy);

		posStart.target = el;
		posNear.target = el;
		posFar.target = el;
	});

	afterEach(function () {
		happen.once(el, {type: 'touchend'});
		for (var id = 0; id <= 2; id++) { // reset pointers (for prosphetic-hand)
			happen.once(el, {type: 'pointercancel', pointerId:id});
		}
		clock.restore();
		map.remove();
		document.body.removeChild(el);
	});

	it('fires synthetic contextmenu after hold delay>600', function () {
		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(550);

		expect(spy.notCalled).to.be.ok();

		clock.tick(100);

		expect(spy.called).to.be.ok();
		expect(spy.calledOnce).to.be.ok();

		var event = spy.lastCall.args[0];
		expect(event.type).to.be('contextmenu');
		expect(event.originalEvent._simulated).to.be.ok();
	});

	it('does not fire contextmenu when touches > 1', function () {
		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(100);
		happen.once(el, {type: 'touchstart', touches: [posStart, posNear]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:1}, posNear));
		clock.tick(550);

		expect(spy.notCalled).to.be.ok();
	});

	it('does not fire contextmenu when touches > 1 (case:2)', function () {
		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(100);
		happen.once(el, {type: 'touchstart', touches: [posStart, posNear]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:1}, posNear));
		clock.tick(100);
		happen.once(el, {type: 'touchend', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerup', pointerId:0}, posNear));
		clock.tick(450);

		expect(spy.notCalled).to.be.ok();
	});

	(L.Browser.pointer ? it : it.skip)('ignores events from mouse', function () {
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0, pointerType:'mouse'}, posStart));
		clock.tick(650);

		expect(spy.notCalled).to.be.ok();
	});

	it('does not conflict with native contextmenu', function () {
		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(550);

		happen.once(el, {type: 'contextmenu'});

		clock.tick(100);

		expect(spy.called).to.be.ok();
		expect(spy.calledOnce).to.be.ok();
		expect(spy.lastCall.args[0].originalEvent._simulated).not.to.be.ok();

		// Note: depending on tapHoldDelay value it's also possible that native contextmenu may come after simulated one
		//       and the only way to handle this gracefully - increase tapHoldDelay value.
		//       Anyway that is edge case, as tapHold is meant for browsers where native contextmenu is not fired on touch.
	});

	it.skip('prevents native click', function () { // to be performed by hand
		// Not valid here, as there is no way to initiate native click with fake touch
		var clickSpy = sinon.spy();
		map.on('click', clickSpy);

		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(650);
		happen.once(el, {type: 'touchend', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerup', pointerId:0}, posNear));

		expect(clickSpy.notCalled).to.be.ok();
	});

	it('allows short movements', function () {
		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(550);

		happen.once(el, {type: 'touchmove', touches: [posNear]});
		happen.once(el, L.extend({type: 'pointermove', pointerId:0}, posNear));

		clock.tick(100);

		expect(spy.called).to.be.ok();
	});

	it('ignores long movements', function () {
		expect(L.point(posStart.clientX, posStart.clientY).distanceTo([posFar.clientX, posFar.clientY]))
		  .to.be.above(map.options.tapTolerance);

		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(550);

		happen.once(el, {type: 'touchmove', touches: [posFar]});
		happen.once(el, L.extend({type: 'pointermove', pointerId:0}, posFar));

		clock.tick(100);

		expect(spy.notCalled).to.be.ok();
	});

	it('.originalEvent has expected properties', function () {
		L.extend(posStart, {
			screenX: 2,
			screenY: 2,
		});

		happen.once(el, {type: 'touchstart', touches: [posStart]});
		happen.once(el, L.extend({type: 'pointerdown', pointerId:0}, posStart));
		clock.tick(650);

		var originalEvent = spy.lastCall.args[0].originalEvent;
		var expectedProps = L.extend({
			type: 'contextmenu',
			bubbles: true,
			cancelable: true,
			target: el
		}, posStart);
		for (var prop in expectedProps) {
			expect(originalEvent[prop]).to.be(expectedProps[prop]);
		}
	});
});

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent#polyfill
// required for PhantomJS

(function (window) {
	try {
		new MouseEvent('test'); // eslint-disable-line no-new
		return false; // No need to polyfill
	} catch (e) {
		// Need to polyfill - fall through
	}

	// Polyfills DOM4 MouseEvent
	var MouseEventPolyfill = function (eventType, params) {
		params = params || {bubbles: false, cancelable: false};
		var mouseEvent = document.createEvent('MouseEvent');
		mouseEvent.initMouseEvent(eventType,
			params.bubbles,
			params.cancelable,
			window,
			0,
			params.screenX || 0,
			params.screenY || 0,
			params.clientX || 0,
			params.clientY || 0,
			params.ctrlKey || false,
			params.altKey || false,
			params.shiftKey || false,
			params.metaKey || false,
			params.button || 0,
			params.relatedTarget || null
		);

		return mouseEvent;
	};

	MouseEventPolyfill.prototype = Event.prototype;

	window.MouseEvent = MouseEventPolyfill;
})(window);
