import {LeafletMap, Point} from 'leaflet';
import sinon from 'sinon';
import Finger from '../../../helpers/Finger.js';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('TapHoldHandler', () => {
	let container, clock, spy, map;
	let touchFinger, touchFinger2, mouseFinger;

	const posStart = {x: 1, y: 1};
	const posNear = {x: 10, y: 10};
	const posFar = {x: 100, y: 100};

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			center: [51.505, -0.09],
			zoom: 13,
			tapHold: true
		});

		// Tap-Hold depends on timing, so fake the clock and tick it manually between finger steps.
		clock = sinon.useFakeTimers({
			toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance']
		});
		clock.tick(1000);
		spy = sinon.spy();

		map.on('contextmenu', spy);

		touchFinger = new Finger('touch').moveTo(posStart.x, posStart.y);
		touchFinger2 = new Finger('touch').moveTo(posStart.x, posStart.y);
		mouseFinger = new Finger('mouse').moveTo(posStart.x, posStart.y);
	});

	afterEach(() => {
		clock.restore();
		removeMapContainer(map, container);
	});

	it('fires synthetic contextmenu after hold delay>600', async () => {
		await touchFinger.down();
		clock.tick(550);

		expect(spy.notCalled).to.be.true;

		clock.tick(100);

		expect(spy.called).to.be.true;
		expect(spy.calledOnce).to.be.true;

		const event = spy.lastCall.args[0];
		expect(event.type).to.equal('contextmenu');
		expect(event.originalEvent._simulated).to.be.true;
		await touchFinger.up();
	});

	it('does not fire contextmenu when multiple pointers touches', async () => {
		await Promise.all([touchFinger.down(), touchFinger2.down()]);
		clock.tick(100);
		await touchFinger.up();
		clock.tick(500);
		await touchFinger2.up();
		clock.tick(400);

		expect(spy.notCalled).to.be.true;
	});

	it('does not fire contextmenu when multiple pointers touches > 1 (case:2)', async () => {
		expect(spy.notCalled).to.be.true;

		await touchFinger.down();
		clock.tick(100);
		await touchFinger2.down();
		clock.tick(550);
		await touchFinger.up();
		clock.tick(100);

		expect(spy.notCalled).to.be.true;
		await touchFinger2.up();
	});

	it('ignores events from mouse', async () => {
		await mouseFinger.down();
		clock.tick(650);
		await mouseFinger.up();
		clock.tick(100);

		expect(spy.notCalled).to.be.true;
	});

	it('does not conflict with native contextmenu', async () => {
		await touchFinger.down();
		clock.tick(560);

		UIEventSimulator.fire('contextmenu', container);

		clock.tick(100);
		await touchFinger.up();

		expect(spy.called).to.be.true;
		expect(spy.calledOnce).to.be.true;
		expect(spy.lastCall.args[0].originalEvent._simulated).not.to.be.true;
	});

	it('swallows native contextmenu that comes after the simulated one', async () => {
		await touchFinger.down();
		clock.tick(660);

		const nativeEvent = new MouseEvent('contextmenu', {bubbles: true, cancelable: true});
		container.dispatchEvent(nativeEvent);

		expect(spy.calledOnce).to.be.true;
		expect(spy.lastCall.args[0].originalEvent._simulated).to.be.true;
		expect(nativeEvent.defaultPrevented).to.be.true;

		await touchFinger.up();

		// up to the next press only, e.g. a right click
		await mouseFinger.down().up();
		UIEventSimulator.fire('contextmenu', container);
		expect(spy.calledTwice).to.be.true;
	});

	it('prevents native click', async () => {
		const clickSpy = sinon.spy();
		map.on('click', clickSpy);

		await touchFinger.down();
		clock.tick(650);
		await touchFinger.up();
		expect(clickSpy.notCalled).to.be.true;

		await touchFinger.down();
		clock.tick(100);
		await touchFinger.up();
		expect(clickSpy.called).to.be.true;
	});

	it('allows short movements', async () => {
		await touchFinger.down();
		clock.tick(550);
		await touchFinger.moveTo(posNear.x, posNear.y);
		clock.tick(100);
		await touchFinger.up();

		expect(spy.called).to.be.true;
	});

	it('ignores long movements', async () => {
		expect(new Point(posStart.x, posStart.y).distanceTo([posFar.x, posFar.y]))
			.to.be.above(map.options.tapTolerance);

		await touchFinger.down();
		clock.tick(550);
		await touchFinger.moveTo(posFar.x, posFar.y);
		clock.tick(100);
		await touchFinger.up();
		expect(spy.notCalled).to.be.true;

		await touchFinger.down();
		clock.tick(650);
		await touchFinger.up();
		expect(spy.called).to.be.true;
	});

	it('.originalEvent has expected properties', async () => {
		await touchFinger.moveTo(2, 2).down();
		clock.tick(625);
		await touchFinger.up();

		const originalEvent = spy.lastCall.args[0].originalEvent;
		const expectedProps = {
			type: 'contextmenu',
			bubbles: true,
			cancelable: true,
			target: container,
			screenX: 2,
			screenY: 2
		};
		for (const [prop, expectedValue] of Object.entries(expectedProps)) {
			expect(originalEvent[prop]).to.equal(expectedValue);
		}
	});
});
