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

			expect(a).to.eql({
				foo: 5,
				bar: 7,
				baz: 3
			});
		});

		it('accepts more than 2 arguments', function() {
			L.Util.extend(a, {bar: 7}, {baz: 3});

			expect(a).to.eql({
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

			var fn2 = L.Util.bind(fn, { foo: 'bar' });

			expect(fn2()).to.eql({ foo: 'bar' });
		});

		it('passes additional arguments to the bound function', function () {
			var fn = sinon.spy(),
				foo = {},
				a = {},
				b = {};

			var fn2 = L.Util.bind(fn, foo, a, b);

			fn2();

			expect(fn.calledWith(a, b)).to.be.ok();
		});
	});

	describe('#stamp', function() {
		it('sets a unique id on the given object and returns it', function() {
			var a = {},
				id = L.Util.stamp(a);

			expect(typeof id).to.eql('number');
			expect(L.Util.stamp(a)).to.eql(id);

			var b = {},
				id2 = L.Util.stamp(b);

			expect(id2).not.to.eql(id);
		});
	});

	describe('#falseFn', function () {
		it('returns false', function () {
			expect(L.Util.falseFn()).to.be(false);
		});
	});

	describe('#formatNum', function () {
		it('formats numbers with a given precision', function () {
			expect(L.Util.formatNum(13.12325555, 3)).to.eql(13.123);
			expect(L.Util.formatNum(13.12325555)).to.eql(13.12326);
		});
	});


	describe('#getParamString', function() {
		it('creates a valid query string for appending depending on url input', function() {
			var a = {
				url: "http://example.com/get",
				obj: {bar: 7, baz: 3},
				result: "?bar=7&baz=3"
			};

			expect(L.Util.getParamString(a.obj,a.url)).to.eql(a.result);

			var b = {
				url: "http://example.com/get?justone=qs",
				obj: {bar: 7, baz: 3},
				result: "&bar=7&baz=3"
			};

			expect(L.Util.getParamString(b.obj,b.url)).to.eql(b.result);

			var c = {
				url: undefined,
				obj: {bar: 7, baz: 3},
				result: "?bar=7&baz=3"
			};

			expect(L.Util.getParamString(c.obj,c.url)).to.eql(c.result);
		});
	});

	describe('#requestAnimFrame', function () {
		it('calles a function on next frame, unless canceled', function (done) {
			var spy = sinon.spy(),
				spy2 = sinon.spy(),
				foo = {};

			L.Util.requestAnimFrame(spy);

			L.Util.requestAnimFrame(function () {
				expect(this).to.eql(foo);
				done();
			}, foo);

			L.Util.cancelAnimFrame(spy);
		});
	});

	describe('#limitExecByInterval', function() {
		it('limits execution to not more often than specified time interval', function (done) {
			var spy = sinon.spy();

			var fn = L.Util.limitExecByInterval(spy, 20);

			fn();
			fn();
			fn();

			expect(spy.callCount).to.eql(1);

			setTimeout(function () {
				expect(spy.callCount).to.eql(2);
				done();
			}, 30);
		});
	});

	describe('#splitWords', function () {
		it('splits words into an array', function () {
			expect(L.Util.splitWords('foo bar baz')).to.eql(['foo', 'bar', 'baz']);
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

			expect(str).to.eql('Hello Vlad and Dave!');
		});

		it('does not modify text without a token variable', function () {
			expect(L.Util.template('foo', {})).to.eql('foo');
		});

		it('throws when a template token is not given', function () {
			expect(function () {
				L.Util.template(tpl, {foo: 'bar'});
			}).to.throwError();
		});
	});
});
