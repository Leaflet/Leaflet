import {expect} from 'chai';
import {Class, Evented} from 'leaflet';
import sinon from 'sinon';

describe('Class', () => {
	it('sets default options', () => {
		const instance = new Class();
		expect(Object.hasOwn(instance, 'options')).to.be.true;
		expect(instance.options).to.eql({});
	});

	it('calls \'initialize()\' automatically with constructor arguments', () => {
		const spy = sinon.spy();
		const warnSpy = sinon.spy(console, 'warn');

		class TestClass extends Class {
			initialize(...args) {
				spy(...args);
			}
		}

		new TestClass(1, 2, 3);
		console.warn.restore();

		expect(spy.calledWith(1, 2, 3)).to.be.true;
		expect(warnSpy.calledWith('The \'initialize()\' method is deprecated, use a class constructor instead.')).to.be.true;
	});
});

describe('Class#extend', () => {
	let Klass,
	props,
	constructor,
	method;

	beforeEach(() => {
		constructor = sinon.spy();
		method = sinon.spy();

		props = {
			statics: {bla: 1},
			includes: {mixin: true},

			initialize: constructor,
			foo: 5,
			bar: method
		};
		Klass = Class.extend(props);
	});

	it('creates a class with the given constructor & properties', () => {
		const a = new Klass();

		expect(constructor.called).to.be.true;
		expect(a.foo).to.eql(5);

		a.bar();

		expect(method.called).to.be.true;
	});

	it('calls the correct parent initialize function', () => {
		const initialize = sinon.spy();
		const initializeDraw = sinon.spy();
		const initializeEdit = sinon.spy();
		const Toolbar = Class.extend({
			initialize() {
				initialize();
			}
		});
		Toolbar.include(Evented.prototype);
		const DrawToolbar = Toolbar.extend({
			initialize(options) {
				initializeDraw();
				Toolbar.prototype.initialize.call(this, options);
			}
		});
		const EditToolbar = Toolbar.extend({
			initialize(options) {
				initializeEdit();
				Toolbar.prototype.initialize.call(this, options);
			}
		});

		new Toolbar();
		sinon.assert.calledOnce(initialize);
		sinon.assert.notCalled(initializeDraw);
		sinon.assert.notCalled(initializeEdit);
		initialize.resetHistory();

		new DrawToolbar();
		sinon.assert.callOrder(initializeDraw, initialize);
		sinon.assert.notCalled(initializeEdit);
		initialize.resetHistory();
		initializeDraw.resetHistory();

		new EditToolbar();
		sinon.assert.callOrder(initializeEdit, initialize);
		sinon.assert.notCalled(initializeDraw);
	});

	it('inherits parent classes\' constructor & properties', () => {
		const Klass2 = Klass.extend({baz: 2});

		const b = new Klass2();

		expect(b instanceof Klass).to.be.true;
		expect(b instanceof Klass2).to.be.true;

		expect(constructor.called).to.be.true;
		expect(b.baz).to.eql(2);

		b.bar();

		expect(method.called).to.be.true;
	});

	it('does not modify source props object', () => {
		expect(props).to.eql({
			statics: {bla: 1},
			includes: {mixin: true},

			initialize: constructor,
			foo: 5,
			bar: method
		});
	});

	it('supports static properties', () => {
		expect(Klass.bla).to.eql(1);
	});

	it('does not merge \'statics\' property itself', () => {
		expect('statics' in Klass.prototype).to.be.false;
	});

	it('inherits parent static properties', () => {
		const Klass2 = Klass.extend({});

		expect(Klass2.bla).to.eql(1);
	});

	it('overrides parent static properties', () => {
		const Klass2 = Klass.extend({statics: {bla: 2}});

		expect(Klass2.bla).to.eql(2);
	});

	it('includes the given mixin', () => {
		const a = new Klass();
		expect(a.mixin).to.be.true;
	});

	it('does not merge \'includes\' property itself', () => {
		expect('includes' in Klass.prototype).to.be.false;
	});

	it('includes multiple mixins', () => {
		const Klass2 = Class.extend({
			includes: [{mixin: true}, {mixin2: true}]
		});
		const a = new Klass2();

		expect(a.mixin).to.be.true;
		expect(a.mixin2).to.be.true;
	});

	it('includes Evented mixins', () => {
		const Klass2 = Class.extend({
			includes: Evented.prototype
		});
		const a = new Klass2();

		expect(a.on).to.eql(Evented.prototype.on);
		expect(a.off).to.eql(Evented.prototype.off);
	});

	it('includes inherited mixins', () => {
		class A {
			foo() {}
		}
		class B extends A {
			bar() {}
		}
		const Klass2 = Class.extend({
			includes: B.prototype
		});
		const a = new Klass2();

		expect(a.bar).to.eql(B.prototype.bar);
		expect(a.foo).to.eql(B.prototype.foo);
	});

	it('grants the ability to include the given mixin', () => {
		Klass.include({mixin2: true});

		const a = new Klass();
		expect(a.mixin2).to.be.true;
	});

	it('merges options instead of replacing them', () => {
		const KlassWithOptions1 = Class.extend({
			options: {
				foo1: 1,
				foo2: 2
			}
		});
		const KlassWithOptions2 = KlassWithOptions1.extend({
			options: {
				foo2: 3,
				foo3: 4
			}
		});

		const a = new KlassWithOptions2();
		expect(a.options.foo1).to.eql(1);
		expect(a.options.foo2).to.eql(3);
		expect(a.options.foo3).to.eql(4);
	});

	it('gives new classes a distinct options object', () => {
		const K1 = Class.extend({options: {}});
		const K2 = K1.extend({});
		expect(K2.prototype.options).not.to.equal(K1.prototype.options);
	});

	it('inherits options prototypally', () => {
		const K1 = Class.extend({options: {}});
		const K2 = K1.extend({options: {}});
		K1.prototype.options.foo = 'bar';
		expect(K2.prototype.options.foo).to.eql('bar');
	});

	it('does not reuse original props.options', () => {
		const props = {options: {}};
		const K = Class.extend(props);

		expect(K.prototype.options).not.to.equal(props.options);
	});

	it('does not replace source props.options object', () => {
		const K1 = Class.extend({options: {}});
		const opts = {};
		const props = {options: opts};
		K1.extend(props);

		expect(props.options).to.equal(opts);
	});

	it('prevents change of prototype options', () => {
		const Klass = Class.extend({options: {}});
		const instance = new Klass();
		expect(Klass.prototype.options).to.not.equal(instance.options);
	});

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

	it('automatically adds support for initialization hooks', () => {
		const TestClass = Class.extend({});
		expect(TestClass.addInitHook).to.be.a('function');
	});
});

describe('Class#include', () => {
	let Klass;

	beforeEach(() => {
		Klass = Class.extend({});
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

		const Quux = Class.extend({
			options: {foo: 'Foo!'}
		});

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

	it('does not replace source props.options object', () => {
		const K1 = Klass.include({options: {}});
		const opts = {};
		const props = {options: opts};
		K1.extend(props);

		expect(props.options).to.equal(opts);
	});
});
