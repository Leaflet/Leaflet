describe('DomEvent.DoubleTapSpec.js', function () {
	var container, clock, spy;

	beforeEach(function () {
		container = createContainer();

		clock = sinon.useFakeTimers();
		clock.tick(1000);
		spy = sinon.spy();
		L.DomEvent.on(container, 'dblclick', spy);
	});

	afterEach(function () {
		clock.restore();
		removeMapContainer(null, container);
	});

	it('fires synthetic dblclick after two clicks with delay<200', function () {
		happen.click(container, {detail: 1});
		clock.tick(100);
		happen.click(container, {detail: 1});

		expect(spy.called).to.be.ok();
		expect(spy.calledOnce).to.be.ok();
		expect(spy.lastCall.args[0]._simulated).to.be.ok();
	});

	it('does not fire dblclick when delay>200', function () {
		happen.click(container, {detail: 1});
		clock.tick(300);
		happen.click(container, {detail: 1});

		expect(spy.notCalled).to.be.ok();
	});

	it('does not fire dblclick when detail !== 1', function () {
		happen.click(container, {detail: 0}); // like in IE
		clock.tick(100);
		happen.click(container, {detail: 0});
		clock.tick(100);

		expect(spy.notCalled).to.be.ok();
	});

	it('does not fire dblclick after removeListener', function () {
		L.DomEvent.off(container, 'dblclick', spy);

		happen.click(container, {detail: 1});
		clock.tick(100);
		happen.click(container, {detail: 1});
		clock.tick(100);

		expect(spy.notCalled).to.be.ok();
	});

	it('does not conflict with native dblclick', function () {
		happen.click(container, {detail: 1});
		clock.tick(100);
		happen.click(container, {detail: 2}); // native dblclick expected
		happen.dblclick(container);
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
		happen.click(container, click);
		clock.tick(100);
		happen.click(container, click);

		var event = spy.lastCall.args[0];
		var expectedProps = L.extend(click, {
			type: 'dblclick',
			// bubbles: true,    // not important, as we do not actually dispatch the event
			// cancelable: true, //
			detail: 2,
			target: container
		});
		for (var prop in expectedProps) {
			expect(event[prop]).to.be(expectedProps[prop]);
		}
		expect(event.isTrusted).not.to.be.ok();
	});

	it('respects disableClickPropagation', function () {
		var spyMap = sinon.spy();
		var map = L.map(container).setView([51.505, -0.09], 13);
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

	it('doesn\'t fire double-click while clicking on a label with `for` attribute', function () {
		var spyMap = sinon.spy();
		var map = L.map(container).setView([51.505, -0.09], 13);
		map.on('dblclick', spyMap);

		var div;
		var MyControl = L.Control.extend({
			onAdd: function () {
				div = L.DomUtil.create('div');
				div.innerHTML = '<input type="checkbox" id="input">' +
					'<label for="input" style="background: #ffffff; width: 100px; height: 100px;display: block;">Click Me</label>';
				return div;
			}
		});
		map.addControl(new MyControl());
		// click on the label
		happen.click(div.children[1], {detail: 1});
		clock.tick(100);
		expect(spyMap.notCalled).to.be.ok();
		map.remove();
	});
});
