import {Util} from 'leaflet';

describe('Util', () => {
	describe('#extend', () => {
		let a;

		beforeEach(() => {
			a = {
				foo: 5,
				bar: 'asd'
			};
		});

		it('extends the first argument with the properties of the second', () => {
			Util.extend(a, {
				bar: 7,
				baz: 3
			});

			expect(a).to.eql({
				foo: 5,
				bar: 7,
				baz: 3
			});
		});

		it('accepts more than 2 arguments', () => {
			Util.extend(a, {bar: 7}, {baz: 3});

			expect(a).to.eql({
				foo: 5,
				bar: 7,
				baz: 3
			});
		});
	});

	describe('#stamp', () => {
		it('sets a unique id on the given object and returns it', () => {
			const a = {},
			    id = Util.stamp(a);

			expect(typeof id).to.eql('number');
			expect(Util.stamp(a)).to.eql(id);

			const b = {},
			    id2 = Util.stamp(b);

			expect(id2).not.to.eql(id);
		});
	});

	describe('#falseFn', () => {
		it('returns false', () => {
			expect(Util.falseFn()).to.be.false;
		});
	});

	describe('#formatNum', () => {
		it('formats numbers with a given precision', () => {
			expect(Util.formatNum(13.12325555, 3)).to.eql(13.123);
			expect(Util.formatNum(13.12325555)).to.eql(13.123256);
			expect(Util.formatNum(13.12325555, 0)).to.eql(13);
			expect(Util.formatNum(13.12325555, false)).to.eql(13.12325555);
			expect(isNaN(Util.formatNum(-7.993322e-10))).to.eql(false);
		});
	});


	describe('#getParamString', () => {
		it('creates a valid query string for appending depending on url input', () => {
			const a = {
				url: 'http://example.com/get',
				obj: {bar: 7, baz: 3},
				result: '?bar=7&baz=3'
			};

			expect(Util.getParamString(a.obj, a.url)).to.eql(a.result);

			const b = {
				url: 'http://example.com/get?justone=qs',
				obj: {bar: 7, baz: 3},
				result: '&bar=7&baz=3'
			};

			expect(Util.getParamString(b.obj, b.url)).to.eql(b.result);

			const c = {
				url: undefined,
				obj: {bar: 7, baz: 3},
				result: '?bar=7&baz=3'
			};

			expect(Util.getParamString(c.obj, c.url)).to.eql(c.result);
		});
	});

	describe('#requestAnimFrame', () => {
		it('calles a function on next frame, unless canceled', (done) => {
			const spy = sinon.spy(),
			    foo = {};

			Util.requestAnimFrame(spy);

			Util.requestAnimFrame(function () {
				expect(this).to.eql(foo);
				done();
			}, foo);

			Util.cancelAnimFrame(spy);
		});
	});

	describe('#throttle', () => {
		it('limits execution to not more often than specified time interval', (done) => {
			const spy = sinon.spy();

			const fn = Util.throttle(spy, 20);

			fn();
			fn();
			fn();

			expect(spy.callCount).to.eql(1);

			setTimeout(() => {
				expect(spy.callCount).to.eql(2);
				done();
			}, 30);
		});
	});

	describe('#splitWords', () => {
		it('splits words into an array', () => {
			expect(Util.splitWords('foo bar baz')).to.eql(['foo', 'bar', 'baz']);
		});
	});

	describe('#setOptions', () => {
		it('sets specified options on object', () => {
			const o = {};
			Util.setOptions(o, {foo: 'bar'});
			expect(o.options.foo).to.eql('bar');
		});

		it('returns options', () => {
			const o = {};
			const r = Util.setOptions(o, {foo: 'bar'});
			expect(r).to.equal(o.options);
		});

		it('accepts undefined', () => {
			const o = {};
			Util.setOptions(o, undefined);
			expect(o.options).to.eql({});
		});

		it('creates a distinct options object', () => {
			const opts = {},
			    o = Object.create({options: opts});
			Util.setOptions(o, {});
			expect(o.options).not.to.equal(opts);
		});

		it('doesn\'t create a distinct options object if object already has own options', () => {
			const opts = {},
			    o = {options: opts};
			Util.setOptions(o, {});
			expect(o.options).to.equal(opts);
		});

		it('inherits options prototypally', () => {
			const opts = {},
			    o = Object.create({options: opts});
			Util.setOptions(o, {});
			opts.foo = 'bar';
			expect(o.options.foo).to.eql('bar');
		});
	});

	describe('#template', () => {
		it('evaluates templates with a given data object', () => {
			const tpl = 'Hello {foo} and {bar}!';

			const str = Util.template(tpl, {
				foo: 'Vlad',
				bar: 'Dave'
			});

			expect(str).to.eql('Hello Vlad and Dave!');
		});

		it('does not modify text without a token variable', () => {
			expect(Util.template('foo', {})).to.eql('foo');
		});

		it('supports templates with double quotes', () => {
			expect(Util.template('He said: "{foo}"!', {
				foo: 'Hello'
			})).to.eql('He said: "Hello"!');
		});

		it('throws when a template token is not given', () => {
			expect(() => {
				Util.template(undefined, {foo: 'bar'});
			}).to.throw();
		});

		it('allows underscores, dashes and spaces in placeholders', () => {
			expect(Util.template('{nice_stuff}', {'nice_stuff': 'foo'})).to.eql('foo');
			expect(Util.template('{-y}', {'-y': 1})).to.eql('1');
			expect(Util.template('{Day Of Month}', {'Day Of Month': 30})).to.eql('30');
		});
	});
});
