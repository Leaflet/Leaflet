import {Map, Popup} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Map.Keyboard', () => {
	const KEYCODE_LOWERCASE_A = 'KeyA';
	const KEYCODE_ARROW_LEFT = 'ArrowLeft';
	const KEYCODE_ARROW_UP = 'ArrowUp';
	const KEYCODE_ARROW_RIGHT = 'ArrowRight';
	const KEYCODE_ARROW_DOWN = 'ArrowDown';
	const KEYCODE_PLUS = 'BracketRight';
	const KEYCODE_MINUS = 'Minus';
	const KEYCODE_ESC = 'Escape';

	let map, container;

	beforeEach(() => {
		container = createContainer();
		map = new Map(container, {
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});

		// make keyboard-caused panning instant to cut down on test running time
		map.panBy = function (offset) { return Map.prototype.panBy.call(this, offset, {animate: false}); };

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
			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ARROW_UP});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_ARROW_UP});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ARROW_UP});

			expect(map.getCenter().lat).to.be.greaterThan(0);
		});

		it('move the map south', () => {
			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ARROW_DOWN});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_ARROW_DOWN});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ARROW_DOWN});

			expect(map.getCenter().lat).to.be.lessThan(0);
		});

		it('move the map west', () => {
			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ARROW_LEFT});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_ARROW_LEFT});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ARROW_LEFT});

			expect(map.getCenter().lng).to.be.lessThan(0);
		});

		it('move the map east', () => {
			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ARROW_RIGHT});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_ARROW_RIGHT});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ARROW_RIGHT});

			expect(map.getCenter().lng).to.be.greaterThan(0);
		});

		it('move the map over 180° with worldCopyJump true', () => {
			map.panTo([0, 178], {animate: false});
			map.options.worldCopyJump = true;

			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ARROW_RIGHT});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_ARROW_RIGHT});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ARROW_RIGHT});

			expect(map.getCenter().lng).to.be.lessThan(-178);
		});
	});

	describe('plus/minus keys', () => {
		it('zoom in', () => {
			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_PLUS});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_PLUS});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_PLUS});

			expect(map.getZoom()).to.be.greaterThan(5);
		});

		it('zoom out', () => {
			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_MINUS});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_MINUS});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_MINUS});

			expect(map.getZoom()).to.be.lessThan(5);
		});
	});

	describe('does not move the map if disabled', () => {
		it('no zoom in', () => {

			map.keyboard.disable();

			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_PLUS});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_PLUS});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_PLUS});

			expect(map.getZoom()).to.eql(5);
		});

		it('no move north', () => {

			map.keyboard.disable();

			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ARROW_UP});
			UIEventSimulator.fire('keypress', document, {code: KEYCODE_ARROW_UP});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ARROW_UP});

			expect(map.getCenter().lat).to.eql(0);
		});
	});


	describe('popup closing', () => {
		it('closes a popup when pressing escape', () => {

			const popup = new Popup().setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be.true;

			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ESC});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ESC});

			expect(popup.isOpen()).to.be.false;
		});
	});

	describe('popup closing disabled', () => {
		it('close of popup when pressing escape disabled via options', () => {

			const popup = new Popup({closeOnEscapeKey: false}).setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be.true;

			UIEventSimulator.fire('keydown', document,  {code: KEYCODE_ESC});
			UIEventSimulator.fire('keyup', document,    {code: KEYCODE_ESC});

			expect(popup.isOpen()).to.be.true;
		});
	});

	describe('keys events binding', () => {
		it('keypress', (done) => {
			const keyDownSpy = sinon.spy();
			const keyPressSpy = sinon.spy();
			const keyUpSpy = sinon.spy();

			map.on('keypress', keyPressSpy);
			UIEventSimulator.fire('keypress', container, {code: KEYCODE_LOWERCASE_A});

			setTimeout(() => {
				expect(keyDownSpy.called).to.be.false;
				expect(keyPressSpy.called).to.be.true;
				expect(keyUpSpy.called).to.be.false;
				done();
			}, 50);
		});

		it('keydown', (done) => {
			const keyDownSpy = sinon.spy();
			const keyPressSpy = sinon.spy();
			const keyUpSpy = sinon.spy();

			map.on('keydown', keyDownSpy);
			UIEventSimulator.fire('keydown', container, {code: KEYCODE_LOWERCASE_A});

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
			UIEventSimulator.fire('keyup', container, {code: KEYCODE_LOWERCASE_A});

			setTimeout(() => {
				expect(keyDownSpy.called).to.be.false;
				expect(keyPressSpy.called).to.be.false;
				expect(keyUpSpy.called).to.be.true;
				done();
			}, 50);
		});
	});
});
