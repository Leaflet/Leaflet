describe('Util', function() {

	describe('#extend', function() {
		var a;

		beforeEach(function() {
			a = {
				foo: 5,
				bar: 'asd'
			};
		});

		it('extends the first argument with the properties of the second', function() {
			L.Util.extend(a, {
				bar: 7,
				baz: 3
			});

			expect(a).toEqual({
				foo: 5,
				bar: 7,
				baz: 3
			});
		});

		it('accepts more than 2 arguments', function() {
			L.Util.extend(a, {bar: 7}, {baz: 3});

			expect(a).toEqual({
				foo: 5,
				bar: 7,
				baz: 3
			});
		});
	});

	describe('#bind', function() {
		it('returns the given function with the given context', function() {
			var fn = function() {
				return this;
			};

			var fn2 = L.Util.bind(fn, 5);

			expect(fn2()).toEqual(5);
		});

		it('passes additional arguments to the bound function', function () {
			var fn = jasmine.createSpy(),
				foo = {},
				a = {},
				b = {};

			var fn2 = L.Util.bind(fn, foo, a, b);

			fn2();

			expect(fn).toHaveBeenCalledWith(a, b);
		});
	});

	describe('#stamp', function() {
		it('sets a unique id on the given object and returns it', function() {
			var a = {},
				id = L.Util.stamp(a);

			expect(typeof id).toEqual('number');
			expect(L.Util.stamp(a)).toEqual(id);

			var b = {},
				id2 = L.Util.stamp(b);

			expect(id2).not.toEqual(id);
		});
	});

	describe('#falseFn', function () {
		it('returns false', function () {
			expect(L.Util.falseFn()).toBe(false);
		});
	});

	describe('#formatNum', function () {
		it('formats numbers with a given precision', function () {
			expect(L.Util.formatNum(13.12325555, 3)).toEqual(13.123);
			expect(L.Util.formatNum(13.12325555)).toEqual(13.12326);
		});
	});


	describe('#getParamString', function() {
		it('creates a valid query string for appending depending on url input', function() {
			var a = {
				url: "http://example.com/get",
				obj: {bar: 7, baz: 3},
				result: "?bar=7&baz=3"
			};

			expect(L.Util.getParamString(a.obj,a.url)).toEqual(a.result);

			var b = {
				url: "http://example.com/get?justone=qs",
				obj: {bar: 7, baz: 3},
				result: "&bar=7&baz=3"
			};

			expect(L.Util.getParamString(b.obj,b.url)).toEqual(b.result);

			var c = {
				url: undefined,
				obj: {bar: 7, baz: 3},
				result: "?bar=7&baz=3"
			};

			expect(L.Util.getParamString(c.obj,c.url)).toEqual(c.result);
		});
	});

	describe('#requestAnimFrame', function () {
		it('calles a function on next frame, unless canceled', function () {
			var spy = jasmine.createSpy(),
				spy2 = jasmine.createSpy(),
				called = false,
				foo = {};

			runs(function () {
				L.Util.requestAnimFrame(spy);

				L.Util.requestAnimFrame(function () {
					called = true;
					expect(this).toEqual(foo);
					spy();
				}, foo);

				L.Util.cancelAnimFrame(spy);
			});

			waitsFor(function () {
				return called;
			}, 'function should be called', 500);

			runs(function () {
				expect(spy).toHaveBeenCalled();
				expect(spy2).not.toHaveBeenCalled();
			});
		});
	});

	describe('#limitExecByInterval', function() {
		it('limits execution to not more often than specified time interval', function () {
			var spy = jasmine.createSpy(),
				check = false;

			var fn = L.Util.limitExecByInterval(spy, 20);

			runs(function () {
				fn();
				fn();
				fn();

				expect(spy.calls.length).toEqual(1);

				setTimeout(function () {
					check = true;
				}, 30);
			});

			waitsFor(function () {
				return check;
			});

			runs(function () {
				expect(spy.calls.length).toEqual(2);
			});
		});
	});

	describe('#splitWords', function () {
		it('splits words into an array', function () {
			expect(L.Util.splitWords('foo bar baz')).toEqual(['foo', 'bar', 'baz']);
		});
	});

	// TODO setOptions

	describe('#template', function () {
		it('evaluates templates with a given data object', function () {
			var tpl = 'Hello {foo} and {bar}!';

			var str = L.Util.template(tpl, {
				foo: 'Vlad',
				bar: 'Dave'
			});

			expect(str).toEqual('Hello Vlad and Dave!');
		});

		it('does not modify text without a token variable', function () {
			expect(L.Util.template('foo', {})).toEqual('foo');
		});

		it('throws when a template token is not given', function () {
			expect(function () {
				L.Util.template(tpl, {foo: 'bar'});
			}).toThrow();
		});
	});
});
