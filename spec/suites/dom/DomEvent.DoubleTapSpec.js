import {Control, DomEvent, DomUtil, Map, extend} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('DomEvent.DoubleTapSpec.js', () => {
	let container, clock, spy;

	beforeEach(() => {
		container = createContainer();

		clock = sinon.useFakeTimers();
		clock.tick(1000);
		spy = sinon.spy();
		DomEvent.on(container, 'dblclick', spy);
	});

	afterEach(() => {
		clock.restore();
		removeMapContainer(null, container);
	});

	it('fires synthetic dblclick after two clicks with delay<200', () => {
		UIEventSimulator.fire('click', container, {detail: 1});
		clock.tick(100);
		UIEventSimulator.fire('click', container, {detail: 1});

		expect(spy.called).to.be.true;
		expect(spy.calledOnce).to.be.true;
		expect(spy.lastCall.args[0] instanceof MouseEvent).to.equal(true);
		expect(spy.lastCall.args[0].isTrusted).to.equal(false);
	});

	it('does not fire dblclick when delay>200', () => {
		UIEventSimulator.fire('click', container, {detail: 1});
		clock.tick(300);
		UIEventSimulator.fire('click', container, {detail: 1});

		expect(spy.notCalled).to.be.true;
	});

	it('does not fire dblclick when detail !== 1', () => {
		UIEventSimulator.fire('click', container, {detail: 0}); // like in IE
		clock.tick(100);
		UIEventSimulator.fire('click', container, {detail: 0});
		clock.tick(100);

		expect(spy.notCalled).to.be.true;
	});

	it('does not fire dblclick after removeListener', () => {
		DomEvent.off(container, 'dblclick', spy);

		UIEventSimulator.fire('click', container, {detail: 1});
		clock.tick(100);
		UIEventSimulator.fire('click', container, {detail: 1});
		clock.tick(100);

		expect(spy.notCalled).to.be.true;
	});

	it('does not conflict with native dblclick', () => {
		UIEventSimulator.fire('click', container, {detail: 1});
		clock.tick(100);
		UIEventSimulator.fire('click', container, {detail: 2}); // native dblclick expected
		UIEventSimulator.fire('dblclick', container); // native dblclick expected
		expect(spy.called).to.be.true;
		expect(spy.calledOnce).to.be.true;
	});

	it('synthetic dblclick event has expected properties', () => {
		const click = {
			detail: 1,
			clientX: 2,
			clientY: 3,
			screenX: 4,
			screenY: 5
		};
		UIEventSimulator.fire('click', container, click);
		clock.tick(100);
		UIEventSimulator.fire('click', container, click);

		const event = spy.lastCall.args[0];
		const expectedProps = extend(click, {
			type: 'dblclick',
			// bubbles: true,    // not important, as we do not actually dispatch the event
			// cancelable: true, //
			detail: 2,
			target: container
		});
		for (const [prop, expectedValue] of Object.entries(expectedProps)) {
			expect(event[prop]).to.equal(expectedValue);
		}
		expect(event.isTrusted).not.to.be.true;
	});

	it('respects disableClickPropagation', () => {
		const spyMap = sinon.spy();
		const map = new Map(container).setView([51.505, -0.09], 13);
		map.on('dblclick', spyMap);

		const spyCtrl = sinon.spy();
		const ctrl = DomUtil.create('div');
		DomEvent.disableClickPropagation(ctrl);
		const MyControl = Control.extend({
			onAdd() {
				return ctrl;
			}
		});
		map.addControl(new MyControl());
		DomEvent.on(ctrl, 'dblclick', spyCtrl);

		UIEventSimulator.fire('click', ctrl, {detail: 1});
		clock.tick(100);
		UIEventSimulator.fire('click', ctrl, {detail: 1});

		expect(spyCtrl.called).to.be.true;
		expect(spyMap.notCalled).to.be.true;
	});

	it('doesn\'t fire double-click while clicking on a label with `for` attribute', () => {
		const spyMap = sinon.spy();
		const map = new Map(container).setView([51.505, -0.09], 13);
		map.on('dblclick', spyMap);

		let div;
		const MyControl = Control.extend({
			onAdd() {
				div = DomUtil.create('div');
				div.innerHTML = '<input type="checkbox" id="input">' +
					'<label for="input" style="background: #ffffff; width: 100px; height: 100px;display: block;">Click Me</label>';
				return div;
			}
		});
		map.addControl(new MyControl());
		// click on the label
		UIEventSimulator.fire('click', div.children[1], {detail: 1});
		clock.tick(100);
		expect(spyMap.notCalled).to.be.true;
		map.remove();
	});
});
