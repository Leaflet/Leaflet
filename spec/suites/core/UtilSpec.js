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
		it('should force an id on the given object (when second arg provided) and return it', function() {
			var a = {},
				fid = "f2",
				fid2 = "f3",
				fid3 = 0,
				id = L.Util.stamp(a,fid);
			
			expect(L.Util.stamp(a)).toEqual(id);
			expect(L.Util.stamp(a)).toEqual(fid);
			
			L.Util.stamp(a, fid2); // restamp
			
			expect(L.Util.stamp(a)).toEqual(fid2);

			L.Util.stamp(a, fid3); // allow zero as id
		
			expect(L.Util.stamp(a)).toEqual(fid3);


		});
	});

	// TODO cancel/requestAnimFrame?

	// TODO limitExecByInterval

	// TODO formatNum

	// TODO splitWords

	// TODO setOptions

	// TODO getParamString

	// TODO template
});
