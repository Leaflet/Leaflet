import * as L from 'leaflet';
import {Class, Evented, Layer, LeafletMap, Polygon, Marker} from 'leaflet';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

const ownConstructorRe = /^\s*constructor\s*\(/m;

describe('Class', () => {
	describe('constructor', () => {
		it('throws on a class that defines initialize()', () => {
			class OldStyle extends Class {
				initialize() {}
			}
			expect(() => new OldStyle()).to.throw('OldStyle: initialize() is not called');
		});

		it('throws when initialize() is called from a constructor', () => {
			class HalfPorted extends Class {
				constructor() {
					super();
					this.initialize();
				}
				initialize() {}
			}
			expect(() => new HalfPorted()).to.throw('Rename it to constructor()');
		});
	});

	describe('defaultOptions', () => {
		it('inherits and overrides parent defaults', () => {
			class Klass1 extends Class {
				static defaultOptions = {foo1: 1, foo2: 2};
			}
			class Klass2 extends Klass1 {
				static defaultOptions = {foo2: 3, foo3: 4};
			}

			const a = new Klass2();
			expect(a.options.foo1).to.eql(1);
			expect(a.options.foo2).to.eql(3);
			expect(a.options.foo3).to.eql(4);
		});

		it('gives every instance its own options', () => {
			class Klass extends Class {}
			const a = new Klass();
			expect(a.options).to.eql({});
			expect(Object.hasOwn(a, 'options')).to.be.true;
		});

		it('keeps defaults live for instances and subclasses', () => {
			class Klass1 extends Class {
				static defaultOptions = {foo: 1};
			}
			class Klass2 extends Klass1 {
				static defaultOptions = {bar: 2};
			}

			const a = new Klass2();
			Klass1.defaultOptions.foo = 5;
			expect(a.options.foo).to.eql(5);
			expect(new Klass2().options.foo).to.eql(5);
		});

		it('chains a class that declares defaults below one that does not', () => {
			class Klass1 extends Class {
				static defaultOptions = {foo: 1};
			}
			class Klass2 extends Klass1 {}
			class Klass3 extends Klass2 {
				static defaultOptions = {bar: 2};
			}

			const a = new Klass3();
			expect(a.options.foo).to.eql(1);
			expect(a.options.bar).to.eql(2);
		});

		it('is chained for built-in classes', () => {
			const marker = new Marker([0, 0]);
			expect(marker.options.pane).to.eql('markerPane');
			expect(marker.options.bubblingPointerEvents).to.be.false;
			expect(Object.getPrototypeOf(Marker.defaultOptions)).to.equal(Layer.defaultOptions);
		});
	});

	describe('#mergeOptions', () => {
		it('merges into the defaults of the class', () => {
			class Klass extends Class {
				static defaultOptions = {foo: 1};
			}
			Klass.mergeOptions({bar: 2});

			const a = new Klass();
			expect(a.options.foo).to.eql(1);
			expect(a.options.bar).to.eql(2);
		});

		it('does not write into parent defaults', () => {
			class Parent extends Class {
				static defaultOptions = {foo: 1};
			}
			class Child extends Parent {}

			Child.mergeOptions({foo: 2, bar: 3});

			expect(Parent.defaultOptions).to.eql({foo: 1});
			expect(new Parent().options.bar).to.be.undefined;
			expect(new Child().options.foo).to.eql(2);
			expect(new Child().options.bar).to.eql(3);
		});

		it('keeps parent defaults live after creating own defaults', () => {
			class Parent extends Class {
				static defaultOptions = {foo: 1};
			}
			class Child extends Parent {}

			Child.mergeOptions({bar: 2});
			Parent.mergeOptions({foo: 5});

			expect(new Child().options.foo).to.eql(5);
		});

		it('works with the deprecated setDefaultOptions in a static block', () => {
			class Parent extends Class {
				static defaultOptions = {foo: 1};
			}
			class Child extends Parent {
				static {
					this.setDefaultOptions({bar: 2});
				}
			}

			const a = new Child();
			expect(a.options.foo).to.eql(1);
			expect(a.options.bar).to.eql(2);
			expect(Parent.defaultOptions).to.eql({foo: 1});
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
				static defaultOptions = {foo: 'Foo!'};
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

			expect(K.defaultOptions).not.to.equal(props.options);
			expect(K.prototype.options).to.be.undefined;
		});

		it('includes methods of a class prototype without replacing the constructor', () => {
			Klass.include(Evented.prototype);

			const a = new Klass();
			expect(a.on).to.equal(Evented.prototype.on);
			expect(a.constructor).to.equal(Klass);
		});

		it('includes Evented methods that work without its constructor', () => {
			Klass.include(Evented.prototype);

			const a = new Klass(),
			spy1 = sinon.spy(),
			spy2 = sinon.spy();

			a.once('test', spy1);
			a.on('test', spy2);
			a.fire('test');

			expect(spy1.calledOnce).to.be.true;
			expect(spy2.calledOnce).to.be.true;
		});
	});

	describe('#addInitHook', () => {
		it('inherits constructor hooks', () => {
			const spy1 = sinon.spy(),
			spy2 = sinon.spy();

			class Class1 extends Class {}
			class Class2 extends Class1 {}

			Class1.addInitHook(spy1);
			Class2.addInitHook(spy2);

			new Class2();

			expect(spy1.calledOnce).to.be.true;
			expect(spy2.calledOnce).to.be.true;
			expect(spy1.calledBefore(spy2)).to.be.true;
		});

		it('does not call child constructor hooks', () => {
			const spy1 = sinon.spy(),
			spy2 = sinon.spy();

			class Class1 extends Class {}
			class Class2 extends Class1 {}

			Class1.addInitHook(spy1);
			Class2.addInitHook(spy2);

			new Class1();

			expect(spy1.called).to.be.true;
			expect(spy2.called).to.eql(false);
		});

		it('calls a method by name with arguments', () => {
			const spy = sinon.spy();

			class Klass extends Class {
				foo(...args) { spy(this, ...args); }
			}
			Klass.addInitHook('foo', 1, 2);

			const a = new Klass();
			expect(spy.calledOnceWith(a, 1, 2)).to.be.true;
		});

		it('runs hooks added after the first instance was created', () => {
			const spy = sinon.spy();

			class Klass extends Class {}
			new Klass();
			Klass.addInitHook(spy);
			new Klass();

			expect(spy.calledOnce).to.be.true;
		});

		it('runs hooks after the constructor of the deepest marked class', () => {
			const log = [];

			class Class1 extends Class {
				static initHooks = true;
				constructor() {
					super();
					log.push('Class1');
					this.callInitHooks();
				}
			}
			class Class2 extends Class1 {
				static initHooks = true;
				constructor() {
					super();
					log.push('Class2');
					this.callInitHooks();
				}
			}
			class Class3 extends Class2 {
				constructor() {
					super();
					log.push('Class3');
				}
			}
			Class1.addInitHook(() => log.push('hook1'));
			Class3.addInitHook(() => log.push('hook3'));

			new Class3();
			expect(log).to.eql(['Class1', 'Class2', 'hook1', 'hook3', 'Class3']);
		});

		it('runs hooks once per instance when a hook creates another instance', () => {
			const spy = sinon.spy();
			let nested;

			class Klass extends Class {}
			Klass.addInitHook(function () {
				spy(this);
				if (spy.callCount === 1) {
					nested = new Klass();
				}
			});

			const a = new Klass();
			expect(spy.callCount).to.eql(2);
			expect(spy.calledWith(a)).to.be.true;
			expect(spy.calledWith(nested)).to.be.true;
		});

		it('runs a Layer hook on a fully built Polygon, once', () => {
			const spy = sinon.spy();
			let enabled = true;

			Layer.addInitHook(function () {
				if (enabled) { spy(this._latlngs); }
			});
			new Polygon([[0, 0], [0, 1], [1, 1]]);
			enabled = false;

			expect(spy.calledOnce).to.be.true;
			expect(spy.firstCall.args[0]).to.not.be.undefined;
		});

		it('adds one zoom control to a map subclass', () => { // #10294
			class NewMap extends LeafletMap {}
			const container = createContainer();
			const map = new NewMap(container);

			expect(container.querySelectorAll('.leaflet-control-zoom').length).to.eql(1);
			expect(map.dragging).to.be.ok;

			removeMapContainer(map, container);
		});
	});

	describe('built-in classes', () => {
		const classes = Object.entries(L)
			.filter(([, value]) => typeof value === 'function' && value.prototype instanceof Class);

		const hasOwnConstructor = Cls => ownConstructorRe.test(Function.prototype.toString.call(Cls));

		it('mark every class with its own constructor with initHooks', () => {
			const unmarked = classes
				.filter(([, Cls]) => hasOwnConstructor(Cls) && !Object.hasOwn(Cls, 'initHooks'))
				.map(([name]) => name);
			expect(unmarked).to.eql([]);
		});

		it('run a hook on Class exactly once per instance', () => {
			const container = createContainer();
			const map = new LeafletMap(container);
			const marker = new Marker([0, 0]).addTo(map);

			const args = {
				LeafletMap: () => [createContainer()],
				Map: () => [createContainer()],
				Marker: () => [[0, 0]],
				CircleMarker: () => [[0, 0]],
				Circle: () => [[0, 0], {radius: 10}],
				Polyline: () => [[[0, 0], [1, 1]]],
				Polygon: () => [[[0, 0], [1, 1], [1, 0]]],
				Rectangle: () => [[[0, 0], [1, 1]]],
				ImageOverlay: () => ['', [[0, 0], [1, 1]]],
				VideoOverlay: () => ['', [[0, 0], [1, 1]]],
				SVGOverlay: () => [document.createElementNS('http://www.w3.org/2000/svg', 'svg'), [[0, 0], [1, 1]]],
				TileLayer: () => [''],
				WMSTileLayer: () => ['', {}],
				Draggable: () => [document.createElement('div')],
				MarkerDrag: () => [marker],
			};

			const runs = new Map();
			let recording = true;
			Class.addInitHook(function () {
				if (recording) { runs.set(this, (runs.get(this) ?? 0) + 1); }
			});

			const failed = [];
			for (const [name, Cls] of classes) {
				const instance = new Cls(...(args[name]?.() ?? (Cls.prototype instanceof L.Handler ? [map] : [])));
				if (runs.get(instance) !== 1) { failed.push(`${name}: ${runs.get(instance) ?? 0}`); }
				if (instance instanceof LeafletMap) { instance.remove(); }
			}
			recording = false;

			expect(failed).to.eql([]);

			removeMapContainer(map, container);
		});
	});
});
