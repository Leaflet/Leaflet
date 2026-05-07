import {expect} from 'chai';
import {Class, withInitHooks} from 'leaflet';
import sinon from 'sinon';

describe('Class', () => {
	it('sets default options', () => {
		const instance = new Class();
		expect(Object.hasOwn(instance, 'options')).to.be.true;
		expect(instance.options).to.eql({});
	});

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
});

describe('withInitHooks', () => {
	it('registers and triggers the initialization hooks correctly', () => {
		const constructASpy = sinon.spy();
		const initHookASpy = sinon.spy();
		const constructBSpy = sinon.spy();
		const initHookBSpy = sinon.spy();

		// Give the spies names so they show up properly in logs.
		constructASpy.displayName = 'constructA';
		initHookASpy.displayName = 'initHookA';
		constructBSpy.displayName = 'constructB';
		initHookBSpy.displayName = 'initHookB';

		const A = withInitHooks(class A {
			constructor(argA) {
				this.constructA = 'constructed A';
				this.argA = argA;
				constructASpy(argA);
			}
		});

		const hookAReturnValue = A.addInitHook(function () {
			this.hookedA = 'hooked A';
			initHookASpy();
		});

		const B = withInitHooks(class B extends A {
			constructor(argA, argB) {
				super(argA);
				this.constructB = 'constructed B';
				this.argB = argB;
				constructBSpy(argB);
			}
		});

		const hookBReturnValue = B.addInitHook(function () {
			this.hookedB = 'hooked B';
			initHookBSpy();
		});

		const instance = new B('valueA', 'valueB');

		// Assert that the classes returned by addInitHook are the same as the originals.
		expect(hookAReturnValue).to.equal(A);
		expect(hookBReturnValue).to.equal(B);

		// Assert that constructors and hooks were called in the expected order.
		sinon.assert.callOrder(
			constructASpy,
			initHookASpy,
			constructBSpy,
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

	it('triggers hooks registered with method name and arguments', () => {
		const methodSpy = sinon.spy();

		const TestClass = withInitHooks(class TestClass {
			testMethod(arg1, arg2, arg3) {
				methodSpy(arg1, arg2, arg3);
			}
		});

		TestClass.addInitHook('testMethod', 'value1', 'value2', 'value3');

		new TestClass();

		expect(methodSpy.calledOnce).to.be.true;
		expect(methodSpy.calledWith('value1', 'value2', 'value3')).to.be.true;
	});

	it('throws an error when \'addInitHook()\' is called on an unwrapped named class', () => {
		const WrappedParent = withInitHooks(class WrappedParent {});
		class TestClass extends WrappedParent {}

		expect(() => {
			TestClass.addInitHook(() => {});
		}).to.throw(Error, 'The \'addInitHook()\' method can only be called on classes wrapped with \'withInitHooks()\'. Try wrapping your class:\n\nconst TestClass = withInitHooks(class TestClass { ... });\n');
	});

	it('throws an error when \'addInitHook()\' is called on unwrapped anonymous class', () => {
		const WrappedParent = withInitHooks(class WrappedParent {});
		// Wrapped with an IIFE to prevent the class from getting the name 'TestClass'.
		const TestClass = (() => class extends WrappedParent {})();

		expect(() => {
			TestClass.addInitHook(() => {});
		}).to.throw(Error, 'The \'addInitHook()\' method can only be called on classes wrapped with \'withInitHooks()\'. Try wrapping your class:\n\nconst (anonymous) = withInitHooks(class (anonymous) { ... });\n');
	});

	it('supports chaining of addInitHook calls', () => {
		const spy1 = sinon.spy();
		const spy2 = sinon.spy();

		const TestClass = withInitHooks(class TestClass {});

		const result = TestClass.addInitHook(spy1).addInitHook(spy2);

		expect(result).to.equal(TestClass);

		new TestClass();

		expect(spy1.calledOnce).to.be.true;
		expect(spy2.calledOnce).to.be.true;
	});

	it('preserves class instance', () => {
		const A = withInitHooks(class A {});
		const B = withInitHooks(class B extends A {});

		const a = new A();
		const b = new B();

		expect(a).to.be.instanceOf(A);
		expect(b).to.be.instanceOf(B);
		expect(b).to.be.instanceOf(A);
	});

	it('does not fire parent hooks more than once when constructing a subclass', () => {
		const parentHook = sinon.spy();
		const childHook = sinon.spy();

		const Parent = withInitHooks(class Parent {});
		const Child = withInitHooks(class Child extends Parent {});

		Parent.addInitHook(parentHook);
		Child.addInitHook(childHook);

		new Child();

		expect(parentHook.calledOnce).to.be.true;
		expect(childHook.calledOnce).to.be.true;
	});
});
