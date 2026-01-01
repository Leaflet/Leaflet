import {expect} from 'chai';
import {Class} from 'leaflet';
import sinon from 'sinon';

describe('Class', () => {
	describe('#extends', () => {
		it('merges options instead of replacing them', () => {
			class KlassWithOptions1 extends Class {
				static {
					this.setDefaultOptions({
						foo1: 1,
						foo2: 2
					});
				}
			}
			class KlassWithOptions2 extends KlassWithOptions1 {
				static {
					this.setDefaultOptions({
						foo2: 3,
						foo3: 4
					});
				}
			}

			const a = new KlassWithOptions2();
			expect(a.options.foo1).to.eql(1);
			expect(a.options.foo2).to.eql(3);
			expect(a.options.foo3).to.eql(4);
		});

		it('inherits constructor hooks', async () => {
			const spy1 = sinon.spy(),
			spy2 = sinon.spy();

			class Class1 extends Class {}
			class Class2 extends Class1 {}

			Class1.addInitHook(spy1);
			Class2.addInitHook(spy2);

			const instance = new Class2();
			await instance.callInitHooks();

			expect(spy1.called).to.be.true;
			expect(spy2.called).to.be.true;
		});

		it('does not call child constructor hooks', async () => {
			const spy1 = sinon.spy(),
			spy2 = sinon.spy();

			class Class1 extends Class {}
			class Class2 extends Class1 {}

			Class1.addInitHook(spy1);
			Class2.addInitHook(spy2);

			const instance = new Class1();
			await instance.callInitHooks();

			expect(spy1.called).to.be.true;
			expect(spy2.called).to.eql(false);
		});
	});

	describe('#include', () => {
		let Klass;

		beforeEach(() => {
			Klass = class extends Class {};
		});

		it('returns the class with the extra methods', () => {

			const q = sinon.spy();

			const Qlass = Klass.include({quux: q});

			const a = new Klass();
			const b = new Qlass();

			a.quux();
			expect(q.called).to.be.true;

			b.quux();
			expect(q.called).to.be.true;
		});

		it('keeps parent options', () => { // #6070

			class Quux extends Class {
				static {
					this.setDefaultOptions({foo: 'Foo!'});
				}
			}

			Quux.include({
				options: {bar: 'Bar!'}
			});

			const q = new Quux();
			expect(q.options).to.have.property('foo');
			expect(q.options).to.have.property('bar');
		});

		it('does not reuse original props.options', () => {
			const props = {options: {}};
			const K = Klass.include(props);

			expect(K.prototype.options).not.to.equal(props.options);
		});
	});

	describe('#callInitHooks', () => {
		it('registers and triggers the initialization hooks correctly', async () => {
			const constructASpy = sinon.spy();
			const initHookASpy = sinon.spy();
			const constructBSpy = sinon.spy();
			const initHookBSpy = sinon.spy();

			// Give the spies names so they show up properly in logs.
			constructASpy.displayName = 'constructA';
			initHookASpy.displayName = 'initHookA';
			constructBSpy.displayName = 'constructB';
			initHookBSpy.displayName = 'initHookB';

			class A extends Class {
				constructor(argA) {
					super();
					this.constructA = 'constructed A';
					this.argA = argA;
					constructASpy(argA);
				}
			}

			const hookAReturnValue = A.addInitHook(function () {
				this.hookedA = 'hooked A';
				initHookASpy();
			});

			class B extends A {
				constructor(argA, argB) {
					super(argA);
					this.constructB = 'constructed B';
					this.argB = argB;
					constructBSpy(argB);
				}
			}

			const hookBReturnValue = B.addInitHook(function () {
				this.hookedB = 'hooked B';
				initHookBSpy();
			});

			const instance = new B('valueA', 'valueB');
			await instance.callInitHooks();

			// Assert that the classes returned by addInitHook are the same as the originals.
			expect(hookAReturnValue).to.equal(A);
			expect(hookBReturnValue).to.equal(B);

			// Assert that constructors and hooks were called in the expected order.
			sinon.assert.callOrder(
				constructASpy,
				constructBSpy,
				initHookASpy,
				initHookBSpy
			);

			// Assert that the fields set during construction and hooking are present.
			expect(instance.constructA).to.eql('constructed A');
			expect(instance.hookedA).to.eql('hooked A');
			expect(instance.constructB).to.eql('constructed B');
			expect(instance.hookedB).to.eql('hooked B');

			// Assert that constructor arguments are properly forwarded.
			expect(instance.argA).to.eql('valueA');
			expect(instance.argB).to.eql('valueB');
			expect(constructASpy.calledWith('valueA')).to.be.true;
			expect(constructBSpy.calledWith('valueB')).to.be.true;
		});

		it('triggers hooks registered with method name and arguments', async () => {
			const methodSpy = sinon.spy();

			class TestClass extends Class {
				testMethod(arg1, arg2, arg3) {
					methodSpy(arg1, arg2, arg3);
				}
			}

			TestClass.addInitHook('testMethod', 'value1', 'value2', 'value3');

			const instance = new TestClass();
			await instance.callInitHooks();

			expect(methodSpy.calledOnce).to.be.true;
			expect(methodSpy.calledWith('value1', 'value2', 'value3')).to.be.true;
		});
	});
});
