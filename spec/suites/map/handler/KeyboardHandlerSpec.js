import {LeafletMap, Popup} from 'leaflet';
import sinon from 'sinon';
import {userEvent} from 'vitest/browser';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('KeyboardHandler', () => {
	const KEY_LOWERCASE_A = {key: 'a', code: 'KeyA'};
	const KEY_ARROW_LEFT = {key: 'ArrowLeft', code: 'ArrowLeft'};
	const KEY_ARROW_UP = {key: 'ArrowUp', code: 'ArrowUp'};
	const KEY_ARROW_RIGHT = {key: 'ArrowRight', code: 'ArrowRight'};
	const KEY_ARROW_DOWN = {key: 'ArrowDown', code: 'ArrowDown'};
	const KEY_PLUS = {key: '=', code: 'Equal'};
	const KEY_MINUS = {key: '-', code: 'Minus'};
	const KEY_ESC = {key: 'Escape', code: 'Escape'};

	let map, container;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});

		// make keyboard-caused panning instant to cut down on test running time
		map.panBy = function (offset) { return LeafletMap.prototype.panBy.call(this, offset, {animate: false}); };

		map.setView([0, 0], 5);

		// Keyboard functionality expects the map to be focused (clicked or cycle-tabbed)
		// However this can only happen with trusted events (non-synthetic), so
		// this bit has to be faked.
		map.keyboard._onFocus();
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('arrow keys', () => {
		it('move the map north', () => {
			UIEventSimulator.fire('keydown', document,  KEY_ARROW_UP);
			UIEventSimulator.fire('keypress', document, KEY_ARROW_UP);
			UIEventSimulator.fire('keyup', document,    KEY_ARROW_UP);

			expect(map.getCenter().lat).to.be.greaterThan(0);
		});

		it('move the map south', () => {
			UIEventSimulator.fire('keydown', document,  KEY_ARROW_DOWN);
			UIEventSimulator.fire('keypress', document, KEY_ARROW_DOWN);
			UIEventSimulator.fire('keyup', document,    KEY_ARROW_DOWN);

			expect(map.getCenter().lat).to.be.lessThan(0);
		});

		it('move the map west', () => {
			UIEventSimulator.fire('keydown', document,  KEY_ARROW_LEFT);
			UIEventSimulator.fire('keypress', document, KEY_ARROW_LEFT);
			UIEventSimulator.fire('keyup', document,    KEY_ARROW_LEFT);

			expect(map.getCenter().lng).to.be.lessThan(0);
		});

		it('move the map east', () => {
			UIEventSimulator.fire('keydown', document,  KEY_ARROW_RIGHT);
			UIEventSimulator.fire('keypress', document, KEY_ARROW_RIGHT);
			UIEventSimulator.fire('keyup', document,    KEY_ARROW_RIGHT);

			expect(map.getCenter().lng).to.be.greaterThan(0);
		});

		it('move the map over 180° with worldCopyJump true', () => {
			map.panTo([0, 178], {animate: false});
			map.options.worldCopyJump = true;

			UIEventSimulator.fire('keydown', document,  KEY_ARROW_RIGHT);
			UIEventSimulator.fire('keypress', document, KEY_ARROW_RIGHT);
			UIEventSimulator.fire('keyup', document,    KEY_ARROW_RIGHT);

			expect(map.getCenter().lng).to.be.lessThan(-178);
		});
	});

	describe('plus/minus keys', () => {
		it('zoom in', () => {
			UIEventSimulator.fire('keydown', document,  KEY_PLUS);
			UIEventSimulator.fire('keypress', document, KEY_PLUS);
			UIEventSimulator.fire('keyup', document,    KEY_PLUS);

			expect(map.getZoom()).to.be.greaterThan(5);
		});

		it('zoom out', () => {
			UIEventSimulator.fire('keydown', document,  KEY_MINUS);
			UIEventSimulator.fire('keypress', document, KEY_MINUS);
			UIEventSimulator.fire('keyup', document,    KEY_MINUS);

			expect(map.getZoom()).to.be.lessThan(5);
		});

		it('zoom in with the numpad', () => {
			UIEventSimulator.fire('keydown', document, {key: '+', code: 'NumpadAdd'});
			expect(map.getZoom()).to.equal(6);
		});

		it('zoom by the character typed, not the key position', () => {
			// on Nordic layouts, the key right of 0 (`Minus` on US) types `+`
			UIEventSimulator.fire('keydown', document, {key: '+', code: 'Minus'});
			expect(map.getZoom()).to.equal(6);
		});

		it('ignore keys that only type + or - on other layouts', () => {
			for (const [key, code] of [[']', 'BracketRight'], ['6', 'Digit6'], ['/', 'Slash']]) {
				UIEventSimulator.fire('keydown', document, {key, code});
			}
			expect(map.getZoom()).to.equal(5);
		});

		it('ignores zoom keys right after a zoom without animation, like an animated zoom does', () => {
			const clock = sinon.useFakeTimers({toFake: ['Date']});
			try {
				UIEventSimulator.fire('keydown', document, KEY_PLUS);
				UIEventSimulator.fire('keydown', document, KEY_PLUS);
				expect(map.getZoom()).to.equal(6);

				clock.tick(250);
				UIEventSimulator.fire('keydown', document, KEY_PLUS);
				expect(map.getZoom()).to.equal(7);
			} finally {
				clock.restore();
			}
		});
	});

	describe('does not move the map if disabled', () => {
		it('no zoom in', () => {

			map.keyboard.disable();

			UIEventSimulator.fire('keydown', document,  KEY_PLUS);
			UIEventSimulator.fire('keypress', document, KEY_PLUS);
			UIEventSimulator.fire('keyup', document,    KEY_PLUS);

			expect(map.getZoom()).to.eql(5);
		});

		it('no move north', () => {

			map.keyboard.disable();

			UIEventSimulator.fire('keydown', document,  KEY_ARROW_UP);
			UIEventSimulator.fire('keypress', document, KEY_ARROW_UP);
			UIEventSimulator.fire('keyup', document,    KEY_ARROW_UP);

			expect(map.getCenter().lat).to.eql(0);
		});
	});


	describe('popup closing', () => {
		it('closes a popup when pressing escape', () => {

			const popup = new Popup().setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be.true;

			UIEventSimulator.fire('keydown', document,  KEY_ESC);
			UIEventSimulator.fire('keyup', document,    KEY_ESC);

			expect(popup.isOpen()).to.be.false;
		});
	});

	describe('popup closing disabled', () => {
		it('close of popup when pressing escape disabled via options', () => {

			const popup = new Popup({closeOnEscapeKey: false}).setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be.true;

			UIEventSimulator.fire('keydown', document,  KEY_ESC);
			UIEventSimulator.fire('keyup', document,    KEY_ESC);

			expect(popup.isOpen()).to.be.true;
		});
	});

	describe('keys events binding', () => {
		it('keypress is not fired', () => {
			const keyPressSpy = sinon.spy();

			const errorStub = sinon.stub(console, 'error');
			try {
				map.on('keypress', keyPressSpy);
			} finally {
				errorStub.restore();
			}
			UIEventSimulator.fire('keypress', container, KEY_LOWERCASE_A);

			expect(keyPressSpy.called).to.be.false;
		});

		it('keydown', (done) => {
			const keyDownSpy = sinon.spy();
			const keyPressSpy = sinon.spy();
			const keyUpSpy = sinon.spy();

			map.on('keydown', keyDownSpy);
			UIEventSimulator.fire('keydown', container, KEY_LOWERCASE_A);

			setTimeout(() => {
				expect(keyDownSpy.called).to.be.true;
				expect(keyPressSpy.called).to.be.false;
				expect(keyUpSpy.called).to.be.false;
				done();
			}, 50);
		});

		it('keyup', (done) => {
			const keyDownSpy = sinon.spy();
			const keyPressSpy = sinon.spy();
			const keyUpSpy = sinon.spy();

			map.on('keyup', keyUpSpy);
			UIEventSimulator.fire('keyup', container, KEY_LOWERCASE_A);

			setTimeout(() => {
				expect(keyDownSpy.called).to.be.false;
				expect(keyPressSpy.called).to.be.false;
				expect(keyUpSpy.called).to.be.true;
				done();
			}, 50);
		});
	});

	describe('aria-keyshortcuts', () => {
		it('is not set by default', () => {
			expect(container.hasAttribute('aria-keyshortcuts')).to.be.false;
		});

		it('is set with ariaKeyShortcuts and removed when the handler is disabled', () => {
			const container2 = createContainer();
			const map2 = new LeafletMap(container2, {ariaKeyShortcuts: true});

			expect(container2.getAttribute('aria-keyshortcuts')).to.equal('ArrowLeft ArrowRight ArrowUp ArrowDown = Plus -');

			map2.keyboard.disable();
			expect(container2.hasAttribute('aria-keyshortcuts')).to.be.false;

			removeMapContainer(map2, container2);
		});

		it('takes a custom value', () => {
			const container2 = createContainer();
			const map2 = new LeafletMap(container2, {ariaKeyShortcuts: 'ArrowLeft ArrowRight ArrowUp ArrowDown Plus -'});

			expect(container2.getAttribute('aria-keyshortcuts')).to.equal('ArrowLeft ArrowRight ArrowUp ArrowDown Plus -');

			removeMapContainer(map2, container2);
		});
	});

	describe('focus on click', () => {
		it('focuses the map without a focus ring', async () => {
			map.keyboard._onBlur();
			await userEvent.click(container, {position: {x: 50, y: 50}});

			expect(document.activeElement).to.equal(container);
			expect(container.matches(':focus-visible')).to.be.false;
		});
	});
});
