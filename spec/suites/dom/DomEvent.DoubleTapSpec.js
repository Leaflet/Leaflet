describe('DomEvent.DoubleTapSpec.js', function () {
	var el, clock, spy;

	beforeEach(function () {
		el = document.createElement('div');
		document.body.appendChild(el);

		clock = sinon.useFakeTimers();
		clock.tick(1000);
		spy = sinon.spy();
		L.DomEvent.on(el, 'dblclick', spy);
	});

	afterEach(function () {
		clock.restore();
		document.body.removeChild(el);
	});

	it('fires synthetic dblclick after two clicks with delay<200', function () {
		happen.click(el, {detail: 1});
		clock.tick(100);
		happen.click(el, {detail: 1});

		expect(spy.called).to.be.ok();
		expect(spy.calledOnce).to.be.ok();
		expect(spy.lastCall.args[0]._simulated).to.be.ok();
	});

	it('does not fire dblclick when delay>200', function () {
		happen.click(el, {detail: 1});
		clock.tick(300);
		happen.click(el, {detail: 1});

		expect(spy.notCalled).to.be.ok();
	});

	it('does not fire dblclick when detail !== 1', function () {
		happen.click(el, {detail: 0}); // like in IE
		clock.tick(100);
		happen.click(el, {detail: 0});
		clock.tick(100);

		expect(spy.notCalled).to.be.ok();
	});

	it('does not fire dblclick after removeListener', function () {
		L.DomEvent.off(el, 'dblclick', spy);

		happen.click(el, {detail: 1});
		clock.tick(100);
		happen.click(el, {detail: 1});
		clock.tick(100);

		expect(spy.notCalled).to.be.ok();
	});

	it('does not conflict with native dblclick', function () {
		happen.click(el, {detail: 1});
		clock.tick(100);
		happen.click(el, {detail: 2}); // native dblclick expected
		happen.dblclick(el);
		expect(spy.called).to.be.ok();
		expect(spy.calledOnce).to.be.ok();
		expect(spy.lastCall.args[0]._simulated).not.to.be.ok();
	});

	it('synthetic dblclick event has expected properties', function () {
		var click = {
			detail: 1,
			clientX: 2,
			clientY: 3,
			screenX: 4,
			screenY: 5
		};
		happen.click(el, click);
		clock.tick(100);
		happen.click(el, click);

		var event = spy.lastCall.args[0];
		var expectedProps = L.extend(click, {
			type: 'dblclick',
			// bubbles: true,    // not important, as we do not actually dispatch the event
			// cancelable: true, //
			detail: 2,
			target: el
		});
		for (var prop in expectedProps) {
			expect(event[prop]).to.be(expectedProps[prop]);
		}
		expect(event.isTrusted).not.to.be.ok();
	});

	it('respects disableClickPropagation', function () {
		var spyMap = sinon.spy();
		var map = L.map(el).setView([51.505, -0.09], 13);
		map.on('dblclick', spyMap);

		var spyCtrl = sinon.spy();
		var ctrl = L.DomUtil.create('div');
		L.DomEvent.disableClickPropagation(ctrl);
		var MyControl = L.Control.extend({
			onAdd: function () {
				return ctrl;
			}
		});
		map.addControl(new MyControl());
		L.DomEvent.on(ctrl, 'dblclick', spyCtrl);

		happen.click(ctrl, {detail: 1});
		clock.tick(100);
		happen.click(ctrl, {detail: 1});

		expect(spyCtrl.called).to.be.ok();
		expect(spyMap.notCalled).to.be.ok();
	});
});
