describe('Options', function() {
	var Klass;
	
	beforeEach(function() {
		Klass = L.Class.extend({
			options: {
				foo1: 1,
				foo2: 2
			},
			
			includes: [L.Mixin.Options]
		});
	});
	
	describe('#setOptions', function() {
		it('should set the given options, overwriting the default ones', function() {
			var a = new Klass();
			
			expect(a.options).toEqual({foo1: 1, foo2: 2});
			
			a.setOptions({foo2: 3, foo3: 4});
			
			expect(a.options).toEqual({foo1: 1, foo2: 3, foo3: 4});
		});
		
		it('should fire optionschange event if Options module is availalbe', function() {
			Klass.include(L.Mixin.Events);
			var a = new Klass(),
				spy = jasmine.createSpy('optionschange handler');
			
			a.on('optionschange', spy);
			a.setOptions({foo1: 3});
			
			expect(spy).toHaveBeenCalled();
		});
	});
});