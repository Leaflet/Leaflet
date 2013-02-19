describe("Class", function() {

	describe("#extend", function() {
		var Klass,
			constructor,
			method;

		beforeEach(function() {
			constructor = jasmine.createSpy("Klass constructor");
			method = jasmine.createSpy("Klass#bar method");

			Klass = L.Class.extend({
				statics: {bla: 1},
				includes: {mixin: true},

				initialize: constructor,
				foo: 5,
				bar: method
			});
		});

		it("creates a class with the given constructor & properties", function() {
			var a = new Klass();

			expect(constructor).toHaveBeenCalled();
			expect(a.foo).toEqual(5);

			a.bar();

			expect(method).toHaveBeenCalled();
		});

		it("inherits parent classes' constructor & properties", function() {
			var Klass2 = Klass.extend({baz: 2});

			var b = new Klass2();

			expect(b instanceof Klass).toBeTruthy();
			expect(b instanceof Klass2).toBeTruthy();

			expect(constructor).toHaveBeenCalled();
			expect(b.baz).toEqual(2);

			b.bar();

			expect(method).toHaveBeenCalled();
		});

		it("supports static properties", function() {
			expect(Klass.bla).toEqual(1);
		});

		it("inherits parent static properties", function() {
			var Klass2 = Klass.extend({});

			expect(Klass2.bla).toEqual(1);
		});

		it("overrides parent static properties", function() {
			var Klass2 = Klass.extend({statics: {bla: 2}});

			expect(Klass2.bla).toEqual(2);
		});

		it("includes the given mixin", function() {
			var a = new Klass();
			expect(a.mixin).toBeTruthy();
		});

		it("includes multiple mixins", function() {
			var Klass2 = L.Class.extend({
				includes: [{mixin: true}, {mixin2: true}]
			});
			var a = new Klass2();

			expect(a.mixin).toBeTruthy();
			expect(a.mixin2).toBeTruthy();
		});

		it("grants the ability to include the given mixin", function() {
			Klass.include({mixin2: true});

			var a = new Klass();
			expect(a.mixin2).toBeTruthy();
		});

		it("merges options instead of replacing them", function() {
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

			expect(a.options).toEqual({
				foo1: 1,
				foo2: 3,
				foo3: 4
			});
		});

		it("adds constructor hooks correctly", function () {
			var spy1 = jasmine.createSpy("init hook 1");

			Klass.addInitHook(spy1);
			Klass.addInitHook('bar', 1, 2, 3);

			var a = new Klass();

			expect(spy1).toHaveBeenCalled();
			expect(method).toHaveBeenCalledWith(1, 2, 3);
		});

		it("inherits constructor hooks", function () {
			var spy1 = jasmine.createSpy("init hook 1"),
				spy2 = jasmine.createSpy("init hook 2");

			var Klass2 = Klass.extend({});

			Klass.addInitHook(spy1);
			Klass2.addInitHook(spy2);

			var a = new Klass2();

			expect(spy1).toHaveBeenCalled();
			expect(spy2).toHaveBeenCalled();
		});

		it("does not call child constructor hooks", function () {
			var spy1 = jasmine.createSpy("init hook 1"),
				spy2 = jasmine.createSpy("init hook 2");

			var Klass2 = Klass.extend({});

			Klass.addInitHook(spy1);
			Klass2.addInitHook(spy2);

			var a = new Klass();

			expect(spy1).toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
		});
	});

	// TODO Class.include

	// TODO Class.mergeOptions
});
