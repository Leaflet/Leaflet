describe('Util', function() {

	describe('#extend', function() {
		var a;
		
		beforeEach(function() {
			a = {
				foo: 5,
				bar: 'asd'
			};
		});
		
		it('should extend the first argument with the properties of the second', function() {
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
		
		it('should work with more than 2 arguments', function() {
			L.Util.extend(a, {bar: 7}, {baz: 3});
			
			expect(a).toEqual({
				foo: 5,
				bar: 7,
				baz: 3
			});
		});
	});

	describe('#bind', function() {
		it('should return the given function with the given context', function() {
			var fn = function() {
				return this;
			};
			
			var fn2 = L.Util.bind(fn, 5);
			
			expect(fn2()).toEqual(5);
		});
	});
	
	describe('#stamp', function() {
		it('should set a unique id on the given object and return it', function() {
			var a = {},
				id = L.Util.stamp(a);
			
			expect(typeof id).toEqual('number');
			expect(L.Util.stamp(a)).toEqual(id);
			
			var b = {},
				id2 = L.Util.stamp(b);
			
			expect(id2).not.toEqual(id);
		});
	});


	describe('#getParamString', function() {
		it('should create a valid query string for appending depending on url input', function() {
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

	// TODO cancel/requestAnimFrame?

	// TODO limitExecByInterval

	// TODO formatNum

	// TODO splitWords

	// TODO setOptions

	// TODO template
});
