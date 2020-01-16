describe("Class", function () {

	describe("#extend", function () {
		var Klass,
		    constructor,
		    method;

		beforeEach(function () {
			constructor = sinon.spy();
			method = sinon.spy();

			Klass = L.Class.extend({
				statics: {bla: 1},
				includes: {mixin: true},

				initialize: constructor,
				foo: 5,
				bar: method
			});
		});

		it("creates a class with the given constructor & properties", function () {
			var a = new Klass();

			expect(constructor.called).to.be.ok();
			expect(a.foo).to.eql(5);

			a.bar();

			expect(method.called).to.be.ok();
		});

		it("inherits parent classes' constructor & properties", function () {
			var Klass2 = Klass.extend({baz: 2});

			var b = new Klass2();

			expect(b instanceof Klass).to.be.ok();
			expect(b instanceof Klass2).to.be.ok();

			expect(constructor.called).to.be.ok();
			expect(b.baz).to.eql(2);

			b.bar();

			expect(method.called).to.be.ok();
		});

		it("supports static properties", function () {
			expect(Klass.bla).to.eql(1);
		});

		it("inherits parent static properties", function () {
			var Klass2 = Klass.extend({});

			expect(Klass2.bla).to.eql(1);
		});

		it("overrides parent static properties", function () {
			var Klass2 = Klass.extend({statics: {bla: 2}});

			expect(Klass2.bla).to.eql(2);
		});

		it("includes the given mixin", function () {
			var a = new Klass();
			expect(a.mixin).to.be.ok();
		});

		it("includes multiple mixins", function () {
			var Klass2 = L.Class.extend({
				includes: [{mixin: true}, {mixin2: true}]
			});
			var a = new Klass2();

			expect(a.mixin).to.be.ok();
			expect(a.mixin2).to.be.ok();
		});

		it("grants the ability to include the given mixin", function () {
			Klass.include({mixin2: true});

			var a = new Klass();
			expect(a.mixin2).to.be.ok();
		});

		it("merges options instead of replacing them", function () {
			var KlassWithOptions1 = L.Class.extend({
				options: {
					foo1: 1,
					foo2: 2
				}
			});
			var KlassWithOptions2 = KlassWithOptions1.extend({
				options: {
					foo2: 3,
					foo3: 4
				}
			});

			var a = new KlassWithOptions2();
			expect(a.options.foo1).to.eql(1);
			expect(a.options.foo2).to.eql(3);
			expect(a.options.foo3).to.eql(4);
		});

		it("gives new classes a distinct options object", function () {
			var K1 = L.Class.extend({options: {}});
			var K2 = K1.extend({});
			expect(K2.prototype.options).not.to.equal(K1.prototype.options);
		});

		it("inherits options prototypally", function () {
			var K1 = L.Class.extend({options: {}});
			var K2 = K1.extend({options: {}});
			K1.prototype.options.foo = 'bar';
			expect(K2.prototype.options.foo).to.eql('bar');
		});

		it("adds constructor hooks correctly", function () {
			var spy1 = sinon.spy();

			Klass.addInitHook(spy1);
			Klass.addInitHook('bar', 1, 2, 3);

			var a = new Klass();

			expect(spy1.called).to.be.ok();
			expect(method.calledWith(1, 2, 3));
		});

		it("inherits constructor hooks", function () {
			var spy1 = sinon.spy(),
			    spy2 = sinon.spy();

			var Klass2 = Klass.extend({});

			Klass.addInitHook(spy1);
			Klass2.addInitHook(spy2);

			var a = new Klass2();

			expect(spy1.called).to.be.ok();
			expect(spy2.called).to.be.ok();
		});

		it("does not call child constructor hooks", function () {
			var spy1 = sinon.spy(),
			    spy2 = sinon.spy();

			var Klass2 = Klass.extend({});

			Klass.addInitHook(spy1);
			Klass2.addInitHook(spy2);

			var a = new Klass();

			expect(spy1.called).to.be.ok();
			expect(spy2.called).to.eql(false);
		});

		it("calls parent constructor hooks when child has none", function () {
			var spy1 = sinon.spy();

			Klass.addInitHook(spy1);

			var Klass2 = Klass.extend({});
			var a = new Klass2();

			expect(spy1.called).to.be.ok();
		});
	});


	describe("#include", function () {
		var Klass;

		beforeEach(function () {
			Klass = L.Class.extend({});
		});

		it("returns the class with the extra methods", function () {

			var q = sinon.spy();

			var Qlass = Klass.include({quux: q});

			var a = new Klass();
			var b = new Qlass();

			a.quux();
			expect(q.called).to.be.ok();

			b.quux();
			expect(q.called).to.be.ok();
		});
	});

	// TODO Class.mergeOptions
});
