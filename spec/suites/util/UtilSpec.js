describe('L.Util', function() {

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
});