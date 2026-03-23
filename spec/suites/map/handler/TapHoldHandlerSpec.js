import {expect} from 'chai';
import {Browser, LeafletMap, Point} from 'leaflet';
import sinon from 'sinon';
import Hand from 'prosthetic-hand';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('TapHoldHandler', () => {
	let container, clock, spy, map;
	let touchHand, mouseHand;
	let touchFinger, touchFinger2, mouseFinger;

	const posStart = {x:1, y:1};
	const posNear = {x:10, y:10};
	const posFar = {x:100, y:100};

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			center: [51.505, -0.09],
			zoom: 13,
			tapHold: true
		});


		// Tap-Hold depends on timing. This means `minimal` mode for prosthetic-hand
		// plus the sinon clock faking performance.now() calls, plus a need to
		// manually tick the sinon clock forward.
		clock = sinon.useFakeTimers({
			toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance']
		});
		clock.tick(1000);
		spy = sinon.spy();

		map.on('contextmenu', spy);

		posStart.target = container;
		posNear.target = container;
		posFar.target = container;

		touchHand = new Hand({timing: 'minimal'});
		touchFinger = touchHand.growFinger('pointer', {pointerType: 'touch', ...posStart});
		touchFinger2 = touchHand.growFinger('pointer', {pointerType: 'touch', ...posStart});
		mouseHand = new Hand({timing: 'minimal'});
		mouseFinger = mouseHand.growFinger('pointer', {pointerType: 'mouse', ...posStart});
	});

	afterEach(() => {
		clock.restore();
		removeMapContainer(map, container);
	});

	it('fires synthetic contextmenu after hold delay>600', () => {
		touchFinger.moveTo(posStart.x, posStart.y).down().wait(550);
		clock.tick(550);

		expect(spy.notCalled).to.be.true;

		touchFinger.wait(100);
		clock.tick(100);

		expect(spy.called).to.be.true;
		expect(spy.calledOnce).to.be.true;

		const event = spy.lastCall.args[0];
		expect(event.type).to.equal('contextmenu');
		expect(event.originalEvent._simulated).to.be.true;
		touchFinger.up();
	});

	it('does not fire contextmenu when multiple pointers touches', () => {

		touchFinger.down().wait(100).up();
		touchFinger2.down().wait(600).up();
		clock.tick(1000);

		expect(spy.notCalled).to.be.true;
	});

	it('does not fire contextmenu when multiple pointers touches > 1 (case:2)', () => {
		expect(spy.notCalled).to.be.true;

		touchFinger.down().wait(650).up();
		touchFinger2.wait(100).down();

		clock.tick(750);

		expect(spy.notCalled).to.be.true;
	});

	(Browser.pointer ? it : it.skip)('ignores events from mouse', () => {
		mouseFinger.down().wait(650).up();
		clock.tick(750);

		expect(spy.notCalled).to.be.true;
	});

	it('does not conflict with native contextmenu', () => {

		touchFinger.down().wait(550);
		clock.tick(560);

		UIEventSimulator.fire('contextmenu', container);

		touchFinger.wait(100).up();
		clock.tick(110);

		expect(spy.called).to.be.true;
		expect(spy.calledOnce).to.be.true;
		expect(spy.lastCall.args[0].originalEvent._simulated).not.to.be.true;

		// Note: depending on tapHoldDelay value it's also possible that native contextmenu may come after simulated one
		//       and the only way to handle this gracefully - increase tapHoldDelay value.
		//       Anyway that is edge case, as tapHold is meant for browsers where native contextmenu is not fired on touch.
	});

	it('prevents native click', () => {
		const clickSpy = sinon.spy();
		map.on('click', clickSpy);

		touchFinger.down().wait(650).up();
		clock.tick(660);
		expect(clickSpy.notCalled).to.be.true;

		touchFinger.down().wait(100).up();
		clock.tick(110);
		expect(clickSpy.called).to.be.true;
	});

	it('allows short movements', () => {
		touchFinger.down().wait(550).moveTo(posNear.x, posNear.y).wait(100).up();

		clock.tick(660);

		expect(spy.called).to.be.true;
	});

	it('ignores long movements', () => {
		expect(new Point(posStart.x, posStart.y).distanceTo([posFar.x, posFar.y]))
			.to.be.above(map.options.tapTolerance);

		touchFinger.down().wait(550).moveTo(posFar.x, posFar.y).wait(100).up();
		clock.tick(660);
		expect(spy.notCalled).to.be.true;

		touchFinger.down().wait(550).wait(100).up();
		clock.tick(660);
		expect(spy.called).to.be.true;
	});

	it('.originalEvent has expected properties', () => {

		touchFinger.moveTo(2, 2).down().wait(625).up();

		// UIEventSimulator.fire('pointerdown', container, {pointerId:0, ...posStart});
		clock.tick(650);

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
