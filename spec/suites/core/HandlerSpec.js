import {expect} from 'chai';
import {Handler, Map} from 'leaflet';
import sinon from 'sinon';

describe('Handler', () => {
	let map, handler;

	beforeEach(() => {
		map = new Map(document.createElement('div'));
	});

	afterEach(() => {
		map.remove();
	});

	describe('#initialize', () => {
		it('sets the map reference', () => {
			handler = new Handler(map);
			expect(handler._map).to.equal(map);
		});
	});

	describe('#enable', () => {
		it('enables the handler and calls addHooks', () => {
			handler = new Handler(map);
			const addHooksSpy = sinon.spy();
			handler.addHooks = addHooksSpy;

			handler.enable();

			expect(handler.enabled()).to.be.true;
			expect(addHooksSpy.calledOnce).to.be.true;
		});

		it('does not call addHooks twice when already enabled', () => {
			handler = new Handler(map);
			const addHooksSpy = sinon.spy();
			handler.addHooks = addHooksSpy;

			handler.enable();
			handler.enable();

			expect(addHooksSpy.calledOnce).to.be.true;
		});

		it('returns this for chaining', () => {
			handler = new Handler(map);
			handler.addHooks = sinon.spy();

			const result = handler.enable();

			expect(result).to.equal(handler);
		});
	});

	describe('#disable', () => {
		it('disables the handler and calls removeHooks', () => {
			handler = new Handler(map);
			handler.addHooks = sinon.spy();
			handler.removeHooks = sinon.spy();

			handler.enable();
			const removeHooksSpy = handler.removeHooks;

			handler.disable();

			expect(handler.enabled()).to.be.false;
			expect(removeHooksSpy.calledOnce).to.be.true;
		});

		it('does not call removeHooks twice when already disabled', () => {
			handler = new Handler(map);
			handler.addHooks = sinon.spy();
			const removeHooksSpy = sinon.spy();
			handler.removeHooks = removeHooksSpy;

			handler.enable();
			handler.disable();
			handler.disable();

			expect(removeHooksSpy.calledOnce).to.be.true;
		});

		it('returns this for chaining', () => {
			handler = new Handler(map);
			handler.addHooks = sinon.spy();
			handler.removeHooks = sinon.spy();

			handler.enable();
			const result = handler.disable();

			expect(result).to.equal(handler);
		});
	});

	describe('#enabled', () => {
		it('returns false when handler is not enabled', () => {
			handler = new Handler(map);
			expect(handler.enabled()).to.be.false;
		});

		it('returns true when handler is enabled', () => {
			handler = new Handler(map);
			handler.addHooks = sinon.spy();

			handler.enable();

			expect(handler.enabled()).to.be.true;
		});

		it('returns false after disabling', () => {
			handler = new Handler(map);
			handler.addHooks = sinon.spy();
			handler.removeHooks = sinon.spy();

			handler.enable();
			handler.disable();

			expect(handler.enabled()).to.be.false;
		});
	});

	describe('.addTo', () => {
		it('adds handler to map with given name', () => {
			class TestHandler extends Handler {}

			const addHandlerSpy = sinon.spy(map, 'addHandler');

			TestHandler.addTo(map, 'testHandler');

			expect(addHandlerSpy.calledOnce).to.be.true;
			expect(addHandlerSpy.calledWith('testHandler', TestHandler)).to.be.true;

			addHandlerSpy.restore();
		});

		it('returns the handler class for chaining', () => {
			class TestHandler extends Handler {}

			const result = TestHandler.addTo(map, 'testHandler');

			expect(result).to.equal(TestHandler);
		});
	});

	describe('enable/disable lifecycle', () => {
		it('correctly cycles through enable/disable multiple times', () => {
			handler = new Handler(map);
			const addHooksSpy = sinon.spy();
			const removeHooksSpy = sinon.spy();
			handler.addHooks = addHooksSpy;
			handler.removeHooks = removeHooksSpy;

			handler.enable();
			expect(handler.enabled()).to.be.true;
			expect(addHooksSpy.callCount).to.equal(1);

			handler.disable();
			expect(handler.enabled()).to.be.false;
			expect(removeHooksSpy.callCount).to.equal(1);

			handler.enable();
			expect(handler.enabled()).to.be.true;
			expect(addHooksSpy.callCount).to.equal(2);

			handler.disable();
			expect(handler.enabled()).to.be.false;
			expect(removeHooksSpy.callCount).to.equal(2);
		});
	});
});
