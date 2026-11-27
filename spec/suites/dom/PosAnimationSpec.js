import {PosAnimation} from '../../../src/dom/PosAnimation.js';
import {LeafletMap} from 'leaflet';
import * as DomUtil from '../../../src/dom/DomUtil.js';
import {Point} from '../../../src/geometry/Point.js';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('PosAnimation cancellation ownership', () => {
	let clock, frames, nextId, animation, element;
	beforeEach(() => {
		clock = sinon.useFakeTimers({toFake: ['Date']});
		frames = new Map();
		nextId = 0;
		sinon.stub(window, 'requestAnimationFrame').callsFake((fn) => {
			frames.set(++nextId, fn);
			return nextId;
		});
		sinon.stub(window, 'cancelAnimationFrame').callsFake(id => frames.delete(id));
		animation = new PosAnimation();
		element = document.createElement('div');
		DomUtil.setPosition(element, new Point(0, 0));
	});
	afterEach(() => {
		sinon.restore();
		clock.restore();
	});
	function frame() {
		const callbacks = [...frames.values()];
		frames.clear();
		for (const fn of callbacks) { fn(); }
	}

	it('completes an ordinary animation once', () => {
		const end = sinon.spy();
		animation.on('end', end);
		animation.run(element, new Point(100, 0), 1);
		clock.tick(1000);
		frame();
		expect(end.callCount).to.equal(1);
		expect(frames.size).to.equal(0);
		expect(DomUtil.getPosition(element)).to.eql(new Point(100, 0));
	});

	it('does not resume an animation stopped by its start listener', () => {
		const step = sinon.spy(), end = sinon.spy();
		animation.on('start', () => animation.stop()).on('step', step).on('end', end);
		animation.run(element, new Point(100, 0), 1);
		expect(end.callCount).to.equal(1);
		expect(step.callCount).to.equal(1);
		expect(frames.size).to.equal(0);
	});

	it('does not recursively stop from a step listener', () => {
		let steps = 0;
		const end = sinon.spy();
		animation.on('step', () => {
			if (++steps < 8) { animation.stop(); }
		}).on('end', end);
		animation.run(element, new Point(100, 0), 1);
		expect(end.callCount).to.equal(1);
		expect(steps).to.equal(2);
		expect(frames.size).to.equal(0);
	});

	it('does not complete twice when stopped after the duration elapses', () => {
		const end = sinon.spy();
		animation.on('end', end);
		animation.run(element, new Point(100, 0), 1);
		clock.tick(1000);
		animation.stop();
		expect(end.callCount).to.equal(1);
		expect(frames.size).to.equal(0);
	});

	it('keeps a replacement started by the final step listener running', () => {
		const end = sinon.spy();
		let replace = true;
		animation.on('end', end).on('step', () => {
			if (replace && clock.now === 1000) {
				replace = false;
				animation.run(element, new Point(200, 0), 1);
			}
		});
		animation.run(element, new Point(100, 0), 1);
		clock.tick(1000);
		frame();
		expect(frames.size).to.equal(1);
		clock.tick(1000);
		frame();
		expect(DomUtil.getPosition(element)).to.eql(new Point(200, 0));
		expect(end.callCount).to.equal(2);
	});

	it('keeps a replacement started by an end listener running', () => {
		let replace = true;
		animation.on('end', () => {
			if (replace) {
				replace = false;
				animation.run(element, new Point(200, 0), 1);
			}
		});
		animation.run(element, new Point(100, 0), 1);
		animation.stop();
		expect(frames.size).to.equal(1);
		clock.tick(1000);
		frame();
		expect(DomUtil.getPosition(element)).to.eql(new Point(200, 0));
	});

	it('keeps only the replacement started by a start listener', () => {
		let replace = true;
		animation.on('start', () => {
			if (replace) {
				replace = false;
				animation.run(element, new Point(200, 0), 1);
			}
		});
		animation.run(element, new Point(100, 0), 1);
		expect(frames.size).to.equal(1);
		clock.tick(1000);
		frame();
		expect(DomUtil.getPosition(element)).to.eql(new Point(200, 0));
	});

	it('does not overwrite a newer run started while stopping the previous one', () => {
		animation.run(element, new Point(100, 0), 1);
		animation.once('end', () => animation.run(element, new Point(300, 0), 1));
		animation.run(element, new Point(200, 0), 1);
		expect(frames.size).to.equal(1);
		clock.tick(1000);
		frame();
		expect(DomUtil.getPosition(element)).to.eql(new Point(300, 0));
	});

	it('lets a move listener replace a pan at its final frame', () => {
		const container = createContainer();
		const map = new LeafletMap(container).setView([0, 0], 3);
		let replace = true;
		map.on('move', () => {
			if (replace && clock.now === 1000) {
				replace = false;
				map.panTo([0, 20], {animate: true, duration: 1});
			}
		});
		try {
			map.panBy([100, 0], {animate: true, duration: 1});
			clock.tick(1000);
			frame();
			expect(frames.size).to.equal(1);
			clock.tick(1000);
			frame();
			expect(map.getCenter()).to.be.nearLatLng([0, 20], 0.2);
		} finally {
			map.off('move');
			removeMapContainer(map, container);
		}
	});
});
